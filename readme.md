# Pynity Editor

Pynity Editor is a 3D editor application built using Electron and Three.js. The editor allows users to create and manipulate 3D objects in a scene with an intuitive user interface.

## Features

- **Camera Management**: Easily control the camera's position and perspective.
- **Object Controls**: Add, move, and manipulate 3D objects (cubes and spheres) within the scene.
- **Level Management**: Load and save levels, preserving the current state of the scene.
- **Responsive Design**: The editor's layout adjusts to fit different screen sizes, ensuring a seamless user experience.
- **Physics Integration**: Basic physics simulation using the CANNON.js library.

## Getting Started
(to run the editor gui run the following from the PynityEditor dir in powershell)
npx electron .


### Prerequisites

Ensure you have the following installed on your system:

- Node.js
- npm (Node Package Manager)

### Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/pynity-editor.git
    ```

2. Navigate to the project directory:
    ```bash
    cd pynity-editor
    ```

3. Install the dependencies:
    ```bash
    npm install
    ```

### Running the Application
```bash
To start the application, run:

npm start

# Directory Structure
pynity-editor/
├── assets/
├── build/
├── dist/
├── node_modules/
├── static/
│   ├── css/
│   │   └── styles.css
│   ├── js/
│   │   ├── editor_combined_manager.js
│   │   ├── player_physics.js
│   │   ├── three.min.js
│   │   └── other js files...
├── editor_index.html
├── main.js
├── package.json
└── README.md


## File Overview

- **assets/**: Contains static assets for the editor.
- **build/**: Build directory for the application.
- **dist/**: Distribution directory for packaged builds.
- **node_modules/**: Directory containing Node.js modules.
- **static/**: Contains static files like CSS and JavaScript.
  - **css/styles.css**: Stylesheet for the application.
  - **js/editor_combined_manager.js**: Main JavaScript file combining camera, controls, and levels management.
  - **js/player_physics.js**: Physics module for player movement.
  - **js/three.min.js**: Three.js library.
- **editor_index.html**: Main HTML file for the editor.
- **main.js**: Main process file for Electron.
- **package.json**: Project configuration and dependencies.
- **README.md**: This file.

## Usage

### Camera Controls

- **W/A/S/D**: Move the camera forward, left, backward, and right.
- **Mouse Drag**: Rotate the camera around the scene.
- **Q/E**: Rotate the camera left and right.

### Adding Objects

- **Add Cube**: Adds a cube to the scene.
- **Add Sphere**: Adds a sphere to the scene.

### Saving and Loading Levels

- **Save**: Saves the current state of the scene to a file.
- **Load**: Loads a previously saved scene from a file.


