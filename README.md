# Human Origins

A four-module, self-paced executive short course on human evolution, from the first hominins to the peopling of Australia. Each module takes 20–30 minutes and includes case studies, Australian research highlights, reflection prompts and a knowledge check.

| Module | Topic | Span |
|---|---|---|
| 1 | Deep roots: from apes to the first hominins | 7–2 Ma |
| 2 | Genus *Homo*: tools, fire and the first journeys | 2.8 Ma – 50 ka |
| 3 | Our species and our relatives | 300–40 ka |
| 4 | Reaching Sahul: the peopling of Australia | 65 ka – present |

There is also an interactive hominin timeline and a sources page with references and a glossary.

Each module includes three interactive activities, spaced every two to three sections, in addition to the end-of-module knowledge check:

| Module | Flip cards | Hotspot | Drag and drop |
|---|---|---|---|
| 1 | Myth or fact? | Built for walking (skeleton) | Match dating methods to situations |
| 2 | Island hominins at a glance | Across the Wallace Line (map) | Put early *Homo* in order |
| 3 | Key sites for our species | How a painting gets a minimum age | Sort: Neanderthal, Denisovan or both? |
| 4 | Fact, model or inference? | Reading the Madjedbebe section | Match principles to practice |

## Module 1 game: Ages of Evolution

`site/evolve.html` is an original top-down RPG linked from the end of Module 1. Players cross six eras (about 8 to 2 million years ago), collect an Age Stone in each, and answer its question to evolve: last common ancestor → *Sahelanthropus* → *Ardipithecus* → *Au. afarensis* → *Au. africanus* → *Homo habilis* → *Homo erectus*. Stone tools unlock boulders. A fork at 2.4 million years ago lets players try the *Paranthropus* side branch, which reaches a dead end and lets them rewind. It runs by keyboard or on-screen controls, and completion is saved with course progress.

## References

Each module ends with a Harvard-style reference list. In-text citations link to the full reference. `site/resources.html` holds the combined list.

## Videos

Each module has one video slot (`figure.video`). A slot stays hidden until its `data-youtube` attribute holds a YouTube URL or ID. Videos load only when clicked, through youtube-nocookie.com with captions on.

| Slot | Module | Topic |
|---|---|---|
| `video-m1` | 1 | Lucy and the first upright walkers |
| `video-m2` | 2 | The discovery of *Homo floresiensis* |
| `video-m3` | 3 | Dating the world's oldest cave art in Sulawesi |
| `video-m4` | 4 | Lake Mungo and the return of Mungo Man |

## Accessibility

The site targets WCAG 2.2 AA in light and dark mode:

- All text meets 4.5:1 contrast; control borders, focus rings, chart marks and hotspot pins meet 3:1.
- Every activity works by keyboard and touch. Drag and drop also supports select-then-place, so no dragging is required (SC 2.5.7).
- Right and wrong answers are marked with text and symbols as well as colour.
- Animations respect `prefers-reduced-motion`.
- Pages were checked with axe-core (WCAG 2.0/2.1/2.2 A and AA rules) with no violations.

## Structure

```
site/                 Static site published to GitHub Pages
  index.html          Course overview and progress
  module-1..4.html    Modules
  timeline.html       Interactive timeline
  resources.html      References, glossary, further study
  evolve.html         Module 1 game
  assets/             styles.css, app.js (progress, quizzes), activities.js, timeline.js, evolve.js, videos.js
.github/workflows/pages.yml   Deploys site/ to GitHub Pages
```

No build step. Open `site/index.html` in a browser to preview locally.

Learner progress, quiz scores and reflection notes are stored in the browser's localStorage only. Nothing is sent to a server.

## Publishing

1. In the repository on GitHub, go to **Settings → Pages** and set **Source** to **GitHub Actions**.
2. Push to `main` (or the development branch listed in the workflow), or run the workflow manually from the **Actions** tab.
3. The site will be published at `https://<owner>.github.io/<repo>/`.

If the `github-pages` environment has branch protection rules, allow the branch you deploy from.

## Content notes

- Dates are approximate and rounded from the peer-reviewed sources listed in `site/resources.html`. Content is current to November 2026.
- The course includes an Acknowledgement of Country and a notice that deceased people are named. No images of human remains are used.
