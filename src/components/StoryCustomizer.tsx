import React, { useState } from "react";
import { StoryConfig, MemoryItem } from "../types";
import {
  X,
  Sliders,
  Film,
  Music,
  Heart,
  Image as ImageIcon,
  Compass,
  FileCode,
  Volume2,
  VolumeX,
  Upload,
  Check,
} from "lucide-react";

interface StoryCustomizerProps {
  isOpen: boolean;
  onClose: () => void;
  config: StoryConfig;
  onUpdateConfig: (newConfig: StoryConfig) => void;
  onJumpToProgress: (progress: number) => void;
  isPlayingMusic: boolean;
  onToggleMusic: () => void;
  musicVolume: number;
  onVolumeChange: (vol: number) => void;
  onOpenExportGuide: () => void;
}

export const StoryCustomizer: React.FC<StoryCustomizerProps> = ({
  isOpen,
  onClose,
  config,
  onUpdateConfig,
  onJumpToProgress,
  isPlayingMusic,
  onToggleMusic,
  musicVolume,
  onVolumeChange,
  onOpenExportGuide,
}) => {
  const [activeTab, setActiveTab] = useState<"story" | "media" | "memories" | "chapters">("story");
  const [copiedNotification, setCopiedNotification] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleTextChange = (field: keyof StoryConfig, value: string) => {
    onUpdateConfig({
      ...config,
      [field]: value,
    });
  };

  const handleMemoryChange = (index: number, field: keyof MemoryItem, value: string) => {
    const updated = [...config.memories];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    onUpdateConfig({
      ...config,
      memories: updated,
    });
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      onUpdateConfig({
        ...config,
        videoSrc: objectUrl,
      });
      setCopiedNotification("បានបញ្ចូលវីដេអូរួចរាល់!");
      setTimeout(() => setCopiedNotification(null), 3000);
    }
  };

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      onUpdateConfig({
        ...config,
        audioSrc: objectUrl,
      });
      setCopiedNotification("បានបញ្ចូលបទភ្លេងរួចរាល់!");
      setTimeout(() => setCopiedNotification(null), 3000);
    }
  };

  const chapters = [
    { label: "០% — ការចាប់ផ្ដើម", progress: 0.0, desc: "ដំណើររឿងតូចមួយ អំពីពួកយើង" },
    { label: "១០% — ចំណងជើងធំ", progress: 0.1, desc: "រឿងរ៉ាវរបស់យើង · ឈ្មោះអ្នកទាំងពីរ" },
    { label: "២០% — ការចាប់ផ្ដើមដំបូង", progress: 0.2, desc: "មនុស្សសំខាន់បំផុតក្នុងជីវិតបង" },
    { label: "៣៥% — ដំណើរជីវិត", progress: 0.35, desc: "ការយល់ចិត្តដ៏ជ្រាលជ្រៅ" },
    { label: "៥០% — អាល់ប៊ុមអនុស្សាវរីយ៍", progress: 0.5, desc: "ផ្ទាំងរូបថតអនុស្សាវរីយ៍ ៣៥មម" },
    { label: "៦៥% — រឿងរ៉ាវតូចៗ", progress: 0.65, desc: "រឿងរ៉ាវតូចៗនៃក្ដីស្រឡាញ់" },
    { label: "៧៨% — សេចក្ដីប្រកាសស្នេហ៍", progress: 0.78, desc: "អូនជាចំណែកដ៏មានន័យបំផុត" },
    { label: "៨៥% — សំបុត្រស្នេហ៍", progress: 0.85, desc: "សំបុត្រផ្ញើជូនមនុស្សជាទីស្រឡាញ់" },
    { label: "៩៣% — ទិវាខួបគម្រប់", progress: 0.93, desc: "រីករាយថ្ងៃខួបគម្រប់ស្នេហា ❤️" },
    { label: "១០០% — ជារៀងរហូត", progress: 1.0, desc: "រឿងរ៉ាវរបស់យើងនៅតែបន្ត" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm transition-opacity font-khmer">
      <div
        className="w-full max-w-lg h-full bg-[#0d0914] border-l border-white/10 shadow-2xl flex flex-col overflow-hidden text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-black/30">
          <div className="flex items-center gap-2.5">
            <Heart className="w-5 h-5 text-rose-400 fill-rose-400/20" />
            <div>
              <h2 className="text-base font-khmer font-medium tracking-wide">
                ផ្ទាំងគ្រប់គ្រងរឿងរ៉ាវស្នេហា
              </h2>
              <p className="text-xs text-rose-200/60 font-khmer">កែសម្រួលឈ្មោះ ខ្លឹមសារ និងរូបភាព</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-white/10 bg-black/20 text-xs">
          <button
            onClick={() => setActiveTab("story")}
            className={`flex-1 py-3 px-2 flex items-center justify-center gap-1.5 transition-colors border-b-2 font-medium font-khmer ${
              activeTab === "story"
                ? "border-rose-400 text-rose-200 bg-white/5"
                : "border-transparent text-white/60 hover:text-white"
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            ឈ្មោះ & អត្ថបទ
          </button>
          <button
            onClick={() => setActiveTab("memories")}
            className={`flex-1 py-3 px-2 flex items-center justify-center gap-1.5 transition-colors border-b-2 font-medium font-khmer ${
              activeTab === "memories"
                ? "border-rose-400 text-rose-200 bg-white/5"
                : "border-transparent text-white/60 hover:text-white"
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            រូបថត
          </button>
          <button
            onClick={() => setActiveTab("media")}
            className={`flex-1 py-3 px-2 flex items-center justify-center gap-1.5 transition-colors border-b-2 font-medium font-khmer ${
              activeTab === "media"
                ? "border-rose-400 text-rose-200 bg-white/5"
                : "border-transparent text-white/60 hover:text-white"
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            វីដេអូ & ភ្លេង
          </button>
          <button
            onClick={() => setActiveTab("chapters")}
            className={`flex-1 py-3 px-2 flex items-center justify-center gap-1.5 transition-colors border-b-2 font-medium font-khmer ${
              activeTab === "chapters"
                ? "border-rose-400 text-rose-200 bg-white/5"
                : "border-transparent text-white/60 hover:text-white"
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            ជំពូកនីមួយៗ
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {copiedNotification && (
            <div className="p-3 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>{copiedNotification}</span>
            </div>
          )}

          {activeTab === "story" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-rose-200/80 mb-1">
                    ឈ្មោះគូស្នេហ៍ (ខាងស្រី)
                  </label>
                  <input
                    type="text"
                    value={config.herName}
                    onChange={(e) => handleTextChange("herName", e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-rose-400 font-khmer"
                    placeholder="រចនា"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-rose-200/80 mb-1">
                    ឈ្មោះរបស់អ្នក (ខាងប្រុស)
                  </label>
                  <input
                    type="text"
                    value={config.yourName}
                    onChange={(e) => handleTextChange("yourName", e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-rose-400 font-khmer"
                    placeholder="ចិត្រា"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-rose-200/80 mb-1">
                    កាលបរិច្ឆេទខួប
                  </label>
                  <input
                    type="text"
                    value={config.anniversaryDate}
                    onChange={(e) => handleTextChange("anniversaryDate", e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-rose-400 font-khmer"
                    placeholder="១៤ តុលា"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-rose-200/80 mb-1">
                    ចំនួនឆ្នាំគម្រប់
                  </label>
                  <input
                    type="text"
                    value={config.yearsCount}
                    onChange={(e) => handleTextChange("yearsCount", e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-rose-400 font-khmer"
                    placeholder="គម្រប់ពីរឆ្នាំ"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-rose-200/80 mb-1">
                  ចំណងជើងរឿងរ៉ាវ (Hero Title)
                </label>
                <input
                  type="text"
                  value={config.heroTitle}
                  onChange={(e) => handleTextChange("heroTitle", e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-rose-400 font-khmer"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-rose-200/80 mb-1">
                  ពាក្យសារភាពស្នេហ៍ (Kinetic Climax)
                </label>
                <input
                  type="text"
                  value={config.kineticPhrase}
                  onChange={(e) => handleTextChange("kineticPhrase", e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-rose-400 font-khmer"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-rose-200/80 mb-1">
                  ពាក្យខ្សឹបផ្ដាំចុងក្រោយ (Final Choice)
                </label>
                <input
                  type="text"
                  value={config.finalPhrase}
                  onChange={(e) => handleTextChange("finalPhrase", e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-rose-400 font-khmer"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-rose-200/80 mb-1">
                  សំបុត្រស្នេហ៍ (កថាខណ្ឌទី ១)
                </label>
                <textarea
                  rows={3}
                  value={config.letterParagraphs[0] || ""}
                  onChange={(e) => {
                    const next = [...config.letterParagraphs];
                    next[0] = e.target.value;
                    onUpdateConfig({ ...config, letterParagraphs: next });
                  }}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-rose-400 resize-none font-khmer leading-relaxed"
                />
              </div>
            </div>
          )}

          {activeTab === "memories" && (
            <div className="space-y-4">
              <p className="text-xs text-stone-300 font-khmer leading-relaxed">
                រូបថតនីមួយៗ នឹងបង្ហាញឡើងក្នុងអាល់ប៊ុមភាពយន្ត ៣៥មម នៅពេលអ្នករំកិលដល់ ៥០% នៃដំណើររឿង។
              </p>
              {config.memories.map((mem, idx) => (
                <div key={mem.id} className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-2">
                  <div className="flex items-center justify-between text-xs text-rose-300 font-medium">
                    <span>អនុស្សាវរីយ៍ #{idx + 1}</span>
                    <span className="text-[10px] text-stone-400 font-khmer">{mem.location}</span>
                  </div>
                  <div className="flex gap-3">
                    <img
                      src={mem.image}
                      alt={mem.caption}
                      className="w-16 h-16 rounded-lg object-cover shrink-0 border border-white/10"
                    />
                    <div className="flex-1 space-y-1.5">
                      <input
                        type="text"
                        value={mem.caption}
                        onChange={(e) => handleMemoryChange(idx, "caption", e.target.value)}
                        placeholder="ការពិពណ៌នា..."
                        className="w-full px-2 py-1 text-xs rounded bg-black/40 border border-white/10 text-white focus:outline-none focus:border-rose-400 font-khmer"
                      />
                      <div className="grid grid-cols-2 gap-1.5">
                        <input
                          type="text"
                          value={mem.location || ""}
                          onChange={(e) => handleMemoryChange(idx, "location", e.target.value)}
                          placeholder="ទីតាំង..."
                          className="w-full px-2 py-1 text-[11px] rounded bg-black/40 border border-white/10 text-white font-khmer"
                        />
                        <input
                          type="text"
                          value={mem.date || ""}
                          onChange={(e) => handleMemoryChange(idx, "date", e.target.value)}
                          placeholder="កាលបរិច្ឆេទ..."
                          className="w-full px-2 py-1 text-[11px] rounded bg-black/40 border border-white/10 text-white font-khmer"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "media" && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
                <div className="flex items-center gap-2 text-rose-300 font-khmer text-sm">
                  <Film className="w-4 h-4" />
                  <span>វីដេអូដើម (Master AI Video)</span>
                </div>
                <p className="text-xs text-stone-300 leading-relaxed font-khmer">
                  ប្រព័ន្ធស្វែងរកឯកសារ <code className="text-rose-200 bg-black/40 px-1 py-0.5 rounded font-mono">assets/anniversary-video.mp4</code> ជាចម្បង។ ប្រសិនបើពុំទាន់មានឯកសារនោះទេ ប្រព័ន្ធនឹងដំណើរការចលនាពន្លឺភាពយន្តដោយស្វ័យប្រវត្តិ។
                </p>
                <div className="space-y-2">
                  <label className="block text-xs text-stone-400">ផ្លូវវីដេអូ ឬ URL បច្ចុប្បន្ន:</label>
                  <input
                    type="text"
                    value={config.videoSrc}
                    onChange={(e) => handleTextChange("videoSrc", e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded bg-black/40 border border-white/10 font-mono text-rose-200"
                  />
                </div>
                <div>
                  <label className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15 border border-white/10 text-xs font-medium cursor-pointer transition-colors font-khmer">
                    <Upload className="w-3.5 h-3.5 text-rose-300" />
                    <span>ជ្រើសរើសវីដេអូ MP4 ពីកុំព្យូទ័រមកសាកល្បង</span>
                    <input
                      type="file"
                      accept="video/mp4,video/webm"
                      onChange={handleVideoUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
                <div className="flex items-center justify-between text-rose-300 font-khmer text-sm">
                  <div className="flex items-center gap-2">
                    <Music className="w-4 h-4" />
                    <span>បទភ្លេងអមអារម្មណ៍</span>
                  </div>
                  <button
                    onClick={onToggleMusic}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-rose-500/20 text-rose-200 text-xs hover:bg-rose-500/30 transition-colors font-khmer"
                  >
                    {isPlayingMusic ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                    <span>{isPlayingMusic ? "កំពុងចាក់" : "បិទសំឡេង"}</span>
                  </button>
                </div>

                <p className="text-xs text-stone-300 leading-relaxed font-khmer">
                  មានភ្លេងព្យាណូអមអារម្មណ៍ស្រាប់ ឬអ្នកអាចដាក់ឯកសារ <code className="text-rose-200 bg-black/40 px-1 py-0.5 rounded font-mono">assets/music.mp3</code> ផ្ទាល់ខ្លួនរបស់អ្នក។
                </p>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-stone-400">
                    <span>កម្រិតសំឡេង</span>
                    <span>{Math.round(musicVolume * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={musicVolume}
                    onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
                    className="w-full accent-rose-400 cursor-pointer"
                  />
                </div>

                <div>
                  <label className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15 border border-white/10 text-xs font-medium cursor-pointer transition-colors font-khmer">
                    <Upload className="w-3.5 h-3.5 text-rose-300" />
                    <span>ជ្រើសរើសឯកសារ MP3 ពីកុំព្យូទ័រ</span>
                    <input
                      type="file"
                      accept="audio/mp3,audio/mpeg,audio/wav"
                      onChange={handleAudioUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === "chapters" && (
            <div className="space-y-2">
              <p className="text-xs text-stone-300 mb-3 font-khmer leading-relaxed">
                ចុចលើជំពូកណាមួយ ដើម្បីរំកិលវីដេអូ និងដំណើររឿងទៅកាន់ឈុតឆាកនោះភ្លាមៗ:
              </p>
              {chapters.map((ch) => (
                <button
                  key={ch.label}
                  onClick={() => {
                    onJumpToProgress(ch.progress);
                    onClose();
                  }}
                  className="w-full p-2.5 rounded-lg bg-white/5 hover:bg-rose-500/15 border border-white/5 hover:border-rose-400/30 text-left transition-all group flex items-center justify-between font-khmer"
                >
                  <div>
                    <div className="text-xs font-medium text-rose-100 group-hover:text-rose-300">
                      {ch.label}
                    </div>
                    <div className="text-[11px] text-stone-400">{ch.desc}</div>
                  </div>
                  <Compass className="w-4 h-4 text-stone-500 group-hover:text-rose-300 transition-colors" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-white/10 bg-black/40 flex items-center justify-between gap-3">
          <button
            onClick={onOpenExportGuide}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-xs text-rose-200 transition-colors font-khmer"
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>ការណែនាំ & កូដឯករាជ្យ</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-rose-500 hover:bg-rose-600 text-white text-xs font-medium transition-colors font-khmer"
          >
            បិទ & ទស្សនា
          </button>
        </div>
      </div>
    </div>
  );
};
