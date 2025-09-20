
import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import Hero from './components/Hero';
import Clients from './components/Clients';
import Features from './components/Features';
import Analytics from './components/Analytics';
import Stats from './components/Stats';
import MoreFeatures from './components/MoreFeatures';
import About from './components/About';
import Footer from './components/Footer';
import Dashboard from './dashbord';
import Login from './components/Login';
import Registration from './components/Registration';
import OtpVerification from './components/OtpVerification';
import { SiteContent, NavLink, Sublink } from './types';
import ImageSlider from './components/ImageSlider';
import PageView from './components/PageView';
import CtaLogin from './components/CtaLogin';


/**
 * Simple object check.
 * @param item
 * @returns {boolean}
 */
const isObject = (item: any): item is Record<string, any> => {
  return (item && typeof item === 'object' && !Array.isArray(item));
};

/**
 * Deep merge two objects.
 * @param target
 * @param source
 */
const mergeDeep = (target: Record<string, any>, source: Record<string, any>): Record<string, any> => {
  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) {
          Object.assign(target, { [key]: {} });
        }
        mergeDeep(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }
  return target;
};


const ModernShowcase: React.FC<{ slides: string[] }> = ({ slides }) => {
    if (!slides || slides.length === 0) {
        return null;
    }

    return (
        <div className="w-full flex items-center justify-center py-12">
            <div className="relative w-full max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-4xl mx-auto">
                <div className="aspect-video w-full rounded-xl shadow-2xl overflow-hidden">
                    <ImageSlider slides={slides} />
                </div>
            </div>
        </div>
    )
};


interface SoftwareShowcaseProps {
  content: SiteContent['softwareShowcase'];
}

const SoftwareShowcase: React.FC<SoftwareShowcaseProps> = ({ content }) => {
  return (
    <section className="py-20 overflow-hidden bg-[var(--color-background)]">
      <div className="container mx-auto px-6">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-[var(--color-text-primary)]">{content.title}</h2>
          <p className="mt-2 max-w-2xl mx-auto text-[var(--color-text-secondary)]">{content.subtitle}</p>
          <div className="w-24 h-1 mx-auto mt-4 rounded-full bg-[var(--color-primary)]"></div>
        </div>
        <ModernShowcase slides={content.slides || []} />
      </div>
    </section>
  );
};

const App: React.FC = () => {
  const [view, setView] = useState<'homepage' | 'login' | 'dashboard' | 'registration' | 'otp_verification' | 'cta_login'>('homepage');
  const [siteContent, setSiteContent] = useState<SiteContent | null>(null);
  const [currentPage, setCurrentPage] = useState<NavLink | Sublink | null>(null);
  const [registrationData, setRegistrationData] = useState<{ mobile: string } | null>(null);

  // Effect for initial content loading
  useEffect(() => {
    const fetchSiteContent = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/sites/1/full');
        if (!response.ok) {
          throw new Error('Failed to fetch site content');
        }
        const dbContent = await response.json();
        
        // The data from the backend is now the source of truth.
        // We can still use localStorage to persist user edits from the dashboard.
        let contentToLoad: SiteContent;
        const savedContent = localStorage.getItem('siteContent');

        if (savedContent) {
          try {
            const parsedContent = JSON.parse(savedContent);
            // We merge the content from DB with the locally saved content.
            // This allows user edits to be preserved on refresh, but it might get complex.
            // A simpler approach for now is to prioritize DB content on initial load.
            contentToLoad = mergeDeep(dbContent, parsedContent) as SiteContent;

          } catch (error) {
            console.error("Could not parse site content from localStorage, falling back to DB data.", error);
            contentToLoad = dbContent;
          }
        } else {
          contentToLoad = dbContent;
        }

        setSiteContent(contentToLoad);
        localStorage.setItem('siteContent', JSON.stringify(contentToLoad));

      } catch (error) {
        console.error("Error fetching site content:", error);
        // Fallback to local storage if API fails
        const savedContent = localStorage.getItem('siteContent');
        if (savedContent) {
          setSiteContent(JSON.parse(savedContent));
        } else {
            // Maybe show an error page if API and local storage fail
            console.error("No site content available.");
        }
      }
    };

    fetchSiteContent();

    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn === 'true') {
      setView('dashboard');
    }
  }, []);

  // Effect for applying theme and body classes whenever siteContent or view changes
  useEffect(() => {
    if (!siteContent) return;

    const body = document.body;
    body.className = ''; // Reset all classes first

    // 1. Apply Theme
    const theme = siteContent.theme || 'default';
    let customStyleTag = document.getElementById('custom-theme-styles');

    if (theme === 'custom' && siteContent.themeColors) {
      if (!customStyleTag) {
        customStyleTag = document.createElement('style');
        customStyleTag.id = 'custom-theme-styles';
        document.head.appendChild(customStyleTag);
      }
      
      const colors = siteContent.themeColors;
      customStyleTag.innerHTML = `
        :root, body {
            --color-primary: ${colors.primary};
            --color-primary-hover: ${colors.primaryHover};
            --color-secondary: ${colors.secondary};
            --color-background: ${colors.background};
            --color-card-background: ${colors.cardBackground};
            --color-border: ${colors.border};
            --color-text-primary: ${colors.textPrimary};
            --color-text-secondary: ${colors.textSecondary};
            --color-text-on-primary: ${colors.textOnPrimary};
            --color-hero-gradient: ${colors.heroGradient};
        }
      `;
    } else {
      if (customStyleTag) {
        customStyleTag.innerHTML = ''; // Clear custom styles if not using a custom theme
      }
      body.classList.add(`theme-${theme}`);
    }

    // 2. Apply view-specific background
    if (view === 'login' || view === 'dashboard' || view === 'registration' || view === 'otp_verification' || view === 'cta_login') {
      body.classList.add('bg-gray-100');
    } else {
      // For homepage, the background is controlled by the CSS variable
      body.style.backgroundColor = 'var(--color-background)';
    }

  }, [siteContent, view]);

  const handleNavigateFromDashboard = (page: NavLink | Sublink) => {
    setCurrentPage(page);
    setView('homepage');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToHomepage = () => {
    setCurrentPage(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (page: NavLink | Sublink) => {
    if (page.href === '/') {
        goToHomepage();
        return;
    }
    if(page.content && page.content.trim() !== '<p><br></p>' && page.content.trim() !== '') {
        setCurrentPage(page);
        window.scrollTo(0, 0);
    }
  };

  if (!siteContent) {
    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="text-xl font-semibold">درحال بارگذاری...</div>
        </div>
    );
  }

  if (view === 'login') {
    return <Login 
              onLoginSuccess={() => {
                localStorage.setItem('isLoggedIn', 'true');
                setView('dashboard');
              }} 
              onBack={() => { setView('homepage'); goToHomepage(); }}
              onGoToRegister={() => setView('registration')}
           />;
  }

  if (view === 'registration') {
    return <Registration 
              onRegisterSuccess={(data) => { setRegistrationData(data); setView('otp_verification'); }} 
              onBack={() => { setView('homepage'); goToHomepage(); }} 
              onGoToLogin={() => setView('cta_login')}
           />;
  }

  if (view === 'cta_login') {
    return <CtaLogin 
              onBack={() => { setView('homepage'); goToHomepage(); }}
              onGoToRegister={() => setView('registration')}
           />;
  }

  if (view === 'otp_verification' && registrationData) {
    return <OtpVerification 
              mobile={registrationData.mobile} 
              onVerificationSuccess={() => { 
                // Mock login after successful OTP
                localStorage.setItem('isLoggedIn', 'true'); 
                setView('dashboard'); 
              }} 
              onBack={() => setView('registration')} 
              onGoToLogin={() => setView('login')}
           />;
  }

  if (view === 'dashboard' && siteContent) {
    return <Dashboard 
            setView={setView} 
            siteContent={siteContent} 
            setSiteContent={setSiteContent}
            onNavigateFromDashboard={handleNavigateFromDashboard}
           />;
  }

  return (
    <div style={{ color: 'var(--color-text-primary)', backgroundColor: 'var(--color-background)' }} className="flex flex-col min-h-screen">
      <Header 
        setView={setView} 
        navLinks={siteContent.header.navLinks} 
        onNavigate={handleNavigate}
        onGoHome={goToHomepage}
      />
      <main className="flex-grow pt-20 flex flex-col">
        {currentPage ? (
          <PageView page={currentPage} />
        ) : (
          <>
            <Hero content={siteContent.hero} onCtaClick={() => setView('registration')} />
            <SoftwareShowcase content={siteContent.softwareShowcase} />
            <Clients content={siteContent.clients} />
            <Features content={siteContent.features} />
            <Analytics content={siteContent.analytics} />
            <Stats content={siteContent.stats} />
            <MoreFeatures content={siteContent.moreFeatures} />
            <About content={siteContent.about} />
          </>
        )}
      </main>
      <Footer content={siteContent.footer} />
    </div>
  );
};

export default App;
