const Job = require('../model/Job');
const CustomError = require('../error');
const { StatusCodes } = require('http-status-codes');
const mongoose = require('mongoose');
const moment = require('moment');

const getAllJob = async (req, res) => {

    const {search, status, sort, jobType} = req.body;
    
    const query = {
        createdBy: req.user.userId
    }
    // query all job base on search input, and disregrad the case sensitivity
    if(search) {
        query.position = { $regex: search, $options: 'i'};
    }
    // query all job base on status of job
    if(status && status !== 'all') {
        query.status = status;
    }
    // query all job base on job type of job
    if(jobType && jobType !== 'all') {
        query.jobType = jobType;
    }

    let result = Job.find(query);

    // Sort it from latest, olders, a to z or z to a
    if(sort === 'latest') {
        result = result.sort('-createdAt');
    }
    if(sort === 'oldest') {
        result = result.sort('createdAt');
    }
    if(sort === 'a-z') {
        result = result.sort('position');
    }
    if(sort === 'z-a') {
        result = result.sort('-position');
    }

    // create pagination,
    // by default the jobs will be 10 and page === 1
    let page = Number(req.query.page) || 1;
    let limit = Number(req.query.limit) || 10;
    let skip = (page - 1) * limit;

    result =  result.skip(skip).limit(limit);

    // finally await for the result of query
    let jobs = await result;
    let totalJob = await Job.countDocuments(query);
    let numberOfPage = Math.ceil(totalJob / limit);

    res.status(StatusCodes.OK).json({jobs, totalJob, numberOfPage});
}

const getSingleJob = async (req, res) => {
    const job = await Job.findOne({
        _id: req.params.id,
        createdBy: req.user.userId
    });
    if(!job) {
        throw new CustomError.NotFoundError(`No job found with id : ${req.params.id}`);
    }
    res.status(StatusCodes.OK).json({job});
}

const createJob = async (req, res) => {
    const {position, company, location} = req.body;
    if(!position || !company || !location) {
        throw new CustomError.BadRequestError('Please fill out all fields');
    }
    req.body.createdBy = req.user.userId;
    const job = await Job.create(req.body);
    res.status(StatusCodes.CREATED).json({msg: 'Job created', job})
}

const updateJob = async (req, res) => {
    const {position, company, location, status, jobType} = req.body;

    if(!position || !company || !location || !status || !jobType) {
        throw new CustomError.BadRequestError('Please fill out all fields');
    }
    const {id: jobId} = req.params;

    const job = await Job.findOne({
        createdBy: req.user.userId,
        _id: jobId
    })
    if(!job) {
        throw new CustomError.NotFoundError('Job not found!')
    }

    job.position = position;
    job.company = company;
    job.jobLocation = location;
    job.status = status;
    job.jobType = jobType;

    await job.save();
    res.status(StatusCodes.OK).json({msg: 'Job Updated!', job})
}

const deleteJob = async (req, res) => {
    const job = await Job.findOne({
        _id: req.params.id,
        createdBy: req.user.userId
    });
    if(!job) {
        throw new CustomError.NotFoundError(`No job found with id : ${req.params.id}`);
    }
    await job.remove();
    res.status(StatusCodes.OK).json({msg: 'Success, Job removed!'});
}

const showStats = async (req, res) => {
    let stats = await Job.aggregate([
        // 1st stage, $match
        // will match all the documents that belong to specific user
        { $match: {createdBy: mongoose.Types.ObjectId(req.user.userId)}},
        // 2nd stage, group
        // this will group the output of $match(documents), group it base on status of job in this case
        { $group: { _id: '$status', count: { $sum: 1}}}
    ])
    // format it according to the front-end expecting
    stats = stats.reduce((acc, curr) => {
        const {_id: title, count} = curr;
        acc[title] = count;
        return acc
    }, {})
    
    // setup default stats, the user has many jobs
    // Or the user has few/no jobs
    const defaultStats = {
        pending: stats.pending || 0,
        interview: stats.interview || 0,
        declined: stats.declined || 0
    }
    // counting how many application the user sent over
    // the last 6 month
    let monthlyApplications = await Job.aggregate([
        // 1st stage, match
        { $match: { createdBy: mongoose.Types.ObjectId }},
        // 2nd stage, group
        // group the output of $match by year and month
        { $group: {
            _id: { year: { $year : '$createdAt'}, 
                    month: { $month: '$createdAt'}
                },
            count: { $sum: 1} }},
        // 3rd stage, Sort
        // sort in descending order (latest job)
        { $sort: { '_id.year': -1, '_id.month': -1 }},
        // 4th stage, limit
        // limit to 6 month
        { $limit: 6}
    ])

    monthlyApplications = monthlyApplications.map(item => {
        const {_id: { year, month}, count} = item;
        const date = moment().month(month - 1).year(year).format('MMM Y');
        return { date, count };
    })
    res.status(StatusCodes.OK).json({defaultStats, monthlyApplications})
}

module.exports = {
    getAllJob,
    getSingleJob,
    createJob,
    updateJob,
    deleteJob,
    showStats
}