import { initializeApp } from 'firebase/app';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';
import fs from 'fs';

const firebaseConfig = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

const data = JSON.parse(fs.readFileSync('sea_angels.json', 'utf8'));

// Define standard pricing periods for a given base price
function getPricingPeriods(base) {
  return [
    { id: "p1", name: "Agosto a Novembro (Baixa Temporada)", startDate: "2026-08-16", endDate: "2026-11-30", price: base },
    { id: "p2", name: "Feriado Independência", startDate: "2026-09-04", endDate: "2026-09-07", price: Math.round(base * 1.3) },
    { id: "p3", name: "Feriado N. Sra Aparecida", startDate: "2026-10-09", endDate: "2026-10-12", price: Math.round(base * 1.3) },
    { id: "p4", name: "Feriado Finados", startDate: "2026-10-30", endDate: "2026-11-02", price: Math.round(base * 1.3) },
    { id: "p5", name: "Feriado Proclamação", startDate: "2026-11-13", endDate: "2026-11-15", price: Math.round(base * 1.3) },
    { id: "p6", name: "Alta Temporada (Dezembro)", startDate: "2026-12-01", endDate: "2026-12-25", price: Math.round(base * 1.45) },
    { id: "p7", name: "Réveillon 2027", startDate: "2026-12-26", endDate: "2027-01-02", price: Math.round(base * 2.5) },
    { id: "p8", name: "Alta Temporada (Janeiro)", startDate: "2027-01-03", endDate: "2027-01-31", price: Math.round(base * 1.7) }
  ];
}

data.roomTypes = [
  {
    id: "room-sea-angels-1",
    name: "Suíte Dupla Standard",
    description: "Confortável suíte com cama de casal, ar-condicionado, TV Smart, frigobar e banheiro privativo.",
    minGuests: 1,
    maxGuests: 2,
    basePrice: 380,
    beds: "1 Cama de Casal",
    amenities: ["Ar-condicionado", "Wi-Fi Grátis", "Frigobar", "TV Smart", "Banheiro Privativo"],
    pricingPeriods: getPricingPeriods(380)
  },
  {
    id: "room-sea-angels-2",
    name: "Suíte Tripla Comfort",
    description: "Ampla suíte ideal para pequenos grupos, com uma cama de casal e uma de solteiro.",
    minGuests: 1,
    maxGuests: 3,
    basePrice: 520,
    beds: "1 Cama de Casal, 1 Cama de Solteiro",
    amenities: ["Ar-condicionado", "Wi-Fi Grátis", "Frigobar", "TV Smart", "Banheiro Privativo"],
    pricingPeriods: getPricingPeriods(520)
  },
  {
    id: "room-sea-angels-3",
    name: "Suíte Quádrupla Família",
    description: "Espaço perfeito para famílias, acomodando até quatro pessoas confortavelmente.",
    minGuests: 1,
    maxGuests: 4,
    basePrice: 650,
    beds: "1 Cama de Casal, 2 Camas de Solteiro",
    amenities: ["Ar-condicionado", "Wi-Fi Grátis", "Frigobar", "TV Smart", "Banheiro Privativo"],
    pricingPeriods: getPricingPeriods(650)
  },
  {
    id: "room-sea-angels-4",
    name: "Suíte Premium com Hidromassagem",
    description: "Nossa suíte mais luxuosa, contando com banheira de hidromassagem e varanda com vista.",
    minGuests: 1,
    maxGuests: 2,
    basePrice: 580,
    beds: "1 Cama de Casal Queen",
    hasHydro: true,
    hasBalcony: true,
    amenities: ["Ar-condicionado", "Wi-Fi Grátis", "Frigobar", "TV Smart", "Banheira de Hidromassagem", "Varanda"],
    pricingPeriods: getPricingPeriods(580)
  }
];

async function run() {
  const docRef = doc(db, 'accommodations', '1783575802252');
  await updateDoc(docRef, { roomTypes: data.roomTypes });
  console.log("Hotel Sea Angels rooms updated successfully!");
  process.exit(0);
}
run().catch(console.error);
