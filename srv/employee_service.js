const cds = require('@sap/cds');

module.exports = cds.service.impl(async function () {

    this.on('CREATE', 'employee_Data', async (req) => {
        const { data } = req; // destructure the data

        // You can write custom logic here, for example, validate the input data before creating a record
        try {
            const employee = await INSERT.into('employee_Data').entries(data); // Insert employee data into employee_data table
            // you can give response for the request
            return req.reply({
                employee: employee,     // Return the newly created employee
                statusCode: 201,         // Return the status code 
                statusText: "Created"   // Return the status text
            });
        } catch (error) {
            // General error handling
            return req.reply({
                statusCode: 500,    // Internal Server Error
                statusText: 'Internal Server Error',
                message: 'An unexpected error occurred.',
                details: error.message // Include more details about the error (careful about sensitive info)
            });
        }
    });

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
