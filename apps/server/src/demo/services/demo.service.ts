import { getAllDemoFromDAL } from "../dal/demo.dal";

// this module handle the logic and manipulate the data
export const getAllDemoService = async () => {
  try {
    // validate with joi
    // get the data from the DAL
    const demos = await getAllDemoFromDAL();
    // normalized the data
    // return the normalized
    return demos;
  } catch (error) {
    return Promise.reject(error);
  }
};
