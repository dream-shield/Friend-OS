# FRIEND_OS — Polished Prototype

A birthday puzzle experience disguised as a late-90s/early-2000s computer.

## What changed from the first prototype?

The original prototype was mostly a code skeleton. This version focuses on
the actual experience:

- Fake BIOS/boot sequence
- CRT scanlines and subtle screen noise
- More convincing old-computer window chrome
- Taskbar and Start menu
- Desktop system-status widget
- Custom pixel-ish icons built entirely with CSS
- Better file manager
- Terminal with useful commands
- System log
- Recycle Bin
- Better verification UI
- Puzzle feedback animations and synthesized UI sounds
- Locked/unlocked `BIRTHDAY.DAT`
- Cleaner final reveal
- Responsive fallback for smaller screens

## Run it

Open `index.html` in a modern browser.

No Node.js, npm, Python server, or external dependencies are required.

## Where to customize it

### 1. Friend's name

At the top of `script.js`:

```js
const CONFIG = {
    friendName: "[NAME]",
    senderName: "[YOUR NAME]"
};
```

### 2. Real puzzles

The birthday-specific content belongs in:

```js
const puzzles = [
    ...
];
```

The OS code is intentionally separate from the puzzle content.

### 3. Future puzzle types

The current prototype supports:

- `multiple-choice`
- `riddle`
- `observation`

The next useful puzzle types to add are:

- visual selection
- memory
- sequence
- drag and drop
- timed
- image-based
- physical clue
- multi-step puzzle
- answer that unlocks another file

## Design philosophy

The interface should feel slightly ugly in an intentional way.

The goal is not "modern retro UI." The goal is "I somehow found an old
computer program that somebody built specifically for me."

Avoid overdoing:
- neon
- modern glassmorphism
- giant animations
- excessive birthday graphics
- sentimental paragraphs

The puzzles and exploration should carry the experience.

## Suggested progression

1. Boot
2. Desktop
3. Explore files / terminal
4. Verification begins
5. Easy puzzle
6. More unusual puzzle
7. Personal puzzle
8. Physical clue
9. Hidden file
10. Final unlock
11. Minimal birthday message

The prototype intentionally stops before the personalized puzzle layer.


## New in this version

### CAPTCHA interruptions

CAPTCHAs now appear intermittently rather than replacing every puzzle.
They use original, simple SVG illustrations instead of copying real
CAPTCHA imagery.

Current examples:
- Select traffic lights
- Select bicycles

### Geo Scan puzzles

`type: "geo"` creates a GeoGuessr-style location challenge.

The current prototype uses original low-resolution scenes with clues such as:
- road side
- utility wires
- roadside markers
- terrain
- architecture
- road markings

This is deliberately a "reason from clues" experience rather than
a trivia question like "what landmark is this?"

To add a new Geo Scan puzzle, add an object to the `puzzles` array and
provide:
- `scene`
- `clues`
- `answers`
- `correctAnswer`

The scene renderer currently supports:
- `japan-suburb`
- `iceland-road`

More scene templates can be added later.
