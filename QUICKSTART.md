# Quick Reference Guide

## 🚀 Get Started in 30 Seconds

### Install
```bash
npm install
```

### Run
```bash
npm run dev
```

### Test
```bash
npm run test:e2e
```

### Build
```bash
npm run build
```

---

## 🗺️ Using the Application

### Map Navigation
- **Scroll wheel**: Zoom in/out
- **Click + drag**: Pan the map
- **Arrow keys**: Pan the map (when focused)
- **+/- buttons**: Zoom controls
- **Fullscreen**: Toggle fullscreen mode

### Drawing Features

#### Draw a Point
1. Click "Draw Point" button
2. Click anywhere on the map
3. Point appears in the feature list

#### Draw a Line
1. Click "Draw Line" button
2. Click to place multiple points
3. Right-click to finish
4. Line appears in the feature list

#### Draw a Polygon (AOI)
1. Click "Draw Polygon" button
2. Click to place 3+ points
3. Right-click to finish
4. Polygon appears in the feature list (green by default)

#### Clear Features
- Click "Delete" button on a feature to remove it
- Click "Clear All" to remove all features at once

### Search Locations
1. Type location name in search bar (e.g., "Münster")
2. Select from dropdown
3. Map automatically centers on location

### Manage Layers
- Toggle "WMS Satellite Layer" to show/hide satellite imagery
- View all drawn features in the feature list
- Features are automatically saved

---

## 📋 File Locations

| What | Where |
|------|-------|
| Main app | `src/App.tsx` |
| Map logic | `src/components/Map.tsx` |
| Search | `src/components/SearchBar.tsx` |
| Controls | `src/components/UIComponents.tsx` |
| State | `src/store/mapStore.ts` |
| Utils | `src/utils/` |
| Tests | `tests/e2e/` |

---

## ⚙️ Configuration

### WMS Service
- **URL**: https://www.wms.nrw.de/geobasis/wms_nw_dop
- **Layer**: nw_dop_rgb (Digital Orthophotos)
- **Coverage**: North Rhine-Westphalia, Germany

### Search API
- **Service**: OpenStreetMap Nominatim
- **URL**: https://nominatim.openstreetmap.org

### State Storage
- **Method**: Browser localStorage
- **Key**: `map-store`
- **Auto-save**: Yes
- **Auto-restore**: Yes on reload

---

## 🧪 Running Tests

```bash
# All tests
npm run test:e2e

# With UI dashboard
npm run test:e2e:ui

# Specific test file
npx playwright test tests/e2e/map.spec.ts

# Debug mode
npx playwright test --debug

# Headed mode (see browser)
npx playwright test --headed
```

---

## 🔧 Available Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start dev server (port 5173) |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run test:e2e` | Run Playwright tests |
| `npm run test:e2e:ui` | Run tests with UI |
| `npm run lint` | Check code quality |

---

## 🐛 Troubleshooting

### Map doesn't load
- Check internet connection
- Verify WMS service is available
- Check browser console for errors

### Tests fail
```bash
npx playwright install
npm run test:e2e
```

### Port already in use
```bash
npm run dev -- --port 3000
```

### Can't find modules
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## 📚 Documentation

- **README.md** - Full guide and decisions
- **SETUP.md** - Detailed installation and deployment
- **ARCHITECTURE.md** - Technical architecture
- **SUMMARY.md** - Project overview and stats

---

## 💡 Tips

- Features are **auto-saved** to your browser
- You can **reload the page** and your features persist
- Use **right-click** to finish drawing lines/polygons
- **Search** works for any location worldwide
- **WMS layer** loads satellite imagery (Requires internet)

---

## 🎯 Feature Overview

| Feature | Status | Details |
|---------|--------|---------|
| Map view | ✅ | Leaflet + OpenStreetMap tiles |
| WMS layer | ✅ | NRW Digital Orthophotos |
| Drawing | ✅ | Points, lines, polygons |
| Search | ✅ | Nominatim geocoding |
| Layers | ✅ | Toggle visibility |
| Persistence | ✅ | localStorage integration |
| Export | ⏳ | Ready for implementation |

---

**Need more help? Check the README.md file!**
