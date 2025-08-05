const cds = require('@sap/cds');
const { executeHttpRequest } = require('@sap-cloud-sdk/http-client');


module.exports = cds.service.impl(async function () {

    this.on('CREATE', 'employee_Data', async (req) => {
        const { data } = req;
        try {
          // Save the original payload in the request context
          req.context.originalPayload = data;
      
          // Proceed with the insert
          const employee = await INSERT.into('employee_Data').entries(data);
          return employee;
        } catch (error) {
          req.error({
            code: 'CREATE_FAILED',
            message: 'Failed to create employee record.',
            target: 'employee_Data',
            details: [{ message: error.message }]
          });
        }
      });      
    // trigger CPI
    this.after('CREATE', 'employee_Data', async (employee, req) => {
        try {
          // Retrieve the original payload
          const payload = req.context.originalPayload;
          console.log("employee===="+ employee)
          console.log('Payload sent to CPI:', payload);
      
          const response = await executeHttpRequest(
            { destinationName: 'CPI_Employee_CAP_Dest' },
            {
              method: 'POST',
              url: '',
              data: payload // Sending the original payload to CPI
            }
          );
          console.log('CPI Triggered:', response.data);
        } catch (err) {
          console.error('Error calling CPI:', err.message);
        }
      });
      

    // this.after('CREATE', 'employee_Data', async (req) => {
    //     try {
    //       // Handle both single and batch creates
    //     // const employees = Array.isArray(employee) ? employee : [employee];
    //       const payload = req.context.originalPayload;
    
    //     //   const employees = Array.isArray(payload) ? payload : [payload];

    //       for (const emp of payload) {
    //         console.log("emp-----"+ emp)
    //         const response = await executeHttpRequest(
    //           { destinationName: 'CPI_Employee_CAP_Dest' },
    //           {
    //             method: 'POST',
    //             url: '', // Uses the base URL from destination
    //             data: emp
    //           }
    //         );
    //         console.log('CPI Triggered:', response.data);
    //         console.log('Payload sent to CPI:', emp);
    //       }
    //     } catch (err) {
    //       console.error('Error calling CPI:', err.message);
    //     }
    //   });
      

    this.on('UPDATE', 'employee_Data', async (req) => {
        const { data } = req;

        try {
            // Optional: validate data.id exists
            if (!data.ID) {
                return req.reply({
                    statusCode: 400,
                    statusText: 'Bad Request',
                    message: 'Missing employee ID for update.'
                });
            }

            // Perform the update
            const updated = await UPDATE('employee_Data').set(data).where({ ID: data.ID });
            if (updated === 0) {
                return req.reply({
                    statusCode: 404,
                    statusText: 'Not Found',
                    message: 'Employee not found.'
                });
            }
            return req.reply({
                statusCode: 200,
                statusText: 'Updated',
                message: 'Employee updated successfully.',
                updatedRows: updated
            });
        } catch (error) {
            return req.reply({
                statusCode: 500,
                statusText: 'Internal Server Error',
                message: 'Failed to update employee.',
                details: error.message
            });
        }
    });

    this.on('DELETE', 'employee_Data', async (req) => {
        const { ID } = req.data;
    
        try {
            if (!ID) {
                return req.reply({
                    statusCode: 400,
                    statusText: 'Bad Request',
                    message: 'Missing employee ID for deletion.'
                });
            }
    
            const deleted = await DELETE.from('employee_Data').where({ ID:ID });
    
            if (deleted === 0) {
                return req.reply({
                    statusCode: 404,
                    statusText: 'Not Found',
                    message: 'Employee not found or already deleted.'
                });
            }
    
            return req.reply({
                statusCode: 200,
                statusText: 'Deleted',
                message: 'Employee deleted successfully.'
            });
        } catch (error) {
            return req.reply({
                statusCode: 500,
                statusText: 'Internal Server Error',
                message: 'Failed to delete employee.',
                details: error.message
            });
        }
    });
    

});
