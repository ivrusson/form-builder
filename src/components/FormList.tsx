import { Card } from './ui/card';
import { Button } from './ui/button';
import { Trash2, Edit } from 'lucide-react';
import { useFormStore } from '../store/formStore';

export function FormList() {
  const { forms, loadForm, deleteForm } = useFormStore();

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Saved Forms</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {forms.map((form) => (
          <Card key={form.id} className="p-4">
            <h3 className="font-semibold mb-2">{form.title}</h3>
            <p className="text-sm text-gray-500 mb-4">{form.description}</p>
            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                onClick={() => loadForm(form.id)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteForm(form.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
} 