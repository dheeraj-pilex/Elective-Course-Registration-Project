require('dotenv').config({ path: '../backend/.env' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Import models
const User = require('../backend/models/User');
const Course = require('../backend/models/Course');
const Registration = require('../backend/models/Registration');
const Waitlist = require('../backend/models/Waitlist');

// Sample data
const users = [
  {
    username: 'admin01',
    email: 'admin@example.com',
    password: 'password789',
    fullName: 'Admin User',
    role: 'admin',
    department: 'Administration'
  },
  {
    username: 'faculty01',
    email: 'faculty1@example.com',
    password: 'password456',
    fullName: 'Dr. Jane Smith',
    role: 'faculty',
    department: 'Computer Science'
  },
  {
    username: 'faculty02',
    email: 'faculty2@example.com',
    password: 'password456',
    fullName: 'Dr. John Davis',
    role: 'faculty',
    department: 'Electrical Engineering'
  },
  {
    username: 'student01',
    email: 'student1@example.com',
    password: 'password123',
    fullName: 'Alice Johnson',
    role: 'student',
    studentId: 'S12345',
    department: 'Computer Science'
  },
  {
    username: 'student02',
    email: 'student2@example.com',
    password: 'password123',
    fullName: 'Bob Wilson',
    role: 'student',
    studentId: 'S67890',
    department: 'Electrical Engineering'
  },
  {
    username: 'student03',
    email: 'student3@example.com',
    password: 'password123',
    fullName: 'Charlie Brown',
    role: 'student',
    studentId: 'S54321',
    department: 'Mechanical Engineering'
  }
];

// Current semester
const currentSemester = 'Fall 2023';

// Function to seed the database
async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/elective_registration');
    console.log('Connected to MongoDB...');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Course.deleteMany({}),
      Registration.deleteMany({}),
      Waitlist.deleteMany({})
    ]);
    console.log('Database cleared...');

    // Create users
    const createdUsers = {};
    for (const userData of users) {
      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);
      
      // Create the user
      const user = await User.create({
        ...userData,
        password: hashedPassword
      });
      
      // Store user for reference
      createdUsers[userData.username] = user;
    }
    console.log('Users created...');

    // Create courses
    const courses = [
      {
        courseId: 'CS301',
        title: 'Advanced Web Development',
        description: 'Learn modern frontend and backend frameworks.',
        prerequisites: 'CS201',
        totalSeats: 30,
        seatsAvailable: 30,
        type: 'course',
        faculty: createdUsers['faculty01']._id,
        department: 'CS',
        requiresApproval: false
      },
      {
        courseId: 'CS401',
        title: 'Machine Learning',
        description: 'Introduction to machine learning algorithms and applications.',
        prerequisites: 'CS302, MA210',
        totalSeats: 25,
        seatsAvailable: 25,
        type: 'course',
        faculty: createdUsers['faculty01']._id,
        department: 'CS',
        requiresApproval: false
      },
      {
        courseId: 'EE410',
        title: 'Introduction to IoT',
        description: 'Explore the basics of Internet of Things.',
        prerequisites: 'EE205',
        totalSeats: 20,
        seatsAvailable: 20,
        type: 'course',
        faculty: createdUsers['faculty02']._id,
        department: 'EE',
        requiresApproval: false
      },
      {
        courseId: 'PROJ501',
        title: 'Academic Research Project',
        description: 'Independent research project under faculty supervision.',
        prerequisites: 'Approval Required',
        totalSeats: 10,
        seatsAvailable: 10,
        type: 'project',
        faculty: createdUsers['faculty01']._id,
        department: 'CS',
        requiresApproval: true
      },
      {
        courseId: 'PROJ502',
        title: 'Industry Collaboration Project',
        description: 'Work on real-world problems with industry partners.',
        prerequisites: 'Approval Required',
        totalSeats: 15,
        seatsAvailable: 15,
        type: 'project',
        faculty: createdUsers['faculty02']._id,
        department: 'EE',
        requiresApproval: true
      }
    ];

    const createdCourses = {};
    for (const courseData of courses) {
      const course = await Course.create(courseData);
      createdCourses[courseData.courseId] = course;
    }
    console.log('Courses created...');

    // Create some registrations
    const registrations = [
      {
        student: createdUsers['student01']._id,
        course: createdCourses['CS301']._id,
        semester: currentSemester,
        status: 'approved',
        approvalDate: new Date(),
        registrationDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
      },
      {
        student: createdUsers['student02']._id,
        course: createdCourses['EE410']._id,
        semester: currentSemester,
        status: 'approved',
        approvalDate: new Date(),
        registrationDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
      },
      {
        student: createdUsers['student01']._id,
        course: createdCourses['PROJ501']._id,
        semester: currentSemester,
        status: 'pending',
        registrationDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
      }
    ];

    // Update available seats for registered courses
    await Course.findByIdAndUpdate(
      createdCourses['CS301']._id,
      { $inc: { seatsAvailable: -1 } }
    );
    
    await Course.findByIdAndUpdate(
      createdCourses['EE410']._id,
      { $inc: { seatsAvailable: -1 } }
    );
    
    await Course.findByIdAndUpdate(
      createdCourses['PROJ501']._id,
      { $inc: { seatsAvailable: -1 } }
    );

    for (const registrationData of registrations) {
      await Registration.create(registrationData);
    }
    console.log('Registrations created...');

    // Create waitlist entry
    const waitlistEntries = [
      {
        student: createdUsers['student03']._id,
        course: createdCourses['CS301']._id,
        semester: currentSemester,
        position: 1,
        joinDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        status: 'active'
      }
    ];

    for (const waitlistData of waitlistEntries) {
      await Waitlist.create(waitlistData);
    }
    console.log('Waitlist entries created...');

    console.log('Database seeded successfully!');
    console.log('\nYou can use these credentials to log in:');
    console.log('Admin: username=admin01, password=password789');
    console.log('Faculty: username=faculty01, password=password456');
    console.log('Student: username=student01, password=password123');
    
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    // Close the connection
    mongoose.connection.close();
  }
}

// Run the seeding function
seedDatabase(); 