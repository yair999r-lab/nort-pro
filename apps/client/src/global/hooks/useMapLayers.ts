
import { useEffect } from "react";
import * as mapboxgl from "mapbox-gl/esm";

import usePorts from "@/ports/hooks/usePorts";
import useRoutes from "@/routes/hooks/useRoutes";
import { drawPortMarkers, syncRoutesLayer } from "../helpers/map/map.helpers";

type UseMapLayersProps = {
  map: mapboxgl.Map | null;
  mapLoaded: boolean;
  showPorts: boolean;
  showRoutes: boolean;
};

const useMapLayers = ({
  map,
  mapLoaded,
  showPorts,
  showRoutes,
}: UseMapLayersProps) => {
  const { ports, handleGetPorts } = usePorts();
  const { routes, handleGetRoutes } = useRoutes();

  useEffect(() => {
    handleGetPorts();
    handleGetRoutes();
  }, [handleGetPorts, handleGetRoutes]);

  useEffect(() => {
    if (!map || !mapLoaded) return;

    return drawPortMarkers(map, ports ?? [], showPorts);
  }, [map, mapLoaded, ports, showPorts]);

  useEffect(() => {
    if (!map || !mapLoaded) return;

    syncRoutesLayer(map, routes ?? [], showRoutes);
  }, [map, mapLoaded, routes, showRoutes]);
};

export default useMapLayers;
