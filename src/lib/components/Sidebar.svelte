<script>
  export let open = true;

  let activeItem = 'Dashboard';

  const navItems = [
    { label: 'Dashboard',        icon: '▦',  badge: null },
    { label: 'Premium Flowers',  icon: '🌹', badge: null },
    { label: 'Bouquets',         icon: '💐', badge: 'New' },
    { label: 'Occasions',        icon: '🎁', badge: null },
    { label: 'Orders',           icon: '📦', badge: 12 },
    { label: 'Customers',        icon: '👤', badge: null },
    { label: 'Settings',         icon: '⚙',  badge: null },
  ];
</script>

<aside class="sidebar" class:closed={!open}>
  <div class="sidebar-inner">
    <div class="sidebar-brand">
      <span class="brand-icon">🌸</span>
      <div class="brand-info">
        <div class="brand-name">FloraFusion</div>
        <div class="brand-sub">Admin Panel</div>
      </div>
    </div>

    <div class="sidebar-section-label">MAIN MENU</div>

    <nav class="sidebar-nav">
      {#each navItems as item}
        <button
          class="nav-item"
          class:active={activeItem === item.label}
          on:click={() => (activeItem = item.label)}
        >
          <span class="nav-icon">{item.icon}</span>
          <span class="nav-label">{item.label}</span>
          {#if item.badge !== null}
            <span class="nav-badge" class:text-badge={typeof item.badge === 'string'}>
              {item.badge}
            </span>
          {/if}
        </button>
      {/each}
    </nav>

    <div class="sidebar-divider"></div>

    <div class="sidebar-promo">
      <div class="promo-icon">🌺</div>
      <div class="promo-text">
        <div class="promo-title">Premium Access</div>
        <div class="promo-desc">Unlock exclusive rare collections</div>
      </div>
      <button class="promo-btn">Upgrade</button>
    </div>

    <div class="sidebar-footer">
      <img
        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face"
        alt="Admin"
        class="footer-avatar"
      />
      <div class="footer-info">
        <div class="footer-name">Priya Sharma</div>
        <div class="footer-role">Store Admin</div>
      </div>
      <button class="logout-btn" aria-label="Logout">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
          <polyline points="16 17 21 12 16 7"/>
          <line x1="21" y1="12" x2="9" y2="12"/>
        </svg>
      </button>
    </div>
  </div>
</aside>

<style>
  .sidebar {
    width: 260px;
    flex-shrink: 0;
    height: 100%;
    min-height: 100vh;
    background: linear-gradient(180deg, #2d0f23 0%, #3d1a2e 60%, #4a1e36 100%);
    display: flex;
    flex-direction: column;
    transition: width 0.3s cubic-bezier(.4,0,.2,1), transform 0.3s cubic-bezier(.4,0,.2,1);
    overflow: hidden;
    position: sticky;
    top: 0;
  }
  .sidebar.closed {
    width: 0;
    transform: translateX(-260px);
  }

  .sidebar-inner {
    width: 260px;
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 1.25rem 0 1.25rem;
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: none;
  }
  .sidebar-inner::-webkit-scrollbar { display: none; }

  .sidebar-brand {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.5rem 1.5rem 1.5rem;
    border-bottom: 1px solid rgba(255,255,255,0.08);
    margin-bottom: 1.25rem;
  }
  .brand-icon { font-size: 1.75rem; }
  .brand-name {
    font-family: 'Georgia', serif;
    font-size: 1.1rem;
    font-weight: 700;
    color: #f5e6ef;
    letter-spacing: 0.01em;
  }
  .brand-sub { font-size: 0.72rem; color: rgba(245,230,239,0.45); letter-spacing: 0.06em; text-transform: uppercase; }

  .sidebar-section-label {
    font-size: 0.65rem;
    letter-spacing: 0.1em;
    color: rgba(255,255,255,0.3);
    font-weight: 600;
    padding: 0 1.5rem 0.6rem;
  }

  .sidebar-nav {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: 0 0.75rem;
  }

  .nav-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.7rem 0.85rem;
    border-radius: 12px;
    border: none;
    background: transparent;
    color: rgba(245,220,235,0.65);
    cursor: pointer;
    font-size: 0.88rem;
    font-weight: 500;
    text-align: left;
    transition: background 0.2s, color 0.2s, transform 0.15s;
    white-space: nowrap;
  }
  .nav-item:hover {
    background: rgba(255,255,255,0.07);
    color: #f5e0ef;
    transform: translateX(2px);
  }
  .nav-item.active {
    background: linear-gradient(135deg, rgba(194,133,106,0.3), rgba(180,100,130,0.2));
    color: #f5d6c8;
    border: 1px solid rgba(194,133,106,0.3);
    box-shadow: 0 2px 12px rgba(194,133,106,0.15);
  }

  .nav-icon { font-size: 1.1rem; width: 22px; text-align: center; flex-shrink: 0; }
  .nav-label { flex: 1; }
  .nav-badge {
    background: rgba(212,81,110,0.85);
    color: #fff;
    font-size: 0.65rem;
    font-weight: 700;
    padding: 2px 7px;
    border-radius: 20px;
    min-width: 20px;
    text-align: center;
  }
  .nav-badge.text-badge {
    background: rgba(194,133,106,0.85);
    font-size: 0.6rem;
    letter-spacing: 0.03em;
  }

  .sidebar-divider {
    height: 1px;
    background: rgba(255,255,255,0.07);
    margin: 1.25rem 1.5rem;
  }

  .sidebar-promo {
    margin: 0 0.75rem;
    padding: 1rem;
    background: linear-gradient(135deg, rgba(194,133,106,0.25), rgba(180,100,130,0.2));
    border: 1px solid rgba(194,133,106,0.25);
    border-radius: 14px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 0.4rem;
  }
  .promo-icon { font-size: 1.6rem; }
  .promo-title { font-size: 0.85rem; font-weight: 700; color: #f5d6c8; }
  .promo-desc { font-size: 0.72rem; color: rgba(245,220,235,0.6); line-height: 1.4; }
  .promo-btn {
    margin-top: 0.35rem;
    padding: 0.4rem 1.25rem;
    background: linear-gradient(135deg, #c2856a, #d4608a);
    color: #fff;
    border: none;
    border-radius: 50px;
    font-size: 0.78rem;
    font-weight: 600;
    cursor: pointer;
    transition: opacity 0.2s, transform 0.15s;
  }
  .promo-btn:hover { opacity: 0.88; transform: scale(1.03); }

  .sidebar-footer {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    padding: 0 1rem;
    margin-top: auto;
    padding-top: 1.25rem;
    border-top: 1px solid rgba(255,255,255,0.07);
  }
  .footer-avatar {
    width: 34px;
    height: 34px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid rgba(194,133,106,0.5);
    flex-shrink: 0;
  }
  .footer-info { flex: 1; min-width: 0; }
  .footer-name { font-size: 0.82rem; font-weight: 600; color: #f5e0ef; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .footer-role { font-size: 0.68rem; color: rgba(245,220,235,0.45); }
  .logout-btn {
    width: 28px; height: 28px;
    display: flex; align-items: center; justify-content: center;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 8px;
    color: rgba(245,220,235,0.5);
    cursor: pointer;
    transition: background 0.2s, color 0.2s;
    flex-shrink: 0;
  }
  .logout-btn:hover { background: rgba(212,81,110,0.25); color: #f5a0b0; }
</style>
