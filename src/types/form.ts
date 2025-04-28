export type FieldType =
  | 'text'
  | 'number'
  | 'email'
  | 'date'
  | 'checkbox'
  | 'radio'
  | 'select'
  | 'textarea'
  | 'file'
  | 'image'
  | 'signature'
  | 'richtext';

export type ElementType = 'field' | 'header' | 'text' | 'quote';

export interface Validation {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: string;
  custom?: string;
}

export interface VisibilityCondition {
  operator: 'AND' | 'OR' | 'NOT';
  conditions: {
    fieldId: string;
    comparison: 'equals' | 'notEquals' | 'greaterThan' | 'lessThan' | 'includes';
    value: string | number | boolean;
  }[];
}

export interface DataSource {
  url: string;
  method: 'GET' | 'POST';
  headers?: Record<string, string>;
  mapping: {
    labelField: string;
    valueField: string;
  };
}

export interface BaseElement {
  id: string;
  type: ElementType;
}

export interface Field extends BaseElement {
  type: 'field';
  label: string;
  tooltip?: string;
  fieldType: FieldType;
  validation?: Validation;
  visibilityCondition?: VisibilityCondition;
  dataSource?: DataSource;
  layout?: {
    colSpan: number;
  };
  options?: Array<{
    label: string;
    value: string;
  }>;
}

export interface Header extends BaseElement {
  type: 'header';
  text: string;
}

export interface Text extends BaseElement {
  type: 'text';
  text: string;
}

export interface Quote extends BaseElement {
  type: 'quote';
  text: string;
}

export type Element = Field | Header | Text | Quote;

export interface NextStepCondition {
  fieldId: string;
  comparison: 'equals' | 'notEquals' | 'greaterThan' | 'lessThan' | 'includes';
  value: string | number | boolean;
  goToStep: string;
}

export interface Step {
  id: string;
  title: string;
  description?: string;
  layout: {
    columns: number;
  };
  elements: Element[];
  nextStepCondition?: NextStepCondition[];
  defaultNextStep?: string;
  visibilityCondition?: VisibilityCondition;
}

export interface FormData {
  id: string;
  title: string;
  description?: string;
  steps: Step[];
} 