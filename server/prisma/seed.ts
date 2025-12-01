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
    { num: 'PO/2025/10/001', date: '2025-10-01', del: '2025-10-10', amt: 15400.00, st: 'WYSLANE', items: [{ name: 'Blacha 5mm', qty: 100 }, { name: 'Profil 40x40', qty: 200 }], supp: supplier1.id, cmt: 'Dostawa kompletna.' },
    { num: 'PO/2025/10/015', date: '2025-10-05', del: '2025-10-12', amt: 2200.00, st: 'WYSLANE', items: [{ name: 'Pręt gwintowany M8', qty: 500 }], supp: supplier1.id, cmt: 'Kurier DHL.' },
    { num: 'PO/2025/10/040', date: '2025-10-20', del: '2025-10-25', amt: 45000.00, st: 'WYSLANE', items: [{ name: 'Stal zbrojeniowa fi12', qty: 2000 }], supp: supplier1.id, cmt: 'Transport ciężarowy nr rej. WZ 12345.' },
    { num: 'PO/2025/11/002', date: '2025-11-02', del: '2025-11-15', amt: 8900.00, st: 'ODRZUCONE', items: [{ name: 'Profil HEB 200', qty: 10 }], supp: supplier1.id, cmt: 'Brak profilu na stanie, oczekiwanie na walcownię.' },
    { num: 'PO/2025/11/010', date: '2025-11-10', del: '2025-11-20', amt: 3200.00, st: 'POTWIERDZONE', items: [{ name: 'Kątownik 50x50', qty: 100 }], supp: supplier1.id, cmt: 'Potwierdzam termin.' },
    { num: 'PO/2025/12/001', date: '2025-12-01', del: '2025-12-15', amt: 15400.00, st: 'NOWE', items: [{ name: 'Blacha 5mm', qty: 100 }, { name: 'Profil 40x40', qty: 200 }], supp: supplier1.id },
    { num: 'PO/2025/12/002', date: '2025-12-02', del: '2025-12-20', amt: 2500.50, st: 'POTWIERDZONE', items: [{ name: 'Śruby M12', qty: 5000 }], supp: supplier1.id, cmt: 'Towar zarezerwowany.' },
    { num: 'PO/2025/12/005', date: '2025-12-03', del: '2025-12-10', amt: 1200.00, st: 'NOWE', items: [{ name: 'Podkładki powiększone M10', qty: 2000 }], supp: supplier1.id },
    { num: 'PO/2025/12/008', date: '2025-12-05', del: '2025-12-18', amt: 5600.00, st: 'NOWE', items: [{ name: 'Rura kwadratowa 100x100', qty: 30 }], supp: supplier1.id },
    { num: 'PO/2026/01/05', date: '2025-12-10', del: '2026-01-05', amt: 43000.00, st: 'NOWE', items: [{ name: 'Pręty zbrojeniowe', qty: 1000 }], supp: supplier1.id },
    { num: 'PO/2026/01/12', date: '2025-12-12', del: '2026-01-12', amt: 12000.00, st: 'NOWE', items: [{ name: 'Blacha ryflowana', qty: 50 }], supp: supplier1.id },
    { num: 'PO/2026/01/25', date: '2025-12-15', del: '2026-01-25', amt: 5600.00, st: 'ODRZUCONE', items: [{ name: 'Kątownik nierdzewny', qty: 120 }], supp: supplier1.id, cmt: 'Brak surowca w hucie.' },
    { num: 'PO/2026/02/10', date: '2025-12-20', del: '2026-02-10', amt: 8900.00, st: 'NOWE', items: [{ name: 'Rura bezszwowa', qty: 300 }], supp: supplier1.id },
    { num: 'PO/2026/02/15', date: '2025-12-22', del: '2026-02-15', amt: 1100.00, st: 'NOWE', items: [{ name: 'Nakrętki samohamowne M12', qty: 1000 }], supp: supplier1.id },
    { num: 'PO/2026/02/22', date: '2026-01-05', del: '2026-02-22', amt: 3200.00, st: 'NOWE', items: [{ name: 'Ceownik hutniczy', qty: 50 }], supp: supplier1.id },
    { num: 'PO/2026/03/05', date: '2026-01-10', del: '2026-03-05', amt: 7500.00, st: 'NOWE', items: [{ name: 'Blacha ocynkowana', qty: 150 }], supp: supplier1.id },
    { num: 'PO/2026/03/10', date: '2026-01-15', del: '2026-03-10', amt: 2800.00, st: 'NOWE', items: [{ name: 'Profil zamknięty 20x20', qty: 400 }], supp: supplier1.id },
    { num: 'EL/2025/10/05', date: '2025-10-01', del: '2025-10-15', amt: 5000.00, st: 'WYSLANE', items: [{ name: 'Raspberry Pi 4', qty: 10 }], supp: supplier2.id, cmt: 'Dostarczono.' },
    { num: 'EL/2025/10/20', date: '2025-10-10', del: '2025-10-25', amt: 12000.00, st: 'WYSLANE', items: [{ name: 'Monitor przemysłowy 19"', qty: 5 }], supp: supplier2.id, cmt: 'UPS Tracking: 1Z999...' },
    { num: 'EL/2025/11/01', date: '2025-11-01', del: '2025-11-10', amt: 850.00, st: 'POTWIERDZONE', items: [{ name: 'Zasilacz DIN 24V', qty: 10 }], supp: supplier2.id, cmt: 'Czekamy na dostawę od producenta.' },
    { num: 'EL/2025/11/15', date: '2025-11-05', del: '2025-11-20', amt: 3400.00, st: 'ODRZUCONE', items: [{ name: 'Stary model sterownika', qty: 2 }], supp: supplier2.id, cmt: 'Model wycofany, proponujemy zamiennik V2.' },
    { num: 'EL/2025/12/18', date: '2025-12-01', del: '2025-12-18', amt: 8900.00, st: 'WYSLANE', items: [{ name: 'Sterownik PLC', qty: 5 }, { name: 'Czujniki zbliżeniowe', qty: 20 }], supp: supplier2.id, cmt: 'Dostawa kompletna.' },
    { num: 'EL/2026/01/08', date: '2025-12-05', del: '2026-01-08', amt: 1250.00, st: 'NOWE', items: [{ name: 'Kable sygnałowe', qty: 500 }], supp: supplier2.id },
    { num: 'EL/2026/01/15', date: '2025-12-10', del: '2026-01-15', amt: 3400.00, st: 'POTWIERDZONE', items: [{ name: 'Diody LED High Power', qty: 1000 }], supp: supplier2.id },
    { num: 'EL/2026/01/20', date: '2025-12-12', del: '2026-01-20', amt: 2100.00, st: 'NOWE', items: [{ name: 'Przełącznik krańcowy', qty: 50 }], supp: supplier2.id },
    { num: 'EL/2026/01/30', date: '2025-12-15', del: '2026-01-30', amt: 550.00, st: 'NOWE', items: [{ name: 'Moduły WiFi', qty: 50 }], supp: supplier2.id },
    { num: 'EL/2026/02/05', date: '2025-12-20', del: '2026-02-05', amt: 900.00, st: 'NOWE', items: [{ name: 'Klawiatura membranowa', qty: 10 }], supp: supplier2.id },
    { num: 'EL/2026/02/14', date: '2026-01-05', del: '2026-02-14', amt: 18000.00, st: 'NOWE', items: [{ name: 'Falownik 3-fazowy', qty: 10 }], supp: supplier2.id },
    { num: 'EL/2026/02/20', date: '2026-01-10', del: '2026-02-20', amt: 4500.00, st: 'NOWE', items: [{ name: 'Panel HMI 7"', qty: 2 }], supp: supplier2.id },
    { num: 'EL/2026/03/01', date: '2026-01-15', del: '2026-03-01', amt: 420.00, st: 'NOWE', items: [{ name: 'Bezpieczniki przemysłowe', qty: 100 }], supp: supplier2.id },
    { num: 'EL/2026/03/15', date: '2026-01-20', del: '2026-03-15', amt: 7200.00, st: 'NOWE', items: [{ name: 'Serwomechanizm', qty: 4 }], supp: supplier2.id },
    { num: 'MAT/2025/10/01', date: '2025-10-01', del: '2025-10-05', amt: 400.00, st: 'WYSLANE', items: [{ name: 'Czyściwo bawełniane', qty: 50 }], supp: supplier3.id, cmt: 'Dostarczono.' },
    { num: 'MAT/2025/11/05', date: '2025-11-01', del: '2025-11-05', amt: 1500.00, st: 'WYSLANE', items: [{ name: 'Folia bąbelkowa', qty: 20 }], supp: supplier3.id },
    { num: 'MAT/2025/12/28', date: '2025-12-10', del: '2025-12-28', amt: 1500.00, st: 'ODRZUCONE', items: [{ name: 'Palety EURO (używane)', qty: 50 }], supp: supplier3.id, cmt: 'Wycofano produkt z oferty.' },
    { num: 'MAT/2026/01/03', date: '2025-12-15', del: '2026-01-03', amt: 3000.00, st: 'NOWE', items: [{ name: 'Folia Stretch (czarna)', qty: 200 }], supp: supplier3.id },
    { num: 'MAT/2026/01/10', date: '2025-12-20', del: '2026-01-10', amt: 120.00, st: 'NOWE', items: [{ name: 'Marker permanentny', qty: 50 }], supp: supplier3.id },
    { num: 'MAT/2026/01/20', date: '2026-01-05', del: '2026-01-20', amt: 800.00, st: 'POTWIERDZONE', items: [{ name: 'Rękawice robocze', qty: 100 }], supp: supplier3.id, cmt: 'Wysyłka w przyszłym tygodniu.' },
    { num: 'MAT/2026/02/01', date: '2026-01-10', del: '2026-02-01', amt: 350.00, st: 'NOWE', items: [{ name: 'Okulary ochronne', qty: 20 }], supp: supplier3.id },
    { num: 'MAT/2026/02/05', date: '2026-01-12', del: '2026-02-05', amt: 4500.00, st: 'NOWE', items: [{ name: 'Kartony zbiorcze 600x400', qty: 500 }], supp: supplier3.id },
    { num: 'MAT/2026/02/12', date: '2026-01-15', del: '2026-02-12', amt: 900.00, st: 'NOWE', items: [{ name: 'Kask ochronny biały', qty: 15 }], supp: supplier3.id },
    { num: 'MAT/2026/02/18', date: '2026-01-18', del: '2026-02-18', amt: 1200.00, st: 'NOWE', items: [{ name: 'Taśma pakowa', qty: 300 }], supp: supplier3.id },
    { num: 'MAT/2026/02/25', date: '2026-01-20', del: '2026-02-25', amt: 200.00, st: 'NOWE', items: [{ name: 'Apteczka zakładowa', qty: 2 }], supp: supplier3.id },
    { num: 'MAT/2026/03/10', date: '2026-01-25', del: '2026-03-10', amt: 600.00, st: 'NOWE', items: [{ name: 'Etykiety termiczne', qty: 20 }], supp: supplier3.id },
    { num: 'MAT/2026/03/15', date: '2026-01-30', del: '2026-03-15', amt: 250.00, st: 'NOWE', items: [{ name: 'Nożyk bezpieczny', qty: 50 }], supp: supplier3.id },
    { num: 'MAT/2026/03/20', date: '2026-02-01', del: '2026-03-20', amt: 1800.00, st: 'NOWE', items: [{ name: 'Wypełniacz styropianowy', qty: 30 }], supp: supplier3.id },
    { num: 'MAT/2026/03/25', date: '2026-02-05', del: '2026-03-25', amt: 5000.00, st: 'NOWE', items: [{ name: 'Folia termokurczliwa', qty: 100 }], supp: supplier3.id },
  ];

  for (const order of ordersData) {
    await prisma.order.create({
      data: {
        orderNumber: order.num,
        dateIssued: new Date(order.date),
        deliveryDate: new Date(order.del),
        totalAmount: order.amt,
        currency: 'PLN',
        status: order.st as any,
        items: JSON.stringify(order.items),
        comment: order.cmt || null,
        supplierId: order.supp,
      },
    });
  }

  console.log(`✅ Seedowanie zakonczone sukcesem. Dodano ${ordersData.length} zamówień.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });