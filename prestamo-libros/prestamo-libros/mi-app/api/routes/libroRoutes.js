const express = require('express');
const { check } = require('express-validator');
const protect = require('../middlewares/auth');
const permit = require('../middlewares/role');
const controller = require('../controllers/libroController');

const router = express.Router();

router.get('/', protect, controller.list);
router.get('/:id', protect, controller.get);
// Admin only for create/update/delete
router.post('/', [protect, permit('admin'), check('titulo').notEmpty(), check('autor').notEmpty()], controller.create);
router.put('/:id', [protect, permit('admin')], controller.update);
router.delete('/:id', [protect, permit('admin')], controller.remove);

module.exports = router;
