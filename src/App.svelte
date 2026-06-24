+<script>
  import Navbar from './lib/components/Navbar.svelte';
  import Sidebar from './lib/components/Sidebar.svelte';
  import DashboardStats from './lib/components/DashboardStats.svelte';
  import FlowerCard from './lib/components/FlowerCard.svelte';
  import Footer from './lib/components/Footer.svelte';

  let sidebarOpen = true;
  let cartCount = 3;

  // ── Flower Data ──────────────────────────────────────────────
  const flowers = [
    {
      name: 'Juliet Rose',
      category: 'Garden Rose',
      description: 'The world\'s most admired rose with soft apricot petals and a captivating fragrance.',
      price: 1200,
      rating: 4.8,
      reviews: 214,
      badge: 'Bestseller',
      favorited: false,
      image: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=400&h=280&fit=crop',
    },
    {
      name: 'Shenzhen Nongke Orchid',
      category: 'Rare Orchid',
      description: 'Lab-cultivated masterpiece that blooms once every 4–5 years. A true collector\'s gem.',
      price: 8000,
      rating: 5.0,
      reviews: 38,
      badge: 'Ultra Rare',
      favorited: true,
      image: 'https://images.unsplash.com/photo-1490750967868-88df5691cc15?w=400&h=280&fit=crop',
    },
    {
      name: 'Gold of Kinabalu Orchid',
      category: 'Wild Orchid',
      description: 'Native to Kinabalu National Park, prized for its ethereal golden-green striped petals.',
      price: 6500,
      rating: 4.9,
      reviews: 57,
      badge: 'Limited',
      favorited: false,
      image: 'https://images.unsplash.com/photo-1587530665381-7f58b9060c2e?w=400&h=280&fit=crop',
    },
    {
      name: 'Saffron Crocus',
      category: 'Exotic Bloom',
      description: 'The source of saffron spice, revered for centuries for its vivid violet hue and golden stamens.',
      price: 3000,
      rating: 4.7,
      reviews: 132,
      badge: null,
      favorited: false,
      image: 'https://images.unsplash.com/photo-1516912481808-3406841bd33c?w=400&h=280&fit=crop',
    },
    {
      name: 'Black Baccara Rose',
      category: 'Hybrid Tea Rose',
      description: 'Velvety deep-crimson petals that appear almost black. Dramatic, bold, and unforgettable.',
      price: 2500,
      rating: 4.9,
      reviews: 188,
      badge: 'Premium',
      favorited: false,
      image: 'https://images.unsplash.com/photo-1548460578-9dd6becc0d14?w=400&h=280&fit=crop',
    },
    {
      name: 'Blue Hydrangea',
      category: 'Hydrangea',
      description: 'Lush, cloud-like clusters in soft cornflower blue. Perfect for grand celebration arrangements.',
      price: 1800,
      rating: 4.6,
      reviews: 301,
      badge: null,
      favorited: false,
      image: 'https://images.unsplash.com/photo-1595351298020-038700609878?w=400&h=280&fit=crop',
    },
  ];

  // ── Featured Bouquets ──────────────────────────────────────────
  const bouquets = [
    {
      name: 'Eternal Romance',
      subtitle: 'Red roses · Gold leaf · White orchids',
      price: '₹4,200',
      image: 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=600&h=400&fit=crop',
    },
    {
      name: 'Garden Bliss',
      subtitle: 'Peonies · Lavender · Sweet peas',
      price: '₹3,100',
      image: 'https://images.unsplash.com/photo-1487530811015-780f2b19bd2c?w=600&h=400&fit=crop',
    },
    {
      name: 'Midnight Luxe',
      subtitle: 'Black Baccara · Blue Hydrangea · Calla Lily',
      price: '₹6,800',
      image: 'https://images.unsplash.com/photo-1599598425947-5202edd56bdb?w=600&h=400&fit=crop',
    },
  ];

  // ── Recent Orders ─────────────────────────────────────────────
  const orders = [
    { id: '#FF-001', customer: 'Ananya Krishnan', flower: 'Juliet Rose', price: '₹1,200', status: 'Delivered', statusClass: 'delivered' },
    { id: '#FF-002', customer: 'Rohan Mehta', flower: 'Shenzhen Nongke Orchid', price: '₹8,000', status: 'Processing', statusClass: 'processing' },
    { id: '#FF-003', customer: 'Priya Nair', flower: 'Blue Hydrangea', price: '₹1,800', status: 'Shipped', statusClass: 'shipped' },
    { id: '#FF-004', customer: 'Arjun Reddy', flower: 'Black Baccara Rose', price: '₹2,500', status: 'Delivered', statusClass: 'delivered' },
    { id: '#FF-005', customer: 'Kavitha Iyer', flower: 'Gold of Kinabalu Orchid', price: '₹6,500', status: 'Pending', statusClass: 'pending' },
    { id: '#FF-006', customer: 'Siddharth Rao', flower: 'Saffron Crocus', price: '₹3,000', status: 'Shipped', statusClass: 'shipped' },
  ];
</script>

<div class="app-shell">
  <Navbar bind:sidebarOpen {cartCount} />

  <div class="app-body">
    <Sidebar bind:open={sidebarOpen} />

    <main class="main-content" class:expanded={!sidebarOpen}>

      <!-- ── Hero ── -->
      <section class="hero">
        <div class="hero-bg">
          <img
            src="https://images.unsplash.com/photo-1490750967868-88df5691cc15?w=1400&h=600&fit=crop"
            alt="Luxury flower background"
          />
          <div class="hero-overlay"></div>
        </div>
        <div class="hero-content">
          <span class="hero-eyebrow">✦ The Finest in Floral Arts</span>
          <h1 class="hero-heading">Luxury Floral<br />Collection</h1>
          <p class="hero-sub">Discover the world's most exclusive flowers, hand-sourced from<br class="d-none" /> the rarest gardens on Earth.</p>
          <div class="hero-actions">
            <button class="btn-primary">Shop Now</button>
            <button class="btn-ghost">Explore Collection</button>
          </div>
          <div class="hero-chips">
            <span class="chip">🌹 250+ Rare Species</span>
            <span class="chip">🚚 Same-Day Delivery</span>
            <span class="chip">🏆 Award-Winning Curators</span>
          </div>
        </div>
      </section>

      <!-- ── Stats ── -->
      <section class="section">
        <DashboardStats />
      </section>

      <!-- ── Premium Flower Collection ── -->
      <section class="section">
        <div class="section-header">
          <div>
            <div class="section-eyebrow">Handpicked for Excellence</div>
            <h2 class="section-title">Premium Flower Collection</h2>
          </div>
          <button class="btn-outline">View All →</button>
        </div>
        <div class="flowers-grid">
          {#each flowers as flower}
            <FlowerCard {flower} />
          {/each}
        </div>
      </section>

      <!-- ── Featured Bouquets ── -->
      <section class="section">
        <div class="section-header">
          <div>
            <div class="section-eyebrow">Artisan Arrangements</div>
            <h2 class="section-title">Featured Collections</h2>
          </div>
          <button class="btn-outline">All Bouquets →</button>
        </div>
        <div class="bouquets-grid">
          {#each bouquets as bouquet}
            <div class="bouquet-card">
              <div class="bouquet-img-wrap">
                <img src={bouquet.image} alt={bouquet.name} />
                <div class="bouquet-overlay">
                  <button class="bouquet-cta">View Collection</button>
                </div>
              </div>
              <div class="bouquet-info">
                <h3 class="bouquet-name">{bouquet.name}</h3>
                <p class="bouquet-sub">{bouquet.subtitle}</p>
                <span class="bouquet-price">{bouquet.price}</span>
              </div>
            </div>
          {/each}
        </div>
      </section>

      <!-- ── Recent Orders ── -->
      <section class="section">
        <div class="section-header">
          <div>
            <div class="section-eyebrow">Live Activity</div>
            <h2 class="section-title">Recent Orders</h2>
          </div>
          <button class="btn-outline">View All Orders →</button>
        </div>
        <div class="table-card">
          <table class="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer Name</th>
                <th>Flower</th>
                <th>Price</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {#each orders as order}
                <tr>
                  <td><span class="order-id">{order.id}</span></td>
                  <td>
                    <div class="customer-cell">
                      <div class="customer-initial">{order.customer[0]}</div>
                      {order.customer}
                    </div>
                  </td>
                  <td class="flower-cell">{order.flower}</td>
                  <td class="price-cell">{order.price}</td>
                  <td>
                    <span class="status-badge {order.statusClass}">{order.status}</span>
                  </td>
                  <td>
                    <button class="action-btn" aria-label="View order">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    </button>
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </section>

    </main>
  </div>

  <Footer />
</div>

<style>
  /* ── Global resets & tokens ────────────────────────────── */
  :global(*, *::before, *::after) { box-sizing: border-box; margin: 0; padding: 0; }
  :global(body) {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    background: #fdf7fb;
    color: #2d0f23;
    -webkit-font-smoothing: antialiased;
  }

  /* ── Shell ─────────────────────────────────────────────── */
  .app-shell {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  .app-body {
    display: flex;
    flex: 1;
    overflow: hidden;
  }

  .main-content {
    flex: 1;
    overflow-y: auto;
    min-width: 0;
    transition: margin-left 0.3s cubic-bezier(.4,0,.2,1);
  }

  /* ── Hero ──────────────────────────────────────────────── */
  .hero {
    position: relative;
    min-height: 400px;
    display: flex;
    align-items: center;
    overflow: hidden;
  }

  .hero-bg {
    position: absolute;
    inset: 0;
  }
  .hero-bg img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center 30%;
  }
  .hero-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(110deg, rgba(30,8,24,0.88) 0%, rgba(30,8,24,0.55) 55%, rgba(30,8,24,0.2) 100%);
  }

  .hero-content {
    position: relative;
    z-index: 2;
    padding: 3.5rem 2.5rem;
    max-width: 620px;
  }

  .hero-eyebrow {
    display: inline-block;
    font-size: 0.75rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #c2856a;
    font-weight: 600;
    margin-bottom: 1rem;
    background: rgba(194,133,106,0.12);
    border: 1px solid rgba(194,133,106,0.3);
    padding: 4px 14px;
    border-radius: 20px;
  }

  .hero-heading {
    font-family: 'Georgia', serif;
    font-size: clamp(2rem, 4vw, 3.2rem);
    font-weight: 700;
    line-height: 1.12;
    color: #f9eef5;
    margin-bottom: 1rem;
    letter-spacing: -0.02em;
  }

  .hero-sub {
    font-size: 0.95rem;
    color: rgba(249,238,245,0.72);
    line-height: 1.7;
    margin-bottom: 1.75rem;
  }

  .hero-actions {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
    margin-bottom: 1.5rem;
  }

  .btn-primary {
    padding: 0.7rem 1.75rem;
    background: linear-gradient(135deg, #c2856a, #d4608a);
    color: #fff;
    border: none;
    border-radius: 50px;
    font-size: 0.9rem;
    font-weight: 700;
    cursor: pointer;
    transition: transform 0.18s, box-shadow 0.18s;
    letter-spacing: 0.02em;
  }
  .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(194,133,106,0.45); }

  .btn-ghost {
    padding: 0.7rem 1.75rem;
    background: rgba(255,255,255,0.08);
    backdrop-filter: blur(8px);
    color: rgba(249,238,245,0.9);
    border: 1.5px solid rgba(255,255,255,0.2);
    border-radius: 50px;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s, border-color 0.2s;
  }
  .btn-ghost:hover { background: rgba(255,255,255,0.14); border-color: rgba(255,255,255,0.35); }

  .btn-outline {
    padding: 0.5rem 1.25rem;
    background: transparent;
    border: 1.5px solid #ead6e4;
    color: #7a3d5e;
    border-radius: 50px;
    font-size: 0.82rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s, border-color 0.2s;
    white-space: nowrap;
  }
  .btn-outline:hover { background: #fdf0f5; border-color: #d4a0b8; }

  .hero-chips {
    display: flex;
    gap: 0.6rem;
    flex-wrap: wrap;
  }
  .chip {
    font-size: 0.72rem;
    color: rgba(249,238,245,0.7);
    background: rgba(255,255,255,0.08);
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 20px;
    padding: 4px 12px;
  }

  /* ── Sections ──────────────────────────────────────────── */
  .section {
    padding: 2rem 2rem 0;
  }
  .section:last-of-type { padding-bottom: 2rem; }

  .section-header {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 1.5rem;
    flex-wrap: wrap;
  }

  .section-eyebrow {
    font-size: 0.68rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #c2856a;
    font-weight: 700;
    margin-bottom: 0.3rem;
  }

  .section-title {
    font-family: 'Georgia', serif;
    font-size: 1.55rem;
    font-weight: 700;
    color: #2d0f23;
    letter-spacing: -0.01em;
  }

  /* ── Flowers Grid ──────────────────────────────────────── */
  .flowers-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.35rem;
  }

  /* ── Bouquets ──────────────────────────────────────────── */
  .bouquets-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.35rem;
  }

  .bouquet-card {
    background: #fff;
    border: 1.5px solid #f0dde8;
    border-radius: 20px;
    overflow: hidden;
    transition: transform 0.28s, box-shadow 0.28s;
    cursor: default;
  }
  .bouquet-card:hover { transform: translateY(-5px); box-shadow: 0 14px 40px rgba(150,60,100,0.12); }

  .bouquet-img-wrap {
    position: relative;
    height: 200px;
    overflow: hidden;
  }
  .bouquet-img-wrap img {
    width: 100%; height: 100%;
    object-fit: cover;
    transition: transform 0.4s;
  }
  .bouquet-card:hover .bouquet-img-wrap img { transform: scale(1.06); }

  .bouquet-overlay {
    position: absolute;
    inset: 0;
    background: rgba(45,15,35,0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.28s;
  }
  .bouquet-card:hover .bouquet-overlay { opacity: 1; }

  .bouquet-cta {
    padding: 0.55rem 1.4rem;
    background: rgba(255,255,255,0.9);
    color: #2d0f23;
    border: none;
    border-radius: 50px;
    font-size: 0.82rem;
    font-weight: 700;
    cursor: pointer;
    transition: background 0.2s, transform 0.15s;
  }
  .bouquet-cta:hover { background: #fff; transform: scale(1.04); }

  .bouquet-info { padding: 1rem 1.15rem 1.2rem; }
  .bouquet-name { font-family: 'Georgia', serif; font-size: 1rem; font-weight: 700; color: #2d0f23; margin-bottom: 0.3rem; }
  .bouquet-sub { font-size: 0.78rem; color: #9b6b8a; margin-bottom: 0.7rem; }
  .bouquet-price { font-family: 'Georgia', serif; font-size: 1.05rem; font-weight: 700; color: #c2856a; }

  /* ── Orders Table ──────────────────────────────────────── */
  .table-card {
    background: #fff;
    border: 1.5px solid #f0dde8;
    border-radius: 20px;
    overflow: hidden;
  }

  .orders-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.85rem;
  }

  .orders-table thead {
    background: linear-gradient(135deg, #fdf5f9, #f8eaf2);
    border-bottom: 1.5px solid #f0dde8;
  }
  .orders-table th {
    padding: 0.9rem 1.1rem;
    text-align: left;
    font-size: 0.71rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #9b6b8a;
    font-weight: 700;
  }
  .orders-table td {
    padding: 0.9rem 1.1rem;
    border-bottom: 1px solid #fdf0f5;
    color: #3d1a2e;
    vertical-align: middle;
  }
  .orders-table tbody tr:last-child td { border-bottom: none; }
  .orders-table tbody tr:hover td { background: #fdf5f9; }

  .order-id { font-family: monospace; font-size: 0.82rem; color: #9b6b8a; font-weight: 600; }

  .customer-cell {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    font-weight: 500;
  }
  .customer-initial {
    width: 28px; height: 28px;
    border-radius: 50%;
    background: linear-gradient(135deg, #e8c0d8, #d4a0c0);
    color: #3d1a2e;
    font-size: 0.75rem;
    font-weight: 700;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }

  .flower-cell { color: #5a2840; font-weight: 500; }
  .price-cell { font-family: 'Georgia', serif; font-weight: 700; color: #2d0f23; }

  .status-badge {
    display: inline-flex;
    align-items: center;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 0.73rem;
    font-weight: 600;
  }
  .status-badge.delivered  { background: rgba(46,125,82,0.1);  color: #2e7d52; }
  .status-badge.processing { background: rgba(194,133,106,0.15); color: #8a5020; }
  .status-badge.shipped    { background: rgba(100,100,220,0.1);  color: #3040a0; }
  .status-badge.pending    { background: rgba(180,80,80,0.1);    color: #a04040; }

  .action-btn {
    width: 30px; height: 30px;
    display: flex; align-items: center; justify-content: center;
    background: #fdf0f5;
    border: 1px solid #f0dde8;
    border-radius: 8px;
    color: #9b6b8a;
    cursor: pointer;
    transition: background 0.2s, color 0.2s;
  }
  .action-btn:hover { background: #f5d6e8; color: #3d1a2e; }

  /* ── Responsive ────────────────────────────────────────── */
  @media (max-width: 1100px) {
    .flowers-grid { grid-template-columns: repeat(2, 1fr); }
    .bouquets-grid { grid-template-columns: repeat(2, 1fr); }
  }
  @media (max-width: 768px) {
    .section { padding: 1.5rem 1rem 0; }
    .hero-content { padding: 2.5rem 1.25rem; }
    .flowers-grid { grid-template-columns: repeat(2, 1fr); gap: 1rem; }
    .bouquets-grid { grid-template-columns: 1fr; }
    .orders-table th:nth-child(3),
    .orders-table td:nth-child(3) { display: none; }
  }
  @media (max-width: 500px) {
    .flowers-grid { grid-template-columns: 1fr; }
    .section-title { font-size: 1.25rem; }
    .orders-table th:nth-child(5),
    .orders-table td:nth-child(5) { display: none; }
  }
</style>
