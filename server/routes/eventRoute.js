const router = require("express").Router();
const { check } = require("express-validator");

const eventctrl = require("../controllers/admin");

router.get("/:city", eventctrl.fetchEventsOfCity);

router.post(
  "/addevent",
  [
    check("eventname", "Event Name is required").notEmpty(),
    check("eventname", "Min 3 Characters required for Event Name").isLength({
      min: 3,
    }),
    check("eventname", "Event Name should be a string").isString(),
    check("city", "City is required").notEmpty(),
    check("city", "City should be a string").isArray(),
    check("description", "Description is required").notEmpty(),
    check("description", "Min 3 Characters required for description").isLength({
      min: 5,
    }),
    check("description", "Description should be a string").isString(),
    check("tags", "Tags should be an Array").isArray(),
    check("VIPprice", "Vip Price is required").notEmpty(),
    check("VIPprice", "Vip Price should be of type number").isNumeric(),
    check("GAprice", "GA Price should be of type number").notEmpty(),
    check("GAprice", "GA Price should be of type number").isNumeric(),
    check("MaxTickets", "Maximum ticket should be of type number").isNumeric(),
    check("MaxTickets", "Maximum ticket is required").notEmpty(),
    check("ImageURL", "ImageURL is of type String").isString(),
    check("ImageURL", "ImageURL is required").notEmpty(),
    check("slots", "Slots should be an array").isArray(),
    check("slots.*.date", "Date should be of type date").isString(),
    check("slots.*.starttime", "Start time is required").notEmpty(),
    check("slots.*.starttime", "Start time should be of type date").isString(),
    check("slots.*.endtime", "End time should be of type date").isString(),
    check("slots.*.viptickets", "VIP tickets is required").notEmpty(),
    check(
      "slots.*.viptickets",
      "VIP tickets should be of type Number"
    ).isNumeric(),
    check("slots.*.gatickets", "GA ticket is required").notEmpty(),
    check(
      "slots.*.gatickets",
      "GA tickets should be of type Number"
    ).isNumeric(),
  ],
  eventctrl.addevent
);

router.put(
  "/updateevent",
  [check("eventname", "Event name is required").notEmpty()],
  eventctrl.updateevent
);

router.delete(
  "/deleteevent",
  [check("eventname", "Event name is required").notEmpty()],
  eventctrl.deleteevent
);

module.exports = router;
