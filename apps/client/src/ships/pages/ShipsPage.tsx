import ShipsTile from "../components/ShipsTile";

const ShipsPage = () => {
  return (
    <div>
      <ShipsTile to="/dashboard" expanded={false}></ShipsTile>
    </div>
  );
};

export default ShipsPage;
