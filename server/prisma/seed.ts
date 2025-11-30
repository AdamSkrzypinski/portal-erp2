import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  await prisma.order.deleteMany();
  await prisma.supplier.deleteMany();

  const salt = await bcrypt.genSalt(10);
  const passwordHash1 = await bcrypt.hash('testowy1', salt);
  const passwordHash2 = await bcrypt.hash('testowy2', salt);
  const passwordHash3 = await bcrypt.hash('testowy3', salt);

  const supplier1 = await prisma.supplier.create({
    data: {
      email: 'dostawca1@firma.pl',
      password: passwordHash1,
      name: 'Testowy dostawca1',
      nip: '1111111111',
    },
  });

  const supplier2 = await prisma.supplier.create({
    data: {
      email: 'dostawca2@firma.pl',
      password: passwordHash2,
      name: 'Testowy dostawca2',
      nip: '2222222222',
    },
  });

  const supplier3 = await prisma.supplier.create({
    data: {
      email: 'dostawca3@firma.pl',
      password: passwordHash3,
      name: 'Testowy dostawca3',
      nip: '3333333333',
    },
  });

  const ordersData = [
    {
      orderNumber: 'PO/2023/11/001',
      deliveryDate: new Date('2023-11-30'),
      totalAmount: 15400.00,
      currency: 'PLN',
      status: 'NOWE',
      items: JSON.stringify([{ name: 'Blacha 5mm', qty: 100 }, { name: 'Profil 40x40', qty: 200 }]),
      supplierId: supplier1.id,
    },
    {
      orderNumber: 'PO/2023/11/002',
      deliveryDate: new Date('2023-12-05'),
      totalAmount: 2500.50,
      currency: 'PLN',
      status: 'POTWIERDZONE',
      items: JSON.stringify([{ name: 'Śruby M12', qty: 5000 }]),
      supplierId: supplier1.id,
    },
    {
      orderNumber: 'PO/2023/12/005',
      deliveryDate: new Date('2023-12-10'),
      totalAmount: 43000.00,
      currency: 'PLN',
      status: 'NOWE',
      items: JSON.stringify([{ name: 'Pręty zbrojeniowe', qty: 1000 }]),
      supplierId: supplier1.id,
    },
    {
      orderNumber: 'PO/2023/12/12',
      deliveryDate: new Date('2023-12-20'),
      totalAmount: 12000.00,
      currency: 'PLN',
      status: 'WYSLANE',
      items: JSON.stringify([{ name: 'Blacha ryflowana', qty: 50 }]),
      supplierId: supplier1.id,
    },
    {
      orderNumber: 'PO/2024/01/01',
      deliveryDate: new Date('2024-01-15'),
      totalAmount: 5600.00,
      currency: 'PLN',
      status: 'ODRZUCONE',
      items: JSON.stringify([{ name: 'Kątownik nierdzewny', qty: 120 }]),
      supplierId: supplier1.id,
    },
    {
      orderNumber: 'PO/2024/01/05',
      deliveryDate: new Date('2024-01-20'),
      totalAmount: 8900.00,
      currency: 'PLN',
      status: 'NOWE',
      items: JSON.stringify([{ name: 'Rura bezszwowa', qty: 300 }]),
      supplierId: supplier1.id,
    },
    
    {
      orderNumber: 'PO/2023/11/003',
      deliveryDate: new Date('2023-11-28'),
      totalAmount: 8900.00,
      currency: 'PLN',
      status: 'WYSLANE',
      items: JSON.stringify([{ name: 'Sterownik PLC', qty: 5 }, { name: 'Czujniki zbliżeniowe', qty: 20 }]),
      supplierId: supplier2.id,
    },
    {
      orderNumber: 'PO/2023/12/001',
      deliveryDate: new Date('2023-12-15'),
      totalAmount: 1250.00,
      currency: 'PLN',
      status: 'NOWE',
      items: JSON.stringify([{ name: 'Kable sygnałowe', qty: 500 }]),
      supplierId: supplier2.id,
    },
    {
      orderNumber: 'PO/2023/12/08',
      deliveryDate: new Date('2023-12-22'),
      totalAmount: 3400.00,
      currency: 'PLN',
      status: 'POTWIERDZONE',
      items: JSON.stringify([{ name: 'Diody LED High Power', qty: 1000 }]),
      supplierId: supplier2.id,
    },
    {
      orderNumber: 'PO/2023/12/22',
      deliveryDate: new Date('2024-01-05'),
      totalAmount: 550.00,
      currency: 'PLN',
      status: 'NOWE',
      items: JSON.stringify([{ name: 'Moduły WiFi', qty: 50 }]),
      supplierId: supplier2.id,
    },

    {
      orderNumber: 'TR/2023/11/99',
      deliveryDate: new Date('2023-11-29'),
      totalAmount: 1500.00,
      currency: 'PLN',
      status: 'ODRZUCONE',
      items: JSON.stringify([{ name: 'Usługa transportowa - Palety', qty: 4 }]),
      supplierId: supplier3.id,
    },
    {
      orderNumber: 'TR/2023/12/01',
      deliveryDate: new Date('2023-12-02'),
      totalAmount: 3000.00,
      currency: 'PLN',
      status: 'NOWE',
      items: JSON.stringify([{ name: 'Transport HDS', qty: 1 }]),
      supplierId: supplier3.id,
    },
    {
      orderNumber: 'TR/2023/12/15',
      deliveryDate: new Date('2023-12-18'),
      totalAmount: 800.00,
      currency: 'PLN',
      status: 'POTWIERDZONE',
      items: JSON.stringify([{ name: 'Kurier ekspresowy', qty: 10 }]),
      supplierId: supplier3.id,
    },
    {
      orderNumber: 'TR/2024/01/02',
      deliveryDate: new Date('2024-01-03'),
      totalAmount: 4500.00,
      currency: 'PLN',
      status: 'NOWE',
      items: JSON.stringify([{ name: 'Transport międzynarodowy (DE)', qty: 1 }]),
      supplierId: supplier3.id,
    },
  ];

  for (const order of ordersData) {
    await prisma.order.create({
      data: {
        ...order,
        status: order.status as any,
      },
    });
  }

  console.log('Seedowanie zakonczone sukcesem');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });