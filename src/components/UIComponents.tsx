import React from 'react';
import {
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Download,
  Upload,
  ZoomIn,
  ZoomOut,
  Maximize,
} from 'lucide-react';
import { useMapStore } from '@/store/mapStore';

export const MapControls: React.FC<{
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFullscreen: () => void;
}> = ({ onZoomIn, onZoomOut, onFullscreen }) => {
  return (
    <div className="flex flex-col gap-1 bg-white rounded-lg shadow-lg p-1">
      <button
        onClick={onZoomIn}
        title="Zoom in"
        aria-label="Zoom in"
        className="p-2 hover:bg-gray-100 rounded transition-colors"
      >
        <ZoomIn size={18} />
      </button>
      <button
        onClick={onZoomOut}
        title="Zoom out"
        aria-label="Zoom out"
        className="p-2 hover:bg-gray-100 rounded transition-colors border-t border-gray-200"
      >
        <ZoomOut size={18} />
      </button>
      <button
        onClick={onFullscreen}
        title="Fullscreen"
        aria-label="Toggle fullscreen"
        className="p-2 hover:bg-gray-100 rounded transition-colors border-t border-gray-200"
      >
        <Maximize size={18} />
      </button>
    </div>
  );
};

export const DrawingToolbar: React.FC = () => {
  const { activeDrawingMode, setDrawingMode } = useMapStore();

  const tools = [
    { id: 'point', label: 'Draw Point', icon: '📍' },
    { id: 'line', label: 'Draw Line', icon: '📏' },
    { id: 'polygon', label: 'Draw Polygon', icon: '📐' },
  ];

  return (
    <div className="drawing-toolbar">
      {tools.map((tool) => (
        <button
          key={tool.id}
          onClick={() =>
            setDrawingMode(activeDrawingMode === tool.id ? 'none' : (tool.id as any))
          }
          className={`${activeDrawingMode === tool.id ? 'active' : ''}`}
          title={tool.label}
          aria-label={tool.label}
          aria-pressed={activeDrawingMode === tool.id}
        >
          {tool.icon} {tool.label}
        </button>
      ))}
    </div>
  );
};

export const LayerPanel: React.FC = () => {
  const {
    wmsLayerVisible,
    toggleWmsLayer,
    features,
    removeFeature,
    clearAllFeatures,
  } = useMapStore();

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 max-w-sm">
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Layers</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleWmsLayer}
            className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded w-full"
            aria-label={`${wmsLayerVisible ? 'Hide' : 'Show'} WMS layer`}
          >
            {wmsLayerVisible ? <Eye size={18} /> : <EyeOff size={18} />}
            <span>WMS Satellite Layer</span>
          </button>
        </div>
      </div>

      <div className="border-t pt-4">
        <h3 className="text-lg font-semibold mb-2">Drawn Features ({features.length})</h3>

        {features.length === 0 ? (
          <p className="text-gray-500 text-sm">No features drawn yet</p>
        ) : (
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {features.map((feature) => (
              <div
                key={feature.id}
                className="flex items-center justify-between gap-2 p-2 bg-gray-50 rounded"
              >
                <span className="text-sm truncate">
                  {feature.properties?.name || `${feature.type} #${feature.id.slice(0, 4)}`}
                </span>
                <button
                  onClick={() => removeFeature(feature.id)}
                  className="p-1 hover:bg-red-100 rounded"
                  title="Delete feature"
                  aria-label={`Delete ${feature.type}`}
                >
                  <Trash2 size={14} className="text-red-600" />
                </button>
              </div>
            ))}
          </div>
        )}

        {features.length > 0 && (
          <button
            onClick={clearAllFeatures}
            className="mt-3 w-full px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm font-medium flex items-center justify-center gap-2"
            aria-label="Clear all features"
          >
            <Trash2 size={16} />
            Clear All
          </button>
        )}
      </div>
    </div>
  );
};
