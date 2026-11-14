import { CSSProperties, MouseEvent, useCallback } from "react";
import { FilterInterface } from "../../../types/filter.types";
import {
  GenericDataType,
  TableInfoInterface,
} from "../../../types/generic-table.types";
import useTableMenu from "./useTableMenu";
import { Grid2 as Grid, Menu } from "@mui/material";
import SearchInput from "../../search-input/SearchInput";
import { getMenuItemStyle } from "./table-menu.style";
import { getKey } from "./table-menu.helpers";

type TableMenuProps<T> = {
  anchorEl: HTMLElement;
  data: T[];
  tableInfo: TableInfoInterface<T>[];
  addOrRemoveFilter: (filter: FilterInterface) => void;
  isPopupOpen: boolean;
  onClose: () => void;
  menuItemBorderColor?: CSSProperties["color"];
};

const TableMenu = <T extends GenericDataType>({
  anchorEl,
  data,
  tableInfo,
  addOrRemoveFilter,
  isPopupOpen,
  onClose,
  menuItemBorderColor,
}: TableMenuProps<T>) => {
  const [selectedItems, onChange] = useTableMenu(anchorEl, data, tableInfo);
  const LABEL = anchorEl ? anchorEl.innerText.trim() : "";

  const onClick = useCallback(
    (e: MouseEvent<HTMLParagraphElement>) => {
      addOrRemoveFilter({
        key: getKey(anchorEl, tableInfo)!,
        label: LABEL,
        value: e.currentTarget.innerText.trim(),
      });
    },
    [anchorEl, tableInfo, LABEL]
  );

  return (
    <Menu
      data-testid="table-menu"
      sx={{ maxHeight: 283 }}
      open={isPopupOpen}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
      MenuListProps={{ style: { padding: 0 } }}
    >
      <Grid container flexDirection="column">
        <Grid>
          <SearchInput onChange={onChange} placeholder={LABEL} />
        </Grid>
        {selectedItems &&
          selectedItems.map((item, i) => (
            <p
              key={i}
              style={getMenuItemStyle(menuItemBorderColor)}
              onClick={onClick}
            >
              {String(item)}
            </p>
          ))}
      </Grid>
    </Menu>
  );
};

export default TableMenu;
