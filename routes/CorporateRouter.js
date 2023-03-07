const express = require('express');
const router = express.Router();
const CorporateUtils = require('../utils/CorporateUtils');
const corporateUtils = new CorporateUtils();

// GET all corporates
router.get('/', async (req, res) => {
  try {
    const corporates = await corporateUtils.getCorporates();
    return res.status(200).send(corporates);
  } catch (error) {
    return res.status(500).send(error);
  }
});

// GET a single corporate by ID
router.get('/:id', async (req, res) => {
  try {
    const corporate = await corporateUtils.getCorporateById(req.params.id);
    if (!corporate) {
      return res.status(404).send('Corporate not found');
    }
    return res.status(200).send(corporate);
  } catch (error) {
    return res.status(500).send(error);
  }
});

// POST a new corporate
router.post('/', async (req, res) => {
    try {
      const result = await corporateUtils.addCorporate(req.body);
      if (result.message) {
        return res.status(409).send(result);
      } else {
        return res.status(201).send(result);
      }
    } catch (error) {
      return res.status(500).send(error);
    }
  });
  

// PUT an updated corporate
router.put('/:id', async (req, res) => {
  try {
    const updatedCorporate = await corporateUtils.updateCorporate(req.params.id, req.body);
    if (!updatedCorporate) {
      return res.status(404).send('Corporate not found');
    }
    return res.status(200).send(updatedCorporate);
  } catch (error) {
    return res.status(500).send(error);
  }
});

// DELETE a corporate
router.delete('/:id', async (req, res) => {
  try {
    const deletedCorporate = await corporateUtils.deleteCorporate(req.params.id);
    if (!deletedCorporate) {
      return res.status(404).send('Corporate not found');
    }
    return res.status(200).send(deletedCorporate);
  } catch (error) {
    return res.status(500).send(error);
  }
});

module.exports = router;
