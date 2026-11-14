import { CSSProperties, FC, useEffect } from 'react';
import useRoutes from '@/routes/hooks/useRoutes';
import usePorts from '@/ports/hooks/usePorts';
import Error from '@/global/helpers/errors/Error';
import GenericCrudTableTile from '@/global/components/generic-table-tile/GenericCrudTableTile';
import { ROUTE_TABLE_TILE_INFO } from '@/routes/helpers/routes.helpers';
import type { NormalizedRoute } from '@/routes/types/routes.types';
import {
  createRouteFields,
  routeSchema,
  type RouteFormData,
} from './RouteForm';

type RoutesTileProps = {
  to: string;
  expanded: boolean;
  bodyHeight?: CSSProperties['height'];
};

const RoutesTile: FC<RoutesTileProps> = ({ to, expanded, bodyHeight }) => {
  const { routes, loadingRoutes, RoutesErrors, handleGetRoutes } = useRoutes();

  const { ports, loadingPorts, PortsErrors, handleGetPorts } = usePorts();

  useEffect(() => {
    handleGetRoutes();
    handleGetPorts();
  }, [handleGetRoutes, handleGetPorts]);

  if (loadingRoutes || loadingPorts) {
    return <p>Loading...</p>;
  }

  if (RoutesErrors) {
    return <Error message={RoutesErrors} />;
  }

  if (PortsErrors) {
    return <Error message={PortsErrors} />;
  }

  if (!routes || !ports) return null;

  const portOptions = ports.map((port) => ({
    label: port.name,
    value: port.id,
  }));

  const emptyRoute: RouteFormData = {
    route_name: '',
    start_port_id: portOptions[0]?.value ?? '',
    end_port_id: portOptions[1]?.value ?? '',
    total_length_nm: '',
    status: 'active',
  };

  return (
    <GenericCrudTableTile<NormalizedRoute, RouteFormData>
      tableKey="routes"
      title="routes"
      to={to}
      expanded={expanded}
      data={routes}
      tableInfo={ROUTE_TABLE_TILE_INFO}
      fields={createRouteFields(portOptions)}
      schema={routeSchema}
      createInitialData={() => ({ ...emptyRoute })}
      toFormData={(record) => ({
        route_name: record.name,
        start_port_id: record.startPortId,
        end_port_id: record.endPortId,
        total_length_nm: String(record.totalLengthNm),
        status: record.status,
      })}
      onCreate={(formData) => {
        console.log('Create route:', formData);
      }}
      onUpdate={(record, formData) => {
        console.log('Update route:', record.id, formData);
      }}
      bodyHeight={bodyHeight}
      emptyMessage='אין מסלולים להצגה כרגע'
    />
  );
};

export default RoutesTile;
