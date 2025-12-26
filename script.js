const defaultTrack = {
  title: "Hafif Piyano",
  artist: "Pixabay",
  src: "https://cdn.pixabay.com/download/audio/2022/03/14/audio_5ba937f5a2.mp3?filename=calm-meditation-11157.mp3",
};

const programs = [
  {
    id: "shoulder-mobility",
    title: "Omuz Açıcı Seri",
    focus: "Omuz mobilitesi + dik duruş",
    duration: "12 dk",
    accent: "#7fc7ff",
    track: defaultTrack,
    exercises: [
      {
        id: "wall-angel",
        title: "Duvar melekleri",
        sets: 2,
        reps: 10,
        hold: "3 sn",
        cue: "Kollar duvarda yukarı-aşağı, kürekleri hissedin.",
        motion: "arm-raise",
      },
      {
        id: "stick-flexion",
        title: "Çubukla omuz fleksiyonu",
        sets: 3,
        reps: 8,
        hold: "4 sn",
        cue: "Kolları birlikte yukarı taşı, nefes vererek indir.",
        motion: "arm-arc",
      },
      {
        id: "scap-squeeze",
        title: "Kürek sıkıştırma",
        sets: 3,
        reps: 12,
        hold: "2 sn",
        cue: "Omuzları arkaya al, göğüs açık kalsın.",
        motion: "neck-tilt",
      },
    ],
  },
  {
    id: "lumbar-stability",
    title: "Bel Dengesi",
    focus: "Lomber stabilizasyon + nefes",
    duration: "10 dk",
    accent: "#6bd1b8",
    track: {
      title: "Huzurlu Doku",
      artist: "Pixabay",
      src: "https://cdn.pixabay.com/download/audio/2023/05/18/audio_5bccb6fa28.mp3?filename=soft-inspiring-piano-145038.mp3",
    },
    exercises: [
      {
        id: "pelvic-tilt",
        title: "Pelvik tilt",
        sets: 3,
        reps: 10,
        hold: "3 sn",
        cue: "Bel boşluğunu kapat, karın hafif aktif.",
        motion: "core-hold",
      },
      {
        id: "cat-cow",
        title: "Kedi-deve",
        sets: 2,
        reps: 12,
        hold: "2 sn",
        cue: "Nefesle aç-kapa, akış yavaş olsun.",
        motion: "leg-swing",
      },
      {
        id: "bridge",
        title: "Köprü",
        sets: 3,
        reps: 8,
        hold: "5 sn",
        cue: "Kalçayı kaldır, 5 sn bekle ve indir.",
        motion: "leg-swing",
      },
    ],
  },
];

const programGrid = document.getElementById("programGrid");
const programDetailView = document.getElementById("programDetailView");
const programsView = document.getElementById("programsView");
const playerView = document.getElementById("playerView");
const programTitle = document.getElementById("programTitle");
const programFocus = document.getElementById("programFocus");
const programDuration = document.getElementById("programDuration");
const exerciseList = document.getElementById("exerciseList");

const playerProgramName = document.getElementById("playerProgramName");
const playerExerciseName = document.getElementById("playerExerciseName");
const playerCue = document.getElementById("playerCue");
const playerTempo = document.getElementById("playerTempo");
const setsChip = document.getElementById("setsChip");
const repsChip = document.getElementById("repsChip");
const holdChip = document.getElementById("holdChip");
const setCount = document.getElementById("setCount");
const repCount = document.getElementById("repCount");
const demoFigure = document.getElementById("demoFigure");
const demoOverlay = document.getElementById("demoOverlay");
const timerDisplay = document.getElementById("timerDisplay");
const timerToggle = document.getElementById("timerToggle");
const timerReset = document.getElementById("timerReset");
const repIncrement = document.getElementById("repIncrement");
const setIncrement = document.getElementById("setIncrement");
const musicToggle = document.getElementById("musicToggle");
const musicLabel = document.getElementById("musicLabel");

let currentProgram = null;
let currentExercise = null;
let timerInterval = null;
let timerStart = 0;
let elapsed = 0;
let backgroundAudio = new Audio(defaultTrack.src);
backgroundAudio.loop = true;
backgroundAudio.volume = 0.45;
const progress = new Map();

function formatProgramCard(program) {
  const card = document.createElement("button");
  card.className = "card";
  card.innerHTML = `
    <div class="icon" style="background: linear-gradient(135deg, ${program.accent}33, ${program.accent}18); color: ${program.accent}">·</div>
    <div>
      <h3>${program.title}</h3>
      <div class="meta">
        <span>${program.focus}</span>
        <span>⏱ ${program.duration}</span>
        <span>${program.exercises.length} egzersiz</span>
      </div>
    </div>
  `;
  card.addEventListener("click", () => openProgram(program.id));
  return card;
}

function renderPrograms() {
  programGrid.innerHTML = "";
  programs.forEach((program) => programGrid.appendChild(formatProgramCard(program)));
}

function openProgram(programId) {
  currentProgram = programs.find((p) => p.id === programId);
  if (!currentProgram) return;
  programsView.classList.add("hidden");
  playerView.classList.add("hidden");
  programDetailView.classList.remove("hidden");
  programTitle.textContent = currentProgram.title;
  programFocus.textContent = currentProgram.focus;
  programDuration.textContent = currentProgram.duration;
  renderExerciseList();
}

function renderExerciseList() {
  exerciseList.innerHTML = "";
  currentProgram.exercises.forEach((exercise) => {
    const state = progress.get(exercise.id) || { set: 1, rep: 0 };
    const done = state.set > exercise.sets;

    const card = document.createElement("div");
    card.className = "exercise-card";
    card.innerHTML = `
      <div>
        <h4>${exercise.title}</h4>
        <p class="summary">${exercise.sets} set · ${exercise.reps} tekrar · ${exercise.hold}</p>
      </div>
      <div class="right">
        ${done ? '<span class="status">✓ Bitti</span>' : ""}
        <button aria-label="${exercise.title} başlat">Başlat</button>
      </div>
    `;
    card.querySelector("button").addEventListener("click", () => openExercise(exercise.id));
    exerciseList.appendChild(card);
  });
}

function openExercise(exerciseId) {
  if (!currentProgram) return;
  currentExercise = currentProgram.exercises.find((e) => e.id === exerciseId);
  if (!currentExercise) return;

  programDetailView.classList.add("hidden");
  programsView.classList.add("hidden");
  playerView.classList.remove("hidden");

  playerProgramName.textContent = currentProgram.title;
  playerExerciseName.textContent = currentExercise.title;
  playerCue.textContent = currentExercise.cue;
  playerTempo.textContent = `${currentExercise.hold} tempo`;
  setsChip.textContent = `${currentExercise.sets} set`;
  repsChip.textContent = `${currentExercise.reps} tekrar`;
  holdChip.textContent = `Her tekrarda ${currentExercise.hold}`;

  resetTimer();
  resetCountsIfNeeded();
  updateCounts();
  updateDemo(currentExercise.motion, currentProgram.accent);
  setMusic(currentProgram.track || defaultTrack);
}

function resetCountsIfNeeded() {
  const existing = progress.get(currentExercise.id);
  if (!existing) {
    progress.set(currentExercise.id, { set: 1, rep: 0 });
  }
}

function updateCounts() {
  const state = progress.get(currentExercise.id) || { set: 1, rep: 0 };
  const clampedSet = Math.min(state.set, currentExercise.sets);
  const clampedRep = Math.min(state.rep, currentExercise.reps);
  setCount.textContent = `${clampedSet}/${currentExercise.sets}`;
  repCount.textContent = `${clampedRep}/${currentExercise.reps}`;
  renderExerciseList();
}

function updateDemo(motion, accent) {
  demoFigure.dataset.motion = motion;
  demoFigure.style.boxShadow = `0 20px 60px ${accent}33`;
  demoOverlay.style.background = `radial-gradient(circle at 22% 24%, ${accent}33, transparent 40%), radial-gradient(circle at 80% 60%, ${accent}22, transparent 50%)`;
}

function toggleTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
    elapsed += Date.now() - timerStart;
    timerToggle.textContent = "Devam";
    return;
  }
  timerStart = Date.now();
  timerInterval = setInterval(updateTimerDisplay, 200);
  timerToggle.textContent = "Dur";
}

function resetTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
  elapsed = 0;
  timerToggle.textContent = "Başlat";
  timerDisplay.textContent = "00:00";
}

function updateTimerDisplay() {
  const total = elapsed + (timerInterval ? Date.now() - timerStart : 0);
  const seconds = Math.floor(total / 1000);
  const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
  const secs = String(seconds % 60).padStart(2, "0");
  timerDisplay.textContent = `${mins}:${secs}`;
}

function incrementRep() {
  if (!currentExercise) return;
  const state = progress.get(currentExercise.id) || { set: 1, rep: 0 };
  if (state.rep < currentExercise.reps) {
    state.rep += 1;
  }
  progress.set(currentExercise.id, state);
  updateCounts();
}

function incrementSet() {
  if (!currentExercise) return;
  const state = progress.get(currentExercise.id) || { set: 1, rep: 0 };
  if (state.set < currentExercise.sets) {
    state.set += 1;
    state.rep = 0;
  } else {
    state.set += 1; // mark completed beyond target
  }
  progress.set(currentExercise.id, state);
  updateCounts();
}

function goHome() {
  programDetailView.classList.add("hidden");
  playerView.classList.add("hidden");
  programsView.classList.remove("hidden");
  resetTimer();
  pauseMusic();
}

function backToProgram() {
  playerView.classList.add("hidden");
  programDetailView.classList.remove("hidden");
  resetTimer();
  pauseMusic();
}

function setMusic(track) {
  backgroundAudio.pause();
  backgroundAudio = new Audio(track.src);
  backgroundAudio.loop = true;
  backgroundAudio.volume = 0.45;
  musicLabel.textContent = `${track.title} · ${track.artist}`;
  backgroundAudio.play().catch(() => {});
  updateMusicButton();
}

function toggleMusic() {
  if (backgroundAudio.paused) {
    backgroundAudio.play();
  } else {
    pauseMusic();
  }
  updateMusicButton();
}

function pauseMusic() {
  backgroundAudio.pause();
}

function updateMusicButton() {
  musicToggle.textContent = backgroundAudio.paused ? "Müziği başlat" : "Müziği durdur";
}

function wireEvents() {
  document.querySelector("[data-action=back-home]").addEventListener("click", goHome);
  document.querySelector("[data-action=back-program]").addEventListener("click", backToProgram);
  timerToggle.addEventListener("click", toggleTimer);
  timerReset.addEventListener("click", resetTimer);
  repIncrement.addEventListener("click", incrementRep);
  setIncrement.addEventListener("click", incrementSet);
  musicToggle.addEventListener("click", toggleMusic);
}

renderPrograms();
wireEvents();
