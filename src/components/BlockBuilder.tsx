import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card } from './ui/card';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Plus, GripVertical, Trash2 } from 'lucide-react';

interface BlockBuilderProps {
  formData: any;
  onUpdate: (data: any) => void;
}

export function BlockBuilder({ formData, onUpdate }: BlockBuilderProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const handleAddStep = () => {
    const newStep = {
      id: `step-${Date.now()}`,
      title: 'New Step',
      description: '',
      layout: { columns: 1 },
      elements: []
    };
    
    onUpdate({
      ...formData,
      steps: [...formData.steps, newStep]
    });
  };

  const handleAddElement = (type: string) => {
    const newElement = {
      type,
      id: `element-${Date.now()}`,
      ...(type === 'field' ? {
        label: 'New Field',
        fieldType: 'text',
        validation: { required: false }
      } : {
        text: 'New Text'
      })
    };

    const updatedSteps = [...formData.steps];
    updatedSteps[currentStep].elements.push(newElement);
    
    onUpdate({
      ...formData,
      steps: updatedSteps
    });
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const updatedSteps = [...formData.steps];
    const [removed] = updatedSteps[currentStep].elements.splice(result.source.index, 1);
    updatedSteps[currentStep].elements.splice(result.destination.index, 0, removed);

    onUpdate({
      ...formData,
      steps: updatedSteps
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Input
          placeholder="Form Title"
          value={formData.title}
          onChange={(e) => onUpdate({ ...formData, title: e.target.value })}
        />
        <Button onClick={handleAddStep}>Add Step</Button>
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
                    {formData.steps[currentStep]?.elements.map((element: any, index: number) => (
                      <Draggable key={element.id} draggableId={element.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className="flex items-center gap-2 p-2 border rounded mb-2"
                          >
                            <div {...provided.dragHandleProps}>
                              <GripVertical className="h-4 w-4" />
                            </div>
                            <div className="flex-1">
                              {element.type === 'field' ? (
                                <Input value={element.label} onChange={(e) => {
                                  const updatedSteps = [...formData.steps];
                                  updatedSteps[currentStep].elements[index].label = e.target.value;
                                  onUpdate({ ...formData, steps: updatedSteps });
                                }} />
                              ) : (
                                <Textarea value={element.text} onChange={(e) => {
                                  const updatedSteps = [...formData.steps];
                                  updatedSteps[currentStep].elements[index].text = e.target.value;
                                  onUpdate({ ...formData, steps: updatedSteps });
                                }} />
                              )}
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                const updatedSteps = [...formData.steps];
                                updatedSteps[currentStep].elements.splice(index, 1);
                                onUpdate({ ...formData, steps: updatedSteps });
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
    </div>
  );
} 