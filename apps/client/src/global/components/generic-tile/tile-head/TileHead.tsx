import { Divider, Grid2 as Grid } from "@mui/material";
import {
  ChangeEvent,
  CSSProperties,
  FC,
  MouseEventHandler,
  ReactNode,
} from "react";
import {
  ColumnInfoInterface,
  ColumnInterface,
} from "../../../types/columns.types";
import LeftNavigation from "./left-navigation/LeftNavigation";
import RightNavigation from "./right-navigation/RightNavigation";
import {
  FilterInfoInterface,
  FilterInterface,
} from "../../../types/filter.types";

type TileHeadProps = {
  to?: string;
  title?: string;
  onAdd?: () => void;
  onSearch?: MouseEventHandler<HTMLButtonElement>;
  onColumn?: (
    e: ChangeEvent<HTMLInputElement>,
    columnData: ColumnInterface
  ) => void;
  columnInfo?: ColumnInfoInterface;
  onFilter?: (filter: FilterInterface) => void;
  filterInfo?: FilterInfoInterface;
  isExpanded?: boolean;
  children?: ReactNode;
  divider?: boolean;
  headStyle?: CSSProperties;
};

const TileHead: FC<TileHeadProps> = ({
  title,
  to,
  onAdd,
  onSearch,
  onColumn,
  columnInfo,
  onFilter,
  filterInfo,
  isExpanded = false,
  children,
  divider = true,
  headStyle,
}) => {
  return (
    <Grid data-testid="tile-head" display="flex" flexGrow={0} sx={headStyle}>
      <Grid container flexDirection="column" width="100%">
        <Grid>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid>{title && <RightNavigation title={title} />}</Grid>
            <Grid>
              <LeftNavigation
                columnInfo={columnInfo}
                onFilter={onFilter}
                isExpanded={isExpanded}
                children={children}
                filterInfo={filterInfo}
                onAdd={onAdd}
                onColumn={onColumn}
                onSearch={onSearch}
                to={to}
              />
            </Grid>
          </Grid>
        </Grid>
        {divider && (
          <Grid sx={{ my: 1 }}>
            <Divider sx={{ color: "white" }} />
          </Grid>
        )}
      </Grid>
    </Grid>
  );
};

export default TileHead;
