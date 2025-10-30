const express = require('express');
const Event = require('../models/Event');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const events = await Event.find({ userId: req.user.id });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', auth, async (req, res) => {
  const { title, startTime, endTime } = req.body;
  try {
    const event = new Event({ title, startTime, endTime, userId: req.user.id });
    await event.save();
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id', auth, async (req, res) => {
  const { title, startTime, endTime, status } = req.body;
  try {
    const event = await Event.findById(req.params.id);
    if (!event || event.userId.toString() !== req.user.id) return res.status(404).json({ message: 'Event not found' });

    event.title = title || event.title;
    event.startTime = startTime || event.startTime;
    event.endTime = endTime || event.endTime;
    event.status = status || event.status;
    await event.save();
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event || event.userId.toString() !== req.user.id) return res.status(404).json({ message: 'Event not found' });

    await event.remove();
    res.json({ message: 'Event deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
