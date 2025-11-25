import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkEvents() {
    const events = await prisma.event.findMany({
        select: {
            id: true,
            title: true,
            startDate: true,
            status: true,
        },
        orderBy: { startDate: 'asc' },
    });

    console.log(`\n📊 Total Events: ${events.length}\n`);

    // Group by month
    const monthGroups = new Map<string, number>();

    events.forEach(event => {
        const month = event.startDate.toISOString().substring(0, 7); // YYYY-MM
        monthGroups.set(month, (monthGroups.get(month) || 0) + 1);
    });

    console.log('📅 Events by Month:');
    Array.from(monthGroups.entries())
        .sort()
        .forEach(([month, count]) => {
            console.log(`   ${month}: ${count} events`);
        });

    console.log('\n🔍 First 10 Events:');
    events.slice(0, 10).forEach(event => {
        console.log(`   • ${event.startDate.toISOString().split('T')[0]} - ${event.title} (${event.status})`);
    });

    // Check current month
    const now = new Date();
    const currentMonth = now.toISOString().substring(0, 7);
    const currentMonthEvents = events.filter(e =>
        e.startDate.toISOString().substring(0, 7) === currentMonth
    );

    console.log(`\n📌 Events in Current Month (${currentMonth}): ${currentMonthEvents.length}`);
    currentMonthEvents.forEach(event => {
        console.log(`   • ${event.startDate.toISOString().split('T')[0]} - ${event.title}`);
    });
}

checkEvents()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
