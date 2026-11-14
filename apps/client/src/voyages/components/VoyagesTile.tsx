import { CSSProperties, FC, useEffect } from 'react';
import useVoyages from '@/voyages/hooks/useVoyages';
import useShips from '@/ships/hooks/useShips';
import usePorts from '@/ports/hooks/usePorts';
import Error from '@/global/helpers/errors/Error';
import GenericCrudTableTile from '@/global/components/generic-table-tile/GenericCrudTableTile';
import { VOYAGE_TABLE_TILE_INFO } from '@/voyages/helpers/voyages.helpers';
import type { NormalizedVoyage } from '@/voyages/types/voyages.types';
import {
  createVoyageFields,
  voyageSchema,
  type VoyageFormData,
} from './VoyageForm';

type VoyagesTileProps = {
  to: string;
  expanded: boolean;
  bodyHeight?: CSSProperties['height'];
};

const toDateTimeLocal = (value: string | null): string => {
  if (!value) return '';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return '';

  const localDate = new Date(
    date.getTime() - date.getTimezoneOffset() * 60_000,
  );

  return localDate.toISOString().slice(0, 16);
};

const VoyagesTile: FC<VoyagesTileProps> = ({ to, expanded, bodyHeight }) => {
  const { voyages, loadingVoyages, VoyagesErrors, handleGetVoyages } =
    useVoyages();

  const { ships, loadingShips, ShipsErrors, handleGetShips } = useShips();

  const { ports, loadingPorts, PortsErrors, handleGetPorts } = usePorts();

  useEffect(() => {
    handleGetVoyages();
    handleGetShips();
    handleGetPorts();
  }, [handleGetVoyages, handleGetShips, handleGetPorts]);

  if (loadingVoyages || loadingShips || loadingPorts) {
    return <p>Loading...</p>;
  }

  if (VoyagesErrors) return <Error message={VoyagesErrors} />;
  if (ShipsErrors) return <Error message={ShipsErrors} />;
  if (PortsErrors) return <Error message={PortsErrors} />;

  if (!voyages || !ships || !ports) return null;

  const shipOptions = ships.map((ship) => ({
    label: ship.name,
    value: ship.id,
  }));

  const portOptions = ports.map((port) => ({
    label: port.name,
    value: port.id,
  }));

  const emptyVoyage: VoyageFormData = {
    ship_id: shipOptions[0]?.value ?? '',
    origin_port_id: portOptions[0]?.value ?? '',
    destination_port_id: portOptions[1]?.value ?? '',
    distance_nm: '',
    departure_date: '',
    estimated_arrival: '',
    current_load_weight_kg: '0',
    status: 'scheduled',
  };

  return (
    <GenericCrudTableTile<NormalizedVoyage, VoyageFormData>
      tableKey="voyages"
      title="voyages"
      to={to}
      expanded={expanded}
      data={voyages}
      tableInfo={VOYAGE_TABLE_TILE_INFO}
      fields={createVoyageFields(shipOptions, portOptions)}
      schema={voyageSchema}
      createInitialData={() => ({ ...emptyVoyage })}
      toFormData={(record) => ({
        ship_id: String(record.ship_id),
        origin_port_id: String(record.origin_port_id),
        destination_port_id: String(record.destination_port_id),
        distance_nm: String(record.distance_nm),
        departure_date: toDateTimeLocal(record.departure_date),
        estimated_arrival: toDateTimeLocal(record.estimated_arrival),
        current_load_weight_kg: String(record.current_load_weight_kg),
        status: record.status,
      })}
      onCreate={(formData) => {
        console.log('Create voyage:', formData);
      }}
      onUpdate={(record, formData) => {
        console.log('Update voyage:', record.id, formData);
      }}
      bodyHeight={bodyHeight}
      emptyMessage='אין הפלגות להצגה כרגע'
    />
  );
};

export default VoyagesTile;
