import { Box, CircularProgress, Typography } from '@mui/material';

import Error from '@/global/helpers/errors/Error';

import AllocationShipmentsTile from '@/shipping/components/AllocationShipmentsTile';
import AllocationOptionsPanel from '@/shipping/components/AllocationOptionsPanel';

import useAllocationPage from '@/shipping/hooks/useAllocationPage';

import {
  ALLOCATION_PAGE_STYLE,
  ALLOCATION_PANEL_STYLE,
  ALLOCATION_STATE_STYLE,
} from '@/global/styles/allocation/allocation-page.style';

const AllocationPage = () => {
  const {
    shipmentRows,
    shipRows,
    routeRows,
    voyageRows,
    selectedShipmentId,
    selectedOption,
    loadingShipping,
    shippingErrors,
    loadingAllocationOptions,
    allocationOptionsErrors,
    handleShipmentToggle,
    selectedShipmentIds,
    handleAllocationSelect,
    selectedShipId,
    loadingAllocationConfirmation,
    allocationConfirmationErrors,
    allocationConfirmation,
    handleConfirmSelectedAllocation,
  } = useAllocationPage();

  if (loadingShipping) {
    return (
      <Box sx={ALLOCATION_STATE_STYLE}>
        <CircularProgress />
        <Typography>טוען נתוני שילוח...</Typography>
      </Box>
    );
  }

  if (shippingErrors) {
    return <Error message={shippingErrors} />;
  }

  return (
    <div style={ALLOCATION_PAGE_STYLE}>
      <section
        style={{
          ...ALLOCATION_PANEL_STYLE,
          gridArea: 'shipments',
        }}
      >
        <AllocationShipmentsTile
          data={shipmentRows}
          onShipmentToggle={handleShipmentToggle}
          selectedShipmentIds={selectedShipmentIds}
        />
      </section>

      <AllocationOptionsPanel
        hasSelectedShipment={selectedShipmentId !== null}
        selectedShipId={selectedShipId}
        loading={loadingAllocationOptions}
        error={allocationOptionsErrors}
        shipRows={shipRows}
        routeRows={routeRows}
        voyageRows={voyageRows}
        selectedOption={selectedOption}
        loadingConfirmation={loadingAllocationConfirmation}
        confirmationError={allocationConfirmationErrors}
        confirmationSuccess={allocationConfirmation}
        onAllocationSelect={handleAllocationSelect}
        onConfirmAllocation={handleConfirmSelectedAllocation}
      />
    </div>
  );
};

export default AllocationPage;
