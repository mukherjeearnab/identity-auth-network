const express = require("express");

const rsaEncryptReturn = require("../helpers/rsaEncryptReturn");
const rsaDecryptMiddleware = require("../helpers/rsaDecryptMiddleware");

const ICNTx = require("../../fabric/icntx");

require("dotenv").config();
const router = new express.Router();

router.post("/icn/get/citizen/", rsaDecryptMiddleware, async (req, res) => {
    if (!req.body.message.verified) {
        res.status(400).send({ response: "ERROR! ICL Error!" });
    }

    console.log("ICN-REQUEST", req.body.message);

    const data = await ICNTx.GetProfile(req.user, { ID: message.body.citizen_id });

    let payload = await rsaEncryptReturn(req.body.payload.pubkey, {
        client: process.env.CLIENT_NAME,
        body: data,
    });

    console.log("ICN-PAYLOAD", payload);

    res.status(200).send({
        response: payload,
    });
});

module.exports = router;
