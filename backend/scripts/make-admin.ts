// backend/scripts/make-admin.ts
// Create this file in backend/scripts/ directory

import { PrismaClient, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

async function makeAdmin(email: string) {
  console.log(`🔧 Making ${email} an admin...`);

  try {
    // First, try to find the user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.error(`❌ User with email ${email} not found!`);
      console.log('💡 Available users:');

      const allUsers = await prisma.user.findMany({
        select: { email: true, role: true, firstName: true, lastName: true },
      });

      allUsers.forEach((u) => {
        console.log(
          `   - ${u.email} (${u.firstName} ${u.lastName}) - ${u.role}`,
        );
      });

      return;
    }

    // Update user to admin
    const updatedUser = await prisma.user.update({
      where: { email },
      data: {
        role: UserRole.ADMIN,
        isActive: true, // Ensure they're active
      },
    });

    console.log(`✅ SUCCESS! ${updatedUser.email} is now an ADMIN.`);
    console.log(`👤 User: ${updatedUser.firstName} ${updatedUser.lastName}`);
    console.log(`🔑 Role: ${updatedUser.role}`);
    console.log(`📧 Email: ${updatedUser.email}`);
  } catch (error) {
    console.error('❌ Error making user admin:', error);
  }
}

// Get email from command line argument
const email = process.argv[2];

if (!email) {
  console.error('❌ Please provide an email address');
  console.log('Usage: npm run make-admin your-email@example.com');
  process.exit(1);
}

makeAdmin(email)
  .catch((e) => {
    console.error('❌ Script failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log('👋 Disconnected from database');
  });
