const express = require('express');
const router = express.Router();
const CorporateUtils = require('../utils/CorporateUtils');
const corporateUtils = new CorporateUtils();

// Parses the request body (req.body) as JSON, converts it to a string,
// and then parses the string back into a JSON object. This is done to
// create a deep copy of the req.body object, as modifying it directly
// can cause unexpected behavior.
router.use(express.json(), (req, res, next) => {
  req.body = JSON.parse(JSON.stringify(req.body));
  next();
});

// GET all corporates
router.get('/', (req, res) => {
  corporateUtils.getCorporates()
    .then((corporates) => {
      return res.status(200).send(corporates);
    })
    .catch((error) => {
      return res.status(500).send(error);
    });
});

// GET a single corporate by ID
router.get('/:id', (req, res) => {
  corporateUtils.getCorporateById(req.params.id)
    .then((corporate) => {
      if (!corporate) {
        return res.status(404).send('Corporate not found');
      }
      return res.status(200).send(corporate);
    })
    .catch((error) => {
      return res.status(500).send(error);
    });
});

// POST a new corporate
router.post('/', (req, res) => {
  corporateUtils.addCorporate(req.body)
    .then((newCorporate) => {
      return res.status(201).send(newCorporate);
    })
    .catch((error) => {
      return res.status(500).send(error);
    });
});

// PUT an updated corporate
router.put('/:id', (req, res) => {
  corporateUtils.updateCorporate(req.params.id, req.body)
    .then((updatedCorporate) => {
      if (!updatedCorporate) {
        return res.status(404).send('Corporate not found');
      }
      return res.status(200).send(updatedCorporate);
    })
    .catch((error) => {
      return res.status(500).send(error);
    });
});

// DELETE a corporate by ID
router.delete('/:id', (req, res) => {
  corporateUtils.deleteCorporate(req.params.id)
    .then((deletedCorporate) => {
      if (!deletedCorporate) {
        return res.status(404).send('Corporate not found');
      }
      return res.status(200).send(deletedCorporate);
    })
    .catch((error) => {
      return res.status(500).send(error);
    });
});

module.exports = router;
