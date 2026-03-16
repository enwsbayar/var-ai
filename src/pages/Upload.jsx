import { useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Film, X, Zap, CheckCircle, AlertCircle, Youtube, Link } from 'lucide-react';
import { analyzeVideo, analyzeYouTube } from '../services/aiAnalysis';
import './Upload.css';

const ACCEPTED = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm'];
const MAX_SIZE_MB = 200;

function extractYouTubeId(url) {
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{11})/,
        /youtube\.com\/embed\/([A-Za-z0-9_-]{11})/,
        /youtube\.com\/shorts\/([A-Za-z0-9_-]{11})/,
    ];
    for (const p of patterns) {
        const match = url.match(p);
        if (match) return match[1];
    }
    return null;
}

export default function UploadPage() {
    const navigate = useNavigate();
    const inputRef = useRef(null);

    // Tab: 'file' | 'youtube'
    const [tab, setTab] = useState('file');

    // File upload state
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [dragging, setDragging] = useState(false);

    // YouTube state
    const [ytUrl, setYtUrl] = useState('');
    const [ytId, setYtId] = useState(null);

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [progressLabel, setProgressLabel] = useState('');

    // ── File helpers ──────────────────────────────────────────────────────────
    const validateFile = (f) => {
        if (!ACCEPTED.includes(f.type)) {
            setError('Lütfen geçerli bir video dosyası yükleyin (MP4, MOV, AVI, WebM).');
            return false;
        }
        if (f.size > MAX_SIZE_MB * 1024 * 1024) {
            setError(`Dosya boyutu ${MAX_SIZE_MB} MB'ı aşamaz.`);
            return false;
        }
        return true;
    };

    const handleFile = useCallback((f) => {
        setError('');
        if (!f) return;
        if (!validateFile(f)) return;
        setFile(f);
        setPreview(URL.createObjectURL(f));
    }, []);

    const onDrop = useCallback((e) => {
        e.preventDefault();
        setDragging(false);
        const f = e.dataTransfer.files[0];
        if (f) handleFile(f);
    }, [handleFile]);

    const onDragOver = (e) => { e.preventDefault(); setDragging(true); };
    const onDragLeave = () => setDragging(false);
    const onInputChange = (e) => handleFile(e.target.files[0]);
    const clearFile = () => { setFile(null); setPreview(null); setError(''); };

    // ── YouTube helpers ───────────────────────────────────────────────────────
    const handleYtInput = (val) => {
        setYtUrl(val);
        setError('');
        const id = extractYouTubeId(val.trim());
        setYtId(id);
    };

    // ── Shared analysis trigger ───────────────────────────────────────────────
    const startAnalysis = async () => {
        setLoading(true);
        setProgress(0);
        setError('');
        try {
            let result;
            if (tab === 'file') {
                result = await analyzeVideo(file, (pct, label) => {
                    setProgress(pct);
                    setProgressLabel(label);
                });
                navigate('/analysis', { state: { result, videoUrl: preview } });
            } else {
                result = await analyzeYouTube(ytUrl, (pct, label) => {
                    setProgress(pct);
                    setProgressLabel(label);
                });
                navigate('/analysis', { state: { result, youtubeId: ytId } });
            }
        } catch (err) {
            setError(err.message || 'Analiz sırasında bir hata oluştu. Lütfen tekrar deneyin.');
            setLoading(false);
        }
    };

    const canStart = tab === 'file' ? !!file : !!ytId;

    return (
        <div className="upload-page">
            <div className="container">
                <div className="upload-header">
                    <h1 className="upload-title">
                        Video <span className="gradient-text">Yükle</span>
                    </h1>
                    <p className="upload-subtitle">
                        Futbol pozisyonu videonuzu yükleyin veya YouTube linki girin — yapay zeka anında analiz etsin.
                    </p>
                </div>

                {/* Tab switcher */}
                <div className="tab-switcher">
                    <button
                        className={`tab-btn ${tab === 'file' ? 'active' : ''}`}
                        onClick={() => { setTab('file'); setError(''); }}
                    >
                        <Film size={16} /> Dosya Yükle
                    </button>
                    <button
                        className={`tab-btn ${tab === 'youtube' ? 'active' : ''}`}
                        onClick={() => { setTab('youtube'); setError(''); }}
                    >
                        <Youtube size={16} /> YouTube Linki
                    </button>
                </div>

                {/* ── FILE TAB ── */}
                {tab === 'file' && (
                    !file ? (
                        <div
                            className={`dropzone ${dragging ? 'dragging' : ''}`}
                            onDrop={onDrop}
                            onDragOver={onDragOver}
                            onDragLeave={onDragLeave}
                            onClick={() => inputRef.current?.click()}
                        >
                            <input
                                ref={inputRef}
                                type="file"
                                accept={ACCEPTED.join(',')}
                                onChange={onInputChange}
                                style={{ display: 'none' }}
                                id="video-input"
                            />
                            <div className="dropzone-icon">
                                <Film size={40} />
                            </div>
                            <p className="dropzone-primary">Videoyu buraya sürükleyin</p>
                            <p className="dropzone-secondary">veya tıklayarak dosya seçin</p>
                            <div className="dropzone-formats">
                                <span className="badge badge-blue">MP4</span>
                                <span className="badge badge-blue">MOV</span>
                                <span className="badge badge-blue">AVI</span>
                                <span className="badge badge-blue">WebM</span>
                                <span className="badge badge-green">Maks. {MAX_SIZE_MB} MB</span>
                            </div>
                        </div>
                    ) : (
                        <div className="preview-section card">
                            <div className="preview-top">
                                <div className="preview-info">
                                    <Film size={18} className="preview-info-icon" />
                                    <div>
                                        <div className="preview-filename">{file.name}</div>
                                        <div className="preview-filesize">{(file.size / 1024 / 1024).toFixed(1)} MB</div>
                                    </div>
                                </div>
                                {!loading && (
                                    <button className="btn btn-danger" onClick={clearFile}>
                                        <X size={16} /> Kaldır
                                    </button>
                                )}
                            </div>
                            <video className="preview-video" src={preview} controls muted />
                            {renderProgress()}
                        </div>
                    )
                )}

                {/* ── YOUTUBE TAB ── */}
                {tab === 'youtube' && (
                    <div className="yt-section card">
                        <div className="yt-input-wrap">
                            <div className="yt-input-icon"><Youtube size={20} /></div>
                            <input
                                className="yt-input"
                                type="url"
                                placeholder="https://www.youtube.com/watch?v=..."
                                value={ytUrl}
                                onChange={(e) => handleYtInput(e.target.value)}
                                id="yt-url-input"
                            />
                            {ytUrl && (
                                <button className="yt-clear" onClick={() => { setYtUrl(''); setYtId(null); }}>
                                    <X size={16} />
                                </button>
                            )}
                        </div>

                        {ytUrl && !ytId && (
                            <p className="yt-invalid">
                                <AlertCircle size={14} /> Geçerli bir YouTube linki giriniz (youtube.com veya youtu.be)
                            </p>
                        )}

                        {ytId && (
                            <div className="yt-preview">
                                <img
                                    src={`https://img.youtube.com/vi/${ytId}/hqdefault.jpg`}
                                    alt="YouTube video önizleme"
                                    className="yt-thumb"
                                />
                                <div className="yt-thumb-overlay">
                                    <div className="yt-play-icon">▶</div>
                                </div>
                                <div className="yt-meta">
                                    <span className="badge badge-red"><Youtube size={11} /> YouTube</span>
                                    <span className="yt-id">Video ID: {ytId}</span>
                                </div>
                            </div>
                        )}

                        {ytId && !loading && (
                            <p className="yt-note">
                                <Link size={13} /> Gerçek entegrasyonda Gemini API bu YouTube videosunu doğrudan analiz eder.
                            </p>
                        )}

                        {renderProgress()}
                    </div>
                )}

                {/* Start button (outside card when file tab shows dropzone) */}
                {((tab === 'file' && !file) || tab === 'youtube') && canStart && !loading && (
                    <button className="btn btn-primary btn-lg analyze-btn-outer" onClick={startAnalysis} disabled={!canStart}>
                        <Zap size={20} /> Analizi Başlat
                    </button>
                )}

                {tab === 'file' && file && !loading && (
                    <button className="btn btn-primary btn-lg analyze-btn" onClick={startAnalysis} style={{ marginTop: 0, width: '100%', maxWidth: 640, margin: '0 auto', display: 'flex', justifyContent: 'center' }}>
                        <Zap size={20} /> Analizi Başlat
                    </button>
                )}

                {error && (
                    <div className="upload-error">
                        <AlertCircle size={16} /> {error}
                    </div>
                )}

                {/* Tips */}
                <div className="upload-tips">
                    <h3 className="tips-title">İpuçları</h3>
                    <ul className="tips-list">
                        <li>En iyi sonuç için pozisyon anının net göründüğü videoları tercih edin.</li>
                        <li>Video uzunluğu 5–30 saniye arasında olursa analiz daha isabetli olur.</li>
                        <li>YouTube linki için kamuya açık (public) videolar kullanın.</li>
                        <li>Yüksek çözünürlüklü (720p+) videolarda doğruluk oranı artar.</li>
                    </ul>
                </div>
            </div>
        </div>
    );

    function renderProgress() {
        if (!loading) return null;
        return (
            <div className="progress-section">
                <div className="progress-bar-wrap">
                    <div className="progress-bar" style={{ width: `${progress}%` }} />
                </div>
                <div className="progress-info">
                    <span className="progress-label">{progressLabel}</span>
                    <span className="progress-pct">{progress}%</span>
                </div>
                <div className="loading-steps">
                    {['Video', 'Kareler', 'AI Modeli', 'Kural', 'Timeline'].map((step, i) => {
                        const threshold = (i + 1) * 20;
                        const done = progress >= threshold;
                        return (
                            <div key={step} className={`loading-step ${done ? 'done' : ''}`}>
                                {done ? <CheckCircle size={14} /> : <div className="step-dot" />}
                                <span>{step}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }
}
