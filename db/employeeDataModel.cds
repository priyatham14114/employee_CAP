namespace employee_CAP.db; // Give a name space to this file to access data models later 

using { cuid } from '@sap/cds/common'; // importing 

entity employee_Data : cuid {   // here cuid automatically creates a unique ID for every record when it is created 
    first_Name      : String;
    last_Name       : String;
    gender          : String;
    age             : Integer;
    email           : String; 
    phone           : Integer;
    address         : Composition of many employee_Address // A tight coupled relation with address entity 
                          on address.employee = $self;  // (when employee have multiple address)
    department      : Association to Department;
}
entity employee_Address : cuid {
  city     : String ;
  pincode  : Integer;
  street   : String;
  landmark : String;
  employee : Association to employee_Data; // this association targets the user ID 
}
entity Department : cuid {
  name        : String;
  description : String;
}