"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
const bootcamps = JSON.parse(fs.readFileSync('./_data/bootcamps.json', 'utf-8'));
const courses = JSON.parse(fs.readFileSync('./_data/courses.json', 'utf-8'));
const users = JSON.parse(fs.readFileSync('./_data/users.json', 'utf-8'));
const reviews = JSON.parse(fs.readFileSync('./_data/reviews.json', 'utf-8'));
// Import into DB
const importData = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield Bootcamp.create(bootcamps);
        yield Course.create(courses);
        yield User.create(users);
        yield Review.create(reviews);
        console.log('Data Imported...');
        process.exit(0);
    }
    catch (err) {
        console.log(err);
        process.exit(1);
    }
});
// Delete data
const deleteData = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield Bootcamp.deleteMany();
        yield Course.deleteMany();
        yield User.deleteMany();
        yield Review.deleteMany();
        console.log('Data Destroyed...');
        process.exit(0);
    }
    catch (err) {
        console.log(err);
        process.exit(1);
    }
});
if (process.argv[2] === '-i') {
    importData();
}
else if (process.argv[2] === '-d') {
    deleteData();
}
