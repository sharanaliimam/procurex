const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const documentController = require('../controllers/documentController');

router.get('/', documentController.getAll);
router.post('/', upload.single('file'), documentController.create);
router.get('/:id/download', documentController.download);
router.delete('/:id', documentController.remove);

module.exports = router;
