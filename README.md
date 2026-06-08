# Perplexity.ai Frontend Clone

A pixel-perfect, high-fidelity frontend clone of [Perplexity.ai](https://www.perplexity.ai/) built with **Angular 21** using standalone components and modular SCSS styles. 

This project simulates the complete Perplexity user experience, including real-time mock search streaming, query history tracking, responsive sidebar state, and custom views for all primary navigation categories with rich static data.

---

## ✨ Features

- **🔍 Smart Search Homepage**: Contains the Georgia serif logo font, customized search modes (Focus, File Attach), a model selector dropdown, autocomplete suggestions as you type, and clean call-to-action cards.
- **⚡ Simulated AI Answer Streaming**: Search results display sources first, followed by real-time typewriter-effect streaming of AI responses with citations, related follow-up prompts, and a sticky follow-up input bar.
- **📰 Discover Feed**: Rich layout featuring a featured headline, trending article grids, weather widget, market index ticker, and a customizable topics manager.
- **📈 Finance Portal**: Live market overview card widgets with inline SVG sparklines, watchlist tickers, crypto assets monitor, and financial news cards.
- **🩺 Health Center**: Health-related news card lists alongside topic filter chips.
- **🎓 Academic Browser**: Grid of popular research papers with citation counts and quick read controls.
- **📜 Patent Explorer**: Live search input filter simulating a patent index with metadata badges.
- **📁 Spaces & Artifacts**: Spaces grid containing group configurations, and an artifacts manager for viewing documents or code.
- **🕐 History Tracker**: Persistent history panel showing recent searches in your session, with the ability to click and re-run search prompts.

---

## 🛠️ Tech Stack

- **Core**: Angular 21 (Standalone Architecture)
- **Styling**: SCSS (Vanilla Variables, Flexbox, Grids, and Responsive Media Queries)
- **Reactivity**: Angular Signals (`signal`, `computed`, `update`)
- **Routing**: Angular Router (Lazy-loaded component bundles)

---

## 📂 Project Structure

```text
src/
├── app/
│   ├── components/
│   │   ├── academic/          # Academic page component
│   │   ├── artifacts/         # Artifacts list component
│   │   ├── discover/          # Discover feed component
│   │   ├── finance/           # Finance indices, crypto, and watchlist
│   │   ├── health/            # Health portal component
│   │   ├── history/           # Session history page
│   │   ├── home/              # Main landing page with search
│   │   ├── patents/           # Patents search component
│   │   ├── search-results/    # AI answer streaming & sources
│   │   ├── sidebar/           # Expandable navigation menu
│   │   └── spaces/            # Spaces component
│   ├── services/
│   │   └── search.service.ts  # Main state store & simulated stream engine
│   ├── app.config.ts          # Application providers
│   ├── app.routes.ts          # Routes configuration
│   └── app.ts                 # Main root bootstrap component
├── assets/                    # Static asset icons
├── index.html                 # Main template index file
├── main.ts                    # Bootstrap endpoint
└── styles.scss                # Global design system & theme vars
```

---

## 🚀 Getting Started

Follow these steps to run the application locally:

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm start
```
The server will start at `http://localhost:4200/`.

*Note: If port `4200` is already in use by another service on your machine, you can run the server on a custom port:*
```bash
npx ng serve --port 4201
```

### 3. Build for Production
To generate a production-ready bundle optimized for deployment:
```bash
npm run build
```
The build artifacts will be stored in the `dist/comet-clone` directory.
