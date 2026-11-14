// import { DEMO_SCHEMA } from '@libs/demo';

import { queryToPostgres } from "@libs/global";
import { selectAllFromDemoQuery } from "../helpers/demo.helpers";

// this module handle the fetch data from the database
export const getAllDemoFromDAL = async () => {
  try {
    const demos = await queryToPostgres(selectAllFromDemoQuery())
    return demos;
  } catch (error) {
    return Promise.reject(error);
  }
};
