
import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';

const AIAssistant: React.FC = () => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([
    { role: 'ai', text: 'Namaste! I am Aetheris, your Swarnapakshi assistant. Looking for a traditional gift or a specific snack for tea time?' }
  ]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMsg,
        config: {
          systemInstruction: 'You are an expert on traditional South Indian sweets and snacks for "Swarnapakshi Sweets and Snacks". Be polite, helpful, and suggest traditional products like Mysurpa, Halwa, Murukku, and Seedai. If a user asks about occasions like weddings or Diwali, give detailed gift box recommendations.',
        },
      });

      setMessages(prev => [...prev, { role: 'ai', text: response.text || 'I recommend trying our signature Mysurpa!' }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', text: "I'm having a small kitchen mishap! Please call us at 73959 43676 for immediate help." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden flex flex-col h-[600px]">
      <div className="bg-[#1d4d2b] p-6 text-white flex items-center gap-4">
        <div className="w-10 h-10 bg-[#fdbd10] rounded-full flex items-center justify-center text-xl">🤖</div>
        <div>
          <h3 className="font-bold">Swarnapakshi AI Finder</h3>
          <p className="text-xs text-green-100">Smart Sweet Recommendations</p>
        </div>
      </div>

      <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-gray-50">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-4 rounded-2xl text-sm ${
              m.role === 'user' 
                ? 'bg-[#1d4d2b] text-white rounded-br-none' 
                : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
        {loading && <div className="text-xs text-gray-400 italic">Chef is thinking...</div>}
      </div>

      <div className="p-4 bg-white border-t border-gray-100 flex gap-2">
        <input 
          type="text" 
          placeholder="Ask about sweets, snacks, or gifts..."
          className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#fdbd10]"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button 
          onClick={handleSend}
          className="bg-[#1d4d2b] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#1d4d2b]/90 transition-all"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default AIAssistant;
