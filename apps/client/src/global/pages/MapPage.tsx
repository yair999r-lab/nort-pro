import MapTile from '@/global/components/map/MapTile';

const MapPage = () => {
  return (
    <div style={{ height: '100vh' }}>
      <MapTile to="/dashboard" expanded={false} />
    </div>
  );
};

export default MapPage;
