import type { GenericDataType } from '@/global/types/generic-table.types';
import { useState } from 'react';

import GenericTableTile from './GenericTableTile';
import { RowDetailsDialog } from '@/global/components/row-details-dialog/RowDetailsDialog';
import GenericDynamicForm from '@/global/forms/components/generic-form/GenericDynamicForm';
import { GenericCrudTableTileProps } from '../../types/generic-crud-table-tile.type';

const GenericCrudTableTile = <
  TRecord extends GenericDataType,
  TForm extends { [key: string]: any },
>({
  to,
  expanded,
  data,
  title,
  tableInfo,
  tableKey,
  fields,
  schema,
  createInitialData,
  toFormData,
  onCreate,
  onUpdate,
  bodyHeight,
  emptyMessage
  
}: GenericCrudTableTileProps<TRecord, TForm>) => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const [selectedRecord, setSelectedRecord] = useState<TRecord | null>(null);

  const [isEditMode, setIsEditMode] = useState(false);

  const [createFormVersion, setCreateFormVersion] = useState(0);

  const handleOpenCreate = () => {
    setCreateFormVersion((prev) => prev + 1);
    setIsCreateDialogOpen(true);
  };

  const handleCloseCreate = () => {
    setIsCreateDialogOpen(false);
  };

  const handleRowSelect = (rowId: string) => {
    const record = data.find((item) => item.id === rowId) ?? null;

    setSelectedRecord(record);
    setIsEditMode(false);
  };

  const handleCloseDetails = () => {
    setSelectedRecord(null);
    setIsEditMode(false);
  };

  const handleOpenEdit = () => {
    setIsEditMode(true);
  };

  const handleCreateSubmit = (formData: TForm) => {
    onCreate(formData);
    handleCloseCreate();
  };

  const handleUpdateSubmit = (formData: TForm) => {
    if (!selectedRecord) return;

    onUpdate(selectedRecord, formData);
    handleCloseDetails();
  };

  return (
    <>
      <GenericTableTile
        tableKey={tableKey}
        title={title}
        to={to}
        expanded={expanded}
        data={data}
        tableInfo={tableInfo}
        onAdd={!expanded ? handleOpenCreate : undefined}
        onRowSelect={!expanded ? handleRowSelect : undefined}
        bodyHeight={bodyHeight}
        emptyMessage={emptyMessage}
      />

      {!expanded && (
        <>
          <RowDetailsDialog
            open={selectedRecord !== null}
            rowData={selectedRecord}
            onClose={handleCloseDetails}
            title={isEditMode ? 'עריכת רשומה' : 'פרטי רשומה'}
            showUpdateButton={!isEditMode}
            onUpdate={handleOpenEdit}
          >
            {isEditMode && selectedRecord ? (
              <GenericDynamicForm<TForm>
                fields={fields}
                schema={schema}
                initialData={toFormData(selectedRecord)}
                onSubmit={handleUpdateSubmit}
                submitButtonText="שמירת שינויים"
              />
            ) : undefined}
          </RowDetailsDialog>

          <RowDetailsDialog
            open={isCreateDialogOpen}
            rowData={null}
            onClose={handleCloseCreate}
            title="יצירת רשומה חדשה"
            showUpdateButton={false}
          >
            <GenericDynamicForm<TForm>
              key={createFormVersion}
              fields={fields}
              schema={schema}
              initialData={createInitialData()}
              onSubmit={handleCreateSubmit}
              submitButtonText="יצירה"
            />
          </RowDetailsDialog>
        </>
      )}
    </>
  );
};

export default GenericCrudTableTile;
