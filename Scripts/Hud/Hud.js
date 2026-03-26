const ScoreValEl = document.getElementById('ScoreVal');
const BestValEl = document.getElementById('BestVal');
const LevelValEl = document.getElementById('LevelVal');
const ComboDisplayEl = document.getElementById('ComboDisplay');
const ProgressLabelEl = document.getElementById('ProgressLabel');
const ProgressBarFillEl = document.getElementById('ProgressBarFill');
const LevelUpMsgEl = document.getElementById('LevelUpMsg');
const BonusHudEl = document.getElementById('BonusHud');
const BonusCountdownEl = document.getElementById('BonusCountdown');
const BonusBarFillEl = document.getElementById('BonusBarFill');

let BonusIntervalId = null;
let BonusStartMs = 0;
let BonusTotalMs = 0;

export const UpdateHud = (Score, Best, Level, FoodsInLevel, FoodsPerLevelCount) => {
  ScoreValEl.textContent = Score;
  BestValEl.textContent = Best;
  LevelValEl.textContent = Level;
  const Pct = Math.min(FoodsInLevel / FoodsPerLevelCount * 100, 100);
  ProgressBarFillEl.style.width = Pct + '%';
  ProgressLabelEl.textContent = `${FoodsInLevel} / ${FoodsPerLevelCount} TO LEVEL ${Level + 1}`;
};

export const ShowComboHud = (Combo) => {
  if (Combo < 2) { ComboDisplayEl.style.opacity = '0'; return; }
  ComboDisplayEl.textContent = `x${Combo} COMBO!`;
  ComboDisplayEl.style.opacity = '1';
  clearTimeout(ComboDisplayEl._T);
  ComboDisplayEl._T = setTimeout(() => { ComboDisplayEl.style.opacity = '0'; }, 1600);
};

export const ShowLevelUp = () => {
  LevelUpMsgEl.style.animation = 'none';
  void LevelUpMsgEl.offsetHeight;
  LevelUpMsgEl.style.animation = 'level-up-anim 1.5s ease forwards';
};

export const ShowBonusHud = (DurationMs) => {
  BonusStartMs = performance.now();
  BonusTotalMs = DurationMs;
  BonusHudEl.style.display = 'flex';
  BonusHudEl.classList.remove('Urgent');
  clearInterval(BonusIntervalId);
  BonusIntervalId = setInterval(() => {
    const Remaining = Math.max(0, BonusTotalMs - (performance.now() - BonusStartMs));
    BonusCountdownEl.textContent = Math.ceil(Remaining / 1000);
    BonusBarFillEl.style.width = (Remaining / BonusTotalMs * 100) + '%';
    if (Remaining <= 3000) BonusHudEl.classList.add('Urgent');
  }, 100);
};

export const HideBonusHud = () => {
  clearInterval(BonusIntervalId);
  BonusHudEl.style.display = 'none';
  BonusHudEl.classList.remove('Urgent');
};
