
import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';

const ImageGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [generatedImages, setGeneratedImages] = useState<{ url: string; prompt: string }[]>([]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: prompt }],
        },
        config: {
          imageConfig: {
            aspectRatio: aspectRatio as any,
          },
        },
      });

      let newUrl = '';
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          newUrl = `data:image/png;base64,${part.inlineData.data}`;
          break;
        }
      }

      if (newUrl) {
        setGeneratedImages((prev) => [{ url: newUrl, prompt }, ...prev]);
      }
    } catch (error) {
      console.error('Generation failed:', error);
      alert('Error generating image. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="bg-gray-800/50 p-8 rounded-2xl border border-gray-700 shadow-xl backdrop-blur-sm">
        <h2 className="text-2xl font-bold mb-4">AI Image Creator</h2>
        <div className="flex flex-col gap-4">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the image you want to create (e.g., 'A futuristic cyberpunk city in the clouds, synthwave style')..."
            className="w-full bg-gray-900 border border-gray-700 rounded-xl p-4 text-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none h-32 resize-none"
          />
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">Aspect Ratio:</span>
              <select
                value={aspectRatio}
                onChange={(e) => setAspectRatio(e.target.value)}
                className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-1 text-sm outline-none focus:ring-1 focus:ring-purple-500"
              >
                <option value="1:1">1:1 (Square)</option>
                <option value="16:9">16:9 (Landscape)</option>
                <option value="9:16">9:16 (Portrait)</option>
                <option value="4:3">4:3 (Photo)</option>
              </select>
            </div>
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="ml-auto bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold py-3 px-8 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isGenerating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate Image'
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {generatedImages.map((img, idx) => (
          <div key={idx} className="group relative bg-gray-900 rounded-xl overflow-hidden border border-gray-800 transition-all hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/10">
            <img src={img.url} alt={img.prompt} className="w-full h-auto object-cover" />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
              <p className="text-sm text-gray-200 line-clamp-2">{img.prompt}</p>
              <button
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = img.url;
                  link.download = `aetheris-${Date.now()}.png`;
                  link.click();
                }}
                className="mt-2 text-xs font-bold text-purple-400 hover:text-purple-300 transition-colors uppercase"
              >
                Download
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageGenerator;
