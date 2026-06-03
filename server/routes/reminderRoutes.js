import express from 'express';

const router = express.Router();

// GET reminders
router.get('/', async (req, res) => {
  res.json([
    {
      _id: 1,
      title: 'Meeting',
      date: '2026-05-30',
      time: '10:00 AM',
    },
    {
      _id: 2,
      title: 'Project Submission',
      date: '2026-06-02',
      time: '5:00 PM',
    },
  ]);
});

export default router;