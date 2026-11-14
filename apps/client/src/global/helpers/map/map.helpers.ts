import * as mapboxgl from 'mapbox-gl/esm';
import type { NormalizedPort } from '@/ports/types/ports.types';
import type { NormalizedRoute } from '@/routes/types/routes.types';
import type { FeatureCollection, LineString } from 'geojson';

export const drawPortMarkers = (
  map: mapboxgl.Map,
  ports: NormalizedPort[],
  visible: boolean,
): (() => void) | undefined => {
  if (!visible) return;

  // מסננים נמלים שאין להם קואורדינטות
  const portsWithCoordinates = ports.filter(
    (
      port,
    ): port is NormalizedPort & {
      location: NonNullable<NormalizedPort['location']>;
    } => port.location !== null,
  );

  if (!portsWithCoordinates.length) return;

  const bounds = new mapboxgl.LngLatBounds();

  const markers = portsWithCoordinates.map((port) => {
    const coordinates = port.location.coordinates;

    bounds.extend(coordinates);

    return new mapboxgl.Marker({
      color: port.status === 'active' ? '#168B70' : '#9CA3AF',
    })
      .setLngLat(coordinates)
      .setPopup(new mapboxgl.Popup({ offset: 25 }).setText(port.name))
      .addTo(map);
  });

  map.fitBounds(bounds, {
    padding: 50,
    maxZoom: 5,
    duration: 500,
  });

  return () => markers.forEach((marker) => marker.remove());
};

export const syncRoutesLayer = (
  map: mapboxgl.Map,
  routes: NormalizedRoute[],
  visible: boolean,
): void => {
  const sourceId = 'routes-source';
  const layerId = 'routes-line-layer';

  const data: FeatureCollection<LineString> = {
    type: 'FeatureCollection',
    features: routes.flatMap((route) => {
      if (!route.geometry) return [];

      return [
        {
          type: 'Feature' as const,
          properties: {
            id: route.id,
            status: route.status,
          },
          geometry: route.geometry,
        },
      ];
    }),
  };

  const source = map.getSource(sourceId) as mapboxgl.GeoJSONSource | undefined;

  if (source) {
    source.setData(data);
  } else {
    map.addSource(sourceId, { type: 'geojson', data });
  }

  if (!map.getLayer(layerId)) {
    map.addLayer({
      id: layerId,
      type: 'line',
      source: sourceId,
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
      paint: {
        'line-color': [
          'match',
          ['get', 'status'],
          'active',
          '#168B70',
          '#9CA3AF',
        ],
        'line-width': 3,
      },
    });
  }

  map.setLayoutProperty(layerId, 'visibility', visible ? 'visible' : 'none');
};
