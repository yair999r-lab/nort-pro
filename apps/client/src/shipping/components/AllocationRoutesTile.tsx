
import { Checkbox } from '@mui/material';

import GenericTableTile from '@/global/components/generic-table-tile/GenericTableTile';

import { ROUTE_ALLOCATION_TABLE_INFO } from '../helpers/allocation-table-info';

import type { RouteAllocationRow } from '../types/allocation-view.types';
import type { TableInfoInterface } from '@/global/types/generic-table.types';

type AllocationRoutesTileProps = {
  data: RouteAllocationRow[];
  selectedShipId: string | null;
  onRouteSelect: (shipId: string) => void;
};

const AllocationRoutesTile = ({
  data,
  selectedShipId,
  onRouteSelect,
}: AllocationRoutesTileProps) => {
  const tableInfo: TableInfoInterface<RouteAllocationRow>[] = [
    {
      label: 'בחירה',
      key: 'shipId',
      TDStyle: {
        width: 55,
        textAlign: 'center',
      },
      renderElement: (shipId) => (
        <Checkbox
          size="small"
          checked={selectedShipId === String(shipId)}
          onClick={(event) => event.stopPropagation()}
          onChange={() => onRouteSelect(String(shipId))}
        />
      ),
    },
    ...ROUTE_ALLOCATION_TABLE_INFO,
  ];

  return (
    <GenericTableTile<RouteAllocationRow>
      tableKey="allocation-routes"
      title="מסלולים מתאימים"
      to="/allocation"
      expanded
      data={data}
      tableInfo={tableInfo}
      bodyHeight="220px"
    />
  );
};

export default AllocationRoutesTile;
