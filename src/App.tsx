/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Moon, Sparkles, Send, Loader2, RefreshCw } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import Markdown from 'react-markdown';

// Initialize Gemini API
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default function App() {
  const [dream, setDream] = useState('');
  const [interpretation, setInterpretation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleInterpret = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dream.trim()) return;

    setIsLoading(true);
    setError('');
    setInterpretation('');

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Sen uzman bir rüya tabircisisin. Kullanıcının gördüğü rüyayı derinlemesine, sembolik ve psikolojik açılardan analiz et. 
        Yanıtını Türkçe olarak, modern ve anlaşılır bir dille ver. Markdown formatı kullan.
        
        Rüya: "${dream}"`,
        config: {
          systemInstruction: "Sen modern, mistik ve bilge bir rüya yorumcususun. Yanıtların her zaman Türkçe olmalı. Markdown formatında, başlıklar ve vurgular kullanarak yapılandırılmış, ilham verici ve derin analizler sun.",
          temperature: 0.7,
        }
      });

      if (response.text) {
        setInterpretation(response.text);
      } else {
        setError('Rüyanızı yorumlarken bir sorun oluştu. Lütfen tekrar deneyin.');
      }
    } catch (err: any) {
      console.error('Gemini API Error:', err);
      setError('Bağlantı hatası oluştu. Lütfen daha sonra tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  // Scroll to results when interpretation is ready
  useEffect(() => {
    if (interpretation && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [interpretation]);

  const handleReset = () => {
    setDream('');
    setInterpretation('');
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-[#00FF41] selection:text-black">
      {/* Background ambient glow */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#00FF41]/5 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-[#00FF41]/5 blur-[150px]" />
      </div>

      <main className="relative z-10 max-w-4xl mx-auto px-6 py-12 md:py-24 flex flex-col items-center">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-16 w-full"
        >
          <div className="inline-flex items-center justify-center p-3 mb-6 rounded-2xl bg-[#111111] border border-[#222222] shadow-[0_0_30px_rgba(0,255,65,0.1)]">
            <Moon className="w-8 h-8 text-[#00FF41]" />
          </div>
          <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tighter mb-6 leading-tight">
            Rüyalarının <br className="md:hidden" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00FF41] to-[#00A82B]">
              Şifresini Çöz
            </span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto font-light">
            Yapay zeka destekli modern rüya tabircisi ile bilinçaltınızın derinliklerine inin ve sembollerin ardındaki gizli mesajları keşfedin.
          </p>
        </motion.div>

        {/* Input Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="w-full max-w-2xl"
        >
          <form onSubmit={handleInterpret} className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#00FF41]/20 to-[#00FF41]/0 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
            
            <div className="relative bg-[#111111] border border-[#222222] rounded-3xl p-2 focus-within:border-[#00FF41]/50 transition-colors duration-300">
              <textarea
                value={dream}
                onChange={(e) => setDream(e.target.value)}
                placeholder="Gördüğünüz rüyayı tüm detaylarıyla buraya yazın..."
                className="w-full bg-transparent text-white placeholder-gray-600 p-6 min-h-[160px] resize-none focus:outline-none text-lg"
                disabled={isLoading}
              />
              
              <div className="flex justify-between items-center p-4 border-t border-[#222222]/50">
                <div className="flex items-center text-xs text-gray-500 font-mono uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 mr-2 text-[#00FF41]/70" />
                  AI Destekli Analiz
                </div>
                
                <button
                  type="submit"
                  disabled={!dream.trim() || isLoading}
                  className="group relative inline-flex items-center justify-center px-6 py-3 font-medium text-black bg-[#00FF41] rounded-xl overflow-hidden transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
                >
                  <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-white rounded-full group-hover:w-56 group-hover:h-56 opacity-10"></span>
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <span className="mr-2 font-semibold">Yorumla</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>

          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center"
            >
              {error}
            </motion.div>
          )}
        </motion.div>

        {/* Loading State */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-16 flex flex-col items-center justify-center text-[#00FF41]"
            >
              <div className="relative w-24 h-24 flex items-center justify-center">
                <div className="absolute inset-0 border-t-2 border-[#00FF41] rounded-full animate-spin" style={{ animationDuration: '1.5s' }}></div>
                <div className="absolute inset-2 border-r-2 border-[#00FF41]/50 rounded-full animate-spin" style={{ animationDuration: '2s', animationDirection: 'reverse' }}></div>
                <Moon className="w-8 h-8 animate-pulse" />
              </div>
              <p className="mt-6 font-mono text-sm tracking-widest uppercase text-gray-400">
                Bilinçaltı taranıyor...
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Section */}
        <AnimatePresence>
          {interpretation && !isLoading && (
            <motion.div
              ref={resultsRef}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="w-full max-w-3xl mt-24"
            >
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#222222]">
                <h2 className="font-display text-2xl md:text-3xl font-semibold text-white flex items-center">
                  <Sparkles className="w-6 h-6 mr-3 text-[#00FF41]" />
                  Rüya Analizi
                </h2>
                <button 
                  onClick={handleReset}
                  className="text-gray-500 hover:text-[#00FF41] transition-colors flex items-center text-sm font-medium"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Yeni Rüya
                </button>
              </div>
              
              <div className="bg-[#111111] border border-[#222222] rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden">
                {/* Decorative corner accent */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#00FF41]/10 to-transparent rounded-bl-full pointer-events-none" />
                
                <div className="markdown-body relative z-10">
                  <Markdown>{interpretation}</Markdown>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </main>
    </div>
  );
}
