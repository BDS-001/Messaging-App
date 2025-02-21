const router = require("express").Router();

router.get('/', (req, res) => {
    return res.json({message: 'W.I.P'})
})

module.exports = router