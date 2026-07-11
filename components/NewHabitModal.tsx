import React, { useState } from 'react';
import { Snackbar, Alert } from '@mui/material';

interface NewHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (habit: { name: string; description?: string; time: string; frequency: 'daily'|'weekly'|'custom'; daysOfWeek: number[]; categoryId: string }) => void;
  initialData?: {
    name: string;
    description?: string;
    time?: string;
    frequency?: string;
    daysOfWeek?: number[];
    category?: { id: string };
  } | null;
}

const DAYS_OF_WEEK = [
  { label: 'Sun', value: 0 },
  { label: 'Mon', value: 1 },
  { label: 'Tue', value: 2 },
  { label: 'Wed', value: 3 },
  { label: 'Thu', value: 4 },
  { label: 'Fri', value: 5 },
  { label: 'Sat', value: 6 },
];

import { getCategories } from '@/app/actions/habitActions';
import NewCategoryModal from './NewCategoryModal';

export default function NewHabitModal({ isOpen, onClose, onSave, initialData }: NewHabitModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [time, setTime] = useState('');
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'custom'>('daily');
  const [daysOfWeek, setDaysOfWeek] = useState<number[]>([]);
  const [categoryId, setCategoryId] = useState<string>('');
  const [categories, setCategories] = useState<{ id: string, name: string }[]>([]);
  const [errorToast, setErrorToast] = useState<{ open: boolean; message: string }>({ open: false, message: '' });
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  React.useEffect(() => {
    async function fetchCategories() {
      const res = await getCategories();
      if (res.success && res.categories) {
        setCategories(res.categories);
      }
    }
    fetchCategories();
  }, []);

  React.useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setName(initialData.name);
        setDescription(initialData.description || '');
        setTime(initialData.time || '');
        setFrequency((initialData.frequency as any) || 'daily');
        setDaysOfWeek(initialData.daysOfWeek || []);
        setCategoryId(initialData.category?.id || '');
      } else {
        setName('');
        setDescription('');
        setTime('');
        setFrequency('daily');
        setDaysOfWeek([]);
        setCategoryId('');
      }
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const toggleDay = (dayValue: number) => {
    setDaysOfWeek(prev =>
      prev.includes(dayValue)
        ? prev.filter(d => d !== dayValue)
        : [...prev, dayValue].sort()
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorToast({ open: true, message: "Habit name is required" });
      return;
    }
    if (!time || !time.trim()) {
      setErrorToast({ open: true, message: "Time is required" });
      return;
    }

    if (!categoryId || !categoryId.trim()) {
      setErrorToast({ open: true, message: "Category is required" });
      return;
    }

    onSave({
      name: name.trim(),
      description: description.trim() || undefined,
      time: time,
      frequency,
      daysOfWeek: frequency === 'daily' ? [0, 1, 2, 3, 4, 5, 6] : daysOfWeek,
      categoryId: categoryId
    });

    // Reset form
    setName('');
    setDescription('');
    setTime('');
    setFrequency('daily');
    setDaysOfWeek([]);
    setCategoryId('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-6 w-full max-w-md shadow-2xl">
        <h2 className="text-xl font-bold font-stack text-foreground">
          {initialData ? 'Edit Habit' : 'Create New Habit'}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Name Field */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Habit Name <span className='text-red-500'>*</span></label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Drink 2L of water"
              autoFocus
              required
              className="w-full bg-[#121212] border border-[#27272a] rounded-md px-3 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-white transition-colors"
            />
          </div>

          {/* Category Field */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Category</label>
            <div className="flex gap-2">
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="flex-1 bg-[#121212] border border-[#27272a] rounded-md px-3 py-2 text-white focus:outline-none focus:border-white transition-colors"
                required
              >
                <option value="" disabled>Select a Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setIsCategoryModalOpen(true)}
                className="px-3 py-2 bg-[#27272a] hover:bg-[#3f3f46] text-white rounded-md transition-colors text-sm font-medium whitespace-nowrap"
              >
                + New
              </button>
            </div>
          </div>

          {/* Description Field */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Description </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Why are you building this habit?"
              rows={2}
              className="w-full bg-[#121212] border border-[#27272a] rounded-md px-3 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-white transition-colors resize-none"
            />
          </div>

          {/* Time Field */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Time <span className='text-red-500'>*</span></label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full bg-[#121212] border border-[#27272a] rounded-md px-3 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-white transition-colors"
            />
          </div>

          {/* Frequency Field */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-2">Frequency</label>
            <div className="flex gap-2">
              {(['daily', 'weekly', 'custom'] as const).map((freq) => (
                <button
                  key={freq}
                  type="button"
                  onClick={() => setFrequency(freq)}
                  className={`flex-1 py-1.5 text-xs font-medium rounded-md capitalize transition-colors border ${frequency === freq
                      ? 'bg-white text-black border-white'
                      : 'bg-[#121212] text-gray-400 border-[#27272a] hover:border-gray-500'
                    }`}
                >
                  {freq}
                </button>
              ))}
            </div>
          </div>

          {/* Days of Week (Only show if Custom) */}
          {frequency === 'custom' && (
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-2">Select Days</label>
              <div className="flex justify-between gap-1">
                {DAYS_OF_WEEK.map((day) => {
                  const isSelected = daysOfWeek.includes(day.value);
                  return (
                    <button
                      key={day.value}
                      type="button"
                      onClick={() => toggleDay(day.value)}
                      className={`w-10 h-10 rounded-md text-xs font-medium transition-colors border flex items-center justify-center ${isSelected
                          ? 'bg-white text-black border-white'
                          : 'bg-[#121212] text-gray-400 border-[#27272a] hover:border-gray-500'
                        }`}
                    >
                      {day.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t border-[#27272a]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-foreground hover:bg-[#27272a] rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium bg-foreground text-background hover:bg-foreground/90 rounded-md transition-colors"
            >
              {initialData ? 'Save Changes' : 'Create Habit'}
            </button>
          </div>
        </form>
      </div>

      <Snackbar 
        open={errorToast.open} 
        autoHideDuration={4000} 
        onClose={() => setErrorToast({ ...errorToast, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setErrorToast({ ...errorToast, open: false })} severity="error" sx={{ width: '100%' }}>
          {errorToast.message}
        </Alert>
      </Snackbar>

      <NewCategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onCategoryCreated={(newCat) => {
          setCategories(prev => [...prev, newCat].sort((a, b) => a.name.localeCompare(b.name)));
          setCategoryId(newCat.id);
        }}
      />
    </div>
  );
}
