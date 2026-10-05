export interface ComponentItem {
  slug: string;
  title: string;
  description: string;
  category: string;
  hasCode: boolean;
  code: string;
  dependencies: string[];
  registryDependencies: string[];
  npmInstallCmd: string;
  needsUtils: boolean;
  hooksNeeded: string[];
  examplesCount: number;
  exampleIds: string[];
  tags: string[];
  readme: string;
}

export interface ParticleExampleItem {
  id: string;
  componentSlug: string;
  title: string;
  filename: string;
  code: string;
  dependencies: string[];
  registryDependencies: string[];
  tags: string[];
}

export interface CategorySummary {
  name: string;
  componentCount: number;
  exampleCount: number;
  components: Array<{
    slug: string;
    title: string;
    examplesCount: number;
  }>;
}

export interface UtilityItem {
  name: string;
  path: string;
  description: string;
  code: string;
  dependencies: string[];
  npmInstallCmd: string;
}

export interface RegistryDatabase {
  version: string;
  generatedAt: string;
  stats: {
    totalComponents: number;
    totalExamples: number;
    totalCategories: number;
    totalUtilities: number;
  };
  categories: CategorySummary[];
  components: ComponentItem[];
  particleExamples: ParticleExampleItem[];
  utilities: UtilityItem[];
}

export interface SearchResult {
  type: "component" | "example";
  slug: string;
  id?: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  score: number;
  matchReason?: string;
}
