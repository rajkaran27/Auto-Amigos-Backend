const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const adminAuthenticate = require("../../middleware/adminAuthenticate");
const authenticate = require("../../middleware/authenticate");


router.post("/uploadOrder", async (req, res) => {
    try {
        const result = await orderController.uploadOrder(req);
        res.status(200).json({
            message: 'Order uploaded successfully',
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });

    }
});

router.get('/getOrderByID/:id', async (req, res) => {
    try {
        const result = await orderController.getOrderByID(req);
        res.status(200).send(result);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });

    }
})

router.delete('/cancelOrder/:id', async (req, res) => {
    try {
        const result = await orderController.cancelOrderByID(req);
        res.status(200).send(result);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });

    }
})

//admin function
router.get('/getAllOrders', async (req, res) => {
    try {
        const result = await orderController.getAllOrdersWithUsers(req);
        res.status(200).send(result);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });

    }
})

router.put('/updateOrderStatus', async (req, res) => {
    try {
        const result = await orderController.updateOrderStatus(req);
        res.status(200).send({ message: 'Order status updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });

    }
})

router.get('/weeklySalesGraph', async (req, res) => {
    try {
        const result = await orderController.SalesGraph(req);
        res.status(200).send(result);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });

    }
})

router.get('/getTopSpender', async (req, res) => {
    try {
        const result = await orderController.getTopSpender(req);
        res.status(200).send(result);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });

    }
})

router.get('/getTotalRevenue', async (req, res) => {
    try {
        const result = await orderController.getTotalRevenue(req);
        res.status(200).send(result);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });

    }
})

router.get('/UserIDandCarIDCheck/:carid/:userid', async (req, res) => {
    try {
        const result = await orderController.UserIDandCarIDCheck(req);
        res.status(200).send(result);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });

    }
})

router.get('/salesByBrandGraph', async (req, res) => {
    try {
        const result = await orderController.salesByBrandGraph(req);
        res.status(200).send(result);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });

    }
})

router.get('/getSalesFromDates/:from/:to',async(req,res)=>{
    try {
        const result = await orderController.getSalesFromDates(req);
        res.status(200).send(result);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });

    }
})

router.get('/getTopSellingCarsByBrand/:brand',async(req,res)=>{
    try {
        const result = await orderController.getTopSellingCarsByBrand(req);
        res.status(200).send(result);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });

    }
})

router.get('/getYearsFromOrders',async(req,res)=>{
    try {
        const result = await orderController.getYearsFromOrders(req);
        res.status(200).send(result);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });

    }
})

router.get('/getSalesByYear/:year',async(req,res)=>{
    try {
        const result = await orderController.getSalesByYear(req);
        res.status(200).send(result);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });

    }
})




module.exports = router;