const express = require("express");
const router = express.Router();

//importing data model schemas
let { eventdata } = require("../models/models");
let { orgdata } = require("../models/models");

// returns orgname for the organization that is running the instance in 
// order to display it on the frontend
router.get("/orgName/", (req, res, next) => {
    orgdata.find({ _id: process.env.ORGANIZATION }, { name: true },
        (error, data) => {
            if (error) {
                return next(error);
            } else {
                res.json(data);
            }
        }
    ).sort({ 'updatedAt': -1 }).limit(10);
});

// ----------- GET requests to manage organizations ------------
//GET all entries
router.get("/", (req, res, next) => {
    orgdata.find(
        (error, data) => {
            if (error) {
                return next(error);
            } else {
                res.json(data);
            }
        }
    ).sort({ 'updatedAt': -1 }).limit(10);
});

//GET single entry by ID
router.get("/id/:id", (req, res, next) => {
    orgdata.find(
        { _id: req.params.id },
        (error, data) => {
            if (error) {
                return next(error);
            } else {
                res.json(data);
            }
        }
    );
});

// ---------------- POST Requests to manage organizations ---------
//POST
router.post("/", (req, res, next) => {
    orgdata.create(
        req.body,
        (error, data) => {
            if (error) {
                return next(error);
            } else {
                res.json(data);
            }
        }
    );
    orgdata.createdAt;
    orgdata.updatedAt;
    orgdata.createdAt instanceof Date;
});

// PUT requests updates the org events array by inserting a new eventID
router.put("/addEvent/", (req, res, next) => {
    orgdata.updateOne(
        { _id: process.env.ORGANIZATION },
        {
            // push used to add an id to the array
            $push: req.body
        },
        (error, data) => {
            if (error) {
                return next(error);
            } else {
                res.json(data);
            }
        }
    );
});

// PUT requests updates the org events array by removing a new eventID
router.put("/removeEvent/", (req, res, next) => {
    orgdata.updateOne(
        { _id: process.env.ORGANIZATION },
        {
            // pull used to remove an id from the array
            $pull: req.body
        },
        (error, data) => {
            if (error) {
                return next(error);
            } else {
                res.json(data);
            }
        }
    );
});

// deletes an org by using the ID of the org
router.delete("/deleteOrg/", (req, res, next) => {

    orgdata.remove(
        { _id: req.body._id },
        (error, data) => {
            if (error) {
                return next(error);
            } else {
                res.json(data);
            }
        }
    );
});
//
module.exports = router;