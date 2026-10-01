import { RefObject } from 'react';
import { Video, VideoOff, Loader2 } from 'lucide-react';
import { AvatarStatus } from '../../hooks/useLiveAvatar';

interface AvatarStageProps {
  status: AvatarStatus;
  error: string;
  videoRef: RefObject<HTMLVideoElement | null>;
  videoDismissed: boolean;
  onStart: () => void;
  onStop: () => void;
}

export function AvatarStage({ status, error, videoRef, videoDismissed, onStart, onStop }: AvatarStageProps) {
  const live = status === 'ready' || status === 'speaking';
  const showStage = live || status === 'connecting';

  return (
    <div className="border-b border-[var(--theme-border)]">
      {/* The video element stays mounted so the stream can attach as soon as it is ready. */}
      <div className={`relative bg-slate-900 aspect-video ${showStage ? '' : 'hidden'}`}>
        <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />

        {status === 'connecting' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-white/80 text-xs">
            <Loader2 className="w-6 h-6 animate-spin" />
            Connecting your designer…
          </div>
        )}

        {live && (
          <>
            <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/45 text-white text-[10px] font-semibold uppercase tracking-wider">
              <span className={`w-1.5 h-1.5 rounded-full ${status === 'speaking' ? 'bg-green-400 animate-pulse' : 'bg-white/60'}`} />
              {status === 'speaking' ? 'Speaking' : 'Live'}
            </span>
            <button
              onClick={onStop}
              className="absolute top-3 right-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/45 hover:bg-black/65 text-white text-[10px] font-semibold uppercase tracking-wider cursor-pointer"
              title="End video and continue by text"
            >
              <VideoOff className="w-3 h-3" /> End video
            </button>
          </>
        )}
      </div>

      {!showStage && (
        <div className="px-5 py-3 flex items-center justify-between gap-3 bg-white/40">
          <p className="text-[11px] text-[var(--theme-muted)] leading-snug">
            {status === 'error'
              ? error
              : videoDismissed
                ? 'Video is off. Answers will appear as text only.'
                : 'Your video designer joins as soon as you start typing.'}
          </p>
          <button
            onClick={onStart}
            className="shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[var(--theme-border)] bg-white/80 hover:border-[var(--theme-accent)] text-[var(--theme-accent)] text-xs font-semibold cursor-pointer transition-colors"
          >
            <Video className="w-3.5 h-3.5" /> {status === 'error' ? 'Try again' : 'Start video'}
          </button>
        </div>
      )}
    </div>
  );
}
