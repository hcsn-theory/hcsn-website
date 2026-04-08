'use client';

import React, { useState, useEffect } from 'react';
import { Terminal, Cpu, Zap, WifiOff, Globe, Settings, Link2, LayoutGrid, X } from 'lucide-react';

const DEFAULT_URL = 'http://localhost:8765';

export default function SimulationPage() {
  const [observerUrl, setObserverUrl] = useState<string>(DEFAULT_URL);
  const [tempUrl, setTempUrl] = useState<string>('');
  const [isEngineAlive, setIsEngineAlive] = useState<boolean | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Initialize from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('hcsn_observer_url');
    if (saved) {
      setObserverUrl(saved);
      setTempUrl(saved);
    } else {
      setTempUrl(DEFAULT_URL);
    }
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const checkEngine = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);
        
        // Ensure URL has protocol
        let target = observerUrl;
        if (!target.startsWith('http')) target = 'http://' + target;

        const response = await fetch(target, { 
          mode: 'no-cors',
          signal: controller.signal 
        });
        
        setIsEngineAlive(true);
      } catch (error) {
        setIsEngineAlive(false);
      }
    };

    checkEngine();
    const interval = setInterval(checkEngine, 10000);
    return () => clearInterval(interval);
  }, [observerUrl, retryCount, isMounted]);

  const handleUpdateUrl = (e: React.FormEvent) => {
    e.preventDefault();
    let finalUrl = tempUrl.trim();
    if (!finalUrl) finalUrl = DEFAULT_URL;
    if (!finalUrl.startsWith('http')) finalUrl = 'http://' + finalUrl;
    
    setObserverUrl(finalUrl);
    localStorage.setItem('hcsn_observer_url', finalUrl);
    setShowSettings(false);
    setIsEngineAlive(null); // Reset status to check new URL
  };

  const resetToLocal = () => {
    setObserverUrl(DEFAULT_URL);
    setTempUrl(DEFAULT_URL);
    localStorage.setItem('hcsn_observer_url', DEFAULT_URL);
    setShowSettings(false);
    setIsEngineAlive(null);
  };

  if (!isMounted) return <div className="w-full h-screen bg-black" />;

  const isLocal = observerUrl.includes('localhost') || observerUrl.includes('127.0.0.1');

  if (isEngineAlive === false) {
    return (
      <main className="w-full h-screen bg-[#000005] flex items-center justify-center p-6 font-mono overflow-auto">
        <div className="max-w-2xl w-full bg-black/40 border border-[#00d4ff]/20 backdrop-blur-xl p-8 rounded-2xl shadow-2xl relative overflow-hidden group">
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#00d4ff]/10 rounded-full blur-3xl group-hover:bg-[#00d4ff]/20 transition-all duration-700" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-red-500/10 rounded-xl border border-red-500/30">
                  <WifiOff className="w-8 h-8 text-red-500 animate-pulse" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-white mb-1">Node Offline</h1>
                  <p className="text-xs text-red-500/70 font-bold uppercase tracking-widest leading-none">
                    Target: {observerUrl.replace('http://', '').replace('https://', '')}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setShowSettings(!showSettings)}
                className="p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-colors"
              >
                <Settings className="w-5 h-5 text-white/60" />
              </button>
            </div>

            {showSettings ? (
              <form onSubmit={handleUpdateUrl} className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="space-y-4">
                  <p className="text-sm text-white/60">Configure Quantum Link Target:</p>
                  <div className="relative">
                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#00d4ff]/60" />
                    <input 
                      type="text"
                      value={tempUrl}
                      onChange={(e) => setTempUrl(e.target.value)}
                      placeholder="e.g. 192.168.1.10:8765 or ngrok-url"
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-[#00d4ff]/50 transition-all font-mono text-sm"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button type="submit" className="flex-1 py-3 bg-[#00d4ff] text-black font-bold rounded-xl hover:bg-[#00eaff] transition-colors">
                      Establish Link
                    </button>
                    <button type="button" onClick={resetToLocal} className="px-6 py-3 bg-white/5 text-white/60 font-medium rounded-xl hover:bg-white/10 transition-colors">
                      Reset to Local
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <p className="text-[#8ab8cc] leading-relaxed">
                  The <span className="text-white font-bold italic">Obsidian Observer</span> requires an active 
                  HCSN node to broadcast causal structure data.
                </p>

                <div className="bg-black/60 rounded-xl border border-white/5 p-6 space-y-4">
                  <div className="flex items-center justify-between text-white/90 text-sm">
                    <div className="flex items-center gap-3">
                      <Terminal className="w-4 h-4 text-[#FF9500]" />
                      <span>{isLocal ? 'Local Activation:' : 'Remote Node Link:'}</span>
                    </div>
                    <a 
                      href="https://github.com/hcsn-theory/hcsn-viz" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[10px] text-[#00d4ff] hover:underline opacity-60 hover:opacity-100 transition-opacity"
                    >
                      github.com/hcsn-theory/hcsn-viz
                    </a>
                  </div>

                  {isLocal && (
                    <div className="p-3 bg-[#FF9500]/5 border border-[#FF9500]/10 rounded-lg text-[11px] text-[#FF9500]/80 italic">
                      Note: The visualizer pulls and compiles the simulation logic directly from your local <span className="font-bold">hcsn-rust</span> directory.
                    </div>
                  )}
                  
                  <div className="space-y-3 font-mono text-[13px]">
                    {isLocal ? (
                      <>
                        <div className="flex items-start gap-4 text-white/50">
                          <span className="w-4 h-4 flex-shrink-0 bg-white/5 rounded flex items-center justify-center text-[10px] mt-1">1</span>
                          <p>Open local terminal in <code className="text-[#FF9500] bg-[#FF9500]/10 px-1 rounded">hcsn-viz</code></p>
                        </div>
                        <div className="flex items-start gap-4 text-white/50">
                          <span className="w-4 h-4 flex-shrink-0 bg-white/5 rounded flex items-center justify-center text-[10px] mt-1">2</span>
                          <p>Execute binary:</p>
                        </div>
                        <div className="ml-8 p-3 bg-white/5 rounded border border-white/10 text-[#00d4ff] relative group">
                          <code>cargo run --release</code>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-start gap-4 text-white/50">
                        <Link2 className="w-4 h-4 text-[#00d4ff] mt-1" />
                        <p>Waiting for broadcast from <span className="text-[#00d4ff]">{observerUrl}</span>. Ensure the remote node has port 8765 exposed.</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => setRetryCount(c => c + 1)}
                    className="py-4 bg-white text-black font-bold rounded-xl hover:bg-[#00d4ff] transition-colors active:scale-95 duration-200"
                  >
                    Retry Connection
                  </button>
                  <button 
                    onClick={() => setShowSettings(true)}
                    className="py-4 bg-white/5 border border-white/10 text-white font-bold rounded-xl hover:bg-white/10 transition-colors"
                  >
                    Change Node
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="p-4 bg-[#FF9500]/5 border border-[#FF9500]/10 rounded-xl text-center">
                    <Cpu className="w-5 h-5 text-[#FF9500] mx-auto mb-2" />
                    <span className="text-[10px] text-[#FF9500]/60 block uppercase leading-none mb-1">Node Type</span>
                    <span className="text-xs text-[#FF9500] font-bold">{isLocal ? 'Localhost' : 'Remote'}</span>
                  </div>
                  <div className="p-4 bg-[#00d4ff]/5 border border-[#00d4ff]/10 rounded-xl text-center">
                    <Zap className="w-5 h-5 text-[#00d4ff] mx-auto mb-2" />
                    <span className="text-[10px] text-[#00d4ff]/60 block uppercase leading-none mb-1">Observer</span>
                    <span className="text-xs text-[#00d4ff] font-bold">Warp v0.3</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="w-full h-screen overflow-hidden bg-black m-0 p-0 flex flex-col items-center justify-center relative">
      {isEngineAlive === null && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black z-50">
          <div className="w-16 h-16 border-2 border-white/10 border-t-[#FF9500] rounded-full animate-spin mb-4" />
          <p className="text-[10px] tracking-[0.3em] font-mono text-white/30 uppercase animate-pulse">Synchronizing with Node...</p>
        </div>
      )}
      
      {/* The Portal */}
      <iframe 
        src={observerUrl} 
        className="w-full h-full border-none m-0 p-0"
        title="HCSN Obsidian Observer"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      />

      {/* Floating Network HUD */}
      <div className="absolute top-6 left-6 flex items-center gap-2">
        <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-lg p-2 flex items-center gap-3 pr-4">
          <div className="w-8 h-8 rounded-md bg-[#00d4ff]/10 flex items-center justify-center border border-[#00d4ff]/20">
            <LayoutGrid className="w-4 h-4 text-[#00d4ff]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[9px] uppercase tracking-tighter text-white/40">Status</span>
              <div className="w-1.5 h-1.5 rounded-full bg-[#00ffb2] animate-pulse" />
            </div>
            <p className="text-[11px] font-mono text-white/80 leading-tight">LINK_ESTABLISHED</p>
          </div>
          <div className="w-px h-6 bg-white/10 mx-1" />
          <div>
            <span className="text-[9px] uppercase tracking-tighter text-white/40">Active Node</span>
            <p className="text-[11px] font-mono text-[#00d4ff] leading-tight">
              {observerUrl.replace('http://', '').replace('https://', '')}
            </p>
          </div>
          <button 
            onClick={() => setShowSettings(true)}
            className="ml-2 p-1.5 hover:bg-white/10 rounded-md transition-colors"
            title="Switch Node"
          >
            <Settings className="w-3.5 h-3.5 text-white/40" />
          </button>
        </div>
      </div>

      {/* Settings Modal (Overlay while Live) */}
      {showSettings && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-[#050505] border border-white/10 p-8 rounded-2xl shadow-2xl relative">
            <button 
              onClick={() => setShowSettings(false)}
              className="absolute top-4 right-4 p-2 hover:bg-white/5 rounded-lg text-white/40 hover:text-white transition-all"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-3">
              <Globe className="w-5 h-5 text-[#00d4ff]" />
              Quantum Link Settings
            </h2>
            <p className="text-sm text-white/40 mb-8 leading-relaxed">
              Redirect the Obsidian Observer to a different simulation node. This allows monitoring of remote research clusters or shared environments.
            </p>

            <form onSubmit={handleUpdateUrl} className="space-y-4">
              <div className="relative">
                <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#00d4ff]/60" />
                <input 
                  type="text"
                  autoFocus
                  value={tempUrl}
                  onChange={(e) => setTempUrl(e.target.value)}
                  placeholder="IP_ADDRESS:PORT"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-[#00d4ff]/50 transition-all font-mono text-sm"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 py-3 bg-[#00d4ff] text-black font-bold rounded-xl hover:bg-[#00eaff] transition-colors">
                  Update Link
                </button>
                <button type="button" onClick={resetToLocal} className="px-6 py-3 bg-white/5 text-white/60 font-medium rounded-xl hover:bg-white/10 transition-colors">
                  Localhost
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
