const express = require("express");
const router = express.Router();

//importing data model schemas
// importing both the orgdata and the eventdata in order
// to grab events from the specific org
let { eventdata } = require("../models/models");
let { orgdata } = require("../models/models");

// IMPORTANT - "/" route will only return the events that are apart of the organization
// that is running the instance. So depending on id that is stored in the .env file ex: ORGANIZATION = 'XXXXXXXXX-452e-11ed-a044-27e6ab98a1a8'
// some routes will only return specifically for that org


// this function will be used in the routes in order to pass
// through the org's information -orgEvents- to return
function orgInfo(routeFunction) {
    // grabbing the ORGANIZATION env variable that contains the id of the orgs 
    // that is running the instance

    orgdata.find({ "_id": process.env.ORGANIZATION },
        (error, data) => {
            if (error) {
                return next(error);
            } else {
                // parses through the data and stores the event array 
                // containing the events in the event variable
                let events = data[0];
                // passes through the event array to the function that is calling it
                // allowing the function to use the event id that belongs to the speific org
                routeFunction(events);
            }
        }
    ).sort({ 'updatedAt': -1 }).limit(10);
}
// ----------------- GET REQUESTS ------------------
//GET all events that belong to the organization 
router.get("/", (req, res, next) => {
    orgInfo(orgEventData)
    // function to find all eventdata for the org
    function orgEventData(eventList) {
        let event = eventList;
        // using $in in order to find any events that are in the event array, which comes from the orgInfo function
        // this array will only contain event id's for that are assigned to instance org
        eventdata.find({},
            (error, data) => {
                if (error) {
                    return next(error);
                } else {
                    res.json(data);
                }
            }
        ).sort({ 'updatedAt': -1 }).limit(10000);
    };
});

//GET single entry by ID
router.get("/id/:id", (req, res, next) => {
    orgInfo(orgEventDataID)
    function orgEventDataID(eventList) {
        eventdata.find({ _id: req.params.id }, (error, data) => {
            if (error) {
                return next(error)
            } else {
                res.json(data)
            }
        })
    };
});

router.get("/allData", (req, res, next) => {
    eventdata.find({},
        (error, data) => {
            if (error) {
                return next(error);
            } else {
                res.json(data);
            }
        }
    ).sort({ 'updatedAt': -1 }).limit(10000);
});


// GET entries based on search query
// Ex: '...?eventName=Food&searchBy=name' 
router.get("/search", (req, res, next) => {
    orgInfo(searchorgEvent) // runs functions to only use events for the specfic org

    function searchorgEvent(eventList) {
        let dbQuery = "";
        // checks if searchBy is name or date
        if (req.query["searchBy"] === 'name') {
            // query checks if id is in th eventList then finds the event by its name
            dbQuery = { _id: { $in: eventList }, eventName: { $regex: `^${req.query["eventName"]}`, $options: "i" } }
        } else if (req.query["searchBy"] === 'date') {
            dbQuery = {
                // checks if event in the event list then if the dates match
                _id: { $in: eventList }, date: req.query["eventDate"]
            }
        };

        // finds the event based on the query we created above
        eventdata.find(
            dbQuery,
            (error, data) => {
                if (error) {
                    return next(error);
                } else {
                    res.json(data);
                }
            }
        );
    };
});


//GET events for which a client is signed up
router.get("/client/:id", (req, res, next) => {
    eventdata.find(
        { attendees: req.params.id },
        (error, data) => {
            if (error) {
                return next(error);
            } else {
                res.json(data);
            }
        }
    );
});


// GET request that returns the information needed for the dashboard
router.get("/ptmevents", (req, res, next) => {
    orgInfo(orgEventDashboardData)
    function orgEventDashboardData(eventList) {
        var today = new Date();
        newDate = new Date(today.getFullYear(), today.getMonth() - 2, 1);
        eventdata.find(
            { _id: { $in: eventList }, date: { $gte: newDate } }, { eventName: true, attendees: true, date: true },
            (error, data) => {
                if (error) {
                    return next(error);
                } else {
                    let eventsLen = { numOfEvents: data.length }
                    data.push(eventsLen)
                    res.json(data);
                }
            }
        ).sort({ 'updatedAt': -1 }).limit(10);
    };
});

// ------------------- POST REQUESTS ------------------------
//POST request that adds an event to the collection
router.post("/", (req, res, next) => {
    req.body.orgs = process.env.ORGANIZATION
    eventdata.create(
        req.body,
        (error, data) => {
            if (error) {
                return next(error);
            } else {
                addEventToOrg(data._id)
                res.json(data);
            }
        }
    );
    function addEventToOrg(id) {
        orgdata.updateOne(
            { _id: process.env.ORGANIZATION },
            {
                // push used to add an id to the array
                $push: {orgEvents : id}
            },
            (error, data) => {
                if (error) {
                    return next(error);
                } else {
                 
                }
            }
        );
    }
});

// ------------------ PUT REQUESTS ------------------
//PUT request that updates an event given the id of th event
router.put("/:id", (req, res, next) => {
    eventdata.findOneAndUpdate(
        { _id: req.params.id },
        req.body,
        (error, data) => {
            if (error) {
                return next(error);
            } else {
                res.json(data);
            }
        }
    );
});

//PUT request that adds an attendee to event
// given the id of th event and the attendees
router.put("/addAttendee/:id", (req, res, next) => {
    //only add attendee if not yet signed uo
    eventdata.find(
        { _id: req.params.id, attendees: req.body.attendee },
        (error, data) => {
            if (error) {
                return next(error);
            } else {
                if (data.length == 0) {
                    eventdata.updateOne(
                        { _id: req.params.id },
                        // using $push to add an attendee to the aray
                        { $push: { attendees: req.body.attendee } },
                        (error, data) => {
                            if (error) {
                                return next(error);
                            } else {
                                res.json(data);
                            }
                        }
                    );
                }

            }
        }
    );

});

// PUT to remove an attendee from an event
router.put("/removeAttendee/:id", (req, res, next) => {
    //only add attendee if not yet signed uo
    eventdata.find(
        { _id: req.params.id, attendees: req.body.attendee },
        (error, data) => {
            if (error) {
                return next(error);
            } else {
                eventdata.updateOne(
                    { _id: req.params.id },
                    // using $pull to remove the attendee from the array
                    { $pull: { attendees: req.body.attendee } },
                    (error, data) => {
                        if (error) {
                            return next(error);
                        } else {
                            res.json(data);
                        }
                    }
                );
            }
        }
    );
});

//------------------ DELETE Requests ------------------------------
//DELETE request to remove an Event by using the ID of the event
router.delete("/deleteEvent/:id", (req, res, next) => {
    eventdata.findOneAndRemove(
        { _id: req.params.id },
        (error, data) => {
            if (error) {
                return next(error);
            } else {
                res.status(200).json({
                    msg: data
                });
                res.send('Event is deleted');
            }
        });
});


module.exports = router;