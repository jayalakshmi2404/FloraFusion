<script>
  export let cartCount = 3;
  export let sidebarOpen = true;

  let searchQuery = '';
</script>

<nav class="navbar">
  <div class="navbar-left">
    <button class="hamburger" on:click={() => (sidebarOpen = !sidebarOpen)} aria-label="Toggle sidebar">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="3" y1="6" x2="21" y2="6"/>
        <line x1="3" y1="12" x2="21" y2="12"/>
        <line x1="3" y1="18" x2="21" y2="18"/>
      </svg>
    </button>
    <div class="logo">
      <span class="logo-icon">🌸</span>
      <span class="logo-text">Flora<span class="logo-accent">Fusion</span></span>
    </div>
  </div>

  <div class="search-bar">
    <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
    </svg>
    <input
      type="text"
      placeholder="Search rare blooms, bouquets…"
      bind:value={searchQuery}
    />
  </div>

  <div class="navbar-right">
    <button class="icon-btn notify-btn" aria-label="Notifications">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
        <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
      </svg>
      <span class="badge">2</span>
    </button>

    <button class="icon-btn cart-btn" aria-label="Cart">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
        <line x1="3" y1="6" x2="21" y2="6"/>
        <path d="M16 10a4 4 0 0 1-8 0"/>
      </svg>
      {#if cartCount > 0}
        <span class="badge gold">{cartCount}</span>
      {/if}
    </button>

    <div class="avatar" aria-label="User profile">
      <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face" alt="User" />
      <div class="avatar-status"></div>
    </div>
  </div>
</nav>

<style>
  .navbar {
    position: sticky;
    top: 0;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 0 1.75rem;
    height: 68px;
    background: rgba(255,255,255,0.92);
    backdrop-filter: blur(16px);
    border-bottom: 1px solid #f0dde8;
    box-shadow: 0 2px 20px rgba(180,120,150,0.08);
  }

  .navbar-left {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex-shrink: 0;
  }

  .hamburger {
    display: none;
    background: none;
    border: none;
    cursor: pointer;
    color: #9b6b8a;
    padding: 4px;
    border-radius: 8px;
    transition: background 0.2s;
  }
  .hamburger:hover { background: #fdf0f5; }

  .logo {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-family: 'Georgia', serif;
    font-size: 1.35rem;
    font-weight: 700;
    color: #3d1a2e;
    text-decoration: none;
    letter-spacing: -0.01em;
  }
  .logo-icon { font-size: 1.5rem; }
  .logo-accent { color: #c2856a; }

  .search-bar {
    flex: 1;
    max-width: 420px;
    position: relative;
    display: flex;
    align-items: center;
  }
  .search-icon {
    position: absolute;
    left: 14px;
    color: #b48ea8;
    pointer-events: none;
  }
  .search-bar input {
    width: 100%;
    padding: 0.55rem 1rem 0.55rem 2.6rem;
    border: 1.5px solid #ead6e4;
    border-radius: 50px;
    font-size: 0.88rem;
    color: #3d1a2e;
    background: #fdf5f9;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .search-bar input::placeholder { color: #c2a0b8; }
  .search-bar input:focus {
    border-color: #d4a0b8;
    box-shadow: 0 0 0 3px rgba(180,130,160,0.12);
    background: #fff;
  }

  .navbar-right {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    flex-shrink: 0;
  }

  .icon-btn {
    position: relative;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #fdf0f5;
    border: 1.5px solid #f0dde8;
    border-radius: 50%;
    cursor: pointer;
    color: #9b6b8a;
    transition: background 0.2s, color 0.2s, transform 0.15s;
  }
  .icon-btn:hover { background: #f5d6e8; color: #7a3d5e; transform: scale(1.05); }

  .badge {
    position: absolute;
    top: -3px;
    right: -3px;
    background: #d4516e;
    color: #fff;
    font-size: 0.65rem;
    font-weight: 700;
    width: 17px;
    height: 17px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid #fff;
  }
  .badge.gold { background: #c2856a; }

  .avatar {
    position: relative;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 2.5px solid #d4a0b8;
    cursor: pointer;
    overflow: hidden;
    transition: border-color 0.2s, transform 0.15s;
  }
  .avatar:hover { border-color: #c2856a; transform: scale(1.05); }
  .avatar img { width: 100%; height: 100%; object-fit: cover; }
  .avatar-status {
    position: absolute;
    bottom: 1px;
    right: 1px;
    width: 9px;
    height: 9px;
    background: #4caf7d;
    border-radius: 50%;
    border: 2px solid #fff;
  }

  @media (max-width: 768px) {
    .hamburger { display: flex; }
    .search-bar { max-width: 200px; }
    .notify-btn { display: none; }
  }
  @media (max-width: 480px) {
    .navbar { padding: 0 1rem; }
    .logo-text { display: none; }
    .search-bar { max-width: 160px; }
  }
</style>
