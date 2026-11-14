
import { useCallback, useMemo } from "react";
import useHTTPRequestStatus from "@/global/hooks/useHTTPRequestStatus";
import { getErrorMessage } from "@/global/utils/algoMethods";
import type { NormalizedStop } from "@/stops/types/stops.types";
import { normalizeStops } from "@/stops/helpers/stops.normalizers";
import { STOPS_MOCK } from "@/stops/mock/stops.mock";

const useStops = () => {
  const [stops, loadingStops, StopsErrors, setStopsStatus] =
    useHTTPRequestStatus<NormalizedStop[]>();

  const handleGetStops = useCallback(async () => {
    try {
      setStopsStatus(true, null, null);

      const stops = STOPS_MOCK;

      setStopsStatus(false, normalizeStops(stops), null);
    } catch (error) {
      setStopsStatus(false, [], getErrorMessage(error));
    }
  }, []);

  const value = useMemo(
    () => ({ stops, loadingStops, StopsErrors }),
    [stops, loadingStops, StopsErrors],
  );

  return {
    ...value,
    handleGetStops,
  };
};

export default useStops;
