import { Navigate, Route, Routes } from 'react-router-dom';
import DashboardPage from '../../pages/DashboardPage';
import App from '../../../App';
import ROUTES from '../model/routes.model';
import OrdersPage from '../../../orders/pages/OrdersPage';
import ShipsPage from '@/ships/pages/ShipsPage';
import FilterProvider from '@/global/context/FilterContext';
import PortsPage from '@/ports/pages/ShipsPage';
import RoutesPage from '@/routes/pages/RoutesPage';
import VoyagesPage from '@/voyages/pages/VoyagesPage';
import StopsPage from '@/stops/pages/StopsPage';
import MapPage from '@/global/pages/MapPage';
import AllocationPage from '@/global/pages/AllocationPage';

const Router = () => {
  return (
    <FilterProvider>
      <Routes>
        <Route path={ROUTES.ROOT} element={<App />}>
          <Route path="/" element={<Navigate to={ROUTES.DASHBOARD} />} />
          <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
          <Route path={ROUTES.ORDERS} element={<OrdersPage />} />
          <Route path={ROUTES.SHIPS} element={<ShipsPage />} />
          <Route path={ROUTES.PORTS} element={<PortsPage />} />
          <Route path={ROUTES.ROUTES_PAGE} element={<RoutesPage />} />
          <Route path={ROUTES.VOYAGES} element={<VoyagesPage />} />
          <Route path={ROUTES.STOPS} element={<StopsPage />} />
          <Route path={ROUTES.MAP} element={<MapPage />} />
          <Route path={ROUTES.ALLOCATION} element={<AllocationPage />} />
        </Route>
      </Routes>
    </FilterProvider>
  );
};

export default Router;
