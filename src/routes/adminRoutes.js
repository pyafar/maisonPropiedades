/** Require's */
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const multerProducts = require('../middlewares/multerProducts');
const requireAuth = require('../middlewares/requireAuth')

/** ADMIN PANEL */
router.get('/', requireAuth, adminController.index);

/** CREATE ONE PRODUCT */
router.get('/create', requireAuth, adminController.create);
router.post('/create', multerProducts, adminController.store); 

/** EDIT ONE PRODUCT */
router.get('/edit/:id', requireAuth, adminController.edit);
router.post('/edit/:id', multerProducts, adminController.update);

/** DELETE ONE PRODUCT */
router.delete('/edit/:id', requireAuth, adminController.destroy);

/** Habría que agregar página de categorías o lo hacemos todo con filtros?
 * Buscador
 */

module.exports = router;