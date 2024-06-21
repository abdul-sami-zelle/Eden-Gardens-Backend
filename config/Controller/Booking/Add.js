const BookingModel = require("../../Model/BookingSchema");
const SlotModel = require("../../Model/SlotSchema");

const Add = async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    zip,
    city,
    state,
    venue,
    selectedDate,
    selectedSlot,
    eventType,
    minPerson,
    maxPerson,
  } = req.body;

  // Check if required parameters are missing
  if (
    !firstName ||
    !email ||
    !phone ||
    !zip ||
    !city ||
    !state ||
    !venue ||
    !selectedDate ||
    !selectedSlot.length ||
    !eventType ||
    !minPerson ||
    !maxPerson
  ) {
    return res.json({
      message: "Required Booking parameters are missing",
    });
  }

  try {


    let AllBooking = await BookingModel.find();
    // Check if the date exists in the SlotModel
    const existingSlot = await SlotModel.findOne({
      date: selectedDate,
      venue,
    });
    if (!existingSlot) {
      return res.json({
        status: 500,
        message: "This date does not have any available slots",
      });
    }

    const invalidSlots = selectedSlot.filter(slot =>
      !existingSlot.slots.some(s =>
        s.slot === slot && s.availability === 'yes'
      )
    );


    if (invalidSlots.length > 0) {
      return {
        status: 500,
        message: `The following slots are not available: ${invalidSlots.join(', ')}`,
      };
    }
    existingSlot.slots.forEach(slot => {
      if (selectedSlot.includes(slot.slot)) {
        slot.availability = 'no';
      }
      if (slot.slot === 'Full Day') {
        slot.availability = 'no';
      }
    });


    // If Full Day is selected, set the availability of all slots to 'no'
    if (selectedSlot.includes('Full Day')) {
      existingSlot.slots.forEach(slot => {
        // if (selectedSlot.includes(slot.slot)) {
        slot.availability = 'no';
        // }
      });

    }

    // For Full Day event, ensure only one slot is present in the array
    if (selectedSlot.includes('Full Day')) {
      const fullDaySlotIndex = selectedSlot.findIndex(slot => slot === 'Full Day');
      selectedSlot.splice(fullDaySlotIndex + 1);
    }
    const BookingNumber = `Bok-${AllBooking.length + 1}`;
    const data = {
      firstName,
      lastName,
      email,
      phone,
      zip,
      city,
      state,
      venue,
      selectedDate,
      selectedSlot,
      eventType,
      minPerson,
      maxPerson,
      BookingId: BookingNumber,
      Status: "Opened",
    };

    const Booking = await BookingModel.create(data);

    await existingSlot.save();

    res.status(200).json({
      status: 200,
      message: selectedSlot.includes("Full Day")
        ? "Full day event booked successfully"
        : "Booking added successfully",
      Booking,
    });
  } catch (error) {
    console.error("Error adding booking", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = Add;
