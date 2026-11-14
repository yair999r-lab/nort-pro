
import { useEffect, useRef, useState } from "react";
import * as mapboxgl from "mapbox-gl/esm";
import "mapbox-gl/dist/mapbox-gl.css";
import useMapLayers from "@/global/hooks/useMapLayers";

type MapboxMapProps = {
  showPorts: boolean;
  showRoutes: boolean;
};

const MapboxMap = ({ showPorts, showRoutes }: MapboxMapProps) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  const accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

  useMapLayers({
    map: mapRef.current,
    mapLoaded,
    showPorts,
    showRoutes,
  });

  useEffect(() => {
    const container = mapContainerRef.current;

    if (!container || !accessToken) return;

    const map = new mapboxgl.Map({
      accessToken,
      container,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [34, 32.5],
      zoom: 5,
      language: "he",
    });

    mapRef.current = map;
    map.once("load", () => setMapLoaded(true));
    map.addControl(new mapboxgl.NavigationControl(), "top-right");

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [accessToken]);

  return (
    <div
      ref={mapContainerRef}
      style={{ width: "100%", height: "100%", minHeight: 0 }}
    />
  );
};

export default MapboxMap;
