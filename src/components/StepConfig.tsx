import { useState } from 'react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { Step, VisibilityCondition } from '../types/form';

interface StepConfigProps {
  step: Step;
  onUpdate: (updatedStep: Step) => void;
  availableSteps: Step[];
}

export function StepConfig({ step, onUpdate, availableSteps }: StepConfigProps) {
  const [nextStepCondition, setNextStepCondition] = useState(step.nextStepCondition || []);
  const [visibilityCondition, setVisibilityCondition] = useState<VisibilityCondition | undefined>(step.visibilityCondition);

  const handleNextStepConditionChange = (index: number, field: string, value: any) => {
    const newConditions = [...nextStepCondition];
    newConditions[index] = { ...newConditions[index], [field]: value };
    setNextStepCondition(newConditions);
    onUpdate({
      ...step,
      nextStepCondition: newConditions
    });
  };

  const handleVisibilityConditionChange = (field: string, value: any) => {
    const newCondition = { ...visibilityCondition, [field]: value };
    setVisibilityCondition(newCondition);
    onUpdate({
      ...step,
      visibilityCondition: newCondition
    });
  };

  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-4">Step Configuration</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <Input
            value={step.title}
            onChange={(e) => onUpdate({ ...step, title: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <Input
            value={step.description || ''}
            onChange={(e) => onUpdate({ ...step, description: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Columns</label>
          <Input
            type="number"
            min="1"
            max="12"
            value={step.layout.columns}
            onChange={(e) => onUpdate({
              ...step,
              layout: { ...step.layout, columns: parseInt(e.target.value) }
            })}
          />
        </div>

        <div className="space-y-2">
          <h3 className="font-medium">Next Step Conditions</h3>
          {nextStepCondition.map((condition, index) => (
            <div key={index} className="flex gap-2 items-start">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">Field</label>
                <Select
                  value={condition.fieldId}
                  onValueChange={(value) => handleNextStepConditionChange(index, 'fieldId', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select field" />
                  </SelectTrigger>
                  <SelectContent>
                    {step.elements
                      .filter(el => el.type === 'field')
                      .map(field => (
                        <SelectItem key={field.id} value={field.id}>
                          {(field as any).label}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">Comparison</label>
                <Select
                  value={condition.comparison}
                  onValueChange={(value) => handleNextStepConditionChange(index, 'comparison', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select comparison" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="equals">Equals</SelectItem>
                    <SelectItem value="notEquals">Not Equals</SelectItem>
                    <SelectItem value="greaterThan">Greater Than</SelectItem>
                    <SelectItem value="lessThan">Less Than</SelectItem>
                    <SelectItem value="includes">Includes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">Value</label>
                <Input
                  value={condition.value}
                  onChange={(e) => handleNextStepConditionChange(index, 'value', e.target.value)}
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">Go To Step</label>
                <Select
                  value={condition.goToStep}
                  onValueChange={(value) => handleNextStepConditionChange(index, 'goToStep', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select step" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableSteps
                      .filter(s => s.id !== step.id)
                      .map(s => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.title}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  const newConditions = nextStepCondition.filter((_, i) => i !== index);
                  setNextStepCondition(newConditions);
                  onUpdate({
                    ...step,
                    nextStepCondition: newConditions
                  });
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            variant="outline"
            onClick={() => {
              const newConditions = [...nextStepCondition, {
                fieldId: '',
                comparison: 'equals',
                value: '',
                goToStep: ''
              }];
              setNextStepCondition(newConditions);
              onUpdate({
                ...step,
                nextStepCondition: newConditions
              });
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Condition
          </Button>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Default Next Step</label>
          <Select
            value={step.defaultNextStep}
            onValueChange={(value) => onUpdate({ ...step, defaultNextStep: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select default next step" />
            </SelectTrigger>
            <SelectContent>
              {availableSteps
                .filter(s => s.id !== step.id)
                .map(s => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.title}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </Card>
  );
} 