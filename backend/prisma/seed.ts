import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seeding...');

  // Create Admin User
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@nexus.com' },
    update: {},
    create: {
      email: 'admin@nexus.com',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      phoneNumber: '+1234567890',
      dateOfBirth: new Date('1990-01-01'),
      address: '123 Admin Street',
    },
  });
  console.log('✓ Admin user created:', admin.email);

  // Create Teacher
  const teacherPassword = await bcrypt.hash('teacher123', 10);
  const teacher = await prisma.user.upsert({
    where: { email: 'teacher@nexus.com' },
    update: {},
    create: {
      email: 'teacher@nexus.com',
      password: teacherPassword,
      firstName: 'John',
      lastName: 'Teacher',
      role: 'TEACHER',
      phoneNumber: '+1234567891',
      dateOfBirth: new Date('1985-05-15'),
      address: '456 Teacher Avenue',
    },
  });
  console.log('✓ Teacher user created:', teacher.email);

  // Create Student
  const studentPassword = await bcrypt.hash('student123', 10);
  const student = await prisma.user.upsert({
    where: { email: 'student@nexus.com' },
    update: {},
    create: {
      email: 'student@nexus.com',
      password: studentPassword,
      firstName: 'Jane',
      lastName: 'Student',
      role: 'STUDENT',
      phoneNumber: '+1234567892',
      dateOfBirth: new Date('2005-08-20'),
      address: '789 Student Road',
    },
  });
  console.log('✓ Student user created:', student.email);

  // Create Parent
  const parentPassword = await bcrypt.hash('parent123', 10);
  const parent = await prisma.user.upsert({
    where: { email: 'parent@nexus.com' },
    update: {},
    create: {
      email: 'parent@nexus.com',
      password: parentPassword,
      firstName: 'Mary',
      lastName: 'Parent',
      role: 'PARENT',
      phoneNumber: '+1234567893',
      dateOfBirth: new Date('1980-03-10'),
      address: '789 Student Road',
    },
  });
  console.log('✓ Parent user created:', parent.email);

  // Create Sample Course
  const course = await prisma.course.upsert({
    where: { id: 'sample-course-1' },
    update: {},
    create: {
      id: 'sample-course-1',
      name: 'Introduction to Computer Science',
      description: 'Learn the fundamentals of computer science and programming',
      teacherId: teacher.id,
      schedule: 'Mon, Wed, Fri - 10:00 AM',
      credits: 3,
    },
  });
  console.log('✓ Sample course created:', course.name);

  // Enroll student in course
  await prisma.enrollment.upsert({
    where: {
      studentId_courseId: {
        studentId: student.id,
        courseId: course.id,
      },
    },
    update: {},
    create: {
      studentId: student.id,
      courseId: course.id,
      status: 'ACTIVE',
    },
  });
  console.log('✓ Student enrolled in course');

  // Create Sample Assignment
  const assignment = await prisma.assignment.create({
    data: {
      title: 'Homework 1: Variables and Data Types',
      description: 'Complete exercises on variables and data types',
      courseId: course.id,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      maxScore: 100,
      type: 'HOMEWORK',
    },
  });
  console.log('✓ Sample assignment created:', assignment.title);

  // Initialize Gamification for student
  await prisma.gamification.upsert({
    where: { userId: student.id },
    update: {},
    create: {
      userId: student.id,
      points: 0,
      level: 1,
      badges: [],
      streak: 0,
    },
  });
  console.log('✓ Gamification initialized for student');

  // Initialize Wallet for student
  await prisma.wallet.upsert({
    where: { userId: student.id },
    update: {},
    create: {
      userId: student.id,
      balance: 0,
    },
  });
  console.log('✓ Wallet initialized for student');

  console.log('\n✅ Database seeding completed successfully!');
  console.log('\n📝 Test Credentials:');
  console.log('Admin: admin@nexus.com / admin123');
  console.log('Teacher: teacher@nexus.com / teacher123');
  console.log('Student: student@nexus.com / student123');
  console.log('Parent: parent@nexus.com / parent123');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
