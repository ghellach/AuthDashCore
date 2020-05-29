const router = require('express').Router();

router.get('/', (req, res) => {
    res.send('well here we are');
});

router.use(require('./specific'));

module.exports = router;

