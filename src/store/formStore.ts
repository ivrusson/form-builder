import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { FormData } from '../types/form';

interface FormStore {
  forms: FormData[];
  currentForm: FormData | null;
  setCurrentForm: (form: FormData) => void;
  addForm: (form: FormData) => void;
  updateForm: (form: FormData) => void;
  deleteForm: (formId: string) => void;
  loadForm: (formId: string) => void;
}

export const useFormStore = create<FormStore>()(
  persist(
    (set, get) => ({
      forms: [],
      currentForm: null,
      setCurrentForm: (form) => set({ currentForm: form }),
      addForm: (form) => set((state) => ({ forms: [...state.forms, form] })),
      updateForm: (form) => {
        console.log('updateForm', form)
        const { forms } = get();
        const foundedForm = forms.find((f: FormData) => f.id === form.id);
        let updatedForms = forms;
        if (foundedForm) {
          updatedForms = updatedForms.map((f: FormData) => (f.id === form.id ? form : f));
        } else {
          updatedForms = [...updatedForms, form];
        }
        set({ forms: updatedForms });
        set({ currentForm: updatedForms.find((f: FormData) => f.id === form.id) || null });
      },
      deleteForm: (formId) => set((state) => ({
        forms: state.forms.filter((f) => f.id !== formId),
        currentForm: state.currentForm?.id === formId ? null : state.currentForm
      })),
      loadForm: (formId) => set((state) => ({
        currentForm: state.forms.find((f) => f.id === formId) || null
      }))
    }),
    {
      name: 'form-builder-storage',
      partialize: (state) => ({ forms: state.forms })
    }
  )
); 