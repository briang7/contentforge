import { useEffect, useRef, useState, useCallback } from 'react';

type TtsState = 'idle' | 'playing' | 'paused';

const SPEED_OPTIONS = [0.75, 1, 1.25, 1.5, 2];
const LS_SPEED_KEY = 'tts-speed';
const LS_VOICE_KEY = 'tts-voice';

function getSavedSpeed(): number {
  try {
    const v = localStorage.getItem(LS_SPEED_KEY);
    if (v && SPEED_OPTIONS.includes(Number(v))) return Number(v);
  } catch {}
  return 1;
}

function getSavedVoice(): string {
  try {
    return localStorage.getItem(LS_VOICE_KEY) || '';
  } catch {}
  return '';
}

interface Chunk {
  text: string;
  element: Element;
}

function extractChunks(contentSelector: string): Chunk[] {
  const container = document.querySelector(contentSelector);
  if (!container) return [];

  const chunks: Chunk[] = [];
  const readable = container.querySelectorAll('p, li, h2, h3, h4');

  readable.forEach((el) => {
    // Skip elements inside code blocks or tables
    if (el.closest('pre') || el.closest('table') || el.closest('[data-pagefind-ignore]')) return;

    const text = (el.textContent || '').trim();
    if (!text) return;

    const isHeading = /^H[2-4]$/.test(el.tagName);
    chunks.push({
      text: isHeading ? `Section: ${text}` : text,
      element: el,
    });
  });

  return chunks;
}

// Icons as inline SVGs
const PlayIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M8 5v14l11-7z" />
  </svg>
);

const PauseIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
  </svg>
);

const StopIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M6 6h12v12H6z" />
  </svg>
);

const SkipBackIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
  </svg>
);

const SkipForwardIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
  </svg>
);

const SpeakerIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M17.95 6.05a8 8 0 010 11.9M6.5 8.5H3v7h3.5L12 20V4L6.5 8.5z" />
  </svg>
);

export default function ReadAloud({
  contentSelector = '.prose[data-pagefind-body]',
}: {
  contentSelector?: string;
}) {
  const [state, setState] = useState<TtsState>('idle');
  const [speed, setSpeed] = useState(getSavedSpeed);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState(getSavedVoice);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [totalChunks, setTotalChunks] = useState(0);
  const [showVoices, setShowVoices] = useState(false);

  const chunksRef = useRef<Chunk[]>([]);
  const indexRef = useRef(0);
  const stateRef = useRef<TtsState>('idle');
  const speedRef = useRef(speed);
  const voiceRef = useRef(selectedVoice);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  // Epoch counter: bumped before every intentional cancel so stale onend handlers are ignored
  const epochRef = useRef(0);

  // Keep refs in sync
  useEffect(() => { stateRef.current = state; }, [state]);
  useEffect(() => { speedRef.current = speed; }, [speed]);
  useEffect(() => { voiceRef.current = selectedVoice; }, [selectedVoice]);

  // Check for SpeechSynthesis support
  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  // Load voices
  useEffect(() => {
    if (!supported) return;

    const loadVoices = () => {
      const available = speechSynthesis.getVoices().filter((v) => v.lang.startsWith('en'));
      if (available.length > 0) setVoices(available);
    };

    loadVoices();
    speechSynthesis.addEventListener('voiceschanged', loadVoices);
    return () => speechSynthesis.removeEventListener('voiceschanged', loadVoices);
  }, [supported]);

  const clearHighlight = useCallback(() => {
    document.querySelectorAll('.tts-active').forEach((el) => el.classList.remove('tts-active'));
  }, []);

  const stopSpeech = useCallback(() => {
    if (!supported) return;
    epochRef.current++;
    speechSynthesis.cancel();
    clearHighlight();
    utteranceRef.current = null;
    indexRef.current = 0;
    setCurrentIndex(0);
    setState('idle');
  }, [supported, clearHighlight]);

  const speakChunk = useCallback((index: number) => {
    const chunks = chunksRef.current;
    if (index >= chunks.length) {
      stopSpeech();
      return;
    }

    clearHighlight();
    const chunk = chunks[index];
    chunk.element.classList.add('tts-active');

    // Scroll the active element into view smoothly
    chunk.element.scrollIntoView({ behavior: 'smooth', block: 'center' });

    const utterance = new SpeechSynthesisUtterance(chunk.text);
    utterance.rate = speedRef.current;

    // Apply selected voice
    if (voiceRef.current) {
      const voice = speechSynthesis.getVoices().find((v) => v.name === voiceRef.current);
      if (voice) utterance.voice = voice;
    }

    // Capture epoch so we can detect stale events from cancelled utterances
    const epoch = epochRef.current;

    utterance.onend = () => {
      // Ignore if this utterance was from a previous epoch (i.e. we intentionally cancelled it)
      if (epochRef.current !== epoch) return;
      if (stateRef.current === 'playing') {
        const next = indexRef.current + 1;
        indexRef.current = next;
        setCurrentIndex(next);
        speakChunk(next);
      }
    };

    utterance.onerror = (e) => {
      if (epochRef.current !== epoch) return;
      // 'canceled' is expected when stopping/pausing
      if (e.error !== 'canceled') {
        stopSpeech();
      }
    };

    utteranceRef.current = utterance;
    speechSynthesis.speak(utterance);
  }, [clearHighlight, stopSpeech]);

  const play = useCallback(() => {
    if (!supported) return;

    if (stateRef.current === 'paused') {
      // Resume: re-speak the current chunk from the beginning
      setState('playing');
      speakChunk(indexRef.current);
      return;
    }

    // Fresh start
    const chunks = extractChunks(contentSelector);
    if (chunks.length === 0) return;

    chunksRef.current = chunks;
    indexRef.current = 0;
    setCurrentIndex(0);
    setTotalChunks(chunks.length);
    setState('playing');
    speakChunk(0);
  }, [supported, contentSelector, speakChunk]);

  const pause = useCallback(() => {
    if (!supported) return;
    epochRef.current++;
    speechSynthesis.cancel();
    setState('paused');
  }, [supported]);

  const skipTo = useCallback((direction: 'next' | 'prev') => {
    if (!supported) return;
    const chunks = chunksRef.current;
    if (chunks.length === 0) return;

    const cur = indexRef.current;
    let target: number;

    if (direction === 'next') {
      // Find the next heading chunk after current position
      target = chunks.findIndex((c, i) => i > cur && /^H[2-4]$/.test(c.element.tagName));
      if (target === -1) target = Math.min(cur + 1, chunks.length - 1);
    } else {
      // Find the previous heading chunk before current position
      target = -1;
      for (let i = cur - 1; i >= 0; i--) {
        if (/^H[2-4]$/.test(chunks[i].element.tagName)) { target = i; break; }
      }
      if (target === -1) target = 0;
    }

    epochRef.current++;
    speechSynthesis.cancel();
    indexRef.current = target;
    setCurrentIndex(target);

    if (stateRef.current === 'playing') {
      speakChunk(target);
    } else {
      // If paused, highlight the target and stay paused
      clearHighlight();
      chunks[target].element.classList.add('tts-active');
      chunks[target].element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [supported, speakChunk, clearHighlight]);

  const togglePlayPause = useCallback(() => {
    if (state === 'playing') pause();
    else play();
  }, [state, play, pause]);

  // Keyboard shortcuts: Alt+R toggle, Alt+ArrowRight skip forward, Alt+ArrowLeft skip back
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.altKey && e.key.toLowerCase() === 'r') {
        e.preventDefault();
        togglePlayPause();
      }
      if (stateRef.current !== 'idle' && e.altKey && e.key === 'ArrowRight') {
        e.preventDefault();
        skipTo('next');
      }
      if (stateRef.current !== 'idle' && e.altKey && e.key === 'ArrowLeft') {
        e.preventDefault();
        skipTo('prev');
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [togglePlayPause, skipTo]);

  // Cleanup on unmount and page navigation
  useEffect(() => {
    const cleanup = () => {
      epochRef.current++;
      speechSynthesis.cancel();
      clearHighlight();
    };

    document.addEventListener('astro:before-swap', cleanup);
    window.addEventListener('beforeunload', cleanup);
    return () => {
      cleanup();
      document.removeEventListener('astro:before-swap', cleanup);
      window.removeEventListener('beforeunload', cleanup);
    };
  }, [clearHighlight]);

  // Speed change while playing
  const handleSpeedChange = useCallback((newSpeed: number) => {
    setSpeed(newSpeed);
    try { localStorage.setItem(LS_SPEED_KEY, String(newSpeed)); } catch {}
    // If currently playing, restart current chunk with new speed
    if (stateRef.current === 'playing') {
      epochRef.current++;
      speechSynthesis.cancel();
      speakChunk(indexRef.current);
    }
  }, [speakChunk]);

  const handleVoiceChange = useCallback((voiceName: string) => {
    setSelectedVoice(voiceName);
    try { localStorage.setItem(LS_VOICE_KEY, voiceName); } catch {}
    if (stateRef.current === 'playing') {
      epochRef.current++;
      speechSynthesis.cancel();
      speakChunk(indexRef.current);
    }
  }, [speakChunk]);

  if (!supported) return null;

  const progress = totalChunks > 0 ? Math.round((currentIndex / totalChunks) * 100) : 0;

  // Idle state: compact "Listen" button
  if (state === 'idle') {
    return (
      <div className="tts-bar tts-idle">
        <button
          onClick={play}
          className="tts-listen-btn group"
          aria-label="Listen to this article"
          title="Alt+R"
        >
          <SpeakerIcon />
          <span>Listen to this article</span>
          <kbd className="tts-kbd">Alt+R</kbd>
        </button>
      </div>
    );
  }

  // Active state: player controls
  return (
    <div className="tts-bar tts-active-bar tts-sticky">
      <div className="tts-controls">
        {/* Play/Pause */}
        <button
          onClick={togglePlayPause}
          className="tts-btn tts-btn-primary"
          aria-label={state === 'playing' ? 'Pause' : 'Resume'}
        >
          {state === 'playing' ? <PauseIcon /> : <PlayIcon />}
        </button>

        {/* Stop */}
        <button
          onClick={stopSpeech}
          className="tts-btn"
          aria-label="Stop"
        >
          <StopIcon />
        </button>

        {/* Skip back / forward */}
        <button
          onClick={() => skipTo('prev')}
          className="tts-btn"
          aria-label="Previous section"
          title="Alt+←"
        >
          <SkipBackIcon />
        </button>
        <button
          onClick={() => skipTo('next')}
          className="tts-btn"
          aria-label="Next section"
          title="Alt+→"
        >
          <SkipForwardIcon />
        </button>

        {/* Progress */}
        <div className="tts-progress">
          <div className="tts-progress-bar">
            <div
              className="tts-progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="tts-progress-text">
            {currentIndex}/{totalChunks}
          </span>
        </div>

        {/* Speed */}
        <div className="tts-speed">
          {SPEED_OPTIONS.map((s) => (
            <button
              key={s}
              onClick={() => handleSpeedChange(s)}
              className={`tts-speed-btn ${speed === s ? 'tts-speed-active' : ''}`}
            >
              {s}x
            </button>
          ))}
        </div>

        {/* Voice selector */}
        {voices.length > 1 && (
          <div className="tts-voice-wrapper">
            <button
              onClick={() => setShowVoices(!showVoices)}
              className="tts-btn tts-btn-voice"
              aria-label="Select voice"
              title="Change voice"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>
            {showVoices && (
              <div className="tts-voice-dropdown">
                {voices.map((v) => (
                  <button
                    key={v.name}
                    onClick={() => { handleVoiceChange(v.name); setShowVoices(false); }}
                    className={`tts-voice-option ${selectedVoice === v.name ? 'tts-voice-selected' : ''}`}
                  >
                    {v.name.replace(/Microsoft |Google /, '')}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
