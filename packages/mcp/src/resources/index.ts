import { db, componentsMap, examplesMap, utilitiesMap } from "../db/registry.js";

export const RESOURCE_TEMPLATES = [
  {
    uriTemplate: "coss://components/{slug}",
    name: "Coss UI Component Source",
    description: "Get the full source code and metadata of a specific Coss UI component by slug",
    mimeType: "text/typescript"
  },
  {
    uriTemplate: "coss://examples/{id}",
    name: "Coss UI Particle Example Source",
    description: "Get the implementation code for a specific Coss UI particle variation",
    mimeType: "text/typescript"
  }
];

export const STATIC_RESOURCES = [
  {
    uri: "coss://categories",
    name: "Coss UI Categories Index",
    description: "Overview of all component categories with counts",
    mimeType: "application/json"
  },
  {
    uri: "coss://components",
    name: "Coss UI Components Index",
    description: "Overview of all 70 components with titles and example counts",
    mimeType: "application/json"
  },
  {
    uri: "coss://utils/cn",
    name: "Coss UI cn Helper Utility",
    description: "Standard clsx and tailwind-merge helper function",
    mimeType: "text/typescript"
  }
];

export function handleReadResource(uri: string) {
  if (uri === "coss://categories") {
    return {
      contents: [
        {
          uri,
          mimeType: "application/json",
          text: JSON.stringify(db.categories, null, 2)
        }
      ]
    };
  }

  if (uri === "coss://components") {
    const list = db.components.map(c => ({
      slug: c.slug,
      title: c.title,
      category: c.category,
      description: c.description,
      examplesCount: c.examplesCount,
      tags: c.tags
    }));
    return {
      contents: [
        {
          uri,
          mimeType: "application/json",
          text: JSON.stringify(list, null, 2)
        }
      ]
    };
  }

  if (uri === "coss://utils/cn") {
    const util = utilitiesMap.get("utils");
    return {
      contents: [
        {
          uri,
          mimeType: "text/typescript",
          text: util ? util.code : ""
        }
      ]
    };
  }

  const compMatch = uri.match(/^coss:\/\/components\/([a-z0-9-]+)$/i);
  if (compMatch) {
    const slug = compMatch[1].toLowerCase();
    const comp = componentsMap.get(slug);
    if (!comp) {
      throw new Error(`Component resource not found: ${uri}`);
    }
    return {
      contents: [
        {
          uri,
          mimeType: "text/typescript",
          text: comp.code
        }
      ]
    };
  }

  const exMatch = uri.match(/^coss:\/\/examples\/([a-z0-9-]+)$/i);
  if (exMatch) {
    const id = exMatch[1].toLowerCase();
    const ex = examplesMap.get(id);
    if (!ex) {
      throw new Error(`Particle example resource not found: ${uri}`);
    }
    return {
      contents: [
        {
          uri,
          mimeType: "text/typescript",
          text: ex.code
        }
      ]
    };
  }

  throw new Error(`Resource not found for URI: ${uri}`);
}
