import http from "./http_service";

const createEmployee = (data) => {
  return http.post("/employee-master", data);
};

const updateEmployee = (id, data) => {
  return http.patch(`/employee-master/${id}`, data);
};

const getAllEmployees = () => {
  return http.get("/employee-master");
};

const getAllStates = () => {
  return http.get('/state-master');
};

const getCitiesByStateId = async (state_id) => {
  return await http.get("/city-master", {
    params: {
      state_id: `${state_id}`,
    },
  });
};

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  createEmployee,
  updateEmployee,
  getAllStates,
  getCitiesByStateId,
  getAllEmployees
};
