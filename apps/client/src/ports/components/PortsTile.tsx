
import { CSSProperties, FC, useEffect } from "react";
import usePorts from "@/ports/hooks/usePorts";
import Error from "@/global/helpers/errors/Error";
import GenericCrudTableTile from "@/global/components/generic-table-tile/GenericCrudTableTile";
import { PORT_TABLE_TILE_INFO } from "@/ports/helpers/ports.helpers";
import type { NormalizedPort } from "@/ports/types/ports.types";
import {
  portFields,
  portSchema,
  type PortFormData,
} from "./PortForm";

type PortsTileProps = {
  to: string;
  expanded: boolean;
  bodyHeight?: CSSProperties["height"];
};

const emptyPort: PortFormData = {
  name: "",
  longitude: "",
  latitude: "",
  status: "active",
};

const PortsTile: FC<PortsTileProps> = ({ to, expanded, bodyHeight }) => {
  const {
    PortsErrors,
    loadingPorts,
    ports,
    handleGetPorts,
  } = usePorts();

  useEffect(() => {
    handleGetPorts();
  }, [handleGetPorts]);

  if (loadingPorts) return <p>Loading...</p>;

  if (PortsErrors) {
    return <Error message={PortsErrors} />;
  }

  if (!ports) return null;

  return (
    <GenericCrudTableTile<NormalizedPort, PortFormData>
      tableKey="ports"
      title="ports"
      to={to}
      expanded={expanded}
      data={ports}
      tableInfo={PORT_TABLE_TILE_INFO}
      fields={portFields}
      schema={portSchema}
      createInitialData={() => ({ ...emptyPort })}
      toFormData={(record) => ({
        name: record.name,
        longitude: record.longitude === null ? '' : String(record.longitude),
latitude: record.latitude === null ? '' : String(record.latitude),
        status: record.status,
      })}
      onCreate={(formData) => {
        console.log("Create port:", formData);
      }}
      onUpdate={(record, formData) => {
        console.log("Update port:", record.id, formData);
      }}
      bodyHeight={bodyHeight}
    />
  );
};

export default PortsTile;
