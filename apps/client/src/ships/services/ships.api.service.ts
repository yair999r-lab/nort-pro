import axios from 'axios';
import type { ShipInterface } from '@libs/united_packages';

const SERVER_URL =
  import.meta.env.VITE_SERVER_URL || 'http://localhost:3000';

export const getAllShips = async (): Promise<ShipInterface[]> => {
  const { data } = await axios.get<ShipInterface[]>(
    `${SERVER_URL}/ships`,
  );

  return data;
};