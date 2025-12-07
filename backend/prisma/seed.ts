import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seeding...');

  // Create Admin User with Profile
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@nexus.com' },
    update: {},
    create: {
      email: 'admin@nexus.com',
      passwordHash: adminPassword,
      role: 'ADMIN',
      schoolId: 'school-001',
      profile: {
        create: {
          firstName: 'Admin',
          lastName: 'User',
          phone: '+1234567890',
        },
      },
    },
  });
  console.log('✓ Admin user created:', admin.email);

  // Create Teacher with Profile
  const teacherPassword = await bcrypt.hash('teacher123', 10);
  const teacher = await prisma.user.upsert({
    where: { email: 'teacher@nexus.com' },
    update: {},
    create: {
      email: 'teacher@nexus.com',
      passwordHash: teacherPassword,
      role: 'TEACHER',
      schoolId: 'school-001',
      profile: {
        create: {
          firstName: 'John',
          lastName: 'Teacher',
          phone: '+1234567891',
        },
      },
    },
  });
  console.log('✓ Teacher user created:', teacher.email);

  // Create Student with Profile
  const studentPassword = await bcrypt.hash('student123', 10);
  const student = await prisma.user.upsert({
    where: { email: 'student@nexus.com' },
    update: {},
    create: {
      email: 'student@nexus.com',
      passwordHash: studentPassword,
      role: 'STUDENT',
      schoolId: 'school-001',
      profile: {
        create: {
          firstName: 'Jane',
          lastName: 'Student',
          phone: '+1234567892',
        },
      },
    },
  });
  console.log('✓ Student user created:', student.email);

  // Create Parent with Profile
  const parentPassword = await bcrypt.hash('parent123', 10);
  const parent = await prisma.user.upsert({
    where: { email: 'parent@nexus.com' },
    update: {},
    create: {
      email: 'parent@nexus.com',
      passwordHash: parentPassword,
      role: 'PARENT',
      schoolId: 'school-001',
      profile: {
        create: {
          firstName: 'Mary',
          lastName: 'Parent',
          phone: '+1234567893',
        },
      },
    },
  });
  console.log('✓ Parent user created:', parent.email);

  // Create Sample Course
  const course = await prisma.course.upsert({
    where: { code: 'CS101' },
    update: {},
    create: {
      name: 'Introduction to Computer Science',
      description: 'Learn the fundamentals of computer science and programming',
      code: 'CS101',
      teacherId: teacher.id,
    },
  });
  console.log('✓ Sample course created:', course.name);

  // Enroll student in course
  await prisma.enrollment.upsert({
    where: {
      courseId_studentId: {
        courseId: course.id,
        studentId: student.id,
      },
    },
    update: {},
    create: {
      studentId: student.id,
      courseId: course.id,
    },
  });
  console.log('✓ Student enrolled in course');

  // Create Sample Assignment
  const assignment = await prisma.assignment.create({
    data: {
      title: 'Homework 1: Variables and Data Types',
      description: 'Complete exercises on variables and data types',
      courseId: course.id,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      maxPoints: 100,
      type: 'HOMEWORK',
    },
  });
  console.log('✓ Sample assignment created:', assignment.title);

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
