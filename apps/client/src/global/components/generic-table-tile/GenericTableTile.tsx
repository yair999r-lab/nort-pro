import useFilter from '@/global/hooks/useFilter';
import { useFilterContext } from '@/global/context/FilterContext';
import GenericTable from '@/global/components/generic-table/GenericTable';
import TileHead from '@/global/components/generic-tile/tile-head/TileHead';
import TileBody from '@/global/components/generic-tile/tile-body/TileBody';
import Error from '@/global/helpers/errors/Error';
import {
  GenericDataType,
  TableInfoInterface,
} from '@/global/types/generic-table.types';
import GenericTile from '@/global/components/generic-tile/GenericTile';
import {
  CSSProperties,
  useEffect,
  useRef,
  useState,
  type MouseEventHandler,
} from 'react';
import { RowDetailsDialog } from '@/global/components/row-details-dialog/RowDetailsDialog';
import ClearFiltersButton from './ClearFiltersButton';
import ActiveFiltersBar from './ActiveFiltersBar';

type GenericTableTileProps<T extends GenericDataType> = {
  to: string;
  expanded: boolean;
  data: T[];
  title: string;
  tableInfo: TableInfoInterface<T>[];
  tableKey: string;
  onAdd?: () => void;
  onRowSelect?: (rowId: string) => void;
  bodyHeight?: CSSProperties['height'];
  emptyMessage?: string;
};

const GenericTableTile = <T extends GenericDataType>({
  to,
  expanded,
  data,
  title,
  tableInfo,
  tableKey,
  onAdd,
  onRowSelect,
  bodyHeight,
  emptyMessage,
}: GenericTableTileProps<T>) => {
  const { selectedOptionsByTable, setSelectedOptionsForTable } =
    useFilterContext();
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);
  const savedOptions = selectedOptionsByTable[tableKey] ?? [];
  const {
    filteredData,
    selectedOptions,
    addOrRemoveFilter,
    removeFilterByKey,
    resetSelectedOption,
  } = useFilter(data);

  const restoreStarted = useRef(false);
  const [filtersInitialized, setFiltersInitialized] = useState(false);

  const handleRowClick: MouseEventHandler<HTMLElement> = (event) => {
    onRowSelect?.(event.currentTarget.id);
  };

  useEffect(() => {
    if (restoreStarted.current) return;
    restoreStarted.current = true;
    savedOptions.forEach((option) => {
      addOrRemoveFilter(option);
    });
    setFiltersInitialized(true);
  }, [selectedOptions, addOrRemoveFilter]);

  useEffect(() => {
    if (!filtersInitialized) return;
    setSelectedOptionsForTable(tableKey, selectedOptions);
  }, [
    filtersInitialized,
    tableKey,
    selectedOptions,
    setSelectedOptionsForTable,
  ]);

  // TODO: Temporary mock-data lookup.
  // After finishing the frontend, replace this with the generic server hook,
  // using tableKey + rowId. Make sure the details response includes all fields,
  // even when the table list contains only a subset of them.
  const getMockRowDetails = (rowId: string): T | null => {
    return data.find((row) => row.id === rowId) ?? null;
  };
  const selectedRow =
    selectedRowId === null ? null : getMockRowDetails(selectedRowId);

  return (
    <GenericTile>
      <TileHead title={title} to={to} isExpanded={expanded} onAdd={onAdd}>
        <ClearFiltersButton
          disabled={selectedOptions.length === 0}
          onClick={resetSelectedOption}
        />
      </TileHead>
      <ActiveFiltersBar
        selectedOptions={selectedOptions}
        onRemoveFilter={removeFilterByKey}
      />
      <TileBody
        bodyStyle={{ height: bodyHeight ?? (expanded ? '250px' : '80vh') }}
      >
        {!data || data.length === 0 ? (
          emptyMessage ? (
            <div style={{ padding: 20, textAlign: 'center' }}>
              {emptyMessage}
            </div>
          ) : (
            <Error message={`לא נמצאו ${title}`} status={404} />
          )
        ) : (
          <GenericTable
            addOrRemoveFilter={addOrRemoveFilter}
            data={filteredData}
            tableInfo={tableInfo}
            altRowColor="#737377"
            sort
            onRowClick={onRowSelect ? handleRowClick : undefined}
          />
        )}
      </TileBody>
      <RowDetailsDialog
        open={selectedRowId !== null}
        rowData={selectedRow}
        onClose={() => setSelectedRowId(null)}
      />
    </GenericTile>
  );
};

export default GenericTableTile;
