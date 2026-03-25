const ScoreValEl = document.getElementById('ScoreVal');
const BestValEl = document.getElementById('BestVal');
const LevelValEl = document.getElementById('LevelVal');
const ComboDisplayEl = document.getElementById('ComboDisplay');
const ProgressLabelEl = document.getElementById('ProgressLabel');
const ProgressBarFillEl = document.getElementById('ProgressBarFill');
const LevelUpMsgEl = document.getElementById('LevelUpMsg');

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
