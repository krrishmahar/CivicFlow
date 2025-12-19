import React, { useRef, useState } from 'react';
import { Camera, ImagePlus, X, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  value?: File | null;
  onChange: (file: File | null) => void;
  className?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ value, onChange, className }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      onChange(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemove = () => {
    onChange(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  return (
    <div className={cn("space-y-3", className)}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileSelect(file);
        }}
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileSelect(file);
        }}
      />

      {preview ? (
        <div className="relative rounded-xl overflow-hidden border-2 border-success/30 bg-success/5">
          <img
            src={preview}
            alt="Issue preview"
            className="w-full h-52 object-cover"
          />
          <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-foreground/60 to-transparent">
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-card/95 text-foreground text-sm font-semibold hover:bg-card transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Change
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-destructive text-destructive-foreground text-sm font-semibold hover:bg-destructive/90 transition-colors"
              >
                <X className="w-4 h-4" />
                Remove
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="border-2 border-dashed border-border rounded-xl p-6 bg-muted/30">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
              <ImagePlus className="w-7 h-7 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-foreground mb-1">
                Upload a photo of the issue
              </p>
              <p className="text-sm text-muted-foreground">
                This helps us understand the problem better
              </p>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-info text-info-foreground font-semibold hover:bg-info/90 transition-colors"
              >
                <Camera className="w-5 h-5" />
                Camera
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-secondary text-secondary-foreground font-semibold hover:bg-secondary/80 transition-colors border border-border"
              >
                <ImagePlus className="w-5 h-5" />
                Gallery
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
