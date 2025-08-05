using employee_CAP.db as db from '../db/employeeDataModel';  // importing the data models from data model file using its namespace

@path: '/EmployeeSRV'  // annotating service path 
service EmployeeService {   // defining service 
    entity employee_Data    as projection on db.employee_Data;        // entity projections 
    entity employee_Address as projection on db.employee_Address;
    entity Department       as projection on db.Department;
}