import {
  Dialog,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
import { GenericDataType } from '@/global/types/generic-table.types';
import type { ReactNode } from 'react';

type RowDetailsDialogProps = {
  title?: string;
  showUpdateButton?: boolean;
  open: boolean;
  rowData: GenericDataType | null;
  onClose: () => void;
  children?: ReactNode;
  onUpdate?: () => void;
};

export const RowDetailsDialog = ({
  open,
  rowData,
  onClose,
  children,
  title = "פרטי הרשומה",
  showUpdateButton = true,
  onUpdate
}: RowDetailsDialogProps) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent dividers>
        {children ??
          (rowData &&
            Object.entries(rowData).map(([key, value]) => (
              <Typography key={key} sx={{ mb: 1 }}>
                <strong>{key}:</strong>{' '}
                {value == null
                  ? '—'
                  : typeof value === 'object'
                    ? JSON.stringify(value)
                    : String(value)}
              </Typography>
            )))}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>סגירה</Button>
        {showUpdateButton && onUpdate && (
            <Button onClick={onUpdate} >עדכון</Button>
        )}
      </DialogActions>
    </Dialog>
  );
};
