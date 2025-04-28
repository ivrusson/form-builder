import { useState } from 'react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Checkbox } from './ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Element, Field, FieldType, Validation, DataSource } from '../types/form';

interface ElementConfigProps {
  element: Element;
  onUpdate: (updatedElement: Element) => void;
}

export function ElementConfig({ element, onUpdate }: ElementConfigProps) {
  const [validation, setValidation] = useState<Validation>(element.type === 'field' ? element.validation || {} : {});
  const [dataSource, setDataSource] = useState<DataSource | undefined>(
    element.type === 'field' ? (element as Field).dataSource : undefined
  );

  const handleValidationChange = (key: keyof Validation, value: any) => {
    const newValidation = { ...validation, [key]: value };
    setValidation(newValidation);
    
    if (element.type === 'field') {
      onUpdate({
        ...element,
        validation: newValidation
      } as Field);
    }
  };

  const handleDataSourceChange = (key: keyof DataSource, value: any) => {
    const newDataSource = { ...dataSource, [key]: value };
    setDataSource(newDataSource);
    
    if (element.type === 'field') {
      onUpdate({
        ...element,
        dataSource: newDataSource
      } as Field);
    }
  };

  const renderFieldConfig = (field: Field) => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Field Type</label>
        <Select
          value={field.fieldType}
          onValueChange={(value: FieldType) => {
            onUpdate({
              ...field,
              fieldType: value
            });
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select field type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="text">Text</SelectItem>
            <SelectItem value="number">Number</SelectItem>
            <SelectItem value="email">Email</SelectItem>
            <SelectItem value="date">Date</SelectItem>
            <SelectItem value="checkbox">Checkbox</SelectItem>
            <SelectItem value="radio">Radio</SelectItem>
            <SelectItem value="select">Select</SelectItem>
            <SelectItem value="textarea">Textarea</SelectItem>
            <SelectItem value="file">File Upload</SelectItem>
            <SelectItem value="image">Image Upload</SelectItem>
            <SelectItem value="signature">Signature</SelectItem>
            <SelectItem value="richtext">Rich Text</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Label</label>
        <Input
          value={field.label}
          onChange={(e) => {
            onUpdate({
              ...field,
              label: e.target.value
            });
          }}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Tooltip</label>
        <Input
          value={field.tooltip || ''}
          onChange={(e) => {
            onUpdate({
              ...field,
              tooltip: e.target.value
            });
          }}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Column Span</label>
        <Input
          type="number"
          min="1"
          max="12"
          value={field.layout?.colSpan || 1}
          onChange={(e) => {
            onUpdate({
              ...field,
              layout: {
                ...field.layout,
                colSpan: parseInt(e.target.value)
              }
            });
          }}
        />
      </div>

      {(field.fieldType === 'select' || field.fieldType === 'radio') && (
        <div className="space-y-4">
          <h3 className="font-medium">Data Source</h3>
          <div>
            <label className="block text-sm font-medium mb-1">URL</label>
            <Input
              value={dataSource?.url || ''}
              onChange={(e) => handleDataSourceChange('url', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Method</label>
            <Select
              value={dataSource?.method || 'GET'}
              onValueChange={(value) => handleDataSourceChange('method', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="GET">GET</SelectItem>
                <SelectItem value="POST">POST</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Label Field</label>
            <Input
              value={dataSource?.mapping.labelField || ''}
              onChange={(e) => handleDataSourceChange('mapping', {
                ...dataSource?.mapping,
                labelField: e.target.value
              })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Value Field</label>
            <Input
              value={dataSource?.mapping.valueField || ''}
              onChange={(e) => handleDataSourceChange('mapping', {
                ...dataSource?.mapping,
                valueField: e.target.value
              })}
            />
          </div>
        </div>
      )}

      <div className="space-y-2">
        <h3 className="font-medium">Validation</h3>
        <div className="flex items-center space-x-2">
          <Checkbox
            checked={validation.required}
            onCheckedChange={(checked) => handleValidationChange('required', checked)}
          />
          <label>Required</label>
        </div>

        {field.fieldType === 'text' && (
          <>
            <div>
              <label className="block text-sm font-medium mb-1">Min Length</label>
              <Input
                type="number"
                value={validation.minLength || ''}
                onChange={(e) => handleValidationChange('minLength', parseInt(e.target.value))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Max Length</label>
              <Input
                type="number"
                value={validation.maxLength || ''}
                onChange={(e) => handleValidationChange('maxLength', parseInt(e.target.value))}
              />
            </div>
          </>
        )}

        {field.fieldType === 'number' && (
          <>
            <div>
              <label className="block text-sm font-medium mb-1">Min Value</label>
              <Input
                type="number"
                value={validation.min || ''}
                onChange={(e) => handleValidationChange('min', parseFloat(e.target.value))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Max Value</label>
              <Input
                type="number"
                value={validation.max || ''}
                onChange={(e) => handleValidationChange('max', parseFloat(e.target.value))}
              />
            </div>
          </>
        )}

        <div>
          <label className="block text-sm font-medium mb-1">Pattern (Regex)</label>
          <Input
            value={validation.pattern || ''}
            onChange={(e) => handleValidationChange('pattern', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Custom Validation</label>
          <Input
            value={validation.custom || ''}
            onChange={(e) => handleValidationChange('custom', e.target.value)}
            placeholder="JavaScript validation function"
          />
        </div>
      </div>
    </div>
  );

  const renderTextConfig = (text: { text: string }) => (
    <div>
      <label className="block text-sm font-medium mb-1">Text Content</label>
      <Input
        value={text.text}
        onChange={(e) => {
          onUpdate({
            ...element,
            text: e.target.value
          });
        }}
      />
    </div>
  );

  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-4">Element Configuration</h3>
      {element.type === 'field' ? renderFieldConfig(element as Field) : renderTextConfig(element)}
    </Card>
  );
} 