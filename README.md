# 🌸 FloraFusion – Luxury Flower Shop Dashboard

A premium Svelte + Tailwind CSS flower shop dashboard with elegant deep rose, lavender, and gold palette.

---

## 📁 File Structure

```
florafusion/
├── index.html
├── package.json
├── vite.config.js
├── svelte.config.js
├── tailwind.config.js
├── postcss.config.js
└── src/
    ├── main.js
    ├── app.css
    ├── App.svelte                   ← Root layout + all page sections
    └── lib/
        └── components/
            ├── Navbar.svelte        ← Top navigation bar
            ├── Sidebar.svelte       ← Left navigation sidebar
            ├── DashboardStats.svelte← 4 KPI stat cards
            ├── FlowerCard.svelte    ← Reusable flower product card
            └── Footer.svelte        ← Page footer with social links
```

---

## 🚀 Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Start dev server
```bash
npm run dev
```
Open `http://localhost:5173`

### 3. Build for production
```bash
npm run build
npm run preview
```

---

## 🎨 Design Tokens

| Role         | Color     | Hex       |
|--------------|-----------|-----------|
| Background   | Ivory     | `#fdf7fb` |
| Dark text    | Deep plum | `#2d0f23` |
| Sidebar      | Midnight  | `#2d0f23` |
| Accent gold  | Terracotta| `#c2856a` |
| Accent pink  | Rose      | `#d4608a` |
| Border       | Soft pink | `#f0dde8` |
| Muted text   | Lilac     | `#9b6b8a` |

---

## ✨ Features

- **Collapsible sidebar** with active state highlighting
- **Sticky navbar** with search, notifications, cart badge
- **Hero banner** with parallax-style overlay and CTA buttons
- **4 KPI stat cards** with trend indicators
- **6 flower cards** with hover animation, add-to-cart, and favourite toggle
- **3 featured bouquet cards** with reveal overlay on hover
- **Recent orders table** with status badges
- **Responsive** down to 375 px mobile
- **Scroll-aware** custom scrollbar
- All images sourced from **Unsplash** (no API key needed)

---

## 📦 Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| svelte  | ^4.2    | UI framework |
| vite    | ^5.1    | Build tool |
| @sveltejs/vite-plugin-svelte | ^3 | Svelte + Vite integration |
| tailwindcss | ^3.4 | Utility CSS |
| autoprefixer | ^10 | CSS compatibility |
| postcss | ^8.4 | CSS processing |
