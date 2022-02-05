import React, { useState } from "react";
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import AddUpdateEmployee from '../../components/AddUpdateEmployee';
import EmployeesList from '../../components/EmployeesList';
import './Home.css';


const Home = () => {
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [updatingEmployee, setUpdatingEmployee] = useState();
  const [refetchData, setRefetchData] = useState(false);

  const handleAddEmployee = () => {
    setShowEmployeeModal(true);
    setUpdatingEmployee(null);
  };

  return (<>
    <div className="title">
      Welcome to Master Web App
    </div>
    
    <div className="actionButton">
      <Button 
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddEmployee}
      >
          Add Employee
      </Button>
    </div>
    
    {showEmployeeModal ? (
      <AddUpdateEmployee 
        EmployeeDialog={showEmployeeModal}
        setEmployeeDialog={setShowEmployeeModal}
        isUpdate={updatingEmployee ? true : false}
        updatingEmployee={updatingEmployee}
        onSuccess={(flag) => {
          setRefetchData(true);
          setShowEmployeeModal(false);
        }}
      />
    ) : null}
  
    <div className="list">
      <EmployeesList 
        onEdit={(value) => {
          setUpdatingEmployee(value);
          setShowEmployeeModal(true);
        }}
        refetchData={refetchData}
      />
    </div>
    </>);
};

export default Home;
