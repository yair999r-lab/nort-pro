
import { useMemo, useState } from 'react';

import {
  Box,
  Paper,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from '@mui/material';

import {
  voyages,
  routeVoyages,
  routes,
  ships,
  ports,
} from './mock-data/shippingMockData';

import type { Shipment } from './mock-data/shippingMockData';

import { findRelevantRoutes } from './mock-data/findRelevantRoutes';
import { getRequiredRouteSegments } from './mock-data/getRequiredRouteSegments';

interface Props {
  selectedShipment: Shipment | null;
}

interface VoyageRow {
  id: string;
  routeName: string;
  shipName: string;
  voyageId: string | null;
  fromPort: string;
  toPort: string;
  departureAt: string | null;
  arrivalAt: string | null;
  loadWeight: number | null;
  existing: boolean;
}

const getPortName = (portId: string) =>
  ports.find(port => port.id === portId)?.name ?? portId;

const formatDate = (date: string | null) =>
  date
    ? new Date(date).toLocaleString('he-IL')
    : '—';

export default function RoutesVoyagesTable({
  selectedShipment,
}: Props) {

  const [search, setSearch] = useState('');

  const rows = useMemo(() => {

    const relevantRoutes = selectedShipment
      ? findRelevantRoutes(selectedShipment)
      : routes;

    const result: VoyageRow[] = [];

    relevantRoutes.forEach(route => {

      const routeShip = ships.find(
        ship => ship.routeId === route.id
      );

      const routeVoyageIds = new Set(
        routeVoyages
          .filter(item => item.routeId === route.id)
          .map(item => item.voyageId)
      );

      const routeExistingVoyages = voyages.filter(
        voyage => routeVoyageIds.has(voyage.id)
      );

      const requiredSegments = selectedShipment
        ? getRequiredRouteSegments(route.id, selectedShipment)
        : null;

      // כאשר נבחר משלוח, מציגים רק את המקטעים הנדרשים לו
      if (selectedShipment && requiredSegments) {

        requiredSegments.forEach(segment => {

          const matchingVoyages = routeExistingVoyages.filter(
            voyage =>
              voyage.fromPortId === segment.fromPortId &&
              voyage.toPortId === segment.toPortId
          );

          if (matchingVoyages.length === 0) {

            result.push({
              id: `${route.id}-${segment.fromPortId}-${segment.toPortId}`,
              routeName: route.name,
              shipName: routeShip?.name ?? '—',
              voyageId: null,
              fromPort: getPortName(segment.fromPortId),
              toPort: getPortName(segment.toPortId),
              departureAt: null,
              arrivalAt: null,
              loadWeight: null,
              existing: false,
            });

            return;
          }

          matchingVoyages.forEach(voyage => {

            const voyageShip = ships.find(
              ship => ship.id === voyage.shipId
            );

            result.push({
              id: voyage.id,
              routeName: route.name,
              shipName: voyageShip?.name ?? routeShip?.name ?? '—',
              voyageId: voyage.id,
              fromPort: getPortName(voyage.fromPortId),
              toPort: getPortName(voyage.toPortId),
              departureAt: voyage.departureAt,
              arrivalAt: voyage.arrivalAt,
              loadWeight: voyage.currentLoadWeightKg,
              existing: true,
            });

          });
        });

      } else if (!selectedShipment) {

        // ללא משלוח נבחר, מציגים את כל ההפלגות המשויכות למסלולים
        routeExistingVoyages.forEach(voyage => {

          const voyageShip = ships.find(
            ship => ship.id === voyage.shipId
          );

          result.push({
            id: voyage.id,
            routeName: route.name,
            shipName: voyageShip?.name ?? routeShip?.name ?? '—',
            voyageId: voyage.id,
            fromPort: getPortName(voyage.fromPortId),
            toPort: getPortName(voyage.toPortId),
            departureAt: voyage.departureAt,
            arrivalAt: voyage.arrivalAt,
            loadWeight: voyage.currentLoadWeightKg,
            existing: true,
          });

        });
      }

    });

    return result;

  }, [selectedShipment]);

  // סינון חופשי של הטבלה
  const filteredRows = useMemo(() => {

    const value = search.trim().toLowerCase();

    if (!value) return rows;

    return rows.filter(row =>
      [
        row.routeName,
        row.shipName,
        row.voyageId ?? '',
        row.fromPort,
        row.toPort,
      ]
        .join(' ')
        .toLowerCase()
        .includes(value)
    );

  }, [rows, search]);

  return (
    <Paper sx={{ p: 2, minWidth: 0 }}>

      <Typography variant="h6" mb={2}>
        מסלולים והפלגות
      </Typography>

      <TextField
        fullWidth
        size="small"
        label="חיפוש לפי מסלול, ספינה או נמל"
        value={search}
        onChange={event => setSearch(event.target.value)}
        sx={{ mb: 2 }}
      />

      <TableContainer sx={{ maxHeight: 600 }}>
        <Table stickyHeader size="small">

          <TableHead>
            <TableRow>
              <TableCell>מסלול</TableCell>
              <TableCell>ספינה</TableCell>
              <TableCell>מקטע</TableCell>
              <TableCell>יציאה</TableCell>
              <TableCell>הגעה</TableCell>
              <TableCell>משקל קיים</TableCell>
              <TableCell>מצב</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>

            {filteredRows.map(row => (

              <TableRow key={row.id} hover>

                <TableCell>{row.routeName}</TableCell>

                <TableCell>{row.shipName}</TableCell>

                <TableCell>
                  {row.fromPort} → {row.toPort}
                </TableCell>

                <TableCell>
                  {formatDate(row.departureAt)}
                </TableCell>

                <TableCell>
                  {formatDate(row.arrivalAt)}
                </TableCell>

                <TableCell>
                  {row.loadWeight !== null
                    ? `${row.loadWeight.toLocaleString('he-IL')} ק"ג`
                    : '—'}
                </TableCell>

                <TableCell>
                  <Chip
                    size="small"
                    color={row.existing ? 'success' : 'warning'}
                    label={
                      row.existing
                        ? 'קיימת'
                        : 'אין הפלגה קיימת'
                    }
                  />
                </TableCell>

              </TableRow>

            ))}

            {filteredRows.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  לא נמצאו נתונים להצגה
                </TableCell>
              </TableRow>
            )}

          </TableBody>

        </Table>
      </TableContainer>

      <Box mt={1}>
        <Typography variant="caption" color="text.secondary">
          מוצגות {filteredRows.length} רשומות
        </Typography>
      </Box>

    </Paper>
  );
}
