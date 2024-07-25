const express = require('express');
const router = express.Router();

// TODO: Import controllers

// Create a new payment
router.post('/', (req, res) => {
  // TODO: Implement payment creation
});

// Get all payments for a user
router.get('/user/:userId', (req, res) => {
  // TODO: Implement fetching all payments for a user
});

module.exports = router;
