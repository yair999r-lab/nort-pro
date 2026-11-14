
import type { ReactNode } from "react";
import type { SxProps, Theme } from "@mui/material";

import GenericTile from "@/global/components/generic-tile/GenericTile";
import TileHead from "@/global/components/generic-tile/tile-head/TileHead";
import TileBody from "@/global/components/generic-tile/tile-body/TileBody";

type GenericMapTileProps = {
  title: string;
  expanded: boolean;
  to?: string;
  headerActions?: ReactNode;
  bodyStyle?: SxProps<Theme>;
  children: ReactNode;
};

const GenericMapTile = ({
  title,
  expanded,
  to,
  headerActions,
  bodyStyle,
  children,
}: GenericMapTileProps) => {
  return (
    <GenericTile
      sx={{
        height: "100%",
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <TileHead
        title={title}
        to={to}
        isExpanded={expanded}
      >
        {headerActions}
      </TileHead>

      <TileBody
        bodyStyle={{
          flex: 1,
          minHeight: 0,
          minWidth: 0,
          width: "100%",
          ...bodyStyle,
        }}
      >
        {children}
      </TileBody>
    </GenericTile>
  );
};

export default GenericMapTile;
