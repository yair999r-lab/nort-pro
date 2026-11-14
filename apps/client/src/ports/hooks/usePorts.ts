
import { useCallback, useMemo } from "react";
import useHTTPRequestStatus from "@/global/hooks/useHTTPRequestStatus";
import { getErrorMessage } from "@/global/utils/algoMethods";
import type { NormalizedPort } from "@/ports/types/ports.types";
import { normalizePorts } from "@/ports/helpers/ports.normalizers";
import { getAllPorts } from "../services/ports.api.service";

const usePorts = () => {
  const [ports, loadingPorts, PortsErrors, setPortsStatus] =
    useHTTPRequestStatus<NormalizedPort[]>();

  const handleGetPorts = useCallback(async () => {
    try {
      setPortsStatus(true, null, null);

      const ports = await getAllPorts()

      setPortsStatus(false, normalizePorts(ports), null);
    } catch (error) {
      setPortsStatus(false, [], getErrorMessage(error));
    }
  }, []);

  const value = useMemo(
    () => ({ ports, loadingPorts, PortsErrors }),
    [ports, loadingPorts, PortsErrors],
  );

  return {
    ...value,
    handleGetPorts,
  };
};

export default usePorts;
