import { useCallback, useMemo } from 'react';
import useHTTPRequestStatus from '../../global/hooks/useHTTPRequestStatus';
import { getErrorMessage } from '../../global/utils/algoMethods';
import { getAllOrders } from "../services/orders.api.service";
import { normalizeOrders } from '../helpers/normalize-order';
import type { NormalizedOrder } from '../types/orders.types';
const useOrders = () => {
  const [orders, loadingOrders, OrdersErrors, setOrdersStatus] =
    useHTTPRequestStatus<NormalizedOrder[]>();

  const handleGetOrders = useCallback(async () => {
    try {
      setOrdersStatus(true, null, null);
      const orders = await getAllOrders();
      setOrdersStatus(false, normalizeOrders(orders), null);
    } catch (error) {
      setOrdersStatus(false, [], getErrorMessage(error));
    }
  }, []);

  const value = useMemo(
    () => ({ orders, loadingOrders, OrdersErrors }),
    [orders, loadingOrders, OrdersErrors],
  );

  return { ...value, handleGetOrders };
};

export default useOrders;
