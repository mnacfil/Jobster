const express = require('express');
const router = express.Router();

// middleware
const { testuser } = require('../middleware');

// controllers
const {
    getAllJob,
    getSingleJob,
    createJob,
    updateJob,
    deleteJob,
    showStats
} = require('../controllers/job')

router.route('/stats').get(showStats);
router.route('/add-job').post([testuser, createJob]);
router.route('/all-job').get(getAllJob);
router.route('/:id').
                get(getSingleJob).
                patch([testuser, updateJob]).
                delete([testuser, deleteJob])

module.exports = router;