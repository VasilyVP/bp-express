const express = require('express');
const router = express.Router();
//const Auth = require('../middleware/authentication');

router.get('/', async (req, res, next) => {
    res.json({
        code: 200,
        message: 'root route',
    });
});

module.exports = router;