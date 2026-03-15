/**
 * AI Analysis Service
 * Simulates a backend API call that would call a video AI model (e.g. Gemini Video).
 * Returns structured referee analysis results.
 */

const SCENARIOS = [
  {
    id: 1,
    summary: "Ceza sahası içinde savunma oyuncusu rakibini ayaktan çelmeye çalışırken temas gerçekleşti.",
    foul: true,
    penalty: true,
    offside: false,
    card: "yellow",
    cardReason: "Tehlikeli oyun – kasıtsız müdahale",
    confidence: 94,
    refereeComment: `VAR incelemesi tamamlandı. Görüntüler incelendiğinde, savunma oyuncusunun ceza sahası sınırları içinde rakip oyuncunun bacağına kontrollü olmayan bir müdahalede bulunduğu açıkça görülmektedir. Topu oynamak için yapılan hamle top konumuna göre erken gerçekleşmiş ve rakibin hareket yönünü engellemiştir.

**Karar: Penaltı + Sarı Kart**

FIFA Futbol Kuralları Kitabı Kural 12 uyarınca, ceza sahası içinde gerçekleşen ve rakibi düşürmeye neden olan her türlü dikkatsiz müdahale dolaysız serbest vuruş ve penaltı ile cezalandırılır. Temas kasıtsız olup, oyuncu topu oynamaya çalışmıştır; bu nedenle sadece sarı kart yeterli görülmüştür.`,
    keyMoments: [
      { time: 2.1, label: "Hücum başlıyor", type: "info" },
      { time: 4.8, label: "Temas anı", type: "contact" },
      { time: 5.3, label: "Düşüş", type: "foul" },
      { time: 6.0, label: "Hakem durduruyor", type: "whistle" },
    ],
  },
  {
    id: 2,
    summary: "Uzun pas sonrası forvet oyuncusu son savunmacının arkasında kaldı.",
    foul: false,
    penalty: false,
    offside: true,
    card: null,
    cardReason: null,
    confidence: 97,
    refereeComment: `VAR ofsayt hattı çizimi tamamlandı. Pas atıldığı anda forvet oyuncusunun sol omzunun savunma hattının yaklaşık 23 cm gerisinde olduğu tespit edildi.

**Karar: Ofsayt – Gol geçersiz**

FIFA Ofsayt Kuralı (Kural 11) gereği, oyuncunun vücudunun topla gol atılabilecek her bölümü – eller hariç – değerlendirilir. Yarı-otomatik ofsayt teknolojisinin tespiti kesin olup hakem kararı doğrulanmıştır.`,
    keyMoments: [
      { time: 1.5, label: "Top uzun pasla ilerliyor", type: "info" },
      { time: 3.2, label: "Pas atım anı", type: "contact" },
      { time: 3.2, label: "Ofsayt pozisyonu", type: "offside" },
      { time: 5.8, label: "Gol sevinci – VAR incelemesi", type: "whistle" },
    ],
  },
  {
    id: 3,
    summary: "Orta sahada sert giriş; oyuncu rakibinin arkasından geliyor.",
    foul: true,
    penalty: false,
    offside: false,
    card: "red",
    cardReason: "Tehlikeli faul – rakibin bütünlüğünü tehdit eden hareket",
    confidence: 89,
    refereeComment: `Görüntüler analiz edildi. Orta saha oyuncusu arkadan ve tamamen topun dışından rakibine sert bir şekilde girmiş, rakibin aşil tendonunu tehdit eden bir temas gerçekleşmiştir.

**Karar: Doğrudan Kırmızı Kart**

FIFA Kural 12 – Ciddi faul oynamak: Oyuncu aşırı güç kullanarak ya da rakibinin güvenliğini tehdit ederek faul yapmaktadır. Bu tür müdahaleler kırmızı kartı gerektirmekte olup oyuncunun derhal oyundan uzaklaştırılması gerekmektedir. Serbest vuruş noktası temas yerine yakın olduğundan penaltı söz konusu değildir.`,
    keyMoments: [
      { time: 1.0, label: "Top kontrolden çıkıyor", type: "info" },
      { time: 2.7, label: "Arkadan giriş", type: "contact" },
      { time: 2.8, label: "Sert temas", type: "foul" },
      { time: 4.1, label: "Kırmızı kart", type: "whistle" },
    ],
  },
  {
    id: 4,
    summary: "Ceza sahasında kaleci çıkışı, forvet oyuncusuyla temas.",
    foul: false,
    penalty: false,
    offside: false,
    card: null,
    cardReason: null,
    confidence: 88,
    refereeComment: `Detaylı görüntü analizi yapıldı. Kaleci topu kontrol etmeyi hedeflemiş ve çıkışını topa yönelik gerçekleştirmiştir. Temas kaçınılmaz olmakla birlikte ikisi de topu oynamaya çalışmıştır.

**Karar: Faul Yok – Oyuna Devam**

Kaleci topu kontrol etmek için meşru bir çıkış yapmıştır. Temas her iki oyuncunun da topu oynama girişiminin doğal bir sonucudur. FIFA Kural 12 uyarınca bu temas faul olarak değerlendirilmez; penaltı uygulanmaz.`,
    keyMoments: [
      { time: 1.2, label: "Kaleci çıkış yapıyor", type: "info" },
      { time: 2.5, label: "Temas noktası", type: "contact" },
      { time: 3.0, label: "Hakem devam işareti", type: "whistle" },
    ],
  },
];

/**
 * Analyzes a video file (simulated).
 * In production, this would POST the file to a backend endpoint
 * that calls the Gemini Video API or a custom ML model.
 *
 * @param {File} videoFile
 * @param {function} onProgress - callback with progress 0-100
 * @returns {Promise<object>} analysis result
 */
export async function analyzeVideo(videoFile, onProgress) {
  // Simulate upload + processing time
  const steps = [
    { pct: 15, delay: 600, label: "Video yükleniyor..." },
    { pct: 35, delay: 900, label: "Kareler işleniyor..." },
    { pct: 55, delay: 1100, label: "Model analiz ediyor..." },
    { pct: 75, delay: 900, label: "Kural yorumu hazırlanıyor..." },
    { pct: 90, delay: 700, label: "Timeline oluşturuluyor..." },
    { pct: 100, delay: 500, label: "Tamamlandı!" },
  ];

  for (const step of steps) {
    await new Promise((r) => setTimeout(r, step.delay));
    onProgress?.(step.pct, step.label);
  }

  // Pick a random scenario for demo purposes
  const scenario = SCENARIOS[Math.floor(Math.random() * SCENARIOS.length)];

  return {
    ...scenario,
    fileName: videoFile?.name || "analiz.mp4",
    analyzedAt: new Date().toISOString(),
  };
}

/**
 * Analyzes a YouTube video URL (simulated).
 * In production: POST the YouTube URL to a backend that calls
 * Gemini API with the video URL directly — Gemini natively
 * supports youtube.com links as video input.
 *
 * @param {string} youtubeUrl - Full YouTube URL
 * @param {function} onProgress - callback with progress 0-100
 * @returns {Promise<object>} analysis result
 */
export async function analyzeYouTube(youtubeUrl, onProgress) {
  const steps = [
    { pct: 10, delay: 500, label: "YouTube bağlantısı kuruluyor..." },
    { pct: 25, delay: 800, label: "Video akışı alınıyor..." },
    { pct: 45, delay: 1000, label: "Gemini model analiz ediyor..." },
    { pct: 65, delay: 1100, label: "Futbol kuralları uygulanıyor..." },
    { pct: 85, delay: 800, label: "Hakem yorumu hazırlanıyor..." },
    { pct: 100, delay: 500, label: "Tamamlandı!" },
  ];

  for (const step of steps) {
    await new Promise((r) => setTimeout(r, step.delay));
    onProgress?.(step.pct, step.label);
  }

  const scenario = SCENARIOS[Math.floor(Math.random() * SCENARIOS.length)];

  return {
    ...scenario,
    fileName: `YouTube: ${youtubeUrl}`,
    source: "youtube",
    analyzedAt: new Date().toISOString(),
  };
}

