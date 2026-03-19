# Architecture Documentation

## Web App Structure
This web application is built using **React** and **Vite**. Vite is a build tool that significantly improves the development experience with fast hot module replacement, and a highly optimized build output. The following is an overview of the app structure:

- **src/**: Contains the source code of the application.
  - **components/**: Reusable components that make up the UI of the application.
  - **pages/**: Different pages of the application, each corresponding to a specific route.
  - **hooks/**: Custom React hooks for shared functionality across components.
  - **styles/**: Global and component-specific styles using CSS modules.
  - **utils/**: Utility functions and constants.

## Removal of React Native
React Native was removed from this project due to several reasons:
- **Increased Complexity**: Managing two separate codebases (one for web and one for mobile) led to increased complexity in development and maintenance.
- **Resource Allocation**: Focusing on a single platform allows for better resource allocation and improved user experience on the web app, which is our primary target.
- **Performance Concerns**: The original implementation with React Native did not deliver the performance that was expected, leading to a decision to pivot back to a web-focused architecture.

## Technical Decisions
1. **Why React?**: We chose React for its component-based architecture, which promotes reusability and easier integration of new features.
2. **Why Vite?**: Vite was chosen for its speed and modern features, which enhance developer productivity during the development process.
3. **State Management**: We utilize React's Context API for state management, which allows us to manage global state effectively without the overhead of additional libraries like Redux.
4. **Styling Approach**: CSS modules promote scoped styles, reducing class name collisions and improving styling management.

This document aims to provide a comprehensive overview of the technical choices and architecture of the application to guide future development efforts.