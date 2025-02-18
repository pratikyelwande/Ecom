import { executeQuery } from '../config/db.js';
import { apiResponse } from '../utils/apiResponse.js';

export const addProduct = async (req, res) => {
    try {
        // 1️⃣ Get user_id from JWT token (assuming user is logged in)
        const user_id = req.user?.user_id;
        if (!user_id) {
            return apiResponse.error(res, "Unauthorized: User ID missing", 401);
        }

        // 2️⃣ Get product details from req.body
        const { name, description, price, quantity, category } = req.body;

        // Validate required fields
        if (!name || !price || !quantity || !category) {
            return apiResponse.error(res, "Missing required fields", 400);
        }

        // 3️⃣ Fetch category_id based on category name
        const categoryResult = await executeQuery(
            `SELECT category_id FROM Categories WHERE name = ?`,
            [category]
        );

        if (categoryResult.length === 0) {
            return apiResponse.error(res, "Invalid category", 400);
        }

        const category_id = categoryResult[0].category_id;

        // 4️⃣ Get the uploaded image path from req.file (if available)
        const image_url = req.file ? `/uploads/${req.file.filename}` : null;

        // 5️⃣ Insert product details into the Products table
        const query = `
            INSERT INTO Products (user_id, name, description, price, quantity, category_id, image_url)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        const params = [user_id, name, description, price, quantity, category_id, image_url];

        // Log the parameters to debug
        console.log('Parameters:', params);

        // Ensure all params are defined
        if (params.some(param => param === undefined)) {
            return apiResponse.error(res, "Invalid bind variable: undefined", 400);
        }

        // Execute the query
        await executeQuery(query, params);

        // Return success response
        return apiResponse.success(res, null, "Product added successfully", 201);
    } catch (error) {
        console.error("Error adding product:", error);
        return apiResponse.error(res, error.message || "Failed to add product", 500);
    }
};


export const getProducts = async (req, res) => {
    try {
        // Fetch products from the database
        const products = await executeQuery(`SELECT * FROM Products`);

        // Return the products in the response
        return apiResponse.success(res, products, "Products fetched successfully", 200);
    } catch (error) {
        console.error("Error fetching products:", error);
        return apiResponse.error(res, error.message || "Failed to fetch products", 500);
    }
};