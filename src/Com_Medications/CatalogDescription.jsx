import { data1 } from "../data/data1";
import { catalogById } from "../data/catalogDescriptions";
import { useI18n } from "../i18n/LanguageProvider";

const seedById = new Map(data1.map((product) => [product.id, product]));

export default function CatalogDescription({ product, field = "shortDescription" }) {
  const { t } = useI18n();
  const seed = seedById.get(product.id);
  const description = product[field];

  // Keep dashboard-authored copy separate from the curated seed descriptions.
  if (!seed || (description?.trim() && seed[field] !== description)) {
    return description?.trim() ? <bdi>{description}</bdi> : null;
  }

  const unavailable = `catalog.unavailable.${field}`;
  const key = `catalog.${catalogById.get(product.id)?.profile ?? "unavailable"}.${field}`;
  const localized = t(key, [], { fallbackToEnglish: false });
  return localized === key ? t(unavailable) : localized;
}
