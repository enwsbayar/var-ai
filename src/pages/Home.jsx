import { Link } from 'react-router-dom';
import { Zap, Upload, BarChart2, Share2, ShieldCheck, AlertTriangle, XCircle, CheckCircle } from 'lucide-react';
import './Home.css';

const FEATURES = [
    {
        icon: <Upload size={22} />,
        title: 'Video Yükle',
        desc: 'MP4, MOV veya AVI formatında futbol pozisyonu videonu sürükle-bırak ya da dosya seçerek yükle.',
        color: 'blue',
    },
    {
        icon: <Zap size={22} />,
        title: 'AI Analizi',
        desc: 'Yapay zeka saniyeler içinde videoyu kare kare inceleyip hakem yorumu üretir.',
        color: 'green',
    },
    {
        icon: <BarChart2 size={22} />,
        title: 'Detaylı Rapor',
        desc: 'Faul, penaltı, ofsayt ve kart kararları ayrıntılı hakem yorumuyla birlikte sunulur.',
        color: 'orange',
    },
    {
        icon: <Share2 size={22} />,
        title: 'Paylaş & İndir',
        desc: 'Analiz sonuçlarını arkadaşlarınla paylaş veya JSON rapor olarak indir.',
        color: 'purple',
    },
];

const VERDICTS = [
    { icon: <AlertTriangle size={20} />, label: 'Faul', color: 'red' },
    { icon: <ShieldCheck size={20} />, label: 'Penaltı', color: 'yellow' },
    { icon: <XCircle size={20} />, label: 'Ofsayt', color: 'blue' },
    { icon: <CheckCircle size={20} />, label: 'Kart Kararı', color: 'orange' },
];

const STATS = [
    { value: '98%', label: 'Doğruluk Oranı' },
    { value: '<10s', label: 'Analiz Süresi' },
    { value: '4', label: 'Karar Türü' },
    { value: 'FIFA', label: 'Kural Kitabı' },
];

export default function Home() {
    return (
        <div className="home">
            {/* Hero */}
            <section className="hero">
                <div className="hero-bg-grid" />
                <div className="hero-bg-glow" />
                <div className="container hero-content">
                    <div className="hero-badge badge badge-green animate-fadeInUp">
                        <Zap size={12} /> Yapay Zeka Destekli VAR
                    </div>
                    <h1 className="hero-title animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
                        Futbol Pozisyonlarını<br />
                        <span className="gradient-text">AI ile Analiz Et</span>
                    </h1>
                    <p className="hero-subtitle animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
                        Videonuzu yükleyin — yapay zeka hakem gibi değerlendirsin. Faul, penaltı, ofsayt ve
                        kart kararlarını FIFA kurallarına göre anında öğrenin.
                    </p>
                    <div className="hero-actions animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
                        <Link to="/upload" className="btn btn-primary btn-lg">
                            <Upload size={20} /> Video Yükle & Analiz Et
                        </Link>
                        <a href="#features" className="btn btn-secondary btn-lg">Nasıl Çalışır?</a>
                    </div>

                    {/* Verdict chips */}
                    <div className="verdict-chips animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
                        {VERDICTS.map((v) => (
                            <div key={v.label} className={`verdict-chip chip-${v.color}`}>
                                {v.icon} {v.label}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Floating card preview */}
                <div className="hero-card-preview animate-fadeInUp" style={{ animationDelay: '0.5s' }}>
                    <div className="preview-card glass-card">
                        <div className="preview-header">
                            <ShieldCheck size={16} className="preview-icon" />
                            <span>VAR Kararı</span>
                            <span className="badge badge-green" style={{ marginLeft: 'auto' }}>CANLI</span>
                        </div>
                        <div className="preview-body">
                            <div className="preview-verdict red">🟥 Penaltı</div>
                            <div className="preview-verdict yellow">🟨 Sarı Kart</div>
                            <div className="preview-meta">%94 güven · 6 sn analiz</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="stats-section">
                <div className="container">
                    <div className="stats-grid">
                        {STATS.map((s) => (
                            <div key={s.label} className="stat-item">
                                <div className="stat-value">{s.value}</div>
                                <div className="stat-label">{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features */}
            <section id="features" className="section features-section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Nasıl Çalışır?</h2>
                        <p className="section-sub">Dört adımda profesyonel hakem analizi</p>
                    </div>
                    <div className="features-grid">
                        {FEATURES.map((f, i) => (
                            <div key={i} className={`feature-card card feature-color-${f.color}`}>
                                <div className={`feature-icon icon-${f.color}`}>{f.icon}</div>
                                <h3 className="feature-title">{f.title}</h3>
                                <p className="feature-desc">{f.desc}</p>
                                <div className="feature-step">0{i + 1}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA banner */}
            <section className="cta-section">
                <div className="container">
                    <div className="cta-banner glass-card">
                        <div className="cta-glow" />
                        <h2 className="cta-title">Hemen Deneyin</h2>
                        <p className="cta-sub">Videonuzu yükleyin, saniyeler içinde hakem gibi analiz alın.</p>
                        <Link to="/upload" className="btn btn-primary btn-lg">
                            <Upload size={20} /> Analizi Başlat
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div className="container">
                    <span className="footer-logo">VAR<span style={{ color: 'var(--accent-green)' }}>AI</span></span>
                    <span className="footer-copy">© 2026 · FIFA kuralları esas alınmıştır</span>
                </div>
            </footer>
        </div>
    );
}
