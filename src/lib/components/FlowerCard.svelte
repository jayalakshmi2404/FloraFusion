<script>
  export let flower = {};

  let isFavorite = flower.favorited || false;
  let addedToCart = false;

  function toggleFavorite() {
    isFavorite = !isFavorite;
  }

  function addToCart() {
    addedToCart = true;
    setTimeout(() => (addedToCart = false), 1800);
  }

  function renderStars(rating) {
    return Array.from({ length: 5 }, (_, i) => i < Math.floor(rating) ? 'full' : i < rating ? 'half' : 'empty');
  }
</script>

<div class="flower-card">
  <div class="card-image-wrap">
    <img src={flower.image} alt={flower.name} loading="lazy" class="card-img" />
    <div class="card-overlay"></div>

    <button class="fav-btn" class:active={isFavorite} on:click={toggleFavorite} aria-label="Favourite">
      <svg width="17" height="17" viewBox="0 0 24 24" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" stroke-width="2">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
    </button>

    {#if flower.badge}
      <span class="card-badge">{flower.badge}</span>
    {/if}
  </div>

  <div class="card-body">
    <div class="card-meta">
      <span class="card-category">{flower.category}</span>
      <div class="card-stars">
        {#each renderStars(flower.rating) as star}
          <span class="star {star}">
            {#if star === 'full'}★{:else if star === 'half'}½{:else}☆{/if}
          </span>
        {/each}
        <span class="rating-count">({flower.reviews})</span>
      </div>
    </div>

    <h3 class="card-name">{flower.name}</h3>
    <p class="card-desc">{flower.description}</p>

    <div class="card-footer">
      <div class="card-price">
        <span class="price-label">From</span>
        <span class="price-value">₹{flower.price.toLocaleString('en-IN')}</span>
      </div>
      <button class="cart-btn" class:added={addedToCart} on:click={addToCart}>
        {#if addedToCart}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          Added
        {:else}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 0 1-8 0"/>
          </svg>
          Add to Cart
        {/if}
      </button>
    </div>
  </div>
</div>

<style>
  .flower-card {
    background: #fff;
    border: 1.5px solid #f0dde8;
    border-radius: 20px;
    overflow: hidden;
    transition: transform 0.28s cubic-bezier(.4,0,.2,1), box-shadow 0.28s;
    cursor: default;
  }
  .flower-card:hover {
    transform: translateY(-6px) scale(1.01);
    box-shadow: 0 16px 48px rgba(150,60,100,0.14);
    border-color: #e8c0d0;
  }

  .card-image-wrap {
    position: relative;
    height: 200px;
    overflow: hidden;
  }
  .card-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.4s cubic-bezier(.4,0,.2,1);
  }
  .flower-card:hover .card-img { transform: scale(1.07); }

  .card-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, transparent 40%, rgba(45,15,35,0.35));
    pointer-events: none;
  }

  .fav-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    width: 34px; height: 34px;
    border-radius: 50%;
    border: none;
    background: rgba(255,255,255,0.88);
    backdrop-filter: blur(6px);
    color: #c0687e;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    transition: transform 0.2s, background 0.2s, color 0.2s;
  }
  .fav-btn:hover { transform: scale(1.15); background: #fff; }
  .fav-btn.active { color: #d4516e; background: #fff0f3; }

  .card-badge {
    position: absolute;
    top: 10px;
    left: 10px;
    background: linear-gradient(135deg, #c2856a, #d4608a);
    color: #fff;
    font-size: 0.65rem;
    font-weight: 700;
    padding: 3px 10px;
    border-radius: 20px;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  .card-body {
    padding: 1.1rem 1.15rem 1.25rem;
  }

  .card-meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.5rem;
  }

  .card-category {
    font-size: 0.68rem;
    font-weight: 600;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    color: #b48ea8;
  }

  .card-stars {
    display: flex;
    align-items: center;
    gap: 1px;
  }
  .star { font-size: 0.75rem; line-height: 1; }
  .star.full { color: #c2856a; }
  .star.half { color: #c2856a; }
  .star.empty { color: #ddd; }
  .rating-count { font-size: 0.68rem; color: #b48ea8; margin-left: 3px; }

  .card-name {
    font-family: 'Georgia', serif;
    font-size: 1.05rem;
    font-weight: 700;
    color: #2d0f23;
    margin: 0 0 0.35rem;
    line-height: 1.3;
  }

  .card-desc {
    font-size: 0.8rem;
    color: #9b6b8a;
    line-height: 1.55;
    margin: 0 0 1rem;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .card-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
  }

  .card-price {
    display: flex;
    flex-direction: column;
  }
  .price-label { font-size: 0.65rem; color: #b48ea8; letter-spacing: 0.04em; text-transform: uppercase; }
  .price-value { font-family: 'Georgia', serif; font-size: 1.15rem; font-weight: 700; color: #2d0f23; }

  .cart-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 50px;
    background: linear-gradient(135deg, #3d1a2e, #5a2840);
    color: #f5e0ef;
    font-size: 0.78rem;
    font-weight: 600;
    cursor: pointer;
    transition: opacity 0.2s, transform 0.15s, background 0.25s;
    white-space: nowrap;
  }
  .cart-btn:hover { opacity: 0.88; transform: scale(1.03); }
  .cart-btn.added {
    background: linear-gradient(135deg, #2e7d52, #3a9460);
  }
</style>
