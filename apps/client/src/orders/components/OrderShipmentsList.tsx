import { useEffect, useState } from 'react';
import {
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';

import type { ShipmentInterface } from '@libs/united_packages';

import { getShipmentsByOrderId } from '../services/orders.api.service';
import { getErrorMessage } from '@/global/utils/algoMethods';

type Props = {
  orderId: number;
};

const getStatusLabel = (status: string): string => {
  const statuses: Record<string, string> = {
    pending: 'ממתין להקצאה',
    assigned: 'הוקצה',
    in_transit: 'בדרך',
    delivered: 'נמסר',
    cancelled: 'בוטל',
    lost: 'אבד',
    historical: 'היסטורי',
  };

  return statuses[status] ?? status;
};

const OrderShipmentsList = ({ orderId }: Props) => {
  const [shipments, setShipments] = useState<ShipmentInterface[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadShipments = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await getShipmentsByOrderId(orderId);

        if (!cancelled) {
          setShipments(data);
        }
      } catch (error) {
        if (!cancelled) {
          setError(getErrorMessage(error));
          setShipments([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadShipments();

    return () => {
      cancelled = true;
    };
  }, [orderId]);

  if (loading) {
    return <CircularProgress size={28} />;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (shipments.length === 0) {
    return <Alert severity="info">לא נמצאו משלוחים עבור הזמנה זו</Alert>;
  }

  return (
    <TableContainer sx={{ maxHeight: 400 }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>מזהה משלוח</TableCell>
            <TableCell>מוצר</TableCell>
            <TableCell>כמות</TableCell>
            <TableCell>משקל (ק״ג)</TableCell>
            <TableCell>סטטוס</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {shipments.map((shipment) => (
            <TableRow key={shipment.shipment_id}>
              <TableCell>{shipment.shipment_id}</TableCell>
              <TableCell>{shipment.product_name ?? '—'}</TableCell>
              <TableCell>{shipment.quantity ?? '—'}</TableCell>
              <TableCell>
                {shipment.total_weight_kg.toLocaleString('he-IL')}
              </TableCell>
              <TableCell>{getStatusLabel(shipment.status)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default OrderShipmentsList;
