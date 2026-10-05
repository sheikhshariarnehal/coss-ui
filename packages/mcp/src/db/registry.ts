import rawData from "./bundled-registry.json" with { type: "json" };
import type { RegistryDatabase, ComponentItem, ParticleExampleItem, UtilityItem } from "../types.js";

export const db = rawData as unknown as RegistryDatabase;

export const componentsMap = new Map<string, ComponentItem>();
for (const comp of db.components) {
  componentsMap.set(comp.slug.toLowerCase(), comp);
}

export const examplesMap = new Map<string, ParticleExampleItem>();
for (const ex of db.particleExamples) {
  examplesMap.set(ex.id.toLowerCase(), ex);
}

export const utilitiesMap = new Map<string, UtilityItem>();
for (const util of db.utilities) {
  utilitiesMap.set(util.name.toLowerCase(), util);
}
