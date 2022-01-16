const bodyParser = require("body-parser");
const { urlencoded } = require("body-parser");
var express = require("express");
const ItemModel = require("../models/ItemModel");
var router = express.Router();

var urlEncodedParser = bodyParser.urlencoded();

// gets item list
router.get("/", urlEncodedParser, async (req, res) => {
  try {
    // returns undeleted groceries
    const groceries = (await ItemModel.find()).filter((f) => !f.isDeleted);
    res.status(200).json(groceries);
  } catch (error) {
    res.status(404).json({ error });
  }
});

router.post("/add", urlEncodedParser, async (req, res) => {
  const model = new ItemModel({
    itemName: req.body.itemName,
  });

  try {
    const savedItem = await model.save();
    res.status(200).json(savedItem);
  } catch (error) {
    res.status(404).json({ error });
  }
});

// an update method actually
router.patch("/delete", urlEncodedParser, async (req, res) => {
  try {
    const deletedItem = await ItemModel.updateOne(
      { _id: req.body.id },
      { $set: { isDeleted: true } }
    );
    res.status(200).json({ deletedItem });
  } catch (error) {
    res.json({ message: error });
  }
});

router.patch("/update", urlEncodedParser, async (req, res) => {
  try {
    const updatedItem = await ItemModel.updateOne(
      { _id: req.body.id },
      { $set: { itemName: req.body.itemName } }
    );
    res.status(200).json({ updatedItem });
  } catch (error) {
    res.json({ message: error });
  }
});

module.exports = router;
