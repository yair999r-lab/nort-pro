import { SCHEMA } from '@libs/global';

export const selectAllFromDemoQuery = () => {
  const query = `
    SELECT * FROM ${SCHEMA}.demo
  `;
  return query;
}
