import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import React, { useEffect, useState } from "react";
import Typography from '@mui/material/Typography';
import EditIcon from '@mui/icons-material/Edit';
import Container from '@mui/material/Container';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import API_Services from '../../API_Services/api_services';

  
const EmployeesList = ({ onEdit, refetchData }) => {
    const [rows, setRows] = useState([]);

    useEffect(() => {
      getEmployeesList();
    }, [refetchData]);
  
    const getDateString = (inDate) => {
        const date = new Date(inDate);
        return (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + "/" + ((date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)) + "/" + date.getFullYear();
    };

    const getEmployeesList = async () => {
        const response = await API_Services.getAllEmployees();
        if (response?.data?.data?.length) {
            let items = [];
            await Promise.all(response.data.data.map((employee, index) => {
              items.push({
                id: employee.id,
                sl_no: index + 1,
                name: employee.first_name +' '+ employee.last_name,
                date_of_birth: employee.date_of_birth ? getDateString(employee.date_of_birth) : '',
                salary: employee.salary,
                employee_code: employee.employee_code,
                action: '',
                dob: employee.date_of_birth,
                first_name: employee.first_name,
                last_name: employee.last_name,
                address: employee.address,
                state_id: employee.state_id,
                city_id: employee.city_id,
              });
            }));
            setRows(items);
        }
    };
  
    const columns = [
      {
        field: "sl_no",
        headerName: "Sl No",
        flex: 1,
        editable: false
      },
      {
        field: "name",
        headerName: "Name",
        flex: 1,
        editable: false
      },
      {
        field: "date_of_birth",
        headerName: "Date Of Birth",
        flex: 1,
        editable: false
      },
      {
        field: "salary",
        headerName: "Salary",
        flex: 1,
        editable: false
      },
      {
        field: "employee_code",
        headerName: "Employee Code",
        flex: 1,
        editable: false
      },
      {
        field: "action",
        headerName: "Action",
        flex: 1,
        editable: false,
        renderCell: (params) => (
            <Button
                variant="text"
                color="primary"
                startIcon={<EditIcon />}
                style={{ marginRight: "10px" }}
                onClick={() => onEdit(params?.row)}
            >
                Edit
            </Button>
        ),
      },
    ];
  
    function CustomNoRowsOverlay() {
        return (
          <div item xs={12} style={{ textAlign: "center", paddingTop: 160 }}>
            <Typography variant="h6" gutterBottom>
              No Employees Found
            </Typography>
          </div>
        );
    }

    return (
      <React.Fragment>
          {rows && columns ? (
            <Container style={{overflow: 'auto', padding: '0%'}}>
              <DataGrid
                density="compact"
                autoHeight
                components={{
                  NoRowsOverlay: CustomNoRowsOverlay,
                  Toolbar: GridToolbar,
                }}
                columns={columns}
                rows={rows}
              />
            </Container>
          ) : null}
      </React.Fragment>
    );
};
  
export default EmployeesList;
  