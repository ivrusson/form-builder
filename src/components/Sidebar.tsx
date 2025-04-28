import { useFormStore } from "../store/formStore";
import { Button } from "./ui/button";
import { Trash2, Edit, Plus } from "lucide-react";
import { cn } from "../lib/utils";
import { useEffect } from "react";

export function Sidebar() {
  const { forms, loadForm, deleteForm, setCurrentForm, currentForm } = useFormStore();

  useEffect(() => {
    console.log('forms', forms)
  }, [forms]);

  return (
    <aside className="h-screen w-72 bg-muted border-r flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <span className="font-bold text-lg">Forms</span>
        <Button
          size="sm"
          onClick={() =>
            setCurrentForm({
              id: `form-${Date.now()}`,
              title: "",
              description: "",
              steps: [],
            })
          }
        >
          <Plus className="h-4 w-4 mr-1" />
          New
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {forms.length === 0 && (
          <div className="p-4 text-muted-foreground">No forms yet.</div>
        )}
        <ul>
          {forms.map((form) => (
            <li
              key={form.id}
              className={cn(
                "flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-accent",
                currentForm?.id === form.id && "bg-accent"
              )}
              onClick={() => loadForm(form.id)}
            >
              <span className="truncate">{form.title || "Untitled"}</span>
              <div className="flex gap-1">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    loadForm(form.id);
                  }}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteForm(form.id);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
} 