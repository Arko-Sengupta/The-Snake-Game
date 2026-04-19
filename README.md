# The Snake Game

A 3D Snake Game Built With Three.js, Featuring A Cyberpunk Neon Aesthetic, Post-Processing Bloom Effects, Particle Systems, And Web Audio API Sound Synthesis.

---

## Project Overview

The Classic Snake Game Reimagined In 3D Using Three.js. The Player Controls A Snake On A 20×20 Grid Rendered In A Perspective 3D View. Eating Food Grows The Snake, Increases The Score, And Raises The Game Speed As Levels Progress. Colliding With A Wall Or The Snake's Own Body Ends The Game.

The Project Is Structured As A Modular ES Module Application With No Build Tools Or Bundlers — It Runs Directly In The Browser Via A Native Importmap.

---

## Dependencies

| Package | Version | Loaded Via |
|---|---|---|
| Three.js | `0.160.0` | JsDelivr CDN |
| Three.js Addons (EffectComposer, RenderPass, UnrealBloomPass, OutputPass) | `0.160.0` | JsDelivr CDN |

No Npm Packages. No Build Step Required.

---

## Directory Structure

```
The-Snake-Game/
├── index.html
├── Styles/
│   └── Main.css
└── Scripts/
    ├── Constants.js
    ├── Utils.js
    ├── Main.js
    ├── Scene/
    │   ├── Camera.js
    │   ├── Renderer.js
    │   ├── Lighting.js
    │   └── Board.js
    ├── Visuals/
    │   ├── SnakeVisuals.js
    │   ├── FoodVisuals.js
    │   └── Particles.js
    ├── Audio/
    │   └── Audio.js
    ├── Hud/
    │   └── Hud.js
    └── Game/
        ├── State.js
        ├── Logic.js
        └── Input.js
```

---

## About The Game

### Controls

| Key | Action |
|---|---|
| `Arrow Keys` / `WASD` | Move The Snake |
| `Space` | Pause / Resume |

### Gameplay

- The Snake Moves On A **20×20 Grid**
- Eating Food Grows The Snake And Adds Points
- Every **5 Foods** Eaten Advances The Game To The Next Level
- Each Level Increases The Snake's Movement Speed
- The Game Ends When The Snake Hits A Wall Or Itself
- High Score Is Saved Automatically In The Browser's Local Storage

### Scoring

```
Points Per Food = 10 × Combo Multiplier × Current Level
```

- Eating Food Within **3 Seconds** Of The Previous Eat Increases The Combo Multiplier
- Combo Multiplier Caps At **×8**

### Levels & Speed

| Level | Speed (Tick Interval) |
|---|---|
| 1 | 180ms |
| 2 | 170ms |
| 3 | 160ms |
| ... | ... |
| 11+ | 80ms (Minimum) |

### Visual Features

- Perspective 3D Camera With Isometric Tilt
- Neon Cyberpunk Aesthetic With Dark Grid Board
- Snake Rendered As Gradient 3D Segments (Cyan → Teal) With Animated Eyes
- Food Rendered As A Rotating Icosahedron With Orbiting Particles
- UnrealBloom Post-Processing For Subtle Glow
- Particle Burst Effect On Food Collection
- Camera Shake And Segment Bounce Animation On Death
- Orbiting Camera On The Start Screen

### Audio

All Sounds Are Generated Programmatically Via The **Web Audio API** — No Audio Files Required.

| Event | Sound |
|---|---|
| Move | Soft Square Wave Tick |
| Eat | Two-Tone Sine Chime |
| Combo | Pitch-Scaled Tone |
| Level Up | Ascending C4–E4–G4–C5 Arpeggio |
| Death | Descending Sawtooth Sweep |

---

## Running The Game

Open `index.html` Directly In Any Modern Browser That Supports **WebGL** And **ES Modules**.

> Chrome, Edge, And Firefox Are Recommended. Safari Is Supported On Recent Versions.