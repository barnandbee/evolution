# Human Origins

A four-module, self-paced executive short course on human evolution, from the first hominins to the peopling of Australia. Each module takes 20–30 minutes and includes case studies, Australian research highlights, reflection prompts and a knowledge check.

| Module | Topic | Span |
|---|---|---|
| 1 | Deep roots: from apes to the first hominins | 7–2 Ma |
| 2 | Genus *Homo*: tools, fire and the first journeys | 2.8 Ma – 50 ka |
| 3 | Our species and our relatives | 300–40 ka |
| 4 | Reaching Sahul: the peopling of Australia | 65 ka – present |

There is also an interactive hominin timeline and a sources page with references and a glossary.

## Structure

```
site/                 Static site published to GitHub Pages
  index.html          Course overview and progress
  module-1..4.html    Modules
  timeline.html       Interactive timeline
  resources.html      References, glossary, further study
  assets/             styles.css, app.js (progress, quizzes), timeline.js
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
