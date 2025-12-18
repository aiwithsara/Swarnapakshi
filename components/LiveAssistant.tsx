
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { decode, encode, decodeAudioData, createPcmBlob } from '../services/audioUtils';

const LiveAssistant: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [transcriptions, setTranscriptions] = useState<{ type: 'user' | 'model'; text: string }[]>([]);
  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<{ input: AudioContext; output: AudioContext } | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const transcriptionBuffer = useRef({ user: '', model: '' });

  const stopSession = useCallback(() => {
    if (sessionRef.current) {
      sessionRef.current.close();
      sessionRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.input.close();
      audioContextRef.current.output.close();
      audioContextRef.current = null;
    }
    setIsActive(false);
  }, []);

  const startSession = async () => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Fix: Use type assertion to access webkitAudioContext for Safari compatibility
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioContextRef.current = { input: inputCtx, output: outputCtx };

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: () => {
            setIsActive(true);
            const source = inputCtx.createMediaStreamSource(stream);
            const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
            
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const pcmBlob = createPcmBlob(inputData);
              sessionPromise.then(session => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputCtx.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            // Audio data
            const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio && audioContextRef.current) {
              const { output } = audioContextRef.current;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, output.currentTime);
              const buffer = await decodeAudioData(decode(base64Audio), output, 24000, 1);
              const source = output.createBufferSource();
              source.buffer = buffer;
              source.connect(output.destination);
              source.addEventListener('ended', () => sourcesRef.current.delete(source));
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += buffer.duration;
              sourcesRef.current.add(source);
            }

            // Interruptions
            if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => s.stop());
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }

            // Transcriptions
            if (message.serverContent?.inputTranscription) {
              transcriptionBuffer.current.user += message.serverContent.inputTranscription.text;
            }
            if (message.serverContent?.outputTranscription) {
              transcriptionBuffer.current.model += message.serverContent.outputTranscription.text;
            }
            if (message.serverContent?.turnComplete) {
              const userT = transcriptionBuffer.current.user;
              const modelT = transcriptionBuffer.current.model;
              if (userT || modelT) {
                setTranscriptions(prev => [
                  ...prev,
                  ...(userT ? [{ type: 'user' as const, text: userT }] : []),
                  ...(modelT ? [{ type: 'model' as const, text: modelT }] : [])
                ]);
              }
              transcriptionBuffer.current = { user: '', model: '' };
            }
          },
          onerror: (e) => {
            console.error('Session error:', e);
            stopSession();
          },
          onclose: () => stopSession()
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } }
          },
          inputAudioTranscription: {},
          outputAudioTranscription: {},
          systemInstruction: 'You are a warm, human-like voice assistant called Aetheris. You speak fluently and empathetically.'
        }
      });

      sessionRef.current = await sessionPromise;
    } catch (error) {
      console.error('Failed to start live session:', error);
      alert('Could not access microphone or connect to Gemini.');
    }
  };

  useEffect(() => {
    return () => stopSession();
  }, [stopSession]);

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[80vh]">
      <div className="bg-gray-800/50 p-6 rounded-t-2xl border border-gray-700 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">Aetheris Voice Lab</h2>
          <p className="text-xs text-gray-400">Real-time low-latency voice conversation</p>
        </div>
        <button
          onClick={isActive ? stopSession : startSession}
          className={`px-6 py-2 rounded-full font-bold transition-all flex items-center gap-2 ${
            isActive 
              ? 'bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20' 
              : 'bg-purple-600 text-white hover:bg-purple-500 shadow-lg shadow-purple-500/20'
          }`}
        >
          {isActive ? (
            <>
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              Stop Session
            </>
          ) : (
            'Start Conversation'
          )}
        </button>
      </div>

      <div className="flex-1 bg-gray-900/50 border-x border-gray-700 overflow-y-auto p-6 space-y-4">
        {transcriptions.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-600 space-y-4">
            <div className="w-24 h-24 rounded-full border-4 border-gray-800 flex items-center justify-center text-4xl animate-pulse">
              🎙️
            </div>
            <p className="text-sm">Click "Start Conversation" to speak with Aetheris</p>
          </div>
        ) : (
          transcriptions.map((t, i) => (
            <div key={i} className={`flex ${t.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-4 rounded-2xl text-sm ${
                t.type === 'user' 
                  ? 'bg-purple-600/20 border border-purple-500/30 text-purple-100 rounded-br-none' 
                  : 'bg-gray-800 border border-gray-700 text-gray-100 rounded-bl-none'
              }`}>
                <p>{t.text}</p>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="bg-gray-800/50 p-6 rounded-b-2xl border border-gray-700 text-center">
        {isActive && (
          <div className="flex items-center justify-center gap-3">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className={`w-1 bg-purple-500 rounded-full animate-bounce h-${i * 2 + 2}`} style={{ animationDelay: `${i * 0.1}s` }} />
              ))}
            </div>
            <span className="text-sm text-purple-400 font-medium animate-pulse">Assistant is listening...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveAssistant;
