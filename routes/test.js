const express = require('express');
const router = express.Router()

const { FindTest, InsertTest, ForeignTest } = require('../controllers');

const ObjFindTest = new FindTest()
const ObjInsertTest = new InsertTest()
const ObjForeignTest = new ForeignTest()

router.get('/find/undefined', async (req, res) => { await ObjFindTest.__find_undefined_( req, res ) })
router.get('/find/one', async (req, res) => { await ObjFindTest.__find_one_( req, res ) })
router.get('/find/many', async (req, res) => { await ObjFindTest.__find_many_( req, res ) })
router.get('/find/primary/:raw_order_id', async (req, res) => { await ObjFindTest.__find_primary_( req, res ) })
router.get('/find/fk', async (req, res) => { await ObjForeignTest.__find_fk_( req, res ) })

router.post('/insert', async (req, res) => { await ObjInsertTest.__insert_one_(req, res) })
router.post('/insert/fk', async (req, res) => { await ObjForeignTest.__insert_order_(req, res) })

module.exports = router;
