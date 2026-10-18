
# Diego Aimar Longo — Portfolio

Personal portfolio showcasing my work and experience in software and game development. The site is built with vanilla HTML, CSS, and JavaScript, with a retro-inspired visual style and interactive elements.

## Features

- Responsive portfolio layout
- Interactive hero section with particle and meteor effects
- Project carousel with technology tags and project links
- Skills, education, and contact sections
- Custom pointer, scroll progress indicator, sound effects, and achievement interactions
- Reduced-motion support

## Projects

| Project | Description | Technologies |
| --- | --- | --- |
| GamePoint Development | Internship work prototyping existing web games for mobile. Some projects are covered by NDA. | Unity, C# |
| [Trail of Bones](https://github.com/Francofrt1/TrailOfBones) | Collaborative game project focused on gameplay systems, power-ups, player statistics, and enemy spawning. | Unity, C# |
| [Orbital Arousal](https://github.com/IbarraCM/PixiGame) | Collaborative 2D browser game with game logic and interactive mechanics. | JavaScript, PixiJS |
| [Mate e' Mitos](https://docs.google.com/presentation/d/1PeiUUiklXxxD8Gd1XXI48hnqu4Uy5K3jPWtmIvRKBaQ/edit?usp=sharing) | Collaborative MMORPG concept inspired by Argentine folklore. | Game design, concept development |
| Save The EGG | Freelance 2D game featuring interactive mechanics and retro-inspired visuals. | Construct 2 |

## Run locally

The site uses JavaScript modules, so serve it over HTTP instead of opening `index.html` directly with a `file://` URL.

1. Clone this repository and open its folder in a terminal.
2. Start a local server:

   ```bash
   python -m http.server 8000
   ```

3. Visit [http://localhost:8000](http://localhost:8000) in your browser.

No build step or package installation is required.

## Project structure

```text
.
├── assets/
│   ├── audio/       # Music and sound effects
│   └── images/
│       ├── contact/
│       ├── lenguaje/
│       ├── profile/
│       ├── projects/
│       ├── skills/
│       └── sprites/
├── classes/
│   ├── controllers/ # UI input, feature coordination, and app composition
│   ├── core/        # Shared infrastructure (event bus)
│   ├── models/      # Portfolio and game state/business rules
│   ├── services/    # Browser capabilities and external effects (audio)
│   └── views/       # DOM rendering for application and game state
├── styles/
│   ├── about.css, projects.css, skills.css, timeline.css, contact.css
│   ├── achievements.css, audio-controls.css, carousel.css, particles.css
│   ├── base.css, layout.css, hero.css, components.css
│   ├── pointer.css, progress.css, utilities.css
│   ├── architecture.css, responsive.css, states.css, tokens.css
├── index.html       # Semantic structure and static portfolio content
├── main.js          # Application bootstrap
└── styles.css       # Ordered stylesheet entry point
```

## Architecture

The interactive application uses MVC: models own state and game rules, views
render model updates to the DOM, and controllers handle browser input and
coordinate features. `PortfolioController` is the composition root; feature
controllers receive their collaborators (for example, the shared event bus and
audio service) rather than creating global dependencies. `AudioManager` keeps
audio playback separate from the controls that operate it.

MVP is not layered on top of MVC here: the portfolio is a small browser app with
no separate presentation workflow that benefits from an additional presenter.
Use MVP only if a future feature needs that distinct interaction contract.

CSS is split by responsibility and imported in order from `styles.css`. Keep
shared design tokens and global rules in their existing shared files, feature
rules alongside their section or interaction, and cross-feature viewport
overrides in `styles/responsive.css`. Keep component-specific breakpoints with
that component's stylesheet. This keeps the current cascade explicit while
avoiding a build-tool dependency.

When adding an interactive feature, keep its state/rules out of DOM code, render
changes through a view, route browser events through a controller, and add
styles to the matching feature stylesheet. Add tests for model rules without
requiring a browser where possible.

## Contact

- Email: [longodiegoaimar@gmail.com](mailto:longodiegoaimar@gmail.com)
- Location: Rosario, Santa Fe, Argentina

## License

No license has been specified for this repository.
