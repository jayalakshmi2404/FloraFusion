<script>
  const currentYear = new Date().getFullYear();

  const socials = [
    {
      name: 'Instagram',
      href: '#',
      icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>`,
    },
    {
      name: 'Pinterest',
      href: '#',
      icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2C6.48 2 2 6.48 2 12c0 4.24 2.65 7.86 6.39 9.29-.09-.78-.17-1.98.04-2.83.18-.77 1.23-5.2 1.23-5.2s-.31-.63-.31-1.56c0-1.46.85-2.55 1.9-2.55.9 0 1.34.67 1.34 1.48 0 .9-.57 2.26-.87 3.51-.25 1.05.52 1.9 1.55 1.9 1.86 0 3.11-2.39 3.11-5.22 0-2.15-1.45-3.75-4.06-3.75-2.96 0-4.79 2.21-4.79 4.66 0 .84.24 1.44.62 1.89.17.2.19.28.13.51-.04.17-.14.58-.18.74-.06.24-.24.32-.44.23-1.24-.51-1.82-1.87-1.82-3.4 0-2.52 2.12-5.54 6.32-5.54 3.38 0 5.61 2.45 5.61 5.08 0 3.48-1.93 6.08-4.77 6.08-.95 0-1.85-.51-2.16-1.09l-.59 2.26c-.18.69-.55 1.39-.88 1.93.79.24 1.62.37 2.49.37 5.52 0 10-4.48 10-10S17.52 2 12 2z"/></svg>`,
    },
    {
      name: 'Facebook',
      href: '#',
      icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>`,
    },
    {
      name: 'Twitter',
      href: '#',
      icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></svg>`,
    },
  ];

  const links = {
    'Shop': ['Premium Flowers', 'Bouquets', 'Occasions', 'Rare Collection'],
    'Company': ['About Us', 'Careers', 'Press', 'Blog'],
    'Support': ['FAQ', 'Shipping', 'Returns', 'Contact'],
  };
</script>

<footer class="footer">
  <div class="footer-top">
    <div class="footer-brand">
      <div class="footer-logo">
        <span class="logo-icon">🌸</span>
        <span class="logo-text">Flora<span class="logo-accent">Fusion</span></span>
      </div>
      <p class="footer-tagline">
        Curating the world's most extraordinary blooms for life's most precious moments.
      </p>
      <div class="social-row">
        {#each socials as social}
          <a href={social.href} class="social-link" aria-label={social.name}>
            {@html social.icon}
          </a>
        {/each}
      </div>
    </div>

    <div class="footer-links">
      {#each Object.entries(links) as [section, items]}
        <div class="link-col">
          <div class="link-section">{section}</div>
          {#each items as item}
            <a href="#" class="footer-link">{item}</a>
          {/each}
        </div>
      {/each}
    </div>
  </div>

  <div class="footer-bottom">
    <p class="copyright">© {currentYear} FloraFusion. All rights reserved. Crafted with 🌹 in India.</p>
    <div class="legal-links">
      <a href="#" class="legal-link">Privacy Policy</a>
      <span>·</span>
      <a href="#" class="legal-link">Terms of Service</a>
      <span>·</span>
      <a href="#" class="legal-link">Cookie Policy</a>
    </div>
  </div>
</footer>

<style>
  .footer {
    background: linear-gradient(180deg, #2d0f23, #1e0818);
    color: rgba(245,220,235,0.7);
    padding: 3rem 2rem 1.5rem;
    margin-top: 3rem;
  }

  .footer-top {
    display: flex;
    gap: 3rem;
    padding-bottom: 2.5rem;
    border-bottom: 1px solid rgba(255,255,255,0.07);
    flex-wrap: wrap;
  }

  .footer-brand {
    flex: 0 0 260px;
    max-width: 260px;
  }

  .footer-logo {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-family: 'Georgia', serif;
    font-size: 1.2rem;
    font-weight: 700;
    color: #f5e6ef;
    margin-bottom: 0.85rem;
  }
  .logo-icon { font-size: 1.4rem; }
  .logo-accent { color: #c2856a; }

  .footer-tagline {
    font-size: 0.82rem;
    line-height: 1.65;
    color: rgba(245,220,235,0.55);
    margin: 0 0 1.25rem;
  }

  .social-row {
    display: flex;
    gap: 0.5rem;
  }
  .social-link {
    width: 36px; height: 36px;
    display: flex; align-items: center; justify-content: center;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 10px;
    color: rgba(245,220,235,0.6);
    text-decoration: none;
    transition: background 0.2s, color 0.2s, transform 0.15s;
  }
  .social-link:hover { background: rgba(194,133,106,0.3); color: #f5d6c8; transform: translateY(-2px); }

  .footer-links {
    flex: 1;
    display: flex;
    gap: 2.5rem;
    flex-wrap: wrap;
  }

  .link-col {
    display: flex;
    flex-direction: column;
    gap: 0.55rem;
    min-width: 100px;
  }

  .link-section {
    font-size: 0.72rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    font-weight: 700;
    color: rgba(245,220,235,0.9);
    margin-bottom: 0.3rem;
  }

  .footer-link {
    font-size: 0.82rem;
    color: rgba(245,220,235,0.5);
    text-decoration: none;
    transition: color 0.2s;
  }
  .footer-link:hover { color: #f5d6c8; }

  .footer-bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 0.75rem;
    padding-top: 1.5rem;
    font-size: 0.78rem;
  }

  .copyright { color: rgba(245,220,235,0.35); }

  .legal-links {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: rgba(245,220,235,0.25);
  }
  .legal-link { color: rgba(245,220,235,0.4); text-decoration: none; transition: color 0.2s; }
  .legal-link:hover { color: #f5d6c8; }

  @media (max-width: 640px) {
    .footer-brand { max-width: 100%; flex: 1 1 100%; }
    .footer-bottom { flex-direction: column; align-items: flex-start; }
  }
</style>
