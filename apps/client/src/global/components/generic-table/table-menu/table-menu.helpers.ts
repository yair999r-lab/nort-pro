import {
  GenericDataType,
  TableInfoInterface,
} from "../../../types/generic-table.types";

export const getKey = <T extends GenericDataType>(
  anchorEl: HTMLElement,
  tableInfo: TableInfoInterface<T>[]
) => {
  const headerLabel = anchorEl?.innerText.trim();
  const tableInfoItem = tableInfo.find(
    ({ label }) => label.trim() === headerLabel
  );
  return tableInfoItem ? tableInfoItem.key : null;
};

export const onSetMenuItems = <T extends GenericDataType>(
  anchorEl: HTMLElement,
  data: T[],
  tableInfo: TableInfoInterface<T>[]
) => {
  const key = getKey(anchorEl, tableInfo);
  if (!key) return null;
  const menuListArray = new Set<string>();
  data.forEach((item) => menuListArray.add(item[key]));
  return [...menuListArray];
};
