import type { CSSProperties } from 'react';

export const ALLOCATION_PAGE_STYLE: CSSProperties = {
  minHeight: '100vh',
  boxSizing: 'border-box',
  padding: 16,
  display: 'grid',
  gridTemplateColumns: 'minmax(320px, 0.9fr) minmax(0, 1.1fr)',
  gridTemplateAreas: '"shipments options"',
  gap: 16,
  background: '#f5f6f8',
  direction: 'rtl',
};

export const ALLOCATION_PANEL_STYLE: CSSProperties = {
  minHeight: 0,
  minWidth: 0,
  border: '1px solid #e0e3e8',
  borderRadius: 14,
  background: '#ffffff',
  overflow: 'hidden',
  boxSizing: 'border-box',
};

export const ALLOCATION_OPTIONS_STYLE: CSSProperties = {
  gridArea: 'options',
  display: 'grid',
  gridTemplateRows: 'repeat(3, minmax(220px, 1fr))',
  gap: 16,
  minHeight: 0,
  minWidth: 0,
};

export const ALLOCATION_STATE_STYLE: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 12,
  padding: 24,
  minHeight: 100,
};