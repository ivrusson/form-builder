import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card } from './ui/card';
import { Checkbox } from './ui/checkbox';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface FormPreviewProps {
  formData: any;
}

export function FormPreview({ formData }: FormPreviewProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formValues, setFormValues] = useState<Record<string, any>>({});

  const handleInputChange = (id: string, value: any) => {
    setFormValues(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const renderElement = (element: any) => {
    switch (element.type) {
      case 'field':
        switch (element.fieldType) {
          case 'text':
          case 'email':
          case 'number':
            return (
              <div key={element.id} className="mb-4">
                <label className="block text-sm font-medium mb-1">{element.label}</label>
                <Input
                  type={element.fieldType}
                  value={formValues[element.id] || ''}
                  onChange={(e) => handleInputChange(element.id, e.target.value)}
                />
              </div>
            );
          case 'checkbox':
            return (
              <div key={element.id} className="mb-4">
                <label className="flex items-center gap-2">
                  <Checkbox
                    checked={formValues[element.id] || false}
                    onCheckedChange={(checked) => handleInputChange(element.id, checked)}
                  />
                  <span>{element.label}</span>
                </label>
              </div>
            );
          case 'radio':
            return (
              <div key={element.id} className="mb-4">
                <label className="block text-sm font-medium mb-1">{element.label}</label>
                <RadioGroup
                  value={formValues[element.id]}
                  onValueChange={(value) => handleInputChange(element.id, value)}
                >
                  {element.options?.map((option: any) => (
                    <div key={option.value} className="flex items-center gap-2">
                      <RadioGroupItem value={option.value} id={`${element.id}-${option.value}`} />
                      <label htmlFor={`${element.id}-${option.value}`}>{option.label}</label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            );
          case 'select':
            return (
              <div key={element.id} className="mb-4">
                <label className="block text-sm font-medium mb-1">{element.label}</label>
                <Select
                  value={formValues[element.id]}
                  onValueChange={(value) => handleInputChange(element.id, value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                  <SelectContent>
                    {element.options?.map((option: any) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            );
          case 'textarea':
            return (
              <div key={element.id} className="mb-4">
                <label className="block text-sm font-medium mb-1">{element.label}</label>
                <Textarea
                  value={formValues[element.id] || ''}
                  onChange={(e) => handleInputChange(element.id, e.target.value)}
                />
              </div>
            );
          default:
            return null;
        }
      case 'header':
        return <h2 key={element.id} className="text-2xl font-bold mb-4">{element.text}</h2>;
      case 'text':
        return <p key={element.id} className="mb-4">{element.text}</p>;
      case 'quote':
        return (
          <blockquote key={element.id} className="border-l-4 border-gray-300 pl-4 italic mb-4">
            {element.text}
          </blockquote>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">{formData.title}</h1>
      <p className="text-gray-600 mb-8">{formData.description}</p>

      {formData.steps[currentStep] && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">{formData.steps[currentStep].title}</h2>
          <p className="text-gray-600 mb-6">{formData.steps[currentStep].description}</p>

          <div className="space-y-4">
            {formData.steps[currentStep].elements.map(renderElement)}
          </div>

          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
              disabled={currentStep === 0}
            >
              Previous
            </Button>
            <Button
              onClick={() => setCurrentStep(prev => Math.min(formData.steps.length - 1, prev + 1))}
              disabled={currentStep === formData.steps.length - 1}
            >
              Next
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
} 