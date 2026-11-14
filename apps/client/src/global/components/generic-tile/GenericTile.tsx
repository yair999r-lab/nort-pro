import { CSSProperties, FC, ReactNode } from 'react';
import { Grid2, Paper, SxProps, Theme } from '@mui/material';
type GenericTileProps = { sx?: CSSProperties; children: ReactNode };

const GenericTile: FC<GenericTileProps> = ({ sx, children }) => {
  const GENERIC_TILE_STYLE: SxProps<Theme> = {
    bgcolor: '#4b4b4b',
    borderRadius: '12px',
    p: 1.5,
    border: 'solid 1px ' + '#999999',
    width: '100%',
    ...sx,
  };

  return (
    <Paper sx={GENERIC_TILE_STYLE}>
      <Grid2
        container
        flexDirection="column"
        sx={{
          flex: 1,
          minHeight: 0,
          minWidth: 0,
        }}
      >
        {children}
      </Grid2>
    </Paper>
  );
};

export default GenericTile;
