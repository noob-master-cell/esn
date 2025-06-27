import { PrismaClient, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database for Clerk integration...');

  // Create admin user
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@esn.org' },
    update: {},
    create: {
      clerkId: 'clerk_admin_id_placeholder',
      email: 'admin@esn.org',
      firstName: 'Admin',
      lastName: 'User',
      role: UserRole.ADMIN,
      emailVerified: true,
      esnCardNumber: 'ESN001',
      esnCardVerified: true,
      university: 'ESN International',
      chapter: 'ESN International',
      nationality: 'International',
    },
  });

  // Create a sample event (REMOVED the 'slug' field)
  const sampleEvent = await prisma.event.create({
    data: {
      title: 'Welcome Party 2025',
      description:
        'Join us for an amazing welcome party to kick off the new semester!',
      shortDescription: 'Welcome party for new exchange students',
      startDate: new Date('2025-07-15T19:00:00Z'),
      endDate: new Date('2025-07-15T23:00:00Z'),
      location: 'ESN Local Club',
      address: '123 University Street, City',
      maxParticipants: 100,
      price: 15.0,
      memberPrice: 10.0,
      organizerId: adminUser.id,
      category: 'PARTY',
      type: 'PAID',
      status: 'PUBLISHED',
      registrationDeadline: new Date('2025-07-14T23:59:59Z'),
      tags: ['party', 'welcome', 'networking'],
    },
  });

  console.log('✅ Database seeded successfully!');
  console.log('📧 Admin user email:', adminUser.email);
  console.log('🎉 Sample event:', sampleEvent.title);
  console.log(
    '💡 Note: Real users will be created automatically when they log in via Clerk',
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });