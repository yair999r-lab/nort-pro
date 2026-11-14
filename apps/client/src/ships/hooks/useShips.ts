import { useCallback, useMemo } from 'react';
import useHTTPRequestStatus from '@/global/hooks/useHTTPRequestStatus';
import { getErrorMessage } from '@/global/utils/algoMethods';
import { NormalizedShip } from '@/ships/types/ships.types';
import { normalizeShips } from '@/ships/helpers/ships.normalizers';
import { getAllShips } from '@/ships/services/ships.api.service';

const useShips = () => {
  const [ships, loadingShips, ShipsErrors, setShipsStatus] =
    useHTTPRequestStatus<NormalizedShip[]>();
  const handleGetShips = useCallback(async () => {
    try {
      setShipsStatus(true, null, null);
      const ships = await getAllShips();
      setShipsStatus(false, normalizeShips(ships), null);
    } catch (error) {
      setShipsStatus(false, [], getErrorMessage(error));
    }
  }, []);
  const value = useMemo(
    () => ({ ships, loadingShips, ShipsErrors }),
    [ships, loadingShips, ShipsErrors],
  );
  return {
    ...value,
    handleGetShips,
  };
};

export default useShips;
