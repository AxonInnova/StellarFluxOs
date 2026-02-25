# Contributing to StellarFlux OS

Thank you for your interest in contributing to StellarFlux OS! We welcome contributions from the community.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/StellarFluxOs.git
   cd StellarFluxOs
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Workflow

### Running the Dev Server

```bash
npm run dev
```

The app will be available at http://localhost:5173

### Building for Production

```bash
npm run build
npm run preview
```

### Linting

```bash
npm run lint
```

## Code Standards

### JavaScript/React

- Use functional components with hooks
- Follow the existing code style (ESLint configuration provided)
- Use meaningful variable and function names
- Add comments for complex logic

### Styling

- Use Tailwind CSS utility classes for styling
- Follow the existing color scheme (see `tailwind.config.cjs`)
- Use CSS variables defined in `src/index.css` for theme colors
- Maintain responsive design principles

### Components

- Keep components modular and reusable
- Place new components in `src/components/`
- Export components as default exports
- Use PropTypes or TypeScript (if migrating to TS)

## Commit Guidelines

We follow conventional commit messages:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

Example:
```
feat: add file manager app
fix: terminal history persistence issue
docs: update README with new commands
```

## Pull Request Process

1. **Update documentation** if you're adding new features
2. **Test your changes** thoroughly
3. **Ensure the build passes**:
   ```bash
   npm run build
   ```
4. **Create a Pull Request** with a clear description of:
   - What changes you made
   - Why you made them
   - How to test them

5. **Wait for review** - a maintainer will review your PR and may request changes

## Adding New Features

### Adding a New App

1. Create a new component in `src/components/` (e.g., `MyApp.jsx`)
2. Add the app to the dock in `src/App.jsx`:
   ```javascript
   const apps = [
     // ...existing apps
     { id: 'myapp', name: 'My App', icon: '🔥' },
   ];
   ```
3. Add to `componentMap` in `src/App.jsx`:
   ```javascript
   const componentMap = {
     // ...existing components
     myapp: <MyApp />,
   };
   ```

### Adding Terminal Commands

Edit `src/components/TerminalApp.jsx` and add your command to the switch statement:

```javascript
case 'mycommand':
  terminal.writeln('Command output');
  break;
```

### Adding Storage Features

Use the utilities in `src/utils/storage.js` or add new wrapper functions for localforage.

## Project Structure

```
src/
├─ components/       # React components
├─ utils/           # Utility functions
├─ assets/          # Static assets (logs, images)
├─ App.jsx          # Main app component
├─ main.jsx         # React entry point
└─ index.css        # Global styles
```

## Reporting Issues

- Use GitHub Issues to report bugs
- Provide a clear description and steps to reproduce
- Include screenshots if applicable
- Mention your browser and OS version

## Feature Requests

- Open a GitHub Issue with the "enhancement" label
- Describe the feature and its use case
- Explain how it would benefit users

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Help others learn and grow
- Focus on what's best for the community

## Questions?

- Open a GitHub Discussion
- Check existing issues and documentation
- Contact AxonInnova: https://dsc.gg/axoninnova

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to StellarFlux OS! 🚀
