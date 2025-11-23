# Contributing to ESN Platform

First off, thank you for considering contributing to the ESN Platform! It's people like you that make this platform better for ESN communities worldwide.

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to [project-email@example.com].

---

## Table of Contents

- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Commit Messages](#commit-messages)
- [Issue Guidelines](#issue-guidelines)

---

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates. When creating a bug report, include as many details as possible:

**Bug Report Template:**

```markdown
**Describe the bug**
A clear and concise description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected behavior**
A clear description of what you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
 - OS: [e.g. macOS, Windows, Linux]
 - Browser: [e.g. Chrome, Safari]
 - Version: [e.g. 1.0.0]

**Additional context**
Add any other context about the problem.
```

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion:

**Feature Request Template:**

```markdown
**Is your feature request related to a problem?**
A clear description of what the problem is.

**Describe the solution you'd like**
A clear description of what you want to happen.

**Describe alternatives you've considered**
Any alternative solutions or features you've considered.

**Additional context**
Add any other context or screenshots.
```

### Your First Code Contribution

 Unsure where to begin? Look for these labels:

- `good first issue` - Simple issues for beginners
- `help wanted` - Issues needing attention
- `bug` - Something isn't working
- `enhancement` - New feature or request

---

## Development Setup

See [DEVELOPMENT.md](./docs/DEVELOPMENT.md) for detailed setup instructions.

**Quick Start:**

```bash
# 1. Fork the repository
# 2. Clone your fork
git clone https://github.com/YOUR-USERNAME/esn.git
cd esn

# 3. Add upstream remote
git remote add upstream https://github.com/original-owner/esn.git

# 4. Create a branch
git checkout -b feature/your-feature-name

# 5. Install dependencies
cd backend && npm install
cd ../frontend && npm install

# 6. Start development
# See DEVELOPMENT.md for full instructions
```

---

## Pull Request Process

### Before Submitting

1. ✅ Read relevant documentation
2. ✅ Follow coding standards
3. ✅ Write/update tests
4. ✅ Update documentation
5. ✅ Run linter and tests
6. ✅ Test locally

### PR Checklist

- [ ] My code follows the project's style guidelines
- [ ] I have performed a self-review of my code
- [ ] I have commented my code where necessary
- [ ] I have updated relevant documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix/feature works
- [ ] All new and existing tests pass
- [ ] My commit messages follow conventions

### Submitting a PR

1. **Update your fork**:
```bash
git fetch upstream
git rebase upstream/develop
```

2. **Push to your fork**:
```bash
git push origin feature/your-feature-name
```

3. **Open Pull Request**:
   - Navigate to the original repository
   - Click "New Pull Request"
   - Select your fork and branch
   - Fill in the PR template
   - Request review from maintainers

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix (non-breaking change fixing an issue)
- [ ] New feature (non-breaking change adding functionality)
- [ ] Breaking change (fix or feature causing existing functionality to not work as expected)
- [ ] Documentation update

## How Has This Been Tested?
Describe tests you ran

## Screenshots (if appropriate)

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-reviewed code
- [ ] Commented code where needed
- [ ] Updated documentation
- [ ] No new warnings
- [ ] Added tests
- [ ] Tests pass
```

---

## Coding Standards

### TypeScript

```typescript
// ✅ Good
interface UserData {
  id: string;
  email: string;
}

function fetchUser(id: string): Promise<UserData> {
  return api.get(`/users/${id}`);
}

// ❌ Bad
function fetchUser(id) {
  return api.get(`/users/${id}`);
}
```

### React Components

``` typescript
// ✅ Good
interface Props {
  title: string;
  onClick: () => void;
}

export const Button: React.FC<Props> = ({ title, onClick }) => {
  return <button onClick={onClick}>{title}</button>;
};

// ❌ Bad
export const Button = (props) => {
  return <button onClick={props.onClick}>{props.title}</button>;
};
```

### File Naming

- **Components**: PascalCase (e.g., `EventCard.tsx`)
- **Utilities**: camelCase (e.g., `formatDate.ts`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_ENDPOINTS.ts`)
- **CSS/Styles**: kebab-case (e.g., `event-card.css`)

---

## Commit Messages

We follow [Conventional Commits](https://www.conventionalcommits.org/).

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```bash
feat(events): add event filtering by category

- Added category filter dropdown
- Updated GraphQL query to accept category filter
- Added tests for filter functionality

Closes #123

---

fix(auth): resolve token refresh issue

Fixed bug where tokens weren't refreshing properly after expiration

Fixes #456

---

docs(api): update GraphQL schema documentation

Updated API.md with new event fields
```

### Best Practices

- Use present tense ("add feature" not "added feature")
- Use imperative mood ("move cursor to" not "moves cursor to")
- Limit first line to 72 characters
- Reference issues and PRs when applicable
- Provide context in the body when needed

---

## Issue Guidelines

### Creating Issues

**Good Issue:**
```markdown
Title: Event registration fails for events with 0 available spots

**Description**
When trying to register for a full event, the registration button 
remains enabled and clicking it causes an error.

**Steps to Reproduce**
1. Navigate to Events page
2. Find event with 0 spots available
3. Click "Register" button
4. Observe error in console

**Expected Behavior**
Button should be disabled for full events

**Actual Behavior**
Error: "Cannot register for full event"

**Screenshots**
[Attach screenshot]

**Environment**
- Browser: Chrome 120
- OS: macOS 14.1
```

**Bad Issue:**
```markdown
Title: Registration broken

It doesn't work when I click register
```

### Issue Labels

- `bug`: Something isn't working
- `enhancement`: New feature request
- `documentation`: Documentation improvements
- `good first issue`: Good for newcomers
- `help wanted`: Extra attention needed
- `question`: Further information requested
- `wontfix`: This will not be worked on

---

## Testing

### Writing Tests

```typescript
// Unit test example
describe('EventService', () => {
  it('should create an event', async () => {
    const input = {
      title: 'Test Event',
      // ... other fields
    };
    
    const result = await service.create(input, userId);
    
    expect(result).toBeDefined();
    expect(result.title).toBe(input.title);
  });
});
```

### Running Tests

```bash
# Backend
cd backend
npm run test              # Unit tests
npm run test:e2e         # E2E tests
npm run test:cov         # Coverage

# Frontend
cd frontend
npm run test
```

---

## Review Process

### For Contributors

1. Submit PR following template
2. Address reviewer comments
3. Keep PR updated with main branch
4. Be patient and responsive

### For Reviewers

1. Review within 48 hours
2. Provide constructive feedback
3. Test changes locally
4. Approve or request changes
5. Merge when approved

---

## Release Process

### Versioning

We use [Semantic Versioning](https://semver.org/):

- **MAJOR** version for incompatible API changes
- **MINOR** version for backward-compatible features
- **PATCH** version for backward-compatible bug fixes

### Creating a Release

```bash
# 1. Update version
npm version major|minor|patch

# 2. Update CHANGELOG.md

# 3. Create release tag
git tag -a v1.2.3 -m "Release version 1.2.3"
git push origin v1.2.3

# 4. Create GitHub release with notes
```

---

## Documentation

### What to Document

- New features
- Breaking changes
- Configuration options
- API changes
- Migration guides

### Where to Document

- **README.md**: Overview and quick start
- **docs/API.md**: API reference
- **docs/DEVELOPMENT.md**: Development guide
- **CHANGELOG.md**: Version history
- **Inline comments**: Complex code

---

## Community

### Communication Channels

- **GitHub Issues**: Bug reports and features
- **GitHub Discussions**: Questions and ideas
- **Slack/Discord**: Real-time chat (link)

### Getting Help

1. Check documentation
2. Search existing issues
3. Ask in discussions
4. Create new issue if needed

---

## Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Acknowledged in documentation

---

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

## Questions?

Feel free to reach out:
- Email: [project-email@example.com]
- Discord: [server-link]
- GitHub Discussions: [link]

**Thank you for contributing!** 🎉
