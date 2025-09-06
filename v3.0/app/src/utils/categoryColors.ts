// Category color mapping for consistent styling across the application

export const CATEGORY_COLORS = {
  'Vasche': {
    background: '#e3f2fd',
    color: '#1565c0',
    border: '#bbdefb'
  },
  'CIFA': {
    background: '#f3e5f5',
    color: '#7b1fa2',
    border: '#e1bee7'
  },
  'TELAI': {
    background: '#e8f5e8',
    color: '#2e7d32',
    border: '#c8e6c9'
  },
  'INTERCAMBIABILE': {
    background: '#fff3e0',
    color: '#ef6c00',
    border: '#ffcc02'
  },
  'GANCIO_SCARRABILE': {
    background: '#fce4ec',
    color: '#c2185b',
    border: '#f8bbd9'
  },
  'GRU': {
    background: '#e0f2f1',
    color: '#00695c',
    border: '#b2dfdb'
  },
  'CARICATORE_FORESTALE': {
    background: '#f1f8e9',
    color: '#558b2f',
    border: '#dcedc8'
  },
  'PIANALE_TRASPORTO_MACCHINE': {
    background: '#e8eaf6',
    color: '#3f51b5',
    border: '#c5cae9'
  },
  'CASSONE': {
    background: '#fff8e1',
    color: '#f57c00',
    border: '#ffecb3'
  },
  'LAVORAZIONI_VARIE': {
    background: '#f5f5f5',
    color: '#424242',
    border: '#e0e0e0'
  }
} as const;

export type CategoryKey = keyof typeof CATEGORY_COLORS;

export const getCategoryColor = (category: string) => {
  const normalizedCategory = category.toUpperCase();
  
  // Find matching category (case-insensitive)
  const categoryKey = Object.keys(CATEGORY_COLORS).find(
    key => key.toUpperCase() === normalizedCategory
  ) as CategoryKey;
  
  if (categoryKey && CATEGORY_COLORS[categoryKey]) {
    return CATEGORY_COLORS[categoryKey];
  }
  
  // Default color for unknown categories
  return {
    background: '#f5f5f5',
    color: '#666666',
    border: '#e0e0e0'
  };
};

export const getCategoryDisplayName = (category: string) => {
  const categoryMap: Record<string, string> = {
    'Vasche': 'Vasca',
    'CIFA': 'CIFA',
    'TELAI': 'Telai',
    'INTERCAMBIABILE': 'Intercambiabile',
    'GANCIO_SCARRABILE': 'Gancio Scorrevole',
    'GRU': 'Gru',
    'CARICATORE_FORESTALE': 'Caricatore Forestale',
    'PIANALE_TRASPORTO_MACCHINE': 'Pianale Trasporto',
    'CASSONE': 'Cassone',
    'LAVORAZIONI_VARIE': 'Lavorazioni Varie'
  };
  
  return categoryMap[category] || category;
};
