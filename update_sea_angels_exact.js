import { initializeApp } from 'firebase/app';
import { getFirestore, doc, updateDoc, getDoc } from 'firebase/firestore';
import fs from 'fs';

const firebaseConfig = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

const rates = {
  duplo: [
    { w: 375, we: 400 }, // Jan (0)
    { w: 330, we: 360 }, // Feb (1)
    { w: 405, we: 340 }, // Mar (2)
    { w: 290, we: 320 }, // Apr (3)
    { w: 265, we: 295 }, // May (4)
    { w: 265, we: 295 }, // Jun (5)
    { w: 265, we: 295 }, // Jul (6)
    { w: 265, we: 295 }, // Aug (7)
    { w: 305, we: 320 }, // Sep (8)
    { w: 320, we: 340 }, // Oct (9)
    { w: 340, we: 365 }, // Nov (10)
    { w: 355, we: 375 }, // Dec (11)
  ],
  triplo: [
    { w: 475, we: 500.5 }, // Jan
    { w: 440, we: 465 },   // Feb
    { w: 0, we: 0 },       // Mar (0 no excel)
    { w: 365, we: 410 },   // Apr
    { w: 355, we: 385 },   // May
    { w: 355, we: 385 },   // Jun
    { w: 355, we: 385 },   // Jul
    { w: 355, we: 385 },   // Aug
    { w: 385, we: 429 },   // Sep
    { w: 395, we: 440 },   // Oct
    { w: 420, we: 445 },   // Nov
    { w: 440, we: 465 },   // Dec
  ],
  quadruplo: [
    { w: 550, we: 575 }, // Jan
    { w: 485, we: 505 }, // Feb
    { w: 465, we: 475 }, // Mar
    { w: 460, we: 495 }, // Apr
    { w: 460, we: 510 }, // May
    { w: 460, we: 510 }, // Jun
    { w: 460, we: 510 }, // Jul
    { w: 460, we: 510 }, // Aug
    { w: 460, we: 510 }, // Sep
    { w: 475, we: 515 }, // Oct
    { w: 495, we: 515 }, // Nov
    { w: 510, we: 525 }, // Dec
  ]
};

function generateCalendar(ratesArray) {
  const cal = {};
  const years = [2026, 2027]; // Populate for both years
  
  for (const year of years) {
    for (let month = 0; month < 12; month++) {
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      for (let day = 1; day <= daysInMonth; day++) {
        const dateObj = new Date(year, month, day);
        const dayOfWeek = dateObj.getDay(); // 0 = Sun, 1 = Mon, ..., 5 = Fri, 6 = Sat
        const isWeekend = dayOfWeek === 5 || dayOfWeek === 6; // Friday and Saturday nights
        
        const price = isWeekend ? ratesArray[month].we : ratesArray[month].w;
        
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        
        if (price === 0) {
          cal[dateStr] = { status: "closed", adultPrice: 0, childPrice: 0, babyPrice: 0 };
        } else {
          cal[dateStr] = { status: "open", adultPrice: price, childPrice: 0, babyPrice: 0 };
        }
      }
    }
  }
  return cal;
}

async function run() {
  const docRef = doc(db, 'accommodations', '1783575802252');
  
  const roomTypes = [
    {
      id: "room-duplo-simples",
      name: "Quarto Duplo Simples",
      description: "Quarto duplo confortável.",
      minGuests: 1,
      maxGuests: 2,
      basePrice: 265, // Lowest weekday price as fallback
      beds: "1 Cama de Casal",
      amenities: ["Ar-condicionado", "Wi-Fi Grátis", "Frigobar", "TV", "Banheiro Privativo"],
      pricingPeriods: [],
      calendar: generateCalendar(rates.duplo)
    },
    {
      id: "room-triplo-simples",
      name: "Quarto Triplo Simples",
      description: "Quarto triplo confortável.",
      minGuests: 1,
      maxGuests: 3,
      basePrice: 355,
      beds: "1 Cama de Casal, 1 Cama de Solteiro",
      amenities: ["Ar-condicionado", "Wi-Fi Grátis", "Frigobar", "TV", "Banheiro Privativo"],
      pricingPeriods: [],
      calendar: generateCalendar(rates.triplo)
    },
    {
      id: "room-quadruplo-simples",
      name: "Quarto Quádruplo Simples",
      description: "Quarto quádruplo familiar.",
      minGuests: 1,
      maxGuests: 4,
      basePrice: 460,
      beds: "1 Cama de Casal, 2 Camas de Solteiro",
      amenities: ["Ar-condicionado", "Wi-Fi Grátis", "Frigobar", "TV", "Banheiro Privativo"],
      pricingPeriods: [],
      calendar: generateCalendar(rates.quadruplo)
    }
  ];

  await updateDoc(docRef, { roomTypes });
  console.log("Hotel Sea Angels rooms updated EXACTLY matching the spreadsheet!");
  process.exit(0);
}
run().catch(console.error);
