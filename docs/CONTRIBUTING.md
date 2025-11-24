# Contributing Guide

## How to Contribute
1. **Fork the repository**
   ```bash
   git clone https://github.com/your-username/esn.git
   cd esn
   ```
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes**
   - Follow the coding standards (see `DEVELOPMENT.md`).
   - Write unit tests for new functionality.
4. **Commit with Conventional Commits**
   ```bash
   git commit -m "feat: add new event filter"
   ```
5. **Push and open a Pull Request**
   ```bash
   git push origin feature/your-feature-name
   ```
   - Provide a clear description of the changes.
   - Reference any related issue (e.g., `Fixes #123`).

## Code Review Process
- At least one maintainer must approve the PR.
- CI will run lint, type‑checking, and tests automatically.
- Ensure the documentation is updated if you add/modify public APIs or features.

## Reporting Issues
- Use the GitHub Issues board.
- Include steps to reproduce, expected behavior, and screenshots if applicable.

## Style Guidelines
- **TypeScript**: strict mode, no `any` unless absolutely necessary.
- **React**: functional components, hooks, and TypeScript typings.
- **NestJS**: use services for business logic, keep controllers thin.
- **ESLint/Prettier**: run `npm run lint` and `npm run format` before committing.

## Testing
- Backend: `npm run test` (Jest) – aim for >80% coverage.
- Frontend: `npm run test` (React Testing Library) – cover critical UI paths.

## Documentation Updates
- Any change to public APIs, data models, or user flows must be reflected in the `docs/` folder.
- Update `README.md` if the overall project scope changes.

*All instructions avoid any references to payments or notification features.*
