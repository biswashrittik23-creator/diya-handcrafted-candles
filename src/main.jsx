import { StrictMode, useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowRight, Check, Moon, Sparkles, Sun, X } from 'lucide-react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, Sparkles as ThreeSparkles } from '@react-three/drei';
import * as THREE from 'three';
import './styles.css';

const categories = [
  { name: 'Signature jars', count: '12 candles', accent: 'saffron' },
  { name: 'Festive gifting', count: '08 collections', accent: 'coral' },
  { name: 'Daily rituals', count: '06 candles', accent: 'sage' },
];

const products = [
  { name: 'Mogra & Moonlight', detail: 'DHC-101', price: '₹600', tone: 'cream', category: 'Signature jars', image: 'WhatsApp Image 2026-09-29 at 11.17.31 PM.jpeg' },
  { name: 'Rosewood Chai', detail: 'DHC-102', price: '₹600', tone: 'rose', category: 'Festive gifting', image: 'WhatsApp Image 2026-09-29 at 11.17.31 PM (1).jpeg' },
  { name: 'Coconut Grove', detail: 'DHC-103', price: '₹300', tone: 'green', category: 'Daily rituals', image: 'WhatsApp Image 2026-09-29 at 11.16.56 PM.jpeg' },
  { name: 'Sandalwood Dusk', detail: 'DHC-104', price: '₹700', tone: 'cream', category: 'Signature jars', image: 'WhatsApp Image 2026-09-29 at 11.15.55 PM.jpeg' },
  { name: 'Pink Petals', detail: 'DHC-105', price: '₹700', tone: 'rose', category: 'Festive gifting', image: 'WhatsApp Image 2026-09-29 at 11.15.55 PM (1).jpeg' },
  { name: 'Quiet Morning', detail: 'DHC-106', price: '₹130', tone: 'green', category: 'Daily rituals', image: 'WhatsApp Image 2026-09-29 at 11.12.36 PM.jpeg' },
  { name: 'Marigold Sun', detail: 'DHC-107', price: '₹140', tone: 'cream', category: 'Signature jars', image: 'WhatsApp Image 2026-09-29 at 11.12.36 PM (1).jpeg' },
  { name: 'Rose Attar', detail: 'DHC-108', price: '₹130', tone: 'rose', category: 'Festive gifting', image: 'WhatsApp Image 2026-09-29 at 11.12.35 PM.jpeg' },
  { name: 'Vanilla Cloud', detail: 'DHC-109', price: '₹130', tone: 'green', category: 'Daily rituals', image: 'dhc-109-clean.jpeg' },
  { name: 'Amber Diya', detail: 'DHC-110', price: '₹130', tone: 'cream', category: 'Signature jars', image: 'WhatsApp Image 2026-09-29 at 11.12.35 PM (2).jpeg' },
  { name: 'Champa Glow', detail: 'DHC-111', price: '₹140', tone: 'rose', category: 'Festive gifting', image: 'WhatsApp Image 2026-09-29 at 11.12.34 PM.jpeg' },
  { name: 'Green Tea Ritual', detail: 'DHC-112', price: '₹130', tone: 'green', category: 'Daily rituals', image: 'WhatsApp Image 2026-09-29 at 11.12.34 PM (1).jpeg' },
  { name: 'Moonlit Jasmine', detail: 'DHC-113', price: '₹130', tone: 'cream', category: 'Signature jars', image: 'WhatsApp Image 2026-09-29 at 11.12.33 PM.jpeg' },
];

const ritualProductIds = new Set(['DHC-106', 'DHC-108', 'DHC-109', 'DHC-110', 'DHC-113']);
const festiveProductIds = new Set(['DHC-101', 'DHC-102', 'DHC-103', 'DHC-104', 'DHC-105']);

function CandleModel({ phase }) {
  const flameRef = useRef();
  const glowRef = useRef();
  const smokeRef = useRef();
  const smokeSeeds = useMemo(() => Array.from({ length: 34 }, (_, index) => ({
    drift: (index % 5 - 2) * 0.16,
    offset: index * 0.13,
    size: 0.035 + (index % 4) * 0.012,
  })), []);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    const blowing = phase === 'blowout';
    const intensity = blowing ? Math.max(0, 1 - ((time % 3.1) / 3.1)) : 1;

    if (flameRef.current) {
      flameRef.current.visible = !blowing || intensity > 0.12;
      flameRef.current.scale.set(
        0.85 + Math.sin(time * (blowing ? 24 : 5)) * (blowing ? 0.28 : 0.1),
        1 + Math.sin(time * (blowing ? 19 : 4)) * (blowing ? 0.35 : 0.12) * intensity,
        0.85,
      );
      flameRef.current.rotation.z = Math.sin(time * (blowing ? 20 : 3)) * 0.16;
      flameRef.current.material.opacity = Math.min(1, intensity * 1.35);
    }
    if (glowRef.current) glowRef.current.material.opacity = 0.13 + intensity * 0.2;
    if (smokeRef.current) {
      smokeRef.current.children.forEach((particle, index) => {
        const seed = smokeSeeds[index];
        particle.position.y = 0.96 + ((time * (blowing ? 0.34 : 0.06) + seed.offset) % 1.75);
        particle.position.x = seed.drift + Math.sin(time * 0.8 + seed.offset) * (blowing ? 0.23 : 0.04);
        particle.scale.setScalar(seed.size * (blowing ? 1.5 : 0.25));
        particle.material.opacity = blowing ? Math.min(0.3, (particle.position.y - 0.95) * 0.16) : 0;
      });
    }
  });

  return (
    <group position={[0, -0.35, 0]}>
      <Float speed={1.2} rotationIntensity={0.08} floatIntensity={0.14}>
        <mesh position={[0, 0.2, 0]} castShadow>
          <cylinderGeometry args={[0.8, 0.88, 1.92, 64]} />
          <meshPhysicalMaterial color="#f8d9e3" roughness={0.12} metalness={0.02} transmission={0.25} thickness={0.16} transparent opacity={0.66} />
        </mesh>
        <mesh position={[0, 0.16, 0]}>
          <cylinderGeometry args={[0.69, 0.72, 1.68, 48]} />
          <meshStandardMaterial color="#fff3e8" roughness={0.58} />
        </mesh>
        <mesh position={[0, 0.16, 0.735]}>
          <planeGeometry args={[1.05, 0.62]} />
          <meshStandardMaterial color="#fff9f0" roughness={0.42} />
        </mesh>
        <mesh position={[0, 0.16, 0.748]}>
          <ringGeometry args={[0.1, 0.14, 32]} />
          <meshStandardMaterial color="#c58a46" metalness={0.72} roughness={0.22} />
        </mesh>
        <mesh position={[0, 1.13, 0]}>
          <torusGeometry args={[0.75, 0.055, 20, 64]} />
          <meshStandardMaterial color="#c58a46" metalness={0.72} roughness={0.22} />
        </mesh>
        <mesh position={[0, 1.08, 0]}>
          <torusGeometry args={[0.68, 0.025, 12, 48]} />
          <meshStandardMaterial color="#f4d1a2" metalness={0.45} roughness={0.3} />
        </mesh>
        <mesh ref={glowRef} position={[0, 1.75, 0]}>
          <sphereGeometry args={[0.3, 24, 24]} />
          <meshBasicMaterial color="#ff91b8" transparent opacity={0.3} blending={THREE.AdditiveBlending} />
        </mesh>
        <mesh ref={flameRef} position={[0, 1.67, 0]} scale={[0.85, 1, 0.85]}>
          <coneGeometry args={[0.23, 0.62, 24]} />
          <meshBasicMaterial color="#ffb347" transparent blending={THREE.AdditiveBlending} />
        </mesh>
        <mesh position={[0, 1.59, 0.02]} scale={[0.52, 0.7, 0.52]}>
          <coneGeometry args={[0.13, 0.38, 20]} />
          <meshBasicMaterial color="#fff4c2" transparent blending={THREE.AdditiveBlending} />
        </mesh>
        <mesh position={[0, 1.35, 0]}>
          <cylinderGeometry args={[0.025, 0.025, 0.22, 10]} />
          <meshBasicMaterial color="#542335" />
        </mesh>
        <mesh position={[0, -0.73, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[1.05, 48]} />
          <meshBasicMaterial color="#190b13" transparent opacity={0.42} />
        </mesh>
      </Float>
      <group ref={smokeRef} position={[0, 0, 0]}>
        {smokeSeeds.map((seed, index) => <mesh key={index} position={[seed.drift, 1, 0]}><sphereGeometry args={[1, 10, 10]} /><meshBasicMaterial color="#d9b8c6" transparent opacity={0} /></mesh>)}
      </group>
    </group>
  );
}

function CandleScene({ phase = 'idle' }) {
  return (
    <Canvas dpr={[1, 1.75]} camera={{ position: [0, 0.5, 5.3], fov: 35 }} shadows>
      <color attach="background" args={['#f8dce8']} />
      <ambientLight intensity={1.5} color="#fff0f4" />
      <pointLight position={[0, 2, 2]} intensity={phase === 'blowout' ? 2.5 : 4} color="#ff9fbd" distance={5} />
      <Environment preset="sunset" />
      <CandleModel phase={phase} />
      <ThreeSparkles count={phase === 'blowout' ? 70 : 28} scale={[4, 3.5, 2]} size={2} speed={0.25} color="#ffc2d5" opacity={phase === 'blowout' ? 0.5 : 0.28} />
    </Canvas>
  );
}

function FallbackCandle({ phase = 'idle' }) {
  return (
    <div className={`fallback-candle ${phase === 'blowout' ? 'fallback-blowout' : ''}`} aria-hidden="true">
      <div className="fallback-glow" />
      <div className="fallback-flame"><i /></div>
      <div className="fallback-wick" />
      <div className="fallback-vessel"><span className="fallback-mark">d</span><span className="fallback-label">diyas<br />handcrafted candles</span></div>
      <div className="fallback-shadow" />
    </div>
  );
}

function App() {
  const [step, setStep] = useState('welcome');
  const [name, setName] = useState('');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [hasBlownOut, setHasBlownOut] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formError, setFormError] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [theme, setTheme] = useState('light');

  const enterStore = (event) => {
    event.preventDefault();
    if (!name.trim()) {
      setFormError('Please enter your name.');
      return;
    }
    setFormError('');
    setIsTransitioning(true);
    setHasBlownOut(false);
    setStep('blowing');
  };

  useEffect(() => {
    if (step !== 'blowing' || !hasBlownOut) return undefined;
    const transitionTimer = window.setTimeout(() => {
      setStep('store');
      setIsTransitioning(false);
    }, 3700);
    return () => window.clearTimeout(transitionTimer);
  }, [step, hasBlownOut]);

  useEffect(() => {
    if (!selectedProduct) return undefined;
    const closeOnEscape = (event) => event.key === 'Escape' && setSelectedProduct(null);
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [selectedProduct]);

  const blowOutCandle = () => {
    if (!hasBlownOut) setHasBlownOut(true);
  };

  const visibleProducts = [...(activeCategory === 'All'
    ? products
    : activeCategory === 'Daily rituals'
      ? products.filter((product) => ritualProductIds.has(product.detail))
      : activeCategory === 'Festive gifting'
        ? products.filter((product) => festiveProductIds.has(product.detail))
      : products.filter((product) => product.category === activeCategory))].sort((firstProduct, secondProduct) => {
    const firstPrice = Number(firstProduct.price.replace(/\D/g, ''));
    const secondPrice = Number(secondProduct.price.replace(/\D/g, ''));
    return firstPrice - secondPrice;
  });

  return (
    <main className={`app-shell ${step === 'welcome' ? 'welcome-mode' : 'store-mode'} ${theme}-theme`}>
      <header className="site-header">
        <div className="brand-mark"><span className="brand-dot" /> diyas handcrafted candles</div>
        <div className="header-actions"><button className="theme-toggle" onClick={() => setTheme((currentTheme) => currentTheme === 'light' ? 'dark' : 'light')} aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}><Sun size={15} /><span>{theme === 'light' ? 'Light' : 'Dark'}</span><span className="toggle-track"><span className="toggle-thumb">{theme === 'light' ? <Sun size={10} /> : <Moon size={10} />}</span></span></button>{step === 'store' && <span className="collection-note">hand-poured in small batches</span>}</div>
      </header>

      {step === 'welcome' && (
        <section className="welcome-view">
          <div className="welcome-copy">
            <div className="candle-hero"><CandleScene /><FallbackCandle /></div>
            <h1>Small flames.<br /><em>Big feelings.</em></h1>
            <p className="welcome-intro">Handcrafted candles made slowly, with scents that turn ordinary rooms into somewhere worth staying.</p>
          </div>
          <form className="entry-panel" onSubmit={enterStore}>
            <div className="panel-label"><span>01</span> before we begin</div>
            <h2>Who are we lighting this for?</h2>
            <label>Your name<input value={name} onChange={(event) => setName(event.target.value)} placeholder="Your name" autoComplete="name" required /></label>
            {formError && <p className="form-error" role="alert">{formError}</p>}
            <button className="blow-button" type="submit" disabled={isTransitioning}>blow <ArrowRight size={18} /></button>
            <p className="privacy-note"><Check size={13} /> just for a more personal welcome</p>
          </form>
        </section>
      )}

      {step === 'blowing' && (
        <section className={`blow-view ${hasBlownOut ? 'is-blowing' : ''}`}>
          <div className="blow-canvas" onClick={blowOutCandle} onKeyDown={(event) => (event.key === 'Enter' || event.key === ' ') && blowOutCandle()} role="button" tabIndex="0" aria-label="Tap the candle to blow it out"><CandleScene phase={hasBlownOut ? 'blowout' : 'idle'} /><FallbackCandle phase={hasBlownOut ? 'blowout' : 'idle'} /></div>
          <p className="blow-kicker">make a wish, {name}</p>
          <h1>blow out<br /><em>the old.</em></h1>
          <p className="blow-hint">tap the candle to continue</p>
          <div className={`darkness-wipe ${hasBlownOut ? 'active' : ''}`} />
        </section>
      )}

      {step === 'store' && (
        <section className="store-view">
          <div className="store-intro"><p className="eyebrow"><Sparkles size={14} /> the collection</p><h1>Find your<br /><em>favourite glow.</em></h1><p>Scents for slow mornings, long dinners, and all the little rituals in between.</p></div>
          <nav className="category-nav" aria-label="Product categories"><button className={activeCategory === 'All' ? 'active' : ''} onClick={() => setActiveCategory('All')}>All candles</button>{categories.map((category) => <button key={category.name} className={activeCategory === category.name ? 'active' : ''} onClick={() => setActiveCategory(category.name)}>{category.name}</button>)}</nav>
          <div className="product-grid">{visibleProducts.map((product, index) => <article className="product-card" style={{ '--card-delay': `${index * 90}ms` }} key={product.name}><button className={`product-art ${product.tone}`} type="button" onClick={() => setSelectedProduct(product)} aria-label={`View ${product.detail}`}><span className="art-number">{String(index + 1).padStart(2, '0')}</span><img className="catalog-image" src={`/catalogs/${encodeURIComponent(product.image)}`} alt={`${product.name} handcrafted candle`} /></button><div className="product-info"><div><p>{product.detail}</p></div><strong>{product.price}</strong></div></article>)}</div>
          {selectedProduct && <div className="image-modal" role="dialog" aria-modal="true" aria-label={`Enlarged view of ${selectedProduct.detail}`} onClick={() => setSelectedProduct(null)}><div className="image-modal-content" onClick={(event) => event.stopPropagation()}><button className="modal-close" type="button" onClick={() => setSelectedProduct(null)} aria-label="Close image viewer"><X size={20} /></button><img src={`/catalogs/${encodeURIComponent(selectedProduct.image)}`} alt={`${selectedProduct.name} handcrafted candle enlarged`} /><p>{selectedProduct.detail} · {selectedProduct.price}</p></div></div>}
        </section>
      )}
    </main>
  );
}

createRoot(document.getElementById('root')).render(<StrictMode><App /></StrictMode>);
