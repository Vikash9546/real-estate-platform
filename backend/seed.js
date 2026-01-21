const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');

const seedData = async () => {
    try {
        console.log('🌱 Starting comprehensive seed with 1000+ properties...');

        // Create demo users
        const hashedPassword = await bcrypt.hash('password123', 10);

        let owner = await prisma.user.findFirst({ where: { email: 'owner@example.com' } });
        if (!owner) {
            owner = await prisma.user.create({
                data: {
                    name: 'Demo Owner',
                    email: 'owner@example.com',
                    password: hashedPassword,
                    role: 'OWNER',
                },
            });
            console.log('👤 Created demo owner');
        }

        let admin = await prisma.user.findFirst({ where: { email: 'admin@example.com' } });
        if (!admin) {
            admin = await prisma.user.create({
                data: {
                    name: 'Admin User',
                    email: 'admin@example.com',
                    password: hashedPassword,
                    role: 'ADMIN',
                },
            });
            console.log('👤 Created admin user');
        }

        // Comprehensive Indian cities and localities
        const citiesData = {
            'Mumbai': {
                localities: ['Andheri West', 'Bandra West', 'Juhu', 'Powai', 'Worli', 'Lower Parel', 'Goregaon', 'Malad', 'Kandivali', 'Borivali', 'Thane', 'Navi Mumbai', 'Colaba', 'Marine Drive', 'Dadar'],
                priceMultiplier: 1.5
            },
            'Delhi': {
                localities: ['Dwarka', 'Rohini', 'Vasant Kunj', 'Saket', 'Greater Kailash', 'Hauz Khas', 'Lajpat Nagar', 'Janakpuri', 'Rajouri Garden', 'Pitampura', 'Mayur Vihar', 'Nehru Place', 'Connaught Place', 'Karol Bagh', 'Punjabi Bagh'],
                priceMultiplier: 1.3
            },
            'Bangalore': {
                localities: ['Whitefield', 'Electronic City', 'Koramangala', 'Indiranagar', 'HSR Layout', 'Marathahalli', 'BTM Layout', 'JP Nagar', 'Hebbal', 'Yelahanka', 'Sarjapur Road', 'Bannerghatta Road', 'Bellandur', 'Mahadevapura', 'Jayanagar'],
                priceMultiplier: 1.2
            },
            'Hyderabad': {
                localities: ['Gachibowli', 'Hitech City', 'Madhapur', 'Jubilee Hills', 'Banjara Hills', 'Kondapur', 'Kukatpally', 'Miyapur', 'Mehdipatnam', 'Ameerpet', 'Secunderabad', 'Begumpet', 'Bachupally', 'Miyapur', 'Kompally'],
                priceMultiplier: 1.0
            },
            'Pune': {
                localities: ['Hinjewadi', 'Wakad', 'Baner', 'Aundh', 'Viman Nagar', 'Koregaon Park', 'Kalyani Nagar', 'Kharadi', 'Magarpatta', 'Hadapsar', 'Pimple Saudagar', 'Pimpri Chinchwad', 'Katraj', 'Warje', 'Kothrud'],
                priceMultiplier: 1.0
            },
            'Chennai': {
                localities: ['OMR', 'Velachery', 'Anna Nagar', 'T Nagar', 'Adyar', 'Besant Nagar', 'Nungambakkam', 'Mylapore', 'Porur', 'Tambaram', 'Thoraipakkam', 'Pallikaranai', 'Perungudi', 'Sholinganallur', 'Medavakkam'],
                priceMultiplier: 1.1
            },
            'Kolkata': {
                localities: ['Salt Lake', 'New Town', 'Rajarhat', 'Park Street', 'Ballygunge', 'Alipore', 'Behala', 'Jadavpur', 'Garia', 'Howrah', 'Dum Dum', 'Barasat', 'Kasba', 'Santoshpur', 'Lake Town'],
                priceMultiplier: 0.8
            },
            'Ahmedabad': {
                localities: ['Prahlad Nagar', 'Satellite', 'Bodakdev', 'Vastrapur', 'Thaltej', 'Ambawadi', 'Navrangpura', 'SG Highway', 'Bopal', 'Gota', 'Chandkheda', 'Maninagar', 'Naranpura', 'Sabarmati', 'Vastral'],
                priceMultiplier: 0.7
            },
            'Jaipur': {
                localities: ['Malviya Nagar', 'Vaishali Nagar', 'Mansarovar', 'Jagatpura', 'Sitapura', 'Tonk Road', 'Ajmer Road', 'C-Scheme', 'Raja Park', 'Civil Lines', 'Bani Park', 'Jhotwara', 'Sanganer', 'Sodala', 'Nirman Nagar'],
                priceMultiplier: 0.6
            },
            'Lucknow': {
                localities: ['Gomti Nagar', 'Indira Nagar', 'Aliganj', 'Alambagh', 'Hazratganj', 'Mahanagar', 'Rajajipuram', 'Jankipuram', 'Chinhat', 'Chowk', 'Aminabad', 'Dalibagh', 'Vikas Nagar', 'Nirala Nagar', 'Ashiana'],
                priceMultiplier: 0.6
            },
            'Chandigarh': {
                localities: ['Sector 17', 'Sector 22', 'Sector 34', 'Sector 35', 'Sector 43', 'Sector 47', 'Mohali', 'Panchkula', 'Zirakpur', 'Kharar', 'Sector 8', 'Sector 15', 'Sector 27', 'Sector 32', 'Sector 40'],
                priceMultiplier: 0.9
            },
            'Noida': {
                localities: ['Sector 62', 'Sector 76', 'Sector 137', 'Sector 150', 'Greater Noida', 'Noida Extension', 'Sector 18', 'Sector 45', 'Sector 50', 'Sector 78', 'Sector 104', 'Sector 120', 'Sector 128', 'Sector 144', 'Sector 168'],
                priceMultiplier: 1.0
            }
        };

        const propertyTypes = ['Apartment', 'Villa', 'Independent Floor', 'Studio', 'Penthouse', 'Duplex'];
        const listingTypes = ['RENT', 'sell'];

        // Realistic property images from Unsplash
        const images = [
            'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80',
            'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
            'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80',
            'https://images.unsplash.com/photo-1600596542815-2250657d2f96?w=800&q=80',
            'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
            'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
            'https://images.unsplash.com/photo-1626178793926-22b28830aa30?w=800&q=80',
            'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80',
            'https://images.unsplash.com/photo-1605146769289-440188cc0d20?w=800&q=80',
            'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80',
            'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
            'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80',
            'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&q=80',
            'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=800&q=80',
            'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&q=80'
        ];

        const amenities = [
            '24/7 Security',
            'Power Backup',
            'Gym',
            'Swimming Pool',
            'Kids Play Area',
            'Clubhouse',
            'Parking',
            'Lift',
            'Garden',
            'CCTV Surveillance'
        ];

        const properties = [];
        const cities = Object.keys(citiesData);

        console.log(`📊 Generating 1000 properties across ${cities.length} cities...`);

        for (let i = 0; i < 1000; i++) {
            const city = cities[Math.floor(Math.random() * cities.length)];
            const cityData = citiesData[city];
            const locality = cityData.localities[Math.floor(Math.random() * cityData.localities.length)];
            const type = propertyTypes[Math.floor(Math.random() * propertyTypes.length)];
            const bedrooms = type === 'Studio' ? 1 : Math.floor(Math.random() * 4) + 1;
            const bathrooms = Math.max(1, bedrooms - Math.floor(Math.random() * 2));
            const area = type === 'Villa' ? bedrooms * 600 + Math.floor(Math.random() * 800) :
                type === 'Penthouse' ? bedrooms * 500 + Math.floor(Math.random() * 700) :
                    bedrooms * 350 + Math.floor(Math.random() * 400);

            const basePrice = bedrooms * 10000;
            const price = Math.floor(basePrice * cityData.priceMultiplier + Math.floor(Math.random() * 15000));
            const listing = listingTypes[Math.floor(Math.random() * listingTypes.length)];
            const furnished = Math.random() > 0.4;
            const status = Math.random() > 0.1 ? 'APPROVED' : 'PENDING';

            // Select 2-4 random amenities
            const selectedAmenities = [];
            const numAmenities = Math.floor(Math.random() * 3) + 2;
            for (let j = 0; j < numAmenities; j++) {
                const amenity = amenities[Math.floor(Math.random() * amenities.length)];
                if (!selectedAmenities.includes(amenity)) {
                    selectedAmenities.push(amenity);
                }
            }

            // Generate description
            const description = `Beautiful ${bedrooms} BHK ${type.toLowerCase()} in ${locality}, ${city}. ` +
                `This ${furnished ? 'fully furnished' : 'unfurnished'} property offers ${area} sq.ft of living space ` +
                `with ${bedrooms} bedroom${bedrooms > 1 ? 's' : ''} and ${bathrooms} bathroom${bathrooms > 1 ? 's' : ''}. ` +
                `Amenities include: ${selectedAmenities.join(', ')}. ` +
                `Located in prime area with easy access to metro, schools, hospitals, and shopping centers.`;

            // Select 1-3 random images
            const propertyImages = [];
            const numImages = Math.floor(Math.random() * 3) + 1;
            for (let j = 0; j < numImages; j++) {
                const img = images[Math.floor(Math.random() * images.length)];
                if (!propertyImages.includes(img)) {
                    propertyImages.push(img);
                }
            }

            properties.push({
                title: `${bedrooms} BHK ${type} in ${locality}`,
                description: description,
                price: price,
                city: city,
                address: `${Math.floor(Math.random() * 500) + 1}, ${locality}, ${city}`,
                area: area,
                bedrooms: bedrooms,
                bathrooms: bathrooms,
                furnished: furnished,
                type: type,
                listingType: listing,
                status: status,
                ownerId: owner.id,
                image: propertyImages
            });

            // Progress indicator
            if ((i + 1) % 100 === 0) {
                console.log(`📍 Generated ${i + 1} properties...`);
            }
        }

        // Delete existing properties to avoid duplicates
        console.log('🗑️  Clearing existing properties...');
        await prisma.property.deleteMany({});

        // Insert in batches for better performance
        console.log(`🚀 Seeding ${properties.length} properties to database...`);
        const batchSize = 100;
        for (let i = 0; i < properties.length; i += batchSize) {
            const batch = properties.slice(i, i + batchSize);
            await prisma.property.createMany({
                data: batch
            });
            console.log(`✅ Inserted batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(properties.length / batchSize)}`);
        }

        console.log('✅ Seed complete!');
        console.log(`📊 Total properties seeded: ${properties.length}`);
        console.log(`🏙️  Cities covered: ${cities.join(', ')}`);
    } catch (error) {
        console.error('❌ Seed error:', error);
    } finally {
        await prisma.$disconnect();
    }
};

seedData();
