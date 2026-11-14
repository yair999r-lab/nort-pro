import { useEffect, useMemo, useState } from 'react';

import {
  Alert,
  Box,
  Chip,
  CircularProgress,
  Divider,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

import useShipping from '../hooks/useShipping';

import type { Port, Ship, Shipment } from '../types/shipping.types';

// עיצוב תאריך ושעה
const formatDate = (date: string | null): string => {
  if (!date) return 'לא צוין';

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return parsedDate.toLocaleString('he-IL', {
    dateStyle: 'short',
    timeStyle: 'short',
  });
};

// מציאת שם הנמל לפי המזהה
const getPortName = (ports: Port[], portId: string) => {
  return ports.find((port) => port.id === portId)?.name ?? portId;
};

// מציאת שם האונייה לפי המזהה
const getShipName = (ships: Ship[], shipId: string) => {
  return ships.find((ship) => ship.id === shipId)?.name ?? shipId;
};

export default function ShipmentAllocation() {
  const {
    shippingData,
    loadingShipping,
    shippingErrors,
    handleGetShippingData,
    allocationOptions,
    loadingAllocationOptions,
    allocationOptionsErrors,
    handleGetAllocationOptions,
  } = useShipping();

  const [selectedShipmentId, setSelectedShipmentId] = useState<string | null>(
    null,
  );

  // טעינת הנתונים מהשרת בכניסה לעמוד
  useEffect(() => {
    void handleGetShippingData();

    // טעינה חד-פעמית בכניסה לעמוד.
    // לא מוסיפים את handleGetShippingData לתלויות,
    // כדי למנוע טעינה חוזרת בעקבות שינוי זהות הפונקציה ב-Hook הקיים.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // נתוני המשלוחים שהגיעו מהשרת
  const shipments = shippingData?.shipments ?? [];

  // נתונים נוספים שהגיעו מהשרת
  const ports = shippingData?.ports ?? [];
  const ships = shippingData?.ships ?? [];
  const routes = shippingData?.routes ?? [];
  const voyages = shippingData?.voyages ?? [];

  // משלוחים שממתינים להקצאה
  const pendingShipments = useMemo(
    () => shipments.filter((shipment) => shipment.status === 'pending'),
    [shipments],
  );

  // המשלוח שנבחר
  const selectedShipment = shipments.find(
    (shipment) => shipment.id === selectedShipmentId,
  );

  // מציאת שם המסלול של אונייה
  const getRouteNameForShip = (shipId: string) => {
    const ship = ships.find((item) => item.id === shipId);

    const route = routes.find((item) => item.id === ship?.routeId);

    return route?.name ?? 'לא ידוע';
  };

  // מצבי טעינה ושגיאה
  if (loadingShipping || (!shippingData && !shippingErrors)) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="300px"
        gap={2}
      >
        <CircularProgress />
        <Typography>טוען נתוני שילוח מהשרת...</Typography>
      </Box>
    );
  }

  if (shippingErrors) {
    return (
      <Box p={3}>
        <Alert severity="error">
          שגיאה בטעינת נתוני השילוח: {shippingErrors}
        </Alert>
      </Box>
    );
  }

  if (!shippingData) {
    return (
      <Box p={3}>
        <Alert severity="warning">לא התקבלו נתוני שילוח מהשרת.</Alert>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          lg: '300px minmax(0, 1fr)',
        },
        gap: 3,
        p: 3,
      }}
    >
      {/* רשימת משלוחים */}

      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" mb={2}>
          משלוחים ממתינים
        </Typography>

        <List disablePadding>
          {pendingShipments.map((shipment: Shipment) => (
            <ListItemButton
              key={shipment.id}
              selected={selectedShipmentId === shipment.id}
              divider
              onClick={() => {
                setSelectedShipmentId(shipment.id);
                void handleGetAllocationOptions(shipment.id);
              }}
            >
              <ListItemText
                primary={`${shipment.id} - ${shipment.description}`}
                secondary={`
                  מוצא: ${getPortName(ports, shipment.originPortId)} |
                  יעד: ${getPortName(ports, shipment.destinationPortId)} |
                  ${shipment.weightKg.toLocaleString('he-IL')} ק"ג
                `}
              />
            </ListItemButton>
          ))}

          {pendingShipments.length === 0 && (
            <Typography color="text.secondary" sx={{ p: 2 }}>
              אין משלוחים ממתינים להקצאה.
            </Typography>
          )}
        </List>
      </Paper>

      {/* נתונים שהתקבלו מהשרת */}

      <Stack spacing={3}>
        <Box>
          <Typography variant="h5" mb={2}>
            מערכת הקצאות שילוח
          </Typography>

          <Stack direction="row" flexWrap="wrap" gap={1}>
            <Chip label={`נמלים: ${ports.length}`} />
            <Chip label={`אוניות: ${ships.length}`} />
            <Chip label={`מסלולים: ${routes.length}`} />
            <Chip label={`משלוחים: ${shipments.length}`} />
            <Chip label={`הפלגות: ${voyages.length}`} />
          </Stack>
        </Box>

        {/* פרטי המשלוח שנבחר */}

        {!selectedShipment && (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography color="text.secondary">
              בחר משלוח כדי לראות את פרטיו.
            </Typography>
          </Paper>
        )}

        {selectedShipment && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" mb={2}>
              פרטי המשלוח
            </Typography>

            <Typography fontWeight="bold">
              {selectedShipment.id} - {selectedShipment.description}
            </Typography>

            <Typography color="text.secondary">
              מוצא: {getPortName(ports, selectedShipment.originPortId)}
            </Typography>

            <Typography color="text.secondary">
              יעד: {getPortName(ports, selectedShipment.destinationPortId)}
            </Typography>

            <Typography color="text.secondary">
              משקל: {selectedShipment.weightKg.toLocaleString('he-IL')} ק"ג
            </Typography>

            <Typography color="text.secondary">
              מועד הגעה נדרש: {formatDate(selectedShipment.requiredArrival)}
            </Typography>

            <Typography color="text.secondary">
              סטטוס: {selectedShipment.status}
            </Typography>
          </Paper>
        )}

        <Divider />
        {/* אפשרויות הקצאה מהשרת */}

        {selectedShipment && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" mb={2}>
              אפשרויות הובלה
            </Typography>

            {loadingAllocationOptions && (
              <Box display="flex" alignItems="center" gap={2}>
                <CircularProgress size={22} />
                <Typography>מחשב אפשרויות הקצאה...</Typography>
              </Box>
            )}

            {allocationOptionsErrors && (
              <Alert severity="error">{allocationOptionsErrors}</Alert>
            )}

            {!loadingAllocationOptions &&
              !allocationOptionsErrors &&
              allocationOptions !== null &&
              allocationOptions.length === 0 && (
                <Alert severity="info">
                  לא נמצאו אפשרויות הובלה מתאימות למשלוח זה.
                </Alert>
              )}

            {!loadingAllocationOptions &&
              allocationOptions?.map((option) => {
                const route = routes.find((item) => item.id === option.routeId);

                return (
                  <Paper
                    key={option.shipId}
                    variant="outlined"
                    sx={{ p: 2, mb: 2 }}
                  >
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      mb={2}
                    >
                      <Typography variant="h6">{option.shipName}</Typography>

                      <Chip
                        label={route?.name ?? option.routeId}
                        color="primary"
                        variant="outlined"
                      />
                    </Stack>

                    <Typography variant="body2">
                      הגעה לנמל המוצא: {formatDate(option.arrivalAtOrigin)}
                    </Typography>

                    <Typography variant="body2">
                      הגעה לנמל היעד: {formatDate(option.arrivalAtDestination)}
                    </Typography>

                    <Divider sx={{ my: 2 }} />

                    <Typography fontWeight="medium" mb={1}>
                      מקטעי ההפלגה
                    </Typography>

                    {option.voyages.map((voyage, index) => (
                      <Box key={`${option.shipId}-${index}`} mb={1}>
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Typography variant="body2">
                            {getPortName(ports, voyage.fromPortId)}
                            {' → '}
                            {getPortName(ports, voyage.toPortId)}
                          </Typography>

                          <Chip
                            size="small"
                            color={
                              voyage.type === 'existing' ? 'success' : 'info'
                            }
                            label={
                              voyage.type === 'existing'
                                ? 'הפלגה קיימת'
                                : 'תיווצר באישור'
                            }
                          />
                        </Stack>

                        <Typography variant="caption" color="text.secondary">
                          יציאה: {formatDate(voyage.departureAt)}
                          {' | '}
                          הגעה: {formatDate(voyage.arrivalAt)}
                        </Typography>
                      </Box>
                    ))}
                  </Paper>
                );
              })}
          </Paper>
        )}
        <Divider />

        {/* טבלת ההפלגות שהתקבלו מהשרת */}

        <Box>
          <Typography variant="h6" mb={2}>
            הפלגות קיימות
          </Typography>

          {voyages.length === 0 ? (
            <Alert severity="info">אין הפלגות רשומות כרגע.</Alert>
          ) : (
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>אונייה</TableCell>
                    <TableCell>מסלול</TableCell>
                    <TableCell>מקטע</TableCell>
                    <TableCell>יציאה</TableCell>
                    <TableCell>הגעה</TableCell>
                    <TableCell>משקל מטען</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {voyages.map((voyage) => (
                    <TableRow key={voyage.id}>
                      <TableCell>{getShipName(ships, voyage.shipId)}</TableCell>

                      <TableCell>
                        {getRouteNameForShip(voyage.shipId)}
                      </TableCell>

                      <TableCell>
                        {getPortName(ports, voyage.fromPortId)}
                        {' → '}
                        {getPortName(ports, voyage.toPortId)}
                      </TableCell>

                      <TableCell>{formatDate(voyage.departureAt)}</TableCell>

                      <TableCell>{formatDate(voyage.arrivalAt)}</TableCell>

                      <TableCell>
                        {voyage.currentLoadWeightKg.toLocaleString('he-IL')} ק"ג
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </Stack>
    </Box>
  );
}
