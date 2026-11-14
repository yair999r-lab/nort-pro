import { CSSProperties, MouseEvent } from "react";
import {
  GenericDataType,
  TableInfoInterface,
} from "../../../types/generic-table.types";
import { FilterInterface } from "../../../types/filter.types";
import SortIcon from "./sort-icon/SortIcon";
import { SortTableType } from "../../../types/sort.types";

const HEAD_STYLE: CSSProperties = {
  position: "sticky",
  top: 0,
  right: 0,
  backgroundColor: "#333333",
  color: "white",
};

type TableHeadProps<T> = {
  tableInfo: TableInfoInterface<GenericDataType>[];
  sort?: boolean;
  headerStyle?: CSSProperties;
  id?: boolean;
  onOpen: (e: MouseEvent<HTMLElement>) => void;
  handleSort: (e: MouseEvent, key: keyof T) => void;
  sortInfo: SortTableType<T>;
  addOrRemoveFilter?: (filter: FilterInterface) => void;
};

const TableHead = <T extends GenericDataType>({
  tableInfo,
  sort,
  headerStyle,
  id,
  onOpen,
  handleSort,
  sortInfo,
  addOrRemoveFilter,
}: TableHeadProps<T>) => {
  return (
    <thead data-testid="table-head" style={{ ...HEAD_STYLE, ...headerStyle }}>
      <tr>
        {id && <th>id</th>}
        {tableInfo.map((headerName, index) => (
          <th
            key={index}
            onClick={addOrRemoveFilter ? onOpen : () => {}}
            style={{ cursor: addOrRemoveFilter ? "pointer" : "default" }}
          >
            {headerName.label}
            {sort && (
              <SortIcon
                headerKey={headerName.key}
                sort={sortInfo}
                onSort={(e) => handleSort(e, headerName.key)}
              />
            )}
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default TableHead;
