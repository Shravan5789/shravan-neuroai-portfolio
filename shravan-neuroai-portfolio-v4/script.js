const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav-links');
if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.textContent = open ? '×' : '☰';
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.textContent = '☰';
  }));
}

// Small, accessible signal sandbox: generated values are illustrative, never biological data.
const frequency = document.querySelector('#frequency');
const amplitude = document.querySelector('#amplitude');
const modulation = document.querySelector('#modulation');
const waveLine = document.querySelector('#wave-line');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function drawSignal() {
  if (!frequency || !amplitude || !modulation || !waveLine) return;
  const hz = Number(frequency.value);
  const amp = Number(amplitude.value);
  const mod = Number(modulation.value);
  const points = [];
  for (let x = 0; x <= 720; x += 3) {
    const t = x / 720;
    const envelope = 1 - (mod / 100) * (0.5 + 0.5 * Math.sin(t * Math.PI * 4));
    const y = 120 - Math.sin(t * Math.PI * 2 * (hz / 4)) * (amp * 0.88) * envelope;
    points.push(`${x},${y.toFixed(2)}`);
  }
  waveLine.setAttribute('points', points.join(' '));
  document.querySelector('#frequency-value').textContent = hz;
  document.querySelector('#amplitude-value').textContent = amp;
  document.querySelector('#modulation-value').textContent = mod;
  document.querySelector('#metric-frequency').textContent = hz;
  document.querySelector('#metric-amplitude').textContent = amp;
  document.querySelector('#metric-power').innerHTML = `${((amp / 100) ** 2 * 100).toFixed(1)}<small> a.u.</small>`;
  waveLine.style.opacity = String(0.68 + (amp / 100) * 0.32);

  // Explain the selected synthetic pattern in educational, non-diagnostic language.
  const patternTitle = document.querySelector('#insight-pattern-title');
  const patternText = document.querySelector('#insight-pattern');
  const bandTag = document.querySelector('#insight-band-tag');
  const question = document.querySelector('#insight-question');
  const outcome = document.querySelector('#insight-outcome');
  let bandName = 'higher-frequency example';
  let bandRange = '31–40 Hz · illustrative range';
  let context = 'This sits in a higher-frequency range sometimes discussed in gamma-band analyses. A real recording would need careful filtering and artefact checks.';
  if (hz <= 3) {
    bandName = 'delta-range example'; bandRange = 'about 1–3 Hz · illustrative band';
    context = 'This is a slow oscillation in a delta-range example. In real EEG, slow activity is interpreted alongside sleep/wake state, age, task and recording quality.';
  } else if (hz <= 7) {
    bandName = 'theta-range example'; bandRange = 'about 4–7 Hz · illustrative band';
    context = 'This is in a theta-range example. Researchers may investigate theta activity in memory or cognitive tasks, but frequency alone cannot establish what someone is doing or experiencing.';
  } else if (hz <= 12) {
    bandName = 'alpha-range example'; bandRange = 'about 8–12 Hz · illustrative band';
    context = 'This is in a commonly used alpha-range example. A real study might compare alpha-band features across conditions; this simulated regular wave does not indicate a person\'s attention or relaxation.';
  } else if (hz <= 30) {
    bandName = 'beta-range example'; bandRange = 'about 13–30 Hz · illustrative band';
    context = 'This is in a beta-range example. Analysts might test whether beta-band features differ across task conditions, while checking muscle artefacts and other confounds.';
  }
  if (patternTitle) patternTitle.textContent = bandName.replace(/^./, c => c.toUpperCase());
  if (patternText) patternText.textContent = `${hz} Hz selected. ${context} The displayed rhythm is mathematically generated, not measured from a brain.`;
  if (bandTag) bandTag.textContent = bandRange;
  if (question) question.textContent = mod >= 50
    ? `The selected modulation is ${mod}%, so the simulated envelope varies more. A useful research question is whether variability features differ between labelled conditions in a real dataset.`
    : `The selected modulation is ${mod}%, so the simulated envelope is relatively steady. A useful research question is whether frequency or power changes between two labelled conditions in real recordings.`;
  if (outcome) outcome.textContent = `For this setting, the demo reports ${hz} Hz, ${amp}% relative amplitude and an illustrative power index of ${((amp / 100) ** 2 * 100).toFixed(1)} a.u. A project could log these features across trials and test whether they add predictive value against a baseline.`;
}
[frequency, amplitude, modulation].forEach(input => input && input.addEventListener('input', drawSignal));
const resetSignal = document.querySelector('#reset-signal');
if (resetSignal) resetSignal.addEventListener('click', () => {
  frequency.value = 10; amplitude.value = 50; modulation.value = 35; drawSignal();
});
drawSignal();

// Gentle pointer tilt on decorative cards; disabled for reduced-motion preferences.
if (!reduceMotion) {
  document.querySelectorAll('.project-card, .cognitive-card').forEach(card => {
    card.addEventListener('pointermove', event => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.setProperty('--tilt-x', `${(-y * 2).toFixed(2)}deg`);
      card.style.setProperty('--tilt-y', `${(x * 2).toFixed(2)}deg`);
    });
    card.addEventListener('pointerleave', () => {
      card.style.setProperty('--tilt-x', '0deg'); card.style.setProperty('--tilt-y', '0deg');
    });
  });
}
