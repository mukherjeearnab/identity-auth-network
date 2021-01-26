const express = require("express");
const md5 = require("md5");
const JWTmiddleware = require("../helpers/jwtVerifyMiddleware");
const IdentityCC = require("../../fabric/identity_cc");

const router = new express.Router();

router.get("/api/main/profile/get/:id", JWTmiddleware, async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");

    const ID = req.params.id;
    try {
        let data = await IdentityCC.GetProfile(req.user, ID);
        res.status(200).send(data);
    } catch (error) {
        console.log(error);
        res.status(404).send({ message: "Profile NOT found!" });
    }
});

router.post("/api/main/profile/createProfile", JWTmiddleware, async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");

    try {
        profileData = req.body.payload;
        await IdentityCC.CreateProfile(req.user, profileData);
        res.status(200).send({
            message: "Citizen Profile has been successfully added!",
            id: profileData.ID,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Error! Citizen Profile NOT Added!" });
    }
});

router.post("/api/main/profile/updateProfile", JWTmiddleware, async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");

    try {
        profileData = req.body.payload;
        await IdentityCC.UpdateProfile(req.user, profileData);
        res.status(200).send({ message: `Citizen Profile has been Successfully Updated. ID: ${profileData.ID}` });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: `Citizen Profile NOT updated! ID: ${profileData.UID}` });
    }
});

module.exports = router;
