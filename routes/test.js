const express = require('express');
const router = express.Router()

const { MyController } = require('../controllers');

const ObjMyController = new MyController()

router.get('/', (req, res) => { ObjMyController.get(req, res) })

module.exports = router;
