import React, { useState, useEffect, useRef } from 'react';
import { Timer, Play, Pause, RotateCcw, Bell } from 'lucide-react';
import { playTimerFinishSound } from '../utils/audio';

interface TimerWidgetProps {
  initialMinutes?: number;
}

export const TimerWidget: React.FC<TimerWidgetProps> = ({ initialMinutes = 30 }) => {
  const [targetSeconds, setTargetSeconds] = useState(initialMinutes * 60);
  const [secondsLeft, setSecondsLeft] = useState(initialMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [showPresets, setShowPresets] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsRunning(false);
            playTimerFinishSound();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning]);

  const toggleRunning = () => {
    if (secondsLeft === 0) {
      setSecondsLeft(targetSeconds);
    }
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setSecondsLeft(targetSeconds);
  };

  const selectPreset = (minutes: number) => {
    const sec = minutes * 60;
    setTargetSeconds(sec);
    setSecondsLeft(sec);
    setIsRunning(false);
    setShowPresets(false);
  };

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const isUrgent = secondsLeft > 0 && secondsLeft <= 300; // under 5 minutes
  const isFinished = secondsLeft === 0;

  return (
    <div className="relative inline-flex items-center bg-slate-900/90 border border-slate-800 rounded-xl px-3 py-1.5 shadow-sm">
      <div className="flex items-center gap-2">
        <div
          className={`flex items-center gap-1.5 font-mono text-sm sm:text-base font-bold tabular-nums ${
            isFinished
              ? 'text-rose-400 animate-pulse'
              : isUrgent
              ? 'text-amber-400'
              : 'text-indigo-300'
          }`}
        >
          <Timer className="w-4 h-4 text-slate-400" />
          <span>
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </span>
        </div>

        <div className="flex items-center gap-1 border-l border-slate-800 pl-2">
          <button
            onClick={toggleRunning}
            className={`p-1 rounded-md transition-colors ${
              isRunning
                ? 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30'
                : 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30'
            }`}
            title={isRunning ? '타이머 일시정지' : '타이머 시작'}
          >
            {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={handleReset}
            className="p-1 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            title="타이머 리셋"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setShowPresets(!showPresets)}
            className="text-[11px] font-medium text-slate-400 hover:text-slate-200 px-1 py-0.5 rounded hover:bg-slate-800 transition-colors"
            title="시간 변경 (30분, 15분, 10분, 5분)"
          >
            {targetSeconds / 60}분
          </button>
        </div>
      </div>

      {/* Preset dropdown menu */}
      {showPresets && (
        <div className="absolute right-0 top-full mt-2 w-36 bg-slate-900 border border-slate-700/80 rounded-xl p-1.5 shadow-xl z-50 flex flex-col gap-1 backdrop-blur-md">
          <div className="text-[11px] font-medium text-slate-400 px-2 py-1">시험 직전 타이머</div>
          {[30, 20, 15, 10, 5].map((m) => (
            <button
              key={m}
              onClick={() => selectPreset(m)}
              className={`w-full text-left px-2.5 py-1 text-xs rounded-lg transition-colors flex items-center justify-between ${
                targetSeconds === m * 60
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <span>{m}분 타이머</span>
              {m === 30 && <span className="text-[10px] opacity-75 font-normal">추천</span>}
            </button>
          ))}
        </div>
      )}

      {isFinished && (
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-rose-500 text-white text-[11px] font-semibold px-2 py-0.5 rounded-full shadow-lg flex items-center gap-1 animate-bounce">
          <Bell className="w-3 h-3" />
          <span>시험 직전 30분 종료!</span>
        </div>
      )}
    </div>
  );
};
