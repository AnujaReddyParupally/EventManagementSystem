const router = require('express').Router();

const { check } = require('express-validator');
const orderCtrl = require('../controllers/order');

router.get('/', orderCtrl.fetchOrders);
router.get('/:id', orderCtrl.fetchOrder);
router.post('/', orderCtrl.createOrder);
router.put('/:id',orderCtrl.cancelOrder);

module.exports = router;