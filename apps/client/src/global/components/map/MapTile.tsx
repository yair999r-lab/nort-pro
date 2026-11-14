import GenericMapTile from '@/global/components/map/GenericMapTile';
import MapboxMap from './MapboxMap';
import { useState } from 'react';
import { FormControlLabel, Stack, Switch } from '@mui/material';

type MapTileProps = {
  to?: string;
  expanded: boolean;
};

const MapTile = ({ to, expanded }: MapTileProps) => {
  const [showPorts, setShowPorts] = useState(true);
  const [showRoutes, setShowRoutes] = useState(true);

  return (
    <GenericMapTile
  title="מפה ימית"
  to={to}
  expanded={expanded}
  bodyStyle={{
    p: 0,
    overflow: "hidden",
    display: "flex",
  }}
  headerActions={
    <Stack direction="row" spacing={1} alignItems="center">
      <FormControlLabel
        label="נמלים"
        control={
          <Switch
            size="small"
            checked={showPorts}
            onChange={(event) => setShowPorts(event.target.checked)}
          />
        }
      />

      <FormControlLabel
        label="מסלולים"
        control={
          <Switch
            size="small"
            checked={showRoutes}
            onChange={(event) => setShowRoutes(event.target.checked)}
          />
        }
      />
    </Stack>
  }
>
  <MapboxMap showPorts={showPorts} showRoutes={showRoutes} />
</GenericMapTile>
  );
};

export default MapTile;
