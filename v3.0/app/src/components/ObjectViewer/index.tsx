import React, { useState } from 'react';
import { Box, Typography, IconButton, Collapse, Avatar, Chip, Divider, useTheme, alpha, Button } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { useNavigate } from 'react-router-dom';
import { formatPrice } from '../../utils/format-price';
import { dateText } from '../../utils/date-text';
import { ProductType, ComponentType } from '../../types';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '../../constants/routes';

interface ObjectViewerProps {
  data: any;
  level?: number;
  compact?: boolean;
}

const ObjectViewer: React.FC<ObjectViewerProps> = ({ data, level = 0, compact = false }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const navigate = useNavigate();

  const toggleExpand = (key: string) => {
    setExpanded(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const renderAddress = (address: any) => {
    if (!address) return <Typography variant="body2" color="text.secondary">No address</Typography>;
    
    const addressParts = [
      address.street,
      address.city,
      address.zipCode,
      address.country
    ].filter(Boolean);

    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        {addressParts.map((part, index) => (
          <Typography key={index} variant="body2" sx={{ color: theme.palette.text.secondary }}>
            {part}
          </Typography>
        ))}
      </Box>
    );
  };

  const renderProduct = (product: ProductType, index: number) => {
    const { name, price, components = [], discount = 0, createdAt, updatedAt } = product;
    const discountedPrice = price - (price * discount) / 100;

    return (
      <Box key={index} sx={{ 
        mb: 2, 
        p: 2.5, 
        border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
        borderRadius: 2,
        backgroundColor: alpha(theme.palette.background.paper, 0.6),
        '&:hover': {
          backgroundColor: alpha(theme.palette.background.paper, 0.8),
          borderColor: alpha(theme.palette.divider, 0.16)
        }
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="subtitle1" fontWeight={600} sx={{ color: theme.palette.text.primary }}>
            {name || `Product ${index + 1}`}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            {product.id && (
              <Button
                size="small"
                variant="outlined"
                onClick={() => navigate(ROUTES.productDetail(product.id.toString()))}
                sx={{ 
                  fontSize: '0.6rem',
                  minWidth: 'auto',
                  px: 0.5,
                  py: 0.25
                }}
              >
                🔗
              </Button>
            )}
            <IconButton 
              size="small" 
              onClick={() => toggleExpand(name || `Product ${index + 1}`)}
              sx={{ 
                color: theme.palette.text.secondary,
                '&:hover': { backgroundColor: alpha(theme.palette.action.hover, 0.1) }
              }}
            >
              {expanded[name || `Product ${index + 1}`] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Box>
        </Box>
        
        <Collapse in={expanded[name || `Product ${index + 1}`]}>
          <Box sx={{ pl: 2, pt: 1 }}>
            <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', mb: 2 }}>
              <Chip 
                label={`Price: ${formatPrice(price)}`} 
                size="small" 
                variant="outlined" 
                sx={{ 
                  backgroundColor: alpha(theme.palette.primary.main, 0.08),
                  borderColor: alpha(theme.palette.primary.main, 0.3),
                  color: theme.palette.primary.main,
                  fontWeight: 500
                }}
              />
              {discount > 0 && (
                <Chip 
                  label={`🏷️ ${discount}% OFF`} 
                  size="small" 
                  color="error" 
                  variant="outlined" 
                  sx={{ fontWeight: 600 }}
                />
              )}
              <Chip 
                label={product.category} 
                size="small" 
                variant="outlined" 
                sx={{ fontWeight: 500 }}
              />
              <Chip 
                label={product.company || 'Unknown'} 
                size="small" 
                variant="outlined" 
                sx={{ fontWeight: 500 }}
              />
            </Box>
            
            {product.description && (
              <Typography variant="body2" sx={{ 
                mb: 2, 
                fontStyle: 'italic', 
                color: theme.palette.text.secondary,
                lineHeight: 1.6
              }}>
                {product.description}
              </Typography>
            )}

            <Box sx={{ 
              display: 'flex', 
              gap: 2, 
              fontSize: '0.75rem', 
              color: theme.palette.text.secondary,
              mb: 2,
              flexWrap: 'wrap'
            }}>
              <span>Created: {createdAt ? dateText(createdAt) : 'N/A'}</span>
              <span>Updated: {updatedAt ? dateText(updatedAt) : 'N/A'}</span>
            </Box>

            {/* Handle Components */}
            {components.length > 0 && (
              <Box mt={2}>
                <Typography variant="subtitle2" fontWeight={600} gutterBottom sx={{ color: theme.palette.text.primary }}>
                  {t('Components')}
                </Typography>
                {components.filter((comp: ComponentType) => comp.included).map((component, compIndex) =>
                  renderComponent(component, compIndex)
                )}
              </Box>
            )}
          </Box>
        </Collapse>
      </Box>
    );
  };

  const renderComponent = (component: ComponentType, index: number) => {
    const { name, price, quantity } = component;
    return (
      <Box key={index} sx={{ 
        ml: 2, 
        mb: 1.5, 
        p: 1.5, 
        backgroundColor: alpha(theme.palette.grey[50], 0.8), 
        borderRadius: 1.5,
        border: `1px solid ${alpha(theme.palette.divider, 0.06)}`
      }}>
        <Typography variant="body2" fontWeight={600} sx={{ color: theme.palette.text.primary, mb: 0.5 }}>
          {name || `Component ${index + 1}`}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, fontSize: '0.75rem', color: theme.palette.text.secondary }}>
          <span>Price: {formatPrice(price)}</span>
          <span>Qty: {quantity}</span>
        </Box>
      </Box>
    );
  };

  const renderArray = (value: any[]) => {
    return (
      <Box>
        {value.map((item, index) => {
          if (item.name) {
            // Assume the top level is a product array
            return renderProduct(item, index);
          }
          return <ObjectViewer data={item} level={level + 1} key={index} compact={compact} />;
        })}
      </Box>
    );
  };

  const renderValue = (key: string, value: any): JSX.Element => {
    if (value === null || value === undefined) {
      return <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>Not set</Typography>;
    }

    if (typeof value === 'boolean') {
      return (
        <Chip 
          label={value ? 'Yes' : 'No'} 
          color={value ? 'success' : 'default'} 
          size="small" 
          variant="outlined"
          sx={{ fontWeight: 500 }}
        />
      );
    }

    if (typeof value === 'number') {
      if (key.toLowerCase().includes('price') || key.toLowerCase().includes('cost')) {
        return (
          <Typography variant="body2" fontWeight={600} color="primary.main">
            {formatPrice(value)}
          </Typography>
        );
      }
      return <Typography variant="body2">{value.toLocaleString()}</Typography>;
    }

    if (typeof value === 'string') {
      // Check if it's a date
      if (key.toLowerCase().includes('date') || key.toLowerCase().includes('at')) {
        try {
          const date = new Date(value);
          if (!isNaN(date.getTime())) {
            return (
              <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                {dateText(value)}
              </Typography>
            );
          }
        } catch (e) {
          // Not a valid date, continue as string
        }
      }
      
      // Check if it's an email
      if (key.toLowerCase().includes('email') && value.includes('@')) {
        return (
          <Typography 
            variant="body2" 
            component="a" 
            href={`mailto:${value}`} 
            sx={{ 
              color: theme.palette.primary.main, 
              textDecoration: 'none',
              '&:hover': { textDecoration: 'underline' }
            }}
          >
            {value}
          </Typography>
        );
      }

      // Check if it's a URL
      if (value.startsWith('http')) {
        return (
          <Typography 
            variant="body2" 
            component="a" 
            href={value} 
            target="_blank" 
            rel="noopener noreferrer" 
            sx={{ 
              color: theme.palette.primary.main, 
              textDecoration: 'none',
              '&:hover': { textDecoration: 'underline' }
            }}
          >
            {value}
          </Typography>
        );
      }

      return <Typography variant="body2">{value}</Typography>;
    }

    if (Array.isArray(value)) {
      return renderArray(value);
    }

    if (typeof value === 'object') {
      // Special handling for address objects
      if (key.toLowerCase().includes('address')) {
        return renderAddress(value);
      }

      return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton 
            size="small" 
            onClick={() => toggleExpand(key)}
            sx={{ 
              color: theme.palette.text.secondary,
              '&:hover': { backgroundColor: alpha(theme.palette.action.hover, 0.1) }
            }}
          >
            {expanded[key] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
          <Collapse in={expanded[key]} sx={{ width: '100%' }}>
            <Box sx={{ pl: 2, pt: 1 }}>
              <ObjectViewer data={value} level={level + 1} compact={compact} />
            </Box>
          </Collapse>
        </Box>
      );
    }

    return <Typography variant="body2">{String(value)}</Typography>;
  };

  if (!data || Object.keys(data).length === 0) {
    return (
      <Box sx={{ 
        textAlign: 'center', 
        py: 4, 
        color: theme.palette.text.secondary,
        fontStyle: 'italic'
      }}>
        {t('NoResult')}
      </Box>
    );
  }

  return (
    <Box sx={{ mb: 2 }}>
      {Object.entries(data).map(([key, value], index) => (
        <Box key={key} sx={{ 
          display: 'flex', 
          borderBottom: index < Object.entries(data).length - 1 ? `1px solid ${alpha(theme.palette.divider, 0.08)}` : 'none', 
          py: compact ? 1 : 1.5,
          '&:hover': { 
            backgroundColor: alpha(theme.palette.action.hover, 0.04),
            borderRadius: 1
          },
          transition: 'background-color 0.2s ease'
        }}>
          <Box sx={{ flexBasis: compact ? '25%' : '30%', pr: 3 }}>
            <Typography 
              variant="subtitle2" 
              fontWeight={500} 
              sx={{ 
                textTransform: 'capitalize',
                color: theme.palette.text.secondary,
                fontSize: '0.875rem'
              }}
            >
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </Typography>
          </Box>
          <Box sx={{ flexBasis: compact ? '75%' : '70%' }}>
            {renderValue(key, value)}
          </Box>
        </Box>
      ))}
    </Box>
  );
};

interface AddedProductsViewerProps {
  products: ProductType[];
}

const AddedProductsViewer: React.FC<AddedProductsViewerProps> = ({ products }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  
  if (!products || products.length === 0) {
    return (
      <Box sx={{ 
        textAlign: 'center', 
        py: 6,
        color: theme.palette.text.secondary,
        fontStyle: 'italic'
      }}>
        <Typography variant="body1">No products added to this document</Typography>
      </Box>
    );
  }

  const renderComponent = (component: ComponentType, index: number) => {
    const { name, price, quantity, included } = component;

    // Skip components that aren't included
    if (!included) return null;

    return (
      <Box key={index} sx={{ 
        ml: 3, 
        mb: 1.5, 
        p: 1.5, 
        backgroundColor: alpha(theme.palette.grey[50], 0.8), 
        borderRadius: 1.5,
        border: `1px solid ${alpha(theme.palette.divider, 0.06)}`
      }}>
        <Typography variant="body2" fontWeight={600} sx={{ color: theme.palette.text.primary, mb: 0.5 }}>
          {name} (x{quantity})
        </Typography>
        <Typography variant="body2" color="primary.main" fontWeight={500}>
          {formatPrice(price)}
        </Typography>
      </Box>
    );
  };

  const renderProduct = (product: ProductType, index: number) => {
    const { name, price, discount = 0, category, description, company, components = [], createdAt, updatedAt } = product;
    const discountedPrice = price - (price * discount) / 100;

    return (
      <Box key={index} sx={{ 
        mb: 3, 
        border: `1px solid ${alpha(theme.palette.divider, 0.08)}`, 
        borderRadius: 3, 
        p: 3,
        backgroundColor: alpha(theme.palette.background.paper, 0.6),
        '&:hover': {
          backgroundColor: alpha(theme.palette.background.paper, 0.8),
          borderColor: alpha(theme.palette.divider, 0.16),
          boxShadow: `0 2px 8px ${alpha(theme.palette.common.black, 0.06)}`
        },
        transition: 'all 0.2s ease'
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2.5 }}>
          <Typography variant="h6" fontWeight={600} sx={{ flex: 1, color: theme.palette.text.primary }}>
            {name}
          </Typography>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="h6" color="primary.main" fontWeight={700}>
              {formatPrice(price)}
            </Typography>
            {discount > 0 && (
              <Typography variant="body2" color="error.main" sx={{ textDecoration: 'line-through' }}>
                {formatPrice(discountedPrice)}
              </Typography>
            )}
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', mb: 2.5 }}>
          <Chip 
            label={category} 
            size="small" 
            variant="outlined" 
            sx={{ fontWeight: 500 }}
          />
          <Chip 
            label={company} 
            size="small" 
            variant="outlined" 
            sx={{ fontWeight: 500 }}
          />
          {discount > 0 && (
            <Chip 
              label={`🏷️ ${discount}% OFF`} 
              size="small" 
              color="error" 
              variant="outlined" 
              sx={{ fontWeight: 600 }}
            />
          )}
        </Box>

        {description && (
          <Typography variant="body2" sx={{ 
            mb: 2.5, 
            fontStyle: 'italic', 
            color: theme.palette.text.secondary,
            lineHeight: 1.6
          }}>
            {description}
          </Typography>
        )}

        <Box sx={{ 
          display: 'flex', 
          gap: 2, 
          fontSize: '0.75rem', 
          color: theme.palette.text.secondary, 
          mb: 2.5,
          flexWrap: 'wrap'
        }}>
          <span>Created: {dateText(createdAt as string)}</span>
          <span>Updated: {dateText(updatedAt as string)}</span>
        </Box>

        {/* Components */}
        {components.length > 0 && (
          <Box>
            <Divider sx={{ my: 2.5 }} />
            <Typography variant="subtitle2" fontWeight={600} gutterBottom sx={{ color: theme.palette.text.primary }}>
              {t('Components')}:
            </Typography>
            {components.map((component, compIndex) => renderComponent(component, compIndex))}
          </Box>
        )}
      </Box>
    );
  };

  return (
    <Box sx={{ mt: 2 }}>
      {products.map((product, index) => renderProduct(product, index))}
    </Box>
  );
};

export { AddedProductsViewer, ObjectViewer };

