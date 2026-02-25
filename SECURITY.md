# Security Policy

## Supported Versions

We release patches for security vulnerabilities in the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability within StellarFlux OS, please follow these steps:

### 1. Do Not Open a Public Issue

Security vulnerabilities should not be publicly disclosed until they have been addressed.

### 2. Report Privately

Please report security issues by:

- **Email**: Contact AxonInnova team directly
- **Discord**: https://dsc.gg/axoninnova (DM a moderator)
- **GitHub Security Advisory**: Use GitHub's private vulnerability reporting feature

### 3. Include Details

When reporting, please include:

- Description of the vulnerability
- Steps to reproduce the issue
- Potential impact
- Suggested fix (if any)
- Your contact information

### 4. Response Timeline

- **Initial Response**: Within 48 hours
- **Status Update**: Within 7 days
- **Fix Timeline**: Varies by severity

### 5. Disclosure Policy

- We will acknowledge your report within 48 hours
- We will provide regular updates on our progress
- We will notify you when the vulnerability is fixed
- We will credit you in the security advisory (unless you prefer anonymity)

## Security Best Practices for Users

### Local Development

- Keep dependencies up to date: `npm audit fix`
- Use the provided `.devcontainer` for consistent environments
- Don't commit sensitive data (API keys, tokens)

### Environment Variables

- Never commit `.env.local` files
- Use `.env.example` as a template
- Store secrets securely (use secrets managers for production)

### Deployment

- Use HTTPS in production
- Enable CORS restrictions
- Implement rate limiting if adding API endpoints
- Regularly update dependencies

## Known Security Considerations

### Client-Side Storage

This application uses `localforage` for browser-based storage. Data is stored locally and not encrypted by default. Users should:

- Not store sensitive personal information in the notepad
- Be aware that local storage can be accessed via browser developer tools
- Clear data using the Reset button when using shared computers

### Third-Party Dependencies

We regularly audit dependencies for vulnerabilities:

```bash
npm audit
```

## Security Updates

Security updates will be released as:

- Patch versions (0.1.x) for minor security fixes
- Minor versions (0.x.0) for moderate security improvements
- Documented in release notes and GitHub Security Advisories

## Vulnerability Rewards

While we don't currently offer a bug bounty program, we:

- Publicly acknowledge security researchers (with permission)
- List contributors in our Hall of Fame
- Provide references for responsible disclosure

## Questions?

For security-related questions that are not vulnerabilities, please:

- Open a GitHub Discussion
- Contact us via Discord: https://dsc.gg/axoninnova

---

Thank you for helping keep StellarFlux OS secure! 🔒
