'use client';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './map-heat-init';
import 'leaflet.heat';
import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, useMap, useMapEvents } from 'react-leaflet';

/** One post (or aggregated count) at a location. Weight = intensity (e.g. number of posts). */
export interface MapHeatPoint {
  lat: number;
  lng: number;
  /** Intensity 0–1 or relative count (will be normalized). Higher = warmer on map. */
  weight?: number;
}

export interface MapHeatmapProps {
  /** Center of the map [lat, lng] */
  center: [number, number];
  /** Initial zoom (e.g. 12 for city, 5 for country). Default 12 */
  zoom?: number;
  /** Points where people posted (photos/videos). More points or higher weight = warmer. */
  points: MapHeatPoint[];
  /** Optional class for the wrapper (e.g. height). */
  className?: string;
  /** Radius of each heat blob in pixels. Default 25 */
  radius?: number;
  /** Blur in pixels. Default 15 */
  blur?: number;
  /** Called when the user clicks on the map (lat, lng, zoom). */
  onMapClick?: (lat: number, lng: number, zoom: number) => void;
}

// leaflet.heat attaches L.heatLayer at runtime; TypeScript doesn't know it
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const heatLayer = (L as any).heatLayer as (latlngs: [number, number, number][], options?: Record<string, unknown>) => L.Layer;

/** Cool (blue/green) = fewer posts, warm (orange/red) = more posts */
const HEAT_GRADIENT: Record<number, string> = {
  0: 'rgba(0, 0, 255, 0)',
  0.2: 'rgba(0, 128, 255, 0.3)',
  0.45: 'rgba(0, 255, 200, 0.5)',
  0.65: 'rgba(255, 255, 0, 0.6)',
  0.85: 'rgba(255, 140, 0, 0.8)',
  1: 'rgba(255, 50, 50, 0.9)'
};

function HeatmapLayer({ points, radius, blur }: { points: MapHeatPoint[]; radius: number; blur: number }) {
  const map = useMap();
  const layerRef = useRef<L.Layer | null>(null);

  useEffect(() => {
    if (points.length === 0) {
      if (layerRef.current) {
        map.removeLayer(layerRef.current);
        layerRef.current = null;
      }
      return;
    }

    const maxWeight = Math.max(...points.map((p) => p.weight ?? 1), 1);
    const latlngs: [number, number, number][] = points.map((p) => [
      p.lat,
      p.lng,
      (p.weight ?? 1) / maxWeight
    ]);

    if (layerRef.current) {
      const layer = layerRef.current as L.Layer & { setLatLngs: (l: [number, number, number][]) => void };
      if ('setLatLngs' in layer) layer.setLatLngs(latlngs);
      return;
    }

    const layer = heatLayer(latlngs, {
      radius,
      blur,
      gradient: HEAT_GRADIENT,
      // Disable zoom-based intensity scaling so merged areas stay warm (red)
      maxZoom: 0,
      minOpacity: 0.2
    });
    layer.addTo(map);
    layerRef.current = layer;

    return () => {
      if (layerRef.current) {
        map.removeLayer(layerRef.current);
        layerRef.current = null;
      }
    };
  }, [map, points, radius, blur]);

  return null;
}

function MapClickHandler({
  onMapClick
}: {
  onMapClick?: (lat: number, lng: number, zoom: number) => void;
}) {
  const map = useMap();
  useMapEvents({
    click(e) {
      onMapClick?.(e.latlng.lat, e.latlng.lng, map.getZoom());
    }
  });
  return null;
}

export function MapHeatmap({
  center,
  zoom = 12,
  points,
  className = '',
  radius = 28,
  blur = 18,
  onMapClick
}: MapHeatmapProps) {
  return (
    <div className={`overflow-hidden rounded-xl [&_.leaflet-container]:rounded-xl ${className}`}>
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom
        className="h-full w-full min-h-[280px]"
        style={{ background: '#1a1a1a' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        <HeatmapLayer points={points} radius={radius} blur={blur} />
        <MapClickHandler onMapClick={onMapClick} />
      </MapContainer>
    </div>
  );
}
