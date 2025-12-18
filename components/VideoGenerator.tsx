

import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';

const VideoGenerator: React.FC = () => {
  const [hasKey, setHasKey] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loadingStep, setLoadingStep] = useState('');

  useEffect(() => {
    const checkKey = async () => {
      // Check if aistudio is available before calling methods
      if (window.aistudio) {
        const selected = await window.aistudio.hasSelectedApiKey();
        setHasKey(selected);
      }
    };
    checkKey();
  }, []);

  const handleSelectKey = async () => {
    // Use the global select key dialog
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      setHasKey(true); // Assume success per instructions
    }
  };

  const generateVideo = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setLoadingStep('Initializing AI model...');

    try {
      // Create fresh instance before call
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: prompt,
        config: {
          numberOfVideos: 1,
          resolution: '720p',
          aspectRatio: '16:9'
        }
      });

      const loadingMessages = [
        'Dreaming up your sequence...',
        'Rendering cinematic lighting...',
        'Processing motion vectors...',
        'Adding final atmospheric details...',
        'Polishing frames...',
      ];
      let msgIdx = 0;

      while (!operation.done) {
        setLoadingStep(loadingMessages[msgIdx % loadingMessages.length]);
        msgIdx++;
        await new Promise(resolve => setTimeout(resolve, 8000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
      }

      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (downloadLink) {
        setLoadingStep('Fetching final video file...');
        const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setVideoUrl(url);
      }
    } catch (error: any) {
      console.error('Video generation failed:', error);
      if (error.message?.includes('Requested entity was not found')) {
        // Reset key selection if entity not found
        if (window.aistudio) {
          setHasKey(false);
          alert('API Key issue. Please re-select your key.');
        }
      } else {
        alert('Error generating video. This process can take several minutes.');
      }
    } finally {
      setIsGenerating(false);
      setLoadingStep('');
    }
  };

  if (!hasKey) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-6">
        <div className="bg-gray-800 p-12 rounded-3xl border border-gray-700 shadow-2xl max-w-lg">
          <div className="text-5xl mb-6">🔑</div>
          <h2 className="text-3xl font-bold mb-4">API Key Required</h2>
          <p className="text-gray-400 mb-8">
            Veo video generation requires a paid Google Cloud Project API key. 
            Please select your key to begin creating high-quality cinematic videos.
          </p>
          <button
            onClick={handleSelectKey}
            className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-4 px-10 rounded-xl transition-all w-full"
          >
            Select API Key
          </button>
          <a
            href="https://ai.google.dev/gemini-api/docs/billing"
            target="_blank"
            rel="noopener noreferrer"
            className="block mt-6 text-sm text-purple-400 hover:underline"
          >
            Learn about billing and project setup
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-gray-800/50 p-8 rounded-2xl border border-gray-700 shadow-xl backdrop-blur-sm">
        <h2 className="text-2xl font-bold mb-4">Veo Cinematic Lab</h2>
        <p className="text-gray-400 mb-6 text-sm">
          Generate stunning 720p/1080p videos from text. Note: Generation typically takes 2-5 minutes.
        </p>
        <div className="flex flex-col gap-4">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={isGenerating}
            placeholder="A slow tracking shot of a mysterious emerald forest with floating bioluminescent spores..."
            className="w-full bg-gray-900 border border-gray-700 rounded-xl p-4 text-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none h-32 resize-none"
          />
          <button
            onClick={generateVideo}
            disabled={isGenerating || !prompt.trim()}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-4 px-8 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {isGenerating ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {loadingStep}
              </>
            ) : (
              'Create Video'
            )}
          </button>
        </div>
      </div>

      {videoUrl && (
        <div className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 shadow-2xl">
          <video src={videoUrl} controls autoPlay className="w-full" />
          <div className="p-4 flex justify-between items-center bg-gray-800/50">
            <span className="text-sm text-gray-400 italic">Latest Creation</span>
            <button
              onClick={() => {
                const a = document.createElement('a');
                a.href = videoUrl;
                a.download = 'aetheris-video.mp4';
                a.click();
              }}
              className="text-purple-400 hover:text-purple-300 font-semibold"
            >
              Download MP4
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoGenerator;