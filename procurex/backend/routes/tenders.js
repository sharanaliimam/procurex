const express = require('express');
const router = express.Router();
const tenderController = require('../controllers/tenderController');

router.get('/', tenderController.getAll);
router.get('/:id', tenderController.getById);
router.post('/', tenderController.create);
router.put('/:id', tenderController.update);
router.delete('/:id', tenderController.remove);

module.exports = router;
