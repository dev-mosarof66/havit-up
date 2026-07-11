'use client';
import React, { useState, useEffect } from 'react';
import PageHeader from '@/components/PageHeader';
import HabitTable, { HabitData, HabitTableSkeleton } from '@/components/HabitTable';
import InactiveHabits, { InactiveHabitsSkeleton } from '@/components/InactiveHabits';
import NewHabitModal from '@/components/NewHabitModal';
import { createHabit, getHabits, updateHabit, deleteHabit, toggleHabitLog } from '@/app/actions/habitActions';
import { Snackbar, Alert } from '@mui/material';
import ConfirmDialog from '@/components/ConfirmDialog';

export default function HabitsPage() {
  const [habits, setHabits] = useState<HabitData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<HabitData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorToast, setErrorToast] = useState<{ open: boolean; message: string }>({ open: false, message: '' });
  const [habitToArchive, setHabitToArchive] = useState<HabitData | null>(null);
  const [habitToDelete, setHabitToDelete] = useState<HabitData | null>(null);

  const activeHabits = habits.filter(h => h.status !== 'inactive');
  const inactiveHabitsList = habits.filter(h => h.status === 'inactive');

  // Fetch real habits from MongoDB on page load
  useEffect(() => {
    async function fetchHabits() {
      const response = await getHabits();
      if (response.success && response.habits) {
        setHabits(response.habits);
      }
      setIsLoading(false);
    }
    fetchHabits();
  }, []);

  const toggleDay = async (habitId: string | number, dayIndex: number) => {
    // Optimistic UI update
    setHabits(prev => prev.map(habit => {
      if (habit.id === habitId) {
        const newHistory = [...habit.history];
        newHistory[dayIndex] = !newHistory[dayIndex];
        return { ...habit, history: newHistory };
      }
      return habit;
    }));

    try {
      const response = await toggleHabitLog(habitId, dayIndex);
      if (!response.success) {
        // Revert on failure
        setHabits(prev => prev.map(habit => {
          if (habit.id === habitId) {
            const newHistory = [...habit.history];
            newHistory[dayIndex] = !newHistory[dayIndex];
            return { ...habit, history: newHistory };
          }
          return habit;
        }));
        setErrorToast({ open: true, message: response.error || "Failed to save progress" });
      }
    } catch (error) {
      console.error("Error saving progress:", error);
      // Revert on failure
      setHabits(prev => prev.map(habit => {
        if (habit.id === habitId) {
          const newHistory = [...habit.history];
          newHistory[dayIndex] = !newHistory[dayIndex];
          return { ...habit, history: newHistory };
        }
        return habit;
      }));
      setErrorToast({ open: true, message: "Network error while saving progress" });
    }
  };

  const handleSaveHabit = async (habitData: any) => {
    try {
      let response;
      
      if (editingHabit) {
        response = await updateHabit(editingHabit.id, habitData);
      } else {
        response = await createHabit(habitData);
      }
      
      if (response.success && response.habit) {
        const now = new Date();
        const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();

        const updatedHabit: HabitData = {
          id: response.habit.id,
          name: response.habit.name,
          description: response.habit.description,
          frequency: response.habit.frequency,
          daysOfWeek: response.habit.daysOfWeek,
          time: response.habit.time,
          status: response.habit.status,
          category: editingHabit?.category,
          history: Array(daysInMonth).fill(false)
        };

        setHabits(prev => {
          if (editingHabit) {
            return prev.map(h => h.id === updatedHabit.id ? { ...h, ...updatedHabit, history: h.history } : h);
          } else {
            return [...prev, updatedHabit];
          }
        });
        
        setIsModalOpen(false);
        setEditingHabit(null);
      } else {
        setErrorToast({ open: true, message: response.error || "Failed to save habit" });
      }
    } catch (error) {
      console.error("Error saving habit:", error);
      setErrorToast({ open: true, message: "An unexpected error occurred" });
    }
  };

  const openNewHabitModal = () => {
    setEditingHabit(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (habitId: string | number) => {
    const habitToEdit = habits.find(h => h.id === habitId);
    if (habitToEdit) {
      setEditingHabit(habitToEdit);
      setIsModalOpen(true);
    }
  };

  const handleArchiveClick = (habitId: string | number) => {
    const habitToArchive = habits.find(h => h.id === habitId);
    if (habitToArchive) {
      setHabitToArchive(habitToArchive);
    }
  };

  const handleArchiveConfirm = async () => {
    if (!habitToArchive) return;
    try {
      const response = await updateHabit(habitToArchive.id, {
        name: habitToArchive.name,
        description: habitToArchive.description,
        frequency: habitToArchive.frequency as any || 'daily',
        daysOfWeek: habitToArchive.daysOfWeek || [],
        time: habitToArchive.time,
        status: 'inactive'
      });
      if (response.success && response.habit) {
        setHabits(prev => prev.map(h => h.id === habitToArchive.id ? { ...h, status: 'inactive' } : h));
        setHabitToArchive(null);
      } else {
        setErrorToast({ open: true, message: response.error || "Failed to archive habit" });
      }
    } catch (error) {
      console.error("Error archiving habit:", error);
      setErrorToast({ open: true, message: "An unexpected error occurred" });
    }
  };

  const handleReactivate = async (habitId: string | number) => {
    const habitToReactivate = habits.find(h => h.id === habitId);
    if (!habitToReactivate) return;
    try {
      const response = await updateHabit(habitToReactivate.id, {
        name: habitToReactivate.name,
        description: habitToReactivate.description,
        frequency: habitToReactivate.frequency as any || 'daily',
        daysOfWeek: habitToReactivate.daysOfWeek || [],
        time: habitToReactivate.time,
        status: 'active'
      });
      if (response.success && response.habit) {
        setHabits(prev => prev.map(h => h.id === habitToReactivate.id ? { ...h, status: 'active' } : h));
      } else {
        setErrorToast({ open: true, message: response.error || "Failed to reactivate habit" });
      }
    } catch (error) {
      console.error("Error reactivating habit:", error);
      setErrorToast({ open: true, message: "An unexpected error occurred" });
    }
  };

  const handleDeleteClick = (habitId: string | number) => {
    const habitToDel = habits.find(h => h.id === habitId);
    if (habitToDel) {
      setHabitToDelete(habitToDel);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!habitToDelete) return;
    try {
      const response = await deleteHabit(habitToDelete.id);
      if (response.success) {
        setHabits(prev => prev.filter(h => h.id !== habitToDelete.id));
        setHabitToDelete(null);
      } else {
        setErrorToast({ open: true, message: response.error || "Failed to delete habit" });
      }
    } catch (error) {
      console.error("Error deleting habit:", error);
      setErrorToast({ open: true, message: "An unexpected error occurred" });
    }
  };

  return (
    <div className="p-8 w-full min-h-screen relative flex flex-col gap-6 overflow-hidden">
      <PageHeader
        title="My Habits"
        subtitle="Manage and log your daily routines."
        action={
          <button
            onClick={openNewHabitModal}
            className="px-4 py-2 text-sm font-medium bg-foreground text-background hover:bg-foreground/90 rounded-md transition-colors shadow-md"
          >
            + New Habit
          </button>
        }
      />

      {/* Active Habits */}
      <div className='w-full flex flex-col gap-2'>
        <div className="flex items-center justify-between">
          <h1 className='text-base font-bold text-foreground'>Active Habits</h1>
          <div className="flex items-center gap-3">
            {Array.from(
              new Map(
                activeHabits
                  .filter(h => h.category)
                  .map(h => [h.category?.id, h.category])
              ).values()
            ).map(cat => cat ? (
              <div key={cat.id} className="flex items-center gap-1.5 px-2 py-0.5">
                <div className="size-3 rounded-full" style={{ backgroundColor: cat.color }} />
                <span className="text-[12px] font-medium">{cat.name}</span>
              </div>
            ) : null)}
          </div>
        </div>
        {/* Loading State or Notion-style Table View */}
        {isLoading ? (
          <HabitTableSkeleton />
        ) : activeHabits.length === 0 ? (
          <div className="flex flex-col items-center justify-center w-full h-48 border border-dashed border-[#27272a] rounded-lg">
            <p className="text-gray-500 mb-4">No habits created yet.</p>
            <button
              onClick={openNewHabitModal}
              className="px-4 py-2 text-sm font-medium bg-white text-black hover:bg-gray-200 rounded-md transition-colors"
            >
              Create your first habit
            </button>
          </div>
        ) : (
          <HabitTable habits={activeHabits} onToggleDay={toggleDay} onEdit={handleEditClick} onArchive={handleArchiveClick} />
        )}
      </div>


      {/* Inactive Habits */}
      <div className='w-full flex flex-col gap-4 mt-8'>
        <h1 className='text-base font-bold text-foreground'>Inactive Habits</h1>
        {isLoading ? (
          <InactiveHabitsSkeleton />
        ) : (
          <InactiveHabits 
            habits={inactiveHabitsList} 
            onReactivate={handleReactivate} 
            onDelete={handleDeleteClick}
          />
        )}
      </div>

      {/* New/Edit Habit Modal */}
      <NewHabitModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingHabit(null);
        }}
        onSave={handleSaveHabit}
        initialData={editingHabit}
      />

      {/* Error Toast */}
      <Snackbar
        open={errorToast.open}
        autoHideDuration={6000}
        onClose={() => setErrorToast({ ...errorToast, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setErrorToast({ ...errorToast, open: false })} severity="error" sx={{ width: '100%' }}>
          {errorToast.message}
        </Alert>
      </Snackbar>

      {/* Archive Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!habitToArchive}
        onClose={() => setHabitToArchive(null)}
        onConfirm={handleArchiveConfirm}
        title="Make Habit Inactive?"
        description={`Are you sure you want to make "${habitToArchive?.name}" inactive? It will be moved to the Inactive Habits list and you won't be able to track it daily until reactivated.`}
        confirmText="Make Inactive"
        cancelText="Cancel"
        confirmColor="red"
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!habitToDelete}
        onClose={() => setHabitToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Habit Permanently?"
        description={`Are you sure you want to permanently delete "${habitToDelete?.name}"? This action cannot be undone and all history will be lost.`}
        confirmText="Delete Permanently"
        cancelText="Cancel"
        confirmColor="red"
      />
    </div>
  );
}
