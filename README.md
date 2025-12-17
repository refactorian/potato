
# Potato: UI Prototyping Tool

Potato is a modular and scalable web application designed for creating high-fidelity UI prototypes and wireframes directly in the browser. Inspired by industry-standard tools like Proto.io, it empowers designers and developers to build, organize, and export interface mockups using a flexible drag-and-drop canvas, a rich component library, and interactive features.

[Hosted On Vercel](https://potato-refactorian.vercel.app/)

## Features

*   **Drag-and-Drop Canvas:** An intuitive, grid-snapping workspace for placing and arranging UI elements with precision.
*   **Comprehensive Component Library:** Access a wide range of pre-built UI components including buttons, forms, navigation bars, cards, and typography.
*   **Wireframing & Templates:** Kickstart your design process with dedicated wireframe modes and ready-to-use screen templates (Authentication, Dashboards, E-commerce).
*   **Interactive Prototyping:** Define user interactions (e.g., clicks) to navigate between screens or trigger alerts, creating a clickable prototype.
*   **Project Management:** robust management of screens, layer groups, and assets. Organize your prototype with nested groups and multi-selection support.
*   **Export Capabilities:** Export your designs as high-quality images (PNG, JPEG, SVG) or download the entire project structure as a JSON bundle or ZIP file.
*   **Responsive Design Tools:** Configure custom viewports for Mobile, Tablet, and Desktop resolutions.
*   **Asset Manager:** Upload, crop, and manage custom images and icons for your projects.
*   **Theme Support:** Built-in Light and Dark mode to suit your working preference.

## Technology Stack

This project is built using modern web technologies to ensure performance and scalability:

*   **Frontend:** [React.js](https://react.dev/) (v18+) with [TypeScript](https://www.typescriptlang.org/)
*   **Build Tool:** [Vite](https://vitejs.dev/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **Icons:** [Lucide React](https://lucide.dev/)
*   **Utilities:**
    *   `uuid` for unique ID generation.
    *   `html-to-image` for canvas rendering and export.
    *   `jszip` & `file-saver` for project bundling.
    *   `react-image-crop` for asset manipulation.

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

*   Node.js (v16 or higher recommended)
*   npm or yarn

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/your-username/potato-ui.git
    ```
2.  Navigate to the project directory:
    ```bash
    cd potato-ui
    ```
3.  Install dependencies:
    ```bash
    npm install
    # or
    yarn install
    ```

### Running the Application

To start the local development server:

```bash
npm run dev
# or
yarn dev
```

Open your browser and navigate to `http://localhost:5173` (or the port specified in your terminal).

## Usage Guide

1.  **Creating a Project:** Click the "+" button in the toolbar to start a blank project or choose from existing templates.
2.  **Adding Elements:** Use the Right Sidebar to drag components, wireframes, or assets onto the canvas.
3.  **Editing Properties:** Select any element on the canvas to modify its style, layout, icons, and text content using the "Properties" panel.
4.  **Managing Screens & Layers:** Use the Left Sidebar to add new screens, group layers, and manage visibility/locking.
5.  **Interactions:** In the Properties panel, switch to the "Interactions" tab to link buttons to other screens.
6.  **Preview:** Click the "Preview" button in the top toolbar to switch to a playable mode where interactions are active.
7.  **Export:** Go to the Project tab in the Left Sidebar to export your work.

## Contributing

We welcome contributions to make Potato better! Whether it's reporting a bug, discussing a new feature, or writing a fix.

### Workflow

1.  **Fork the Repository:** Create your own fork of the project on GitHub.
2.  **Create a Branch:** `git checkout -b feature/AmazingFeature`
3.  **Commit Changes:** `git commit -m 'Add some AmazingFeature'`
4.  **Push to Branch:** `git push origin feature/AmazingFeature`
5.  **Open a Pull Request:** Submit a PR to the `main` branch with a clear description of your changes.

### Reporting Bugs & Issues

If you encounter any issues, please report them via the [GitHub Issues](https://github.com/your-username/potato-ui/issues) page.
*   **Search Existing Issues:** Check if the issue has already been reported.
*   **Detailed Description:** Provide a clear description of the bug.
*   **Reproduction Steps:** Include steps to reproduce the issue.
*   **Environment:** Mention your browser and OS version.

### Discussions

For general questions, feature requests, or community interactions, please use [GitHub Discussions](https://github.com/your-username/potato-ui/discussions).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
