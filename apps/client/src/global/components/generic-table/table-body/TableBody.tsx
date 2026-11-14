import {
  CSSProperties,
  Dispatch,
  MouseEventHandler,
  SetStateAction,
} from 'react';
import {
  GenericDataType,
  TableInfoInterface,
} from '../../../types/generic-table.types';
import TableRow from './table-row/TableRow';

type TableBodyProps<T> = {
  data: T[] | null;
  tableInfo: TableInfoInterface<GenericDataType>[];
  setData?: Dispatch<SetStateAction<T | null>>;
  rowStyle?: CSSProperties;
  id?: boolean;
  altRowColor?: CSSProperties['color'];
  onRowClick?: MouseEventHandler<HTMLElement>;
};

const TableBody = <T extends GenericDataType>({
  data,
  tableInfo,
  setData,
  rowStyle,
  id,
  altRowColor,
  onRowClick,
}: TableBodyProps<T>) => {
  return (
    <tbody>
      {data &&
        data.length &&
        data.map((dataFragment, index) => (
          <TableRow
            key={index}
            data={dataFragment}
            index={index}
            tableInfo={tableInfo}
            altRowColor={altRowColor}
            id={id}
            onRowClick={onRowClick}
            rowStyle={rowStyle}
            setData={setData}
          />
        ))}
    </tbody>
  );
};

export default TableBody;
