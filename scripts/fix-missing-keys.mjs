// One-off migration: array items written by scripts/seed.mjs went straight
// through the raw create/patch API, bypassing the Studio's auto-generated
// _key on each item. Sanity requires every array-of-object item to have a
// unique _key to track identity across edits/reorders — without one, Studio
// refuses to let you edit or reorder that array ("Missing keys" error).
//
// Only project.renderImages and roomType.gallery are array-of-image fields
// (project.rooms is a plain string array, which never needs _key).
//
// Patches only the missing `_key` sub-field at each affected index — every
// other field (asset ref, hotspot, etc.) is left untouched.
//
// Usage: SANITY_WRITE_TOKEN=... node scripts/fix-missing-keys.mjs
import { randomBytes } from "node:crypto";
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

function generateKey() {
  return randomBytes(6).toString("hex");
}

async function fixArrayKeys(docId, fieldName, items) {
  if (!Array.isArray(items) || items.length === 0) return 0;

  const patch = {};
  let fixed = 0;
  items.forEach((item, i) => {
    if (!item || typeof item !== "object" || item._key) return;
    patch[`${fieldName}[${i}]._key`] = generateKey();
    fixed++;
  });

  if (fixed > 0) {
    await client.patch(docId).set(patch).commit();
  }
  return fixed;
}

async function run() {
  let totalFixed = 0;

  console.log("Checking project.renderImages...");
  const projects = await client.fetch(
    `*[_type == "project"]{ _id, name, renderImages }`
  );
  for (const project of projects) {
    const fixed = await fixArrayKeys(project._id, "renderImages", project.renderImages);
    if (fixed > 0) {
      console.log(`  Fixed ${fixed} missing key(s) on "${project.name}"`);
      totalFixed += fixed;
    }
  }

  console.log("Checking roomType.gallery...");
  const rooms = await client.fetch(`*[_type == "roomType"]{ _id, slug, gallery }`);
  for (const room of rooms) {
    const fixed = await fixArrayKeys(room._id, "gallery", room.gallery);
    if (fixed > 0) {
      console.log(`  Fixed ${fixed} missing key(s) on roomType "${room.slug}"`);
      totalFixed += fixed;
    }
  }

  console.log(`Done. ${totalFixed} missing key(s) fixed in total.`);
}

run().catch((err) => {
  console.error("Migration failed:", err.message);
  process.exit(1);
});
