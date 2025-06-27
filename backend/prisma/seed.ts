import { PrismaClient, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Since we're using Clerk, we'll create users that can be linked to Clerk accounts
  // These are example users that would be created when Clerk users first authenticate

  console.log('🌱 Seeding database for Clerk integration...');

  // Example: Create admin user (this would normally be created when a Clerk user first logs in)
  // You can manually set the clerkId to your actual Clerk user ID if you want to test
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@esn.org' },
    update: {},
    create: {
      clerkId: 'clerk_admin_id_placeholder', // Replace with actual Clerk user ID if needed
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

  // Create a sample event (this doesn't depend on authentication)
  const sampleEvent = await prisma.event.create({
    data: {
      title: 'Welcome Party 2025',
      description:
        'Join us for an amazing welcome party to kick off the new semester!',
      shortDescription: 'Welcome party for new exchange students',
      slug: 'welcome-party-2025',
      startDate: new Date('2025-07-15T19:00:00Z'),
      endDate: new Date('2025-07-15T23:00:00Z'),
      location: 'ESN Local Club',
      address: '123 University Street, City',
      capacity: 100,
      price: 15.0,
      esnCardPrice: 10.0,
      currency: 'EUR',
      organizerId: adminUser.id,
      chapter: 'ESN Local',
      category: 'PARTY',
      status: 'PUBLISHED',
      registrationClose: new Date('2025-07-14T23:59:59Z'),
      tags: ['party', 'welcome', 'networking'],
    },
  });

  console.log('✅ Database seeded successfully!');
  console.log('📧 Admin user email:', adminUser.email);
  console.log('🎉 Sample event:', sampleEvent.title);
  console.log('');
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
