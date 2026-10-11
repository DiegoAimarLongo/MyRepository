
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
├── assets/          # Portfolio and project images
├── classes/         # JavaScript systems and application controller
│   └── core/         # Event bus, model, view, and controller
├── styles/          # Architecture, responsive, and state styles
├── index.html        # Page structure and portfolio content
├── main.js           # Application entry point
└── styles.css        # Main styles
```

## Contact

- Email: [longodiegoaimar@gmail.com](mailto:longodiegoaimar@gmail.com)
- Location: Rosario, Santa Fe, Argentina

## License

No license has been specified for this repository.
