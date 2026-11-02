import { createRound } from './game-engine.js';
import { createWorld3D } from './scene3d.js';
import { chooseScanWinners, clampPickCount, scanTargetAt } from './scan-round.js';
import { startChase, stopChase, ping, reveal, setMusicEnabled, setSfxEnabled, loadAudioPreferences, getAudioState } from './suspense-sound.js';
import { UFO_SKINS, CREW_SKINS, getUfoSkin, getCrewSkin, loadSkinPreferences, saveSkinPreferences } from './skin-catalog.js';

const DEFAULT_STUDENTS = ['An Nhiên', 'Bảo Ngọc', 'Gia Hân', 'Minh Khang', 'Thanh Vy'];
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

const el = {
  call: $('#call-button'),
  reset: $('#reset-button'),
  name: $('#student-name'),
  status: $('#student-status'),
  list: $('#student-list'),
  progress: $('#progress-fill'),
  progressLabel: $('#progress-label'),
  mission: $('#mission-text'),
  settings: $('#settings-dialog'),
  settingsOpen: $('#settings-button'),
  input: $('#students-input'),
  save: $('#save-students-button'),
  skinDialog: $('#skin-dialog'),
  skinOpen: $('#skin-button'),
  ufoSkinName: $('#ufo-skin-name'),
  crewSkinName: $('#crew-skin-name'),
  ufoSkinGrid: $('#ufo-skin-grid'),
  crewSkinGrid: $('#crew-skin-grid'),
  music: $('#music-button'),
  sound: $('#sound-button'),
  pick: $('#pick-count'),
  dec: $('#pick-dec'),
  inc: $('#pick-inc'),
  repeat: $('#no-repeat'),
  timer: $('#scan-timer'),
  title: $('#scan-title'),
  help: $('#scan-help')
};

let students = loadStudents();
let round = createRound(students);
let world = null;
let pickCount = 1;
let noRepeat = true;
let seconds = 6;
let scanning = false;
let scanInterval = null;

// Load preferences
const skinPrefs = loadSkinPreferences();
let ufoSkin = getUfoSkin(skinPrefs.ufoSkinId);
let crewSkin = getCrewSkin(skinPrefs.crewSkinId);

const audioPrefs = loadAudioPreferences();
let musicOn = audioPrefs.musicEnabled;
let sfxOn = audioPrefs.sfxEnabled;

function loadStudents() {
  try {
    const x = JSON.parse(localStorage.getItem('ufo-students'));
    return Array.isArray(x) && x.length ? x : DEFAULT_STUDENTS;
  } catch {
    return DEFAULT_STUDENTS;
  }
}

function saveStudents() {
  try {
    localStorage.setItem('ufo-students', JSON.stringify(students));
  } catch {}
}

function available() {
  return noRepeat ? round.remaining : students;
}

function render() {
  const total = students.length;
  const done = round.called.length;
  const ready = available().length;
  
  pickCount = clampPickCount(pickCount, ready);
  
  el.progress.style.width = `${total ? done / total * 100 : 0}%`;
  el.progressLabel.textContent = `${done} / ${total} học sinh`;
  el.mission.textContent = ready ? `Còn ${ready} bạn đang chờ tín hiệu` : 'Đã hoàn thành lượt gọi bài!';
  
  el.pick.textContent = pickCount;
  el.dec.disabled = scanning || pickCount <= 1;
  el.inc.disabled = scanning || pickCount >= Math.max(1, ready);
  el.call.disabled = scanning || !ready;
  el.call.textContent = scanning ? '🔎 Đang dò tìm…' : ready ? '🚀 Bắt đầu dò tìm' : '✓ Đã gọi đủ lượt';
  
  // Render student list - use textContent to avoid XSS
  el.list.innerHTML = '';
  students.forEach(name => {
    const chip = document.createElement('span');
    chip.className = `student-chip ${noRepeat && round.called.includes(name) ? 'called' : ''}`;
    chip.textContent = `${noRepeat && round.called.includes(name) ? '✓' : '✦'} ${name}`;
    el.list.appendChild(chip);
  });
  
  el.help.textContent = `Nhấn Space để bắt đầu · Dò tìm trong ${seconds} giây · Cơ hội như nhau cho ${ready} học sinh.`;
  
  // Disable skin button while scanning
  if (el.skinOpen) {
    el.skinOpen.disabled = scanning;
  }
}

function setTimer(left, mode = 'SẴN SÀNG DÒ TÌM') {
  el.timer.innerHTML = `${left} GIÂY<br><small>${mode}</small>`;
}

function startScan() {
  if (scanning || !available().length) return;
  
  scanning = true;
  document.querySelector('.stage').classList.add('scanning');
  el.name.closest('.world-card').classList.add('scanning');
  
  const pool = available();
  const winners = chooseScanWinners(pool, pickCount);
  let remaining = seconds;
  let tick = 0;
  
  el.name.textContent = 'ĐANG DÒ TÌM…';
  el.status.textContent = 'UFO chớp sáng và đổi mục tiêu. Kết quả được giữ bí mật đến giây cuối.';
  el.title.textContent = 'UFO đang quét khu phố';
  
  world?.beginScan(pool);
  render();
  setTimer(remaining, 'ĐANG DÒ TÌM');
  startChase(seconds);
  
  scanInterval = setInterval(() => {
    tick++;
    remaining--;
    
    const target = scanTargetAt(pool, tick, .55);
    const intensity = 1 - remaining / seconds;
    
    world?.scanTarget(target, intensity);
    ping(intensity);
    
    el.name.textContent = target;
    el.name.classList.remove('scan-zoom');
    void el.name.offsetWidth;
    el.name.classList.add('scan-zoom');
    
    el.status.textContent = `Đang quét tín hiệu quanh ${target}…`;
    setTimer(Math.max(0, remaining), 'ĐANG DÒ TÌM');
    
    if (remaining <= 0) {
      clearInterval(scanInterval);
      finishScan(winners);
    }
  }, 650);
}

function finishScan(winners) {
  stopChase();
  document.querySelector('.stage').classList.remove('scanning');
  el.name.closest('.world-card').classList.remove('scanning');
  
  el.name.textContent = 'ĐANG KHÓA TÍN HIỆU…';
  el.status.textContent = 'UFO đã khóa kết quả. Tên sẽ được công bố sau khi hút xong.';
  
  world?.finishScan(winners, () => {
    winners.forEach(x => {
      if (noRepeat && !round.called.includes(x)) {
        round.called.push(x);
      }
    });
    
    round.remaining = students.filter(x => !round.called.includes(x));
    round.isComplete = round.remaining.length === 0;
    scanning = false;
    
    world?.setStudents(students.filter(x => !noRepeat || !round.called.includes(x)));
    
    el.name.textContent = winners.join(' · ');
    el.status.textContent = 'Đã lên tàu thành công!';
    reveal();
    setTimer(seconds, 'HOÀN THÀNH NHIỆM VỤ');
    el.title.textContent = 'Đã công bố kết quả';
    render();
  });
}

function reset() {
  clearInterval(scanInterval);
  stopChase();
  document.querySelector('.stage').classList.remove('scanning');
  el.name.closest('.world-card').classList.remove('scanning');
  
  scanning = false;
  round = createRound(students);
  
  world?.setStudents(students);
  world?.cancelScan();
  
  el.name.textContent = 'Bấm để gọi học sinh';
  el.status.textContent = 'UFO đang tuần tra. Kéo khung 3D để xoay góc nhìn.';
  setTimer(seconds);
  render();
}

function selectUfoSkin(id) {
  ufoSkin = getUfoSkin(id);
  document.documentElement.style.setProperty('--accent', ufoSkin.accent);
  document.documentElement.style.setProperty('--accent-2', ufoSkin.accent2);
  
  if (el.ufoSkinName) {
    el.ufoSkinName.textContent = ufoSkin.name;
  }
  
  world?.setSkin(ufoSkin);
  saveSkinPreferences(ufoSkin.id, crewSkin.id);
  
  renderUfoSkinGrid();
}

function selectCrewSkin(id) {
  crewSkin = getCrewSkin(id);
  
  if (el.crewSkinName) {
    el.crewSkinName.textContent = crewSkin.name;
  }
  
  world?.setCharacterSkin(crewSkin.id);
  saveSkinPreferences(ufoSkin.id, crewSkin.id);
  
  renderCrewSkinGrid();
}

function renderUfoSkinGrid() {
  if (!el.ufoSkinGrid) return;
  
  el.ufoSkinGrid.innerHTML = '';
  UFO_SKINS.forEach(skin => {
    const btn = document.createElement('button');
    btn.className = `skin-option ${skin.id === ufoSkin.id ? 'selected' : ''}`;
    btn.type = 'button';
    btn.dataset.skin = skin.id;
    btn.style.setProperty('--skin-a', skin.accent);
    btn.style.setProperty('--skin-b', skin.accent2);
    
    const preview = document.createElement('span');
    preview.className = 'skin-preview';
    preview.textContent = '🛸';
    
    const name = document.createElement('strong');
    name.textContent = skin.name;
    
    btn.appendChild(preview);
    btn.appendChild(name);
    el.ufoSkinGrid.appendChild(btn);
  });
}

function renderCrewSkinGrid() {
  if (!el.crewSkinGrid) return;
  
  el.crewSkinGrid.innerHTML = '';
  CREW_SKINS.forEach(skin => {
    const btn = document.createElement('button');
    btn.className = `skin-option ${skin.id === crewSkin.id ? 'selected' : ''}`;
    btn.type = 'button';
    btn.dataset.skin = skin.id;
    
    const preview = document.createElement('span');
    preview.className = 'skin-preview';
    preview.textContent = skin.id === 'astronaut' ? '👨‍🚀' : 
                          skin.id === 'animals' ? '🐱' : 
                          skin.id === 'forest' ? '🌳' : '🤖';
    
    const nameEl = document.createElement('strong');
    nameEl.textContent = skin.name;
    
    const desc = document.createElement('small');
    desc.textContent = skin.description;
    
    btn.appendChild(preview);
    btn.appendChild(nameEl);
    btn.appendChild(desc);
    el.crewSkinGrid.appendChild(btn);
  });
}

// Event handlers
el.call.onclick = startScan;
el.reset.onclick = reset;

el.dec.onclick = () => {
  pickCount--;
  render();
};

el.inc.onclick = () => {
  pickCount++;
  render();
};

el.repeat.onclick = () => {
  noRepeat = !noRepeat;
  el.repeat.classList.toggle('on', noRepeat);
  el.repeat.setAttribute('aria-pressed', noRepeat);
  reset();
};

$$('[data-seconds]').forEach(b => {
  b.onclick = () => {
    seconds = Number(b.dataset.seconds);
    $$('[data-seconds]').forEach(x => x.classList.toggle('selected', x === b));
    setTimer(seconds);
    render();
  };
});

$$('[data-camera]').forEach(b => {
  b.onclick = () => {
    $$('[data-camera]').forEach(x => x.classList.toggle('selected', x === b));
    world?.setCameraMode(b.dataset.camera);
  };
});

el.settingsOpen.onclick = () => {
  el.input.value = students.join('\n');
  el.settings.showModal();
};

el.save.onclick = e => {
  e.preventDefault();
  const next = el.input.value.split('\n').map(x => x.trim()).filter(Boolean);
  if (next.length) {
    students = [...new Set(next)];
    saveStudents();
    el.settings.close();
    reset();
  }
};

el.skinOpen.onclick = () => {
  renderUfoSkinGrid();
  renderCrewSkinGrid();
  el.skinDialog.showModal();
};

if (el.ufoSkinGrid) {
  el.ufoSkinGrid.onclick = e => {
    const b = e.target.closest('[data-skin]');
    if (b) {
      selectUfoSkin(b.dataset.skin);
    }
  };
}

if (el.crewSkinGrid) {
  el.crewSkinGrid.onclick = e => {
    const b = e.target.closest('[data-skin]');
    if (b) {
      selectCrewSkin(b.dataset.skin);
    }
  };
}

if (el.music) {
  el.music.onclick = () => {
    musicOn = !musicOn;
    setMusicEnabled(musicOn);
    el.music.textContent = musicOn ? '🎵' : '🔇';
    el.music.setAttribute('aria-label', musicOn ? 'Tắt nhạc nền' : 'Bật nhạc nền');
  };
}

if (el.sound) {
  el.sound.onclick = () => {
    sfxOn = !sfxOn;
    setSfxEnabled(sfxOn);
    el.sound.textContent = sfxOn ? '🔊' : '🔇';
    el.sound.setAttribute('aria-label', sfxOn ? 'Tắt hiệu ứng âm' : 'Bật hiệu ứng âm');
  };
}

window.addEventListener('keydown', e => {
  if (e.code === 'Space' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
    e.preventDefault();
    startScan();
  }
});

// Initialize
selectUfoSkin(ufoSkin.id);
selectCrewSkin(crewSkin.id);
setTimer(seconds);
render();

if (el.music) {
  el.music.textContent = musicOn ? '🎵' : '🔇';
  el.music.setAttribute('aria-label', musicOn ? 'Tắt nhạc nền' : 'Bật nhạc nền');
}

if (el.sound) {
  el.sound.textContent = sfxOn ? '🔊' : '🔇';
  el.sound.setAttribute('aria-label', sfxOn ? 'Tắt hiệu ứng âm' : 'Bật hiệu ứng âm');
}

createWorld3D($('#world3d'), $('#world-labels')).then(x => {
  world = x;
  world.setStudents(students);
  world.setSkin(ufoSkin);
  world.setCharacterSkin(crewSkin.id);
  el.name.textContent = 'Bấm để gọi học sinh';
  el.status.textContent = 'UFO đang tuần tra. Kéo khung 3D để xoay góc nhìn.';
}).catch(() => {
  el.name.textContent = 'Không mở được thế giới 3D';
});
