const express = require('express');
const router = express.Router();
const mainController = require('../controllers/mainController');


router.get('/', mainController.index);

router.get('/login', mainController.login);
router.post('/login', mainController.processLogin);

router.get('/detail/:id', mainController.detail);

router.get('/buscar', mainController.search);
router.get('/venta', mainController.venta);
router.get('/alquiler', mainController.alquiler);
router.get('/destacados', mainController.destacados);

module.exports = router;