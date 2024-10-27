import { prisma } from "../postgres/init"
import { seedData } from "./data"


(async()=>{

    await prisma.item.deleteMany(),
    await prisma.list.deleteMany(),
    await prisma.user.deleteMany()
    console.log('All data deleted successfully')

    const users = await prisma.user.createMany({data: seedData.users})

    const lists = await prisma.list.createMany({data:seedData.lists})

    const items = await prisma.item.createMany({data:seedData.items})

    prisma.$disconnect();
    console.log('Seeded successfully');
})()
