# Pynity

Pynity is a powerful 3D editor built using Electron and Three.js. It provides a comprehensive environment for creating and managing 3D scenes, objects, and their properties. The Pynity Editor offers a user-friendly interface and a set of tools to manipulate 3D objects with ease.

## Features

- **3D Scene Management**: Create, load, and save 3D scenes.
- **Object Manipulation**: Add, move, rotate, and scale 3D objects.
- **Grid Toggling**: Display a grid to assist with object alignment.
- **Edit Mode**: Switch between different editing modes.
- **Details Panel**: View and edit the properties of selected objects.

## Directory Structure

```
D:\PYNITY\PYNITY
├───.idea
│   └───inspectionProfiles
├───.venv
│   ├───Lib
│   │   └───site-packages
│   ├───Scripts
├───build
│   └───PynityEditor
├───dist
├───levels
├───PynityEditor
│   ├───assets
│   ├───build
│   │   └───PynityEditor
│   │       └───localpycs
│   ├───dist
│   ├───levels
│   ├───node_modules
│   └───static
│       ├───css
│       └───js
├───static
│   ├───css
│   └───js
└───templates
```

## Running the Pynity Editor

To run the Pynity Editor, follow these steps:

1. **Ensure you have Node.js installed**: The Pynity Editor relies on Node.js and npm. You can download and install Node.js from [nodejs.org](https://nodejs.org/).

2. **Navigate to the PynityEditor directory**: Open PowerShell and navigate to the PynityEditor directory.

   \```
   cd D:\PYNITY\PYNITY\PynityEditor
   \```

3. **Install dependencies**: Run the following command to install the necessary dependencies.

   \```
   npm install
   \```

4. **Run the editor**: Use npx to run the Electron application.

   \```
   npx electron .
   \```

## Project Structure

### PynityEditor Directory

- **assets**: Contains assets used in the editor.
- **build**: Directory for build artifacts.
- **dist**: Distribution directory for packaged application.
- **levels**: Directory to store level data (scenes).
- **node_modules**: Contains Node.js modules.
- **static**: Static files such as CSS and JavaScript.

### Static Directory

- **css**: Stylesheets for the editor.
- **js**: JavaScript files for the editor functionality.

## Editor Usage

### Toolbar

The toolbar at the top provides buttons for various actions:

- **Save**: Save the current scene.
- **Load**: Load a scene.
- **Add Cube**: Add a cube to the scene.
- **Add Sphere**: Add a sphere to the scene.
- **Toggle Edit Mode**: Switch between edit and view modes.
- **Toggle Grid**: Show or hide the grid.

### Sidebar

The sidebar on the left displays the list of available assets such as cubes and spheres.

### Details Panel

The details panel on the right shows the properties of the selected object. You can view and edit the position, rotation, and scale of the object.

### Canvas

The main canvas in the center is where the 3D scene is rendered. You can interact with the objects in the scene using the mouse and keyboard.

### Controls

- **WASD**: Move the camera.
- **Mouse Drag**: Rotate the camera.
- **Ctrl + Click**: Select and manipulate objects.

## Development

The Pynity Editor is built using modern JavaScript technologies such as Electron and Three.js. Contributions to the project are welcome. To get started with development, clone the repository and follow the instructions above to run the editor.

## License

Pynity is released under the MIT License.

For more information, visit the [official website](https://example.com).

\```
