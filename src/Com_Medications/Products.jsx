import ProductSearch, { filterProductsByName, useProductSearch } from "./ProductSearch";
import Card from "./card";

import { useSelector } from 'react-redux';
import {  useState, useMemo } from "react";
import { FiFilter, FiX } from "react-icons/fi";
import NavShop from './NavShop';
import Footer from '../components/Footer';

export default function Products() {

  const products = useSelector(state => state.fullData);
  const [category, setCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useProductSearch();

  const filteredProducts = useMemo(() => {
    const categoryProducts = category === 'all'
      ? products
      : products.filter(product => product.category === category);
    return filterProductsByName(categoryProducts, searchTerm);
  }, [products, category, searchTerm]);

  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(products.map(item => item.category))];
    return ['all', ...uniqueCategories];
  }, [products]);

  const handleClearFilters = () => {
    setCategory('all');
    setSearchTerm('');
  };

  return (
    <div>
      <NavShop />
      
      <div className="products-container">
        <div className="filter-section">
          <ProductSearch query={searchTerm} onChange={setSearchTerm} />

          <div className="categories-card">
            <div className="categories-header">
              <FiFilter className="filter-icon" />
              <h3>Filter Products</h3>
              {(category !== 'all' || searchTerm) && (
                <button onClick={handleClearFilters} className="clear-filters">
                  Clear all
                </button>
              )}
            </div>
            
            <div className="filter-controls">
              <div className="filter-group">
                <label htmlFor="category-filter">Category</label>
                <select
                  id="category-filter"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="category-select"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>
                      {cat === 'all' ? 'All Categories' : cat.split(/(?=[A-Z])/).join(' ')}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {(category !== 'all' || searchTerm) && (
              <div className="active-filters">
                {category !== 'all' && (
                  <span className="active-filter">
                    Category: {category}
                    <button type="button" aria-label="Clear category filter" onClick={() => setCategory('all')}>
                      <FiX size={12} />
                    </button>
                  </span>
                )}
                {searchTerm && (
                  <span className="active-filter">
                    Search: "{searchTerm}"
                    <button type="button" aria-label="Remove search filter" onClick={() => setSearchTerm('')}>
                      <FiX size={12} aria-hidden="true" />
                    </button>
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
        
        <div className="results-summary" role="status">
          <p>
            Showing {filteredProducts.length} of {products.length} products
            {(category !== 'all' || searchTerm) && (
              <>
                {' '}matching{' '}
                {category !== 'all' && <span>category "{category}"</span>}
                {category !== 'all' && searchTerm && <span> and </span>}
                {searchTerm && <span>search term "{searchTerm}"</span>}
              </>
            )}
          </p>
        </div>
        
        <div className="cards-grid-container2">
          {filteredProducts.length > 0 ? (
            <Card medications={filteredProducts} />
          ) : (
            <div className="no-results">
              <h3>No products found</h3>
              <p>Try adjusting your search or filter criteria</p>
              <button type="button" className="clear-filters" onClick={handleClearFilters}>
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
        <Footer/>
    </div>
  );
}