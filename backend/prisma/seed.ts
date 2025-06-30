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

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database with sample data...');

  // Create admin user
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
      chapter: 'ESN International',
      nationality: 'International',
    },
  });

  // Create organizer user
  const organizerUser = await prisma.user.upsert({
    where: { email: 'organizer@esn.org' },
    update: {},
    create: {
      clerkId: 'clerk_organizer_id_placeholder',
      email: 'organizer@esn.org',
      firstName: 'Event',
      lastName: 'Organizer',
      role: UserRole.ORGANIZER,
      emailVerified: true,
      esnCardNumber: 'ESN002',
      esnCardVerified: true,
      university: 'Local University',
      chapter: 'ESN Local',
      nationality: 'Local',
    },
  });

  // Create sample student user
  const studentUser = await prisma.user.upsert({
    where: { email: 'student@example.com' },
    update: {},
    create: {
      clerkId: 'clerk_student_id_placeholder',
      email: 'student@example.com',
      firstName: 'John',
      lastName: 'Student',
      role: UserRole.USER,
      emailVerified: true,
      esnCardNumber: 'ESN003',
      esnCardVerified: true,
      university: 'Local University',
      chapter: 'ESN Local',
      nationality: 'Spain',
    },
  });

  console.log('🎪 Creating sample events...');

  const welcomeParty = await prisma.event.create({
    data: {
      title: 'Welcome Party 2025',
      description: 'Join us for an amazing welcome party...',
      shortDescription: 'Welcome party for new exchange students',
      startDate: new Date('2025-07-15T19:00:00Z'),
      endDate: new Date('2025-07-15T23:00:00Z'),
      registrationDeadline: new Date('2025-07-14T23:59:59Z'),
      location: 'ESN Local Club',
      address: '123 University Street, City',
      maxParticipants: 5,
      price: 15.0,
      memberPrice: 10.0,
      organizer: { connect: { id: adminUser.id } },
      category: EventCategory.PARTY,
      type: EventType.PAID,
      status: EventStatus.PUBLISHED,
      tags: ['party', 'welcome', 'networking'],
    },
  });

  const cityTour = await prisma.event.create({
    data: {
      title: 'City Walking Tour',
      description: 'Discover the hidden gems...',
      shortDescription: 'Guided tour of city highlights',
      startDate: new Date('2025-07-20T10:00:00Z'),
      endDate: new Date('2025-07-20T15:00:00Z'),
      registrationDeadline: new Date('2025-07-19T23:59:59Z'),
      location: 'City Center',
      address: 'Main Square, City Center',
      maxParticipants: 20,
      price: 5.0,
      memberPrice: 0.0,
      organizer: { connect: { id: organizerUser.id } },
      category: EventCategory.CULTURAL,
      type: EventType.PAID,
      status: EventStatus.PUBLISHED,
      tags: ['tour', 'culture', 'sightseeing'],
    },
  });

  const foodNight = await prisma.event.create({
    data: {
      title: 'International Food Night',
      description: 'Bring a dish from your home country...',
      shortDescription: 'Potluck dinner with international dishes',
      startDate: new Date('2025-07-25T18:00:00Z'),
      endDate: new Date('2025-07-25T22:00:00Z'),
      registrationDeadline: new Date('2025-07-24T23:59:59Z'),
      location: 'ESN Kitchen',
      address: '456 Student Street, University District',
      maxParticipants: 30,
      price: 0.0,
      memberPrice: 0.0,
      organizer: { connect: { id: organizerUser.id } },
      category: EventCategory.SOCIAL,
      type: EventType.FREE,
      status: EventStatus.PUBLISHED,
      tags: ['food', 'international', 'culture'],
    },
  });

  const pragueTrip = await prisma.event.create({
    data: {
      title: 'Weekend Trip to Prague',
      description: 'Explore the magical city of Prague...',
      shortDescription: '3-day trip to Prague',
      startDate: new Date('2025-08-01T08:00:00Z'),
      endDate: new Date('2025-08-03T20:00:00Z'),
      registrationDeadline: new Date('2025-07-25T23:59:59Z'),
      location: 'Prague, Czech Republic',
      address: 'Meeting point: University Bus Station',
      maxParticipants: 25,
      price: 150.0,
      memberPrice: 130.0,
      organizer: { connect: { id: adminUser.id } },
      category: EventCategory.TRAVEL,
      type: EventType.PAID,
      status: EventStatus.PUBLISHED,
      tags: ['travel', 'weekend', 'prague'],
    },
  });

  const languageCafe = await prisma.event.create({
    data: {
      title: 'Language Exchange Café',
      description: 'Practice languages in a relaxed café setting.',
      shortDescription: 'Weekly language practice session',
      startDate: new Date('2025-07-18T17:00:00Z'),
      endDate: new Date('2025-07-18T19:00:00Z'),
      registrationDeadline: new Date('2025-07-18T12:00:00Z'),
      location: 'Café Lingua',
      address: '789 Language Street, City',
      maxParticipants: 15,
      price: 3.0,
      memberPrice: 2.0,
      organizer: { connect: { id: organizerUser.id } },
      category: EventCategory.EDUCATIONAL,
      type: EventType.PAID,
      status: EventStatus.PUBLISHED,
      tags: ['language', 'education', 'weekly'],
    },
  });

  console.log('🎫 Creating sample registrations...');

  await prisma.registration.create({
    data: {
      user: { connect: { id: studentUser.id } },
      event: { connect: { id: welcomeParty.id } },
      status: RegistrationStatus.CONFIRMED,
      registrationType: RegistrationType.REGULAR,
      paymentRequired: true,
      paymentStatus: PaymentStatus.COMPLETED,
      amountDue: 10.0,
      currency: 'EUR',
      specialRequests: 'Vegetarian food please',
      dietary: 'Vegetarian',
      registeredAt: new Date(),
      confirmedAt: new Date(),
    },
  });

  await prisma.registration.create({
    data: {
      user: { connect: { id: studentUser.id } },
      event: { connect: { id: cityTour.id } },
      status: RegistrationStatus.CONFIRMED,
      registrationType: RegistrationType.REGULAR,
      paymentRequired: false,
      paymentStatus: PaymentStatus.COMPLETED,
      amountDue: 0.0,
      currency: 'EUR',
      registeredAt: new Date(),
      confirmedAt: new Date(),
    },
  });

  console.log('✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
