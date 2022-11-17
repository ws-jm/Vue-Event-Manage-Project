const uuid = require('uuid');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// collection for the primaryData schemma which will store clients
// information
let primaryDataSchema = new Schema({
    _id: { type: String, default: uuid.v1 },
    firstName: {
        type: String,
        require: true
    },
    middleName: {
        type: String,
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String
    },
    // removed the array part and just made the phones an object
    phoneNumbers: {
        primaryPhone: {
            type: String
        },
        secondaryPhone: {
            type: String
        }
    },
    // added state and country in order to better identify
    // the location
    address: {
        line1: {
            type: String
        },
        line2: {
            type: String,
        },
        city: {
            type: String,
        },
        county: {
            type: String,
        },
        state: {
            type: String,
        },
        zip: {
            type: String,
        }
    },
    orgs: {
        type: Array
    }
}, {
    collection: 'primaryData',
    timestamps: true
});

// collection for eventData schema that will store the events
let eventDataSchema = new Schema({
    _id: { type: String, default: uuid.v1 },
    eventName: {
        type: String,
        require: true
    },
    services: {
        type: Array
    },
    date: {
        type: Date,
        required: true
    },
    // added state and country attr in order to 
    // better identify the location that the event
    // is being taken place
    address: {
        line1: {
            type: String
        },
        line2: {
            type: String,
        },
        city: {
            type: String,
        },
        county: {
            type: String,
        },
        state: {
            type: String,
        },
        zip: {
            type: String,
        }
    },
    description: {
        type: String,
    },
    attendees: [{
        type: String
    }]
}, {
    collection: 'eventData'
});

// collection for orgData schema that will store
// information about the organization that will be using the application
let orgDataSchema = new Schema({
    _id: { type: String, default: uuid.v1 },
    name: {
        type: String
    },
    // orgEvents stores the id of the events that are associated with the organization
    orgEvents: [String],
}, {
    collection: 'orgData',
    timestamps: true
});



// create models from mongoose schemas
const primarydata = mongoose.model('primaryData', primaryDataSchema);
const eventdata = mongoose.model('eventData', eventDataSchema);
const orgdata = mongoose.model('orgData', orgDataSchema);

// package the models in an object to export 
module.exports = { primarydata, eventdata, orgdata }
