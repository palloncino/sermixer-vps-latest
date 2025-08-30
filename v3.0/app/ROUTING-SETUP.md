# 🚀 Routing Configuration - Easy Switch Between v2.0 and v3.0

## 📍 Quick Switch

To switch between v2.0 and v3.0 routing, you only need to change **ONE** value:

### File: `src/config/app-config.ts`

```typescript
export const APP_CONFIG = {
  // Change this value:
  USE_V3_ROUTES: true,  // ← Change this to false for v2.0
  // ... rest of config
};
```

## 🔄 How It Works

### v3.0 Mode (USE_V3_ROUTES: true)
- All routes get `/v3.0` prefix
- Example: `/documents-list` becomes `/v3.0/documents-list`
- Perfect for development and testing

### v2.0 Mode (USE_V3_ROUTES: false)
- All routes are direct (no prefix)
- Example: `/documents-list` stays `/documents-list`
- Perfect for production deployment

## 📱 Route Examples

| Route | v3.0 Mode | v2.0 Mode |
|-------|-----------|-----------|
| Dashboard | `/v3.0/` | `/` |
| Documents List | `/v3.0/documents-list` | `/documents-list` |
| Create Document | `/v3.0/create-document` | `/create-document` |
| Products | `/v3.0/products` | `/products` |
| Clients | `/v3.0/clients` | `/clients` |

## 🛠️ Implementation Details

### 1. Centralized Configuration
- **File**: `src/config/app-config.ts`
- **Single source of truth** for all app settings
- **Easy to maintain** and update

### 2. Dynamic Route Generation
- **File**: `src/constants/routes.ts`
- **Routes are functions** that return the correct URL
- **Automatic prefix handling** based on configuration

### 3. Usage in Components
```typescript
import { ROUTES } from '../../constants/routes';

// Instead of hardcoded URLs:
<Link href="/documents-list">Documents</Link>

// Use dynamic routes:
<Link href={ROUTES.documentsList()}>Documents</Link>
```

## 🔧 Advanced Configuration

### Feature Flags
```typescript
export const APP_CONFIG = {
  USE_V3_ROUTES: true,
  ENABLE_NEW_DASHBOARD: true,
  ENABLE_PDF_MANAGEMENT: true,
  ENABLE_ADVANCED_ANALYTICS: true,
  // ... more flags
};
```

### Theme Settings
```typescript
THEME: {
  PRIMARY_COLOR: '#1976d2',
  SECONDARY_COLOR: '#dc004e',
  SUCCESS_COLOR: '#4caf50',
  // ... more colors
}
```

## 🚨 Important Notes

### ✅ What Works
- **All internal links** automatically use correct routing
- **Navigation components** adapt to current mode
- **API endpoints** remain unchanged
- **External links** are not affected

### ⚠️ What to Check
- **Hardcoded URLs** in components (should use ROUTES)
- **External redirects** (may need manual updates)
- **Bookmarks** (users may have old URLs)

## 🔄 Switching Process

### To Switch to v2.0:
1. Open `src/config/app-config.ts`
2. Change `USE_V3_ROUTES: true` to `USE_V3_ROUTES: false`
3. Save the file
4. Restart the development server
5. All routes now work without `/v3.0` prefix

### To Switch to v3.0:
1. Open `src/config/app-config.ts`
2. Change `USE_V3_ROUTES: false` to `USE_V3_ROUTES: true`
3. Save the file
4. Restart the development server
5. All routes now work with `/v3.0` prefix

## 📋 Checklist for Complete Migration

- [ ] Update all `<Link>` components to use `ROUTES.*()`
- [ ] Update all `navigate()` calls to use `ROUTES.*()`
- [ ] Update all `href` attributes to use `ROUTES.*()`
- [ ] Test navigation in both v2.0 and v3.0 modes
- [ ] Verify external links still work correctly
- [ ] Update any hardcoded URLs in components

## 🎯 Benefits

1. **Single Point of Control**: Change one value to switch modes
2. **No Code Changes**: All components automatically adapt
3. **Easy Testing**: Test both modes without code modifications
4. **Production Ready**: Deploy to v2.0 by changing one flag
5. **Maintainable**: Centralized configuration is easy to manage

## 🆘 Troubleshooting

### Routes Not Working?
- Check if `USE_V3_ROUTES` is set correctly
- Restart the development server
- Clear browser cache and cookies

### Still Seeing Old URLs?
- Make sure all components use `ROUTES.*()` functions
- Check for hardcoded URLs in components
- Verify the configuration file is saved

### Need Help?
- Check the browser console for warnings
- Verify the `app-config.ts` file is imported correctly
- Ensure all route imports are from the correct file
