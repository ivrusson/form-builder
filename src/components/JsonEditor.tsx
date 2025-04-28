import { useState } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Card } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface JsonEditorProps {
  formData: any;
  onUpdate: (data: any) => void;
}

export function JsonEditor({ formData, onUpdate }: JsonEditorProps) {
  const [jsonInput, setJsonInput] = useState(JSON.stringify(formData, null, 2));
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleJsonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJsonInput(e.target.value);
    setError(null);
    setSuccess(null);
  };

  const handleImport = () => {
    try {
      const parsedJson = JSON.parse(jsonInput);
      onUpdate(parsedJson);
      setSuccess('JSON imported successfully');
      setError(null);
    } catch (err) {
      setError('Invalid JSON format');
      setSuccess(null);
    }
  };

  const handleExport = () => {
    const jsonString = JSON.stringify(formData, null, 2);
    setJsonInput(jsonString);
    setSuccess('JSON exported successfully');
    setError(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={handleExport}>Export JSON</Button>
        <Button onClick={handleImport}>Import JSON</Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert>
          <CheckCircle2 className="h-4 w-4" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <Card className="p-4">
        <Textarea
          value={jsonInput}
          onChange={handleJsonChange}
          className="font-mono h-[500px]"
          placeholder="Paste your JSON here..."
        />
      </Card>
    </div>
  );
} 