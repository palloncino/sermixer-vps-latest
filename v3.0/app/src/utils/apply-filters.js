/**
 * Filters an array of items based on filter criteria, searching across specific item properties or all properties.
 * @param {Array} items - The array of items to filter.
 * @param {Object} filters - An object representing the current filter state.
 * @returns {Array} - The filtered array of items.
 */
const applyFilters = (products, filters) => {
  return products.filter(product => {
    // Search filter
    if (filters.search && !product.name.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }

    // Category filter
    if (filters.category && filters.category !== 'all' && product.category !== filters.category) {
      return false;
    }

    // Company filter
    if (filters.company && filters.company !== 'all' && product.company !== filters.company) {
      return false;
    }

    // Price range filter
    if (filters.priceRange) {
      let min, max;
      if (Array.isArray(filters.priceRange)) {
        [min, max] = filters.priceRange;
      } else if (typeof filters.priceRange === 'number') {
        min = 0;
        max = filters.priceRange;
      } else {
        // If it's neither an array nor a number, skip this filter
        return true;
      }
      if (product.price < min || product.price > max) {
        return false;
      }
    }

    return true;
  });
};

export default applyFilters;

