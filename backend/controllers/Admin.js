import { executeQuery } from "../config/db.js";
import { apiResponse } from "../utils/apiResponse.js";

export const getAllTableData = async (req, res) => {
    try {
        // Run the query to show tables in the current schema
        const tables = await executeQuery("SHOW TABLES", []);

        // Extract table names from the result. Assuming each row has a "name" field.
        const tableNames = tables.map((table) => table.name);

        return apiResponse.success(res, tableNames, "Table names retrieved successfully", 200);
    } catch (error) {
        console.error("Error retrieving table data:", error);
        return apiResponse.error(res, "Failed to retrieve table data", 500);
    }
};
