const express = require('express');
const router = express.Router();
const admin = require('../utils/AdmiUtils');
const Admin = new admin();
router.post('/', async (req, res) => {
  try {
    await Admin.addAdmin(req.body).then((response) => {
      res.send(response);
    });
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

router.get('/', async (req, res) => {
  try {
    const admins = await Admin.find({});
    res.send(admins);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    if (!admin) {
      return res.status(404).send();
    }
    res.send(admin);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.patch('/:id', async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'email', 'password'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }

  try {
    const admin = await Admin.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!admin) {
      return res.status(404).send();
    }
    res.send(admin);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const admin = await Admin.findByIdAndDelete(req.params.id);
    if (!admin) {
      return res.status(404).send();
    }
    res.send(admin);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
