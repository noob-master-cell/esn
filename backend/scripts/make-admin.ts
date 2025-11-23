import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const email = process.argv[2];

  if (!email) {
    console.error('Please provide an email address as an argument.');
    console.log('Usage: npx ts-node scripts/make-admin.ts <email>');
    process.exit(1);
  }

  console.log(`Looking for user with email: ${email}...`);

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    console.error(`User with email ${email} not found.`);
    process.exit(1);
  }

  console.log(`Found user: ${user.firstName} ${user.lastName} (${user.id})`);
  console.log(`Current role: ${user.role}`);

  if (user.role === 'ADMIN') {
    console.log('User is already an ADMIN.');
    return;
  }

  const updatedUser = await prisma.user.update({
    where: { email },
    data: { role: 'ADMIN' },
  });

  console.log(`Successfully updated user ${updatedUser.email} to ADMIN role.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
