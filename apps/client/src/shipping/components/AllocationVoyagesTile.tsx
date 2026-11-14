import GenericTableTile from '@/global/components/generic-table-tile/GenericTableTile';

import { VOYAGE_ALLOCATION_TABLE_INFO } from '../helpers/allocation-table-info';

import type { VoyageAllocationRow } from '../types/allocation-view.types';

type AllocationVoyagesTileProps = {
  data: VoyageAllocationRow[];
};

const AllocationVoyagesTile = ({
  data,
}: AllocationVoyagesTileProps) => {
  return (
    <GenericTableTile<VoyageAllocationRow>
      tableKey="allocation-voyages"
      title="הפלגות"
      to="/allocation"
      expanded
      data={data}
      tableInfo={VOYAGE_ALLOCATION_TABLE_INFO}
      bodyHeight="220px"
    />
  );
};

export default AllocationVoyagesTile;