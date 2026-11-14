import { Checkbox } from '@mui/material';

import GenericTableTile from '@/global/components/generic-table-tile/GenericTableTile';

import { SHIP_ALLOCATION_TABLE_INFO } from '../helpers/allocation-table-info';

import type { ShipAllocationRow } from '../types/allocation-view.types';
import type { TableInfoInterface } from '@/global/types/generic-table.types';

type AllocationShipsTileProps = {
  data: ShipAllocationRow[];
  selectedShipId: string | null;
  onShipSelect: (shipId: string) => void;
};

const AllocationShipsTile = ({
  data,
  selectedShipId,
  onShipSelect,
}: AllocationShipsTileProps) => {
  const tableInfo: TableInfoInterface<ShipAllocationRow>[] = [
    {
      label: 'בחירה',
      key: 'id',
      TDStyle: {
        width: 55,
        textAlign: 'center',
      },
      renderElement: (id) => (
        <Checkbox
          size="small"
          checked={selectedShipId === String(id)}
          onClick={(event) => event.stopPropagation()}
          onChange={() => onShipSelect(String(id))}
        />
      ),
    },
    ...SHIP_ALLOCATION_TABLE_INFO,
  ];

  return (
    <GenericTableTile<ShipAllocationRow>
      tableKey="allocation-ships"
      title="אוניות מתאימות"
      to="/allocation"
      expanded
      data={data}
      tableInfo={tableInfo}
      bodyHeight="220px"
    />
  );
};

export default AllocationShipsTile;