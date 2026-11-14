
import { useCallback, useMemo } from "react";
import useHTTPRequestStatus from "@/global/hooks/useHTTPRequestStatus";
import { getErrorMessage } from "@/global/utils/algoMethods";
import type { NormalizedRoute } from "@/routes/types/routes.types";
import { getAllRoutes } from '@/routes/services/routes.api.service';

const useRoutes = () => {
  const [routes, loadingRoutes, RoutesErrors, setRoutesStatus] =
    useHTTPRequestStatus<NormalizedRoute[]>();

  const handleGetRoutes = useCallback(async () => {
    try {
      setRoutesStatus(true, null, null);

     const routes = await getAllRoutes();

setRoutesStatus(false, routes, null);
    } catch (error) {
      setRoutesStatus(false, [], getErrorMessage(error));
    }
  }, []);

  const value = useMemo(
    () => ({ routes, loadingRoutes, RoutesErrors }),
    [routes, loadingRoutes, RoutesErrors],
  );

  return {
    ...value,
    handleGetRoutes,
  };
};

export default useRoutes;
