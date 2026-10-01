import { useCallback, useEffect, useRef, useState } from 'react';
import type { LiveAvatarSession } from '@heygen/liveavatar-web-sdk';
import { API_BASE_URL } from '../api';

export type AvatarStatus = 'off' | 'connecting' | 'ready' | 'speaking' | 'error';

// Sessions bill per minute, so end one that has been quiet for a while.
const IDLE_STOP_MS = 2 * 60 * 1000;

/**
 * HeyGen LiveAvatar session used purely as a presenter: it speaks text we give it.
 * No microphone is requested (voice chat is disabled below) and the avatar has no LLM context.
 */
export function useLiveAvatar() {
  const [status, setStatus] = useState<AvatarStatus>('off');
  const [error, setError] = useState('');
  const sessionRef = useRef<LiveAvatarSession | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const stopRequestedRef = useRef(false);
  const idleTimerRef = useRef<number | null>(null);
  // Text to say once the session is ready: the greeting, or an answer that arrived while connecting.
  const pendingSpeechRef = useRef<string | null>(null);
  const startingRef = useRef(false);
  const readyRef = useRef(false);

  const resetSpeechState = () => {
    pendingSpeechRef.current = null;
    startingRef.current = false;
    readyRef.current = false;
  };

  const clearIdleTimer = () => {
    if (idleTimerRef.current !== null) window.clearTimeout(idleTimerRef.current);
    idleTimerRef.current = null;
  };

  const stop = useCallback(() => {
    clearIdleTimer();
    resetSpeechState();
    stopRequestedRef.current = true;
    const session = sessionRef.current;
    sessionRef.current = null;
    // stop() is a no-op until the session has connected; start() re-checks stopRequestedRef for that case.
    session?.stop().catch(() => {});
    setStatus(prev => (prev === 'error' ? prev : 'off'));
  }, []);

  const armIdleTimer = useCallback(() => {
    clearIdleTimer();
    idleTimerRef.current = window.setTimeout(stop, IDLE_STOP_MS);
  }, [stop]);

  const speakNow = (session: LiveAvatarSession, text: string) => {
    try {
      session.interrupt(); // a new answer replaces whatever the avatar was still saying
      session.repeat(text);
    } catch (e) {
      // Session dropped between answers; the text answer is already on screen.
      console.warn('Video avatar could not speak:', e);
    }
  };

  /** Starts a session; `greeting` is spoken on connect unless an answer is queued by then. */
  const start = useCallback(async (greeting?: string) => {
    if (sessionRef.current || startingRef.current) return;
    startingRef.current = true;
    pendingSpeechRef.current = greeting?.trim() || null;
    stopRequestedRef.current = false;
    setError('');
    setStatus('connecting');

    try {
      const res = await fetch(`${API_BASE_URL}/ai/avatar/session`, { method: 'POST' });
      const body = await res.json().catch(() => null);
      if (!res.ok) throw new Error(typeof body?.detail === 'string' ? body.detail : 'The video consultant is unavailable right now.');
      // Loaded on demand: the SDK (LiveKit/WebRTC) roughly doubles the bundle for visitors who never start video.
      const { AgentEventsEnum, LiveAvatarSession, SessionEvent } = await import('@heygen/liveavatar-web-sdk');
      if (stopRequestedRef.current) return;

      const session = new LiveAvatarSession(body.session_token, { autoKeepAlive: true });
      // The SDK's bundled build (0.0.19) always opens the microphone on start, even without a
      // voiceChat config. The avatar only presents our answers, so never capture visitor audio.
      session.voiceChat.start = async () => {};
      sessionRef.current = session;

      // The stream can be ready before start() resolves, and repeat() throws until the session is
      // connected, so only report 'ready' (which triggers speaking) once both have happened.
      let streamReady = false;
      let started = false;
      const markReadyIfConnected = () => {
        if (!streamReady || !started || sessionRef.current !== session) return;
        startingRef.current = false;
        readyRef.current = true;
        setStatus('ready');
        armIdleTimer();
        const pending = pendingSpeechRef.current;
        pendingSpeechRef.current = null;
        if (pending) speakNow(session, pending);
      };

      session.on(SessionEvent.SESSION_STREAM_READY, () => {
        if (videoRef.current) session.attach(videoRef.current);
        streamReady = true;
        markReadyIfConnected();
      });
      session.on(AgentEventsEnum.AVATAR_SPEAK_STARTED, () => {
        clearIdleTimer();
        setStatus('speaking');
      });
      session.on(AgentEventsEnum.AVATAR_SPEAK_ENDED, () => {
        setStatus('ready');
        armIdleTimer();
      });
      session.on(SessionEvent.SESSION_DISCONNECTED, () => {
        clearIdleTimer();
        if (sessionRef.current === session) {
          sessionRef.current = null;
          resetSpeechState();
        }
        setStatus(prev => (prev === 'error' ? prev : 'off'));
      });

      await session.start();
      if (stopRequestedRef.current) {
        await session.stop();
        return;
      }
      started = true;
      markReadyIfConnected();
    } catch (e) {
      sessionRef.current = null;
      resetSpeechState();
      setError(e instanceof Error ? e.message : 'The video consultant is unavailable right now.');
      setStatus('error');
    }
  }, [armIdleTimer]);

  const speak = useCallback((text: string) => {
    if (!text.trim()) return;
    const session = sessionRef.current;
    if (session && readyRef.current) {
      speakNow(session, text);
    } else if (startingRef.current) {
      pendingSpeechRef.current = text; // still connecting: say the answer (instead of the greeting) once ready
    }
  }, []);

  /** Drops a greeting that hasn't been spoken yet (e.g. a question was already sent). */
  const cancelPendingSpeech = useCallback(() => {
    pendingSpeechRef.current = null;
  }, []);

  // End the session if the consultant unmounts (page change, panel closed).
  useEffect(() => stop, [stop]);

  // Only offer video when the backend has a LiveAvatar key configured.
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    fetch(`${API_BASE_URL}/ai/avatar/status`)
      .then(res => (res.ok ? res.json() : null))
      .then(body => setEnabled(Boolean(body?.enabled)))
      .catch(() => setEnabled(false));
  }, []);

  return { enabled, status, error, videoRef, start, stop, speak, cancelPendingSpeech };
}
