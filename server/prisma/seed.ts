
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Rozpoczynam seedowanie bazy danych (Symulacja ERP)...');

 
  await prisma.order.deleteMany();
  await prisma.supplier.deleteMany();


  const supplier1 = await prisma.supplier.create({
    data: {
      email: 'jan@stal-met.pl',
      password: 'haslo123', // W prawdziwym appu: bcrypt.hash('haslo123')
      name: 'Stal-Met Sp. z o.o.',
      nip: '1234567890',
    },
  });

  console.log(`✅ Utworzono dostawcę: ${supplier1.name}`);

  const supplier2 = await prisma.supplier.create({
    data: {
      email: 'biuro@szybka-dostawa.pl',
      password: 'haslo123',
      name: 'Szybka Dostawa S.A.',
      nip: '0987654321',
    },
  });

  console.log(`✅ Utworzono dostawcę: ${supplier2.name}`);


  await prisma.order.createMany({
    data: [
      {
        orderNumber: 'PO/2023/11/001',
        deliveryDate: new Date('2023-11-30'),
        totalAmount: 15000.00,
        currency: 'PLN',
        status: 'NOWE',
        items: JSON.stringify([
          { name: 'Blacha stalowa 5mm', quantity: 100, unit: 'szt' },
          { name: 'Profil zamknięty 40x40', quantity: 200, unit: 'mb' },
        ]),
        supplierId: supplier1.id,
      },
      {
        orderNumber: 'PO/2023/11/002',
        deliveryDate: new Date('2023-12-05'),
        totalAmount: 2500.50,
        status: 'POTWIERDZONE', 
        items: JSON.stringify([
          { name: 'Śruby M12', quantity: 5000, unit: 'szt' },
        ]),
        supplierId: supplier1.id,
      },
    ],
  });

  console.log('✅ Dodano przykładowe zamówienia do ERP.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });