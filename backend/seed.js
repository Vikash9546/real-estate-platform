const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');

const seedData = async () => {
    try {
        console.log('🌱 Starting seed...');

        // Create a demo owner if not exists
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

        // Real-ish data for Indian context
        const cities = ['Mumbai', 'Pune', 'Bangalore', 'Delhi', 'Hyderabad', 'Chennai'];
        const localities = {
            'Mumbai': ['Bandra', 'Andheri', 'Juhu', 'Powai', 'Worli'],
            'Pune': ['Koregaon Park', 'Kalyani Nagar', 'Baner', 'Viman Nagar', 'Aundh'],
            'Bangalore': ['Indiranagar', 'Koramangala', 'Whitefield', 'HSR Layout', 'JP Nagar'],
            'Delhi': ['Vasant Vihar', 'Saket', 'Hauz Khas', 'Greater Kailash', 'Dwarka'],
            'Hyderabad': ['Jubilee Hills', 'Banjara Hills', 'Gachibowli', 'Madhapur', 'Kondapur'],
            'Chennai': ['Adyar', 'Anna Nagar', 'Velachery', 'Besant Nagar', 'T Nagar']
        };

        const propertyTypes = ['Apartment', 'Villa', 'Independent Floor', 'Studio'];
        const listingTypes = ['Rent', 'Sale'];
        const images = [
            'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80',
            'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
            'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80',
            'https://images.unsplash.com/photo-1600596542815-2250657d2f96?w=800&q=80',
            'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
            'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
            'https://images.unsplash.com/photo-1626178793926-22b28830aa30?w=800&q=80',
            'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80',
            'https://images.unsplash.com/photo-1605146769289-440188cc0d20?w=800&q=80'
        ];

        const properties = [];
        for (let i = 0; i < 110; i++) {
            const city = cities[Math.floor(Math.random() * cities.length)];
            const locality = localities[city][Math.floor(Math.random() * localities[city].length)];
            const type = propertyTypes[Math.floor(Math.random() * propertyTypes.length)];
            const bedrooms = Math.floor(Math.random() * 4) + 1;
            const bathrooms = Math.max(1, bedrooms - Math.floor(Math.random() * 2));
            const area = bedrooms * 400 + Math.floor(Math.random() * 500);
            const price = bedrooms * (city === 'Mumbai' ? 15000 : 8000) + Math.floor(Math.random() * 10000);
            const listing = listingTypes[0]; // Mostly Rent for now based on UI

            properties.push({
                title: `${bedrooms} BHK ${type} in ${locality}`,
                description: `A spacious and well-ventilated ${bedrooms} BHK ${type} located in the prime area of ${locality}, ${city}. Close to IT parks, schools, and malls. Features modern amenities including 24/7 security, power backup, and dedicated parking.`,
                price: price,
                city: city,
                address: `${Math.floor(Math.random() * 100) + 1}, ${locality}, ${city}`,
                area: area,
                bedrooms: bedrooms,
                bathrooms: bathrooms,
                furnished: Math.random() > 0.5,
                type: type,
                listingType: listing,
                status: 'APPROVED',
                ownerId: owner.id,
                image: [images[Math.floor(Math.random() * images.length)]]
            });
        }

        // Insert in batches
        console.log(`🚀 Seeding ${properties.length} properties...`);
        await prisma.property.createMany({
            data: properties
        });

        console.log('✅ Seed complete!');
    } catch (error) {
        console.error('❌ User error:', error);
    } finally {
        await prisma.$disconnect();
    }
};

seedData();
