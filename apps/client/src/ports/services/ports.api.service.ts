import axios from 'axios';
import type { PortInterface } from '@libs/united_packages';

const SERVER_URL =
  import.meta.env.VITE_SERVER_URL || 'http://localhost:3000';

export const getAllPorts = async (): Promise<PortInterface[]> => {
  const { data } = await axios.get<PortInterface[]>(
    `${SERVER_URL}/ports`,
  );

  return data;
};