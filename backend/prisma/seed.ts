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
      chapter: 'ESN Kaiserslautern',
      nationality: 'India',
    },
  });

  // Create organizer user
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

  // Create sample student users
  const studentUser1 = await prisma.user.upsert({
    where: { email: 'student@example.com' },
    update: {},
    create: {
      clerkId: 'clerk_student_id_placeholder',
      email: 'student@example.com',
      firstName: 'John',
      lastName: 'Smith',
      role: UserRole.USER,
      emailVerified: true,
      esnCardNumber: 'ESN003',
      esnCardVerified: true,
      university: 'University of Kaiserslautern',
      chapter: 'ESN Kaiserslautern',
      nationality: 'United States',
    },
  });

  const studentUser2 = await prisma.user.upsert({
    where: { email: 'maria.garcia@example.com' },
    update: {},
    create: {
      clerkId: 'clerk_student2_id_placeholder',
      email: 'maria.garcia@example.com',
      firstName: 'Maria',
      lastName: 'Garcia',
      role: UserRole.USER,
      emailVerified: true,
      esnCardNumber: 'ESN004',
      esnCardVerified: true,
      university: 'University of Kaiserslautern',
      chapter: 'ESN Kaiserslautern',
      nationality: 'Mexico',
    },
  });

  console.log('🎪 Creating diverse sample events...');

  // Helper function to create dates - spreading events across Nov, Dec, Jan
  const createDate = (month: number, day: number, hours: number = 19) => {
    const date = new Date();
    date.setMonth(month - 1); // 11 = November, 12 = December, 1 = January
    date.setDate(day);
    date.setHours(hours, 0, 0, 0);
    return date;
  };

  // Helper function to create dates relative to now (fallback for existing events)
  const daysFromNow = (days: number, hours: number = 19) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    date.setHours(hours, 0, 0, 0);
    return date;
  };


  // NOVEMBER EVENTS (Current month - immediate upcoming)
  await prisma.event.create({
    data: {
      title: 'Welcome Party 2025',
      description: 'Join us for an amazing welcome party to kick off the new semester! Meet fellow international students, enjoy music, drinks, and get to know your ESN team. This is THE event to start your exchange adventure!',
      shortDescription: 'Welcome party for new exchange students',
      startDate: createDate(11, 25, 20),
      endDate: createDate(11, 25, 23),
      registrationDeadline: createDate(11, 24, 23),
      location: 'Stadtpark Kaiserslautern',
      address: 'Lauterstraße 8, 67657 Kaiserslautern',
      maxParticipants: 150,
      price: 8.0,
      memberPrice: 5.0,
      organizer: { connect: { id: adminUser.id } },
      category: EventCategory.PARTY,
      type: EventType.PAID,
      status: EventStatus.REGISTRATION_OPEN,
      tags: ['party', 'welcome', 'networking', 'music'],
      imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30',
    },
  });

  await prisma.event.create({
    data: {
      title: 'City Walking Tour',
      description: 'Discover the hidden gems of Kaiserslautern! Our guided tour will take you through the historic old town, beautiful parks, and iconic landmarks. Learn about the city\'s rich history and culture while making new friends.',
      shortDescription: 'Guided tour of Kaiserslautern highlights',
      startDate: daysFromNow(5, 10),
      endDate: daysFromNow(5, 13),
      registrationDeadline: daysFromNow(4, 23),
      location: 'Kaiserslautern City Center',
      address: 'Meeting point: Rathaus Kaiserslautern',
      maxParticipants: 30,
      price: 3.0,
      memberPrice: 0.0,
      organizer: { connect: { id: organizerUser.id } },
      category: EventCategory.CULTURAL,
      type: EventType.PAID,
      status: EventStatus.REGISTRATION_OPEN,
      tags: ['tour', 'culture', 'sightseeing', 'history'],
      imageUrl: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b',
    },
  });

  await prisma.event.create({
    data: {
      title: 'International Food Night',
      description: 'Bring a dish from your home country and share it with fellow students! Experience flavors from around the world in this unique cultural exchange. Vegetarian and vegan options welcome!',
      shortDescription: 'Potluck dinner with international dishes',
      startDate: daysFromNow(7, 18),
      endDate: daysFromNow(7, 22),
      registrationDeadline: daysFromNow(6, 23),
      location: 'ESN Community Kitchen',
      address: 'Building 42, University Campus',
      maxParticipants: 40,
      price: 0.0,
      memberPrice: 0.0,
      organizer: { connect: { id: organizerUser.id } },
      category: EventCategory.SOCIAL,
      type: EventType.FREE,
      status: EventStatus.REGISTRATION_OPEN,
      tags: ['food', 'international', 'culture', 'cooking'],
      imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1',
    },
  });

  await prisma.event.create({
    data: {
      title: 'Pub Crawl Kaiserslautern',
      description: 'Experience the best nightlife Kaiserslautern has to offer! Visit 5 different bars and clubs, enjoy special drink deals, and party with your new international friends. Free shots at each location!',
      shortDescription: 'Tour of the best bars and clubs in KL',
      startDate: daysFromNow(6, 21),
      endDate: daysFromNow(7, 2),
      registrationDeadline: daysFromNow(5, 23),
      location: 'Various Locations',
      address: 'Meeting point: Stiftsplatz',
      maxParticipants: 60,
      price: 12.0,
      memberPrice: 10.0,
      organizer: { connect: { id: adminUser.id } },
      category: EventCategory.PARTY,
      type: EventType.PAID,
      status: EventStatus.REGISTRATION_OPEN,
      tags: ['party', 'nightlife', 'bars', 'drinks'],
      imageUrl: 'https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2',
    },
  });

  await prisma.event.create({
    data: {
      title: 'Language Exchange Café',
      description: 'Practice German and other languages in a relaxed café setting! Meet native speakers, improve your language skills, and make international friends over coffee and pastries.',
      shortDescription: 'Weekly language practice session',
      startDate: daysFromNow(4, 17),
      endDate: daysFromNow(4, 19),
      registrationDeadline: daysFromNow(4, 12),
      location: 'Café Ideal',
      address: 'Marktstraße 32, 67655 Kaiserslautern',
      maxParticipants: 25,
      price: 3.0,
      memberPrice: 2.0,
      organizer: { connect: { id: organizerUser.id } },
      category: EventCategory.EDUCATIONAL,
      type: EventType.PAID,
      status: EventStatus.REGISTRATION_OPEN,
      tags: ['language', 'education', 'weekly', 'german'],
      imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7',
    },
  });

  await prisma.event.create({
    data: {
      title: 'Football Match: ESN vs Students',
      description: 'Show your skills on the field! Join us for a friendly football match between ESN members and local students. All skill levels welcome. Refreshments provided after the game!',
      shortDescription: 'Friendly football tournament',
      startDate: daysFromNow(8, 15),
      endDate: daysFromNow(8, 18),
      registrationDeadline: daysFromNow(7, 23),
      location: 'University Sports Field',
      address: 'Sportanlage Uni Kaiserslautern',
      maxParticipants: 30,
      price: 0.0,
      memberPrice: 0.0,
      organizer: { connect: { id: adminUser.id } },
      category: EventCategory.SPORTS,
      type: EventType.FREE,
      status: EventStatus.REGISTRATION_OPEN,
      tags: ['sports', 'football', 'outdoor', 'team'],
      imageUrl: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55',
    },
  });

  // UPCOMING TRIPS - Next 2-4 weeks
  await prisma.event.create({
    data: {
      title: 'Weekend Trip to Prague',
      description: 'Explore the magical city of Prague! Visit the historic castle, walk across Charles Bridge, enjoy the vibrant nightlife, and taste traditional Czech beer. Includes: bus transport, 2 nights hostel, city tour.',
      shortDescription: '3-day trip to the Golden City',
      startDate: daysFromNow(15, 8),
      endDate: daysFromNow(17, 20),
      registrationDeadline: daysFromNow(10, 23),
      location: 'Prague, Czech Republic',
      address: 'Departure: University Bus Station',
      maxParticipants: 45,
      price: 120.0,
      memberPrice: 100.0,
      organizer: { connect: { id: adminUser.id } },
      category: EventCategory.TRAVEL,
      type: EventType.PAID,
      status: EventStatus.REGISTRATION_OPEN,
      tags: ['travel', 'weekend', 'prague', 'international'],
      imageUrl: 'https://images.unsplash.com/photo-1541849546-216549ae216d',
    },
  });

  await prisma.event.create({
    data: {
      title: 'Amsterdam Adventure',
      description: 'Experience the capital of Netherlands! Visit world-famous museums, cruise along the canals, explore the Red Light District, and enjoy the vibrant nightlife. Includes: bus, 2 nights accommodation.',
      shortDescription: 'Weekend trip to Amsterdam',
      startDate: daysFromNow(22, 7),
      endDate: daysFromNow(24, 21),
      registrationDeadline: daysFromNow(15, 23),
      location: 'Amsterdam, Netherlands',
      address: 'Departure: Central Station Kaiserslautern',
      maxParticipants: 40,
      price: 140.0,
      memberPrice: 120.0,
      organizer: { connect: { id: organizerUser.id } },
      category: EventCategory.TRAVEL,
      type: EventType.PAID,
      status: EventStatus.REGISTRATION_OPEN,
      tags: ['travel', 'amsterdam', 'museums', 'culture'],
      imageUrl: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017',
    },
  });

  await prisma.event.create({
    data: {
      title: 'Heidelberg Day Trip',
      description: 'Visit Germany\'s most romantic city! Explore the famous castle ruins, walk along the Philosopher\'s Way, and stroll through the charming old town. Perfect day trip from Kaiserslautern!',
      shortDescription: 'Day trip to Heidelberg Castle',
      startDate: daysFromNow(12, 9),
      endDate: daysFromNow(12, 19),
      registrationDeadline: daysFromNow(10, 23),
      location: 'Heidelberg, Germany',
      address: 'Meeting point: Train Station Kaiserslautern',
      maxParticipants: 35,
      price: 25.0,
      memberPrice: 20.0,
      organizer: { connect: { id: organizerUser.id } },
      category: EventCategory.TRAVEL,
      type: EventType.PAID,
      status: EventStatus.REGISTRATION_OPEN,
      tags: ['day-trip', 'heidelberg', 'castle', 'culture'],
      imageUrl: 'https://images.unsplash.com/photo-1580834917371-6e80064a44fa',
    },
  });

  // WORKSHOPS & EDUCATIONAL - Next 1-3 weeks
  await prisma.event.create({
    data: {
      title: 'German Survival Skills Workshop',
      description: 'Learn essential German phrases and cultural tips for everyday life in Germany! Topics include: ordering food, using public transport, shopping, and making small talk. No prior German knowledge required!',
      shortDescription: 'Essential German for daily life',
      startDate: daysFromNow(9, 18),
      endDate: daysFromNow(9, 20),
      registrationDeadline: daysFromNow(8, 23),
      location: 'ESN Office',
      address: 'Building 46, Room 201, University Campus',
      maxParticipants: 20,
      price: 0.0,
      memberPrice: 0.0,
      organizer: { connect: { id: organizerUser.id } },
      category: EventCategory.WORKSHOP,
      type: EventType.FREE,
      status: EventStatus.REGISTRATION_OPEN,
      tags: ['workshop', 'german', 'language', 'beginners'],
      imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173',
    },
  });

  await prisma.event.create({
    data: {
      title: 'Photography Walk & Workshop',
      description: 'Improve your photography skills while exploring beautiful locations around Kaiserslautern! Learn composition, lighting, and editing techniques from a professional photographer. Bring your camera or smartphone!',
      shortDescription: 'Learn photography while exploring the city',
      startDate: daysFromNow(11, 14),
      endDate: daysFromNow(11, 17),
      registrationDeadline: daysFromNow(10, 23),
      location: 'Japanese Garden & City Center',
      address: 'Meeting point: Japanese Garden entrance',
      maxParticipants: 15,
      price: 5.0,
      memberPrice: 3.0,
      organizer: { connect: { id: adminUser.id } },
      category: EventCategory.WORKSHOP,
      type: EventType.PAID,
      status: EventStatus.REGISTRATION_OPEN,
      tags: ['workshop', 'photography', 'outdoor', 'creative'],
      imageUrl: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d',
    },
  });

  await prisma.event.create({
    data: {
      title: 'CV & Job Application Workshop',
      description: 'Prepare for your career in Germany! Learn how to write a German CV, prepare for job interviews, and understand the German job market. Perfect for students looking for internships or working student positions.',
      shortDescription: 'Career preparation for the German market',
      startDate: daysFromNow(13, 16),
      endDate: daysFromNow(13, 18),
      registrationDeadline: daysFromNow(12, 23),
      location: 'Career Center',
      address: 'Building 47, Career Services, University',
      maxParticipants: 25,
      price: 0.0,
      memberPrice: 0.0,
      organizer: { connect: { id: organizerUser.id } },
      category: EventCategory.EDUCATIONAL,
      type: EventType.FREE,
      status: EventStatus.REGISTRATION_OPEN,
      tags: ['career', 'workshop', 'jobs', 'professional'],
      imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40',
    },
  });

  // CULTURAL & VOLUNTEER - Next 2-4 weeks
  await prisma.event.create({
    data: {
      title: 'Stammtisch: German Beer Garden Evening',
      description: 'Experience authentic German culture at a traditional beer garden! Enjoy German food, beer, and good conversations. ESN members will help you order in German and explain local customs. Prost!',
      shortDescription: 'Traditional German evening at a beer garden',
      startDate: daysFromNow(10, 18),
      endDate: daysFromNow(10, 22),
      registrationDeadline: daysFromNow(9, 23),
      location: 'Gartenschau Biergarten',
      address: 'Gartenschau Kaiserslautern',
      maxParticipants: 50,
      price: 0.0,
      memberPrice: 0.0,
      organizer: { connect: { id: adminUser.id } },
      category: EventCategory.CULTURAL,
      type: EventType.FREE,
      status: EventStatus.REGISTRATION_OPEN,
      tags: ['cultural', 'beer', 'german', 'tradition'],
      imageUrl: 'https://images.unsplash.com/photo-1558988330-e6295e85f0c7',
    },
  });

  await prisma.event.create({
    data: {
      title: 'Museum Night: Pfalzgalerie',
      description: 'Special guided tour of Pfalzgalerie Museum! Explore modern and contemporary art with commentary in English. Includes museum entry and refreshments. Great opportunity for art lovers!',
      shortDescription: 'Evening tour of contemporary art museum',
      startDate: daysFromNow(16, 19),
      endDate: daysFromNow(16, 21),
      registrationDeadline: daysFromNow(14, 23),
      location: 'Museum Pfalzgalerie',
      address: 'Museumsplatz 1, 67657 Kaiserslautern',
      maxParticipants: 20,
      price: 5.0,
      memberPrice: 3.0,
      organizer: { connect: { id: organizerUser.id } },
      category: EventCategory.CULTURAL,
      type: EventType.PAID,
      status: EventStatus.REGISTRATION_OPEN,
      tags: ['museum', 'art', 'culture', 'guided-tour'],
      imageUrl: 'https://images.unsplash.com/photo-1564399579883-451a5d44ec08',
    },
  });

  await prisma.event.create({
    data: {
      title: 'Park Cleanup Volunteer Day',
      description: 'Give back to the community! Join us for a morning of cleaning up the city parks. We provide all equipment, and lunch is included. Make a positive impact while meeting new people!',
      shortDescription: 'Environmental volunteer activity',
      startDate: daysFromNow(14, 10),
      endDate: daysFromNow(14, 13),
      registrationDeadline: daysFromNow(12, 23),
      location: 'Volkspark Kaiserslautern',
      address: 'Volkspark, 67663 Kaiserslautern',
      maxParticipants: 30,
      price: 0.0,
      memberPrice: 0.0,
      organizer: { connect: { id: adminUser.id } },
      category: EventCategory.VOLUNTEER,
      type: EventType.FREE,
      status: EventStatus.REGISTRATION_OPEN,
      tags: ['volunteer', 'environment', 'community', 'outdoor'],
      imageUrl: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6',
    },
  });

  // NETWORKING & SOCIAL - Next 1-2 weeks
  await prisma.event.create({
    data: {
      title: 'International Students Networking',
      description: 'Professional networking event for international students! Meet local companies, learn about internship opportunities, and connect with professionals in your field. Dress code: Business casual.',
      shortDescription: 'Career networking for international students',
      startDate: daysFromNow(18, 17),
      endDate: daysFromNow(18, 20),
      registrationDeadline: daysFromNow(15, 23),
      location: 'Innovation Center',
      address: 'Trippstadter Str. 110, 67663 Kaiserslautern',
      maxParticipants: 40,
      price: 0.0,
      memberPrice: 0.0,
      organizer: { connect: { id: organizerUser.id } },
      category: EventCategory.NETWORKING,
      type: EventType.FREE,
      status: EventStatus.REGISTRATION_OPEN,
      tags: ['networking', 'career', 'professional', 'companies'],
      imageUrl: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b',
    },
  });

  await prisma.event.create({
    data: {
      title: 'Game Night: Board Games & Pizza',
      description: 'Relax and have fun with board games from around the world! We have classic German games, international favorites, and party games. Pizza and drinks included. Perfect for a cozy evening!',
      shortDescription: 'International board games evening',
      startDate: daysFromNow(5, 19),
      endDate: daysFromNow(5, 23),
      registrationDeadline: daysFromNow(4, 23),
      location: 'ESN Game Room',
      address: 'Building 42, Common Room, University',
      maxParticipants: 25,
      price: 5.0,
      memberPrice: 3.0,
      organizer: { connect: { id: adminUser.id } },
      category: EventCategory.SOCIAL,
      type: EventType.PAID,
      status: EventStatus.REGISTRATION_OPEN,
      tags: ['games', 'social', 'indoor', 'pizza'],
      imageUrl: 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09',
    },
  });

  // SPORTS & OUTDOOR - Next 1-3 weeks
  await prisma.event.create({
    data: {
      title: 'Hiking in Pfälzerwald',
      description: 'Explore the beautiful Palatinate Forest! Moderate difficulty hike with stunning views. Bring hiking shoes, water, and snacks. Transportation provided. Perfect for nature lovers!',
      shortDescription: 'Guided hike in the Palatinate Forest',
      startDate: daysFromNow(20, 9),
      endDate: daysFromNow(20, 16),
      registrationDeadline: daysFromNow(17, 23),
      location: 'Pfälzerwald',
      address: 'Meeting point: University Parking Lot',
      maxParticipants: 25,
      price: 8.0,
      memberPrice: 5.0,
      organizer: { connect: { id: organizerUser.id } },
      category: EventCategory.SPORTS,
      type: EventType.PAID,
      status: EventStatus.REGISTRATION_OPEN,
      tags: ['hiking', 'outdoor', 'nature', 'sports'],
      imageUrl: 'https://images.unsplash.com/photo-1551632811-561732d1e306',
    },
  });

  await prisma.event.create({
    data: {
      title: 'Bowling Night',
      description: 'Strike! Join us for a fun evening of bowling. No experience necessary - we\'ll teach you! Includes lane rental and shoe rental. Drinks and snacks available for purchase.',
      shortDescription: 'Fun bowling competition',
      startDate: daysFromNow(19, 20),
      endDate: daysFromNow(19, 23),
      registrationDeadline: daysFromNow(17, 23),
      location: 'Bowling Arena KL',
      address: 'Pariser Str. 97, 67655 Kaiserslautern',
      maxParticipants: 24,
      price: 10.0,
      memberPrice: 8.0,
      organizer: { connect: { id: adminUser.id } },
      category: EventCategory.SPORTS,
      type: EventType.PAID,
      status: EventStatus.REGISTRATION_OPEN,
      tags: ['bowling', 'sports', 'indoor', 'competition'],
      imageUrl: 'https://images.unsplash.com/photo-1577069861033-55d04cec4ef5',
    },
  });

  // SPECIAL EVENTS - Further in future
  await prisma.event.create({
    data: {
      title: 'Christmas Market Tour',
      description: 'Experience the magic of German Christmas markets! Visit multiple markets, taste Glühwein (mulled wine), try traditional foods, and shop for unique gifts. Festive atmosphere guaranteed!',
      shortDescription: 'Tour of Christmas markets in the region',
      startDate: daysFromNow(25, 15),
      endDate: daysFromNow(25, 21),
      registrationDeadline: daysFromNow(20, 23),
      location: 'Various Christmas Markets',
      address: 'Meeting point: Train Station Kaiserslautern',
      maxParticipants: 35,
      price: 15.0,
      memberPrice: 12.0,
      organizer: { connect: { id: organizerUser.id } },
      category: EventCategory.CULTURAL,
      type: EventType.PAID,
      status: EventStatus.PUBLISHED,
      tags: ['christmas', 'market', 'tradition', 'winter'],
      imageUrl: 'https://images.unsplash.com/photo-1543589077-47d81606c1bf',
    },
  });

  await prisma.event.create({
    data: {
      title: 'Karaoke Night',
      description: 'Sing your heart out! Private karaoke room with international song selection. Show off your singing skills or just come to support your friends. Prizes for best performances!',
      shortDescription: 'International karaoke party',
      startDate: daysFromNow(21, 21),
      endDate: daysFromNow(22, 0),
      registrationDeadline: daysFromNow(19, 23),
      location: 'K-Town Karaoke Bar',
      address: 'Fackelstraße 10, 67655 Kaiserslautern',
      maxParticipants: 30,
      price: 7.0,
      memberPrice: 5.0,
      organizer: { connect: { id: adminUser.id } },
      category: EventCategory.PARTY,
      type: EventType.PAID,
      status: EventStatus.PUBLISHED,
      tags: ['karaoke', 'party', 'music', 'singing'],
      imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7',
    },
  });

  console.log('🎫 Creating sample registrations...');

  // Get events for registrations
  const welcomeParty = await prisma.event.findFirst({ where: { title: 'Welcome Party 2025' } });
  const foodNight = await prisma.event.findFirst({ where: { title: 'International Food Night' } });

  // Create registrations with upsert to avoid duplicates
  if (welcomeParty) {
    await prisma.registration.upsert({
      where: {
        userId_eventId: {
          userId: studentUser1.id,
          eventId: welcomeParty.id,
        },
      },
      update: {},
      create: {
        user: { connect: { id: studentUser1.id } },
        event: { connect: { id: welcomeParty.id } },
        status: RegistrationStatus.CONFIRMED,
        registrationType: RegistrationType.REGULAR,
        paymentRequired: true,
        paymentStatus: PaymentStatus.COMPLETED,
        amountDue: 5.0,
        currency: 'EUR',
        dietary: 'Vegetarian',
        registeredAt: new Date(),
        confirmedAt: new Date(),
      },
    });
  }

  if (foodNight) {
    await prisma.registration.upsert({
      where: {
        userId_eventId: {
          userId: studentUser2.id,
          eventId: foodNight.id,
        },
      },
      update: {},
      create: {
        user: { connect: { id: studentUser2.id } },
        event: { connect: { id: foodNight.id } },
        status: RegistrationStatus.CONFIRMED,
        registrationType: RegistrationType.REGULAR,
        paymentRequired: false,
        paymentStatus: PaymentStatus.COMPLETED,
        amountDue: 0.0,
        currency: 'EUR',
        specialRequests: 'Will bring Mexican tacos!',
        registeredAt: new Date(),
        confirmedAt: new Date(),
      },
    });
  }

  console.log('✅ Database seeded successfully with 22 diverse events!');
  console.log('📊 Events by category:');
  console.log('   - Party: 4 events');
  console.log('   - Cultural: 4 events');
  console.log('   - Travel: 3 events');
  console.log('   - Workshop/Educational: 4 events');
  console.log('   - Sports: 3 events');
  console.log('   - Social: 2 events');
  console.log('   - Networking: 1 event');
  console.log('   - Volunteer: 1 event');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
