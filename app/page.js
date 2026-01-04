"use client";

import { Loader } from "lucide-react";
import { useState } from "react";

function page() {
  const [resolution, setResolution] = useState("");
  const [prediction, setPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const generateImage = async (
    prompt,
    model = "gemini-2.5-flash-image-preview"
  ) => {
    if (!window.puter) {
      throw new Error("Puter.js not loaded");
    }

    const imgElement = await window.puter.ai.txt2img(prompt, {
      model,
    });

    return imgElement.src; // 🔑 return usable image URL
  };


  const handlePredict = async () => {
    if (!resolution.trim()) return;

    setIsLoading(true);

    try {
      // 1️⃣ Fetch mirror text from Gemini
      const mirrorRes = await fetch("/api/mirror", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resolution }),
      });

      if (!mirrorRes.ok) throw new Error("Mirror API failed");

      const mirrorData = await mirrorRes.json();

      // 2️⃣ Generate images via Puter.js
      const genjitsuPrompt = `
dark, muted, cinematic realism,
lonely atmosphere, failure, stagnation,
soft shadows, empty room,
symbol of lost motivation,
${mirrorData.genjitsu.image_prompt}
`;

      const miraiPrompt = `
bright, warm lighting, hopeful,
cinematic, peaceful success,
golden hour, growth, clarity,
symbol of consistency,
${mirrorData.mirai.image_prompt}
`;

      const genjitsuImage = await generateImage(genjitsuPrompt);
      const miraiImage = await generateImage(miraiPrompt);

      // 3️⃣ Update UI
      setPrediction({
        likelyReality: {
          date: mirrorData.genjitsu.date,
          reason: mirrorData.genjitsu.reason,
          explanation: mirrorData.genjitsu.explanation,
          imageUrl: genjitsuImage,
          imageDescription: mirrorData.genjitsu.image_prompt,
        },
        possibleFuture: {
          date: mirrorData.mirai.date,
          reason: mirrorData.mirai.reason,
          explanation: mirrorData.mirai.explanation,
          imageUrl: miraiImage,
          imageDescription: mirrorData.mirai.image_prompt,
        },
      });
    } catch (err) {
      console.error(err);
      alert("The mirror is cloudy today. Try again.");
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen">
      <div className="relative max-w-6xl mx-auto px-4 py-12 sm:py-20">
        <div className="text-center mb-12 sm:mb-16">
          <div className="flex items-center justify-center mb-4">
            <span className="text-5xl">✨</span>
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-3">
            Mirai no kagami (未来の鏡)
          </h1>
          <p className="text-lg sm:text-xl text-white/70 font-normal">
            Two reflections. One choice. One year.
          </p>
        </div>

        <div className="glass-card p-8 sm:p-10 mb-12 max-w-2xl mx-auto border-orange-400/30">
          <div className="space-y-6">
            <div>
              <label
                htmlFor="resolution"
                className="block text-lg text-amber-300 mb-3 font-light"
              >
                What's your 2026 resolution?
              </label>
              <textarea
                id="resolution"
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                placeholder="e.g., Go to the gym 5 days a week"
                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-orange-400/50 focus:border-transparent resize-none transition-all font-light backdrop-blur-sm"
                rows={3}
                disabled={isLoading}
              />
              <p className="text-sm text-white/50 mt-2 font-light">
                Just type what's on your mind. This mirror listens.
              </p>
            </div>

            <button
              onClick={handlePredict}
              disabled={!resolution.trim() || isLoading}
              className="w-full py-4 px-6 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-light rounded-full hover:from-amber-400 hover:to-orange-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl active:scale-95 tracking-wide"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">
                    <Loader />
                  </span>
                  Predicting your reality...
                </span>
              ) : (
                "See Both Futures"
              )}
            </button>
          </div>
        </div>

        {prediction && (
          <div className="space-y-12 animate-fade-in">
            <div className="glass-card p-8 sm:p-10 max-w-3xl mx-auto border-orange-400/30 animate-slide-in">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-orange-400/70 uppercase tracking-wider font-light mb-3">
                    Your Resolution
                  </p>
                  <p className="text-2xl font-light text-orange-200">
                    {resolution}
                  </p>
                </div>
                <p className="text-white/80 leading-relaxed text-lg font-light">
                  What follows isn’t fate — just two paths quietly waiting.
                </p>
              </div>
            </div>

            <div className="text-center max-w-2xl mx-auto">
              <p className="text-white/70 text-lg leading-relaxed italic font-light">
                Both futures are real. Only one asks you to return tomorrow.
              </p>
            </div>

            <div className="max-w-4xl mx-auto space-y-8">
              <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
                <div
                  className="glass-card p-8 sm:p-10 border-orange-400/30 hover:border-orange-400/50 transition-all duration-300 animate-slide-in"
                  style={{ animationDelay: "100ms" }}
                >
                  <div className="mirror-shimmer" />
                  <div className="phase-glow" />

                  <div className="mirror-label-left">
                    <span className="text-[10px] text-orange-400/60 font-light tracking-[0.2em]">
                      GENJITSU (現実)
                    </span>
                  </div>

                  <div className="relative z-10 space-y-5">
                    <div>
                      <p className="text-sm text-orange-400/70 uppercase tracking-wider font-light mb-2">
                        When it fades
                      </p>
                      <p className="text-3xl font-light text-orange-300">
                        {prediction.likelyReality.date}
                      </p>
                      <p className="text-sm text-white/60 mt-2 italic font-light">
                        {prediction.likelyReality.reason}
                      </p>
                    </div>

                    <p className="text-white/80 leading-relaxed border-l border-orange-400/30 pl-4 py-2 font-light">
                      {prediction.likelyReality.explanation}
                    </p>

                    <div className="relative rounded-xl overflow-hidden bg-white/5 h-64 border border-orange-400/20">
                      {!prediction?.likelyReality?.imageUrl && (
                        <div className="h-64 bg-white/5 animate-pulse rounded-xl" />
                      )}
                      <img
                        src={prediction.likelyReality.imageUrl}
                        alt={prediction.likelyReality.imageDescription}
                        className="w-full h-full object-cover opacity-70 grayscale hover:opacity-85 transition-opacity duration-300"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-amber-950/90 to-transparent p-4">
                        <p className="text-sm text-white/80 italic font-light">
                          {prediction.likelyReality.imageDescription}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className="glass-card p-8 sm:p-10 border-rose-400/20 hover:border-rose-400/30 transition-all duration-300 animate-slide-in"
                  style={{ animationDelay: "200ms" }}
                >
                  <div className="mirror-shimmer" style={{ opacity: 0.5 }} />

                  <div className="mirror-label-right">
                    <span className="text-[10px] text-rose-400/60 font-light tracking-[0.2em]">
                      MIRAI (未来)
                    </span>
                  </div>

                  <div className="mirror-content relative z-10 space-y-5">
                    <div>
                      <p className="text-sm text-rose-400/60 uppercase tracking-wider font-light mb-2">
                        When it sticks
                      </p>
                      <p className="text-3xl font-light text-rose-300">
                        {prediction.possibleFuture.date}
                      </p>
                      <p className="text-sm text-white/60 mt-2 italic font-light">
                        {prediction.possibleFuture.reason}
                      </p>
                    </div>

                    <p className="text-white/80 leading-relaxed border-l border-rose-400/20 pl-4 py-2 font-light">
                      {prediction.possibleFuture.explanation}
                    </p>

                    <div className="relative rounded-xl overflow-hidden bg-white/5 h-64 border border-rose-400/20">
                      {!prediction?.possibleFuture?.imageUrl && (
                        <div className="h-64 bg-white/5 animate-pulse rounded-xl" />
                      )}
                      <img
                        src={prediction.possibleFuture.imageUrl}
                        alt={prediction.possibleFuture.imageDescription}
                        className="w-full h-full object-cover opacity-60 hover:opacity-75 transition-opacity duration-300"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-rose-950/90 to-transparent p-4">
                        <p className="text-sm text-white/80 italic font-light">
                          {prediction.possibleFuture.imageDescription}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="glass-card p-8 sm:p-10 border-rose-400/20 max-w-2xl mx-auto animate-slide-in"
                style={{ animationDelay: "300ms" }}
              >
                <div className="space-y-4 text-center">
                  <p className="text-lg leading-relaxed text-white/80 font-light">
                    This mirror doesn’t judge. It only reflects.
                  </p>
                  <p className="text-sm text-white/60 font-light">
                    You don't need perfection. Just one more day than yesterday.
                  </p>
                </div>
              </div>

              <div className="text-center pt-4">
                <button
                  onClick={() => {
                    setPrediction(null);
                    setResolution("");
                  }}
                  className="text-orange-400/70 hover:text-orange-300 font-light transition-colors text-sm tracking-wide"
                >
                  ← Try another resolution
                </button>
              </div>
            </div>
          </div>
        )}

        {!prediction && (
          <div className="text-center text-white/50 mt-12 font-light">
            <p className="text-sm">This is a safe space. No judgment here.</p>
          </div>
        )}

        <div className="mt-16 text-center text-white/40 text-sm font-light">
          <p>Built with humor, honesty, and a dash of reality.</p>
        </div>
      </div>
    </div>
  );
}

export default page;
