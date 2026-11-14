import { MouseEvent } from "react";
import { SortTableType } from "../../../../types/sort.types";
import { IconButton, Tooltip } from "@mui/material";
import { KeyboardArrowDown } from "@mui/icons-material";
import {
  NOT_ROTATE_ICON,
  ROTATE_ICON,
} from "../../../../styles/sort-icon/sort-icon.style";
import { getSortArrowSx } from "./sort.helpers";

type SortIconProps<T> = {
  headerKey: keyof T;
  sort: SortTableType<T>;
  onSort: (e: MouseEvent, key: keyof T) => void;
};

const SortIcon = <T extends object>({
  headerKey,
  sort,
  onSort,
}: SortIconProps<T>) => {
  const { orderBy, direction } = sort;

  return (
    <Tooltip title="sort">
      <IconButton
        data-testid="sort-icon"
        sx={
          direction === "desc" && orderBy === headerKey
            ? ROTATE_ICON
            : NOT_ROTATE_ICON
        }
        onClick={(e) => onSort(e, headerKey)}
      >
        <KeyboardArrowDown sx={getSortArrowSx(orderBy === headerKey)} />
      </IconButton>
    </Tooltip>
  );
};

export default SortIcon;
