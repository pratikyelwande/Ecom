import express from "express";
    import { verifyJWT, verifyAdmin } from "../middleware/auth.js";
    import {addProduct, getProducts} from "../controllers/Addproducts.js";
    import { upload } from "../utils/upload.js";

    const router = express.Router();

    router.post('/addproducts', verifyJWT, verifyAdmin, upload.single('image'), addProduct);
    router.get('/products', verifyJWT, getProducts);

    export default router;