import {
  CSSProperties,
  Dispatch,
  MouseEventHandler,
  SetStateAction,
} from "react";
import { getRowStyle } from "../../../../styles/generic-table/generic-table.style";
import {
  GenericDataType,
  TableInfoInterface,
} from "../../../../types/generic-table.types";
import { truncateText } from "../../../../utils/algoMethods";

type TableRowProps<T> = {
  data: T;
  index: number;
  rowStyle?: CSSProperties;
  altRowColor?: CSSProperties["color"];
  onRowClick?: MouseEventHandler<HTMLElement>;
  id?: boolean;
  tableInfo: TableInfoInterface<GenericDataType>[];
  setData?: Dispatch<SetStateAction<T | null>>;
};

const TableRow = <T extends GenericDataType>({
  data,
  index,
  rowStyle,
  altRowColor,
  onRowClick,
  id,
  tableInfo,
  setData,
}: TableRowProps<T>) => {
  return (
    <tr
      id={data.id}
      style={getRowStyle(index, altRowColor, onRowClick, rowStyle)}
      onClick={onRowClick ? onRowClick : () => {}}
    >
      {id && <td>{data.id}</td>}
      {tableInfo.map(
        ({ key, TDStyle, renderElement, truncateTextNumber = 11 }, index) => {
          if (renderElement) {
            if (setData)
              return <td key={index}>{renderElement(data[key], setData)}</td>;
            return <td key={index}>{renderElement(data[key])}</td>;
          } else
            return (
              <td
                key={index}
                style={{ padding: "6px 4px", color: "white", ...TDStyle }}
                title={String(data[key])}
              >
                {truncateText(String(data[key]), truncateTextNumber)}
              </td>
            );
        }
      )}
    </tr>
  );
};

export default TableRow;
