import { useEffect, useRef, useState } from 'react';
import { MapPin, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LocationPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLocation: (location: { lat: number; lng: number; address: string }) => void;
  mapboxToken: string;
}

const LocationPicker = ({
  isOpen,
  onClose,
  onSelectLocation,
  mapboxToken,
}: LocationPickerProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markerInstance = useRef<any>(null);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (!isOpen || !mapContainer.current || !mapboxToken || mapInstance.current) return;

    // Dynamically import mapbox-gl to avoid SSR/hooks issues
    import('mapbox-gl').then((mapboxgl) => {
      import('mapbox-gl/dist/mapbox-gl.css');
      
      mapboxgl.default.accessToken = mapboxToken;

      // Kolkata center coordinates
      const kolkataCenter: [number, number] = [88.3639, 22.5726];

      mapInstance.current = new mapboxgl.default.Map({
        container: mapContainer.current!,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: kolkataCenter,
        zoom: 12,
      });

      mapInstance.current.addControl(new mapboxgl.default.NavigationControl(), 'top-right');

      // Add click handler
      mapInstance.current.on('click', (e: any) => {
        const { lng, lat } = e.lngLat;
        setSelectedLocation({ lat, lng });

        // Update or create marker
        if (markerInstance.current) {
          markerInstance.current.setLngLat([lng, lat]);
        } else {
          markerInstance.current = new mapboxgl.default.Marker({ color: '#2563eb' })
            .setLngLat([lng, lat])
            .addTo(mapInstance.current!);
        }
      });

      mapInstance.current.on('load', () => {
        setMapLoaded(true);
      });
    });

    return () => {
      if (markerInstance.current) {
        markerInstance.current.remove();
        markerInstance.current = null;
      }
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
      setMapLoaded(false);
    };
  }, [isOpen, mapboxToken]);

  const handleConfirm = () => {
    if (selectedLocation) {
      onSelectLocation({
        ...selectedLocation,
        address: `${selectedLocation.lat.toFixed(4)}, ${selectedLocation.lng.toFixed(4)}`,
      });
      setSelectedLocation(null);
      onClose();
    }
  };

  const handleClose = () => {
    setSelectedLocation(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-foreground/50 z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            <h3 className="font-bold text-lg text-foreground">Select Location on Map</h3>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Map */}
        <div className="relative">
          <div ref={mapContainer} className="w-full h-[400px]" />
          {!mapboxToken && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted">
              <p className="text-muted-foreground text-center px-4">
                Mapbox token required to display map
              </p>
            </div>
          )}
          {mapboxToken && !mapLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted/80">
              <p className="text-muted-foreground">Loading map...</p>
            </div>
          )}
        </div>

        {/* Selected Location Info */}
        {selectedLocation && (
          <div className="p-4 bg-success/10 border-t border-success/20">
            <p className="text-sm text-success font-medium flex items-center gap-2">
              <Check className="w-4 h-4" />
              Location selected: {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="flex gap-3 p-4 border-t border-border">
          <Button variant="outline" onClick={handleClose} className="flex-1">
            Cancel
          </Button>
          <Button
            variant="success"
            onClick={handleConfirm}
            disabled={!selectedLocation}
            className="flex-1"
          >
            <Check className="w-5 h-5" />
            Confirm Location
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LocationPicker;
