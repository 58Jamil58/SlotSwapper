const express = require('express');
const SwapRequest = require('../models/SwapRequest');
const Event = require('../models/Event');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/swappable-slots', auth, async (req, res) => {
  try {
    const slots = await Event.find({ status: 'SWAPPABLE', userId: { $ne: req.user.id } });
    res.json(slots);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/swap-request', auth, async (req, res) => {
  const { mySlotId, theirSlotId } = req.body;
  try {
    const mySlot = await Event.findById(mySlotId);
    const theirSlot = await Event.findById(theirSlotId);

    if (!mySlot || !theirSlot || mySlot.userId.toString() !== req.user.id || theirSlot.status !== 'SWAPPABLE' || mySlot.status !== 'SWAPPABLE') {
      return res.status(400).json({ message: 'Invalid slots' });
    }

    const swapRequest = new SwapRequest({
      requesterId: req.user.id,
      requestedSlotId: theirSlotId,
      offeredSlotId: mySlotId,
    });

    await swapRequest.save();

    mySlot.status = 'SWAP_PENDING';
    theirSlot.status = 'SWAP_PENDING';
    await mySlot.save();
    await theirSlot.save();

    res.json(swapRequest);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/swap-response/:requestId', auth, async (req, res) => {
  const { accepted } = req.body;
  try {
    const swapRequest = await SwapRequest.findById(req.params.requestId);
    if (!swapRequest) return res.status(404).json({ message: 'Swap request not found' });

    const requestedSlot = await Event.findById(swapRequest.requestedSlotId);
    const offeredSlot = await Event.findById(swapRequest.offeredSlotId);

    if (!requestedSlot || !offeredSlot) return res.status(404).json({ message: 'Slots not found' });

    if (accepted) {
      const tempUserId = requestedSlot.userId;
      requestedSlot.userId = offeredSlot.userId;
      offeredSlot.userId = tempUserId;

      requestedSlot.status = 'BUSY';
      offeredSlot.status = 'BUSY';

      await requestedSlot.save();
      await offeredSlot.save();

      swapRequest.status = 'ACCEPTED';
    } else {
      requestedSlot.status = 'SWAPPABLE';
      offeredSlot.status = 'SWAPPABLE';

      await requestedSlot.save();
      await offeredSlot.save();

      swapRequest.status = 'REJECTED';
    }

    await swapRequest.save();
    res.json(swapRequest);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/incoming-requests', auth, async (req, res) => {
  try {
    const requests = await SwapRequest.find({ status: 'PENDING' }).populate('requestedSlotId').populate('offeredSlotId');
    const incoming = requests.filter(request => request.requestedSlotId.userId.toString() === req.user.id);
    res.json(incoming);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/outgoing-requests', auth, async (req, res) => {
  try {
    const requests = await SwapRequest.find({ requesterId: req.user.id }).populate('requestedSlotId').populate('offeredSlotId');
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
