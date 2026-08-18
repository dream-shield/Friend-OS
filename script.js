
/*
    FRIEND_OS
    =========

    GAME PURPOSE
    ------------
    This is a birthday puzzle game disguised as a retro operating system.

    The recipient is not expected to know anything about programming.
    The computer is simply the world in which the puzzles happen.

    ARCHITECTURE
    ------------
    1. Boot sequence creates the first impression.
    2. Desktop provides exploration.
    3. Verification Center runs the puzzle chain.
    4. Files/Terminal contain optional discoveries and hints.
    5. Completion unlocks BIRTHDAY.DAT.

    PUZZLE DEVELOPMENT
    ------------------
    Keep all birthday-specific puzzle content in the `puzzles` array.
    The rest of this file should stay as generic OS/game infrastructure.

    Planned puzzle types:
        - multiple-choice
        - riddle
        - observation
        - memory
        - sequence
        - image-selection
        - drag-and-drop
        - physical clue
        - timed challenge
*/

"use strict";

/* ===================================================================== */
/* GAME CONFIGURATION                                                     */
/* ===================================================================== */

const CONFIG = {
    friendName: "Kevin",
    senderName: "Ishan",

    // Change this to true once the real birthday content is ready.
    usePersonalizedFinalMessage: false,

    // Personal puzzle verification answers (Placeholders):
    personalMetYear: "Aug 2018",       // Year you met (e.g. "2015")
    personalFavGame: "Geometry Dash",      // Favorite game (e.g. "Geometry Dash")
    personalPhase: "brainrot"              // Worst phase (e.g. "brainrot")
};


/* ===================================================================== */
/* GAME STATE                                                             */
/* ===================================================================== */

const initialFiles = {
    "C:\\FRIEND_OS\\": [
        { name: "README.TXT", type: "text", content: "FRIEND_OS\n=========\n\nThis computer contains a series of verification tests.\n\nComplete the tests to gain access to restricted files.\n\nSome files may be useful. Some may not.\n\nGood luck.\n\n- SYSTEM ADMIN", hidden: false, locked: false },
        { name: "SYSTEM.LOG", type: "log", content: "", hidden: false, locked: false },
        { name: "VERIFY.EXE", type: "app", content: "", hidden: false, locked: false },
        { name: "BIRTHDAY.DAT", type: "restricted", content: "", hidden: false, locked: true },
        // Hidden files
        { name: "SECRET.TXT", type: "text", content: "BYPASS KEY: PASS_KEY_BOOT\n\nNote: If you are reading this, the Folder Options bypass was successful.", hidden: true, locked: true, password: "FRIEND_OS" },
        { name: "DIAGNOSTIC.LOG", type: "text", content: "SYSTEM DIAGNOSTIC REPORT\n========================\n\nRegistry scanning completed.\nError Code: REG_ERR_TRASH_77\n\nSecurity backup sector has moved the Test 3 bypass key to the Recycle Bin.\nFile name: DELETED_KEY.TXT\n\nPlease restore this file to your drive to view its contents.", hidden: true, locked: false }
    ],
    "RECYCLE_BIN:\\": [
        { name: "DELETED_KEY.TXT", type: "text", content: "TEST 3 UNLOCK KEY: TRASH_HAUL_99\n\nStatus: Recovered from Trash Bin.", hidden: false, locked: false }
    ]
};

const gameState = {
    bootComplete: false,
    warnedAboutCoyoteBowl: false,

    currentPuzzleIndex: 0,

    allPuzzlesCompleted: false,

    discoveredAnswers: [],

    nextWindowZ: 20,

    showHiddenFiles: false,

    inCaptchaMode: false,

    activeCaptchaIndex: 0,

    files: JSON.parse(JSON.stringify(initialFiles)),

    windowStates: {
        "welcome-window": { open: false, minimized: false },
        "verification-window": { open: false, minimized: false },
        "files-window": { open: false, minimized: false },
        "terminal-window": { open: false, minimized: false },
        "readme-window": { open: false, minimized: false },
        "logs-window": { open: false, minimized: false },
        "recycle-window": { open: false, minimized: false },
        "final-window": { open: false, minimized: false },
        "folder-options-dialog": { open: false, minimized: false },
        "password-dialog": { open: false, minimized: false }
    }
};


/* ===================================================================== */
/* PUZZLES                                                                */
/* ===================================================================== */

const puzzles = [
    {
        id: "geo-01",
        type: "geo",
        title: "Geo Scan",
        description: "A location has been detected. Inspect the scene and identify the building.",
        location: "Somewhere far far away",
        scene: "assets/images/school.png",
        clues: [
            "whachu lookin at",
            "figure it out urself",
            "fine one hint",
            "jk!!!!!!! XD"
        ],
        answers: [],
        correctAnswer: "school",
        successMessage: "Location confirmed.",
        hint: "STOP CHEATING JUST FIGURE IT OUT BRO!!!!!"
    },
    {
        id: "personal-01",
        type: "riddle",
        title: "Memory Lane",
        description: "Access requires historical association data.",
        question: "Verification Question:\nWhen did we first meet? (Answer: Month Year, e.g. Feb 2020)",
        correctAnswer: CONFIG.personalMetYear,
        successMessage: "Identity verified.",
        hint: "This is the EASIEST QUESTION POSSIBLE LOCK IN!!!!!"
    },
    {
        id: "registry-01",
        type: "riddle",
        title: "Registry Scan",
        description: "The system registry is corrupted. Use the Terminal to repair the system registry.",
        question: "Instructions:\n1. Open the Terminal.\n2. Run the command 'scan'.\n3. Locate the generated diagnostic log file in C:\\FRIEND_OS\\.\n\nInput the diagnostics error code:",
        correctAnswer: "REG_ERR_TRASH_77",
        successMessage: "Registry error resolved.",
        hint: "STOP USING THE HINTS!"
    },
    {
        id: "personal-02",
        type: "riddle",
        title: "Preference Check",
        description: "Verify shared preference records.",
        question: "Verification Question:\nWhat is your favorite game?",
        correctAnswer: CONFIG.personalFavGame,
        successMessage: "Record matched.",
        hint: "Fine I'll give u one"
    },
    {
        id: "recycle-01",
        type: "riddle",
        title: "The Salvaged Clue",
        description: "Test 5 requires the emergency backup key. Locate and restore the key from the Recycle Bin.",
        question: "Instructions:\n1. Open the Recycle Bin.\n2. Select and restore the deleted key file.\n3. Open it in My Files to read its content.\n\nInput the restored unlock key:",
        correctAnswer: "TRASH_HAUL_99",
        successMessage: "Backup key accepted.",
        hint: "IT IS IN THE RECYCLE BIN BRO CMON!!!!!"
    },
    {
        id: "personal-03",
        type: "riddle",
        title: "Shared Memory",
        description: "Validate personal memory sector.",
        question: "Verification Question:\nWhat was the worst phase you went through?",
        correctAnswer: CONFIG.personalPhase
        ,
        successMessage: "Shared memory valid.",
        hint: "Fine I'll give u another"
    },
    {
        id: "hidden-01",
        type: "riddle",
        title: "Folder Secrets",
        description: "Test 7 requires the decryption key from the hidden file SECRET.TXT.",
        question: "Instructions:\n1. Find and open SECRET.TXT.\n(Note: SECRET.TXT is hidden. You must enable 'Show hidden files' in Folder Options.)\n2. Open the file and decrypt it using the admin password.\n(Hint: Look for password notes in SYSTEM.LOG.)\n\nInput the bypass key found in SECRET.TXT:",
        correctAnswer: "PASS_KEY_BOOT",
        successMessage: "Decryption key accepted.",
        hint: "ITS HIDDEN BRO UNHIDE THE FILES IN WINDOWS OPTIONS!!!!!"
    },
    {
        id: "geo-02",
        type: "geo",
        title: "Geo Scan",
        description: "Inspect the scene and identify the exact spot.",
        location: "California Redwood Forests",
        scene: "assets/images/cyote.png",
        clues: [
            "Smells like pine",
            "Tastes like dirt",
            "Look at the circular clearing",
            "Where did we sleep?"
        ],
        answers: [],
        correctAnswer: "coyote bowl",
        successMessage: "Geographic profile accepted.",
        hint: ""
    },

    {
        id: "simon-01",
        type: "simon",
        title: "Frequency Sync",
        description: "Synchronize system frequencies. Repeat the sequence of tones.",
        instruction: "Repeat the sequence of light and sound pulses.",
        targetLength: 12,
        successMessage: "Frequency synchronization successful!",
        hint: "12 STAGES AND 3 LEVELS INSANE SPEED GLHF!!!!!"
    }
];

const captchas = [
    {
        id: "captcha-color-01",
        type: "color-captcha",
        title: "Human Check Required",
        description: "Intruder block: Human color perception check. Match target shade.",
        instruction: "Select the single tile that matches the target shade exactly.",
        successMessage: "Human color perception verified.",
        hint: "LOOK CLOSELY AT THE PREVIEW BOX AND CHOOSE THE ONE THAT HAS ZERO DIFFERENCE BRUH!!!"
    },
    {
        id: "captcha-text-01",
        type: "text-captcha",
        title: "Human Check Required",
        description: "Intruder warning: Typing pattern analysis failed. Enter the security code.",
        instruction: "Type the distorted characters displayed in the image below.",
        successMessage: "Human behavior verified.",
        hint: "TYPE THE DISTORTED LETTERS BRUH ARE YOU LITERALLY A ROBOT????"
    },
    {
        id: "captcha-escape-01",
        type: "escape-captcha",
        title: "Human Check Required",
        description: "System lock: Mouse positioning coordinates analysis failed. Complete interaction check.",
        instruction: "Check the checkbox below to verify your humanity.",
        successMessage: "Human behavior verified.",
        hint: "JUST CHECK THE CHECKBOX BRO LOOOL IT CANNOT RUN FOREVER!!!!!"
    }
];


/* ===================================================================== */
/* DOM REFERENCES                                                         */
/* ===================================================================== */

const bootScreen = document.getElementById("boot-screen");
const bootProgressFill = document.getElementById("boot-progress-fill");
const bootStatus = document.getElementById("boot-status");
const desktop = document.getElementById("desktop");

const puzzleTitle = document.getElementById("puzzle-title");
const puzzleDescription = document.getElementById("puzzle-description");
const puzzleArea = document.getElementById("puzzle-area");
const puzzleCounter = document.getElementById("test-counter");
const verificationStatus = document.getElementById("verification-status");
const verificationProgress = document.getElementById("verification-progress");
const verificationFooterStatus = document.getElementById("verification-footer-status");
const puzzleHint = document.getElementById("puzzle-hint");
const showHintBtn = document.getElementById("show-hint-btn");

const systemUser = document.getElementById("system-user");
const systemAccess = document.getElementById("system-access");
const systemTests = document.getElementById("system-tests");

const birthdayFile = document.getElementById("birthday-file");
const secretFile = document.getElementById("secret-file");
const fileCount = document.getElementById("file-count");

const terminalOutput = document.getElementById("terminal-output");
const terminalInput = document.getElementById("terminal-input");

const systemLog = document.getElementById("system-log");
const taskbarWindows = document.getElementById("taskbar-windows");
const taskbarClock = document.getElementById("taskbar-clock");

const startMenu = document.getElementById("start-menu");


/* ===================================================================== */
/* AUDIO FEEDBACK                                                         */
/* ===================================================================== */

/*
    Tiny synthesized UI sounds.

    We generate them rather than shipping copyrighted sound files.
    Browser support varies, so failure is intentionally ignored.
*/

let audioContext = null;

function getAudioContext() {
    if (!audioContext) {
        try {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch {
            return null;
        }
    }

    return audioContext;
}

function beep(frequency = 440, duration = 0.06, type = "square", volume = 0.025) {
    const context = getAudioContext();
    if (!context) {
        return;
    }

    const oscillator = context.createOscillator();
    const gain = context.createGain();

    oscillator.type = type;
    oscillator.frequency.value = frequency;

    gain.gain.value = volume;

    oscillator.connect(gain);
    gain.connect(context.destination);

    oscillator.start();
    gain.gain.exponentialRampToValueAtTime(
        0.0001,
        context.currentTime + duration
    );
    oscillator.stop(context.currentTime + duration);
}

let bgMusic = null;

function playSoundFile(filename, fallbackFn) {
    const audio = new Audio(`assets/audio/${filename}`);
    audio.volume = 0.5;
    let fallbackTriggered = false;
    const triggerFallback = () => {
        if (!fallbackTriggered) {
            fallbackTriggered = true;
            if (fallbackFn) fallbackFn();
        }
    };
    audio.onerror = () => {
        triggerFallback();
    };
    audio.play().catch((err) => {
        triggerFallback();
    });
}

function playBackgroundMusic() {
    if (bgMusic) return; // already playing
    bgMusic = new Audio("assets/audio/ambient.mp3");
    bgMusic.loop = true;
    bgMusic.volume = 0.5;
    bgMusic.play().catch(err => {
        console.log("Background music autoplay blocked. Waiting for first click...");
        const startOnInteraction = () => {
            if (bgMusic) {
                bgMusic.play().catch(() => {});
            }
            document.removeEventListener("click", startOnInteraction);
        };
        document.addEventListener("click", startOnInteraction);
    });
}

function playClick() {
    playSoundFile("click.mp3", () => {
        const context = getAudioContext();
        if (!context) return;
        const now = context.currentTime;
        
        // Windows 98/IE navigation click: super quick pitch sweep from 1800Hz to 80Hz
        const osc = context.createOscillator();
        const gainNode = context.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(1800, now);
        osc.frequency.exponentialRampToValueAtTime(80, now + 0.015);
        
        gainNode.gain.setValueAtTime(0.04, now);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.018);
        
        osc.connect(gainNode);
        gainNode.connect(context.destination);
        osc.start(now);
        osc.stop(now + 0.02);
    });
}

function playSuccess() {
    playSoundFile("success.mp3", () => {
        const context = getAudioContext();
        if (!context) return;
        const now = context.currentTime;
        
        // Bright Windows "ding.wav" double chime bell: high C6 (1046Hz) and E6 (1318Hz)
        const freqs = [1046.50, 1318.51];
        freqs.forEach((freq, idx) => {
            const osc = context.createOscillator();
            const gainNode = context.createGain();
            osc.type = "sine";
            osc.frequency.setValueAtTime(freq, now + idx * 0.06);
            
            const startTime = now + idx * 0.06;
            gainNode.gain.setValueAtTime(0, now);
            gainNode.gain.setValueAtTime(0.03, startTime);
            gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + 1.2);
            
            osc.connect(gainNode);
            gainNode.connect(context.destination);
            osc.start(now);
            osc.stop(now + 1.5);
        });
    });
}

function playError() {
    playSoundFile("error.mp3", () => {
        const context = getAudioContext();
        if (!context) return;
        const now = context.currentTime;
        
        // Windows 95/98 "Critical Stop" chord: Eb3 (155Hz), F3 (174Hz), Gb3 (185Hz)
        const frequencies = [155.56, 174.61, 185.00];
        frequencies.forEach(freq => {
            const osc = context.createOscillator();
            const gainNode = context.createGain();
            osc.type = "sawtooth";
            osc.frequency.setValueAtTime(freq, now);
            
            gainNode.gain.setValueAtTime(0.12, now);
            gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.65);
            
            osc.connect(gainNode);
            gainNode.connect(context.destination);
            osc.start(now);
            osc.stop(now + 0.7);
        });
    });
}

function playStartupChime() {
    playSoundFile("startup.mp3", () => {
        const context = getAudioContext();
        if (!context) return;
        const now = context.currentTime;
        
        // Brian Eno's majestic Windows 95 startup sound pad (warm low triangle waves)
        const padFrequencies = [87.31, 130.81, 174.61, 261.63]; // F2, C3, F3, C4
        padFrequencies.forEach((freq, idx) => {
            const osc = context.createOscillator();
            const gainNode = context.createGain();
            osc.type = "triangle";
            osc.frequency.setValueAtTime(freq, now);
            
            gainNode.gain.setValueAtTime(0, now);
            gainNode.gain.linearRampToValueAtTime(0.012, now + 1.2);
            gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 4.5);
            
            osc.connect(gainNode);
            gainNode.connect(context.destination);
            osc.start(now);
            osc.stop(now + 4.5);
        });
        
        // Shimmering high chimes arpeggio (A4, C5, F5, G5, C6)
        const chimeNotes = [440.00, 523.25, 698.46, 783.99, 1046.50];
        chimeNotes.forEach((freq, idx) => {
            const osc = context.createOscillator();
            const gainNode = context.createGain();
            osc.type = "sine";
            osc.frequency.setValueAtTime(freq, now);
            
            const startTime = now + 0.8 + idx * 0.15;
            gainNode.gain.setValueAtTime(0, now);
            gainNode.gain.setValueAtTime(0, startTime);
            gainNode.gain.linearRampToValueAtTime(0.018, startTime + 0.05);
            gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + 2.8);
            
            osc.connect(gainNode);
            gainNode.connect(context.destination);
            osc.start(now);
            osc.stop(now + 3.5);
        });
    });
}


/* ===================================================================== */
/* BOOT SEQUENCE                                                          */
/* ===================================================================== */

function startBootSequence() {
    let progress = 0;

    const bootMessages = [
        "Checking memory...",
        "Initializing display driver...",
        "Loading identity services...",
        "Mounting local disk...",
        "Loading verification module...",
        "Checking restricted files...",
        "Starting desktop..."
    ];

    const bootTimer = setInterval(() => {

        progress += Math.floor(Math.random() * 13) + 8;

        if (progress > 100) {
            progress = 100;
        }

        bootProgressFill.style.width = `${progress}%`;

        const index = Math.min(
            Math.floor(progress / 15),
            bootMessages.length - 1
        );

        bootStatus.textContent = bootMessages[index];

        if (progress >= 100) {
            clearInterval(bootTimer);

            setTimeout(() => {
                bootScreen.classList.add("hidden");
                desktop.classList.remove("hidden");
                gameState.bootComplete = true;

                initializeDesktop();
            }, 450);
        }

    }, 170);
}


/* ===================================================================== */
/* WINDOW MANAGEMENT                                                      */
/* ===================================================================== */

function openWindow(windowId, { playSound = true } = {}) {
    const windowElement = document.getElementById(windowId);

    if (!windowElement) {
        return;
    }

    if (!gameState.windowStates[windowId]) {
        gameState.windowStates[windowId] = { open: false, minimized: false };
    }

    gameState.windowStates[windowId].open = true;
    gameState.windowStates[windowId].minimized = false;

    windowElement.style.display = "block";
    windowElement.style.zIndex = ++gameState.nextWindowZ;

    windowElement.classList.add("active");

    if (playSound) {
        playClick();
    }

    updateTaskbar();
}

function closeWindow(windowId, { playSound = true } = {}) {
    const windowElement = document.getElementById(windowId);

    if (!windowElement) {
        return;
    }

    if (!gameState.windowStates[windowId]) {
        gameState.windowStates[windowId] = { open: false, minimized: false };
    }

    gameState.windowStates[windowId].open = false;
    gameState.windowStates[windowId].minimized = false;

    windowElement.style.display = "none";
    windowElement.classList.remove("active");

    if (playSound) {
        playClick();
    }

    updateTaskbar();
}

function minimizeWindow(windowId, { playSound = true } = {}) {
    const windowElement = document.getElementById(windowId);

    if (!windowElement) {
        return;
    }

    if (!gameState.windowStates[windowId]) {
        gameState.windowStates[windowId] = { open: false, minimized: false };
    }

    gameState.windowStates[windowId].minimized = true;

    windowElement.style.display = "none";
    windowElement.classList.remove("active");

    if (playSound) {
        playClick();
    }

    updateTaskbar();
}

function focusWindow(windowId) {
    const windowElement = document.getElementById(windowId);

    if (!windowElement) {
        return;
    }

    windowElement.style.zIndex = ++gameState.nextWindowZ;

    document.querySelectorAll(".window").forEach(window => {
        window.classList.remove("active");
    });

    windowElement.classList.add("active");
}


/* ===================================================================== */
/* TASKBAR                                                                */
/* ===================================================================== */

function updateTaskbar() {
    taskbarWindows.innerHTML = "";

    Object.keys(gameState.windowStates).forEach(windowId => {
        const state = gameState.windowStates[windowId];
        if (!state.open) {
            return;
        }

        if (windowId === "final-window" || windowId === "password-dialog" || windowId === "folder-options-dialog") {
            return;
        }

        const windowElement = document.getElementById(windowId);
        if (!windowElement) return;

        const button = document.createElement("button");
        button.className = "retro-button taskbar-window";

        if (state.minimized) {
            button.style.opacity = "0.6";
        } else if (windowElement.classList.contains("active")) {
            button.style.fontWeight = "bold";
            button.style.borderTopColor = "#000";
            button.style.borderLeftColor = "#000";
            button.style.borderRightColor = "#fff";
            button.style.borderBottomColor = "#fff";
        }

        const title = windowElement.querySelector(".window-title");
        button.textContent = title ? title.textContent.trim() : "Window";

        button.addEventListener("click", () => {
            if (state.minimized) {
                openWindow(windowId, { playSound: false });
                focusWindow(windowId);
            } else if (windowElement.classList.contains("active")) {
                minimizeWindow(windowId);
            } else {
                focusWindow(windowId);
                updateTaskbar();
            }
        });

        taskbarWindows.appendChild(button);
    });
}

function makeWindowsDraggable() {
    document.querySelectorAll(".window").forEach(windowElement => {
        const titlebar = windowElement.querySelector(".window-titlebar");
        if (!titlebar) return;

        let isDragging = false;
        let startX, startY;
        let initialX, initialY;

        titlebar.addEventListener("mousedown", dragStart);
        titlebar.addEventListener("touchstart", dragStart, { passive: false });

        function dragStart(e) {
            focusWindow(windowElement.id);

            if (e.target.closest(".window-control")) {
                return;
            }

            isDragging = true;

            const clientX = e.type === "touchstart" ? e.touches[0].clientX : e.clientX;
            const clientY = e.type === "touchstart" ? e.touches[0].clientY : e.clientY;

            const rect = windowElement.getBoundingClientRect();
            const style = window.getComputedStyle(windowElement);
            if (style.transform && style.transform !== "none") {
                windowElement.style.transform = "none";
                windowElement.style.left = `${rect.left}px`;
                windowElement.style.top = `${rect.top}px`;
            }

            initialX = parseFloat(windowElement.style.left) || rect.left;
            initialY = parseFloat(windowElement.style.top) || rect.top;

            startX = clientX;
            startY = clientY;

            document.addEventListener("mousemove", dragMove);
            document.addEventListener("mouseup", dragEnd);
            document.addEventListener("touchmove", dragMove, { passive: false });
            document.addEventListener("touchend", dragEnd);

            e.preventDefault();
        }

        function dragMove(e) {
            if (!isDragging) return;

            const clientX = e.type === "touchmove" ? e.touches[0].clientX : e.clientX;
            const clientY = e.type === "touchmove" ? e.touches[0].clientY : e.clientY;

            const dx = clientX - startX;
            const dy = clientY - startY;

            let newLeft = initialX + dx;
            let newTop = initialY + dy;

            const crt = document.getElementById("crt");
            const crtRect = crt.getBoundingClientRect();
            const winRect = windowElement.getBoundingClientRect();

            newLeft = Math.max(-winRect.width + 50, Math.min(crtRect.width - 50, newLeft));
            newTop = Math.max(0, Math.min(crtRect.height - 30, newTop));

            windowElement.style.left = `${newLeft}px`;
            windowElement.style.top = `${newTop}px`;

            e.preventDefault();
        }

        function dragEnd() {
            isDragging = false;
            document.removeEventListener("mousemove", dragMove);
            document.removeEventListener("mouseup", dragEnd);
            document.removeEventListener("touchmove", dragMove);
            document.removeEventListener("touchend", dragEnd);
        }
    });
}


/* ===================================================================== */
/* DESKTOP INITIALIZATION                                                 */
/* ===================================================================== */

function initializeDesktop({ playChime = true } = {}) {
    systemUser.textContent = "UNKNOWN";
    systemAccess.textContent = gameState.allPuzzlesCompleted ? "VERIFIED" : "RESTRICTED";
    updateSystemTestCounter();
    makeWindowsDraggable();

    if (playChime) {
        try {
            playStartupChime();
        } catch (e) {
            console.error("Startup sound blocked or failed", e);
        }
    }

    writeTerminal(
        "FriendOS Terminal [build 0.1.7]\n" +
        "Copyright (c) FriendOS Systems\n\n" +
        'Type "help" for available commands.\n'
    );

    systemLog.textContent =
        "[00:00:01] BOOT       FriendOS kernel initialized\n" +
        "[00:00:01] MEMORY     640K OK\n" +
        "[00:00:02] DISPLAY    320x200 compatibility mode\n" +
        "[00:00:02] FILESYS    Local disk mounted\n" +
        "[00:00:02] SECURITY   Restricted mode enabled\n" +
        "[00:00:03] VERIFY     Verification module loaded\n" +
        "[00:00:03] BIRTHDAY   BIRTHDAY.DAT locked\n" +
        "[00:00:15] SYS_WARN   User 'ADMIN' set folder password to the brand name of the computer (look at the boot screen or the computer chassis)\n";

    openWindow("welcome-window", { playSound: false });

    // Render original files
    renderFileList();
    renderRecycleBin();

    setTimeout(() => {
        focusWindow("welcome-window");
    }, 50);
}


/* ===================================================================== */
/* DESKTOP ICONS                                                           */
/* ===================================================================== */

document.querySelectorAll(".desktop-icon").forEach(icon => {

    icon.addEventListener("dblclick", () => {
        openWindow(icon.dataset.openWindow);
    });

});


/* ===================================================================== */
/* START MENU                                                              */
/* ===================================================================== */

document.getElementById("start-button").addEventListener("click", () => {
    startMenu.classList.toggle("open");
    playClick();
});

showHintBtn.addEventListener("click", () => {
    playClick();
    if (gameState.inCaptchaMode) {
        const captcha = captchas[gameState.activeCaptchaIndex];
        if (captcha && captcha.hint) {
            puzzleHint.hidden = !puzzleHint.hidden;
            puzzleHint.textContent = puzzleHint.hidden ? "" : captcha.hint;
        }
        return;
    }

    const puzzle = puzzles[gameState.currentPuzzleIndex];
    if (puzzle && puzzle.hint) {
        puzzleHint.hidden = !puzzleHint.hidden;
        puzzleHint.textContent = puzzleHint.hidden ? "" : puzzle.hint;

        // If showing the hint for the favorite game puzzle, play the fire-in-the-hole sound!
        if (!puzzleHint.hidden && puzzle.id === "personal-02") {
            playSoundFile("Fire-in-the-hole-geometry-dash.mp3.mpeg", () => {
                try {
                    const ctx = new (window.AudioContext || window.webkitAudioContext)();
                    
                    // Deep explosion boom
                    const oscBoom = ctx.createOscillator();
                    const gainBoom = ctx.createGain();
                    oscBoom.type = "sawtooth";
                    oscBoom.frequency.setValueAtTime(320, ctx.currentTime);
                    oscBoom.frequency.exponentialRampToValueAtTime(35, ctx.currentTime + 0.65);
                    
                    gainBoom.gain.setValueAtTime(0.35, ctx.currentTime);
                    gainBoom.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.65);
                    
                    oscBoom.connect(gainBoom);
                    gainBoom.connect(ctx.destination);
                    
                    // Slang vocal slide pitch ("Fire in the hole")
                    const oscVoice = ctx.createOscillator();
                    const gainVoice = ctx.createGain();
                    oscVoice.type = "triangle";
                    oscVoice.frequency.setValueAtTime(550, ctx.currentTime);
                    oscVoice.frequency.linearRampToValueAtTime(750, ctx.currentTime + 0.15);
                    oscVoice.frequency.linearRampToValueAtTime(450, ctx.currentTime + 0.3);
                    oscVoice.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.55);
                    
                    gainVoice.gain.setValueAtTime(0.2, ctx.currentTime);
                    gainVoice.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.55);
                    
                    oscVoice.connect(gainVoice);
                    gainVoice.connect(ctx.destination);
                    
                    oscBoom.start();
                    oscBoom.stop(ctx.currentTime + 0.65);
                    oscVoice.start();
                    oscVoice.stop(ctx.currentTime + 0.55);
                } catch (e) {
                    console.error("Audio error: ", e);
                }
            });
        }

        // If showing the hint for the worst phase puzzle, play the 67.mp3 sound!
        if (!puzzleHint.hidden && puzzle.id === "personal-03") {
            playSoundFile("67.mp3", () => {
                try {
                    const ctx = new (window.AudioContext || window.webkitAudioContext)();
                    
                    // Cool retro synthesized slide
                    const osc = ctx.createOscillator();
                    const gainNode = ctx.createGain();
                    osc.type = "sawtooth";
                    osc.frequency.setValueAtTime(100, ctx.currentTime);
                    osc.frequency.linearRampToValueAtTime(1000, ctx.currentTime + 0.5);
                    
                    gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.5);
                    
                    osc.connect(gainNode);
                    gainNode.connect(ctx.destination);
                    osc.start();
                    osc.stop(ctx.currentTime + 0.5);
                } catch (e) {
                    console.error("Audio error: ", e);
                }
            });
        }
    }
});

document.querySelectorAll("#start-menu [data-open-window]").forEach(button => {
    button.addEventListener("click", () => {
        startMenu.classList.remove("open");
        openWindow(button.dataset.openWindow);
    });
});

document.getElementById("shutdown-button").addEventListener("click", () => {
    startMenu.classList.remove("open");
    playClick();

    if (confirm("Shut down FriendOS?")) {
        resetGameState();
    }
});


/* ===================================================================== */
/* WINDOW BUTTONS                                                          */
/* ===================================================================== */

document.querySelectorAll("[data-close-window]").forEach(button => {
    button.addEventListener("click", () => {
        closeWindow(button.dataset.closeWindow);
    });
});

document.querySelectorAll(".window").forEach(windowElement => {

    windowElement.addEventListener("mousedown", () => {
        focusWindow(windowElement.id);
        updateTaskbar();
    });
    windowElement.addEventListener("touchstart", () => {
        focusWindow(windowElement.id);
        updateTaskbar();
    });

    const minimize = windowElement.querySelector(".minimize-control");

    if (minimize) {
        minimize.addEventListener("click", (e) => {
            e.stopPropagation();
            minimizeWindow(windowElement.id);
        });
    }

});


/* ===================================================================== */
/* WELCOME FLOW                                                           */
/* ===================================================================== */

document
    .getElementById("start-verification-button")
    .addEventListener("click", () => {
        playBackgroundMusic();

        openWindow("verification-window");
        closeWindow("welcome-window");

        renderCurrentPuzzle();
    });


/* ===================================================================== */
/* PUZZLE HELPERS                                                         */
/* ===================================================================== */

/*
    The Geo Scan scenes are intentionally original, low-resolution SVG
    illustrations. They communicate useful geographic clues without
    depending on a real Street View API or copyrighted screenshots.

    Later we can replace individual scenes with your own photographs,
    screenshots, or more elaborate artwork.
*/
function geoSceneSvg(sceneId) {

    if (sceneId === "japan-suburb") {
        return `
        <svg class="geo-scene" viewBox="0 0 800 360" xmlns="http://www.w3.org/2000/svg">
            <rect width="800" height="220" fill="#8eb3c4"/>
            <rect y="220" width="800" height="140" fill="#6d805b"/>
            <path d="M0 222 L120 150 L210 206 L330 128 L450 210 L600 125 L800 215 L800 260 L0 260Z" fill="#4f6154"/>
            <rect y="272" width="800" height="88" fill="#5c5c5c"/>
            <path d="M400 272 L800 272 L800 360 L460 360Z" fill="#666"/>
            <path d="M150 300 L800 300" stroke="#eee" stroke-width="9" stroke-dasharray="42 22"/>
            <path d="M215 0 L215 272" stroke="#1f1f1f" stroke-width="7"/>
            <path d="M215 82 L365 82" stroke="#1f1f1f" stroke-width="6"/>
            <path d="M365 30 L365 272" stroke="#1f1f1f" stroke-width="5"/>
            <rect x="100" y="189" width="85" height="66" fill="#c7c1b5" stroke="#343434" stroke-width="3"/>
            <path d="M92 190 L142 155 L195 190" fill="#7f3c34" stroke="#343434" stroke-width="3"/>
            <rect x="114" y="212" width="18" height="43" fill="#514b43"/>
            <rect x="151" y="210" width="20" height="17" fill="#6e9ba9"/>
            <path d="M687 167 C710 146 720 146 742 168" fill="none" stroke="#f2f2f2" stroke-width="4"/>
            <path d="M720 130 L720 256" stroke="#fff" stroke-width="3"/>
            <path d="M720 131 L720 256" stroke="#e74a44" stroke-width="2" stroke-dasharray="14 9"/>
            <circle cx="720" cy="131" r="6" fill="#252525"/>
            <text x="18" y="31" font-family="monospace" font-size="18" fill="#fff">GEO CAMERA // 01</text>
        </svg>`;
    }

    if (sceneId === "iceland-road") {
        return `
        <svg class="geo-scene" viewBox="0 0 800 360" xmlns="http://www.w3.org/2000/svg">
            <rect width="800" height="190" fill="#9db4c0"/>
            <rect y="190" width="800" height="170" fill="#5a6b5b"/>
            <path d="M0 205 L120 140 L220 185 L350 110 L470 190 L590 135 L800 195 L800 240 L0 240Z" fill="#667573"/>
            <path d="M250 360 Q390 260 525 210 Q615 175 800 178 L800 360Z" fill="#4f4f4f"/>
            <path d="M250 360 Q390 260 525 210" stroke="#f5f5f5" stroke-width="7" fill="none"/>
            <path d="M525 210 Q650 172 800 178" stroke="#f5f5f5" stroke-width="7" fill="none"/>
            <path d="M205 215 L205 305" stroke="#f0f0f0" stroke-width="7"/>
            <path d="M205 220 L205 302" stroke="#f0d01c" stroke-width="4"/>
            <rect x="198" y="207" width="15" height="7" fill="#d9d9d9"/>
            <path d="M0 230 C130 220 215 220 320 238" stroke="#7d9578" stroke-width="18" fill="none"/>
            <path d="M620 202 Q670 180 720 206" stroke="#e0ddd2" stroke-width="5" fill="none"/>
            <path d="M695 189 L695 252" stroke="#f0f0f0" stroke-width="4"/>
            <text x="18" y="31" font-family="monospace" font-size="18" fill="#fff">GEO CAMERA // 02</text>
        </svg>`;
    }

    return `
        <svg class="geo-scene" viewBox="0 0 800 360" xmlns="http://www.w3.org/2000/svg">
            <rect width="800" height="360" fill="#999"/>
        </svg>`;
}

function captchaTileSvg(type, index) {

    /*
        Each CAPTCHA tile is a tiny deterministic illustration.
        They are intentionally simple so the player can recognize the
        target object quickly.
    */

    const backgrounds = [
        "#8bb0c3", "#b8c79b", "#c9b797", "#7f9fb0",
        "#b6b4a0", "#90a8b3", "#a8bc95", "#c7bba0", "#91a9bc"
    ];

    const bg = backgrounds[index % backgrounds.length];

    let drawing = `<rect width="120" height="80" fill="${bg}"/>`;

    if (type === "floppy") {
        drawing += `
            <!-- Disk body -->
            <rect x="36" y="18" width="48" height="48" rx="2" fill="#2d2d2d" stroke="#111" stroke-width="2"/>
            <!-- Top right write-protect hole notch / bevel -->
            <polygon points="76,18 84,26 84,66 36,66 36,18" fill="#2d2d2d" stroke="#111" stroke-width="2"/>
            <!-- Metal shutter slider at bottom -->
            <rect x="42" y="44" width="22" height="22" fill="#bcbcbc" stroke="#111" stroke-width="1.5"/>
            <rect x="47" y="47" width="5" height="15" fill="#333"/>
            <!-- Label -->
            <rect x="42" y="22" width="36" height="20" fill="#fff" stroke="#111" stroke-width="1.5"/>
            <!-- Red label bar -->
            <rect x="42" y="22" width="36" height="5" fill="#df3c3c"/>
        `;
    } else if (type === "cake") {
        drawing += `
            <!-- Cake body -->
            <rect x="35" y="42" width="50" height="24" fill="#a06040" rx="3" stroke="#222" stroke-width="2"/>
            <!-- White frosting icing top -->
            <rect x="33" y="38" width="54" height="6" rx="2" fill="#ffeff8" stroke="#222" stroke-width="1.5"/>
            <!-- Drips of frosting -->
            <circle cx="39" cy="46" r="3" fill="#ffeff8"/>
            <circle cx="50" cy="47" r="4" fill="#ffeff8"/>
            <circle cx="62" cy="46" r="3" fill="#ffeff8"/>
            <circle cx="74" cy="47" r="4" fill="#ffeff8"/>
            <circle cx="81" cy="45" r="3" fill="#ffeff8"/>
            <!-- Candle 1 -->
            <rect x="46" y="22" width="4" height="16" fill="#4fa8ff" stroke="#222" stroke-width="1"/>
            <path d="M48 14 C48 14, 50 18, 48 22 C46 18, 48 14, 48 14 Z" fill="#ffaa00"/>
            <!-- Candle 2 -->
            <rect x="68" y="22" width="4" height="16" fill="#ff5376" stroke="#222" stroke-width="1"/>
            <path d="M70 14 C70 14, 72 18, 70 22 C68 18, 70 14, 70 14 Z" fill="#ffaa00"/>
        `;
    } else if (type === "virus") {
        drawing += `
            <!-- Legs -->
            <line x1="36" y1="28" x2="26" y2="24" stroke="#2cda35" stroke-width="3" stroke-linecap="round"/>
            <line x1="36" y1="40" x2="24" y2="40" stroke="#2cda35" stroke-width="3" stroke-linecap="round"/>
            <line x1="36" y1="52" x2="26" y2="56" stroke="#2cda35" stroke-width="3" stroke-linecap="round"/>
            
            <line x1="84" y1="28" x2="94" y2="24" stroke="#2cda35" stroke-width="3" stroke-linecap="round"/>
            <line x1="84" y1="40" x2="96" y2="40" stroke="#2cda35" stroke-width="3" stroke-linecap="round"/>
            <line x1="84" y1="52" x2="94" y2="56" stroke="#2cda35" stroke-width="3" stroke-linecap="round"/>
            
            <!-- Antennae -->
            <line x1="50" y1="26" x2="42" y2="14" stroke="#2cda35" stroke-width="2.5"/>
            <line x1="70" y1="26" x2="78" y2="14" stroke="#2cda35" stroke-width="2.5"/>
            <circle cx="42" cy="14" r="2.5" fill="#2cda35"/>
            <circle cx="78" cy="14" r="2.5" fill="#2cda35"/>
            
            <!-- Bug body -->
            <rect x="36" y="24" width="48" height="32" rx="10" fill="#2cda35" stroke="#1b9621" stroke-width="2"/>
            
            <!-- Eyes (glowing red pixels) -->
            <rect x="46" y="32" width="6" height="4" fill="#ff0000"/>
            <rect x="68" y="32" width="6" height="4" fill="#ff0000"/>
        `;
    } else if (type === "house") {
        drawing += `
            <rect x="37" y="38" width="48" height="30" fill="#c7b89b" stroke="#333" stroke-width="2"/>
            <path d="M32 39 L61 17 L90 39" fill="#8c4b3b" stroke="#333" stroke-width="2"/>
            <rect x="56" y="51" width="10" height="17" fill="#5a463d"/>
            <rect x="43" y="47" width="10" height="9" fill="#8eb7c0"/>
        `;
    } else if (type === "tree") {
        drawing += `
            <rect x="58" y="43" width="9" height="28" fill="#5b4734"/>
            <circle cx="62" cy="34" r="23" fill="#4d7b42"/>
            <circle cx="44" cy="42" r="15" fill="#5c8d4b"/>
            <circle cx="80" cy="41" r="16" fill="#416e39"/>
        `;
    } else if (type === "car") {
        drawing += `
            <rect x="32" y="42" width="58" height="20" rx="3" fill="#b44e49" stroke="#333" stroke-width="2"/>
            <path d="M47 42 L55 29 L75 29 L84 42" fill="#7a959d" stroke="#333" stroke-width="2"/>
            <circle cx="47" cy="64" r="7" fill="#222"/>
            <circle cx="76" cy="64" r="7" fill="#222"/>
        `;
    } else if (type === "human") {
        drawing += `
            <!-- Head -->
            <circle cx="60" cy="32" r="14" fill="#ffd1b3" stroke="#222" stroke-width="1.5"/>
            <!-- Hair -->
            <path d="M46 32 C46 16, 74 16, 74 32 C74 20, 46 20, 46 32 Z" fill="#2d2d2d" stroke="#222" stroke-width="1"/>
            <!-- Body -->
            <path d="M35 68 C35 50, 85 50, 85 68 Z" fill="#3b72b4" stroke="#222" stroke-width="1.5"/>
        `;
    } else if (type === "alien") {
        drawing += `
            <!-- Head -->
            <path d="M46 25 Q60 12 74 25 Q76 46 60 52 Q44 46 46 25 Z" fill="#32cd32" stroke="#1b821b" stroke-width="1.5"/>
            <!-- Eyes -->
            <ellipse cx="52" cy="28" rx="6" ry="10" transform="rotate(-15 52 28)" fill="#000"/>
            <circle cx="53" cy="25" r="1.5" fill="#fff"/>
            <ellipse cx="68" cy="28" rx="6" ry="10" transform="rotate(15 68 28)" fill="#000"/>
            <circle cx="67" cy="25" r="1.5" fill="#fff"/>
            <!-- Body -->
            <path d="M42 68 C42 56, 78 56, 78 68 Z" fill="#7a7a7a" stroke="#444" stroke-width="1.5"/>
        `;
    } else if (type === "robot") {
        drawing += `
            <!-- Antenna -->
            <line x1="60" y1="20" x2="60" y2="8" stroke="#777" stroke-width="2"/>
            <circle cx="60" cy="8" r="3" fill="#ff4d4d"/>
            <!-- Head -->
            <rect x="42" y="20" width="36" height="28" rx="2" fill="#a6a6a6" stroke="#333" stroke-width="2"/>
            <!-- Eyes -->
            <circle cx="51" cy="30" r="4" fill="#ffff33" stroke="#222" stroke-width="1"/>
            <circle cx="69" cy="30" r="4" fill="#ffff33" stroke="#222" stroke-width="1"/>
            <!-- Mouth -->
            <rect x="50" y="40" width="20" height="3" fill="#222"/>
            <!-- Body -->
            <rect x="34" y="58" width="52" height="15" fill="#808080" stroke="#333" stroke-width="2"/>
        `;
    } else if (type === "dog") {
        drawing += `
            <!-- Ears -->
            <ellipse cx="44" cy="30" rx="6" ry="16" transform="rotate(10 44 30)" fill="#7c532b" stroke="#333" stroke-width="1.5"/>
            <ellipse cx="76" cy="30" rx="6" ry="16" transform="rotate(-10 76 30)" fill="#7c532b" stroke="#333" stroke-width="1.5"/>
            <!-- Face -->
            <rect x="46" y="24" width="28" height="28" rx="6" fill="#a06e3b" stroke="#333" stroke-width="1.5"/>
            <!-- Snout -->
            <rect x="52" y="40" width="16" height="12" rx="3" fill="#dfbe9f" stroke="#333" stroke-width="1"/>
            <circle cx="60" cy="42" r="3.5" fill="#000"/>
            <!-- Eyes -->
            <circle cx="53" cy="32" r="2.5" fill="#000"/>
            <circle cx="67" cy="32" r="2.5" fill="#000"/>
        `;
    } else if (type === "skinwalker") {
        drawing += `
            <!-- Creepy Horns -->
            <path d="M48 20 Q40 5 38 12 Q44 14 48 22 Z" fill="#4a3c31" stroke="#222" stroke-width="1"/>
            <path d="M72 20 Q80 -2 84 8 Q76 12 72 22 Z" fill="#4a3c31" stroke="#222" stroke-width="1"/>
            <!-- Face -->
            <rect x="46" y="24" width="28" height="28" rx="3" fill="#615f5d" stroke="#222" stroke-width="1.5"/>
            <!-- Snout -->
            <rect x="53" y="38" width="14" height="15" fill="#484848" stroke="#222" stroke-width="1"/>
            <polygon points="56,48 60,44 64,48" fill="#ff0000"/>
            <!-- Glowing slit eyes -->
            <ellipse cx="52" cy="32" rx="3.5" ry="1.5" fill="#ff3333"/>
            <ellipse cx="68" cy="32" rx="3.5" ry="1.5" fill="#ff3333"/>
            <!-- Creepy smile -->
            <path d="M50 46 Q60 52 70 46" stroke="#ff0000" stroke-width="1.5" fill="none"/>
        `;
    } else if (type === "cat") {
        drawing += `
            <!-- Ears -->
            <polygon points="42,26 44,10 54,22" fill="#d97d30" stroke="#333" stroke-width="1.5"/>
            <polygon points="78,26 76,10 66,22" fill="#d97d30" stroke="#333" stroke-width="1.5"/>
            <!-- Head -->
            <circle cx="60" cy="34" r="16" fill="#f29f52" stroke="#333" stroke-width="1.5"/>
            <!-- Eyes -->
            <ellipse cx="53" cy="32" rx="3" ry="4" fill="#66ff66" stroke="#222" stroke-width="1"/>
            <line x1="53" y1="29" x2="53" y2="35" stroke="#000" stroke-width="1"/>
            <ellipse cx="67" cy="32" rx="3" ry="4" fill="#66ff66" stroke="#222" stroke-width="1"/>
            <line x1="67" y1="29" x2="67" y2="35" stroke="#000" stroke-width="1"/>
            <!-- Nose/Mouth -->
            <polygon points="58,38 60,40 62,38" fill="#ff9999"/>
            <path d="M56 42 Q60 45 64 42" stroke="#333" stroke-width="1" fill="none"/>
            <!-- Whiskers -->
            <line x1="38" y1="36" x2="48" y2="38" stroke="#333" stroke-width="1"/>
            <line x1="38" y1="42" x2="48" y2="40" stroke="#333" stroke-width="1"/>
            <line x1="82" y1="36" x2="72" y2="38" stroke="#333" stroke-width="1"/>
            <line x1="82" y1="42" x2="72" y2="40" stroke="#333" stroke-width="1"/>
        `;
    } else if (type === "citizen") {
        drawing += `
            <!-- Head -->
            <circle cx="60" cy="32" r="14" fill="#ffe0cc" stroke="#222" stroke-width="1.5"/>
            <!-- Hair -->
            <path d="M46 32 C46 16, 74 16, 74 32 C74 20, 46 20, 46 32 Z" fill="#8c583c" stroke="#222" stroke-width="1"/>
            <!-- Body -->
            <path d="M35 68 C35 50, 85 50, 85 68 Z" fill="#4daf51" stroke="#222" stroke-width="1.5"/>
        `;
    } else if (type === "evader") {
        drawing += `
            <!-- Shady Head -->
            <circle cx="60" cy="32" r="14" fill="#ffd1b3" stroke="#222" stroke-width="1.5"/>
            <!-- Sunglasses -->
            <rect x="48" y="27" width="11" height="6" fill="#000" rx="1"/>
            <rect x="61" y="27" width="11" height="6" fill="#000" rx="1"/>
            <line x1="59" y1="30" x2="61" y2="30" stroke="#000" stroke-width="1.5"/>
            <!-- Shady Hat / Fedora -->
            <ellipse cx="60" cy="20" rx="20" ry="4" fill="#2d2d2d" stroke="#222" stroke-width="1"/>
            <rect x="47" y="10" width="26" height="10" fill="#2d2d2d" stroke="#222" stroke-width="1.5"/>
            <!-- Trenchcoat Body -->
            <path d="M35 68 C35 50, 85 50, 85 68 Z" fill="#555" stroke="#222" stroke-width="1.5"/>
            <!-- Money bag -->
            <circle cx="80" cy="56" r="8" fill="#d4af37" stroke="#222" stroke-width="1"/>
            <text x="77" y="60" font-size="10" font-family="monospace" font-weight="bold" fill="#222">$</text>
        `;
    } else if (type === "auditor") {
        drawing += `
            <!-- Head -->
            <circle cx="60" cy="32" r="14" fill="#ffd1b3" stroke="#222" stroke-width="1.5"/>
            <!-- Glasses -->
            <rect x="48" y="26" width="10" height="8" fill="none" stroke="#222" stroke-width="1.5"/>
            <rect x="62" y="26" width="10" height="8" fill="none" stroke="#222" stroke-width="1.5"/>
            <line x1="58" y1="30" x2="62" y2="30" stroke="#222" stroke-width="1.5"/>
            <!-- Suit/Tie Body -->
            <path d="M35 68 C35 50, 85 50, 85 68 Z" fill="#2d2d2d" stroke="#222" stroke-width="1.5"/>
            <!-- White shirt insert -->
            <polygon points="54,50 66,50 60,65" fill="#fff"/>
            <!-- Red tie -->
            <polygon points="59,50 61,50 62,68 60,72 58,68" fill="#e53935"/>
        `;
    }

    return `
        <svg class="captcha-scene" viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg">
            ${drawing}
        </svg>`;
}


/* ===================================================================== */
/* PUZZLE RENDERING */

/* ===================================================================== */
/* PUZZLE RENDERING                                                        */
/* ===================================================================== */

function renderCurrentPuzzle() {
    if (gameState.inCaptchaMode) {
        renderLockoutCaptcha();
        return;
    }

    if (gameState.currentPuzzleIndex >= puzzles.length) {
        finishPuzzleSequence();
        return;
    }

    const puzzle = puzzles[gameState.currentPuzzleIndex];

    puzzleTitle.textContent = puzzle.title;
    puzzleDescription.textContent = puzzle.description;

    puzzleCounter.textContent =
        `${String(gameState.currentPuzzleIndex + 1).padStart(2, "0")} / ${String(puzzles.length).padStart(2, "0")}`;

    verificationProgress.textContent =
        `ACCESS ${Math.round(
            (gameState.currentPuzzleIndex / puzzles.length) * 100
        )}%`;

    verificationStatus.textContent = "STATUS: WAITING";
    verificationFooterStatus.textContent = "Restricted";

    puzzleArea.innerHTML = "";
    puzzleHint.hidden = true;
    puzzleHint.textContent = "";

    switch (puzzle.type) {

        case "multiple-choice":
            renderMultipleChoicePuzzle(puzzle);
            break;

        case "riddle":
            renderRiddlePuzzle(puzzle);
            break;

        case "observation":
            renderObservationPuzzle(puzzle);
            break;

        case "captcha":
            renderCaptchaPuzzle(puzzle);
            break;

        case "geo":
            renderGeoPuzzle(puzzle);
            break;

        case "simon":
            renderSimonSaysPuzzle(puzzle);
            break;

        case "mines":
            renderMinesPuzzle(puzzle);
            break;

        default:
            puzzleArea.textContent = "ERROR: Unsupported puzzle type.";
    }
}

function renderLockoutCaptcha() {
    const captcha = captchas[gameState.activeCaptchaIndex];

    puzzleTitle.textContent = captcha.title;
    puzzleDescription.textContent = captcha.description;
    
    puzzleCounter.textContent = "SYS_LOCK";
    
    verificationStatus.textContent = "STATUS: LOCKOUT ACTIVE";
    verificationFooterStatus.textContent = "Warning";
    
    puzzleArea.innerHTML = "";
    puzzleHint.hidden = true;
    puzzleHint.textContent = "";

    if (captcha.type === "captcha") {
        renderCaptchaPuzzle(captcha);
    } else if (captcha.type === "text-captcha") {
        renderTextCaptcha(captcha);
    } else if (captcha.type === "escape-captcha") {
        renderEscapeCaptcha(captcha);
    } else if (captcha.type === "color-captcha") {
        renderColorCaptcha(captcha);
    }
}

function renderColorCaptcha(puzzle) {
    const label = document.createElement("div");
    label.className = "captcha-label";
    label.textContent = "CAPTCHA // COLOR SYNCHRONIZATION";

    const instruction = document.createElement("p");
    instruction.className = "puzzle-instructions";
    instruction.textContent = puzzle.instruction;

    const baseH = Math.floor(Math.random() * 360);
    const baseS = Math.floor(Math.random() * 30) + 50; 
    const baseL = Math.floor(Math.random() * 20) + 40; 
    const targetColor = `hsl(${baseH}, ${baseS}%, ${baseL}%)`;

    const previewContainer = document.createElement("div");
    previewContainer.style.display = "flex";
    previewContainer.style.flexDirection = "column";
    previewContainer.style.alignItems = "center";
    previewContainer.style.margin = "10px auto";
    
    const previewLabel = document.createElement("span");
    previewLabel.className = "puzzle-note";
    previewLabel.textContent = "TARGET SHADE:";
    previewLabel.style.marginBottom = "4px";
    
    const previewBox = document.createElement("div");
    previewBox.style.width = "75px";
    previewBox.style.height = "40px";
    previewBox.style.border = "3px inset #fff";
    previewBox.style.background = targetColor;
    
    previewContainer.appendChild(previewLabel);
    previewContainer.appendChild(previewBox);

    const grid = document.createElement("div");
    grid.className = "captcha-grid";
    grid.style.gridTemplateColumns = "repeat(3, 80px)";
    grid.style.gap = "8px";
    grid.style.justifyContent = "center";
    grid.style.margin = "12px auto";

    const correctIdx = Math.floor(Math.random() * 9);
    let selectedIndex = null;
    const buttons = [];

    for (let i = 0; i < 9; i++) {
        const btn = document.createElement("button");
        btn.className = "captcha-tile";
        btn.style.width = "80px";
        btn.style.height = "60px";
        btn.style.padding = "0";
        btn.style.border = "3px outset #fff";
        btn.style.borderRadius = "0";
        btn.style.cursor = "pointer";
        
        const color = (i === correctIdx) ? targetColor : generateCloseShade(baseH, baseS, baseL);
        btn.style.backgroundColor = color;
        
        const num = document.createElement("span");
        num.className = "tile-number";
        num.textContent = i + 1;
        btn.appendChild(num);
        
        btn.addEventListener("click", () => {
            playClick();
            buttons.forEach(b => b.classList.remove("selected"));
            selectedIndex = i;
            btn.classList.add("selected");
        });
        
        grid.appendChild(btn);
        buttons.push(btn);
    }

    const controls = document.createElement("div");
    controls.className = "captcha-controls";

    const status = document.createElement("span");
    status.className = "puzzle-note";
    status.textContent = "Select the single matching tile.";

    const verify = document.createElement("button");
    verify.className = "retro-button";
    verify.textContent = "VERIFY";

    verify.addEventListener("click", () => {
        if (selectedIndex === correctIdx) {
            if (gameState.inCaptchaMode) {
                gameState.inCaptchaMode = false;
                gameState.activeCaptchaIndex = Math.floor(Math.random() * captchas.length);
                playSuccess();
                logSystemMessage("VERIFY     CAPTCHA solved. Color shade verification accepted.");
                
                verificationStatus.textContent = "STATUS: LOCKOUT CLEARED";
                verificationFooterStatus.textContent = "Verified";
                
                const verificationWindow = document.getElementById("verification-window");
                verificationWindow.classList.remove("success-flash");
                void verificationWindow.offsetWidth;
                verificationWindow.classList.add("success-flash");
                
                saveGameState();
                
                setTimeout(() => {
                    renderCurrentPuzzle();
                }, 800);
            }
        } else {
            handleIncorrectAnswer();
        }
    });

    controls.appendChild(status);
    controls.appendChild(verify);

    puzzleArea.appendChild(label);
    puzzleArea.appendChild(instruction);
    puzzleArea.appendChild(previewContainer);
    puzzleArea.appendChild(grid);
    puzzleArea.appendChild(controls);
}

function generateCloseShade(baseH, baseS, baseL) {
    const hShift = (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 6) + 4); 
    const sShift = (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 4) + 4); 
    const lShift = (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 4) + 4); 
    
    const h = (baseH + hShift + 360) % 360;
    const s = Math.min(95, Math.max(10, baseS + sShift));
    const l = Math.min(90, Math.max(10, baseL + lShift));
    
    return `hsl(${h}, ${s}%, ${l}%)`;
}

function renderTextCaptcha(puzzle) {
    const label = document.createElement("div");
    label.className = "captcha-label";
    label.textContent = "CAPTCHA // TEXT VERIFICATION";

    const instruction = document.createElement("p");
    instruction.className = "puzzle-instructions";
    instruction.textContent = puzzle.instruction;

    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let captchaText = "";
    for (let i = 0; i < 6; i++) {
        captchaText += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    const canvas = document.createElement("canvas");
    canvas.width = 200;
    canvas.height = 60;
    canvas.style.display = "block";
    canvas.style.margin = "10px auto";
    canvas.style.border = "2px solid #555";
    canvas.style.background = "#d3d3d3";

    const ctx = canvas.getContext("2d");
    
    // Draw 8 background noise lines
    ctx.strokeStyle = "#888";
    ctx.lineWidth = 1.2;
    for (let i = 0; i < 8; i++) {
        ctx.beginPath();
        ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
        ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
        ctx.stroke();
    }
    
    // Draw 2 crossing bezier curves
    ctx.strokeStyle = "#444";
    ctx.lineWidth = 2.0;
    for (let i = 0; i < 2; i++) {
        ctx.beginPath();
        ctx.moveTo(0, Math.random() * canvas.height);
        ctx.quadraticCurveTo(
            canvas.width / 2, Math.random() * canvas.height, 
            canvas.width, Math.random() * canvas.height
        );
        ctx.stroke();
    }

    // Varied fonts to confuse OCR/reading
    const fonts = [
        "italic bold 28px serif",
        "bold 24px sans-serif",
        "italic 26px monospace",
        "bold 26px cursive",
        "bold 28px Impact",
        "italic bold 25px Georgia"
    ];
    
    ctx.textBaseline = "middle";
    for (let i = 0; i < captchaText.length; i++) {
        // Moderate variation in translation, rotation, and kerning
        const x = 15 + i * 28 + (Math.random() - 0.5) * 5;
        const y = 30 + (Math.random() - 0.5) * 10;
        const angle = (Math.random() - 0.5) * 0.45; // ~25 degrees max rotation
        
        // Random scaling factor to warp width/height
        const scaleX = 0.9 + Math.random() * 0.2;
        const scaleY = 0.9 + Math.random() * 0.2;
        
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        ctx.scale(scaleX, scaleY);
        
        ctx.font = fonts[Math.floor(Math.random() * fonts.length)];
        ctx.fillStyle = Math.random() > 0.5 ? "#000" : "#222";
        
        ctx.fillText(captchaText[i], 0, 0);
        ctx.restore();
    }

    // 80 heavy random noise pixels
    for (let i = 0; i < 80; i++) {
        ctx.fillStyle = Math.random() > 0.5 ? "#000" : "#888";
        const size = Math.random() > 0.8 ? 3 : 1.5;
        ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, size, size);
    }

    const inputContainer = document.createElement("div");
    inputContainer.style.textAlign = "center";
    inputContainer.style.marginTop = "8px";

    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Type code...";
    input.style.width = "120px";
    input.style.padding = "6px";
    input.style.border = "2px inset #fff";
    input.style.background = "#fff";
    input.style.color = "#000";
    input.style.textAlign = "center";
    input.style.textTransform = "uppercase";
    input.maxLength = 5;

    const controls = document.createElement("div");
    controls.className = "captcha-controls";
    controls.style.justifyContent = "center";
    controls.style.marginTop = "8px";

    const verify = document.createElement("button");
    verify.className = "retro-button";
    verify.textContent = "VERIFY";

    verify.addEventListener("click", () => {
        const correct = input.value.trim().toUpperCase() === captchaText;
        if (correct) {
            gameState.inCaptchaMode = false;
            gameState.activeCaptchaIndex = Math.floor(Math.random() * captchas.length);
            playSuccess();
            logSystemMessage("VERIFY     CAPTCHA solved. Lockout cleared.");
            
            verificationStatus.textContent = "STATUS: LOCKOUT CLEARED";
            verificationFooterStatus.textContent = "Verified";
            
            const verificationWindow = document.getElementById("verification-window");
            verificationWindow.classList.remove("success-flash");
            void verificationWindow.offsetWidth;
            verificationWindow.classList.add("success-flash");
            
            saveGameState();
            
            setTimeout(() => {
                renderCurrentPuzzle();
            }, 800);
        } else {
            playError();
            logSystemMessage("VERIFY     CAPTCHA failure. Changing challenge.");
            
            const verificationWindow = document.getElementById("verification-window");
            verificationWindow.classList.remove("error-shake");
            void verificationWindow.offsetWidth;
            verificationWindow.classList.add("error-shake");
            
            gameState.activeCaptchaIndex = Math.floor(Math.random() * captchas.length);
            saveGameState();
            
            setTimeout(() => {
                renderCurrentPuzzle();
            }, 800);
        }
    });

    input.addEventListener("keydown", event => {
        if (event.key === "Enter") {
            verify.click();
        }
    });

    inputContainer.appendChild(input);
    controls.appendChild(verify);

    puzzleArea.appendChild(label);
    puzzleArea.appendChild(instruction);
    puzzleArea.appendChild(canvas);
    puzzleArea.appendChild(inputContainer);
    puzzleArea.appendChild(controls);

    setTimeout(() => input.focus(), 100);
}

function renderMinesPuzzle(puzzle) {
    const instruction = document.createElement("p");
    instruction.className = "puzzle-instructions";
    instruction.textContent = puzzle.instruction;

    const grid = document.createElement("div");
    grid.style.display = "grid";
    const cols = Math.sqrt(puzzle.values.length);
    grid.style.gridTemplateColumns = `repeat(${cols}, 50px)`;
    grid.style.gap = "4px";
    grid.style.justifyContent = "center";
    grid.style.margin = "12px auto";

    const flagged = new Set();

    puzzle.values.forEach((val, idx) => {
        const cell = document.createElement("button");
        cell.className = "retro-button";
        cell.style.width = "50px";
        cell.style.height = "50px";
        cell.style.padding = "0";
        cell.style.fontSize = "16px";
        cell.style.fontWeight = "bold";

        if (val !== "?") {
            cell.textContent = val;
            cell.disabled = true;
            cell.style.background = "#ccc";
            cell.style.border = "1px solid #999";
            if (val === "1") cell.style.color = "blue";
            if (val === "2") cell.style.color = "green";
        } else {
            cell.textContent = "";
            cell.style.background = "#c0c0c0";
            
            cell.addEventListener("click", () => {
                playClick();
                if (flagged.has(idx)) {
                    flagged.delete(idx);
                    cell.textContent = "";
                    cell.style.background = "#c0c0c0";
                    cell.style.border = "";
                } else {
                    flagged.add(idx);
                    cell.innerHTML = `<span style="color:red; font-size:18px;">🚩</span>`;
                    cell.style.background = "#e0e0e0";
                    cell.style.border = "2px inset #fff";
                }
            });
        }
        grid.appendChild(cell);
    });

    const controls = document.createElement("div");
    controls.className = "captcha-controls";
    controls.style.justifyContent = "center";
    controls.style.marginTop = "8px";

    const verify = document.createElement("button");
    verify.className = "retro-button";
    verify.textContent = "VERIFY";

    verify.addEventListener("click", () => {
        const correct = flagged.size === puzzle.mines.length && 
                        puzzle.mines.every(m => flagged.has(m));
        if (correct) {
            handleCorrectAnswer();
        } else {
            handleIncorrectAnswer();
        }
    });
    controls.appendChild(verify);
    puzzleArea.appendChild(instruction);
    puzzleArea.appendChild(grid);
    puzzleArea.appendChild(controls);
}

function renderEscapeCaptcha(puzzle) {
    const label = document.createElement("div");
    label.className = "captcha-label";
    label.textContent = "CAPTCHA // ROBOT CHECK";

    const instruction = document.createElement("p");
    instruction.className = "puzzle-instructions";
    instruction.textContent = puzzle.instruction;

    const area = document.createElement("div");
    area.style.position = "relative";
    area.style.width = "100%";
    area.style.height = "120px";
    area.style.border = "2px inset #fff";
    area.style.background = "#fff";
    area.style.margin = "10px 0";
    area.style.overflow = "hidden";

    const box = document.createElement("div");
    box.style.position = "absolute";
    box.style.left = "40px";
    box.style.top = "45px";
    box.style.display = "flex";
    box.style.alignItems = "center";
    box.style.gap = "6px";
    box.style.padding = "5px 8px";
    box.style.border = "1px solid #888";
    box.style.background = "#f0f0f0";
    box.style.cursor = "pointer";
    box.style.userSelect = "none";
    box.style.transition = "left 0.1s, top 0.1s";
    box.tabIndex = 0; // Make focusable via keyboard!

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.style.pointerEvents = "none";

    const text = document.createElement("span");
    text.textContent = "I am not a robot";
    text.style.fontSize = "12px";
    text.style.color = "#000";

    box.appendChild(checkbox);
    box.appendChild(text);

    let escapeCount = 0;
    let isDazed = false;

    const playBonkSound = () => {
        playSoundFile("bonk.mp3", () => {
            try {
                const ctx = new (window.AudioContext || window.webkitAudioContext)();
                
                // Classic PC Speaker error double beep: 800Hz for 0.08s, then 800Hz again
                const osc = ctx.createOscillator();
                const gainNode = ctx.createGain();
                osc.type = "square";
                osc.frequency.setValueAtTime(800, ctx.currentTime);
                
                gainNode.gain.setValueAtTime(0.015, ctx.currentTime);
                gainNode.gain.setValueAtTime(0, ctx.currentTime + 0.08);
                gainNode.gain.setValueAtTime(0.015, ctx.currentTime + 0.14);
                gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.22);
                
                osc.connect(gainNode);
                gainNode.connect(ctx.destination);
                osc.start(ctx.currentTime);
                osc.stop(ctx.currentTime + 0.25);
            } catch (e) {
                console.error("Audio error: ", e);
            }
        });
    };

    const playScanHum = () => {
        playSoundFile("scan.mp3", () => {
            try {
                const ctx = new (window.AudioContext || window.webkitAudioContext)();
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = "triangle";
                osc.frequency.setValueAtTime(150, ctx.currentTime);
                osc.frequency.linearRampToValueAtTime(300, ctx.currentTime + 0.9);
                osc.frequency.linearRampToValueAtTime(150, ctx.currentTime + 1.8);
                
                gain.gain.setValueAtTime(0.01, ctx.currentTime);
                gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.3);
                gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 1.8);
                
                osc.connect(gain);
                gain.connect(ctx.destination);
                
                osc.start();
                osc.stop(ctx.currentTime + 1.8);
            } catch (e) {
                console.error(e);
            }
        });
    };

    const playEpicSynth = () => {
        playSoundFile("epic_synth.mp3", () => {
            try {
                const ctx = new (window.AudioContext || window.webkitAudioContext)();
                
                // Deep sub base rumble
                const rumble = ctx.createOscillator();
                const rumbleGain = ctx.createGain();
                rumble.type = "sawtooth";
                rumble.frequency.setValueAtTime(60, ctx.currentTime);
                rumbleGain.gain.setValueAtTime(0.4, ctx.currentTime);
                
                // Cinematic rising siren
                const siren = ctx.createOscillator();
                const sirenGain = ctx.createGain();
                siren.type = "sawtooth";
                siren.frequency.setValueAtTime(100, ctx.currentTime);
                siren.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 6.0);
                sirenGain.gain.setValueAtTime(0.01, ctx.currentTime);
                sirenGain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + 1.5);
                sirenGain.gain.setValueAtTime(0.25, ctx.currentTime + 5.5);
                sirenGain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 6.2);
                
                // LFO filter effect for rumble
                const filter = ctx.createBiquadFilter();
                filter.type = "lowpass";
                filter.Q.setValueAtTime(5, ctx.currentTime);
                filter.frequency.setValueAtTime(100, ctx.currentTime);
                filter.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 6.0);

                rumble.connect(filter);
                filter.connect(rumbleGain);
                rumbleGain.connect(ctx.destination);
                
                siren.connect(sirenGain);
                sirenGain.connect(ctx.destination);
                
                rumble.start();
                siren.start();
                
                rumble.stop(ctx.currentTime + 6.5);
                siren.stop(ctx.currentTime + 6.5);
            } catch (e) {
                console.error(e);
            }
        });
    };

    const playWormholeSound = () => {
        playSoundFile("wormhole.mp3", () => {
            try {
                const ctx = new (window.AudioContext || window.webkitAudioContext)();
                
                // White noise buffer
                const bufferSize = ctx.sampleRate * 3.0; // 3 seconds
                const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
                const data = buffer.getChannelData(0);
                for (let i = 0; i < bufferSize; i++) {
                    data[i] = Math.random() * 2 - 1;
                }
                
                const noise = ctx.createBufferSource();
                noise.buffer = buffer;
                
                const filter = ctx.createBiquadFilter();
                filter.type = "bandpass";
                filter.Q.setValueAtTime(8, ctx.currentTime);
                filter.frequency.setValueAtTime(800, ctx.currentTime);
                filter.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 1.5);
                filter.frequency.exponentialRampToValueAtTime(1800, ctx.currentTime + 3.0);
                
                const gain = ctx.createGain();
                gain.gain.setValueAtTime(0.01, ctx.currentTime);
                gain.gain.linearRampToValueAtTime(0.4, ctx.currentTime + 0.5);
                gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 3.0);
                
                noise.connect(filter);
                filter.connect(gain);
                gain.connect(ctx.destination);
                
                noise.start();
                noise.stop(ctx.currentTime + 3.0);
            } catch (e) {
                console.error(e);
            }
        });
    };

    const escape = () => {
        if (isDazed) return;
        escapeCount++;

        // On the 78th run, it comically crashes into the right boundary and falls flat on its side dazed!
        if (escapeCount >= 150) {
            isDazed = true;
            text.textContent = "Dazed... @_@";
            
            box.style.left = `${area.clientWidth - box.offsetWidth - 4}px`;
            box.style.top = `${area.clientHeight - box.offsetHeight - 4}px`;
            box.style.transform = "rotate(80deg)";
            box.style.transition = "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
            box.classList.add("comical-bonk-anim");
            
            // Spinning stars above the dazed box
            const stars = document.createElement("div");
            stars.className = "dazed-stars";
            stars.textContent = "⭐ ⭐ ⭐";
            box.appendChild(stars);
            
            playBonkSound();

            // Auto-recovery countdown: wakes up in exactly 1 second if not clicked!
            if (window.dazedTimeout) clearTimeout(window.dazedTimeout);
            window.dazedTimeout = setTimeout(() => {
                if (isDazed) {
                    isDazed = false;
                    escapeCount = 0;
                    box.classList.remove("comical-bonk-anim");
                    box.style.transform = "rotate(0deg)";
                    box.style.transition = "all 0.2s ease";
                    text.textContent = "I am not a robot";
                    stars.remove();
                    escape(); // run away immediately!
                    logSystemMessage("LOCKOUT    Checkbox recovered! target escaped.");
                }
            }, 1000);
            return;
        }

        const areaWidth = area.clientWidth;
        const areaHeight = area.clientHeight;
        const boxWidth = box.offsetWidth || 120;
        const boxHeight = box.offsetHeight || 30;

        const maxL = areaWidth - boxWidth - 10;
        const maxT = areaHeight - boxHeight - 10;

        const newL = Math.max(10, Math.floor(Math.random() * maxL));
        const newT = Math.max(10, Math.floor(Math.random() * maxT));

        box.style.left = `${newL}px`;
        box.style.top = `${newT}px`;
        playClick();
    };

    // Flee when hovered or touched
    box.addEventListener("mouseover", escape);
    box.addEventListener("touchstart", (e) => {
        e.preventDefault();
        escape();
    });

    // Proximity check: Flee if mouse/touch gets within 65px of the box center
    const checkProximity = (e) => {
        if (isDazed) return;
        const rect = area.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;

        const mouseX = clientX - rect.left;
        const mouseY = clientY - rect.top;

        const boxLeft = parseFloat(box.style.left) || 40;
        const boxTop = parseFloat(box.style.top) || 45;
        const boxWidth = box.offsetWidth || 120;
        const boxHeight = box.offsetHeight || 30;

        const boxCenterX = boxLeft + boxWidth / 2;
        const boxCenterY = boxTop + boxHeight / 2;

        const dx = mouseX - boxCenterX;
        const dy = mouseY - boxCenterY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 130) {
            escape();
        }
    };

    area.addEventListener("mousemove", checkProximity);
    area.addEventListener("touchmove", checkProximity, { passive: true });

    // Bypass Reward Trigger (when they manage to click it or trigger via keyboard space/enter)
    const triggerBypass = () => {
        checkbox.checked = true;
        gameState.inCaptchaMode = false;
        gameState.activeCaptchaIndex = Math.floor(Math.random() * captchas.length);
        playSuccess();
        logSystemMessage("BYPASS     Robot check bypassed. Return to core test.");
        
        verificationStatus.textContent = "STATUS: LOCKOUT CLEARED";
        verificationFooterStatus.textContent = "Verified";
        
        const verificationWindow = document.getElementById("verification-window");
        verificationWindow.classList.remove("success-flash");
        void verificationWindow.offsetWidth;
        verificationWindow.classList.add("success-flash");
        
        saveGameState();
        
        setTimeout(() => {
            renderCurrentPuzzle();
        }, 800);
    };

    const triggerEpicCutscene = () => {
        if (window.dazedTimeout) clearTimeout(window.dazedTimeout);

        // Create full screen overlay
        const overlay = document.createElement("div");
        overlay.className = "epic-cutscene-overlay";
        
        // Letterbox bars
        const letterboxTop = document.createElement("div");
        letterboxTop.className = "epic-letterbox-top";
        const letterboxBottom = document.createElement("div");
        letterboxBottom.className = "epic-letterbox-bottom";
        
        // Alert flashing background
        const alertBg = document.createElement("div");
        alertBg.className = "epic-alert-bg";
        
        // 3D scrolling grid
        const grid3d = document.createElement("div");
        grid3d.className = "epic-grid-3d";
        
        // Central dazed duplicate checkbox box
        const centerContainer = document.createElement("div");
        centerContainer.style.position = "relative";
        centerContainer.style.zIndex = "100";
        centerContainer.style.display = "flex";
        centerContainer.style.flexDirection = "column";
        centerContainer.style.alignItems = "center";
        centerContainer.style.justifyContent = "center";
        centerContainer.style.transform = "scale(1.2)";
        centerContainer.style.transition = "all 0.5s ease";

        const cutsceneBox = document.createElement("div");
        cutsceneBox.style.display = "flex";
        cutsceneBox.style.alignItems = "center";
        cutsceneBox.style.gap = "6px";
        cutsceneBox.style.padding = "5px 8px";
        cutsceneBox.style.border = "1px solid #00ffff";
        cutsceneBox.style.boxShadow = "0 0 10px rgba(0, 255, 255, 0.5)";
        cutsceneBox.style.background = "rgba(0, 30, 40, 0.85)";
        cutsceneBox.style.cursor = "default";
        cutsceneBox.style.transform = "rotate(80deg)"; // identical dazed tilt
        cutsceneBox.style.transition = "all 0.3s ease";

        const cutsceneCheckbox = document.createElement("input");
        cutsceneCheckbox.type = "checkbox";
        cutsceneCheckbox.disabled = true;

        const cutsceneText = document.createElement("span");
        cutsceneText.textContent = "Ouch... x_x";
        cutsceneText.style.fontSize = "12px";
        cutsceneText.style.color = "#00ffff";

        const cutsceneStars = document.createElement("div");
        cutsceneStars.className = "dazed-stars";
        cutsceneStars.textContent = "⭐ ⭐ ⭐";

        // Laser scan line inside the target box
        const scanLine = document.createElement("div");
        scanLine.className = "futuristic-scan-line";

        cutsceneBox.appendChild(cutsceneCheckbox);
        cutsceneBox.appendChild(cutsceneText);
        cutsceneBox.appendChild(cutsceneStars);
        cutsceneBox.appendChild(scanLine);
        centerContainer.appendChild(cutsceneBox);
        
        // Text container for warning details
        const textContainer = document.createElement("div");
        textContainer.style.zIndex = "12";
        textContainer.style.display = "flex";
        textContainer.style.flexDirection = "column";
        textContainer.style.alignItems = "center";
        textContainer.style.marginTop = "30px";
        
        overlay.appendChild(letterboxTop);
        overlay.appendChild(letterboxBottom);
        overlay.appendChild(alertBg);
        overlay.appendChild(grid3d);
        overlay.appendChild(centerContainer);
        overlay.appendChild(textContainer);
        
        // White flash element
        const flash = document.createElement("div");
        flash.className = "epic-white-flash";
        document.body.appendChild(flash);
        
        // Futuristic virtual pointer cursor
        const virtualCursor = document.createElement("div");
        virtualCursor.className = "epic-virtual-cursor";
        overlay.appendChild(virtualCursor);
        
        document.body.appendChild(overlay);
        
        const startWormhole = (canvas) => {
            const ctx = canvas.getContext("2d");
            let time = 0;
            const streaks = [];
            
            for (let i = 0; i < 80; i++) {
                streaks.push({
                    angle: Math.random() * Math.PI * 2,
                    speed: 2 + Math.random() * 8,
                    length: 10 + Math.random() * 40,
                    r: Math.random() * 50
                });
            }
            
            const draw = () => {
                if (!canvas.parentNode) return;
                ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                
                ctx.save();
                ctx.translate(canvas.width / 2, canvas.height / 2);
                
                // Warping concentric neon rings
                ctx.strokeStyle = "rgba(0, 255, 255, 0.25)";
                ctx.lineWidth = 2;
                for (let i = 1; i <= 5; i++) {
                    ctx.beginPath();
                    const radius = ((time * 15 + i * 80) % 400);
                    ctx.arc(0, 0, radius, 0, Math.PI * 2);
                    ctx.stroke();
                }
                
                // Moving star streaks radiating from central event horizon
                streaks.forEach(s => {
                    s.r += s.speed;
                    if (s.r > Math.max(canvas.width, canvas.height)) {
                        s.r = 0;
                        s.angle = Math.random() * Math.PI * 2;
                        s.speed = 2 + Math.random() * 8;
                    }
                    
                    const x1 = Math.cos(s.angle) * s.r;
                    const y1 = Math.sin(s.angle) * s.r;
                    const x2 = Math.cos(s.angle) * (s.r + s.length);
                    const y2 = Math.sin(s.angle) * (s.r + s.length);
                    
                    const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
                    gradient.addColorStop(0, "rgba(0, 255, 255, 0)");
                    gradient.addColorStop(0.5, "rgba(0, 255, 255, 0.85)");
                    gradient.addColorStop(1, "rgba(255, 0, 255, 0.9)");
                    
                    ctx.strokeStyle = gradient;
                    ctx.lineWidth = 3;
                    ctx.beginPath();
                    ctx.moveTo(x1, y1);
                    ctx.lineTo(x2, y2);
                    ctx.stroke();
                });
                
                // Pulsing event horizon core
                const pulse = 45 + Math.sin(time * 0.1) * 5;
                const radGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, pulse);
                radGrad.addColorStop(0, "#fff");
                radGrad.addColorStop(0.3, "#00ffff");
                radGrad.addColorStop(0.8, "#ff00ff");
                radGrad.addColorStop(1, "transparent");
                
                ctx.fillStyle = radGrad;
                ctx.beginPath();
                ctx.arc(0, 0, pulse, 0, Math.PI * 2);
                ctx.fill();
                
                ctx.restore();
                time += 0.5;
                requestAnimationFrame(draw);
            };
            draw();
        };

        const addLine = (txt, color = "#ff00ff") => {
            const line = document.createElement("div");
            line.className = "epic-text-line";
            line.style.color = color;
            line.textContent = txt;
            textContainer.appendChild(line);
            setTimeout(() => line.classList.add("active"), 50);
            return line;
        };
        
        // 0.2s: Slide in cinematic letterboxes & activate grid
        setTimeout(() => {
            overlay.classList.add("epic-letterbox-active");
            grid3d.classList.add("scrolling");
            alertBg.classList.add("flash-active");
            document.body.classList.add("camera-shake-active");
            
            // Glide virtual cyber-pointer cursor to center of checkbox
            const boxRect = cutsceneBox.getBoundingClientRect();
            const overlayRect = overlay.getBoundingClientRect();
            const targetX = boxRect.left + boxRect.width / 2 - overlayRect.left;
            const targetY = boxRect.top + boxRect.height / 2 - overlayRect.top;
            
            virtualCursor.style.left = `${targetX - 4}px`;
            virtualCursor.style.top = `${targetY - 4}px`;
            playScanHum();
        }, 200);
        
        // Decryption bar sweep
        addLine("WARNING: QUANTUM MATRIX SYSTEM DETECTED", "#ff0055");
        const decryptLine = addLine("DECRYPTING NEURAL SECURITY KEY... [ 0% ]", "#00ffff");
        let progress = 0;
        const progressInterval = setInterval(() => {
            progress += Math.floor(Math.random() * 12) + 6;
            if (progress >= 100) {
                progress = 100;
                clearInterval(progressInterval);
            }
            decryptLine.textContent = `DECRYPTING NEURAL SECURITY KEY... [ ${progress}% ]`;
        }, 110);
        
        // 2.0s: Decryptor locks on, clicks box and triggers matrix override!
        setTimeout(() => {
            clearInterval(progressInterval);
            decryptLine.textContent = "DECRYPTING NEURAL SECURITY KEY... [ 100% ]";
            
            cutsceneCheckbox.checked = true;
            cutsceneBox.style.background = "#39ff14"; // neon green override glow
            cutsceneBox.style.border = "1px solid #39ff14";
            cutsceneBox.style.boxShadow = "0 0 25px #39ff14";
            cutsceneText.textContent = "OVERRIDE ACCEPTED";
            cutsceneText.style.color = "#000";
            cutsceneText.style.fontWeight = "bold";
            cutsceneStars.remove();
            
            playClick();
            playBonkSound(); // sound click beep
            virtualCursor.remove();
            
            // Start Audio Drone & Warning lines
            playEpicSynth();
            addLine("MATRIX OVERRIDE SUCCESSFUL. INTRUSION COMMENCING.", "#39ff14");
            
            // Spawn swirling equations
            const formulas = [
                "Ψ(x,t) = Ae^(i(kx-wt))",
                "Δx · Δp ≥ ℏ/2",
                "E = mc²",
                "Gμν + Λgμν = 8πG Tμν",
                "ds² = -(1-2M/r)dt² + (1-2M/r)⁻¹dr²",
                "iℏ ∂/∂t |Ψ⟩ = Ĥ|Ψ⟩",
                "S = k log W",
                "∇ × B = μ₀J + μ₀ε₀ ∂E/∂t",
                "λ = h/p",
                "F = dp/dt"
            ];
            
            const spawnQuantumFormulas = setInterval(() => {
                const formulaEl = document.createElement("div");
                formulaEl.className = "quantum-formula";
                formulaEl.textContent = formulas[Math.floor(Math.random() * formulas.length)];
                
                const angle = Math.random() * Math.PI * 2;
                const dist = 300 + Math.random() * 300;
                const tx = Math.cos(angle) * dist;
                const ty = Math.sin(angle) * dist;
                const rot = -180 + Math.random() * 360;
                
                formulaEl.style.setProperty("--tx", `${tx}px`);
                formulaEl.style.setProperty("--ty", `${ty}px`);
                formulaEl.style.setProperty("--rot", `${rot}deg`);
                
                formulaEl.style.left = `${overlay.clientWidth / 2 - 100 + (Math.random() - 0.5) * 100}px`;
                formulaEl.style.top = `${overlay.clientHeight / 2 - 20 + (Math.random() - 0.5) * 50}px`;
                
                formulaEl.style.animation = "quantum-float 2.5s cubic-bezier(0.1, 0.8, 0.3, 1) forwards";
                overlay.appendChild(formulaEl);
                
                setTimeout(() => formulaEl.remove(), 2500);
            }, 140);
            
            overlay.dataset.spawnInterval = spawnQuantumFormulas;
        }, 2000);
        
        // 3.4s: Second Line
        setTimeout(() => {
            addLine("OPENING SINGULARITY HYPERDRIVE WARP CORE...", "#ff00ff");
        }, 3400);
        
        // 4.8s: Wormhole Vortex fades in & sucks in duplicate + scrolling grid
        setTimeout(() => {
            const wormholeCanvas = document.createElement("canvas");
            wormholeCanvas.width = 600;
            wormholeCanvas.height = 600;
            wormholeCanvas.style.position = "absolute";
            wormholeCanvas.style.zIndex = "5";
            wormholeCanvas.style.top = "50%";
            wormholeCanvas.style.left = "50%";
            wormholeCanvas.style.transform = "translate(-50%, -50%) scale(0)";
            wormholeCanvas.style.transition = "transform 1.5s cubic-bezier(0.1, 0.8, 0.3, 1)";
            wormholeCanvas.style.borderRadius = "50%";
            
            overlay.appendChild(wormholeCanvas);
            
            setTimeout(() => {
                wormholeCanvas.style.transform = "translate(-50%, -50%) scale(1.6)";
            }, 100);
            
            startWormhole(wormholeCanvas);
            playWormholeSound();
            
            // Visual suction of container elements
            centerContainer.style.transition = "transform 2s ease-in, opacity 2s ease-in";
            centerContainer.style.transform = "scale(0) rotate(720deg)";
            centerContainer.style.opacity = "0";
            
            grid3d.style.transition = "transform 2.5s ease-in, opacity 2.5s ease-in";
            grid3d.style.transform = "perspective(400px) rotateX(80deg) scale(0) rotate(360deg)";
            grid3d.style.opacity = "0";
            
            textContainer.style.transition = "transform 2s ease-in, opacity 2s ease-in";
            textContainer.style.transform = "scale(0) rotate(-360deg)";
            textContainer.style.opacity = "0";
        }, 4800);
        
        // 6.8s: Glitch distort and suck the entire overlay into the wormhole
        setTimeout(() => {
            clearInterval(parseInt(overlay.dataset.spawnInterval));
            document.body.classList.remove("camera-shake-active");
            overlay.classList.add("futuristic-glitch");
            
            // Shrink/spin full viewport overlay
            setTimeout(() => {
                overlay.classList.add("wormhole-active");
            }, 200);
        }, 6800);
        
        // 9.0s: Clean up, bounce verification window back on desktop, and solve!
        setTimeout(() => {
            overlay.remove();
            flash.remove();
            
            // Skip core puzzle
            checkbox.checked = true;
            gameState.inCaptchaMode = false;
            gameState.activeCaptchaIndex = Math.floor(Math.random() * captchas.length);
            playSuccess();
            logSystemMessage("BYPASS     Lockout bypassed by catching the comical runaway checkbox.");
            
            verificationStatus.textContent = "STATUS: BYPASS ACCEPTED";
            verificationFooterStatus.textContent = "Bypassed";
            
            const verificationWindow = document.getElementById("verification-window");
            verificationWindow.classList.remove("success-flash", "verification-bounce");
            void verificationWindow.offsetWidth; // trigger reflow
            verificationWindow.classList.add("success-flash", "verification-bounce");
            
            handleCorrectAnswer();
            saveGameState();
            
            setTimeout(() => {
                renderCurrentPuzzle();
            }, 1200);
        }, 9000);
    };

    box.addEventListener("click", (e) => {
        e.preventDefault();
        if (isDazed) {
            triggerEpicCutscene();
        } else {
            escape();
        }
    });

    box.addEventListener("keydown", (e) => {
        if (e.key === " " || e.key === "Enter") {
            e.preventDefault();
            if (isDazed) {
                triggerEpicCutscene();
            } else {
                triggerBypass();
            }
        }
    });

    const link = document.createElement("div");
    link.style.textAlign = "center";
    link.style.marginTop = "6px";
    
    const solveLink = document.createElement("a");
    solveLink.href = "#";
    solveLink.textContent = "Problems checking the box? Prove you are human: A square is inscribed inside a circle of radius 5. What is the area of the square?";
    solveLink.style.fontSize = "10px";
    solveLink.style.color = "#102a9d";
    solveLink.style.textDecoration = "underline";

    const mathInputContainer = document.createElement("div");
    mathInputContainer.style.display = "none";
    mathInputContainer.style.textAlign = "center";
    mathInputContainer.style.marginTop = "8px";

    const mathInput = document.createElement("input");
    mathInput.type = "text";
    mathInput.placeholder = "Answer...";
    mathInput.style.width = "70px";
    mathInput.style.padding = "4px";
    mathInput.style.border = "2px inset #fff";
    mathInput.style.background = "#fff";
    mathInput.style.color = "#000";
    mathInput.style.textAlign = "center";

    const mathVerify = document.createElement("button");
    mathVerify.className = "retro-button";
    mathVerify.textContent = "VERIFY";
    mathVerify.style.marginLeft = "4px";
    mathVerify.style.padding = "2px 8px";

    solveLink.addEventListener("click", (e) => {
        e.preventDefault();
        playClick();
        solveLink.style.display = "none";
        mathInputContainer.style.display = "block";
        setTimeout(() => mathInput.focus(), 100);
    });

    mathVerify.addEventListener("click", () => {
        const correct = mathInput.value.trim() === "50";
        if (correct) {
            gameState.inCaptchaMode = false;
            gameState.activeCaptchaIndex = Math.floor(Math.random() * captchas.length);
            playSuccess();
            logSystemMessage("VERIFY     Escape CAPTCHA solved via backup math verification.");
            
            verificationStatus.textContent = "STATUS: LOCKOUT CLEARED";
            verificationFooterStatus.textContent = "Verified";
            
            const verificationWindow = document.getElementById("verification-window");
            verificationWindow.classList.remove("success-flash");
            void verificationWindow.offsetWidth;
            verificationWindow.classList.add("success-flash");
            
            saveGameState();
            
            setTimeout(() => {
                renderCurrentPuzzle();
            }, 800);
        } else {
            playError();
            logSystemMessage("VERIFY     Escape CAPTCHA math verification failed. Changing challenge.");
            
            const verificationWindow = document.getElementById("verification-window");
            verificationWindow.classList.remove("error-shake");
            void verificationWindow.offsetWidth;
            verificationWindow.classList.add("error-shake");
            
            gameState.activeCaptchaIndex = Math.floor(Math.random() * captchas.length);
            saveGameState();
            
            setTimeout(() => {
                renderCurrentPuzzle();
            }, 800);
        }
    });

    mathInput.addEventListener("keydown", event => {
        if (event.key === "Enter") {
            mathVerify.click();
        }
    });

    mathInputContainer.appendChild(mathInput);
    mathInputContainer.appendChild(mathVerify);
    link.appendChild(solveLink);

    area.appendChild(box);
    puzzleArea.appendChild(label);
    puzzleArea.appendChild(instruction);
    puzzleArea.appendChild(area);
    puzzleArea.appendChild(link);
    puzzleArea.appendChild(mathInputContainer);
}


/* --------------------------------------------------------------------- */
/* MULTIPLE CHOICE                                                        */
/* --------------------------------------------------------------------- */

function renderMultipleChoicePuzzle(puzzle) {

    const question = document.createElement("p");
    question.className = "puzzle-instructions";
    question.textContent = puzzle.question;

    puzzleArea.appendChild(question);

    puzzle.answers.forEach(answer => {

        const button = document.createElement("button");

        button.className = "retro-button puzzle-choice";
        button.style.display = "block";
        button.style.width = "100%";
        button.style.margin = "5px 0";

        button.textContent = answer;

        button.addEventListener("click", () => {
            checkPuzzleAnswer(answer);
        });

        puzzleArea.appendChild(button);
    });

    const note = document.createElement("p");
    note.className = "puzzle-note";
    note.textContent = "Select one answer.";
    puzzleArea.appendChild(note);
}


/* --------------------------------------------------------------------- */
/* RIDDLE                                                                 */
/* --------------------------------------------------------------------- */

function renderRiddlePuzzle(puzzle) {

    const question = document.createElement("p");
    question.className = "puzzle-instructions";
    question.textContent = puzzle.question;

    const input = document.createElement("input");

    input.type = "text";
    input.placeholder = "Type your answer...";
    input.style.width = "100%";
    input.style.padding = "7px";
    input.style.border = "2px inset #fff";
    input.style.background = "#fff";

    const submit = document.createElement("button");

    submit.className = "retro-button";
    submit.style.marginTop = "8px";
    submit.textContent = "SUBMIT";

    const submitAnswer = () => {
        checkPuzzleAnswer(input.value);
    };

    submit.addEventListener("click", submitAnswer);

    input.addEventListener("keydown", event => {
        if (event.key === "Enter") {
            submitAnswer();
        }
    });

    puzzleArea.appendChild(question);
    puzzleArea.appendChild(input);
    puzzleArea.appendChild(submit);

    setTimeout(() => input.focus(), 50);
}


/* --------------------------------------------------------------------- */
/* OBSERVATION                                                            */
/* --------------------------------------------------------------------- */

function renderObservationPuzzle(puzzle) {

    const question = document.createElement("p");
    question.className = "puzzle-instructions";
    question.textContent =
        "Exactly one symbol is different. Click it.";

    puzzleArea.appendChild(question);

    const grid = document.createElement("div");

    grid.style.display = "grid";
    grid.style.gridTemplateColumns = "repeat(4, 72px)";
    grid.style.gap = "7px";
    grid.style.justifyContent = "center";
    grid.style.margin = "25px 0";

    puzzle.items.forEach((item, index) => {

        const button = document.createElement("button");

        button.className = "retro-button";
        button.style.height = "58px";
        button.style.fontSize = "25px";
        button.textContent = item;

        button.addEventListener("click", () => {

            if (index === puzzle.correctIndex) {
                handleCorrectAnswer();
            } else {
                handleIncorrectAnswer();
            }
        });

        grid.appendChild(button);
    });

    puzzleArea.appendChild(grid);
}


/* --------------------------------------------------------------------- */
/* CAPTCHA PUZZLE                                                         */
/* --------------------------------------------------------------------- */

function renderCaptchaPuzzle(puzzle) {

    const label = document.createElement("div");
    label.className = "captcha-label";
    label.textContent = "CAPTCHA // HUMAN VERIFICATION";

    const instruction = document.createElement("p");
    instruction.className = "puzzle-instructions";
    instruction.textContent = puzzle.instruction;

    const grid = document.createElement("div");
    grid.className = "captcha-grid";

    const selectedIndices = new Set();

    puzzle.tiles.forEach((tileType, index) => {

        const tile = document.createElement("button");
        tile.className = "captcha-tile";

        const number = document.createElement("span");
        number.className = "tile-number";
        number.textContent = index + 1;

        tile.innerHTML = captchaTileSvg(tileType, index);
        tile.appendChild(number);

        tile.addEventListener("click", () => {

            if (selectedIndices.has(index)) {
                selectedIndices.delete(index);
                tile.classList.remove("selected");
            } else {
                selectedIndices.add(index);
                tile.classList.add("selected");
            }

            playClick();
        });

        grid.appendChild(tile);
    });

    const controls = document.createElement("div");
    controls.className = "captcha-controls";

    const status = document.createElement("span");
    status.className = "puzzle-note";
    status.textContent = "Select all matching tiles.";

    const verify = document.createElement("button");
    verify.className = "retro-button";
    verify.textContent = "VERIFY";

    verify.addEventListener("click", () => {

        const chosen = [...selectedIndices].sort((a, b) => a - b);
        const expected = [...puzzle.correctIndices].sort((a, b) => a - b);

        const correct =
            chosen.length === expected.length &&
            chosen.every((value, index) => value === expected[index]);

        if (correct) {
            if (gameState.inCaptchaMode) {
                gameState.inCaptchaMode = false;
                gameState.activeCaptchaIndex = Math.floor(Math.random() * captchas.length);
                playSuccess();
                logSystemMessage("VERIFY     CAPTCHA solved. Lockout cleared.");
                
                verificationStatus.textContent = "STATUS: LOCKOUT CLEARED";
                verificationFooterStatus.textContent = "Verified";
                
                const verificationWindow = document.getElementById("verification-window");
                verificationWindow.classList.remove("success-flash");
                void verificationWindow.offsetWidth;
                verificationWindow.classList.add("success-flash");
                
                saveGameState();
                
                setTimeout(() => {
                    renderCurrentPuzzle();
                }, 800);
            } else {
                handleCorrectAnswer();
            }
        } else {
            if (gameState.inCaptchaMode) {
                playError();
                logSystemMessage("VERIFY     CAPTCHA failure. Changing challenge.");
                
                const verificationWindow = document.getElementById("verification-window");
                verificationWindow.classList.remove("error-shake");
                void verificationWindow.offsetWidth;
                verificationWindow.classList.add("error-shake");
                
                gameState.activeCaptchaIndex = Math.floor(Math.random() * captchas.length);
                saveGameState();
                
                setTimeout(() => {
                    renderCurrentPuzzle();
                }, 800);
            } else {
                handleIncorrectAnswer();
                status.textContent = "Incorrect. Try again.";
            }
        }
    });

    controls.appendChild(status);
    controls.appendChild(verify);

    puzzleArea.appendChild(label);
    puzzleArea.appendChild(instruction);
    puzzleArea.appendChild(grid);
    puzzleArea.appendChild(controls);
}


/* --------------------------------------------------------------------- */
/* GEO SCAN PUZZLE                                                        */
/* --------------------------------------------------------------------- */

function renderGeoPuzzle(puzzle) {

    const frame = document.createElement("div");
    frame.className = "geo-frame";

    const header = document.createElement("div");
    header.className = "geo-header";

    header.innerHTML = `
        <span class="geo-badge">STREET VIEW SUBSTITUTE // ${puzzle.scene.toUpperCase()}</span>
        <span>NO GPS DATA</span>
    `;

    const scene = document.createElement("div");
    
    const isImageFile = /\.(jpg|jpeg|png|gif|webp)$/i.test(puzzle.scene);
    if (isImageFile) {
        scene.innerHTML = `
            <div class="retro-image-container" style="width: 100%; height: 205px; border: 1px solid #333;">
                <img class="retro-image" src="${puzzle.scene}" alt="Geo Scan Scene" style="width: 100%; height: 100%; object-fit: contain; background: #000;">
            </div>
        `;
    } else {
        scene.innerHTML = geoSceneSvg(puzzle.scene);
    }

    const clueStrip = document.createElement("div");
    clueStrip.className = "clue-strip";

    puzzle.clues.forEach(clue => {
        const chip = document.createElement("span");
        chip.className = "clue-chip";
        chip.textContent = clue;
        clueStrip.appendChild(chip);
    });

    let inputOrGrid;
    if (puzzle.id === "geo-01" || !puzzle.answers || puzzle.answers.length === 0) {
        const container = document.createElement("div");
        container.style.marginTop = "10px";
        container.style.display = "flex";
        container.style.gap = "6px";
        
        const input = document.createElement("input");
        input.type = "text";
        input.placeholder = "Type the location/building name...";
        input.style.flex = "1";
        input.style.padding = "6px";
        input.style.border = "2px inset #fff";
        input.style.background = "#fff";
        input.style.color = "#000";
        
        const submitBtn = document.createElement("button");
        submitBtn.className = "retro-button";
        submitBtn.textContent = "VERIFY";
        
        const submitVal = () => {
            checkPuzzleAnswer(input.value);
        };
        submitBtn.addEventListener("click", submitVal);
        input.addEventListener("keydown", (e) => {
            if (e.key === "Enter") submitVal();
        });
        
        container.appendChild(input);
        container.appendChild(submitBtn);
        inputOrGrid = container;
        
        setTimeout(() => input.focus(), 50);
    } else {
        const choices = document.createElement("div");
        choices.className = "geo-choice-grid";
        
        puzzle.answers.forEach(answer => {
            const button = document.createElement("button");
            button.className = "retro-button";
            button.textContent = answer;
            
            button.addEventListener("click", () => {
                checkPuzzleAnswer(answer);
            });
            
            choices.appendChild(button);
        });
        inputOrGrid = choices;
    }

    const note = document.createElement("div");
    note.className = "geo-source-note";
    note.textContent =
        "Tip: Use road, utility, climate and architectural clues.";

    frame.appendChild(header);
    frame.appendChild(scene);
    frame.appendChild(clueStrip);
    frame.appendChild(inputOrGrid);
    frame.appendChild(note);

    puzzleArea.appendChild(frame);
}


/* --------------------------------------------------------------------- */
/* SIMON SAYS PUZZLE                                                      */
/* --------------------------------------------------------------------- */

let simonSequence = [];
let playerSequence = [];
let simonActive = false;
let simonLevel = 1;

function playSimonTone(color) {
    const freqs = {
        red: 330,
        green: 440,
        blue: 554,
        yellow: 660
    };
    const durations = [0.3, 0.2, 0.12];
    const duration = durations[simonLevel - 1] || 0.3;
    beep(freqs[color], duration, "sine", 0.04);
}

function renderSimonSaysPuzzle(puzzle) {
    simonLevel = 1;
    
    const instructions = document.createElement("p");
    instructions.className = "puzzle-instructions";
    instructions.textContent = puzzle.instruction;
    
    const simonGrid = document.createElement("div");
    simonGrid.className = "simon-grid";
    
    const colors = ["red", "green", "blue", "yellow"];
    const buttons = {};
    
    colors.forEach(color => {
        const btn = document.createElement("button");
        btn.className = `simon-btn simon-${color}`;
        btn.dataset.color = color;
        buttons[color] = btn;
        
        btn.addEventListener("click", () => {
            const levelTargets = [5, 8, 12];
            const currentTarget = levelTargets[simonLevel - 1];
            
            if (!simonActive || playerSequence.length >= simonSequence.length) return;
            
            btn.classList.add("lit");
            playSimonTone(color);
            const pressDurations = [150, 100, 70];
            const flashDuration = pressDurations[simonLevel - 1] || 150;
            setTimeout(() => btn.classList.remove("lit"), flashDuration);
            
            playerSequence.push(color);
            
            const currentStep = playerSequence.length - 1;
            if (playerSequence[currentStep] !== simonSequence[currentStep]) {
                simonActive = false;
                handleIncorrectAnswer();
                const statusText = document.getElementById("simon-status-text");
                if (statusText) statusText.textContent = "Sync failed! Resetting to Level 1...";
                simonLevel = 1;
                setTimeout(() => {
                    startSimonSays(puzzle, buttons);
                }, 1500);
                return;
            }
            
            if (playerSequence.length === simonSequence.length) {
                if (simonSequence.length >= currentTarget) {
                    simonActive = false;
                    const statusText = document.getElementById("simon-status-text");
                    if (simonLevel < 3) {
                        simonLevel++;
                        if (statusText) statusText.textContent = "Level complete! Watch next level...";
                        setTimeout(() => {
                            startSimonSays(puzzle, buttons);
                        }, 1500);
                    } else {
                        if (statusText) statusText.textContent = "Frequency synchronized!";
                        setTimeout(() => {
                            handleCorrectAnswer();
                        }, 600);
                    }
                } else {
                    simonActive = false;
                    const statusText = document.getElementById("simon-status-text");
                    if (statusText) statusText.textContent = "Good! Watch next...";
                    setTimeout(() => {
                        addNewSimonStep();
                        playSimonSequence(buttons);
                    }, 1000);
                }
            }
        });
        
        simonGrid.appendChild(btn);
    });
    
    const controls = document.createElement("div");
    controls.className = "captcha-controls";
    
    const statusText = document.createElement("span");
    statusText.id = "simon-status-text";
    statusText.className = "puzzle-note";
    statusText.textContent = "Click START to synchronize frequencies (3 Levels).";
    
    const startBtn = document.createElement("button");
    startBtn.className = "retro-button";
    startBtn.textContent = "START";
    
    startBtn.addEventListener("click", () => {
        startBtn.disabled = true;
        startBtn.style.opacity = "0.5";
        startSimonSays(puzzle, buttons);
    });
    
    controls.appendChild(statusText);
    controls.appendChild(startBtn);
    
    puzzleArea.appendChild(instructions);
    puzzleArea.appendChild(simonGrid);
    puzzleArea.appendChild(controls);
}

function startSimonSays(puzzle, buttons) {
    simonSequence = [];
    playerSequence = [];
    simonActive = false;
    
    const levelTargets = [5, 8, 12];
    const statusText = document.getElementById("simon-status-text");
    if (statusText) statusText.textContent = `Get ready for Level ${simonLevel}/3 (Target: ${levelTargets[simonLevel - 1]})...`;
    
    setTimeout(() => {
        addNewSimonStep();
        playSimonSequence(buttons);
    }, 1200);
}

function addNewSimonStep() {
    const colors = ["red", "green", "blue", "yellow"];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    simonSequence.push(randomColor);
    playerSequence = [];
}

function playSimonSequence(buttons) {
    simonActive = false;
    const statusText = document.getElementById("simon-status-text");
    if (statusText) statusText.textContent = `Level ${simonLevel}/3: Watch sequence...`;
    
    const stepDelays = [420, 260, 160];
    const litDurations = [200, 130, 80];
    
    const currentStepDelay = stepDelays[simonLevel - 1] || 420;
    const currentLitDuration = litDurations[simonLevel - 1] || 200;
    
    let delay = 300;
    simonSequence.forEach((color, index) => {
        setTimeout(() => {
            const btn = buttons[color];
            if (btn) {
                btn.classList.add("lit");
                playSimonTone(color);
                setTimeout(() => btn.classList.remove("lit"), currentLitDuration);
            }
            
            if (index === simonSequence.length - 1) {
                setTimeout(() => {
                    simonActive = true;
                    const levelTargets = [5, 8, 12];
                    if (statusText) {
                        statusText.textContent = `Level ${simonLevel}/3: Your turn! (${simonSequence.length}/${levelTargets[simonLevel - 1]})`;
                    }
                }, currentStepDelay - 100);
            }
        }, delay);
        delay += currentStepDelay;
    });
}


/* ===================================================================== */
/* ANSWER CHECKING                                                        */
/* ===================================================================== */

function checkPuzzleAnswer(playerAnswer) {

    const puzzle = puzzles[gameState.currentPuzzleIndex];

    const normalizedPlayerAnswer =
        String(playerAnswer).trim().toLowerCase();

    if (puzzle.id === "geo-01") {
        if (normalizedPlayerAnswer.includes("school")) {
            handleCorrectAnswer();
        } else {
            handleIncorrectAnswer();
        }
        return;
    }

    if (puzzle.id === "personal-02") {
        const correctGame = String(CONFIG.personalFavGame || "geometry dash").trim().toLowerCase();
        if (normalizedPlayerAnswer === correctGame || normalizedPlayerAnswer === "gd") {
            handleCorrectAnswer();
        } else {
            handleIncorrectAnswer();
        }
        return;
    }

    if (puzzle.id === "personal-03") {
        const correctPhase = String(CONFIG.personalPhase || "brainrot").trim().toLowerCase();
        if (normalizedPlayerAnswer.includes(correctPhase)) {
            handleCorrectAnswer();
        } else {
            handleIncorrectAnswer();
        }
        return;
    }

    if (puzzle.id === "geo-02") {
        if (normalizedPlayerAnswer.includes("coyote bowl")) {
            // Unlocked Coyote Bowl Surprise!
            
            // 1. Play retro chiptune fanfare
            try {
                const ctx = new (window.AudioContext || window.webkitAudioContext)();
                const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98];
                notes.forEach((freq, idx) => {
                    const time = ctx.currentTime + idx * 0.12;
                    const osc = ctx.createOscillator();
                    const subOsc = ctx.createOscillator();
                    const gainNode = ctx.createGain();
                    
                    osc.type = "sine";
                    subOsc.type = "triangle";
                    osc.frequency.setValueAtTime(freq, time);
                    subOsc.frequency.setValueAtTime(freq / 2, time);
                    
                    gainNode.gain.setValueAtTime(0, time);
                    gainNode.gain.linearRampToValueAtTime(0.12, time + 0.02);
                    gainNode.gain.exponentialRampToValueAtTime(0.0001, time + 0.35);
                    
                    osc.connect(gainNode);
                    subOsc.connect(gainNode);
                    gainNode.connect(ctx.destination);
                    
                    osc.start(time);
                    subOsc.start(time);
                    osc.stop(time + 0.35);
                    subOsc.stop(time + 0.35);
                });
                
                const chord = [261.63, 392.00, 523.25, 659.25];
                const chordTime = ctx.currentTime + notes.length * 0.12;
                chord.forEach(freq => {
                    const osc = ctx.createOscillator();
                    const subOsc = ctx.createOscillator();
                    const gainNode = ctx.createGain();
                    
                    osc.type = "triangle";
                    subOsc.type = "sine";
                    osc.frequency.setValueAtTime(freq, chordTime);
                    subOsc.frequency.setValueAtTime(freq * 2, chordTime);
                    
                    gainNode.gain.setValueAtTime(0, chordTime);
                    gainNode.gain.linearRampToValueAtTime(0.15, chordTime + 0.05);
                    gainNode.gain.exponentialRampToValueAtTime(0.0001, chordTime + 1.2);
                    
                    osc.connect(gainNode);
                    subOsc.connect(gainNode);
                    gainNode.connect(ctx.destination);
                    
                    osc.start(chordTime);
                    subOsc.start(chordTime);
                    osc.stop(chordTime + 1.2);
                    subOsc.stop(chordTime + 1.2);
                });
            } catch (e) {
                console.error(e);
            }
            
            // 2. Add file to virtual drive
            const filesInC = gameState.files["C:\\FRIEND_OS\\"];
            if (!filesInC.some(f => f.name === "COYOTE_SECRET.TXT")) {
                filesInC.push({
                    name: "COYOTE_SECRET.TXT",
                    type: "text",
                    content: `CONGRATULATIONS!\nYou successfully guessed the exact location: Coyote Bowl!\n\n:)`,
                    hidden: false,
                    locked: false
                });
                renderFileList();
                saveGameState();
            }
            
            // 3. Show retro alert popup window
            const dialog = document.createElement("div");
            dialog.className = "window active";
            dialog.style.display = "block";
            dialog.style.position = "fixed";
            dialog.style.left = "50%";
            dialog.style.top = "45%";
            dialog.style.transform = "translate(-50%, -50%)";
            dialog.style.width = "320px";
            dialog.style.zIndex = "9999";
            dialog.style.boxShadow = "2px 2px 12px rgba(0,0,0,0.5)";

            const titleBar = document.createElement("div");
            titleBar.className = "window-titlebar";
            titleBar.innerHTML = `
                <div class="window-title">Coyote Bowl Secret Unlocked</div>
                <div class="window-controls">
                    <button class="window-control" id="coyote-popup-close-x">×</button>
                </div>
            `;
            
            const body = document.createElement("div");
            body.className = "window-body";
            body.style.display = "flex";
            body.style.flexDirection = "column";
            body.style.alignItems = "center";
            body.style.gap = "14px";
            body.style.padding = "16px";

            const contentArea = document.createElement("div");
            contentArea.style.display = "flex";
            contentArea.style.alignItems = "center";
            contentArea.style.gap = "14px";
            
            const icon = document.createElement("div");
            icon.style.width = "34px";
            icon.style.height = "34px";
            icon.style.background = "#000080";
            icon.style.color = "#fff";
            icon.style.borderRadius = "50%";
            icon.style.display = "flex";
            icon.style.justifyContent = "center";
            icon.style.alignItems = "center";
            icon.style.fontSize = "22px";
            icon.style.fontWeight = "bold";
            icon.style.fontFamily = "monospace";
            icon.textContent = "!";
            
            const msg = document.createElement("div");
            msg.style.fontSize = "12px";
            msg.style.fontFamily = "monospace";
            msg.style.lineHeight = "1.4";
            msg.innerHTML = "<b>EASTER EGG DETECTED!</b><br>You found the exact location.<br><br>Check <b>C:\\FRIEND_OS\\COYOTE_SECRET.TXT</b> for your reward!";
            
            contentArea.appendChild(icon);
            contentArea.appendChild(msg);

            const okBtn = document.createElement("button");
            okBtn.className = "retro-button";
            okBtn.textContent = "OK";
            okBtn.style.minWidth = "80px";
            okBtn.style.padding = "4px 10px";
            
            body.appendChild(contentArea);
            body.appendChild(okBtn);
            
            dialog.appendChild(titleBar);
            dialog.appendChild(body);
            
            document.body.appendChild(dialog);
            
            const closePopup = () => {
                dialog.remove();
            };
            okBtn.addEventListener("click", closePopup);
            titleBar.querySelector("#coyote-popup-close-x").addEventListener("click", closePopup);
            
            handleCorrectAnswer();
        } else if (normalizedPlayerAnswer.includes("jones gulch") || normalizedPlayerAnswer.includes("outdoor ed")) {
            playSuccess();
            
            // Show big retro prompt popup window
            const dialog = document.createElement("div");
            dialog.className = "window active";
            dialog.style.display = "block";
            dialog.style.position = "fixed";
            dialog.style.left = "50%";
            dialog.style.top = "45%";
            dialog.style.transform = "translate(-50%, -50%)";
            dialog.style.width = "380px";
            dialog.style.zIndex = "9999";
            dialog.style.boxShadow = "2px 2px 14px rgba(0,0,0,0.5)";

            const titleBar = document.createElement("div");
            titleBar.className = "window-titlebar";
            titleBar.innerHTML = `
                <div class="window-title">Level Complete!</div>
                <div class="window-controls">
                    <button class="window-control" id="coyote-prompt-close-x">×</button>
                </div>
            `;
            
            const body = document.createElement("div");
            body.className = "window-body";
            body.style.display = "flex";
            body.style.flexDirection = "column";
            body.style.alignItems = "center";
            body.style.gap = "14px";
            body.style.padding = "18px";

            const contentArea = document.createElement("div");
            contentArea.style.display = "flex";
            contentArea.style.alignItems = "flex-start";
            contentArea.style.gap = "16px";
            
            const icon = document.createElement("div");
            icon.style.width = "40px";
            icon.style.height = "40px";
            icon.style.background = "#000080";
            icon.style.color = "#fff";
            icon.style.borderRadius = "50%";
            icon.style.display = "flex";
            icon.style.justifyContent = "center";
            icon.style.alignItems = "center";
            icon.style.fontSize = "26px";
            icon.style.fontWeight = "bold";
            icon.style.fontFamily = "monospace";
            icon.style.flexShrink = "0";
            icon.textContent = "?";
            
            const msg = document.createElement("div");
            msg.style.fontSize = "12px";
            msg.style.fontFamily = "monospace";
            msg.style.lineHeight = "1.4";
            msg.innerHTML = "<b>GEO SCAN SOLVED!</b><br><br>You successfully identified the area (Outdoor Ed).<br><br><b>Wait!</b> There is a hidden exact spot in this clearing. If you can guess the exact name, you will unlock a cool secret Easter Egg!<br><br>What would you like to do?";
            
            contentArea.appendChild(icon);
            contentArea.appendChild(msg);

            const btnContainer = document.createElement("div");
            btnContainer.style.display = "flex";
            btnContainer.style.gap = "12px";
            btnContainer.style.width = "100%";
            btnContainer.style.justifyContent = "flex-end";

            const tryBtn = document.createElement("button");
            tryBtn.className = "retro-button";
            tryBtn.textContent = "Try for Secret";
            tryBtn.style.padding = "4px 12px";
            
            const proceedBtn = document.createElement("button");
            proceedBtn.className = "retro-button";
            proceedBtn.textContent = "Proceed";
            proceedBtn.style.padding = "4px 12px";
            proceedBtn.style.fontWeight = "bold";
            
            btnContainer.appendChild(tryBtn);
            btnContainer.appendChild(proceedBtn);
            
            body.appendChild(contentArea);
            body.appendChild(btnContainer);
            
            dialog.appendChild(titleBar);
            dialog.appendChild(body);
            
            document.body.appendChild(dialog);
            
            const closePopup = () => {
                dialog.remove();
            };
            
            tryBtn.addEventListener("click", () => {
                closePopup();
                const input = puzzleArea.querySelector("input");
                if (input) {
                    input.value = "";
                    input.focus();
                }
            });
            
            proceedBtn.addEventListener("click", () => {
                closePopup();
                handleCorrectAnswer();
            });
            
            titleBar.querySelector("#coyote-prompt-close-x").addEventListener("click", closePopup);
        } else {
            handleIncorrectAnswer();
        }
        return;
    }

    const normalizedCorrectAnswer =
        String(puzzle.correctAnswer).trim().toLowerCase();

    if (normalizedPlayerAnswer === normalizedCorrectAnswer) {
        handleCorrectAnswer();
    } else {
        handleIncorrectAnswer();
    }
}


/* ===================================================================== */
/* PUZZLE SUCCESS                                                         */
/* ===================================================================== */

function handleCorrectAnswer() {

    const puzzle = puzzles[gameState.currentPuzzleIndex];

    verificationStatus.textContent =
        `STATUS: ${puzzle.successMessage || "ACCEPTED"}`;

    verificationFooterStatus.textContent = "Verified";

    puzzleHint.hidden = false;
    puzzleHint.textContent =
        `TEST COMPLETE // ${puzzle.id.toUpperCase()}`;

    gameState.discoveredAnswers.push(puzzle.correctAnswer || puzzle.id);

    const verificationWindow =
        document.getElementById("verification-window");

    verificationWindow.classList.remove("success-flash");
    void verificationWindow.offsetWidth;
    verificationWindow.classList.add("success-flash");

    playSuccess();

    gameState.currentPuzzleIndex++;

    updateSystemTestCounter();
    saveGameState();

    setTimeout(() => {

        if (gameState.currentPuzzleIndex >= puzzles.length) {
            finishPuzzleSequence();
        } else {
            renderCurrentPuzzle();
        }

    }, 550);
}


/* ===================================================================== */
/* PUZZLE FAILURE                                                         */
/* ===================================================================== */

function handleIncorrectAnswer() {
    verificationStatus.textContent =
        "STATUS: VERIFICATION FAILED";

    verificationFooterStatus.textContent = "Error";

    const verificationWindow =
        document.getElementById("verification-window");

    verificationWindow.classList.remove("error-shake");
    void verificationWindow.offsetWidth;
    verificationWindow.classList.add("error-shake");

    playError();

    // Trigger CAPTCHA lockout!
    gameState.inCaptchaMode = true;
    gameState.activeCaptchaIndex = Math.floor(Math.random() * captchas.length);
    logSystemMessage("VERIFY     Verification failed. Intruder warning active. Triggering lockout CAPTCHA.");
    saveGameState();

    setTimeout(() => {
        renderCurrentPuzzle();
    }, 1000);
}


/* ===================================================================== */
/* FINISHING THE PUZZLE CHAIN                                              */
/* ===================================================================== */

function finishPuzzleSequence() {
    gameState.allPuzzlesCompleted = true;

    systemAccess.textContent = "VERIFIED";
    systemTests.textContent = `${puzzles.length} / ${puzzles.length}`;

    verificationStatus.textContent = "STATUS: ALL TESTS COMPLETE";
    verificationProgress.textContent = "ACCESS 100%";
    verificationFooterStatus.textContent = "Verified";

    birthdayFile.classList.remove("locked-file");
    birthdayFile.querySelector(".file-name").textContent = "BIRTHDAY.DAT";
    birthdayFile.querySelector(".file-icon").className =
        "file-icon icon-paper small";

    birthdayFile.addEventListener("click", openFinalMessage, { once: true });

    secretFile.classList.remove("hidden-file");
    fileCount.textContent = `${gameState.files["C:\\FRIEND_OS\\"].length} objects`;

    puzzleArea.innerHTML = `
        <div style="text-align:center; padding:35px 15px;">
            <div class="eyebrow">VERIFICATION SERVICE</div>
            <h2 style="margin:8px 0;">ACCESS GRANTED</h2>
            <p>Identity verification completed successfully.</p>
            <p class="puzzle-note">
                A restricted file has been unlocked.
            </p>
            <button class="retro-button" id="open-birthday-now" style="margin-top:10px;">
                OPEN BIRTHDAY.DAT
            </button>
        </div>
    `;

    document.getElementById("open-birthday-now")
        .addEventListener("click", openFinalMessage);

    logSystemMessage("VERIFY     Verification chain complete");
    logSystemMessage("SECURITY   User promoted to VERIFIED");
    logSystemMessage("BIRTHDAY   BIRTHDAY.DAT unlocked");

    playSuccess();
    saveGameState();
}


/* ===================================================================== */
/* SYSTEM STATUS & LOGGING                                                */
/* ===================================================================== */

function updateSystemTestCounter() {
    systemTests.textContent =
        `${Math.min(gameState.currentPuzzleIndex, puzzles.length)} / ${puzzles.length}`;
}

function logSystemMessage(message) {
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    const logLine = `[${timeStr}] ${message}\n`;
    
    systemLog.textContent += logLine;
    systemLog.scrollTop = systemLog.scrollHeight;
    
    // Keep log file synced in state
    const files = gameState.files["C:\\FRIEND_OS\\"];
    const logFile = files.find(f => f.name === "SYSTEM.LOG");
    if (logFile) {
        logFile.content = systemLog.textContent;
    }
}


/* ===================================================================== */
/* FINAL MESSAGE                                                          */
/* ===================================================================== */

function openFinalMessage() {
    document.getElementById("friend-name").textContent =
        CONFIG.friendName;

    document.getElementById("sender-name").textContent =
        CONFIG.senderName;

    openWindow("final-window");
    playSuccess();
}


/* ===================================================================== */
/* FILE MANAGER                                                           */
/* ===================================================================== */

function getFileTypeLabel(type) {
    switch (type) {
        case "text": return "Text Document";
        case "log": return "Log File";
        case "app": return "Application";
        case "restricted": return "Restricted Data";
        default: return "Document";
    }
}

function renderFileList() {
    const listElement = document.getElementById("file-list");
    if (!listElement) return;

    listElement.innerHTML = "";
    let visibleCount = 0;

    const filesInC = gameState.files["C:\\FRIEND_OS\\"];

    filesInC.forEach(file => {
        if (file.hidden && !gameState.showHiddenFiles) {
            return;
        }

        visibleCount++;

        const button = document.createElement("button");
        button.className = "file-row";
        
        let iconClass = "icon-paper";
        if (file.type === "app") iconClass = "icon-disk";
        if (file.locked) iconClass = "icon-lock";

        if (file.locked && file.name === "BIRTHDAY.DAT" && gameState.allPuzzlesCompleted) {
            iconClass = "icon-paper";
        }

        if (file.hidden) {
            button.style.opacity = "0.55";
        }

        button.innerHTML = `
            <span class="file-icon ${iconClass} small"></span>
            <span class="file-name">${file.name}</span>
            <span class="file-type">${getFileTypeLabel(file.type)}</span>
        `;

        button.addEventListener("dblclick", () => {
            openFile(file);
        });

        let clickCount = 0;
        button.addEventListener("click", () => {
            clickCount++;
            focusFileRow(button);
            if (clickCount === 1) {
                setTimeout(() => {
                    if (clickCount >= 2) {
                        openFile(file);
                    }
                    clickCount = 0;
                }, 300);
            }
        });

        listElement.appendChild(button);
    });

    document.getElementById("file-count").textContent = `${visibleCount} objects`;
}

function focusFileRow(row) {
    document.querySelectorAll(".file-list .file-row").forEach(r => r.classList.remove("selected-row"));
    row.classList.add("selected-row");
}

function renderRecycleBin() {
    const listElement = document.getElementById("recycle-list");
    if (!listElement) return;

    listElement.innerHTML = "";
    const recycleFiles = gameState.files["RECYCLE_BIN:\\"];

    recycleFiles.forEach((file, index) => {
        const button = document.createElement("button");
        button.className = "file-row";
        button.innerHTML = `
            <span class="file-icon icon-paper small" style="opacity: 0.6;"></span>
            <span class="file-name">${file.name}</span>
            <span style="font-size: 9px; color: var(--muted); text-align: right; margin-left: auto;">[Click to Restore]</span>
        `;

        button.addEventListener("click", () => {
            if (confirm(`Would you like to restore ${file.name} to C:\\FRIEND_OS\\?`)) {
                restoreFile(index);
            }
        });

        listElement.appendChild(button);
    });

    document.getElementById("recycle-count").textContent = `${recycleFiles.length} objects`;
}

function restoreFile(index) {
    const file = gameState.files["RECYCLE_BIN:\\"][index];
    gameState.files["RECYCLE_BIN:\\"].splice(index, 1);
    gameState.files["C:\\FRIEND_OS\\"].push(file);

    logSystemMessage(`RESTORED file ${file.name} from Recycle Bin`);

    renderFileList();
    renderRecycleBin();

    playSuccess();
    saveGameState();
}

function openFile(file) {
    if (file.locked) {
        if (file.name === "BIRTHDAY.DAT") {
            if (gameState.allPuzzlesCompleted) {
                openFinalMessage();
            } else {
                alert("ACCESS DENIED: BIRTHDAY.DAT is locked by Security Protocol.");
                playError();
            }
            return;
        }

        if (file.password) {
            openPasswordPrompt(`Enter decryption password for ${file.name}:`, file.password, () => {
                file.locked = false;
                openFile(file);
                renderFileList();
                saveGameState();
            });
            return;
        }
    }

    if (file.type === "app") {
        openWindow("verification-window");
        renderCurrentPuzzle();
    } else if (file.type === "text" || file.type === "log") {
        const readmeTitle = document.querySelector("#readme-window .window-title");
        const readmeBody = document.querySelector("#readme-window .window-body pre");
        
        readmeTitle.innerHTML = `<span class="title-app-icon">TXT</span> ${file.name} - Notepad`;
        readmeBody.textContent = file.content;
        
        openWindow("readme-window");
    }
}


/* ===================================================================== */
/* DIALOG BOX EVENT LISTENERS                                            */
/* ===================================================================== */

let passwordSuccessCallback = null;
let currentCorrectPassword = "";

function openPasswordPrompt(promptText, correctPassword, onSuccess) {
    const dialog = document.getElementById("password-dialog");
    const promptEl = document.getElementById("password-dialog-prompt");
    const inputEl = document.getElementById("password-dialog-input");
    
    promptEl.textContent = promptText;
    inputEl.value = "";
    
    currentCorrectPassword = correctPassword;
    passwordSuccessCallback = onSuccess;
    
    dialog.style.display = "block";
    dialog.style.zIndex = ++gameState.nextWindowZ;
    dialog.classList.add("active");
    
    setTimeout(() => inputEl.focus(), 50);
}

document.getElementById("password-dialog-ok").addEventListener("click", submitPasswordPrompt);
document.getElementById("password-dialog-input").addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        submitPasswordPrompt();
    }
});

function submitPasswordPrompt() {
    const inputEl = document.getElementById("password-dialog-input");
    const dialog = document.getElementById("password-dialog");
    
    const entered = inputEl.value.trim();
    if (entered.toLowerCase() === currentCorrectPassword.toLowerCase()) {
        dialog.style.display = "none";
        dialog.classList.remove("active");
        playSuccess();
        if (passwordSuccessCallback) {
            passwordSuccessCallback();
        }
    } else {
        playError();
        alert("Incorrect password. Please try again.");
        inputEl.select();
        inputEl.focus();
    }
}

document.getElementById("password-dialog-cancel").addEventListener("click", closePasswordPrompt);
document.getElementById("password-dialog-close").addEventListener("click", closePasswordPrompt);

function closePasswordPrompt() {
    const dialog = document.getElementById("password-dialog");
    dialog.style.display = "none";
    dialog.classList.remove("active");
    playClick();
}

// Folder Options
const folderOptionsDialog = document.getElementById("folder-options-dialog");
const showHiddenCheckbox = document.getElementById("show-hidden-checkbox");

document.getElementById("menu-folder-options").addEventListener("click", () => {
    showHiddenCheckbox.checked = gameState.showHiddenFiles;
    folderOptionsDialog.style.display = "block";
    folderOptionsDialog.style.zIndex = ++gameState.nextWindowZ;
    folderOptionsDialog.classList.add("active");
    playClick();
});

document.getElementById("folder-options-ok").addEventListener("click", () => {
    gameState.showHiddenFiles = showHiddenCheckbox.checked;
    folderOptionsDialog.style.display = "none";
    folderOptionsDialog.classList.remove("active");
    playSuccess();
    
    renderFileList();
    saveGameState();
});

document.getElementById("folder-options-cancel").addEventListener("click", closeFolderOptions);
document.getElementById("folder-options-close").addEventListener("click", closeFolderOptions);

function closeFolderOptions() {
    folderOptionsDialog.style.display = "none";
    folderOptionsDialog.classList.remove("active");
    playClick();
}

// Empty Recycle Bin
document.getElementById("empty-recycle-btn").addEventListener("click", () => {
    if (gameState.files["RECYCLE_BIN:\\"].length === 0) {
        alert("Recycle Bin is already empty.");
        playClick();
        return;
    }

    const hasLockedFile = gameState.files["RECYCLE_BIN:\\"].some(file => file.name === "DELETED_KEY.TXT");
    if (hasLockedFile) {
        playError();
        alert("Error 0x80070005: Access Denied.\n\nThe file 'DELETED_KEY.TXT' is locked by another process (VERIFY.EXE) and cannot be permanently deleted.");
        return;
    }

    if (confirm("Are you sure you want to permanently delete all objects in the Recycle Bin?")) {
        gameState.files["RECYCLE_BIN:\\"] = [];
        renderRecycleBin();
        playClick();
        saveGameState();
    }
});


document.querySelectorAll("[data-open-window]").forEach(button => {
    button.addEventListener("click", () => {
        const windowId = button.dataset.openWindow;

        if (windowId === "verification-window") {
            renderCurrentPuzzle();
        }

        openWindow(windowId);
    });
});


document
    .querySelector("[data-open-readme]")
    .addEventListener("click", () => {
        const filesInC = gameState.files["C:\\FRIEND_OS\\"];
        const readme = filesInC.find(f => f.name === "README.TXT");
        if (readme) openFile(readme);
    });


document
    .querySelector("[data-open-logs]")
    .addEventListener("click", () => {
        const filesInC = gameState.files["C:\\FRIEND_OS\\"];
        const logFile = filesInC.find(f => f.name === "SYSTEM.LOG");
        if (logFile) openFile(logFile);
    });


/* ===================================================================== */
/* TERMINAL COMMAND ENGINE                                                */
/* ===================================================================== */

function writeTerminal(text) {
    terminalOutput.textContent += text;
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

function runTerminalCommand() {
    const rawInput = terminalInput.value.trim();
    terminalInput.value = "";

    if (rawInput === "") return;

    writeTerminal(`\n> ${rawInput}\n`);

    const args = rawInput.split(" ");
    const command = args[0].toLowerCase();

    let response = "";

    if (command === "help") {
        response =
            "Available commands:\n" +
            "  help            - Display this menu\n" +
            "  status          - Query system status & access\n" +
            "  ls [options]    - List files (use -a to show hidden files)\n" +
            "  cat <filename>  - Read the contents of a text file\n" +
            "  scan            - Run registry diagnostics scan\n" +
            "  restore <file>  - Restore file from Recycle Bin\n" +
            "  clear / cls     - Clear terminal screen\n" +
            "  reset           - Reboot and clear save state\n" +
            "  whoami          - Query logged user";
    } else if (command === "cls" || command === "clear") {
        terminalOutput.textContent = "";
        writeTerminal('FriendOS Terminal\nType "help" for available commands.\n');
        return;
    } else if (command === "whoami") {
        response = "UNKNOWN USER";
    } else if (command === "status") {
        response =
            `SYSTEM ACCESS : ${systemAccess.textContent}\n` +
            `VERIFIED TESTS: ${gameState.currentPuzzleIndex} / ${puzzles.length}`;
    } else if (command === "ls" || command === "dir") {
        const showAll = args.includes("-a") || args.includes("/a") || gameState.showHiddenFiles;
        const filesInC = gameState.files["C:\\FRIEND_OS\\"];
        
        const lines = [];
        filesInC.forEach(file => {
            if (file.hidden && !showAll) return;
            let label = file.name;
            if (file.hidden) label += " [HIDDEN]";
            if (file.locked && !(file.name === "BIRTHDAY.DAT" && gameState.allPuzzlesCompleted)) {
                label += " [LOCKED]";
            }
            lines.push(`  ${label.padEnd(20)} - ${getFileTypeLabel(file.type)}`);
        });
        response = lines.length ? lines.join("\n") : "No files found.";
    } else if (command === "cat" || command === "type") {
        if (args.length < 2) {
            response = "Usage: cat <filename>";
        } else {
            const fname = args.slice(1).join(" ").toUpperCase();
            const filesInC = gameState.files["C:\\FRIEND_OS\\"];
            const file = filesInC.find(f => f.name.toUpperCase() === fname);
            
            if (!file || (file.hidden && !gameState.showHiddenFiles)) {
                response = `File not found: ${fname}`;
            } else if (file.locked && !(file.name === "BIRTHDAY.DAT" && gameState.allPuzzlesCompleted)) {
                response = "ACCESS DENIED: File is password encrypted.";
            } else if (file.type === "app") {
                response = "VERIFY.EXE is a binary application. Type 'open verify' or double click to launch.";
            } else {
                response = file.content;
            }
        }
    } else if (command === "scan") {
        writeTerminal("Initializing registry scan...\n");
        let dots = "";
        const scanInterval = setInterval(() => {
            dots += ".";
            writeTerminal(".");
            if (dots.length >= 6) {
                clearInterval(scanInterval);
                
                const diagFile = gameState.files["C:\\FRIEND_OS\\"].find(f => f.name === "DIAGNOSTIC.LOG");
                if (diagFile) {
                    diagFile.hidden = false;
                }
                
                writeTerminal("\nSCAN COMPLETE.\nRegistry sector offsets read: 0x7E1.\nRegistry corruption details written to C:\\FRIEND_OS\\DIAGNOSTIC.LOG\n");
                renderFileList();
                saveGameState();
            }
        }, 150);
        return;
    } else if (command === "restore") {
        if (args.length < 2) {
            response = "Usage: restore <filename>";
        } else {
            const fname = args.slice(1).join(" ").toUpperCase();
            const recycleFiles = gameState.files["RECYCLE_BIN:\\"];
            const idx = recycleFiles.findIndex(f => f.name.toUpperCase() === fname);
            
            if (idx === -1) {
                response = `File not found in Recycle Bin: ${fname}`;
            } else {
                restoreFile(idx);
                response = `Successfully restored ${fname} to C:\\FRIEND_OS\\.`;
            }
        }
    } else if (command === "open") {
        if (args.length < 2) {
            response = "Usage: open <app | file>";
        } else {
            const target = args.slice(1).join(" ").toLowerCase();
            if (target === "verify" || target === "verify.exe") {
                openWindow("verification-window");
                renderCurrentPuzzle();
                response = "Launching VERIFY.EXE...";
            } else if (target === "files" || target === "explorer") {
                openWindow("files-window");
                response = "Opening C:\\FRIEND_OS\\...";
            } else {
                const filesInC = gameState.files["C:\\FRIEND_OS\\"];
                const file = filesInC.find(f => f.name.toLowerCase() === target);
                if (file) {
                    openFile(file);
                    response = `Opening ${file.name}...`;
                } else {
                    response = `Cannot open target: ${target}`;
                }
            }
        }
    } else if (command === "reset") {
        response = "Clearing save data and rebooting...";
        setTimeout(() => resetGameState(), 800);
    } else {
        response = `Command not found: ${command}. Type 'help' for options.`;
    }

    writeTerminal(`${response}\n`);
}

terminalInput.addEventListener("keydown", event => {
    if (event.key === "Enter") {
        runTerminalCommand();
    }
});


/* ===================================================================== */
/* CLOCK                                                                  */
/* ===================================================================== */

function updateClock() {
    const now = new Date();
    taskbarClock.textContent =
        now.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        });
}

setInterval(updateClock, 1000);
updateClock();


/* ===================================================================== */
/* SAVE STATE SYSTEM                                                      */
/* ===================================================================== */

function saveGameState() {
    const data = {
        currentPuzzleIndex: gameState.currentPuzzleIndex,
        discoveredAnswers: gameState.discoveredAnswers,
        allPuzzlesCompleted: gameState.allPuzzlesCompleted,
        files: gameState.files,
        showHiddenFiles: gameState.showHiddenFiles,
        bootComplete: gameState.bootComplete
    };
    localStorage.setItem("friend_os_save", JSON.stringify(data));
}

function loadGameState() {
    try {
        const saved = localStorage.getItem("friend_os_save");
        if (saved) {
            const data = JSON.parse(saved);
            gameState.currentPuzzleIndex = data.currentPuzzleIndex || 0;
            gameState.discoveredAnswers = data.discoveredAnswers || [];
            gameState.allPuzzlesCompleted = data.allPuzzlesCompleted || false;
            if (data.files) {
                gameState.files = data.files;
            }
            gameState.showHiddenFiles = data.showHiddenFiles || false;
            gameState.bootComplete = data.bootComplete || false;
            
            const checkbox = document.getElementById("show-hidden-checkbox");
            if (checkbox) {
                checkbox.checked = gameState.showHiddenFiles;
            }
            
            if (gameState.allPuzzlesCompleted) {
                systemAccess.textContent = "VERIFIED";
                birthdayFile.classList.remove("locked-file");
                birthdayFile.querySelector(".file-name").textContent = "BIRTHDAY.DAT";
                birthdayFile.querySelector(".file-icon").className = "file-icon icon-paper small";
                birthdayFile.addEventListener("click", openFinalMessage);
            }
            
            updateSystemTestCounter();
            return true;
        }
    } catch (e) {
        console.error("Failed to load game state", e);
    }
    return false;
}

function resetGameState() {
    localStorage.removeItem("friend_os_save");
    location.reload();
}


/* ===================================================================== */
/* SYSTEM BOOT AND RESTORE INITIALIZER                                    */
/* ===================================================================== */

function startFriendOS() {
    const hasSave = loadGameState();
    
    if (hasSave && gameState.bootComplete) {
        bootScreen.classList.add("hidden");
        desktop.classList.remove("hidden");
        initializeDesktop({ playChime: false });
    } else {
        startBootSequence();
    }
}

startFriendOS();
