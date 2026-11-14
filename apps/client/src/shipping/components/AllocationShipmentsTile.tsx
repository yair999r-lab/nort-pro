
import { Checkbox } from '@mui/material';

import GenericTableTile from '@/global/components/generic-table-tile/GenericTableTile';

import { SHIPMENT_ALLOCATION_TABLE_INFO } from '../helpers/allocation-table-info';

import type { ShipmentAllocationRow } from '../types/allocation-view.types';
import type { TableInfoInterface } from '@/global/types/generic-table.types';

type AllocationShipmentsTileProps = {
  data: ShipmentAllocationRow[];
  selectedShipmentIds: string[];
  onShipmentToggle: (shipmentId: string) => void;
};

const AllocationShipmentsTile = ({
  data,
  selectedShipmentIds,
  onShipmentToggle,
}: AllocationShipmentsTileProps) => {

  const tableInfo: TableInfoInterface<ShipmentAllocationRow>[] = [
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
          checked={selectedShipmentIds.includes(String(id))}
          onClick={(event) => event.stopPropagation()}
          onChange={() => onShipmentToggle(String(id))}
          inputProps={{
            'aria-label': `בחירת משלוח ${String(id)}`,
          }}
        />
      ),
    },
    ...SHIPMENT_ALLOCATION_TABLE_INFO,
  ];

  return (
    <GenericTableTile<ShipmentAllocationRow>
      tableKey="allocation-shipments"
      title="משלוחים ממתינים"
      to="/allocation"
      expanded
      data={data}
      tableInfo={tableInfo}
      bodyHeight="75vh"
    />
  );
};

export default AllocationShipmentsTile;
