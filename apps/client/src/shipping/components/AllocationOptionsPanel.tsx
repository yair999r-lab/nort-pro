import {
  Box,
  CircularProgress,
  Typography,
  Button,
  Alert,
} from '@mui/material';

import Error from '@/global/helpers/errors/Error';

import AllocationShipsTile from './AllocationShipsTile';
import AllocationRoutesTile from './AllocationRoutesTile';
import AllocationVoyagesTile from './AllocationVoyagesTile';

import type {
  ShipAllocationRow,
  RouteAllocationRow,
  VoyageAllocationRow,
} from '../types/allocation-view.types';

import type { AllocationOption } from '../types/shipping.types';

import {
  ALLOCATION_PANEL_STYLE,
  ALLOCATION_OPTIONS_STYLE,
  ALLOCATION_STATE_STYLE,
} from '@/global/styles/allocation/allocation-page.style';

type Props = {
  hasSelectedShipment: boolean;
  selectedShipId: string | null;

  loading: boolean;
  error: string | null;

  shipRows: ShipAllocationRow[];
  routeRows: RouteAllocationRow[];
  voyageRows: VoyageAllocationRow[];

  selectedOption: AllocationOption | null;

  loadingConfirmation: boolean;
  confirmationError: string | null;
  confirmationSuccess: boolean | null;

  onAllocationSelect: (shipId: string) => void;
  onConfirmAllocation: () => Promise<boolean>;
};

const AllocationOptionsPanel = ({
  hasSelectedShipment,
  selectedShipId,
  loading,
  error,
  shipRows,
  routeRows,
  voyageRows,
  selectedOption,
  loadingConfirmation,
  confirmationError,
  confirmationSuccess,
  onAllocationSelect,
  onConfirmAllocation,
}: Props) => {
  const hasNoAllocationOptions =
    shipRows.length === 0 && routeRows.length === 0;

  const stateStyle = {
    ...ALLOCATION_STATE_STYLE,
    gridColumn: '1 / -1',
    width: '100%',
    minHeight: 180,
  };

  return (
    <section style={ALLOCATION_OPTIONS_STYLE}>
      {!hasSelectedShipment ? (
        <Box sx={stateStyle}>
          {confirmationSuccess && (
            <Alert severity="success">ההקצאה בוצעה בהצלחה!</Alert>
          )}

          <Typography color="text.secondary">
            בחר משלוח כדי להציג אפשרויות הקצאה.
          </Typography>
        </Box>
      ) : loading ? (
        <Box sx={stateStyle}>
          <CircularProgress size={28} />
          <Typography>מחשב אפשרויות הקצאה...</Typography>
        </Box>
      ) : error ? (
        <Box sx={stateStyle}>
          <Error message={error} />
        </Box>
      ) : hasNoAllocationOptions ? (
        <Box
          sx={{
            ...stateStyle,
            px: 3,
          }}
        >
          <Alert
            severity="info"
            sx={{
              width: '100%',
              maxWidth: 650,
              py: 2,
            }}
          >
            <Typography fontWeight={600} gutterBottom>
              לא נמצאו אפשרויות הקצאה
            </Typography>

            <Typography variant="body2">
              כרגע לא נמצאה אונייה שיכולה לבצע את המשלוח. ייתכן שאין מספיק דלק,
              שקיבולת הספינה אינה מספיקה, שמועד המסירה אינו אפשרי או שלא ניתן
              לחזור לנמל הבית במסגרת הזמן המותרת.
            </Typography>
          </Alert>
        </Box>
      ) : (
        <>
          {/* טבלת אוניות */}
          <div style={ALLOCATION_PANEL_STYLE}>
            <AllocationShipsTile
              data={shipRows}
              selectedShipId={selectedShipId}
              onShipSelect={onAllocationSelect}
            />
          </div>

          {/* טבלת מסלולים */}
          <div style={ALLOCATION_PANEL_STYLE}>
            <AllocationRoutesTile
              data={routeRows}
              selectedShipId={selectedShipId}
              onRouteSelect={onAllocationSelect}
            />
          </div>

          {/* טבלת הפלגות ואישור */}
          <div style={ALLOCATION_PANEL_STYLE}>
            {selectedOption ? (
              <AllocationVoyagesTile data={voyageRows} />
            ) : (
              <Typography p={3} color="text.secondary">
                בחר אונייה או מסלול כדי לראות את ההפלגות.
              </Typography>
            )}

            {confirmationError && (
              <Alert severity="error" sx={{ m: 2 }}>
                {confirmationError}
              </Alert>
            )}

            {confirmationSuccess && (
              <Alert severity="success" sx={{ m: 2 }}>
                ההקצאה בוצעה בהצלחה!
              </Alert>
            )}

            {selectedOption && (
              <Box p={2}>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  disabled={loadingConfirmation}
                  onClick={() => void onConfirmAllocation()}
                  startIcon={
                    loadingConfirmation ? (
                      <CircularProgress size={18} color="inherit" />
                    ) : undefined
                  }
                >
                  {loadingConfirmation ? 'מבצע הקצאה...' : 'אישור הקצאה'}
                </Button>
              </Box>
            )}
          </div>
        </>
      )}
    </section>
  );
};

export default AllocationOptionsPanel;
