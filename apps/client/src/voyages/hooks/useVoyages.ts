
import { useCallback, useMemo } from "react";
import useHTTPRequestStatus from "@/global/hooks/useHTTPRequestStatus";
import { getErrorMessage } from "@/global/utils/algoMethods";
import type { NormalizedVoyage } from "@/voyages/types/voyages.types";
import { normalizeVoyages } from "@/voyages/helpers/voyages.normalizers";
import { getAllVoyages } from "@/voyages/services/voyages.api.service";
const useVoyages = () => {
  const [voyages, loadingVoyages, VoyagesErrors, setVoyagesStatus] =
    useHTTPRequestStatus<NormalizedVoyage[]>();

  const handleGetVoyages = useCallback(async () => {
    try {
      setVoyagesStatus(true, null, null);

      const voyages = await getAllVoyages();

      setVoyagesStatus(false, normalizeVoyages(voyages), null);
    } catch (error) {
      setVoyagesStatus(false, [], getErrorMessage(error));
    }
  }, []);

  const value = useMemo(
    () => ({ voyages, loadingVoyages, VoyagesErrors }),
    [voyages, loadingVoyages, VoyagesErrors],
  );

  return {
    ...value,
    handleGetVoyages,
  };
};

export default useVoyages;
