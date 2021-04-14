const express = require("express");
const router = new express.Router();
const fs = require("fs");

const fetch = require("node-fetch");

router.get("/api/icn/pubkey", (req, res) => {
    // Import Public Key
    // Import Private Key of Client SDK
    const keyDataR = fs.readFileSync("./keys/public.pem");

    res.status(200).send({
        pubKey: keyDataR.toString(),
    });
});

module.exports = router;
