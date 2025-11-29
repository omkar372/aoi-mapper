import React, { useRef } from 'react';
import { MapComponent } from './components/Map';
import { SearchBar } from './components/SearchBar';
import { MapControls, DrawingToolbar, LayerPanel } from './components/UIComponents';
import { useMapStore } from './store/mapStore';

function App() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const { setZoom, zoom } = useMapStore();

  const handleZoomIn = () => {
    setZoom(Math.min(zoom + 1, 19));
  };

  const handleZoomOut = () => {
    setZoom(Math.max(zoom - 1, 0));
  };

  const handleFullscreen = () => {
    if (mapContainerRef.current) {
      if (mapContainerRef.current.requestFullscreen) {
        mapContainerRef.current.requestFullscreen().catch(() => {
          console.log('Fullscreen request failed');
        });
      }
    }
  };

  return (
    <div className="w-screen h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md p-4 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AOI Satellite Mapper</h1>
          <p className="text-sm text-gray-600">Interactive area of interest creation with satellite imagery</p>
        </div>
        <SearchBar />
      </header>

      {/* Main content */}
      <div className="flex-1 flex gap-4 overflow-hidden p-4">
        {/* Map container */}
        <div
          ref={mapContainerRef}
          className="flex-1 bg-white rounded-lg shadow-lg overflow-hidden relative"
        >
          <MapComponent />

          {/* Map controls - positioned absolutely */}
          <div className="absolute top-4 right-4 z-40">
            <MapControls
              onZoomIn={handleZoomIn}
              onZoomOut={handleZoomOut}
              onFullscreen={handleFullscreen}
            />
          </div>

          {/* Drawing toolbar - positioned absolutely */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-40">
            <DrawingToolbar />
          </div>
        </div>

        {/* Sidebar */}
        <aside className="w-80 overflow-y-auto">
          <LayerPanel />
        </aside>
      </div>

      {/* Footer */}
      <footer className="bg-gray-100 border-t border-gray-300 p-3 text-center text-sm text-gray-600">
      </footer>
    </div>
  );
}

export default App;
