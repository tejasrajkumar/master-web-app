import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import DialogContentText from '@mui/material/DialogContentText';
import Autocomplete from '@mui/material/Autocomplete';
import Alert from '@mui/material/Alert';
import DialogContent from '@mui/material/DialogContent';
import DatePicker from 'react-date-picker';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import Grid from '@mui/material/Grid';
import { spacing } from "@mui/system";
import { Field, Formik } from "formik";
import TextField from '@mui/material/TextField';
import React, { useEffect, useState } from "react";
import styled from "styled-components/macro";
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import * as Yup from "yup";
import API_Services from '../../API_Services/api_services';
import './AddUpdateEmployee.css';


const EmployeeDialog = ({
  EmployeeDialog,
  setEmployeeDialog,
  onSuccess,
  isUpdate,
  updatingEmployee,
}) => {
  const { v4: uuidv4 } = require("uuid");
  const MuiDivider = styled(Divider)(spacing);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const Spacer = styled.div(spacing);
  const timeOut = (time) => new Promise((res) => setTimeout(res, time));

  useEffect(()=>{
    if (updatingEmployee?.state_id) {
      getCities(updatingEmployee.state_id);
    }
  }, [updatingEmployee]);

  let initialValues = {
    first_name: updatingEmployee?.first_name ? updatingEmployee?.first_name : '',
    last_name: updatingEmployee?.last_name ? updatingEmployee?.last_name : '',
    employee_code: updatingEmployee?.employee_code ? updatingEmployee?.employee_code : '',
    date_of_birth: updatingEmployee?.dob ? new Date(updatingEmployee?.dob) : new Date(),
    salary: updatingEmployee?.salary ? updatingEmployee?.salary : null,
    address: updatingEmployee?.address ? updatingEmployee?.address : '',
    state_id: updatingEmployee?.state_id ? updatingEmployee?.state_id : '',
    city_id: updatingEmployee?.city_id ? updatingEmployee?.city_id : '',
  };
  
  const validationSchema = Yup.object().shape({
    first_name: Yup.string(),
    last_name: Yup.string(),
    employee_code: Yup.string(),
    date_of_birth: Yup.string(),
    salary: Yup.number(),
    address: Yup.string(),
    state_id: Yup.string(),
    city_id: Yup.string(),
  });
  
  useEffect(() => {
    getStates();
  }, []);

  const getStates = async () => {
    const response = await API_Services.getAllStates();
    if(response?.data?.data?.length) {
      console.log('Getting States response:', response?.data?.data);
      setStates(response?.data?.data);
    }
  };

  const getCities = async (state_id) => {
    const response = await API_Services.getCitiesByStateId(state_id);
    if(response?.data?.data?.length) {
      console.log('Getting Cities response:', response?.data?.data);
      setCities(response?.data?.data);
    }
  };
  
  const getDateInSqlFormat = (inDate) => {
    // console.log("🚀 ~ file: dateService.js ~ line 3 ~ getDateInSqlFormat ~ date", typeof inDate, inDate)
      if (!inDate || (typeof inDate !== 'string' && inDate === '')) {
        return null;
      }
      /* if (typeof inDate === "string" && date !== "") {
        date = new Date(date);
      } */
      let date = new Date(inDate);
      const dateString = date.getFullYear() + "-" +
        pad2(date.getMonth() + 1) + "-" +
        pad2(date.getDate()) + " " +
        pad2(date.getHours()) + ":" +
        pad2(date.getMinutes()) + ":" +
        pad2(date.getSeconds());
      return dateString;
    };
    
    const pad2 = (number) => {
        let str = '' + number;
        while (str.length < 2) {
          str = '0' + str;
        }
        return str;
    };

  const handleSubmit = async (
    values,
    { resetForm, setErrors, setStatus, setSubmitting }
  ) => {
      try {
        console.log("🚀 -> file: products-page.js -> line 90 -> ProductsPage -> values", values);
        await timeOut(1500);
        setStatus({ sent: true });
        setSubmitting(false);
        if (values) {
          if (updatingEmployee) {
            const obj1 = {
              first_name: values.first_name,
              last_name: values.last_name,
              employee_code: values.employee_code,
              date_of_birth: getDateInSqlFormat(new Date(values.date_of_birth)),
              salary: values.salary,
              address: values.address,
              state_id: values.state_id,
              city_id: values.city_id
            };
            const res = await API_Services.updateEmployee(updatingEmployee?.id, obj1);
            if (res && res.status === 200) {
              onSuccess(true);
              resetForm();
              setEmployeeDialog(false);
            }
          } else {
            const obj1 = {
              id: uuidv4(),
              first_name: values.first_name,
              last_name: values.last_name,
              employee_code: values.employee_code,
              date_of_birth: getDateInSqlFormat(new Date(values.date_of_birth)),
              salary: values.salary,
              address: values.address,
              state_id: values.state_id,
              city_id: values.city_id
            };
            const res = await API_Services.createEmployee(obj1);
            if (res && res.status === 201) {
              onSuccess(true);
              resetForm();
              setEmployeeDialog(false);
            }
          }
        }
      } catch (error) {
        setStatus({ sent: false });
        setErrors({ submit: error.message });
        setSubmitting(false);
      }
    };
  
    return (
      <>
          <Dialog
            open={EmployeeDialog}
            onClose={() => setEmployeeDialog(false)}
            aria-labelledby="form-dialog-title"
            disableBackdropClick={true}
            fullWidth={true}
          >
            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#0d51ca', color: '#fff'}}>
              <DialogTitle id="form-dialog-title">
                {isUpdate ? 'Update Employee' : 'Add Employee'}
              </DialogTitle>
              <div>
                <Button onClick={() => setEmployeeDialog(false)}>
                  <CloseRoundedIcon style={{ fill: '#fff' }} />
                </Button>
              </div>
            </div>
            <DialogContent pb={4}>
              <DialogContentText>
                Please fill in the following details of your employee
              </DialogContentText>
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({
                  errors,
                  handleBlur,
                  handleChange,
                  handleSubmit,
                  isSubmitting,
                  touched,
                  values,
                  status,
                  setFieldValue,
                }) => (
                    <Card elevation={0}>
                      {status && status.sent && (
                        <Alert severity="success" my={3}>
                          Your data has been submitted successfully!
                        </Alert>
                      )}
                    {isSubmitting ? (
                      <Box display="flex" justifyContent="center" my={6}>
                        <CircularProgress />
                      </Box>
                    ) : (
                      <form onSubmit={handleSubmit}>
                        <Spacer my={3} />
                        <Grid container spacing={3}>
                          <Grid item md={6}>
                            <TextField
                              name="first_name"
                              label="First Name"
                              value={values.first_name}
                              fullWidth
                              required
                              onBlur={handleBlur}
                              onChange={handleChange}
                              variant="outlined"
                            />
                          </Grid>
                          <Grid item md={6}>
                            <TextField
                              name="last_name"
                              label="Last Name"
                              value={values.last_name}
                              fullWidth
                              required
                              onBlur={handleBlur}
                              onChange={handleChange}
                              variant="outlined"
                            />
                          </Grid>
                          <Grid item md={6}>
                            <TextField
                              name="employee_code"
                              label="Employee Code"
                              value={values.employee_code}
                              fullWidth
                              required
                              onBlur={handleBlur}
                              onChange={handleChange}
                              variant="outlined"
                            />
                          </Grid>
                          <Grid item md={6}>
                            <TextField
                              name="salary"
                              label="Salary"
                              value={values.salary}
                              fullWidth
                              required
                              onBlur={handleBlur}
                              onChange={handleChange}
                              variant="outlined"
                            />
                          </Grid>
                          <Grid item md={12}>
                            <TextField
                              name="address"
                              label="Address"
                              value={values.address}
                              fullWidth
                              required
                              onBlur={handleBlur}
                              onChange={handleChange}
                              variant="outlined"
                            />
                          </Grid>
                          {states?.length ? (
                            <Grid item md={6}>
                              <Autocomplete
                                id="state_id"
                                options={states}
                                getOptionLabel={(option) => option.state_name}
                                defaultValue={states.find(
                                  (state) => state.id === updatingEmployee?.state_id
                                )}
                                required
                                renderInput={(params) => (
                                  <Field
                                    component={TextField}
                                    {...params}
                                    name="state_id"
                                    label="State"
                                    variant="outlined"
                                    fullWidth
                                    required
                                  />
                                )}
                                onChange={(e, value) => {
                                  console.log('STATE', value);
                                  setFieldValue("state_id", value?.id ?? "");
                                  getCities(value?.id);
                                }}
                                onBlur={handleBlur}
                                variant="outlined"
                              />
                            </Grid>) : null}
                          {cities?.length ? (
                            <Grid item md={6}>
                              <Autocomplete
                                id="city_id"
                                options={cities}
                                getOptionLabel={(option) => option.city_name}
                                defaultValue={cities.find(
                                  (city) => city.id === updatingEmployee?.city_id
                                )}
                                required
                                renderInput={(params) => (
                                  <Field
                                    component={TextField}
                                    {...params}
                                    name="city_id"
                                    label="City"
                                    variant="outlined"
                                    fullWidth
                                    required
                                  />
                                )}
                                fullWidth
                                onBlur={handleBlur}
                                onChange={(e, value) => {
                                  console.log('CITY', value);
                                  setFieldValue("city_id", value?.id ?? "");
                                }}
                                variant="outlined"
                              />
                            </Grid>) : null}
                            <Grid item md={12}>
                              <div style={{fontSize: '14px'}}>Date Of Birth</div>
                              <DatePicker 
                                name="date_of_birth"
                                required={true}
                                onChange={(value) => {
                                  console.log('DOB', value);
                                  setFieldValue("date_of_birth", value ?? new Date());
                                }}
                                value={values.date_of_birth}
                              />
                            </Grid>
                          </Grid>
                        <MuiDivider my={3} />
                        <div className="d-flex justify-content-end">
                          <Button
                            type="button"
                            variant="outlined"
                            color="primary"
                            style={{ marginBottom: "10px", marginRight: "10px"}}
                            onClick={() => setEmployeeDialog(false)}
                          >
                            Cancel
                          </Button>
                          <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            style={{ marginBottom: "10px" }}
                          >
                            {isUpdate ? "Update" : "Add"}
                          </Button>
                        </div>
                      </form>
                    )}
                  </Card>
                )}
              </Formik>
            </DialogContent>
          </Dialog>
      </>
    );
  };
  
  export default EmployeeDialog;
  