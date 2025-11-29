import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface DrawnFeature {
  id: string;
  type: 'point' | 'line' | 'polygon';
  coordinates: [number, number][];
  properties?: {
    name?: string;
    description?: string;
    color?: string;
  };
}

export interface MapState {
  
  zoom: number;
  center: [number, number];
  
  
  wmsLayerVisible: boolean;
  
 
  features: DrawnFeature[];
  activeDrawingMode: 'none' | 'point' | 'line' | 'polygon';
  

  setZoom: (zoom: number) => void;
  setCenter: (center: [number, number]) => void;
  toggleWmsLayer: () => void;
  addFeature: (feature: DrawnFeature) => void;
  removeFeature: (id: string) => void;
  updateFeature: (id: string, feature: Partial<DrawnFeature>) => void;
  setDrawingMode: (mode: 'none' | 'point' | 'line' | 'polygon') => void;
  clearAllFeatures: () => void;
}

export const useMapStore = create<MapState>()(
  persist(
    (set) => ({
      zoom: 10,
      center: [51.9607, 7.6261], // Münster, NRW center
      wmsLayerVisible: true,
      features: [],
      activeDrawingMode: 'none',

      setZoom: (zoom) => set({ zoom }),
      setCenter: (center) => set({ center }),
      toggleWmsLayer: () => set((state) => ({ wmsLayerVisible: !state.wmsLayerVisible })),
      
      addFeature: (feature) =>
        set((state) => ({
          features: [...state.features, feature],
        })),
      
      removeFeature: (id) =>
        set((state) => ({
          features: state.features.filter((f) => f.id !== id),
        })),
      
      updateFeature: (id, updates) =>
        set((state) => ({
          features: state.features.map((f) =>
            f.id === id ? { ...f, ...updates } : f
          ),
        })),
      
      setDrawingMode: (mode) => set({ activeDrawingMode: mode }),
      
      clearAllFeatures: () => set({ features: [] }),
    }),
    {
      name: 'map-store',
      version: 1,
      migrate: (state: any, version: number) => {
        if (version === 0) {
          return {
            ...state,
            version: 1,
          };
        }
        return state as MapState;
      },
    }
  )
);
