import { useEffect, useState } from 'react';

type Screen = 'home' | 'studio' | 'photos' | 'family' | 'experiments' | 'settings';
type Glyph = 'home' | 'studio' | 'photos' | 'family' | 'experiments' | 'settings' | 'back';
type Theme = 'dark' | 'light';

const sections: Array<{
  id: Exclude<Screen, 'home' | 'settings'>;
  title: string;
  subtitle: string;
  icon: Glyph;
}> = [
  { id: 'studio', title: '808 Studio', subtitle: 'Make some noise', icon: 'studio' },
  { id: 'photos', title: 'Photo Library', subtitle: 'Explore the archive', icon: 'photos' },
  { id: 'family', title: 'Family Tree', subtitle: 'Follow the connections', icon: 'family' },
  { id: 'experiments', title: 'Experiments', subtitle: 'Try something new', icon: 'experiments' },
];

const screens: Screen[] = ['home', 'studio', 'photos', 'family', 'experiments', 'settings'];

function getScreen(): Screen {
  const value = window.location.hash.replace(/^#\/?/, '');
  return screens.includes(value as Screen) ? (value as Screen) : 'home';
}

function getStoredTheme(): Theme {
  try {
    return window.localStorage.getItem('erics-lab-theme') === 'light' ? 'light' : 'dark';
  } catch {
    return 'dark';
  }
}

function Icon({ name, size = 23 }: { name: Glyph; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      {name === 'home' && <><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" /><path d="M9 21v-8h6v8" /></>}
      {name === 'studio' && <><path d="M3 9v6M7 5v14M11 8v8M15 3v18M19 7v10M23 10v4" /></>}
      {name === 'photos' && <><rect x="3" y="4" width="18" height="16" rx="3" /><circle cx="8.3" cy="9" r="1.6" /><path d="m4 17 5-5 4 4 3-3 5 5" /></>}
      {name === 'family' && <><circle cx="12" cy="5" r="3" /><circle cx="5" cy="19" r="2.5" /><circle cx="19" cy="19" r="2.5" /><path d="M12 8v4M5 16v-4h14v4" /></>}
      {name === 'experiments' && <><path d="M9 3h6M10 3v7L4.5 19a2 2 0 0 0 1.7 3h11.6a2 2 0 0 0 1.7-3L14 10V3" /><path d="M8 16h8" /></>}
      {name === 'settings' && <><path d="M4 7h16M4 17h16" /><circle cx="9" cy="7" r="3" fill="var(--surface)" /><circle cx="16" cy="17" r="3" fill="var(--surface)" /></>}
      {name === 'back' && <><path d="m14 5-7 7 7 7" /></>}
    </svg>
  );
}

function App() {
  const [screen, setScreen] = useState<Screen>(getScreen);
  const [theme, setTheme] = useState<Theme>(getStoredTheme);
  const [steps, setSteps] = useState<number[]>([0, 4, 8, 12]);
  const [colorIndex, setColorIndex] = useState(0);
  const colors = ['#6ee7ca', '#a5a0ff', '#ffc488', '#fb8daf', '#7dd3fc'];

  useEffect(() => {
    const onHashChange = () => setScreen(getScreen());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      window.localStorage.setItem('erics-lab-theme', theme);
    } catch {
      // Private browsing can prevent local storage.
    }
  }, [theme]);

  function navigate(next: Screen) {
    window.location.hash = '/' + next;
    setScreen(next);
  }

  function toggleStep(index: number) {
    setSteps((current) =>
      current.includes(index) ? current.filter((step) => step !== index) : [...current, index]
    );
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="wordmark" onClick={() => navigate('home')} aria-label="Eric's Lab home">
          <span className="brand-mark">e<span>·</span></span>
          <span>LAB</span>
        </button>
        <span className="topbar-status"><span className="status-dot" /> VERSION 01</span>
        <button className="icon-button" onClick={() => navigate('settings')} aria-label="Settings">
          <Icon name="settings" />
        </button>
      </header>

      <main id="main" className="main-content">
        {screen === 'home' && (
          <section className="home-screen" aria-labelledby="home-heading">
            <div className="home-intro">
              <p className="eyebrow">WELCOME TO THE LAB</p>
              <h1 id="home-heading">Things to <em>play</em> with.</h1>
              <p className="subline">Your ideas. One tap away.</p>
            </div>
            <div className="module-grid">
              {sections.map((section) => (
                <button key={section.id} className={'module-card card-' + section.id}
                  onClick={() => navigate(section.id)}
                  aria-label={'Open ' + section.title}>
                  <span className="card-icon"><Icon name={section.icon} size={32} /></span>
                  <span className="card-copy">
                    <strong>{section.title}</strong>
                    <small>{section.subtitle}</small>
                  </span>
                  <span className="card-arrow" aria-hidden="true">↗</span>
                </button>
              ))}
            </div>
            <p className="home-footnote">MADE FOR HANDS, NOT SCROLLBARS.</p>
          </section>
        )}

        {screen === 'studio' && (
          <section className="detail-screen" aria-labelledby="studio-heading">
            <div className="section-header">
              <button className="back-button" onClick={() => navigate('home')} aria-label="Back to home">
                <Icon name="back" size={20} />
              </button>
              <span className="eyebrow">MUSIC / CONTROL SURFACE</span>
            </div>
            <h1 id="studio-heading">808 Studio<span className="accent-period">.</span></h1>
            <p className="detail-copy">Tap a few steps. This is an interface sketch; the audio engine stays in your main website until we connect it.</p>
            <div className="sequencer-preview" aria-label="Interactive sequencer layout sketch">
              <div className="sequencer-title"><span>STEP PATTERN</span><span>16 STEPS</span></div>
              <div className="step-grid">
                {Array.from({ length: 16 }, (_, index) => (
                  <button key={index} className={'step-button' + (steps.includes(index) ? ' active' : '')}
                    aria-label={'Step ' + (index + 1)} aria-pressed={steps.includes(index)}
                    onClick={() => toggleStep(index)}>
                    <span>{index + 1}</span>
                  </button>
                ))}
              </div>
              <p className="preview-note">Visual prototype only — no audio playback yet.</p>
            </div>
            <p className="bottom-hint">The existing 808 implementation stays in ericoij.com.</p>
          </section>
        )}

        {screen === 'photos' && (
          <section className="detail-screen" aria-labelledby="photos-heading">
            <div className="section-header">
              <button className="back-button" onClick={() => navigate('home')} aria-label="Back to home">
                <Icon name="back" size={20} />
              </button>
              <span className="eyebrow">MEDIA / EXPLORER</span>
            </div>
            <h1 id="photos-heading">Photo Library<span className="accent-period">.</span></h1>
            <p className="detail-copy">A home for the photos already on your website. We'll connect the source rather than duplicate the collection.</p>
            <div className="photo-illustration" aria-label="Abstract gallery layout preview">
              <div className="photo-block pb-1" /><div className="photo-block pb-2" />
              <div className="photo-block pb-3" /><div className="photo-block pb-4" />
              <div className="photo-block pb-5" />
            </div>
            <p className="bottom-hint">Gallery connection is next. No sample photos are being presented as yours.</p>
          </section>
        )}

        {screen === 'family' && (
          <section className="detail-screen" aria-labelledby="family-heading">
            <div className="section-header">
              <button className="back-button" onClick={() => navigate('home')} aria-label="Back to home">
                <Icon name="back" size={20} />
              </button>
              <span className="eyebrow">HISTORY / CONNECTIONS</span>
            </div>
            <h1 id="family-heading">Family Tree<span className="accent-period">.</span></h1>
            <p className="detail-copy">A future pinch-and-pan explorer for your family's story — without squeezing the tree into a scrolling page.</p>
            <svg className="family-art" viewBox="0 0 320 200" role="img" aria-label="Generic branching diagram concept">
              <path d="M160 34V70M76 113V80H244V113M76 135V153M244 135V153" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
              <circle cx="160" cy="27" r="20" /><circle cx="76" cy="121" r="20" />
              <circle cx="244" cy="121" r="20" /><circle cx="76" cy="175" r="17" />
              <circle cx="244" cy="175" r="17" />
            </svg>
            <p className="bottom-hint">Illustration only; no family data is included in this prototype.</p>
          </section>
        )}

        {screen === 'experiments' && (
          <section className="detail-screen" aria-labelledby="experiments-heading">
            <div className="section-header">
              <button className="back-button" onClick={() => navigate('home')} aria-label="Back to home">
                <Icon name="back" size={20} />
              </button>
              <span className="eyebrow">IDEAS / PLAYGROUND</span>
            </div>
            <h1 id="experiments-heading">Experiments<span className="accent-period">.</span></h1>
            <p className="detail-copy">A tiny interaction experiment to test how the app feels under your thumb.</p>
            <div className="color-experiment">
              <div className="color-orb" style={{ background: colors[colorIndex] }} aria-label="Current color swatch" />
              <button className="action-button" onClick={() => setColorIndex((index) => (index + 1) % colors.length)}>
                Change the color <span aria-hidden="true">↗</span>
              </button>
            </div>
            <p className="bottom-hint">Every tap stays inside the app, with no page refresh.</p>
          </section>
        )}

        {screen === 'settings' && (
          <section className="detail-screen" aria-labelledby="settings-heading">
            <div className="section-header">
              <button className="back-button" onClick={() => navigate('home')} aria-label="Back to home">
                <Icon name="back" size={20} />
              </button>
              <span className="eyebrow">PREFERENCES</span>
            </div>
            <h1 id="settings-heading">Settings<span className="accent-period">.</span></h1>
            <p className="detail-copy">Make the lab your own.</p>
            <div className="settings-panel">
              <p className="field-label">APPEARANCE</p>
              <div className="theme-switch" role="group" aria-label="Color theme">
                <button onClick={() => setTheme('dark')} aria-pressed={theme === 'dark'}
                  className={theme === 'dark' ? 'selected' : ''}>Dark</button>
                <button onClick={() => setTheme('light')} aria-pressed={theme === 'light'}
                  className={theme === 'light' ? 'selected' : ''}>Light</button>
              </div>
              <div className="settings-divider" />
              <p className="field-label">ADD TO YOUR IPHONE</p>
              <p className="settings-instructions">Open the deployed app in Safari. Tap Share → Add to Home Screen → Open as Web App → Add.</p>
            </div>
            <p className="bottom-hint">No account, tracking, or personal data required.</p>
          </section>
        )}
      </main>

      <nav className="tabbar" aria-label="Main navigation">
        {([
          ['home', 'Home'],
          ['studio', 'Studio'],
          ['photos', 'Photos'],
          ['settings', 'Settings'],
        ] as const).map(([id, label]) => (
          <button key={id} onClick={() => navigate(id)}
            className={'tab-button' + (screen === id ? ' tab-active' : '')}
            aria-current={screen === id ? 'page' : undefined}>
            <Icon name={id} size={22} />
            <span>{label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

export default App;
