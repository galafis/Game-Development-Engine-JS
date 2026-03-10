# Game Development Engine JS

2D game development engine built with JavaScript and HTML5 Canvas, featuring a physics engine with collision detection, sprite management, scene system, input handling, and a fixed-timestep game loop.

[English](#english) | [Portugues](#portugues)

---

## English

### Overview

A lightweight 2D game engine that provides the core systems needed for browser-based game development. Includes a physics engine with gravity, collision detection and resolution, a sprite system with animation support, scene management, keyboard and mouse input handling, and an FPS-capped game loop.

### Architecture

```mermaid
graph TB
    subgraph Engine Core
        A[GameEngine] --> B[Game Loop]
        B --> C[Update]
        B --> D[Render]
    end

    subgraph Physics
        E[PhysicsEngine] --> F[Gravity]
        E --> G[Collision Detection]
        E --> H[Collision Resolution]
        E --> I[PhysicsBody]
    end

    subgraph Rendering
        J[Scene Manager] --> K[Sprite]
        K --> L[Animation System]
        D --> J
    end

    subgraph Input
        M[InputManager] --> N[Keyboard]
        M --> O[Mouse]
    end

    subgraph Math
        P[Vector2D]
    end

    C --> E
    C --> J
    I --> P
    K --> I

    style Engine Core fill:#e1f5fe
    style Physics fill:#fce4ec
    style Rendering fill:#e8f5e9
    style Input fill:#fff3e0
    style Math fill:#f3e5f5
```

### Features

- Vector2D math library with operations (add, subtract, scale, normalize, dot product, distance)
- Physics engine with configurable gravity, mass, friction, and restitution
- AABB collision detection and resolution with impulse-based response
- Sprite rendering with animation frame support
- Scene management for organizing game objects
- Keyboard and mouse input tracking
- Fixed-timestep game loop with FPS counter
- Static and dynamic physics bodies

### Quick Start

```bash
git clone https://github.com/galafis/Game-Development-Engine-JS.git
cd Game-Development-Engine-JS
npm install
npm start
```

### Project Structure

```
Game-Development-Engine-JS/
├── main.js            # Engine core with all systems
├── tests/
│   └── main.test.js   # Test suite
├── package.json
└── README.md
```

### Tech Stack

| Technology | Purpose |
|------------|---------|
| JavaScript ES2024 | Engine implementation |
| HTML5 Canvas | 2D rendering |

### License

MIT License - see [LICENSE](LICENSE) for details.

### Author

**Gabriel Demetrios Lafis**
- GitHub: [@galafis](https://github.com/galafis)
- LinkedIn: [Gabriel Demetrios Lafis](https://linkedin.com/in/gabriel-demetrios-lafis)

---

## Portugues

### Visao Geral

Um motor de jogos 2D leve que fornece os sistemas centrais necessarios para desenvolvimento de jogos baseados em navegador. Inclui motor de fisica com gravidade, deteccao e resolucao de colisoes, sistema de sprites com suporte a animacao, gerenciamento de cenas, tratamento de entrada por teclado e mouse, e loop de jogo com FPS limitado.

### Arquitetura

```mermaid
graph TB
    subgraph Nucleo do Motor
        A[GameEngine] --> B[Loop do Jogo]
        B --> C[Atualizacao]
        B --> D[Renderizacao]
    end

    subgraph Fisica
        E[Motor de Fisica] --> F[Gravidade]
        E --> G[Deteccao de Colisao]
        E --> H[Resolucao de Colisao]
        E --> I[Corpo Fisico]
    end

    subgraph Renderizacao
        J[Gerenciador de Cenas] --> K[Sprite]
        K --> L[Sistema de Animacao]
        D --> J
    end

    subgraph Entrada
        M[Gerenciador de Entrada] --> N[Teclado]
        M --> O[Mouse]
    end

    C --> E
    C --> J
    I --> P[Vector2D]
    K --> I

    style Nucleo do Motor fill:#e1f5fe
    style Fisica fill:#fce4ec
    style Renderizacao fill:#e8f5e9
    style Entrada fill:#fff3e0
```

### Funcionalidades

- Biblioteca matematica Vector2D com operacoes (adicao, subtracao, escala, normalizacao, produto escalar, distancia)
- Motor de fisica com gravidade, massa, atrito e restituicao configuraveis
- Deteccao de colisao AABB e resolucao com resposta baseada em impulso
- Renderizacao de sprites com suporte a quadros de animacao
- Gerenciamento de cenas para organizar objetos do jogo
- Rastreamento de entrada por teclado e mouse
- Loop de jogo com timestep fixo e contador de FPS
- Corpos fisicos estaticos e dinamicos

### Inicio Rapido

```bash
git clone https://github.com/galafis/Game-Development-Engine-JS.git
cd Game-Development-Engine-JS
npm install
npm start
```

### Licenca

Licenca MIT - veja [LICENSE](LICENSE) para detalhes.

### Autor

**Gabriel Demetrios Lafis**
- GitHub: [@galafis](https://github.com/galafis)
- LinkedIn: [Gabriel Demetrios Lafis](https://linkedin.com/in/gabriel-demetrios-lafis)
