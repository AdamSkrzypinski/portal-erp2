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
      name: 'Testowy Dostawca 1 (Stal)',
      nip: '1111111111',
    },
  });

  const supplier2 = await prisma.supplier.create({
    data: {
      email: 'dostawca2@firma.pl',
      password: passwordHash2,
      name: 'Testowy Dostawca 2 (Elektronika)',
      nip: '2222222222',
    },
  });

  const supplier3 = await prisma.supplier.create({
    data: {
      email: 'dostawca3@firma.pl',
      password: passwordHash3,
      name: 'Testowy Dostawca 3 (Opakowania i BHP)',
      nip: '3333333333',
    },
  });

  const ordersData = [
    {
      orderNumber: 'PO/2025/01/001',
      deliveryDate: new Date('2025-01-30'),
      totalAmount: 15400.00,
      currency: 'PLN',
      status: 'NOWE',
      items: JSON.stringify([{ name: 'Blacha 5mm', qty: 100 }, { name: 'Profil 40x40', qty: 200 }]),
      supplierId: supplier1.id,
    },
    {
      orderNumber: 'PO/2025/02/002',
      deliveryDate: new Date('2025-02-05'),
      totalAmount: 2500.50,
      currency: 'PLN',
      status: 'POTWIERDZONE',
      items: JSON.stringify([{ name: 'Śruby M12', qty: 5000 }]),
      supplierId: supplier1.id,
    },
    {
      orderNumber: 'PO/2025/03/005',
      deliveryDate: new Date('2025-03-10'),
      totalAmount: 43000.00,
      currency: 'PLN',
      status: 'NOWE',
      items: JSON.stringify([{ name: 'Pręty zbrojeniowe', qty: 1000 }]),
      supplierId: supplier1.id,
    },
    {
      orderNumber: 'PO/2025/03/12',
      deliveryDate: new Date('2025-03-20'),
      totalAmount: 12000.00,
      currency: 'PLN',
      status: 'WYSLANE',
      items: JSON.stringify([{ name: 'Blacha ryflowana', qty: 50 }]),
      supplierId: supplier1.id,
    },
    {
      orderNumber: 'PO/2025/04/01',
      deliveryDate: new Date('2025-04-15'),
      totalAmount: 5600.00,
      currency: 'PLN',
      status: 'ODRZUCONE',
      items: JSON.stringify([{ name: 'Kątownik nierdzewny', qty: 120 }]),
      supplierId: supplier1.id,
    },
    {
      orderNumber: 'PO/2025/04/05',
      deliveryDate: new Date('2025-04-20'),
      totalAmount: 8900.00,
      currency: 'PLN',
      status: 'NOWE',
      items: JSON.stringify([{ name: 'Rura bezszwowa', qty: 300 }]),
      supplierId: supplier1.id,
    },
    {
      orderNumber: 'PO/2025/05/10',
      deliveryDate: new Date('2025-05-15'),
      totalAmount: 3200.00,
      currency: 'PLN',
      status: 'NOWE',
      items: JSON.stringify([{ name: 'Ceownik hutniczy', qty: 50 }]),
      supplierId: supplier1.id,
    },
    {
      orderNumber: 'PO/2025/05/22',
      deliveryDate: new Date('2025-05-30'),
      totalAmount: 7500.00,
      currency: 'PLN',
      status: 'NOWE',
      items: JSON.stringify([{ name: 'Blacha ocynkowana', qty: 150 }]),
      supplierId: supplier1.id,
    },
    
    {
      orderNumber: 'PO/2025/01/003',
      deliveryDate: new Date('2025-01-28'),
      totalAmount: 8900.00,
      currency: 'PLN',
      status: 'WYSLANE',
      items: JSON.stringify([{ name: 'Sterownik PLC', qty: 5 }, { name: 'Czujniki zbliżeniowe', qty: 20 }]),
      supplierId: supplier2.id,
    },
    {
      orderNumber: 'PO/2025/02/001',
      deliveryDate: new Date('2025-02-15'),
      totalAmount: 1250.00,
      currency: 'PLN',
      status: 'NOWE',
      items: JSON.stringify([{ name: 'Kable sygnałowe', qty: 500 }]),
      supplierId: supplier2.id,
    },
    {
      orderNumber: 'PO/2025/02/08',
      deliveryDate: new Date('2025-02-22'),
      totalAmount: 3400.00,
      currency: 'PLN',
      status: 'POTWIERDZONE',
      items: JSON.stringify([{ name: 'Diody LED High Power', qty: 1000 }]),
      supplierId: supplier2.id,
    },
    {
      orderNumber: 'PO/2025/02/22',
      deliveryDate: new Date('2025-02-25'),
      totalAmount: 550.00,
      currency: 'PLN',
      status: 'NOWE',
      items: JSON.stringify([{ name: 'Moduły WiFi', qty: 50 }]),
      supplierId: supplier2.id,
    },
    {
      orderNumber: 'PO/2025/03/05',
      deliveryDate: new Date('2025-03-12'),
      totalAmount: 18000.00,
      currency: 'PLN',
      status: 'NOWE',
      items: JSON.stringify([{ name: 'Falownik 3-fazowy', qty: 10 }]),
      supplierId: supplier2.id,
    },
    {
      orderNumber: 'PO/2025/04/18',
      deliveryDate: new Date('2025-04-25'),
      totalAmount: 420.00,
      currency: 'PLN',
      status: 'NOWE',
      items: JSON.stringify([{ name: 'Bezpieczniki przemysłowe', qty: 100 }]),
      supplierId: supplier2.id,
    },

    {
      orderNumber: 'MAT/2025/03/99',
      deliveryDate: new Date('2025-03-29'),
      totalAmount: 1500.00,
      currency: 'PLN',
      status: 'ODRZUCONE',
      items: JSON.stringify([{ name: 'Palety EURO (używane)', qty: 50 }]),
      supplierId: supplier3.id,
    },
    {
      orderNumber: 'MAT/2025/04/01',
      deliveryDate: new Date('2025-04-02'),
      totalAmount: 3000.00,
      currency: 'PLN',
      status: 'NOWE',
      items: JSON.stringify([{ name: 'Folia Stretch (czarna)', qty: 200 }]),
      supplierId: supplier3.id,
    },
    {
      orderNumber: 'MAT/2025/04/15',
      deliveryDate: new Date('2025-04-18'),
      totalAmount: 800.00,
      currency: 'PLN',
      status: 'POTWIERDZONE',
      items: JSON.stringify([{ name: 'Rękawice robocze', qty: 100 }]),
      supplierId: supplier3.id,
    },
    {
      orderNumber: 'MAT/2025/05/02',
      deliveryDate: new Date('2025-05-03'),
      totalAmount: 4500.00,
      currency: 'PLN',
      status: 'NOWE',
      items: JSON.stringify([{ name: 'Kartony zbiorcze 600x400', qty: 500 }]),
      supplierId: supplier3.id,
    },
    {
      orderNumber: 'MAT/2025/05/01',
      deliveryDate: new Date('2025-05-05'),
      totalAmount: 1200.00,
      currency: 'PLN',
      status: 'NOWE',
      items: JSON.stringify([{ name: 'Taśma pakowa', qty: 300 }]),
      supplierId: supplier3.id,
    },
    {
      orderNumber: 'MAT/2025/05/20',
      deliveryDate: new Date('2025-05-21'),
      totalAmount: 600.00,
      currency: 'PLN',
      status: 'NOWE',
      items: JSON.stringify([{ name: 'Etykiety termiczne', qty: 20 }]),
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