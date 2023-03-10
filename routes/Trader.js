const { json } = require('body-parser');
const express = require('express');
const router = express.Router();
const TraderUtils = require('../utils/TraderUtils');
const trader = new TraderUtils();

router.get('/', async (req, res) => {
  try {
    const traders = await trader.getAllTrader();
    if (traders.length === 0) {
      return res.status(404).send({
        message: "No traders yet",
        value: traders,
      });
    } else {
      return res.status(200).send({
        message: "Traders found",
        value: traders,
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(502).send("Bad Gateway");
  }
});

router.get('/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const traderData = await trader.getTraderById(id);
    if (!traderData) {
      return res.status(404).send({
        message: "Trader not found",
        value: traderData
      });
    } else {
      return res.status(200).send({
        message: "Trader found",
        value: traderData
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(502).send("Bad Gateway");
  }
});

router.get('/email/:email', async (req, res) => {
  const email = req.params.email;
  try {
    const traderData = await trader.getTraderByEmail(email);
    if (!traderData) {
      return res.status(404).send({
        message: `Trader with email ${email} not found`,
        value: traderData,
      });
    } else {
      return res.status(200).send({
        message: "Trader found",
        value: traderData
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(502).send("Bad Gateway");
  }
});

router.post('/', async (req, res) => {
  const parsedTrader = req.body;
  try {
    const newTrader = await trader.addTrader(parsedTrader);
    return res.status(201).send({
      message: "Trader created",
      value: newTrader
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      message: "Server error",
      value: null
    });
  }
});

module.exports = router;
