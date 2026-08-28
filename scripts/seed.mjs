// One-off content seed using the real copy from source_design/, plus
// placeholder renders/floor-plans so the new project detail page (gallery,
// floor plan, room links) can be tested before real photography exists.
//
// Usage: SANITY_WRITE_TOKEN=... node scripts/seed.mjs
// Requires an Editor-permission token from sanity.io/manage. Never commit
// the token; this script only reads it from the environment.
import zlib from "node:zlib";
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

// --- Minimal dependency-free solid-color PNG generator, for placeholder
// renders/floor-plans only. Real photography replaces these in Studio.
const CRC_TABLE = (() => {
  const table = [];
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c;
  }
  return table;
})();

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) crc = CRC_TABLE[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function pngChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, "ascii");
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crc]);
}

function solidPng(width, height, [r, g, b]) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // bit depth
  ihdrData[9] = 2; // color type: RGB
  const ihdr = pngChunk("IHDR", ihdrData);

  const rowSize = 1 + width * 3;
  const raw = Buffer.alloc(rowSize * height);
  for (let y = 0; y < height; y++) {
    const rowStart = y * rowSize;
    raw[rowStart] = 0; // filter: none
    for (let x = 0; x < width; x++) {
      const px = rowStart + 1 + x * 3;
      raw[px] = r;
      raw[px + 1] = g;
      raw[px + 2] = b;
    }
  }
  const idat = pngChunk("IDAT", zlib.deflateSync(raw));
  const iend = pngChunk("IEND", Buffer.alloc(0));
  return Buffer.concat([sig, ihdr, idat, iend]);
}

async function uploadPlaceholder(filename, width, height, color) {
  const png = solidPng(width, height, color);
  const asset = await client.assets.upload("image", png, { filename });
  return { _type: "image", asset: { _type: "reference", _ref: asset._id } };
}

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
// the ridge") that don't exist in this catalogue. `slug`/`descriptionEn`/
// `descriptionAl`/`area` are new; `renderImages`/`floorPlanImage` are filled
// in with placeholder assets below (real photography doesn't exist yet).
const projects = [
  {
    name: "Villa Dajti",
    slug: "villa-dajti",
    discipline: "architecture",
    categoryEn: "Residential",
    categoryAl: "Banim",
    location: "Tirana",
    year: 2026,
    status: "construction",
    area: 320,
    descriptionEn:
      "A family house reworked around a single long window that follows the slope of Mount Dajti. We kept the original stone base and rebuilt everything above it in walnut and plaster, room by room, to preserve how the light moves through the day.",
    descriptionAl:
      "Një shtëpi familjare e ripunuar rreth një dritareje të gjatë që ndjek shpatin e malit të Dajtit. Ruajtëm bazën origjinale prej guri dhe rindërtuam gjithçka sipër me arrë dhe suva, dhomë pas dhome, për të ruajtur mënyrën si lëviz drita gjatë ditës.",
    signatureMark: "a1",
    rooms: ["living", "kitchen", "bedroom", "bath", "entrance", "terrace"],
    emphasis: "feature",
    featuredOnHome: true,
    order: 10,
    renderImageCount: 4,
  },
  {
    name: "Villa Lalzit",
    slug: "villa-lalzit",
    discipline: "architecture",
    categoryEn: "New build",
    categoryAl: "Ndërtim i ri",
    location: "Lalzi Bay",
    year: 2026,
    status: "design",
    area: 280,
    descriptionEn:
      "A new house on the coast, still in design, built low and long to stay below the tree line. The plan opens toward the water on one side and closes to a quiet courtyard on the other.",
    descriptionAl:
      "Një shtëpi e re në bregdet, ende në projektim, e ndërtuar ulët dhe e gjatë për të qëndruar nën vijën e pemëve. Plani hapet nga njëra anë drejt ujit dhe mbyllet nga ana tjetër drejt një oborri të qetë.",
    signatureMark: "d2",
    rooms: ["kitchen", "bedroom", "terrace"],
    emphasis: "medium",
    featuredOnHome: false,
    order: 20,
  },
  {
    name: "Studio Verdhë",
    slug: "studio-verdhe",
    discipline: "architecture",
    categoryEn: "Workspace",
    categoryAl: "Zyra",
    location: "Tirana",
    year: 2025,
    status: "construction",
    area: 140,
    descriptionEn:
      "A small studio building for a design collective, under construction. Concrete frame, generous glazing, and a shared entrance hall meant to double as an informal gallery.",
    descriptionAl:
      "Një ndërtesë e vogël studioje për një kolektiv dizajni, në ndërtim e sipër. Skelet betoni, xhama të gjerë, dhe një hyrje e përbashkët e menduar edhe si galeri joformale.",
    signatureMark: "d1",
    rooms: ["living", "entrance"],
    emphasis: "compact",
    featuredOnHome: true,
    order: 30,
  },
  {
    name: "Apartament Rugova",
    slug: "apartament-rugova",
    discipline: "interiors",
    categoryEn: "Interior",
    categoryAl: "Interier",
    location: "Tirana",
    year: 2026,
    status: "built",
    area: 95,
    descriptionEn:
      "A full interior renovation of a mid-century apartment near Rruga Ibrahim Rugova. We opened the kitchen into the living room and rebuilt the bathroom in travertine and green tile.",
    descriptionAl:
      "Rikonstruksion i plotë i brendshëm i një apartamenti të mesit të shekullit pranë Rrugës Ibrahim Rugova. Hapëm kuzhinën drejt ambientit të ndenjes dhe rindërtuam banjën me travertin dhe pllakë të gjelbër.",
    signatureMark: "a2",
    rooms: ["kitchen", "bedroom", "bath"],
    emphasis: "medium",
    featuredOnHome: true,
    order: 40,
  },
  {
    name: "Loft Ndroq",
    slug: "loft-ndroq",
    discipline: "interiors",
    categoryEn: "Interior",
    categoryAl: "Interier",
    location: "Tirana",
    year: 2025,
    status: "built",
    area: 110,
    descriptionEn:
      "A single open-plan loft carved out of a former workshop space. Walnut joinery marks the boundary between living and sleeping without a single wall.",
    descriptionAl:
      "Një loft me plan të hapur, i formuar brenda një hapësire ish-punishteje. Punimet prej arre shënojnë kufirin mes ambientit të ndenjes dhe atij të gjumit pa asnjë mur.",
    signatureMark: "c1",
    rooms: ["living"],
    emphasis: "compact",
    featuredOnHome: true,
    order: 50,
  },
  {
    name: "Apartament Fresku",
    slug: "apartament-fresku",
    discipline: "interiors",
    categoryEn: "Interior",
    categoryAl: "Interier",
    location: "Tirana",
    year: 2026,
    status: "construction",
    area: 78,
    descriptionEn:
      "A compact apartment reorganized around one long kitchen counter, currently under construction. Every room borrows light from the next.",
    descriptionAl:
      "Një apartament kompakt i riorganizuar rreth një banaku të gjatë kuzhine, aktualisht në ndërtim. Çdo dhomë huazon dritë nga dhoma tjetër.",
    signatureMark: "c3",
    rooms: ["kitchen", "bath"],
    emphasis: "medium",
    featuredOnHome: false,
    order: 60,
  },
  {
    name: "Kafe Bianco",
    slug: "kafe-bianco",
    discipline: "hospitality",
    categoryEn: "Hospitality",
    categoryAl: "Hoteleri",
    location: "Durrës",
    year: 2026,
    status: "built",
    area: 85,
    descriptionEn:
      "A café on the Durrës seafront, built in white plaster and brass. The entrance sequence was designed first — everything else followed from how it feels to walk in.",
    descriptionAl:
      "Një kafene në bregdetin e Durrësit, e ndërtuar me suva të bardhë dhe bronz. Sekuenca e hyrjes u projektua e para — gjithçka tjetër erdhi nga ndjesia e të hyrit brenda.",
    signatureMark: "a3",
    rooms: ["entrance"],
    emphasis: "feature",
    featuredOnHome: true,
    order: 70,
  },
  {
    name: "Bar Kripa",
    slug: "bar-kripa",
    discipline: "hospitality",
    categoryEn: "Hospitality",
    categoryAl: "Hoteleri",
    location: "Tirana",
    year: 2025,
    status: "built",
    area: 45,
    descriptionEn:
      "A small bar built into a narrow storefront, finished in dark timber and warm brass fittings. Seats twelve, but rarely feels crowded.",
    descriptionAl:
      "Një bar i vogël i ndërtuar brenda një dyqani të ngushtë, i përfunduar me dru të errët dhe elemente bronzi të ngrohtë. Ka vend për dymbëdhjetë veta, por rrallë ndihet i mbushur.",
    signatureMark: "c2",
    rooms: [],
    emphasis: "compact",
    featuredOnHome: false,
    order: 80,
  },
  {
    name: "Guesthouse Theth",
    slug: "guesthouse-theth",
    discipline: "hospitality",
    categoryEn: "Hospitality",
    categoryAl: "Hoteleri",
    location: "Theth",
    year: 2025,
    status: "design",
    area: 60,
    descriptionEn:
      "A small guesthouse in the Theth valley, still in design. Stone walls and timber roofs, sized to disappear into the surrounding farmhouses rather than stand apart from them.",
    descriptionAl:
      "Një guesthouse i vogël në luginën e Thethit, ende në projektim. Mure guri dhe çati druri, të matura për t'u shkrirë me shtëpitë përreth në vend që të dallohen prej tyre.",
    signatureMark: "b3",
    rooms: ["living", "bath", "terrace"],
    emphasis: "medium",
    featuredOnHome: true,
    order: 90,
  },
  {
    name: "Guesthouse Dhërmi",
    slug: "guesthouse-dhermi",
    discipline: "hospitality",
    categoryEn: "Hospitality",
    categoryAl: "Hoteleri",
    location: "Dhërmi",
    year: 2026,
    status: "design",
    area: 70,
    descriptionEn:
      "A cluster of small guest rooms above Dhërmi, still in design, terraced down the hillside toward the sea. Each room gets its own private outdoor space.",
    descriptionAl:
      "Një grup dhomash të vogla mikpritëse mbi Dhërmi, ende në projektim, të shkallëzuara poshtë kodrës drejt detit. Çdo dhomë ka hapësirën e vet private jashtë.",
    signatureMark: "d3",
    rooms: [],
    emphasis: "compact",
    featuredOnHome: false,
    order: 100,
  },
];

async function run() {
  console.log("Uploading placeholder images...");
  const renderTones = [
    await uploadPlaceholder("placeholder-render-1.png", 1200, 900, [58, 51, 43]),
    await uploadPlaceholder("placeholder-render-2.png", 1200, 900, [90, 74, 52]),
    await uploadPlaceholder("placeholder-render-3.png", 1200, 900, [42, 46, 40]),
    await uploadPlaceholder("placeholder-render-4.png", 1200, 900, [110, 92, 66]),
  ];
  const floorPlanPlaceholder = await uploadPlaceholder(
    "placeholder-floor-plan.png",
    1400,
    1000,
    [237, 231, 218]
  );

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

  for (const { renderImageCount, ...project } of projects) {
    const doc = {
      ...project,
      slug: { _type: "slug", current: project.slug },
      coverImage: renderTones[0],
      floorPlanImage: floorPlanPlaceholder,
      renderImages: renderTones.slice(0, renderImageCount ?? 3),
    };

    const existing = await client.fetch(
      `*[_type == "project" && name == $name][0]._id`,
      { name: project.name }
    );
    if (existing) {
      console.log(`Updating project: ${project.name}`);
      await client.patch(existing).set(doc).commit();
    } else {
      console.log(`Creating project: ${project.name}`);
      await client.create({ _type: "project", ...doc });
    }
  }

  console.log("Done.");
}

run().catch((err) => {
  console.error("Seed failed:", err.message);
  process.exit(1);
});
