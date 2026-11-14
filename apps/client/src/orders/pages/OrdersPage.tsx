import OrderTile from '../components/OrderTile';

const OrdersPage = () => {
  return (
    <div>
      <OrderTile to="/dashboard" expanded={false}></OrderTile>
    </div>
  );
};

export default OrdersPage;
