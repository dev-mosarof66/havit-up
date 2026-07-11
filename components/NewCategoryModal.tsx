import React, { useState } from 'react';
import { Snackbar, Alert } from '@mui/material';
import { createCategory } from '@/app/actions/habitActions';

interface NewCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCategoryCreated: (category: { id: string; name: string; color: string }) => void;
}

export default function NewCategoryModal({ isOpen, onClose, onCategoryCreated }: NewCategoryModalProps) {
  const [name, setName] = useState('');
  const [color, setColor] = useState('#9ca3af');
  const [isSaving, setIsSaving] = useState(false);
  const [errorToast, setErrorToast] = useState<{ open: boolean; message: string }>({ open: false, message: '' });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorToast({ open: true, message: "Category name is required" });
      return;
    }

    setIsSaving(true);
    const res = await createCategory(name.trim(), color);
    if (res.success && res.category) {
      onCategoryCreated(res.category);
      setName('');
      setColor('#9ca3af');
      onClose();
    } else {
      setErrorToast({ open: true, message: res.error || "Failed to create category" });
    }
    setIsSaving(false);
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-6 w-full max-w-sm shadow-2xl">
        <h2 className="text-xl font-bold font-stack text-foreground mb-5">
          Create New Category
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Name Field */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Name <span className='text-red-500'>*</span></label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Health, Work, Study"
              autoFocus
              required
              className="w-full bg-[#121212] border border-[#27272a] rounded-md px-3 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-white transition-colors"
            />
          </div>

          {/* Color Field */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-10 h-10 rounded cursor-pointer bg-transparent border-0 p-0"
              />
              <span className="text-sm text-gray-400">{color}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t border-[#27272a]">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2 text-sm font-medium text-foreground hover:bg-[#27272a] rounded-md transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 text-sm font-medium bg-foreground text-background hover:bg-foreground/90 rounded-md transition-colors disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Create'}
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
    </div>
  );
}
