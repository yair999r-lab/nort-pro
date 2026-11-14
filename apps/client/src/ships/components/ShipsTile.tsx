import { CSSProperties, FC, useEffect } from 'react';
import useShips from '@/ships/hooks/useShips';
import Error from '@/global/helpers/errors/Error';
import GenericCrudTableTile from '@/global/components/generic-table-tile/GenericCrudTableTile';
import { SHIP_TABLE_TILE_INFO } from '@/ships/helpers/ships.helpers';
import type { NormalizedShip } from '@/ships/types/ships.types';
import { shipFields, shipSchema, type ShipFormData } from './ShipForm';

type ShipsTileProps = {
  to: string;
  expanded: boolean;
  bodyHeight?: CSSProperties['height'];
};

const emptyShip: ShipFormData = {
  name: '',
  homePortId: '',
  currentPortId: '',
  routeId: '',
  capacityTons: '',
  speedKnots: '',
  fuelConsumptionTonsPerDay: '',
  status: 'active',
};

const ShipsTile: FC<ShipsTileProps> = ({ to, expanded, bodyHeight }) => {
  const { ShipsErrors, loadingShips, ships, handleGetShips } = useShips();

  useEffect(() => {
    handleGetShips();
  }, [handleGetShips]);

  if (loadingShips) return <p>Loading...</p>;

  if (ShipsErrors) {
    return <Error message={ShipsErrors} />;
  }

  if (!ships) return null;

  return (
    <GenericCrudTableTile<NormalizedShip, ShipFormData>
      tableKey="ships"
      title="ships"
      to={to}
      expanded={expanded}
      data={ships}
      tableInfo={SHIP_TABLE_TILE_INFO}
      fields={shipFields}
      schema={shipSchema}
      createInitialData={() => ({ ...emptyShip })}
      toFormData={(record) => ({
        name: record.name,
        homePortId: record.homePortId,
        currentPortId:
          record.currentPortId === 'לא משויך' ? '' : record.currentPortId,
        routeId: record.routeId === 'לא משויך' ? '' : record.routeId,
        capacityTons: record.capacityTons,
        speedKnots: record.speedKnots,
        fuelConsumptionTonsPerDay: record.fuelConsumptionTonsPerDay,
        status: record.status,
      })}
      onCreate={(formData) => {
        console.log('Create ship:', formData);
      }}
      onUpdate={(record, formData) => {
        console.log('Update ship:', record.id, formData);
      }}
      bodyHeight={bodyHeight}
    />
  );
};

export default ShipsTile;
