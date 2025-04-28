import { Sidebar } from "./components/Sidebar";
import { FormBuilder } from "./components/FormBuilder";
import { useFormStore } from "./store/formStore";

function App() {
  const { currentForm } = useFormStore();

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 p-8">
        {currentForm ? (
          <FormBuilder />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <span>Select or create a form from the sidebar.</span>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
