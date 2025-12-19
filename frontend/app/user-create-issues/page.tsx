import React, { useState, useEffect } from 'react';
import { MapPin, Send, Loader2, Map, Pencil, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import ImageUpload from '@/components/ImageUpload';
import LocationPicker from '@/components/LocationPicker';
import { useToast } from '@/hooks/use-toast';

const categories = [
  { value: 'roads', label: 'Roads' },
  { value: 'water', label: 'Water' },
  { value: 'electricity', label: 'Electricity' },
  { value: 'garbage', label: 'Garbage' },
  { value: 'drainage', label: 'Drainage' },
  { value: 'other', label: 'Other' },
];

// Temporary token input for demo - in production, use environment variables
const DEMO_MAPBOX_TOKEN = '';

const CreateIssue: React.FC = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showMapPicker, setShowMapPicker] = useState(false);
  const [mapboxToken, setMapboxToken] = useState(DEMO_MAPBOX_TOKEN);
  const [locationMode, setLocationMode] = useState<'none' | 'map' | 'manual'>('none');
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  const [formData, setFormData] = useState({
    image: null as File | null,
    title: '',
    description: '',
    category: '',
    location: '',
  });

  // Theme toggle effect
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDarkMode]);

  const isFormValid =
    formData.title.trim() !== '' &&
    formData.description.trim() !== '' &&
    formData.category !== '' &&
    formData.location.trim() !== '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    toast({
      title: "Issue Reported!",
      description: "Thank you for helping improve our community.",
    });
    
    setFormData({
      image: null,
      title: '',
      description: '',
      category: '',
      location: '',
    });
    setLocationMode('none');
    setIsSubmitting(false);
  };

  const handleMapLocationSelect = (location: { lat: number; lng: number; address: string }) => {
    setFormData(prev => ({ ...prev, location: location.address }));
    setLocationMode('map');
    toast({
      title: "Location Selected",
      description: "Location from map has been added.",
    });
  };

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <div className="container max-w-lg mx-auto px-4 py-6 md:py-10">
        {/* Theme Toggle */}
        <div className="flex justify-end mb-4">
          <div className="flex items-center gap-2 p-2 rounded-lg bg-card border border-border">
            <Sun className="w-4 h-4 text-muted-foreground" />
            <Switch
              checked={isDarkMode}
              onCheckedChange={setIsDarkMode}
              aria-label="Toggle dark mode"
            />
            <Moon className="w-4 h-4 text-muted-foreground" />
          </div>
        </div>

        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Report an Issue
          </h1>
          <p className="text-muted-foreground text-base">
            Report problems in your area quickly and easily
          </p>
        </header>

        {/* Mapbox Token Input (for demo) */}
        {!mapboxToken && (
          <div className="mb-6 p-4 rounded-xl bg-muted border border-border">
            <Label className="text-sm font-medium text-foreground mb-2 block">
              Mapbox Token (for map feature)
            </Label>
            <Input
              type="text"
              placeholder="Enter your Mapbox public token"
              value={mapboxToken}
              onChange={(e) => setMapboxToken(e.target.value)}
              className="bg-card"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Get your token from <a href="https://mapbox.com" target="_blank" rel="noopener noreferrer" className="text-primary underline">mapbox.com</a>
            </p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <div>
            <Label className="text-sm font-medium text-foreground mb-2 block">
              Photo (optional)
            </Label>
            <ImageUpload
              value={formData.image}
              onChange={(file) => setFormData(prev => ({ ...prev, image: file }))}
            />
          </div>

          {/* Title */}
          <div>
            <Label htmlFor="title" className="text-sm font-medium text-foreground mb-2 block">
              Issue Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              type="text"
              placeholder="Short title describing the issue"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="h-12 bg-card border border-input focus:border-primary rounded-xl text-base"
              maxLength={100}
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description" className="text-sm font-medium text-foreground mb-2 block">
              Description <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="description"
              placeholder="Describe the problem in detail"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="min-h-[100px] bg-card border border-input focus:border-primary rounded-xl text-base resize-none"
              maxLength={1000}
            />
          </div>

          {/* Category */}
          <div>
            <Label className="text-sm font-medium text-foreground mb-2 block">
              Category <span className="text-destructive">*</span>
            </Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
            >
              <SelectTrigger className="h-12 bg-card border border-input focus:border-primary rounded-xl text-base">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border rounded-xl z-50">
                {categories.map((category) => (
                  <SelectItem
                    key={category.value}
                    value={category.value}
                    className="text-base cursor-pointer rounded-lg"
                  >
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Location */}
          <div>
            <Label className="text-sm font-medium text-foreground mb-3 block">
              Location <span className="text-destructive">*</span>
            </Label>
            
            {/* Location Options */}
            <div className="space-y-3">
              {/* Option A: Map Selection */}
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowMapPicker(true)}
                disabled={!mapboxToken}
                className={`w-full h-auto p-4 justify-start gap-3 rounded-xl ${
                  locationMode === 'map'
                    ? 'border-primary bg-primary/5'
                    : ''
                }`}
              >
                <Map className="w-5 h-5" />
                <span>Select Location on Map</span>
              </Button>

              {/* Divider */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-border" />
                <span className="text-sm text-muted-foreground">OR</span>
                <div className="flex-1 h-px bg-border" />
              </div>

              {/* Option B: Manual Entry */}
              <Input
                type="text"
                placeholder="e.g., Park Street, Salt Lake Sector V, Near Howrah Station"
                value={formData.location}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, location: e.target.value }));
                  if (e.target.value) setLocationMode('manual');
                }}
                onFocus={() => setLocationMode('manual')}
                className={`h-12 bg-card border rounded-xl text-base ${
                  locationMode === 'manual' ? 'border-primary' : 'border-input'
                }`}
              />
            </div>

            {/* Selected Location Display */}
            {formData.location && (
              <div className="mt-3 p-3 rounded-lg bg-primary/10 border border-primary/20 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                <p className="text-sm text-foreground font-medium truncate">{formData.location}</p>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <Button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              size="lg"
              className="w-full h-14 text-lg rounded-xl"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Submit Issue
                </>
              )}
            </Button>
            {!isFormValid && (
              <p className="text-center text-sm text-muted-foreground mt-3">
                Please fill all required fields marked with *
              </p>
            )}
          </div>
        </form>
      </div>

      {/* Map Picker Modal */}
      <LocationPicker
        isOpen={showMapPicker}
        onClose={() => setShowMapPicker(false)}
        onSelectLocation={handleMapLocationSelect}
        mapboxToken={mapboxToken}
      />
    </div>
  );
};

export default CreateIssue;
