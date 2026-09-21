const express = require('express');
const router = express.Router();
const bidController = require('../controllers/bidController');

router.get('/', bidController.getAll);
router.get('/:id', bidController.getById);
router.post('/', bidController.create);
router.put('/:id', bidController.update);
router.delete('/:id', bidController.remove);

module.exports = router;
