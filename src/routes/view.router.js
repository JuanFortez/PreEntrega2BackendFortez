import express from "express";
const router = express.Router();
const products = [];

router.get('/', (req, res) => {
    res.render('home', { products });
});

router.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts', { products });
});

export default router;
