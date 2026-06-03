# Security Policy

Thank you for helping keep finBoard and its users safe. This document explains how to responsibly disclose security vulnerabilities in this project.

---

## Supported Versions

finBoard does not currently follow a versioned release cycle. Security fixes are applied to the latest commit on the `main` branch and deployed to the live site at [finnboard0.netlify.app](https://finnboard0.netlify.app/).

| Version / Branch | Supported |
|------------------|-----------|
| `main` (latest)  | ✅ Yes     |
| Older forks / snapshots | ❌ No |

---

## Reporting a Vulnerability

> ⚠️ **Do not open a public GitHub issue for security vulnerabilities.** Public issues expose the vulnerability to everyone before a fix is available, putting users at risk.

### Preferred: GitHub Private Security Advisory

1. Go to the [Security tab](https://github.com/khanirfan18/finBoard/security) of this repository.
2. Click **"Report a vulnerability"** to open a private advisory draft.
3. Fill in the details as described in the section below.
4. Submit — only the maintainer and GitHub staff can see it until it is resolved and disclosed.

### Alternative: Email

If you are unable to use the GitHub advisory flow, email the maintainer directly:

**[khanirfan18@gmail.com](mailto:khanirfan18@gmail.com)**

Use the subject line: `[SECURITY] finBoard – <brief description>`

Encrypt your message with PGP if the details are especially sensitive (public key available on request).

---

## What to Include in Your Report

A good report helps the maintainer reproduce and fix the issue quickly. Please provide as much of the following as you can:

- **Description** — what the vulnerability is and what an attacker could achieve.
- **Steps to reproduce** — a minimal, numbered sequence of actions that triggers the issue.
- **Environment** — browser name and version, OS, and whether you are running the live site or a local build.
- **Impact assessment** — who is affected and under what conditions (e.g., any visitor, only authenticated users, only users who import a malicious CSV).
- **Supporting material** — screenshots, screen recordings, proof-of-concept code, or network logs (redact any personal data before attaching).

---

## Response Timeline

| Milestone | Target |
|-----------|--------|
| Acknowledgement of your report | Within **48 hours** |
| Initial assessment and severity triage | Within **5 business days** |
| Fix or mitigation shipped to `main` | Within **14 days** for high/critical issues; longer for low/medium |
| Public disclosure (coordinated with reporter) | After the fix is live |

If you do not receive an acknowledgement within 48 hours, please follow up — reports can occasionally land in a spam folder.

---

## Sensitive Configuration and Credentials

### `.env.example` and Supabase keys

finBoard uses [Supabase](https://supabase.com/) for authentication. The repository includes a `.env.example` file that lists the environment variables required to run the project:

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

**Important guidelines:**

- `.env.example` contains **placeholder values only** — it is safe to commit.
- Your real `.env` file (with actual credentials) is listed in `.gitignore` and must **never** be committed.
- The `VITE_SUPABASE_ANON_KEY` is a public-facing key restricted by Supabase Row-Level Security (RLS) policies, but it should still be treated as sensitive and rotated immediately if accidentally exposed.
- If you believe real credentials have been committed to the repository (in any branch or commit history), report it privately using the process above so they can be revoked before a public fix is made.

### Browser storage

Financial data in finBoard is stored locally in the user's browser (localStorage / sessionStorage). No financial data is transmitted to a server. Vulnerabilities that allow cross-site scripts or malicious file uploads to exfiltrate this data are considered **high severity** and should be reported privately.

---

## Out of Scope

The following are generally **not** considered valid security reports for this project:

- Bugs in third-party dependencies (report those to the upstream project; mention them here only if finBoard's usage creates a specific exploit path).
- Missing HTTP security headers on Netlify's default configuration (open a regular issue).
- Self-XSS that requires the user to paste code into their own browser console.
- Theoretical vulnerabilities with no demonstrated impact.
- Social engineering attacks targeting the maintainer.

---

## What We Commit To

- We will not take legal action against researchers who report vulnerabilities in good faith and follow this policy.
- We will keep your identity confidential unless you ask to be credited in the disclosure.
- We will work with you to understand the issue before publishing any public advisory.

---

## Security-Related Contributions

If you want to contribute a **non-sensitive** security improvement (hardening headers, dependency upgrades, auth improvements), please follow the standard [Contributing Guide](CONTRIBUTING.md) and open a regular issue or pull request.

For anything sensitive, always use the private reporting channel above.
