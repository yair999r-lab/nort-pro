import { useEffect, useMemo, useState } from 'react';
import useShipping from './useShipping';

import {
  buildShipmentAllocationRows,
  buildShipAllocationRows,
  buildRouteAllocationRows,
  buildVoyageAllocationRows,
} from '../helpers/allocation-table-data.helpers';

const useAllocationPage = () => {
  const {
    shippingData,
    loadingShipping,
    shippingErrors,
    handleGetShippingData,
    allocationOptions,
    loadingAllocationOptions,
    allocationOptionsErrors,
    handleGetAllocationOptions,
    allocationConfirmation,
    loadingAllocationConfirmation,
    allocationConfirmationErrors,
    handleConfirmAllocation,
  } = useShipping();

  const [selectedShipmentId, setSelectedShipmentId] = useState<string | null>(
    null,
  );

  const [selectedShipmentIds, setSelectedShipmentIds] = useState<string[]>([]);
  const [selectedShipId, setSelectedShipId] = useState<string | null>(null);

  useEffect(() => {
    void handleGetShippingData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleShipmentToggle = (shipmentId: string) => {
    const isSelected = selectedShipmentIds.includes(shipmentId);

    // ביטול בחירה
    if (isSelected) {
      const nextSelectedIds = selectedShipmentIds.filter(
        (id) => id !== shipmentId,
      );

      setSelectedShipmentIds(nextSelectedIds);

      // אם ביטלנו את המשלוח הפעיל, עוברים לאחרון שנשאר
      if (selectedShipmentId === shipmentId) {
        const nextActiveId =
          nextSelectedIds[nextSelectedIds.length - 1] ?? null;

        setSelectedShipmentId(nextActiveId);
        setSelectedShipId(null);

        if (nextActiveId) {
          void handleGetAllocationOptions(nextActiveId);
        }
      }

      return;
    }

    // הוספת בחירה
    setSelectedShipmentIds((prev) => [...prev, shipmentId]);
    setSelectedShipmentId(shipmentId);
    setSelectedShipId(null);

    void handleGetAllocationOptions(shipmentId);
  };

  const handleAllocationSelect = (shipId: string) => {
    setSelectedShipId((prev) => (prev === shipId ? null : shipId));
  };

  const shipmentRows = useMemo(
    () => (shippingData ? buildShipmentAllocationRows(shippingData) : []),
    [shippingData],
  );

  const shipRows = useMemo(
    () =>
      shippingData
        ? buildShipAllocationRows(shippingData, allocationOptions ?? [])
        : [],
    [shippingData, allocationOptions],
  );

  const routeRows = useMemo(
    () =>
      shippingData
        ? buildRouteAllocationRows(shippingData, allocationOptions ?? [])
        : [],
    [shippingData, allocationOptions],
  );

  const selectedOption = useMemo(
    () =>
      allocationOptions?.find((option) => option.shipId === selectedShipId) ??
      null,
    [allocationOptions, selectedShipId],
  );

  const voyageRows = useMemo(
    () =>
      shippingData
        ? buildVoyageAllocationRows(shippingData, selectedOption)
        : [],
    [shippingData, selectedOption],
  );

  const handleConfirmSelectedAllocation = async (): Promise<boolean> => {
    if (!selectedShipmentId || !selectedShipId) {
      return false;
    }

    const success = await handleConfirmAllocation(
      selectedShipmentId,
      selectedShipId,
    );

    if (!success) {
      return false;
    }

    // הסרת המשלוח שהוקצה מרשימת הבחירות
    setSelectedShipmentIds((prev) =>
      prev.filter((id) => id !== selectedShipmentId),
    );

    // ניקוי הבחירות הפעילות
    setSelectedShipmentId(null);
    setSelectedShipId(null);

    return true;
  };

  return {
    shipmentRows,
    shipRows,
    routeRows,
    voyageRows,

    selectedShipmentId,
    selectedShipId,
    selectedOption,

    loadingShipping,
    shippingErrors,
    loadingAllocationOptions,
    allocationOptionsErrors,

    selectedShipmentIds,
    handleShipmentToggle,
    handleAllocationSelect,
    allocationConfirmation,
    loadingAllocationConfirmation,
    allocationConfirmationErrors,
    handleConfirmSelectedAllocation,
  };
};

export default useAllocationPage;
