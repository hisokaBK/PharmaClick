import { useRef } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import { useSearchParams } from "react-router-dom";
import Card from "./card";
import "../css/products.css";
import { useI18n } from "../i18n/LanguageProvider";

export function useProductSearch() {
  const [params, setParams] = useSearchParams();
  const query = params.get("search") || "";

  const setQuery = (value) => {
    const next = new URLSearchParams(params);
    if (value) next.set("search", value);
    else next.delete("search");
    setParams(next, { replace: true });
  };

  return [query, setQuery];
}

export function filterProductsByName(products, query) {
  const term = query.trim().toLowerCase();
  return term ? products.filter(({ title }) => title.toLowerCase().includes(term)) : products;
}

export default function ProductSearch({ query, onChange }) {
  const { t } = useI18n();
  const input = useRef(null);

  return (
    <div className="search-card" role="search" aria-label={t("Product catalog")}>
      <FiSearch className="search-icon" aria-hidden="true" />
      <input
        ref={input}
        type="search"
        aria-label={t("Search products by name")}
        placeholder={t("Search products by name")}
        value={query}
        onChange={(event) => onChange(event.target.value)}
        className="search-input"
      />
      {query && (
        <button type="button" className="clear-search" aria-label={t("Clear product search")} onClick={() => {
          onChange("");
          input.current.focus();
        }}>
          <FiX aria-hidden="true" />
        </button>
      )}
    </div>
  );
}

export function ProductSearchResults({ products, query }) {
  const { t } = useI18n();
  return (
    <>
      <p className="results-summary" role="status">
        {products.length ? t("{0} products found", [products.length]) : t("No products found")}
      </p>
      {products.length ? (
        <div className="cards-grid-container2"><Card medications={products} /></div>
      ) : (
        <p className="no-results">{query.trim() ? t("Try a different product name or clear your search.") : t("No products are available in this selection.")}</p>
      )}
    </>
  );
}

export function SearchableProductList({ products }) {
  const [query, setQuery] = useProductSearch();

  return (
    <main className="products-container product-search-list">
      <ProductSearch query={query} onChange={setQuery} />
      <ProductSearchResults products={filterProductsByName(products, query)} query={query} />
    </main>
  );
}
