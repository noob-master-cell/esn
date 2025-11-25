import {
  PrismaClient,
  UserRole,
  EventCategory,
  EventType,
  EventStatus,
  RegistrationStatus,
  RegistrationType,
  PaymentStatus,
  PaymentMethod,
  FeedbackType,
} from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database with comprehensive mock data...');

  // Clear existing data (optional - comment out if you want to keep existing data)
  console.log('🗑️  Clearing existing data...');
  await prisma.feedback.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.review.deleteMany();
  await prisma.registration.deleteMany();
  await prisma.event.deleteMany();
  await prisma.notificationSettings.deleteMany();
  await prisma.userPreferences.deleteMany();
  await prisma.user.deleteMany();
  console.log('✅ Existing data cleared');

  // 1. Create Admin User
  const adminUser = await prisma.user.create({
    data: {
      auth0Id: 'auth0|admin123',
      email: 'dheerajkarwasra28@gmail.com',
      firstName: 'Dheeraj',
      lastName: 'Karwasra',
      role: UserRole.ADMIN,
      emailVerified: true,
      esnCardNumber: 'ESN-ADMIN-001',
      esnCardVerified: true,
      esnCardExpiry: new Date('2026-12-31'),
      university: 'ESN International',
      chapter: 'ESN Kaiserslautern',
      nationality: 'India',
      bio: 'ESN Platform Administrator and Developer',
      avatar: 'https://i.pravatar.cc/150?img=1',
      phone: '+49 151 23456789',
      telegram: '@dheerajk',
      instagram: '@dheeraj.esn',
      emergencyContactName: 'Emergency Contact',
      emergencyContactPhone: '+49 151 98765432',
      preferences: {
        create: {
          emailEvents: true,
          emailReminders: true,
          emailNewsletter: true,
          emailPromotions: false,
          language: 'en',
          timezone: 'Europe/Berlin',
        },
      },
      notifications: {
        create: {
          pushEvents: true,
          pushReminders: true,
          pushUpdates: true,
          smsReminders: false,
          smsUpdates: false,
        },
      },
    },
  });

  // 2. Create Organizer Users
  const organizerUsers = [];
  const organizerData = [
    {
      email: 'sarah.martinez@esn.org',
      firstName: 'Sarah',
      lastName: 'Martinez',
      nationality: 'Spain',
      avatar: 'https://i.pravatar.cc/150?img=5',
    },
    {
      email: 'lucas.mueller@esn.org',
      firstName: 'Lucas',
      lastName: 'Müller',
      nationality: 'Germany',
      avatar: 'https://i.pravatar.cc/150?img=12',
    },
    {
      email: 'emma.rossi@esn.org',
      firstName: 'Emma',
      lastName: 'Rossi',
      nationality: 'Italy',
      avatar: 'https://i.pravatar.cc/150?img=9',
    },
  ];

  for (let i = 0; i < organizerData.length; i++) {
    const org = organizerData[i];
    const organizer = await prisma.user.create({
      data: {
        auth0Id: `auth0|organizer${i + 1}`,
        email: org.email,
        firstName: org.firstName,
        lastName: org.lastName,
        role: UserRole.ADMIN,
        emailVerified: true,
        esnCardNumber: `ESN-ORG-${String(i + 1).padStart(3, '0')}`,
        esnCardVerified: true,
        esnCardExpiry: faker.date.future({ years: 2 }),
        university: 'University of Kaiserslautern',
        chapter: 'ESN Kaiserslautern',
        nationality: org.nationality,
        bio: `ESN Event Organizer passionate about international student exchange`,
        avatar: org.avatar,
        phone: faker.phone.number(),
        telegram: `@${org.firstName.toLowerCase()}`,
        instagram: `@esn_${org.firstName.toLowerCase()}`,
      },
    });
    organizerUsers.push(organizer);
  }

  console.log('👤 Created admin and organizer users');

  // 3. Generate Regular Users
  console.log('👥 Generating 200 regular users...');
  const TOTAL_USERS = 200;
  const BATCH_SIZE = 50;

  const universities = [
    'RPTU Kaiserslautern-Landau',
    'Hochschule Kaiserslautern',
    'University of Mannheim',
    'Heidelberg University',
    'KIT Karlsruhe',
    'TU Munich',
    'University of Stuttgart',
    'University of Freiburg',
  ];

  const chapters = [
    'ESN Kaiserslautern',
    'ESN Mannheim',
    'ESN Heidelberg',
    'ESN Karlsruhe',
    'ESN Munich',
    'ESN Stuttgart',
  ];

  const nationalities = [
    'France', 'Italy', 'Spain', 'Poland', 'Turkey', 'India',
    'China', 'Mexico', 'Brazil', 'USA', 'UK', 'Portugal',
  ];

  const userPromises = [];
  const createdUserIds = [];

  for (let i = 0; i < TOTAL_USERS; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const hasEsnCard = faker.datatype.boolean(0.4); // 40% have ESN cards

    userPromises.push(
      prisma.user.create({
        data: {
          auth0Id: `auth0|user${String(i + 1).padStart(4, '0')}`,
          email: faker.internet.email({ firstName, lastName }),
          firstName,
          lastName,
          role: UserRole.USER,
          emailVerified: faker.datatype.boolean(0.85),
          esnCardNumber: hasEsnCard ? `ESN-${faker.string.numeric(4)}-${faker.string.numeric(4)}-${faker.string.numeric(4)}` : null,
          esnCardVerified: hasEsnCard ? faker.datatype.boolean(0.6) : false,
          esnCardExpiry: hasEsnCard ? faker.date.future({ years: 2 }) : null,
          university: faker.helpers.arrayElement(universities),
          chapter: faker.helpers.arrayElement(chapters),
          nationality: faker.helpers.arrayElement(nationalities),
          bio: faker.datatype.boolean(0.3) ? faker.person.bio() : null,
          avatar: `https://i.pravatar.cc/150?img=${faker.number.int({ min: 1, max: 70 })}`,
          phone: faker.datatype.boolean(0.5) ? faker.phone.number() : null,
          telegram: faker.datatype.boolean(0.4) ? `@${faker.internet.username()}` : null,
          instagram: faker.datatype.boolean(0.5) ? `@${faker.internet.username()}` : null,
          emergencyContactName: faker.datatype.boolean(0.3) ? faker.person.fullName() : null,
          emergencyContactPhone: faker.datatype.boolean(0.3) ? faker.phone.number() : null,
          createdAt: faker.date.past({ years: 2 }),
        },
      }).then(user => {
        createdUserIds.push(user.id);
        return user;
      })
    );

    if (userPromises.length >= BATCH_SIZE) {
      await Promise.all(userPromises);
      userPromises.length = 0;
      process.stdout.write('.');
    }
  }

  if (userPromises.length > 0) {
    await Promise.all(userPromises);
  }
  console.log(`\n✅ Generated ${TOTAL_USERS} regular users`);

  // 4. Generate Events
  console.log('🎪 Generating 50 diverse events...');
  const allOrganizerIds = [adminUser.id, ...organizerUsers.map(u => u.id)];
  const eventPromises = [];

  const eventTemplates = [
    { title: 'International Night: Cultural Exchange Evening', category: EventCategory.CULTURAL, type: EventType.FREE },
    { title: 'Pub Crawl Kaiserslautern', category: EventCategory.PARTY, type: EventType.PAID },
    { title: 'Hiking Trip to Palatinate Forest', category: EventCategory.TRAVEL, type: EventType.PAID },
    { title: 'Language Exchange Meetup', category: EventCategory.SOCIAL, type: EventType.FREE },
    { title: 'ESN Workshop: Study Abroad Tips', category: EventCategory.EDUCATIONAL, type: EventType.FREE },
    { title: 'Football Tournament', category: EventCategory.SPORTS, type: EventType.FREE },
    { title: 'Beach Volleyball Competition', category: EventCategory.SPORTS, type: EventType.FREE },
    { title: 'Weekend Trip to Paris', category: EventCategory.TRAVEL, type: EventType.PAID },
    { title: 'Game Night: Board Games & Pizza', category: EventCategory.SOCIAL, type: EventType.PAID },
    { title: 'Volunteer Day: City Cleanup', category: EventCategory.VOLUNTEER, type: EventType.FREE },
  ];

  for (let i = 0; i < 50; i++) {
    const template = faker.helpers.arrayElement(eventTemplates);
    const isPaid = template.type === EventType.PAID;
    const startDate = faker.date.between({
      from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Start from 1 week ago
      to: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000), // Next 6 months
    });

    const endDate = new Date(startDate);
    endDate.setHours(startDate.getHours() + faker.number.int({ min: 2, max: 48 }));

    const registrationDeadline = new Date(startDate);
    // Set deadline to 2 hours before start, to ensure most upcoming events are open
    registrationDeadline.setHours(startDate.getHours() - 2);

    const maxParticipants = faker.number.int({ min: 15, max: 150 });
    const price = isPaid ? faker.number.float({ min: 5, max: 80, fractionDigits: 2 }) : 0;
    const memberPrice = isPaid ? price * 0.7 : 0;

    // Determine status - mostly PUBLISHED, some DRAFT
    // We no longer assign REGISTRATION_OPEN/CLOSED etc directly as these are computed
    const status = faker.helpers.weightedArrayElement([
      { weight: 0.9, value: EventStatus.PUBLISHED },
      { weight: 0.1, value: EventStatus.DRAFT },
    ]);

    eventPromises.push(
      prisma.event.create({
        data: {
          title: `${template.title} ${i > 9 ? '#' + i : ''}`,
          description: faker.lorem.paragraphs(3),
          shortDescription: faker.lorem.sentence(),
          category: template.category,
          type: template.type,
          status,
          startDate,
          endDate,
          registrationDeadline,
          location: faker.helpers.arrayElement([
            'ESN Office Kaiserslautern',
            'City Center',
            'University Campus',
            'Train Station',
            'Central Park',
          ]),
          address: faker.location.streetAddress(),
          maxParticipants,
          price,
          memberPrice,
          images: [
            `https://picsum.photos/seed/event${i}/800/600`,
            `https://picsum.photos/seed/event${i}b/800/600`,
          ],
          tags: faker.helpers.arrayElements(
            ['fun', 'culture', 'sport', 'travel', 'food', 'party', 'networking', 'education'],
            faker.number.int({ min: 2, max: 5 })
          ),
          requirements: isPaid ? 'ESN card holders get discount' : null,
          additionalInfo: faker.datatype.boolean(0.5) ? faker.lorem.sentence() : null,
          isPublic: true,
          organizerId: faker.helpers.arrayElement(allOrganizerIds),
        },
      })
    );
  }

  const createdEvents = await Promise.all(eventPromises);
  console.log('✅ Generated 50 events');

  // 5. Generate Registrations
  console.log('🎫 Generating registrations...');
  const allUserIds = [adminUser.id, ...organizerUsers.map(u => u.id), ...createdUserIds];
  const registrationPromises = [];

  for (const event of createdEvents) {
    // Only create registrations for events that are not completed
    if (event.status === EventStatus.COMPLETED || event.status === EventStatus.CANCELLED) {
      continue;
    }

    const numRegistrations = faker.number.int({
      min: Math.floor(event.maxParticipants * 0.2),
      max: Math.min(event.maxParticipants, allUserIds.length)
    });

    const selectedUsers = faker.helpers.shuffle(allUserIds).slice(0, numRegistrations);

    for (const userId of selectedUsers) {
      registrationPromises.push(
        prisma.registration.create({
          data: {
            userId,
            eventId: event.id,
            status: faker.helpers.arrayElement([
              RegistrationStatus.CONFIRMED,
              RegistrationStatus.CONFIRMED,
              RegistrationStatus.CONFIRMED,
              RegistrationStatus.PENDING,
            ]),
            registrationType: faker.helpers.arrayElement([
              RegistrationType.REGULAR,
              RegistrationType.REGULAR,
              RegistrationType.REGULAR,
              RegistrationType.VIP,
            ]),
            paymentRequired: event.type === EventType.PAID,
            paymentStatus: event.type === EventType.PAID
              ? faker.helpers.arrayElement([PaymentStatus.COMPLETED, PaymentStatus.COMPLETED, PaymentStatus.PENDING])
              : PaymentStatus.COMPLETED,
            amountDue: event.type === EventType.PAID ? (event.price || 0) : 0,
            specialRequests: faker.datatype.boolean(0.2) ? faker.lorem.sentence() : null,
            dietary: faker.datatype.boolean(0.3) ? faker.helpers.arrayElement(['Vegetarian', 'Vegan', 'Gluten-free', 'None']) : null,
            registeredAt: faker.date.between({ from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), to: new Date() }),
            confirmedAt: faker.datatype.boolean(0.8) ? new Date() : null,
          },
        })
      );

      if (registrationPromises.length >= BATCH_SIZE) {
        await Promise.all(registrationPromises);
        registrationPromises.length = 0;
        process.stdout.write('.');
      }
    }
  }

  if (registrationPromises.length > 0) {
    await Promise.all(registrationPromises);
  }
  console.log('\n✅ Generated registrations');

  // 6. Generate Feedback
  console.log('💬 Generating feedback...');
  const feedbackPromises = [];
  const sampleUsers = faker.helpers.shuffle(allUserIds).slice(0, 30);

  for (const userId of sampleUsers) {
    feedbackPromises.push(
      prisma.feedback.create({
        data: {
          userId,
          type: faker.helpers.arrayElement([FeedbackType.FEEDBACK, FeedbackType.IMPROVEMENT, FeedbackType.BUG]),
          message: faker.lorem.paragraph(),
          createdAt: faker.date.recent({ days: 60 }),
        },
      })
    );
  }

  await Promise.all(feedbackPromises);
  console.log('✅ Generated feedback');

  // Summary
  console.log('\n🎉 Database seeded successfully!');
  console.log(`   👤 ${allUserIds.length} Total Users (1 Admin, ${organizerUsers.length} Organizers, ${TOTAL_USERS} Regular)`);
  console.log(`   🎪 ${createdEvents.length} Events`);
  console.log(`   🎫 ${registrationPromises.length + (await prisma.registration.count())} Registrations`);
  console.log(`   💬 ${feedbackPromises.length} Feedback entries`);
  console.log('\n✨ Ready to test the application!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
