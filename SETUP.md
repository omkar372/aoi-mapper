# Setup & Installation Guide

## Local Development Setup

### System Requirements
- **Node.js**: 18.0.0 or higher
- **npm**: 9.0.0 or higher
- **Git**: Latest version
- **OS**: Windows, macOS, or Linux

### Installation Steps

1. **Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/aoi-satellite-mapper.git
   cd aoi-satellite-mapper
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```
   This installs:
   - React 18 & React DOM
   - TypeScript compiler
   - Vite build tool
   - Leaflet & react-leaflet
   - Zustand state management
   - Tailwind CSS
   - Playwright for testing
   - ESLint & Prettier

3. **Start Development Server**
   ```bash
   npm run dev
   ```
   Application opens at `http://localhost:5173`

### Environment Variables
**No environment variables required.** The app uses public APIs with no secrets.

All external services used:
- **WMS Layer**: https://www.wms.nrw.de/geobasis/wms_nw_dop (no auth)
- **Geocoding**: https://nominatim.openstreetmap.org (public, rate-limited)
- **Base Tiles**: https://tile.openstreetmap.org (public)

## Development Workflow

### Available Scripts

```bash
# Start development server (with hot reload)
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Run ESLint to check code quality
npm run lint

# Run Playwright E2E tests
npm run test:e2e

# Run tests with interactive UI
npm run test:e2e:ui
```

### Project Structure

```
aoi-satellite-mapper/
├── src/
│   ├── App.tsx                    # Main application component
│   ├── main.tsx                   # Entry point
│   ├── index.css                  # Global styles
│   ├── components/
│   │   ├── Map.tsx               # Leaflet map integration
│   │   ├── SearchBar.tsx         # Geocoding search
│   │   └── UIComponents.tsx      # Reusable UI controls
│   ├── store/
│   │   └── mapStore.ts           # Zustand state management
│   └── utils/
│       ├── geocoding.ts          # Nominatim API wrapper
│       └── common.ts             # Utility functions
├── tests/
│   └── e2e/
│       └── map.spec.ts           # Playwright tests
├── index.html                    # HTML template
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript config
├── vite.config.ts                # Vite config
├── tailwind.config.js            # Tailwind config
├── playwright.config.ts          # Playwright config
├── .eslintrc.json               # ESLint config
├── .prettierrc                   # Prettier config
├── README.md                     # Main documentation
└── ARCHITECTURE.md               # Architecture docs
```

## Running Tests

### End-to-End Tests (Playwright)

```bash
# Run all tests
npm run test:e2e

# Run tests with UI dashboard
npm run test:e2e:ui

# Run specific test file
npx playwright test tests/e2e/map.spec.ts

# Run tests in headed mode (browser visible)
npx playwright test --headed

# Run tests in debug mode
npx playwright test --debug
```

**Test Coverage:**
- ✅ Map loads correctly
- ✅ WMS layer renders
- ✅ Zoom controls work
- ✅ Drawing features (points, lines, polygons)
- ✅ Geocoding/search functionality
- ✅ Layer visibility toggle
- ✅ Feature persistence across reload

## Code Quality

### Linting & Formatting

```bash
# Check for linting errors
npm run lint

# Format code with Prettier (run before commit)
npx prettier --write src/
```

### Pre-commit Hooks (Optional)

Install Husky for automatic checks before commit:

```bash
npm install --save-dev husky lint-staged
npx husky install
npx husky add .husky/pre-commit "npm run lint && npm run test:e2e"
```

## Building for Production

### Development Build
```bash
npm run dev  # Hot reload enabled
```

### Production Build
```bash
npm run build
```

This generates:
- `dist/` folder with optimized bundle
- Source maps for debugging
- Minified & tree-shaken code

### Preview Production Build
```bash
npm run preview
```
Opens at `http://localhost:4173`

## Troubleshooting

### Issue: "Port 5173 is already in use"
```bash
# Use different port
npm run dev -- --port 3000

# Or kill process on port 5173
# Windows:
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# macOS/Linux:
lsof -i :5173
kill -9 <PID>
```

### Issue: "Module not found" errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: Playwright tests fail
```bash
# Install Playwright browsers
npx playwright install

# Run single test for debugging
npx playwright test tests/e2e/map.spec.ts --debug
```

### Issue: Map doesn't load
1. Check browser console for errors
2. Verify internet connection (WMS layer requires online access)
3. Check if WMS service is available: https://www.wms.nrw.de/geobasis/wms_nw_dop

## Deployment

### Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Deploy to Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir dist
```

### Deploy to GitHub Pages

```bash
# Add to package.json:
"deploy": "npm run build && gh-pages -d dist"

# Then run:
npm run deploy
```

**Note**: Requires `gh-pages` package:
```bash
npm install --save-dev gh-pages
```

## Git Workflow

### Before Committing

1. **Lint check**:
   ```bash
   npm run lint
   ```

2. **Run tests**:
   ```bash
   npm run test:e2e
   ```

3. **Build locally**:
   ```bash
   npm run build
   ```

### Commit Message Convention

```
feat: Add drawing tools for polygons
fix: Resolve map pan issue on mobile
docs: Update README with API details
style: Format code with Prettier
test: Add geocoding search tests
chore: Update dependencies
```

## Performance Tips

- **Use production build**: `npm run build` is 3x faster than dev
- **Clear browser cache**: Cmd+Shift+Delete (Chrome/Firefox)
- **Monitor network**: DevTools → Network tab
- **Check bundle size**: `npm run build -- --analyze` (requires plugin)

## Getting Help

### Documentation
- [Leaflet Documentation](https://leafletjs.com/)
- [React Documentation](https://react.dev/)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)

### Common Resources
- **Map API**: [WMS Documentation](https://www.wms.nrw.de/)
- **Geocoding**: [Nominatim API](https://nominatim.org/release-docs/latest/api/Overview/)
- **TypeScript**: [Official Handbook](https://www.typescriptlang.org/docs/)

### Support
- Check existing GitHub Issues
- Read error messages carefully (stack trace)
- Check browser DevTools Console
- Ask in GitHub Discussions

---

**Happy developing! 🚀**
