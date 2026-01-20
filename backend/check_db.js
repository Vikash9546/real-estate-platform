const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
    try {
        const count = await prisma.property.count();
        console.log('Total Properties:', count);

        const approved = await prisma.property.count({ where: { status: 'APPROVED' } });
        console.log('Approved Properties:', approved);

        const first = await prisma.property.findFirst();
        console.log('First Property:', first);
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

check();
