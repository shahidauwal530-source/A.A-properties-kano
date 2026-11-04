import bcrypt from 'bcryptjs';
import { isMongoConnected, localStore } from './db.ts';
import { UserModel } from './models/User.ts';
import { PropertyModel } from './models/Property.ts';

export const HERO_IMAGE = '/src/assets/images/hero_kano_mansion_1793795009227.jpg';
export const DUPLEX_IMAGE = '/src/assets/images/kano_duplex_residence_1793795042264.jpg';
export const COMMERCIAL_IMAGE = '/src/assets/images/kano_commercial_shop_1793795056124.jpg';
export const LAND_IMAGE = '/src/assets/images/kano_land_plot_1793795069623.jpg';

export async function seedDatabase() {
  try {
    const adminPasswordHash = await bcrypt.hash('0904', 10);
    const demoPasswordHash = await bcrypt.hash('123456', 10);

    const initialProperties = [
      {
        _id: 'prop_01_sabon_gari',
        title: 'Gida 3-Bedroom Flat Mai Kyau - Sabon Gari',
        type: 'Gida',
        area: 'Sabon Gari',
        price: 600000,
        dealType: 'Haya - Per Year',
        bedrooms: 3,
        bathrooms: 2,
        size: '50x80 ft',
        document: 'Tenancy Agreement',
        water: 'Borehole mai gudu 24/7',
        power: 'Kano DisCo (NEPA) + Generator space',
        fence: true,
        parking: true,
        security: true,
        description:
          'Kyakkyawan gida mai dakuna 3 a cikin Sabon Gari, Kano. Akwai fankoki, fenti mai kyau, tiles a ko\'ina, kicin da kayan aiki, da wadataccen ruwa. Ya dace da iyali. Kusa da babban titi.',
        images: [DUPLEX_IMAGE, HERO_IMAGE],
        videoUrl: '',
        mapPin: 'Sabon Gari, Kano',
        status: 'Available',
        views: 245,
        whatsappClicks: 38,
        favoritesCount: 14,
        isFeatured: true,
      },
      {
        _id: 'prop_02_nassarawa',
        title: 'Gida 2-Bedroom Mai Tsari a Nassarawa GRA',
        type: 'Gida',
        area: 'Nassarawa',
        price: 500000,
        dealType: 'Haya - Per Year',
        bedrooms: 2,
        bathrooms: 2,
        size: '40x60 ft',
        document: 'Tenancy Agreement',
        water: 'Ruwan Famfo & Borehole',
        power: 'Wutar 24hrs Nassarawa line',
        fence: true,
        parking: true,
        security: true,
        description:
          'Kyakkyawan gida mai dakuna biyu (all en-suite) a Nassarawa GRA, wuri mai nutsuwa da kwanciyar hankali. Akwai jami\'an tsaro a get, compound mai suminti da fure.',
        images: [DUPLEX_IMAGE, HERO_IMAGE],
        videoUrl: '',
        mapPin: 'Nassarawa GRA, Kano',
        status: 'Available',
        views: 312,
        whatsappClicks: 49,
        favoritesCount: 22,
        isFeatured: true,
      },
      {
        _id: 'prop_03_tarauni_self',
        title: 'Self-Contain Mai Cikakken Kayan More Rayuwa - Tarauni',
        type: 'Gida',
        area: 'Tarauni',
        price: 350000,
        dealType: 'Haya - Per Year',
        bedrooms: 1,
        bathrooms: 1,
        size: 'Room & Parlour ensuite',
        document: 'Tenancy Agreement',
        water: 'Borehole',
        power: 'Prepaid Meter',
        fence: true,
        parking: true,
        security: true,
        description:
          'Daki daya da falo da kicin da bandaki mai kyau a unguwar Tarauni. Ya dace da sabon ma\'aikaci ko sabon aure. Wuri mai saukin shiga da fita.',
        images: [DUPLEX_IMAGE],
        videoUrl: '',
        mapPin: 'Tarauni, Kano',
        status: 'Available',
        views: 180,
        whatsappClicks: 26,
        favoritesCount: 9,
        isFeatured: false,
      },
      {
        _id: 'prop_04_tarauni_duplex',
        title: 'Katan Duplex 4-Bedroom na Alfarma - Tarauni',
        type: 'Gida',
        area: 'Tarauni',
        price: 1800000,
        dealType: 'Haya - Per Year',
        bedrooms: 4,
        bathrooms: 4,
        size: '70x100 ft',
        document: 'Tenancy Agreement',
        water: 'Ruwan Borehole & Overhead Tank 5000L',
        power: 'Solar Inverter + NEPA Dedicated',
        fence: true,
        parking: true,
        security: true,
        description:
          'Gidan bene (Duplex) na alfarma mai dakuna 4, kowane daki da bandakinsa, faluka biyu, kicin na zamani, dakin masu aiki (BQ), da filin ajiye motoci 4.',
        images: [HERO_IMAGE, DUPLEX_IMAGE],
        videoUrl: '',
        mapPin: 'Tarauni New Layout, Kano',
        status: 'Available',
        views: 520,
        whatsappClicks: 82,
        favoritesCount: 45,
        isFeatured: true,
      },
      {
        _id: 'prop_05_janguza_land',
        title: 'Fili 50x100 Mai C of O - Janguza Kano',
        type: 'Fili',
        area: 'Janguza',
        price: 4500000,
        dealType: 'Saya - Total',
        bedrooms: 0,
        bathrooms: 0,
        size: '50 x 100 ft (Plot 12)',
        document: 'C of O',
        water: 'Borehole kusa',
        power: 'Titin wuta ya wuce',
        fence: false,
        parking: true,
        security: true,
        description:
          'Fili mai kyau a Janguza Kano, an sa beacons da binciken survey na kwarai. C of O mai inganci, babu wata matsalar gado ko takaddama. Shirye yake domin gini nan take.',
        images: [LAND_IMAGE],
        videoUrl: '',
        mapPin: 'Janguza Barracks Area, Kano',
        status: 'Available',
        views: 430,
        whatsappClicks: 64,
        favoritesCount: 31,
        isFeatured: true,
      },
      {
        _id: 'prop_06_rijiyar_zaki_land',
        title: 'Fili 50x50 Mai R of O - Rijiyar Zaki',
        type: 'Fili',
        area: 'Rijiyar Zaki',
        price: 2800000,
        dealType: 'Saya - Total',
        bedrooms: 0,
        bathrooms: 0,
        size: '50 x 50 ft',
        document: 'R of O',
        water: 'Ruwa a kusa',
        power: 'Layin wuta',
        fence: false,
        parking: true,
        security: true,
        description:
          'Fili kusa da BUK New Campus road a Rijiyar Zaki. Ya dace sosai da gina gidan haya na dalibai ko gidan zama. Takardu sun cika dari bisa dari.',
        images: [LAND_IMAGE],
        videoUrl: '',
        mapPin: 'Rijiyar Zaki, Kano',
        status: 'Available',
        views: 290,
        whatsappClicks: 41,
        favoritesCount: 19,
        isFeatured: false,
      },
      {
        _id: 'prop_07_hotoro_land',
        title: 'Fili Full Plot 100x100 Mai C of O - Hotoro GRA',
        type: 'Fili',
        area: 'Hotoro',
        price: 7000000,
        dealType: 'Saya - Total',
        bedrooms: 0,
        bathrooms: 0,
        size: '100 x 100 ft',
        document: 'C of O',
        water: 'Akwai',
        power: 'Akwai',
        fence: true,
        parking: true,
        security: true,
        description:
          'Babban fili full plot a Hotoro GRA kusa da Maiduguri Road. C of O na gwamnatin Kano, an riga an yi masa katanga zagaye. Zuba ginin gidanka kawai.',
        images: [LAND_IMAGE, HERO_IMAGE],
        videoUrl: '',
        mapPin: 'Hotoro GRA, Kano',
        status: 'Available',
        views: 610,
        whatsappClicks: 95,
        favoritesCount: 52,
        isFeatured: true,
      },
      {
        _id: 'prop_08_kantin_kwari_shop',
        title: 'Shago na Zamani a Kasuwar Kantin Kwari',
        type: 'Shago',
        area: 'Kantin Kwari',
        price: 1200000,
        dealType: 'Haya - Per Year',
        bedrooms: 0,
        bathrooms: 1,
        size: '14 x 16 ft',
        document: 'Tenancy Agreement',
        water: 'Available',
        power: '24hr Plaza Generator',
        fence: true,
        parking: true,
        security: true,
        description:
          'Shago a kan titin kasuwar yadi ta Kantin Kwari. Akwai tagogin gilashi, kofa mai kariya, da wutar generator ta plaza daga safe zuwa yamma.',
        images: [COMMERCIAL_IMAGE],
        videoUrl: '',
        mapPin: 'Kantin Kwari Market, Kano',
        status: 'Available',
        views: 480,
        whatsappClicks: 77,
        favoritesCount: 36,
        isFeatured: true,
      },
      {
        _id: 'prop_09_sabon_gari_shop',
        title: 'Shago a Kasuwar Sabon Gari Kano',
        type: 'Shago',
        area: 'Sabon Gari',
        price: 800000,
        dealType: 'Haya - Per Year',
        bedrooms: 0,
        bathrooms: 0,
        size: '12 x 12 ft',
        document: 'Tenancy Agreement',
        water: 'Akwai',
        power: 'Prepaid line',
        fence: true,
        parking: true,
        security: true,
        description:
          'Shago mai kyan gani kusa da Normandy Line a Sabon Gari Market. Ya dace da sayar da kaya, kayan masarufi ko sana\'ar hannu. Saukin hanya da jama\'a.',
        images: [COMMERCIAL_IMAGE],
        videoUrl: '',
        mapPin: 'Sabon Gari Market, Kano',
        status: 'Available',
        views: 220,
        whatsappClicks: 32,
        favoritesCount: 15,
        isFeatured: false,
      },
      {
        _id: 'prop_10_murtala_office',
        title: 'Katafaren Ofishi na Kamfani - Murtala Mohammed Way',
        type: 'Company',
        area: 'Murtala Mohammed Way',
        price: 2500000,
        dealType: 'Haya - Per Year',
        bedrooms: 3,
        bathrooms: 2,
        size: '180 sqm Suite',
        document: 'Tenancy Agreement',
        water: 'Famfo & Tanki',
        power: 'Dedicated Transformer',
        fence: true,
        parking: true,
        security: true,
        description:
          'Babban ofishin hadakar kasuwanci a kan babban titin Murtala Mohammed Way. Ya kunshi dakin taro (Conference room), ofisoshin gudanarwa, kicin da reception.',
        images: [COMMERCIAL_IMAGE, HERO_IMAGE],
        videoUrl: '',
        mapPin: 'Murtala Mohammed Way, Kano',
        status: 'Available',
        views: 370,
        whatsappClicks: 58,
        favoritesCount: 28,
        isFeatured: true,
      },
      {
        _id: 'prop_11_sharada_warehouse',
        title: 'Babban Warehouse / Rumbun Ajiya a Sharada Phase 2',
        type: 'Warehouse',
        area: 'Sharada',
        price: 3500000,
        dealType: 'Haya - Per Year',
        bedrooms: 0,
        bathrooms: 2,
        size: '600 sqm Industrial Floor',
        document: 'C of O',
        water: 'Industrial Borehole',
        power: '3-Phase Heavy Duty Electricity',
        fence: true,
        parking: true,
        security: true,
        description:
          'Katafaren rumbun ajiya (warehouse) a yankin masana\'antu na Sharada Phase 2. Motocin manyan treloli da kwantena na iya shiga da sauke kaya cikin sauki.',
        images: [COMMERCIAL_IMAGE],
        videoUrl: '',
        mapPin: 'Sharada Phase 2 Industrial Layout, Kano',
        status: 'Available',
        views: 590,
        whatsappClicks: 88,
        favoritesCount: 40,
        isFeatured: true,
      },
      {
        _id: 'prop_12_zoo_road_hall',
        title: 'Katafaren Hall na Biki da Taro - Zoo Road Kano',
        type: 'Hall',
        area: 'Zoo Road',
        price: 150000,
        dealType: 'Haya - Per Day',
        bedrooms: 0,
        bathrooms: 6,
        size: '1000 Capacity Hall',
        document: 'Tenancy Agreement',
        water: 'Water supply uninterrupted',
        power: 'Soundproof Heavy Generator',
        fence: true,
        parking: true,
        security: true,
        description:
          'Babban dakin taro da biki (Event & Banquet Hall) mai daukar mutum 1,000 a Zoo Road kusa da Ado Bayero Mall. Akwai AC 10, kujeru da tebura, da fakin motoci sama da 80.',
        images: [HERO_IMAGE, COMMERCIAL_IMAGE],
        videoUrl: '',
        mapPin: 'Zoo Road, Kano',
        status: 'Available',
        views: 740,
        whatsappClicks: 110,
        favoritesCount: 68,
        isFeatured: true,
      },
    ];

    const adminUser = {
      _id: 'user_admin_adam',
      fullName: 'Adam Auwal Adam',
      phone: '09042782681',
      email: 'aapropertieskano@gmail.com',
      passwordHash: adminPasswordHash,
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      favorites: ['prop_01_sabon_gari', 'prop_04_tarauni_duplex'],
      location: 'Murtala Mohammed Way, Kano',
      isVerified: true,
      pin: adminPasswordHash,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const demoUser = {
      _id: 'user_demo_musa',
      fullName: 'Musa Abdullahi',
      phone: '08012345678',
      email: 'demo@gmail.com',
      passwordHash: demoPasswordHash,
      role: 'user',
      avatar: '',
      favorites: ['prop_01_sabon_gari'],
      location: 'Sabon Gari, Kano',
      isVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // If connected to live MongoDB
    if (isMongoConnected) {
      const existingAdmin = await UserModel.findOne({
        $or: [{ phone: '09042782681' }, { email: 'aapropertieskano@gmail.com' }],
      });
      if (!existingAdmin) {
        await UserModel.create({
          fullName: 'Adam Auwal Adam',
          phone: '09042782681',
          email: 'aapropertieskano@gmail.com',
          passwordHash: adminPasswordHash,
          role: 'admin',
          isVerified: true,
          pin: '0904',
          location: 'Murtala Mohammed Way, Kano',
        });
        console.log('✅ Seeded Admin Adam Auwal Adam in MongoDB!');
      }

      const existingDemo = await UserModel.findOne({ email: 'demo@gmail.com' });
      if (!existingDemo) {
        await UserModel.create({
          fullName: 'Musa Abdullahi',
          phone: '08012345678',
          email: 'demo@gmail.com',
          passwordHash: demoPasswordHash,
          role: 'user',
          isVerified: true,
          location: 'Sabon Gari, Kano',
        });
        console.log('✅ Seeded Demo User Musa in MongoDB!');
      }

      const propCount = await PropertyModel.countDocuments();
      if (propCount === 0) {
        for (const p of initialProperties) {
          const { _id, ...rest } = p;
          await PropertyModel.create(rest);
        }
        console.log('✅ Seeded 12 properties in MongoDB Atlas!');
      }
    } else {
      // Local persistent store
      const users = localStore.getCollection('users');
      const properties = localStore.getCollection('properties');

      if (!users.some((u) => u.phone === '09042782681' || u.email === 'aapropertieskano@gmail.com')) {
        users.push(adminUser);
      }
      if (!users.some((u) => u.email === 'demo@gmail.com')) {
        users.push(demoUser);
      }

      if (properties.length === 0) {
        properties.push(...initialProperties);
      }
      localStore.save();
      console.log('✅ Initialized persistent local database with Admin, Demo User, and 12 Kano properties.');
    }
  } catch (error) {
    console.error('Error during database seeding:', error);
  }
}
