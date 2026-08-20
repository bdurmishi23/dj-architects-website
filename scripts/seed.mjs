// One-off content seed using the real copy from source_design/. Text only —
// no images exist yet, so coverImage/gallery/heroImage/aboutPortrait are
// left unset (components already handle missing images gracefully).
//
// Usage: SANITY_WRITE_TOKEN=... node scripts/seed.mjs
// Requires an Editor-permission token from sanity.io/manage. Never commit
// the token; this script only reads it from the environment.
import { createClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "pkbqthid";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_WRITE_TOKEN;

if (!token) {
  console.error("Missing SANITY_WRITE_TOKEN env var.");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-06-01",
  token,
  useCdn: false,
});

const siteSettings = {
  _id: "siteSettings",
  _type: "siteSettings",
  heroTextEn:
    "We design warm, evening-lit interiors for a city that lives after dark.",
  heroTextAl:
    "Projektojmë ambiente të ngrohta, të ndriçuara në mbrëmje, për një qytet që jeton pas mbrëmjes.",
  taglineEn: "Architecture, interiors and light. Tirana, Albania.",
  taglineAl: "Arkitekturë, interier dhe dritë. Tiranë, Shqipëri.",
  aboutKickerEn: "About the studio",
  aboutKickerAl: "Rreth studios",
  aboutLeadEn:
    "Deni and Jurgen met in their first year of architecture school. Five years later they built the thing they kept talking about. We work slowly, by hand, close to the people who will live in the rooms.",
  aboutLeadAl:
    "Deni dhe Jurgen u njohën në vitin e parë të arkitekturës. Pesë vjet më vonë ndërtuan atë për të cilën vazhdimisht flisnin. Punojmë ngadalë, me dorë, pranë njerëzve që do t'i banojnë ambientet.",
  quoteDeniEn: "“Draw the route through the room first. The furniture comes after.”",
  quoteDeniAl: "“Vizato së pari rrugën përmes dhomës. Mobiliet vijnë pas.”",
  quoteJurgenEn: "“And keep one wall quiet, so the light has somewhere to land.”",
  quoteJurgenAl: "“Dhe lër një mur të qetë, që drita të ketë ku të bjerë.”",
  contactLeadEn: "Tell us about the space.",
  contactLeadAl: "Tregoni për hapësirën.",
  contactNoteEn:
    "One email is enough — no forms, no briefs. We usually reply within two days.",
  contactNoteAl: "Një email mjafton — pa formularë. Përgjigjemi brenda dy ditësh.",
  contactEmail: "studio@djarchitects.al",
  contactPhone: "+355 68 200 0000",
  address: "Rruga Ibrahim Rugova 12, Tirana 1019, Albania",
};

const rooms = [
  {
    slug: "living",
    nameEn: "Living rooms",
    nameAl: "Dhoma ndenjeje",
    descriptionEn:
      "Boucle, walnut, low light. The room built around one seat that catches the evening best.",
    descriptionAl:
      "Bukle, arrë, dritë e ulët. Dhoma e ndërtuar rreth vendit që kap më mirë dritën e mbrëmjes.",
  },
  {
    slug: "kitchen",
    nameEn: "Kitchens",
    nameAl: "Kuzhina",
    descriptionEn:
      "Working surfaces in stone and brass, sized for two people cooking without stepping around each other.",
    descriptionAl:
      "Sipërfaqe pune në gur dhe bronz, të mata për dy veta që gatuajnë pa u shqetësuar.",
  },
  {
    slug: "bedroom",
    nameEn: "Bedrooms",
    nameAl: "Dhoma gjumi",
    descriptionEn:
      "Curtains, warm floors, no ceiling light — the room where the plan gets quietest.",
    descriptionAl:
      "Perde, dysheme e ngrohtë, pa dritë tavani — dhoma ku plani bëhet më i qetë.",
  },
  {
    slug: "bath",
    nameEn: "Bathrooms",
    nameAl: "Banjo",
    descriptionEn:
      "Travertine, green tile, soft edges. Small rooms treated with the same care as the large ones.",
    descriptionAl:
      "Travertin, pllakë e gjelbër, buzë të lëmuara. Dhoma të vogla me të njëjtën kujdes si të mëdhat.",
  },
  {
    slug: "entrance",
    nameEn: "Entrances",
    nameAl: "Hyrje",
    descriptionEn: "The first two metres of every plan — where a project introduces itself.",
    descriptionAl: "Dy metrat e parë të çdo plani — ku projekti prezantohet.",
  },
  {
    slug: "terrace",
    nameEn: "Terraces",
    nameAl: "Tarraca",
    descriptionEn:
      "Evening rooms, half outside. Furniture chosen to survive weather and still feel soft.",
    descriptionAl: "Dhoma mbrëmjeje, gjysmë jashtë. Mobilie që i mbijetojnë motit dhe mbeten të buta.",
  },
];

// From source_design's All Projects catalogue (the fuller, discipline+status
// dataset). `rooms` tags are adapted from Room.dc.html's RELATED lookups,
// substituting the two Tracklist-only demo names ("Studio Nova", "House on
// the ridge") that don't exist in this catalogue.
const projects = [
  {
    name: "Villa Dajti",
    discipline: "architecture",
    categoryEn: "Residential",
    categoryAl: "Banim",
    location: "Tirana",
    year: 2026,
    status: "construction",
    signatureMark: "a1",
    rooms: ["living", "kitchen", "bedroom", "bath", "entrance", "terrace"],
    emphasis: "medium",
    featuredOnHome: true,
    order: 10,
  },
  {
    name: "Villa Lalzit",
    discipline: "architecture",
    categoryEn: "New build",
    categoryAl: "Ndërtim i ri",
    location: "Lalzi Bay",
    year: 2026,
    status: "design",
    signatureMark: "d2",
    rooms: ["kitchen", "bedroom", "terrace"],
    emphasis: "compact",
    featuredOnHome: false,
    order: 20,
  },
  {
    name: "Studio Verdhë",
    discipline: "architecture",
    categoryEn: "Workspace",
    categoryAl: "Zyra",
    location: "Tirana",
    year: 2025,
    status: "construction",
    signatureMark: "d1",
    rooms: ["living", "entrance"],
    emphasis: "compact",
    featuredOnHome: true,
    order: 30,
  },
  {
    name: "Apartament Rugova",
    discipline: "interiors",
    categoryEn: "Interior",
    categoryAl: "Interier",
    location: "Tirana",
    year: 2026,
    status: "built",
    signatureMark: "a2",
    rooms: ["kitchen", "bedroom", "bath"],
    emphasis: "medium",
    featuredOnHome: true,
    order: 40,
  },
  {
    name: "Loft Ndroq",
    discipline: "interiors",
    categoryEn: "Interior",
    categoryAl: "Interier",
    location: "Tirana",
    year: 2025,
    status: "built",
    signatureMark: "c1",
    rooms: ["living"],
    emphasis: "compact",
    featuredOnHome: true,
    order: 50,
  },
  {
    name: "Apartament Fresku",
    discipline: "interiors",
    categoryEn: "Interior",
    categoryAl: "Interier",
    location: "Tirana",
    year: 2026,
    status: "construction",
    signatureMark: "c3",
    rooms: ["kitchen", "bath"],
    emphasis: "compact",
    featuredOnHome: false,
    order: 60,
  },
  {
    name: "Kafe Bianco",
    discipline: "hospitality",
    categoryEn: "Hospitality",
    categoryAl: "Hoteleri",
    location: "Durrës",
    year: 2026,
    status: "built",
    signatureMark: "a3",
    rooms: ["entrance"],
    emphasis: "feature",
    featuredOnHome: true,
    order: 70,
  },
  {
    name: "Bar Kripa",
    discipline: "hospitality",
    categoryEn: "Hospitality",
    categoryAl: "Hoteleri",
    location: "Tirana",
    year: 2025,
    status: "built",
    signatureMark: "c2",
    rooms: [],
    emphasis: "compact",
    featuredOnHome: false,
    order: 80,
  },
  {
    name: "Guesthouse Theth",
    discipline: "hospitality",
    categoryEn: "Hospitality",
    categoryAl: "Hoteleri",
    location: "Theth",
    year: 2025,
    status: "design",
    signatureMark: "b3",
    rooms: ["living", "bath", "terrace"],
    emphasis: "compact",
    featuredOnHome: true,
    order: 90,
  },
  {
    name: "Guesthouse Dhërmi",
    discipline: "hospitality",
    categoryEn: "Hospitality",
    categoryAl: "Hoteleri",
    location: "Dhërmi",
    year: 2026,
    status: "design",
    signatureMark: "d3",
    rooms: [],
    emphasis: "compact",
    featuredOnHome: false,
    order: 100,
  },
];

async function run() {
  console.log("Seeding site settings...");
  await client.createOrReplace(siteSettings);

  for (const room of rooms) {
    console.log(`Seeding room type: ${room.slug}`);
    await client.createOrReplace({
      _id: `roomType-${room.slug}`,
      _type: "roomType",
      ...room,
    });
  }

  for (const project of projects) {
    const existing = await client.fetch(
      `*[_type == "project" && name == $name][0]._id`,
      { name: project.name }
    );
    if (existing) {
      console.log(`Updating project: ${project.name}`);
      await client.patch(existing).set(project).commit();
    } else {
      console.log(`Creating project: ${project.name}`);
      await client.create({ _type: "project", ...project });
    }
  }

  console.log("Done.");
}

run().catch((err) => {
  console.error("Seed failed:", err.message);
  process.exit(1);
});
