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

router.get('/getOrderByID/:id',authenticate, async (req, res) => {
    try {
        const result = await orderController.getOrderByID(req);
        res.status(200).send(result);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });

    }
})

router.delete('/cancelOrder/:id',authenticate, async (req, res) => {
    try {
        const result = await orderController.cancelOrderByID(req);
        res.status(200).send(result);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });

    }
})

//admin function
router.get('/getAllOrders', adminAuthenticate, async (req, res) => {
    try {
        const result = await orderController.getAllOrdersWithUsers(req);
        res.status(200).send(result);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });

    }
})

router.put('/updateOrderStatus', adminAuthenticate, async (req, res) => {
    try {
        const result = await orderController.updateOrderStatus(req);
        res.status(200).send({ message: 'Order status updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });

    }
})

router.get('/weeklySalesGraph', async (req, res) => {
    try {
        const result = await orderController.weeklySalesGraph(req);
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

module.exports = router;