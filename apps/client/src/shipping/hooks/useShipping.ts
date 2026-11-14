import { useCallback, useMemo } from 'react';

import useHTTPRequestStatus from '../../global/hooks/useHTTPRequestStatus';
import { getErrorMessage } from '../../global/utils/algoMethods';

import {
  getShippingData,
  getAllocationOptions,
  confirmAllocation,
} from '../services/shipping.api.service';

import type { ShippingData, AllocationOption } from '../types/shipping.types';

const useShipping = () => {
  // נתוני השילוח
  const [shippingData, loadingShipping, shippingErrors, setShippingStatus] =
    useHTTPRequestStatus<ShippingData>();

  // אפשרויות הקצאה
  const [
    allocationOptions,
    loadingAllocationOptions,
    allocationOptionsErrors,
    setAllocationOptionsStatus,
  ] = useHTTPRequestStatus<AllocationOption[]>();

  // אישור הקצאה
  const [
    allocationConfirmation,
    loadingAllocationConfirmation,
    allocationConfirmationErrors,
    setAllocationConfirmationStatus,
  ] = useHTTPRequestStatus<boolean>();

  // טעינת נתוני השילוח
  const handleGetShippingData = useCallback(async () => {
    try {
      setShippingStatus(true, null, null);

      const data = await getShippingData();

      setShippingStatus(false, data, null);
    } catch (error) {
      setShippingStatus(false, null, getErrorMessage(error));
    }
  }, [setShippingStatus]);

  // טעינת אפשרויות הקצאה למשלוח
  const handleGetAllocationOptions = useCallback(
    async (shipmentId: string) => {
      try {
        setAllocationOptionsStatus(true, null, null);

        const options = await getAllocationOptions(shipmentId);

        setAllocationOptionsStatus(false, options, null);
      } catch (error) {
        setAllocationOptionsStatus(false, [], getErrorMessage(error));
      }
    },
    [setAllocationOptionsStatus],
  );

  // אישור הקצאת משלוח לאונייה
  const handleConfirmAllocation = useCallback(
    async (shipmentId: string, shipId: string) => {
      try {
        setAllocationConfirmationStatus(true, null, null);

        await confirmAllocation(shipmentId, shipId);

        setAllocationConfirmationStatus(false, true, null);

        // ניקוי אפשרויות ההקצאה הישנות
        setAllocationOptionsStatus(false, null, null);

        // טעינה מחדש של נתוני השילוח
        await handleGetShippingData();
      } catch (error) {
        setAllocationConfirmationStatus(false, false, getErrorMessage(error));
        return false;
      }
    },
    [
      setAllocationConfirmationStatus,
      setAllocationOptionsStatus,
      handleGetShippingData,
    ],
  );
  const value = useMemo(
    () => ({
      shippingData,
      loadingShipping,
      shippingErrors,
      allocationOptions,
      loadingAllocationOptions,
      allocationOptionsErrors,
    }),
    [
      shippingData,
      loadingShipping,
      shippingErrors,
      allocationOptions,
      loadingAllocationOptions,
      allocationOptionsErrors,
    ],
  );

  return {
    ...value,
    handleGetShippingData,
    handleGetAllocationOptions,
    allocationConfirmation,
    loadingAllocationConfirmation,
    allocationConfirmationErrors,
    handleConfirmAllocation,
  };
};

export default useShipping;
