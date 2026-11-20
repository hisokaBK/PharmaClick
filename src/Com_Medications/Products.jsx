import Card from './card';
import '../css/products.css';

import { useSelector } from 'react-redux';
import {  useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { FiSearch, FiFilter, FiX } from "react-icons/fi";
import NavShop from './NavShop';
import Footer from '../components/Footer';

export default function Products() {

  const fullMedicat=useSelector(state=>state.fullData);
  const location = useLocation();
  const [category, setCategory] = useState('all');
  const [products] = useState(fullMedicat);
  
  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const searchTerm = searchParams.get('search') || '';

  const filteredProducts = useMemo(() => {
    let result = products;
    
    if (category !== 'all') {
      result = result.filter(product => product.category === category);
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(product => 
        product.title.toLowerCase().includes(term) ||
        (product.shortDescription && product.shortDescription.toLowerCase().includes(term)) ||
        (product.longDescription && product.longDescription.toLowerCase().includes(term))
      );
    }
    
    return result;
  }, [products, category, searchTerm]);

  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(products.map(item => item.category))];
    return ['all', ...uniqueCategories];
  }, [products]);

  const handleClearFilters = () => {
    setCategory('all');
  };

  return (
    <div>
      <NavShop />
      
      <div className="products-container">
        <div className="filter-section">
          <div className="search-card">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search in products..."
              value={searchTerm}
              readOnly
              className="search-input"
            />
            {searchTerm && (
              <a href="/products" className="clear-search">
                <FiX />
              </a>
            )}
          </div>

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
                    <button onClick={() => setCategory('all')}>
                      <FiX size={12} />
                    </button>
                  </span>
                )}
                {searchTerm && (
                  <span className="active-filter">
                    Search: "{searchTerm}"
                    <a href="/products" className="clear-filter-link">
                      <FiX size={12} />
                    </a>
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
        
        <div className="results-summary">
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
              <a href="/products" className="btn-primary">
                Clear all filters
              </a>
            </div>
          )}
        </div>
      </div>
        <Footer/>
    </div>
  );
}