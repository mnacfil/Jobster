require('dotenv').config();
const Job = require('./model/Job');
const mockData = require('./assets/mock-data.json');
const connectToDB = require('./db/connection');

const populateData = async () => {
    console.log('hello')
    try {
        await connectToDB(process.env.MONGO_URI);
        await Job.create(mockData);
        console.log('success');
        process.exit(0)
    } catch (error) {
        console.log(error);
        process.exit(1)
    }
}

// populate the data for test user,
populateData();