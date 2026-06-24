<script>
  const stats = [
    {
      label: 'Total Flowers',
      value: '1,284',
      change: '+8.2%',
      positive: true,
      icon: '🌸',
      color: '#e8b4cc',
      bg: 'linear-gradient(135deg, #fdf0f7, #f8e0ee)',
      border: '#f0c8dc',
    },
    {
      label: 'Premium Collections',
      value: '64',
      change: '+3 new',
      positive: true,
      icon: '✨',
      color: '#b89fd8',
      bg: 'linear-gradient(135deg, #f5f0fc, #ede0f8)',
      border: '#d8c8f0',
    },
    {
      label: 'Total Orders',
      value: '3,742',
      change: '+12.5%',
      positive: true,
      icon: '📦',
      color: '#c2856a',
      bg: 'linear-gradient(135deg, #fef5f0, #fce8dc)',
      border: '#f0d0c0',
    },
    {
      label: 'Revenue',
      value: '₹8.4L',
      change: '+18.9%',
      positive: true,
      icon: '💰',
      color: '#b8a040',
      bg: 'linear-gradient(135deg, #fdfaed, #f8f0cc)',
      border: '#e8d880',
    },
  ];
</script>

<div class="stats-grid">
  {#each stats as stat}
    <div class="stat-card" style="background: {stat.bg}; border-color: {stat.border};">
      <div class="stat-top">
        <div class="stat-icon" style="color: {stat.color};">{stat.icon}</div>
        <span class="stat-change" class:positive={stat.positive} class:negative={!stat.positive}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            {#if stat.positive}
              <polyline points="18 15 12 9 6 15"/>
            {:else}
              <polyline points="6 9 12 15 18 9"/>
            {/if}
          </svg>
          {stat.change}
        </span>
      </div>
      <div class="stat-value">{stat.value}</div>
      <div class="stat-label">{stat.label}</div>
      <div class="stat-bar">
        <div class="stat-bar-fill" style="background: {stat.color};"></div>
      </div>
    </div>
  {/each}
</div>

<style>
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1.25rem;
    margin-bottom: 2rem;
  }

  .stat-card {
    border: 1.5px solid;
    border-radius: 18px;
    padding: 1.4rem 1.3rem 1.1rem;
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
    transition: transform 0.22s, box-shadow 0.22s;
    cursor: default;
  }
  .stat-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 30px rgba(150,80,120,0.1);
  }

  .stat-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.6rem;
  }

  .stat-icon {
    font-size: 1.75rem;
    line-height: 1;
  }

  .stat-change {
    display: flex;
    align-items: center;
    gap: 3px;
    font-size: 0.73rem;
    font-weight: 600;
    padding: 3px 8px;
    border-radius: 20px;
  }
  .stat-change.positive { color: #2e7d52; background: rgba(46,125,82,0.1); }
  .stat-change.negative { color: #c62828; background: rgba(198,40,40,0.1); }

  .stat-value {
    font-family: 'Georgia', serif;
    font-size: 1.85rem;
    font-weight: 700;
    color: #2d0f23;
    line-height: 1.1;
  }

  .stat-label {
    font-size: 0.8rem;
    color: #9b6b8a;
    font-weight: 500;
    margin-top: 0.1rem;
    margin-bottom: 0.85rem;
  }

  .stat-bar {
    height: 3px;
    background: rgba(0,0,0,0.07);
    border-radius: 10px;
    overflow: hidden;
  }
  .stat-bar-fill {
    height: 100%;
    width: 68%;
    border-radius: 10px;
    opacity: 0.7;
  }

  @media (max-width: 1024px) {
    .stats-grid { grid-template-columns: repeat(2, 1fr); }
  }
  @media (max-width: 500px) {
    .stats-grid { grid-template-columns: 1fr 1fr; gap: 0.75rem; }
    .stat-value { font-size: 1.5rem; }
  }
</style>
