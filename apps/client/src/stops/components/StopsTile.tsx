import { CSSProperties, FC, useEffect } from 'react';
import useStops from '@/stops/hooks/useStops';
import useVoyages from '@/voyages/hooks/useVoyages';
import usePorts from '@/ports/hooks/usePorts';
import Error from '@/global/helpers/errors/Error';
import GenericCrudTableTile from '@/global/components/generic-table-tile/GenericCrudTableTile';
import { STOP_TABLE_TILE_INFO } from '@/stops/helpers/stops.helpers';
import type { NormalizedStop } from '@/stops/types/stops.types';
import { createStopFields, stopSchema, type StopFormData } from './StopForm';

type StopsTileProps = {
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

const StopsTile: FC<StopsTileProps> = ({ to, expanded, bodyHeight }) => {
  const { stops, loadingStops, StopsErrors, handleGetStops } = useStops();

  const { voyages, loadingVoyages, VoyagesErrors, handleGetVoyages } =
    useVoyages();

  const { ports, loadingPorts, PortsErrors, handleGetPorts } = usePorts();

  useEffect(() => {
    handleGetStops();
    handleGetVoyages();
    handleGetPorts();
  }, [handleGetStops, handleGetVoyages, handleGetPorts]);

  if (loadingStops || loadingVoyages || loadingPorts) {
    return <p>Loading...</p>;
  }

  if (StopsErrors) return <Error message={StopsErrors} />;
  if (VoyagesErrors) return <Error message={VoyagesErrors} />;
  if (PortsErrors) return <Error message={PortsErrors} />;

  if (!stops || !voyages || !ports) return null;

  const voyageOptions = voyages.map((voyage) => ({
    label: `הפלגה ${voyage.id}`,
    value: voyage.id,
  }));

  const portOptions = ports.map((port) => ({
    label: port.name,
    value: port.id,
  }));

  const emptyStop: StopFormData = {
    voyage_id: voyageOptions[0]?.value ?? '',
    port_id: portOptions[0]?.value ?? '',
    sequence_number: '1',
    estimated_arrival_at: '',
    actual_arrival_at: '',
    status: 'planned',
  };

  return (
    <GenericCrudTableTile<NormalizedStop, StopFormData>
      tableKey="stops"
      title="stops"
      to={to}
      expanded={expanded}
      data={stops}
      tableInfo={STOP_TABLE_TILE_INFO}
      fields={createStopFields(voyageOptions, portOptions)}
      schema={stopSchema}
      createInitialData={() => ({ ...emptyStop })}
      toFormData={(record) => ({
        voyage_id: String(record.voyage_id),
        port_id: String(record.port_id),
        sequence_number: String(record.sequence_number),
        estimated_arrival_at: toDateTimeLocal(record.estimated_arrival_at),
        actual_arrival_at: toDateTimeLocal(record.actual_arrival_at),
        status: record.status,
      })}
      onCreate={(formData) => {
        console.log('Create stop:', formData);
      }}
      onUpdate={(record, formData) => {
        console.log('Update stop:', record.id, formData);
      }}
      bodyHeight={bodyHeight}
    />
  );
};

export default StopsTile;
