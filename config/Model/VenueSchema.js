const mongoose = require("mongoose");

const VenueSchema = new mongoose.Schema(
    {
        venueName: {
            type: String,
            required: true
        },
        capacity: {
            type: String,
            required: true
        },
        venueImageName: {
            type: String,
            required: true
        },
        venueImagePath: {
            type: String,
            required: true
        },
        fixedCharges: {
            type: String,
            required: true
        },
        personCharges: {
            type: String,
            required: true
        },
        imageLinks: [String],
        addedBy: {
            type: String,
            // required: true
        },
        updatedBy: {
            type: String,
        }
    },
    { timestamps: true }
)
const VenueModel = mongoose.model("Venue", VenueSchema);
module.exports = VenueModel;