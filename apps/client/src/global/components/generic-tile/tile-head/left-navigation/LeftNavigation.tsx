import { ChangeEvent, FC, MouseEventHandler, ReactNode } from 'react';
import { Grid2 as Grid, IconButton, Tooltip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import NavLink from '../../../../routes/components/NavLink';
import ExpendIconSelector from './expend-icon-selector/ExpendIconSelector';
import {
  ColumnInfoInterface,
  ColumnInterface,
} from '../../../../types/columns.types';
import {
  FilterInfoInterface,
  FilterInterface,
} from '../../../../types/filter.types';

type LeftNavigationProps = {
  to?: string;
  onAdd?: MouseEventHandler<HTMLButtonElement>;
  onSearch?: MouseEventHandler<HTMLButtonElement>;
  isExpanded: boolean;
  children?: ReactNode;
  columnInfo?: ColumnInfoInterface;
  onFilter?: (filter: FilterInterface) => void;
  filterInfo?: FilterInfoInterface;
  onColumn?: (
    e: ChangeEvent<HTMLInputElement>,
    columnData: ColumnInterface,
  ) => void;
};

const LeftNavigation: FC<LeftNavigationProps> = ({
  to,
  onAdd,
  onSearch,
  isExpanded,
  children,
  onColumn,
  columnInfo,
  onFilter,
  filterInfo,
}) => {
  return (
    <Grid container alignItems="center" flexDirection="row" gap={1}>
      {children && <Grid>{children}</Grid>}
      {onAdd && (
        <Tooltip title="פתיחת טופס הוספה">
          <IconButton onClick={onAdd} sx={{ p: 0 }}>
            <AddIcon />
          </IconButton>
        </Tooltip>
      )}
      {onSearch && (
        <Grid>
          <IconButton onClick={onSearch} sx={{ p: 0 }}>
            <SearchIcon />
          </IconButton>
        </Grid>
      )}
      {onFilter && filterInfo && <span>filter icon</span>}
      {onColumn && columnInfo && <span>column icon</span>}
      {to && (
        <Tooltip title={isExpanded ? 'חזרה לתצוגת לוח' : 'מעבר לעמוד המלא'}>
          <span>
            <NavLink to={to}>
              <ExpendIconSelector isExpends={isExpanded} />
            </NavLink>
          </span>
        </Tooltip>
      )}
    </Grid>
  );
};

export default LeftNavigation;
