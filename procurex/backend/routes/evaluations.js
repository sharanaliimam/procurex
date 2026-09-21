const express = require('express');
const router = express.Router();
const evaluationController = require('../controllers/evaluationController');

router.get('/', evaluationController.getAll);
router.get('/:id', evaluationController.getById);
router.post('/', evaluationController.create);
router.put('/:id', evaluationController.update);
router.delete('/:id', evaluationController.remove);

module.exports = router;
