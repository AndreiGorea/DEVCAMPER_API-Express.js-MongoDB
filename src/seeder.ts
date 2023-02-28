// fs - file system module
const fs = require('fs');
// @ts-ignore
const mongoose = require('mongoose');
const dotenv = require('dotenv');


// Load env vars
dotenv.config({ path: './src/config/config.env' });

// Load models
const Bootcamp = require('./models/Bootcamp.ts');
const Course = require('./models/Course.ts');
// @ts-ignore
const User = require('./models/User.ts');
// @ts-ignore
const Review = require('./models/Review.ts');

// Connect to DB

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Read JSON files
const bootcamps = JSON.parse(
    fs.readFileSync('./_data/bootcamps.json', 'utf-8'));

const courses = JSON.parse(
    fs.readFileSync('./_data/courses.json', 'utf-8'));

const users = JSON.parse(
    fs.readFileSync('./_data/users.json', 'utf-8'));

const reviews = JSON.parse(
    fs.readFileSync('./_data/reviews.json', 'utf-8'));

// Import into DB
const importData = async () => {
    try {
        await Bootcamp.create(bootcamps);
        await Course.create(courses);
        await User.create(users);
        await Review.create(reviews);

        console.log('Data Imported...');
        process.exit(0);
    }
    catch (err) {
        console.log(err);
        process.exit(1);
    }
}

// Delete data
const deleteData = async () => {
    try {
        await Bootcamp.deleteMany();
        await Course.deleteMany();
        await User.deleteMany();
        await Review.deleteMany();

        console.log('Data Destroyed...');
        process.exit(0);
    }
    catch (err) {
        console.log(err);
        process.exit(1);
    }
}

if(process.argv[2] === '-i') {
    importData();
} else if (process.argv[2] === '-d') {
    deleteData();
}
