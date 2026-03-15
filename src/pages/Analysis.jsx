import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useRef, useState, useEffect } from 'react';
import {
    AlertTriangle, ShieldCheck, XCircle, CreditCard,
    MessageSquare, Share2, Download, Upload, CheckCircle,
    X as XIcon, Copy, Check
} from 'lucide-react';
import './Analysis.css';

function VerdictCard({ icon, title, value, detail, color }) {
    return (
        <div className={`verdict-card card verdict-card-${color} ${value ? 'verdict-true' : 'verdict-false'}`}>
            <div className="vc-header">
                <div className={`vc-icon vc-icon-${color}`}>{icon}</div>
                <div className="vc-title">{title}</div>
            </div>
            <div className={`vc-value vc-value-${value ? color : 'neutral'}`}>
                {value ? 'Evet' : 'Hayır'}
            </div>
            {detail && <div className="vc-detail">{detail}</div>}
        </div>
    );
}

function TimelineMarker({ moment, onClick, isActive }) {
    const typeColor = {
        info: '#2979ff',
        contact: '#ff9d3d',
        foul: '#ff1744',
        offside: '#2979ff',
        whistle: '#ffd600',
    };
    return (
        <button
            className={`timeline-marker ${isActive ? 'active' : ''}`}
            style={{ '--mc': typeColor[moment.type] || '#00e676' }}
            onClick={() => onClick(moment)}
            title={moment.label}
        >
            <div className="tm-dot" />
            <div className="tm-label">{moment.label}</div>
            <div className="tm-time">{moment.time.toFixed(1)}s</div>
        </button>
    );
}

function ShareModal({ result, onClose }) {
    const [copied, setCopied] = useState(false);

    const shareText = `⚽ VAR AI Analiz Sonucu\n` +
        `Faul: ${result.foul ? 'Evet' : 'Hayır'} | Penaltı: ${result.penalty ? 'Evet' : 'Hayır'} | ` +
        `Ofsayt: ${result.offside ? 'Evet' : 'Hayır'} | Kart: ${result.card ? result.card.toUpperCase() : 'Yok'}\n` +
        `Güven: %${result.confidence} | var-mi.app`;

    const copyText = () => {
        navigator.clipboard.writeText(shareText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const download = () => {
        const blob = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `var-mi-analiz-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-box glass-card" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>Paylaş & İndir</h3>
                    <button className="modal-close" onClick={onClose}><XIcon size={18} /></button>
                </div>
                <div className="modal-body">
                    <div className="share-text-preview">{shareText}</div>
                    <div className="modal-actions">
                        <button className="btn btn-outline" onClick={copyText}>
                            {copied ? <Check size={16} /> : <Copy size={16} />}
                            {copied ? 'Kopyalandı!' : 'Metni Kopyala'}
                        </button>
                        <button className="btn btn-primary" onClick={download}>
                            <Download size={16} /> JSON İndir
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function Analysis() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const videoRef = useRef(null);

    const [activeMarker, setActiveMarker] = useState(null);
    const [showShare, setShowShare] = useState(false);

    const result = state?.result;
    const videoUrl = state?.videoUrl;

    useEffect(() => {
        if (!result) navigate('/upload');
    }, [result, navigate]);

    if (!result) return null;

    const seekToMoment = (moment) => {
        setActiveMarker(moment.time);
        if (videoRef.current) {
            videoRef.current.currentTime = moment.time;
            videoRef.current.play();
            setTimeout(() => videoRef.current?.pause(), 1500);
        }
    };

    const cardLabels = { yellow: '🟨 Sarı Kart', red: '🟥 Kırmızı Kart', null: '—' };
    const cardColors = { yellow: 'yellow', red: 'red', null: 'neutral' };

    return (
        <div className="analysis-page">
            <div className="container">

                {/* Page header */}
                <div className="analysis-header">
                    <div>
                        <div className="badge badge-green" style={{ marginBottom: 10 }}>
                            <CheckCircle size={12} /> Analiz Tamamlandı
                        </div>
                        <h1 className="analysis-title">VAR <span className="gradient-text">Analiz Raporu</span></h1>
                        <p className="analysis-meta">
                            {result.fileName} · %{result.confidence} güven · {new Date(result.analyzedAt).toLocaleString('tr-TR')}
                        </p>
                    </div>
                    <div className="analysis-header-actions">
                        <button className="btn btn-secondary" onClick={() => setShowShare(true)}>
                            <Share2 size={16} /> Paylaş
                        </button>
                        <Link to="/upload" className="btn btn-outline">
                            <Upload size={16} /> Yeni Video
                        </Link>
                    </div>
                </div>

                <div className="analysis-grid">

                    {/* Left column: video + timeline */}
                    <div className="analysis-left">
                        <div className="section-label">Video & Önemli Anlar</div>

                        <div className="video-wrap card">
                            {videoUrl ? (
                                <video
                                    ref={videoRef}
                                    src={videoUrl}
                                    controls
                                    className="analysis-video"
                                />
                            ) : (
                                <div className="video-placeholder">
                                    <MessageSquare size={32} />
                                    <p>Video önizleme mevcut değil</p>
                                </div>
                            )}
                        </div>

                        {/* Timeline */}
                        <div className="timeline-section card">
                            <div className="timeline-label">
                                <span>📍 Pozisyon Timeline</span>
                                <span className="timeline-hint">Anlara tıklayarak videoya atla</span>
                            </div>
                            <div className="timeline-track">
                                {result.keyMoments.map((m) => (
                                    <TimelineMarker
                                        key={m.time}
                                        moment={m}
                                        isActive={activeMarker === m.time}
                                        onClick={seekToMoment}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right column: verdicts + comment */}
                    <div className="analysis-right">
                        <div className="section-label">Hakem Kararları</div>

                        {/* Summary */}
                        <div className="summary-box card">
                            <p className="summary-text">{result.summary}</p>
                        </div>

                        {/* Verdict cards */}
                        <div className="verdicts-grid">
                            <VerdictCard
                                icon={<AlertTriangle size={22} />}
                                title="Faul"
                                value={result.foul}
                                color="red"
                            />
                            <VerdictCard
                                icon={<ShieldCheck size={22} />}
                                title="Penaltı"
                                value={result.penalty}
                                color="yellow"
                            />
                            <VerdictCard
                                icon={<XCircle size={22} />}
                                title="Ofsayt"
                                value={result.offside}
                                color="blue"
                            />
                            <VerdictCard
                                icon={<CreditCard size={22} />}
                                title="Kart"
                                value={!!result.card}
                                detail={result.card ? `${cardLabels[result.card]} — ${result.cardReason}` : null}
                                color={result.card ? cardColors[result.card] : 'neutral'}
                            />
                        </div>

                        {/* Confidence indicator */}
                        <div className="confidence-bar card">
                            <div className="conf-header">
                                <span>Model Güven Skoru</span>
                                <span className="conf-pct">%{result.confidence}</span>
                            </div>
                            <div className="conf-track">
                                <div className="conf-fill" style={{ width: `${result.confidence}%` }} />
                            </div>
                        </div>

                        {/* Referee comment */}
                        <div className="referee-comment card">
                            <div className="rc-header">
                                <MessageSquare size={18} className="rc-icon" />
                                <span>VAR Hakem Yorumu</span>
                            </div>
                            <div className="rc-body">
                                {result.refereeComment.split('\n').map((line, i) => (
                                    <p key={i} className={line.startsWith('**') ? 'rc-bold' : ''}>
                                        {line.replace(/\*\*/g, '')}
                                    </p>
                                ))}
                            </div>
                        </div>

                        {/* Share / download */}
                        <div className="result-actions">
                            <button className="btn btn-primary btn-lg" onClick={() => setShowShare(true)}>
                                <Share2 size={18} /> Paylaş & İndir
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {showShare && <ShareModal result={result} onClose={() => setShowShare(false)} />}
        </div>
    );
}
