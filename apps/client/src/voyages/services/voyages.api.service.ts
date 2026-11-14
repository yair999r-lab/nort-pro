import axios from 'axios';
import type { VoyageInterface } from '@libs/united_packages';

const SERVER_URL =
  import.meta.env.VITE_SERVER_URL || 'http://localhost:3000';

export const getAllVoyages = async (): Promise<VoyageInterface[]> => {
  const { data } = await axios.get<VoyageInterface[]>(
    `${SERVER_URL}/voyages`,
  );

  return data;
};