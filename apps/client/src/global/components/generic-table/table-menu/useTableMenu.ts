import { ChangeEvent, useCallback, useMemo, useState } from "react";
import { onSetMenuItems } from "./table-menu.helpers";
import {
  GenericDataType,
  TableInfoInterface,
} from "../../../types/generic-table.types";

type ReturnTypeUseTableMenu = [
  string[],
  (e: ChangeEvent<HTMLInputElement>) => void
];

const useTableMenu = <T extends GenericDataType>(
  anchorEl: HTMLElement,
  data: T[],
  tableInfo: TableInfoInterface<T>[]
): ReturnTypeUseTableMenu => {
  const [menuItem] = useState<string[] | null>(
    onSetMenuItems(anchorEl, data, tableInfo)
  );
  const [selectedItems, setSelectedItems] = useState<string[]>(
    () => menuItem ?? []
  );

  const onChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (!menuItem) return;
      const filteredItems = menuItem.filter((selected_item) =>
        selected_item.trim().includes(e.target.value.trim())
      );
      setSelectedItems(filteredItems);
    },
    [menuItem]
  );

  const value = useMemo(() => selectedItems, [selectedItems]);

  return [value, onChange];
};

export default useTableMenu;
