const express = require('express');
const router = express.Router();

router.get('/getUser', async (req, res) => {
    const { user } = req.user;
    console.log(user);

    res.json({ 'msg': 'Authorized User' })
})

module.exports = router;