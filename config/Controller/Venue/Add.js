const VenueModel = require('../../Model/VenueSchema')

const Add = async (req, res) => {
    const { venueName, capacity, fixedCharges, personCharges, imageLinks } = req.body;
    const venueImage = req.files['venueImage'];
    if (!venueName || !capacity || !venueImage || !fixedCharges || !personCharges || !imageLinks) {
        return res.status(400).json({
            status: 400,
            message: "Required Venue parameters are missing",
        });
    }

    console.log(req.body)
    console.log(venueImage)
    
    try {

        const venue = new VenueModel({
            venueName,
            venueImageName: venueImage[0].originalname,
            venueImagePath: venueImage[0].path,
            capacity,
            fixedCharges,
            personCharges,
            imageLinks
        }); 
        

        await venue.save()

        res.status(201).json({
            status: 200,
            message: " Venue Added Successfully",
            venue,
        });
    }
    catch (error) {
        console.error("Error Adding Venue", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = Add;
