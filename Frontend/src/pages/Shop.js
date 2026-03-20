import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../utils/api';
import ProductCard from '../components/ui/ProductCard';
import './Shop.css';

const CATEGORIES = ['Electronics','Clothing','Home & Garden','Sports','Books','Beauty','Toys','Automotive','Other'];
const SORT_OPTIONS = [
  { value: '-createdAt', label: 'Newest' },
  { value: 'price',      label: 'Price: Low to High' },
  { value: '-price',     label: 'Price: High to Low' },
  { value: '-ratings.average', label: 'Top Rated' },
];

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, pages: 1 });
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    search:   searchParams.get('search')   || '',
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sort:     searchParams.get('sort')     || '-createdAt',
    page:     Number(searchParams.get('page')) || 1,
    inStock:  searchParams.get('inStock')  === 'true',
    featured: searchParams.get('featured') === 'true',
  });
  const [searchInput, setSearchInput] = useState(filters.search);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([k, v]) => { if (v !== '' && v !== false) params.set(k, v); });
      params.set('limit', '12');
      const res = await api.get(`/products?${params}`);
      setProducts(res.data.products);
      setPagination(res.data.pagination);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const updateFilter = (key, value) => {
    setFilters(f => ({ ...f, [key]: value, page: 1 }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    updateFilter('search', searchInput);
  };

  const clearFilters = () => {
    setFilters({ search: '', category: '', minPrice: '', maxPrice: '', sort: '-createdAt', page: 1, inStock: false, featured: false });
    setSearchInput('');
  };

  const activeFilterCount = [filters.category, filters.minPrice, filters.maxPrice, filters.inStock, filters.featured].filter(Boolean).length;

  return (
    <div className="shop-page">
      <div className="container">
        <div className="shop-header">
          <div>
            <h1>Shop</h1>
            <p>{pagination.total} products</p>
          </div>
          <div className="shop-header-right">
            <form onSubmit={handleSearch} className="search-form">
              <input
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                placeholder="Search products…"
              />
              <button type="submit">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
              </button>
            </form>
            <select value={filters.sort} onChange={e => updateFilter('sort', e.target.value)} className="sort-select">
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <button className="filter-toggle btn btn-outline btn-sm" onClick={() => setSidebarOpen(!sidebarOpen)}>
              Filters {activeFilterCount > 0 && <span className="filter-count">{activeFilterCount}</span>}
            </button>
          </div>
        </div>

        <div className="shop-layout">
          {/* Sidebar */}
          <aside className={`shop-sidebar${sidebarOpen ? ' open' : ''}`}>
            <div className="sidebar-header">
              <h3>Filters</h3>
              {activeFilterCount > 0 && <button onClick={clearFilters} className="clear-btn">Clear all</button>}
            </div>

            <div className="filter-group">
              <h4>Category</h4>
              <div className="filter-options">
                <label className={`filter-option${!filters.category ? ' active' : ''}`}>
                  <input type="radio" name="category" value="" checked={!filters.category}
                    onChange={() => updateFilter('category', '')} /> All
                </label>
                {CATEGORIES.map(c => (
                  <label key={c} className={`filter-option${filters.category === c ? ' active' : ''}`}>
                    <input type="radio" name="category" value={c} checked={filters.category === c}
                      onChange={() => updateFilter('category', c)} /> {c}
                  </label>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <h4>Price Range</h4>
              <div className="price-range">
                <input type="number" placeholder="Min $" value={filters.minPrice}
                  onChange={e => updateFilter('minPrice', e.target.value)} min="0" />
                <span>–</span>
                <input type="number" placeholder="Max $" value={filters.maxPrice}
                  onChange={e => updateFilter('maxPrice', e.target.value)} min="0" />
              </div>
            </div>

            <div className="filter-group">
              <h4>Availability</h4>
              <label className="toggle-label">
                <input type="checkbox" checked={filters.inStock}
                  onChange={e => updateFilter('inStock', e.target.checked)} />
                <span>In stock only</span>
              </label>
              <label className="toggle-label">
                <input type="checkbox" checked={filters.featured}
                  onChange={e => updateFilter('featured', e.target.checked)} />
                <span>Featured only</span>
              </label>
            </div>
          </aside>

          {/* Products */}
          <div className="shop-products">
            {loading ? (
              <div className="loading-full"><div className="spinner" /></div>
            ) : products.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🔍</div>
                <h3>No products found</h3>
                <p>Try adjusting your filters</p>
                <button onClick={clearFilters} className="btn btn-outline">Clear filters</button>
              </div>
            ) : (
              <div className="products-grid">
                {products.map((p, i) => (
                  <div key={p._id} className="animate-up" style={{ animationDelay: `${i * 0.04}s` }}>
                    <ProductCard product={p} />
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="pagination">
                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(pg => (
                  <button
                    key={pg}
                    className={`page-btn${filters.page === pg ? ' active' : ''}`}
                    onClick={() => setFilters(f => ({ ...f, page: pg }))}
                  >{pg}</button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
