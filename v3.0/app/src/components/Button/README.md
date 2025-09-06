# Custom Button Component

## Overview
A custom Button component with a bold, masculine design that extends Material-UI's Button component.

## Features
- **Bold, masculine styling** with thick black borders (2px)
- **Uppercase typography** with letter-spacing
- **Font weight 800** (extra-bold)
- **Square border radius** (1)
- **Hover effects** with scale and shadows
- **3 variants**: contained, outlined, text
- **3 sizes**: small, medium, large
- **Disabled states** with appropriate styling

## Usage

```tsx
import Button from '../components/Button';

// Basic usage
<Button variant="contained" size="medium">
  Click Me
</Button>

// Different variants
<Button variant="outlined">Outlined Button</Button>
<Button variant="text">Text Button</Button>

// Different sizes
<Button size="small">Small</Button>
<Button size="medium">Medium</Button>
<Button size="large">Large</Button>

// With custom styling
<Button 
  variant="contained" 
  sx={{ width: '200px', height: '50px' }}
>
  Custom Size
</Button>
```

## Variants
- **contained**: Black background, white text
- **outlined**: Black border, transparent background
- **text**: Text only, no borders

## Sizes
- **small**: 32px height, 0.75rem font
- **medium**: 40px height, 0.875rem font  
- **large**: 48px height, 1rem font

## Hover Effects
- **Scale**: 1.02x for interactivity
- **Shadows**: For depth
- **Color inversion**: For outlined/text variants
