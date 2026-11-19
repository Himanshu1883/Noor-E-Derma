import type { MoleculeKind } from "@/components/Molecule"

export type Ingredient = {
  id: MoleculeKind
  name: string
  aka: string
  benefit: string
  detail: string
  foundIn: string[]
}

export const ingredients: Ingredient[] = [
  {
    id: "niacinamide",
    name: "Niacinamide",
    aka: "Vitamin B3",
    benefit: "The steady all-rounder in Daily Detox.",
    detail: "A water-soluble form of vitamin B3, listed as a key active on the Daily Detox Face Wash pack.",
    foundIn: ["Daily Detox"],
  },
  {
    id: "bha",
    name: "BHA",
    aka: "Beta hydroxy acid",
    benefit: "The deep-cleanse partner in Daily Detox.",
    detail: "An oil-soluble hydroxy acid, listed on pack alongside niacinamide for a deep daily cleanse.",
    foundIn: ["Daily Detox"],
  },
  {
    id: "glutathione",
    name: "Glutathione",
    aka: "Tripeptide",
    benefit: "The glow-hero in Tan Eraser.",
    detail: "A tripeptide made of three amino acids, paired with kojic acid on the Tan Eraser pack.",
    foundIn: ["Tan Eraser"],
  },
  {
    id: "kojic",
    name: "Kojic Acid",
    aka: "Fermentation-derived",
    benefit: "Glutathione's partner for even-looking tone.",
    detail: "Produced by fungi during fermentation; the second named active on the Tan Eraser pack.",
    foundIn: ["Tan Eraser"],
  },
  {
    id: "vitamin-e",
    name: "Vitamin E",
    aka: "Tocopherol",
    benefit: "A nourishing key active in Daily Detox.",
    detail: "A fat-soluble vitamin, listed on the Daily Detox pack as a key active.",
    foundIn: ["Daily Detox"],
  },
  {
    id: "aloe",
    name: "Aloe Vera",
    aka: "Plant gel",
    benefit: "The botanical heart of Daily Detox.",
    detail: "The gel from aloe leaves, listed on the Daily Detox pack as a key active.",
    foundIn: ["Daily Detox"],
  },
]
