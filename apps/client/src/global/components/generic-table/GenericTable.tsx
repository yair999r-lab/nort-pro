import {
  CSSProperties,
  Dispatch,
  memo,
  MouseEventHandler,
  SetStateAction,
} from "react";
import {
  GenericDataType,
  TableInfoInterface,
} from "../../types/generic-table.types";
import useInfinityScroll from "../../hooks/useInfinityScroll";
import useSort from "../../hooks/useSort";
import { FilterInterface } from "../../types/filter.types";
import TableHead from "./table-head/TableHead";
import { GENERIC_TABLE_STYLE } from "../../styles/generic-table/generic-table.style";
import TableBody from "./table-body/TableBody";
import TableMenu from "./table-menu/TableMenu";
import useAnchor from "../../hooks/useAnchor";

type GenericTableProps<T> = {
  data: T[] | null;
  tableInfo: TableInfoInterface<GenericDataType>[];
  setData?: Dispatch<SetStateAction<T | null>>;
  headerStyle?: CSSProperties;
  rowStyle?: CSSProperties;
  sort?: boolean;
  id?: boolean;
  isHeaderVisible?: boolean;
  altRowColor?: CSSProperties["color"];
  onRowClick?: MouseEventHandler<HTMLElement>;
  addOrRemoveFilter?: (filter: FilterInterface) => void;
};

const GenericTable = <T extends GenericDataType>({
  data,
  tableInfo,
  setData,
  headerStyle,
  rowStyle,
  sort,
  id,
  isHeaderVisible = true,
  altRowColor,
  onRowClick,
  addOrRemoveFilter,
}: GenericTableProps<T>) => {
  const { sortData, sortInfo, handleSort } = useSort(data);
  const [ref, tableData, handleScroll] = useInfinityScroll(sortData, 50, 45);
  const { anchorEl, isPopupOpen, onOpen, onClose } = useAnchor();

  return (
    <div
      style={GENERIC_TABLE_STYLE}
      ref={ref}
      onScroll={handleScroll}
      data-testid="generic-table"
    >
      <table style={{ position: "absolute", width: "100%" }}>
        {isHeaderVisible && (
          <TableHead
            onOpen={onOpen}
            handleSort={handleSort}
            sortInfo={sortInfo}
            tableInfo={tableInfo}
            addOrRemoveFilter={addOrRemoveFilter}
            headerStyle={headerStyle}
            id={id}
            sort={sort}
          />
        )}
        <TableBody
          data={tableData}
          tableInfo={tableInfo}
          altRowColor={altRowColor}
          id={id}
          onRowClick={onRowClick}
          rowStyle={rowStyle}
          setData={setData}
        />
        {addOrRemoveFilter && anchorEl && data && (
          <TableMenu
            addOrRemoveFilter={addOrRemoveFilter}
            anchorEl={anchorEl}
            data={data}
            isPopupOpen={isPopupOpen}
            onClose={onClose}
            tableInfo={tableInfo}
          />
        )}
      </table>
    </div>
  );
};

export default memo(GenericTable);
