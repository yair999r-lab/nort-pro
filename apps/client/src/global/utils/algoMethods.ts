import { AxiosError } from 'axios';
import { DirectionType } from '../types/sort.types';

export const getErrorMessage = <T>(error: T): string => {
  if (
    error instanceof AxiosError ||
    (error instanceof Error && error.message === 'Network Error')
  )
    return 'Server connection error!';
  if (
    error instanceof AxiosError &&
    error.response &&
    error.response.data.message
  )
    return error.response.data.message;
  if (error instanceof Error) return error.message;
  return 'Oops... Something went wrong';
};

const isNumericString = (value: unknown): value is string =>
  typeof value === 'string' &&
  value.trim() !== '' &&
  Number.isFinite(Number(value));

export const sortArrayOfObjects = <T>([...array]: T[], key: keyof T) => {
  return array.sort((a, b) => {
    if (isNumericString(a[key]) && isNumericString(b[key])) {
      return Number(a[key]) - Number(b[key]);
    }
    if (a[key] < b[key]) return -1;
    if (a[key] > b[key]) return 1;
    return 0;
  });
};
export const sortReverseArrayOfObjects = <T>([...array]: T[], key: keyof T) => {
  return array.sort((a, b) => {
    if (isNumericString(a[key]) && isNumericString(b[key])) {
      return Number(b[key]) - Number(a[key]);
    }
    if (a[key] > b[key]) return -1;
    if (a[key] < b[key]) return 1;
    return 0;
  });
};

export const sortArrayOfData = <T>(
  data: T[],
  key: keyof T,
  orderDirection: DirectionType,
) => {
  if (orderDirection === 'asc') return sortArrayOfObjects(data, key);
  else return sortReverseArrayOfObjects(data, key);
};

export const truncateText = (text: string, maxLength: number) => {
  if (!text) return '';
  if (text.length > maxLength) return text.slice(0, maxLength) + '...';
  return text;
};
