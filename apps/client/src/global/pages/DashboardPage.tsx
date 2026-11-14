import MapTile from '@/global/components/map/MapTile';
import OrderTile from '@/orders/components/OrderTile';
import ShipsTile from '@/ships/components/ShipsTile';
import PortsTile from '@/ports/components/PortsTile';
import RoutesTile from '@/routes/components/RoutesTile';
import VoyagesTile from '@/voyages/components/VoyagesTile';

const panelStyle = {
  minHeight: 0,
  minWidth: 0,
  border: '1px solid #e0e3e8',
  borderRadius: 14,
  background: '#ffffff',
  overflow: 'hidden' as const,
  boxSizing: 'border-box' as const,
};

const DashboardPage = () => {
  return (
    <div
      style={{
        minHeight: '100vh',
        boxSizing: 'border-box',
        padding: 16,
        display: 'grid',
        gridTemplateRows:
          'minmax(520px, 75vh) minmax(220px, 24vh) minmax(320px, auto)',
        gap: 16,
        overflowY: 'auto',
        background: '#f5f6f8',
      }}
    >
      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
          gap: 16,
          minHeight: 0,
          minWidth: 0,
        }}
      >
        <div style={panelStyle}>
          <MapTile to='/map' expanded={true} />
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateRows: 'repeat(3, minmax(0, 1fr))',
            gap: 12,
            minHeight: 0,
            minWidth: 0,
          }}
        >
          <div style={panelStyle}>
            <VoyagesTile to="/voyages" expanded={true} bodyHeight="140px" />
          </div>

          <div style={panelStyle}>
            <PortsTile to="/ports" expanded={true} bodyHeight="140px" />
          </div>

          <div style={panelStyle}>
            <ShipsTile to="/ships" expanded={true} bodyHeight="140px" />
          </div>
        </div>
      </section>

      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
          gap: 16,
          minHeight: 0,
          minWidth: 0,
        }}
      >
        <div style={panelStyle}>
          <RoutesTile to="/routes" expanded={true} bodyHeight="140px" />
        </div>

        <div
          style={{
            ...panelStyle,
            padding: 16,
            overflow: 'auto',
          }}
        >
          <h3 style={{ marginTop: 0 }}>אירועים</h3>
          <p>טבלת האירועים תתווסף בהמשך.</p>
        </div>
      </section>

      <section style={panelStyle}>
        <OrderTile to="/orders" expanded={true} bodyHeight="250px" />
      </section>
    </div>
  );
};

export default DashboardPage;
