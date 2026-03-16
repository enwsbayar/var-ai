/**
 * AI Analysis Service — Google Gemini Video API
 * Analyzes football video clips for VAR decisions.
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });


const VAR_PROMPT = `
You are a professional VAR (Video Assistant Referee) AI system trained on FIFA laws of the game.

Analyze this football/soccer video clip and provide a detailed referee decision in Turkish.

IMPORTANT: Respond ONLY with a valid JSON object (no markdown, no extra text) in this exact format:
{
  "summary": "Brief one-sentence Turkish summary of what happens in the video",
  "foul": true or false,
  "penalty": true or false,
  "offside": true or false,
  "card": "yellow" | "red" | null,
  "cardReason": "Turkish reason for the card or null if no card",
  "confidence": number between 70 and 99,
  "refereeComment": "Detailed Turkish referee commentary explaining the decision based on FIFA laws. Minimum 3 sentences.",
  "keyMoments": [
    { "time": number in seconds (0-10 range), "label": "Turkish label", "type": "info" | "contact" | "foul" | "offside" | "whistle" }
  ]
}

Rules:
- Base your decision ONLY on what you actually see in the video
- If you cannot clearly see a foul/offside/penalty, set those to false
- keyMoments should have 3-5 entries with estimated timestamps
- refereeComment must reference specific FIFA Law (e.g. Kural 12 - Faul ve Sert Oyun)
- Be accurate and realistic — do NOT guess if unsure, set confidence lower
`;

/**
 * Converts a File to base64 string
 */
async function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Parses Gemini's JSON response safely
 */
function parseGeminiResponse(text, fileName) {
  try {
    // Strip any accidental markdown fences
    const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const parsed = JSON.parse(cleaned);
    return {
      ...parsed,
      fileName: fileName || 'analiz.mp4',
      analyzedAt: new Date().toISOString(),
    };
  } catch (e) {
    console.error('Gemini JSON parse error:', e, '\nRaw:', text);
    throw new Error('Gemini yanıtı ayrıştırılamadı. Lütfen tekrar deneyin.');
  }
}

/**
 * Analyzes a local video file using Gemini.
 * @param {File} videoFile
 * @param {function} onProgress
 */
export async function analyzeVideo(videoFile, onProgress) {
  onProgress?.(10, 'Video hazırlanıyor...');

  // Convert video to base64 (inline data approach — works for files <20MB)
  let base64Data;
  try {
    base64Data = await fileToBase64(videoFile);
  } catch {
    throw new Error('Video dosyası okunamadı.');
  }

  onProgress?.(30, 'Gemini modeline gönderiliyor...');

  const mimeType = videoFile.type || 'video/mp4';

  let response;
  try {
    response = await model.generateContent([
      {
        inlineData: {
          data: base64Data,
          mimeType,
        },
      },
      VAR_PROMPT,
    ]);
  } catch (err) {
    console.error('Gemini API error:', err);
    throw new Error('Gemini API hatası: ' + (err.message || 'Bilinmeyen hata'));
  }

  onProgress?.(80, 'Hakem kararı hazırlanıyor...');

  const text = response.response.text();
  onProgress?.(100, 'Tamamlandı!');

  return parseGeminiResponse(text, videoFile.name);
}

export async function analyzeYouTube(youtubeUrl, onProgress) {
  onProgress?.(15, 'YouTube bağlantısı kuruluyor...');
  onProgress?.(40, 'YouTube videosu analiz ediliyor (Simülasyon)...');

  // Gemini API'nin standart JS SDK'sı doğrudan YouTube URL'lerini "fileData" olarak 
  // kabul etmiyor. Bunun yerine videoyu indirip base64 olarak vermek veya Google Cloud 
  // Vertex AI API kullanmak gerekiyor. Free tier JS SDK'sında bunu çözmek için:
  // Şimdilik YouTube URL'lerini mock analiz ile destekliyoruz:
  
  await new Promise(r => setTimeout(r, 2000));
  
  const mockResult = {
    summary: "YouTube videosundaki pozisyon analiz edildi (Simüle edilmiş sonuç).",
    foul: true,
    penalty: false,
    offside: false,
    card: "yellow",
    cardReason: "Tehlikeli hareket",
    confidence: 85,
    refereeComment: "YouTube videolarını JS SDK üzerinden doğrudan API'ye beslemek ücretli Google Cloud entegrasyonu (Vertex AI) veya sunucu tarafında (backend) videoyu indirip base64'e çevirmeyi gerektirir. Bu analiz simüle edilmiştir.",
    keyMoments: [
      { time: 1.0, label: "Pozisyon başlangıcı", type: "info" }
    ],
    fileName: `YouTube: ${youtubeUrl}`,
    analyzedAt: new Date().toISOString()
  };

  onProgress?.(85, 'Hakem kararı hazırlanıyor...');
  await new Promise(r => setTimeout(r, 1000));
  onProgress?.(100, 'Tamamlandı!');

  return mockResult;
}
