import { createRound, pickNextStudent } from './game-engine.js';

const DEFAULT_STUDENTS = ['An Nhiên', 'Bảo Ngọc', 'Gia Hân', 'Minh Khang', 'Thanh Vy'];
const SKINS = [
  { id: 'jupiter', name: 'Thám hiểm Sao Mộc', accent: '#9af76d', accent2: '#6ddaf7' },
  { id: 'rescue', name: 'Đội cứu hộ Ngân Hà', accent: '#ffbd6a', accent2: '#ff6e9b' },
  { id: 'treasure', name: 'Thợ săn kho báu Vũ trụ', accent: '#d2a8ff', accent2: '#7ba9ff' },
];

const elements = {
  call: document.querySelector('#call-button'), reset: document.querySelector('#reset-button'),
  name: document.querySelector('#student-name'), status: document.querySelector('#student-status'),
  list: document.querySelector('#student-list'), progress: document.querySelector('#progress-fill'),
  progressLabel: document.querySelector('#progress-label'), mission: document.querySelector('#mission-text'),
  settings: document.querySelector('#settings-dialog'), settingsOpen: document.querySelector('#settings-button'),
  input: document.querySelector('#students-input'), save: document.querySelector('#save-students-button'),
  skinDialog: document.querySelector('#skin-dialog'), skinOpen: document.querySelector('#skin-button'),
  skinName: document.querySelector('#skin-name'), skinGrid: document.querySelector('#skin-grid'),
  sound: document.querySelector('#sound-button'),
};

let students = loadStudents();
let round = createRound(students);
let selectedSkin = SKINS[0];
let soundOn = true;

function loadStudents() {
  try {
    const saved = JSON.parse(localStorage.getItem('ufo-students'));
    return Array.isArray(saved) && saved.length ? saved : DEFAULT_STUDENTS;
  } catch { return DEFAULT_STUDENTS; }
}
function saveStudents() { try { localStorage.setItem('ufo-students', JSON.stringify(students)); } catch {} }
function playSignal() {
  if (!soundOn || !window.AudioContext) return;
  const context = new AudioContext(); const oscillator = context.createOscillator(); const gain = context.createGain();
  oscillator.frequency.setValueAtTime(480, context.currentTime); oscillator.frequency.exponentialRampToValueAtTime(740, context.currentTime + .12);
  gain.gain.setValueAtTime(.06, context.currentTime); gain.gain.exponentialRampToValueAtTime(.001, context.currentTime + .18);
  oscillator.connect(gain).connect(context.destination); oscillator.start(); oscillator.stop(context.currentTime + .2);
}
function render() {
  const total = students.length; const done = round.called.length;
  elements.progress.style.width = `${total ? (done / total) * 100 : 0}%`;
  elements.progressLabel.textContent = `${done} / ${total} học sinh`;
  elements.mission.textContent = round.isComplete && total ? 'Đã hoàn thành lượt gọi bài!' : `Còn ${round.remaining.length} bạn đang chờ tín hiệu`;
  elements.call.disabled = round.isComplete || total === 0;
  elements.call.textContent = round.isComplete ? '✓ Đã gọi đủ lượt' : '🎲 Gọi học sinh';
  elements.list.innerHTML = students.map((student) => `<span class="student-chip ${round.called.includes(student) ? 'called' : ''}">${round.called.includes(student) ? '✓' : '✦'} ${student}</span>`).join('');
}
function callStudent() {
  const result = pickNextStudent(round); round = result.round;
  if (!result.student) return render();
  elements.name.textContent = result.student;
  elements.status.textContent = round.isComplete ? 'Bạn là tín hiệu cuối cùng — hoàn thành nhiệm vụ!' : 'Đã nhận tín hiệu. Mời bạn lên trạm UFO!';
  document.querySelector('#student-card').classList.remove('arrive'); requestAnimationFrame(() => document.querySelector('#student-card').classList.add('arrive'));
  playSignal(); render();
}
function resetRound() { round = createRound(students); elements.name.textContent = 'Bấm để gọi học sinh'; elements.status.textContent = 'UFO sẽ chọn ngẫu nhiên, không gọi trùng trong lượt.'; render(); }
function renderSkins() {
  elements.skinGrid.innerHTML = SKINS.map((skin) => `<button class="skin-option ${skin.id === selectedSkin.id ? 'selected' : ''}" type="button" data-skin="${skin.id}" style="--skin-a:${skin.accent};--skin-b:${skin.accent2}"><span class="skin-preview">🛸</span><strong>${skin.name}</strong><small>${skin.id === selectedSkin.id ? 'Đang dùng' : 'Chọn skin'}</small></button>`).join('');
}
function selectSkin(id) { selectedSkin = SKINS.find((skin) => skin.id === id) || SKINS[0]; document.documentElement.style.setProperty('--accent', selectedSkin.accent); document.documentElement.style.setProperty('--accent-2', selectedSkin.accent2); elements.skinName.textContent = selectedSkin.name; renderSkins(); }

elements.call.addEventListener('click', callStudent); elements.reset.addEventListener('click', resetRound);
elements.settingsOpen.addEventListener('click', () => { elements.input.value = students.join('\n'); elements.settings.showModal(); });
elements.save.addEventListener('click', (event) => { event.preventDefault(); const next = elements.input.value.split('\n').map((name) => name.trim()).filter(Boolean); if (!next.length) { elements.input.focus(); return; } students = [...new Set(next)]; saveStudents(); resetRound(); elements.settings.close(); });
elements.skinOpen.addEventListener('click', () => { renderSkins(); elements.skinDialog.showModal(); });
elements.skinGrid.addEventListener('click', (event) => { const button = event.target.closest('[data-skin]'); if (!button) return; selectSkin(button.dataset.skin); elements.skinDialog.close(); });
elements.sound.addEventListener('click', () => { soundOn = !soundOn; elements.sound.textContent = soundOn ? '🔊' : '🔇'; });
selectSkin(selectedSkin.id); render();
