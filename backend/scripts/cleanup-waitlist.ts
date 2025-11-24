import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🧹 Starting waitlist data cleanup...');

    try {
        // Update WAITLISTED registrations to CANCELLED
        const updateStatus = await prisma.$executeRawUnsafe(`
      UPDATE "registrations" 
      SET "status" = 'CANCELLED' 
      WHERE "status" = 'WAITLISTED'
    `);
        console.log(`✅ Updated ${updateStatus} registrations from WAITLISTED to CANCELLED`);

        // Update WAITLIST type to REGULAR
        const updateType = await prisma.$executeRawUnsafe(`
      UPDATE "registrations" 
      SET "registrationType" = 'REGULAR' 
      WHERE "registrationType" = 'WAITLIST'
    `);
        console.log(`✅ Updated ${updateType} registrations from WAITLIST type to REGULAR`);

        console.log('✨ Cleanup completed successfully');
    } catch (error) {
        console.error('❌ Error during cleanup:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
