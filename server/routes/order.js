const router = require('express').Router();

const { check } = require('express-validator');
const orderCtrl = require('../controllers/order');
const auth = require('../middleware/auth')

//ORDERS CAN BE PLACED, SEEN, OR CANCELLED ONLY BY AUTHENTICATED USERS
router.get('/', auth, orderCtrl.fetchOrders);
router.get('/:id', auth, orderCtrl.fetchOrder);
router.post('/', auth, orderCtrl.createOrder);
router.put('/:id', auth, orderCtrl.cancelOrder);

module.exports = router;