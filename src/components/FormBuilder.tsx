import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card } from './ui/card';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Plus, GripVertical, Trash2, Save, Edit } from 'lucide-react';
import { FormData, Element, ElementType, Field, Header, Text, Quote } from '../types/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { FormPreview } from './FormPreview';
import { JsonEditor } from './JsonEditor';
import { ElementConfig } from './ElementConfig';
import { useFormStore } from '../store/formStore';
import { Toaster } from "sonner";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";

interface BlockBuilderProps {
  formData: FormData;
  onUpdate: (data: FormData) => void;
}

export function BlockBuilder({ formData, onUpdate }: BlockBuilderProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedElement, setSelectedElement] = useState<Element | null>(null);

  const handleAddStep = () => {
    const newStep = {
      id: `step-${Date.now()}`,
      title: `Step ${formData.steps.length + 1}`,
      description: '',
      layout: { columns: 1 },
      elements: []
    };
    onUpdate({
      ...formData,
      steps: [...formData.steps, newStep]
    });
    setCurrentStep(formData.steps.length); // Go to new step
  };

  const handleRemoveStep = (idx: number) => {
    if (window.confirm('This action cannot be undone. Are you sure?')) {
      if (formData.steps.length <= 1) return;
      const updatedSteps = formData.steps.filter((_, i) => i !== idx);
      onUpdate({ ...formData, steps: updatedSteps });
      setCurrentStep(Math.max(0, idx - 1));
    }
  };

  const handleAddElement = (type: ElementType) => {
    let newElement: Element;
    if (type === 'field') {
      newElement = {
        type: 'field',
        id: `element-${Date.now()}`,
        label: 'New Field',
        fieldType: 'text',
        validation: { required: false }
      } as Field;
    } else {
      newElement = {
        type,
        id: `element-${Date.now()}`,
        text: 'New Text'
      } as Header | Text | Quote;
    }
    const updatedSteps = [...formData.steps];
    updatedSteps[currentStep].elements.push(newElement);
    onUpdate({ ...formData, steps: updatedSteps });
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const updatedSteps = [...formData.steps];
    const [removed] = updatedSteps[currentStep].elements.splice(result.source.index, 1);
    updatedSteps[currentStep].elements.splice(result.destination.index, 0, removed);
    onUpdate({ ...formData, steps: updatedSteps });
  };

  const handleElementUpdate = (updatedElement: Element) => {
    const updatedSteps = [...formData.steps];
    const elementIndex = updatedSteps[currentStep].elements.findIndex(el => el.id === updatedElement.id);
    if (elementIndex !== -1) {
      updatedSteps[currentStep].elements[elementIndex] = updatedElement;
      onUpdate({ ...formData, steps: updatedSteps });
    }
  };

  return (
    <div className="space-y-4">
      {/* Step Navigation Bar */}
      <div className="flex gap-2 mb-4 items-center">
        {formData.steps.map((step, idx) => (
          <Button
            key={step.id}
            variant={currentStep === idx ? "default" : "outline"}
            onClick={() => setCurrentStep(idx)}
            className="relative"
          >
            {step.title || `Step ${idx + 1}`}
            {formData.steps.length > 1 && (
              <span
                className="absolute -top-2 -right-2 text-xs text-destructive cursor-pointer"
                onClick={e => {
                  e.stopPropagation();
                  handleRemoveStep(idx);
                }}
                title="Remove step"
              >
                ×
              </span>
            )}
          </Button>
        ))}
        <Button onClick={handleAddStep} variant="ghost">+ Add Step</Button>
      </div>

      <div className="flex items-center gap-4">
        <Input
          placeholder="Form Title"
          value={formData.title}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onUpdate({ ...formData, title: e.target.value })}
        />
      </div>

      <div className="flex gap-4">
        <div className="w-1/4">
          <Card className="p-4">
            <h3 className="font-semibold mb-2">Available Blocks</h3>
            <div className="space-y-2">
              <Button variant="outline" onClick={() => handleAddElement('field')}>Add Field</Button>
              <Button variant="outline" onClick={() => handleAddElement('header')}>Add Header</Button>
              <Button variant="outline" onClick={() => handleAddElement('text')}>Add Text</Button>
              <Button variant="outline" onClick={() => handleAddElement('quote')}>Add Quote</Button>
            </div>
          </Card>
        </div>

        <div className="w-3/4">
          <Card className="p-4">
            <h3 className="font-semibold mb-2">Form Structure</h3>
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="elements">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef}>
                    {formData.steps[currentStep]?.elements.map((element, index) => (
                      <Draggable key={element.id} draggableId={element.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`flex items-center gap-2 p-2 border rounded mb-2 cursor-pointer ${
                              selectedElement?.id === element.id ? 'border-primary' : ''
                            }`}
                            onClick={() => setSelectedElement(element)}
                          >
                            <div {...provided.dragHandleProps}>
                              <GripVertical className="h-4 w-4" />
                            </div>
                            <div className="flex-1">
                              {element.type === 'field' ? (
                                <Input 
                                  value={(element as Field).label} 
                                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    const updatedSteps = [...formData.steps];
                                    (updatedSteps[currentStep].elements[index] as Field).label = e.target.value;
                                    onUpdate({ ...formData, steps: updatedSteps });
                                  }} 
                                />
                              ) : (
                                <Textarea 
                                  value={(element as Header | Text | Quote).text} 
                                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                                    const updatedSteps = [...formData.steps];
                                    (updatedSteps[currentStep].elements[index] as Header | Text | Quote).text = e.target.value;
                                    onUpdate({ ...formData, steps: updatedSteps });
                                  }} 
                                />
                              )}
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                const updatedSteps = [...formData.steps];
                                updatedSteps[currentStep].elements.splice(index, 1);
                                onUpdate({ ...formData, steps: updatedSteps });
                                if (selectedElement?.id === element.id) {
                                  setSelectedElement(null);
                                }
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </Card>
        </div>
      </div>

      {selectedElement && (
        <div className="mt-4">
          <ElementConfig element={selectedElement} onUpdate={handleElementUpdate} />
        </div>
      )}
    </div>
  );
}

export function FormBuilder() {
  const { currentForm, setCurrentForm, addForm, updateForm, deleteForm, loadForm, forms } = useFormStore();
  const [formData, setFormData] = useState<FormData>(currentForm || {
    id: `form-${Date.now()}`,
    title: '',
    description: '',
    steps: [
      {
        id: `step-1`,
        title: 'Step 1',
        description: '',
        layout: { columns: 1 },
        elements: []
      }
    ]
  });

  const handleFormUpdate = (newData: FormData) => {
    setFormData(newData);
    if (currentForm) {
      updateForm(newData);
    }
  };

  const handleSave = () => {
    if (!forms.some(f => f.id === formData.id)) {
      addForm(formData);
      setCurrentForm(formData);
      toast.success("Form created!");
    } else {
      updateForm(formData);
      toast.success("Form updated!");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Form Builder</h1>
        <Button onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          Save Form
        </Button>
      </div>

      <Tabs defaultValue="builder" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="builder">Form Builder</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="json">JSON</TabsTrigger>
        </TabsList>
        
        <TabsContent value="builder">
          <Card className="p-4">
            <BlockBuilder formData={formData} onUpdate={handleFormUpdate} />
          </Card>
        </TabsContent>
        
        <TabsContent value="preview">
          <Card className="p-4">
            <FormPreview formData={formData} />
          </Card>
        </TabsContent>
        
        <TabsContent value="json">
          <Card className="p-4">
            <JsonEditor formData={formData} onUpdate={handleFormUpdate} />
          </Card>
        </TabsContent>
      </Tabs>

      <Toaster richColors position="top-right" />
    </div>
  );
} 