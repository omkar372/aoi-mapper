import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useMapStore } from '@/store/mapStore';
import { generateId } from '@/utils/common';

// Fix Leaflet icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const WMS_URL = 'https://www.wms.nrw.de/geobasis/wms_nw_dop';
const WMS_LAYER_NAME = 'nw_dop_rgb';

interface DrawingState {
  isDrawing: boolean;
  points: [number, number][];
}

export const MapComponent: React.FC = () => {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const wmsLayerRef = useRef<L.TileLayer.WMS | null>(null);
  const drawnLayersRef = useRef<L.FeatureGroup>(new L.FeatureGroup());
  const drawingStateRef = useRef<DrawingState>({ isDrawing: false, points: [] });

  const {
    zoom,
    setZoom,
    center,
    setCenter,
    wmsLayerVisible,
    features,
    addFeature,
    activeDrawingMode,
  } = useMapStore();

  
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current).setView([center[0], center[1]], zoom);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

  
    const wmsLayer = L.tileLayer.wms(WMS_URL, {
      layers: WMS_LAYER_NAME,
      format: 'image/png',
      transparent: true,
      attribution: '© NRW DOP',
    }).addTo(map);

    wmsLayerRef.current = wmsLayer;


    drawnLayersRef.current.addTo(map);

  
    map.on('zoom', (e) => setZoom(e.target.getZoom()));
    map.on('moveend', () => {
      const center = map.getCenter();
      setCenter([center.lat, center.lng]);
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  
  useEffect(() => {
    if (wmsLayerRef.current && mapRef.current) {
      if (wmsLayerVisible) {
        mapRef.current.addLayer(wmsLayerRef.current);
      } else {
        mapRef.current.removeLayer(wmsLayerRef.current);
      }
    }
  }, [wmsLayerVisible]);

  
  useEffect(() => {
    drawnLayersRef.current.clearLayers();

    features.forEach((feature) => {
      const color = feature.properties?.color || '#0066cc';

      if (feature.type === 'point') {
        L.circleMarker([feature.coordinates[0][0], feature.coordinates[0][1]], {
          radius: 6,
          color: color,
          weight: 2,
          opacity: 0.8,
          fillOpacity: 0.6,
        })
          .bindPopup(`<strong>${feature.properties?.name || 'Point'}</strong>`)
          .addTo(drawnLayersRef.current);
      } else if (feature.type === 'line') {
        L.polyline(
          feature.coordinates.map(([lat, lng]) => [lat, lng]),
          {
            color: color,
            weight: 2,
            opacity: 0.7,
          }
        )
          .bindPopup(`<strong>${feature.properties?.name || 'Line'}</strong>`)
          .addTo(drawnLayersRef.current);
      } else if (feature.type === 'polygon') {
        L.polygon(
          feature.coordinates.map(([lat, lng]) => [lat, lng]),
          {
            color: color,
            weight: 2,
            opacity: 0.7,
            fillOpacity: 0.3,
          }
        )
          .bindPopup(`<strong>${feature.properties?.name || 'Polygon'}</strong>`)
          .addTo(drawnLayersRef.current);
      }
    });
  }, [features]);

 
  useEffect(() => {
    if (!mapRef.current) return;

    const map = mapRef.current;

    const handleMapClick = (e: L.LeafletMouseEvent) => {
      if (activeDrawingMode === 'none') return;

      const { lat, lng } = e.latlng;
      const newPoint: [number, number] = [lat, lng];

      if (activeDrawingMode === 'point') {
        addFeature({
          id: generateId(),
          type: 'point',
          coordinates: [newPoint],
          properties: { name: 'Point', color: '#0066cc' },
        });
      } else {
        drawingStateRef.current.points.push(newPoint);
        L.circleMarker([lat, lng], {
          radius: 4,
          color: '#ff0000',
          fill: true,
          fillOpacity: 0.8,
        }).addTo(drawnLayersRef.current);

        if (drawingStateRef.current.points.length > 1) {
          L.polyline(
            drawingStateRef.current.points.map(([lat, lng]) => [lat, lng]),
            { color: '#ff9999', dashArray: '5, 5' }
          ).addTo(drawnLayersRef.current);
        }
      }
    };

    const handleContextMenu = (e: L.LeafletMouseEvent) => {
      e.originalEvent.preventDefault();

      if (activeDrawingMode !== 'none' && drawingStateRef.current.points.length > 0) {
        const points = drawingStateRef.current.points;

        if (activeDrawingMode === 'line' && points.length >= 2) {
          addFeature({
            id: generateId(),
            type: 'line',
            coordinates: points,
            properties: { name: 'Line', color: '#0066cc' },
          });
        } else if (activeDrawingMode === 'polygon' && points.length >= 3) {
          addFeature({
            id: generateId(),
            type: 'polygon',
            coordinates: points,
            properties: { name: 'Area of Interest', color: '#00cc99' },
          });
        }

        drawingStateRef.current.points = [];
        drawnLayersRef.current.clearLayers();
      }
    };

    map.on('click', handleMapClick);
    map.on('contextmenu', handleContextMenu);

    return () => {
      map.off('click', handleMapClick);
      map.off('contextmenu', handleContextMenu);
    };
  }, [activeDrawingMode, addFeature]);

  return <div ref={containerRef} className="w-full h-full" />;
};
