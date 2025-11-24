import {
  PrismaClient,
  UserRole,
  EventCategory,
  EventType,
  EventStatus,
  RegistrationStatus,
  RegistrationType,
  PaymentStatus,
} from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database with sample data...');

  // 1. Create Static Users (Admin & Organizer)
  const adminUser = await prisma.user.upsert({
    where: { email: 'dheerajkarwasra28@gmail.com' },
    update: {},
    create: {
      clerkId: 'user_2z4OnZdiUxYBhJ4nSxKpT8Qs90n',
      email: 'dheerajkarwasra28@gmail.com',
      firstName: 'Dheeraj',
      lastName: 'Karwasra',
      role: UserRole.ADMIN,
      emailVerified: true,
      esnCardNumber: 'ESN001',
      esnCardVerified: true,
      university: 'ESN International',
      chapter: 'ESN Kaiserslautern',
      nationality: 'India',
    },
  });

  const organizerUser = await prisma.user.upsert({
    where: { email: 'organizer@esn.org' },
    update: {},
    create: {
      clerkId: 'clerk_organizer_id_placeholder',
      email: 'organizer@esn.org',
      firstName: 'Sarah',
      lastName: 'Martinez',
      role: UserRole.ADMIN,
      emailVerified: true,
      esnCardNumber: 'ESN002',
      esnCardVerified: true,
      university: 'University of Kaiserslautern',
      chapter: 'ESN Kaiserslautern',
      nationality: 'Spain',
    },
  });

  console.log('👤 Created static users');

  // 2. Generate 1000 Random Users
  console.log('👥 Generating 1000 random users...');
  const userPromises = [];
  const universities = [
    'University of Kaiserslautern',
    'Hochschule Kaiserslautern',
    'University of Mannheim',
    'Heidelberg University',
    'KIT Karlsruhe',
  ];
  const chapters = [
    'ESN Kaiserslautern',
    'ESN Mannheim',
    'ESN Heidelberg',
    'ESN Karlsruhe',
  ];

  // Create users in batches to avoid overwhelming the connection
  const BATCH_SIZE = 50;
  const TOTAL_USERS = 1000;

  for (let i = 0; i < TOTAL_USERS; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();

    userPromises.push(
      prisma.user.create({
        data: {
          email: faker.internet.email({ firstName, lastName }),
          firstName,
          lastName,
          role: UserRole.USER,
          emailVerified: faker.datatype.boolean(0.8), // 80% verified
          esnCardNumber: faker.datatype.boolean(0.3) ? `ESN${faker.string.numeric(6)}` : null,
          esnCardVerified: faker.datatype.boolean(0.2),
          university: faker.helpers.arrayElement(universities),
          chapter: faker.helpers.arrayElement(chapters),
          nationality: faker.location.country(),
          bio: faker.person.bio(),
          avatar: faker.image.avatar(),
          phone: faker.phone.number(),
          instagram: faker.internet.username(),
          createdAt: faker.date.past({ years: 1 }),
        },
      })
    );

    if (userPromises.length >= BATCH_SIZE) {
      await Promise.all(userPromises);
      userPromises.length = 0;
      process.stdout.write(`.`);
    }
  }
  // Process remaining users
  if (userPromises.length > 0) {
    await Promise.all(userPromises);
  }
  console.log('\n✅ Generated 1000 users');

  // 3. Generate 100 Random Events
  console.log('🎪 Generating 100 random events...');
  const eventPromises = [];
  const eventCategories = Object.values(EventCategory);
  const eventTypes = Object.values(EventType);

  // Get all user IDs to assign as organizers randomly (mostly admin/organizer but some others)
  const allUsers = await prisma.user.findMany({ select: { id: true } });
  const organizerIds = [adminUser.id, organizerUser.id];

  for (let i = 0; i < 100; i++) {
    const startDate = faker.date.future({ years: 1 });
    const endDate = new Date(startDate);
    endDate.setHours(startDate.getHours() + faker.number.int({ min: 2, max: 8 }));

    const registrationDeadline = new Date(startDate);
    registrationDeadline.setDate(startDate.getDate() - faker.number.int({ min: 1, max: 14 }));

    const isPaid = faker.datatype.boolean();
    const price = isPaid ? parseFloat(faker.commerce.price({ min: 5, max: 50 })) : 0;
    const memberPrice = isPaid ? price * 0.8 : 0;

    eventPromises.push(
      prisma.event.create({
        data: {
          title: faker.company.catchPhrase(),
          description: faker.lorem.paragraphs(2),
          shortDescription: faker.lorem.sentence(),
          startDate,
          endDate,
          registrationDeadline,
          location: faker.location.city(),
          address: faker.location.streetAddress(),
          maxParticipants: faker.number.int({ min: 10, max: 200 }),
          price,
          memberPrice,
          organizerId: faker.helpers.arrayElement(organizerIds), // Mostly assign to main organizers
          category: faker.helpers.arrayElement(eventCategories),
          type: isPaid ? EventType.PAID : EventType.FREE,
          status: faker.helpers.arrayElement([EventStatus.PUBLISHED, EventStatus.REGISTRATION_OPEN, EventStatus.COMPLETED]),
          tags: [faker.word.sample(), faker.word.sample(), faker.word.sample()],
          imageUrl: faker.image.urlLoremFlickr({ category: 'party,event' }),
          isPublic: true,
        },
      })
    );
  }

  const createdEvents = await Promise.all(eventPromises); // We need the events for registrations
  console.log('✅ Generated 100 events');

  // 4. Generate Random Registrations
  console.log('🎫 Generating random registrations...');
  const registrationPromises = [];

  for (const event of createdEvents) {
    // Register random number of users to each event (0 to maxParticipants)
    const numRegistrations = faker.number.int({ min: 0, max: Math.min(event.maxParticipants, 50) });
    const shuffledUsers = faker.helpers.shuffle(allUsers).slice(0, numRegistrations);

    for (const user of shuffledUsers) {
      registrationPromises.push(
        prisma.registration.create({
          data: {
            userId: user.id,
            eventId: event.id,
            status: faker.helpers.arrayElement([RegistrationStatus.CONFIRMED, RegistrationStatus.PENDING]),
            registrationType: RegistrationType.REGULAR,
            paymentRequired: event.type === EventType.PAID,
            paymentStatus: event.type === EventType.PAID
              ? faker.helpers.arrayElement([PaymentStatus.COMPLETED, PaymentStatus.PENDING])
              : PaymentStatus.COMPLETED,
            amountDue: event.type === EventType.PAID ? (event.price || 0) : 0,
            registeredAt: faker.date.recent({ days: 30 }),
          },
        })
      );
    }

    if (registrationPromises.length >= BATCH_SIZE) {
      await Promise.all(registrationPromises);
      registrationPromises.length = 0;
      process.stdout.write(`.`);
    }
  }

  if (registrationPromises.length > 0) {
    await Promise.all(registrationPromises);
  }

  console.log('\n✅ Database seeded successfully!');
  console.log(`   - ${TOTAL_USERS + 2} Users`);
  console.log(`   - ${createdEvents.length} Events`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
