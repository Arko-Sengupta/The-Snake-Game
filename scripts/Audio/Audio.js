let Actx = null;

const Ac = () => {
  try {
    if (!Actx) Actx = new (window.AudioContext || window.webkitAudioContext)();
    if (Actx.state === 'suspended') Actx.resume();
    return Actx;
  } catch (E) { return null; }
};

const Tone = ({ Type = 'sine', Freq = 440, EndFreq = null, Dur = 0.15, Gain = 0.1, Delay = 0 } = {}) => {
  try {
    const Ctx = Ac();
    if (!Ctx) return;
    const T = Ctx.currentTime + Delay;
    const Osc = Ctx.createOscillator();
    const G = Ctx.createGain();
    Osc.connect(G); G.connect(Ctx.destination);
    Osc.type = Type;
    Osc.frequency.setValueAtTime(Freq, T);
    if (EndFreq !== null) Osc.frequency.exponentialRampToValueAtTime(EndFreq, T + Dur);
    G.gain.setValueAtTime(Gain, T);
    G.gain.exponentialRampToValueAtTime(0.0001, T + Dur);
    Osc.start(T); Osc.stop(T + Dur + 0.01);
  } catch (E) { }
};

export const SndMove = () => Tone({ Type: 'square', Freq: 80, Dur: 0.03, Gain: 0.03 });
export const SndEat = () => { Tone({ Freq: 440, Dur: 0.15, Gain: 0.15 }); Tone({ Freq: 880, Dur: 0.15, Gain: 0.10 }); };
export const SndCombo = (C) => Tone({ Freq: 220 * C, Dur: 0.2, Gain: 0.12 });
export const SndLevelUp = () => [261.63, 329.63, 392, 523.25].forEach((F, I) => Tone({ Freq: F, Dur: 0.18, Gain: 0.13, Delay: I * 0.1 }));
export const SndDeath = () => Tone({ Type: 'sawtooth', Freq: 400, EndFreq: 50, Dur: 0.8, Gain: 0.18 });
export const SndBonusSpawn = () => [523.25, 659.25, 783.99, 1046.5].forEach((F, I) => Tone({ Freq: F, Dur: 0.12, Gain: 0.1, Delay: I * 0.07 }));
export const SndBonusEat = () => { [523.25, 783.99, 1046.5, 1318.5].forEach((F, I) => Tone({ Freq: F, Dur: 0.18, Gain: 0.16, Delay: I * 0.06 })); };