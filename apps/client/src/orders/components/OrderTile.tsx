import { CSSProperties, FC, useEffect, useState } from 'react';

import useOrders from '../hooks/useOrders';
import Error from '../../global/helpers/errors/Error';
import GenericTableTile from '../../global/components/generic-table-tile/GenericTableTile';
import { RowDetailsDialog } from '@/global/components/row-details-dialog/RowDetailsDialog';

import { ORDER_TABLE_TILE_INFO } from '../helpers/orders.helpers';
import type { NormalizedOrder } from '../types/orders.types';

import OrderShipmentsList from './OrderShipmentsList';

type OrderTileProps = {
  to: string;
  expanded: boolean;
  bodyHeight?: CSSProperties['height'];
};

const OrderTile: FC<OrderTileProps> = ({ to, expanded, bodyHeight }) => {
  const {
    OrdersErrors,
    loadingOrders,
    orders,
    handleGetOrders,
  } = useOrders();

  const [selectedOrder, setSelectedOrder] =
    useState<NormalizedOrder | null>(null);

  useEffect(() => {
    handleGetOrders();
  }, [handleGetOrders]);

  if (loadingOrders) return <p>Loading...</p>;

  if (OrdersErrors) {
    return <Error message={OrdersErrors} />;
  }

  if (!orders) return null;

  return (
    <>
      <GenericTableTile<NormalizedOrder>
        tableKey="orders"
        title="orders"
        to={to}
        expanded={expanded}
        data={orders}
        tableInfo={ORDER_TABLE_TILE_INFO}
        onRowSelect={(rowId) => {
          const order = orders.find((item) => item.id === rowId);
          setSelectedOrder(order ?? null);
        }}
        bodyHeight={bodyHeight}
        emptyMessage="לא נמצאו הזמנות"
      />

      {selectedOrder && (
        <RowDetailsDialog
          open={true}
          rowData={selectedOrder}
          title={`משלוחים של הזמנה ${selectedOrder.id}`}
          showUpdateButton={false}
          onClose={() => setSelectedOrder(null)}
        >
          <OrderShipmentsList
            orderId={Number(selectedOrder.id)}
          />
        </RowDetailsDialog>
      )}
    </>
  );
};

export default OrderTile;