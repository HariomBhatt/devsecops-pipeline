<div align="center">

# 🛡️ DevSecOps CI/CD Security Pipeline

### Automated Security Testing Integrated into Every Code Push

[![Security Pipeline](https://img.shields.io/badge/Pipeline-GitHub%20Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white)](https://github.com/HariomBhatt/devsecops-pipeline/actions)
[![SAST](https://img.shields.io/badge/SAST-CodeQL-orange?style=for-the-badge&logo=github&logoColor=white)](https://codeql.github.com/)
[![SCA](https://img.shields.io/badge/SCA-Snyk-4C4A73?style=for-the-badge&logo=snyk&logoColor=white)](https://snyk.io/)
[![DAST](https://img.shields.io/badge/DAST-OWASP%20ZAP-00549E?style=for-the-badge&logo=owasp&logoColor=white)](https://www.zaproxy.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

<br/>

> **"Security is not a phase — it's a process. This pipeline makes it automatic."**

</div>

---

## 📌 Project Overview

This project demonstrates a **complete, production-style DevSecOps pipeline** built with GitHub Actions that automatically runs security scans on every single code push — no manual steps required.

The pipeline integrates **three industry-standard security tools**, each covering a different layer of the application:

| Layer | What Gets Scanned | Tool Used |
|-------|------------------|-----------|
| Source Code | Logic & coding vulnerabilities | **CodeQL** |
| Dependencies | Third-party npm packages | **Snyk** |
| Live Application | Runtime behavior & endpoints | **OWASP ZAP** |

The core goal is to **shift security left** — catching vulnerabilities during development, not after deployment.

---

## 🧠 What is DevSecOps?

DevSecOps integrates **security practices directly into the DevOps workflow**, making security a shared, automated responsibility at every stage rather than a last-minute check.

```
Traditional Approach:                DevSecOps Approach:
                                      
  Code → Build → Deploy              Code → [Security Check]
                    ↓                   ↓
               Security Test         Build → [Security Check]
               (too late!)             ↓
                                    Deploy → [Security Check]
                                    
  Issues found post-deployment       Issues caught before they ship
  Expensive to fix                   Cheap and fast to fix
```

| Pillar | Role in This Project |
|--------|---------------------|
| **Dev** | Node.js + Express.js web application |
| **Sec** | Automated scanning via CodeQL, Snyk, and ZAP |
| **Ops** | GitHub Actions CI/CD pipeline execution |

---

## 🏗️ Pipeline Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                     Developer Workstation                         │
│                      Kali Linux (VM)                             │
│                                                                  │
│   Write Code  ──▶  git add . ──▶  git commit ──▶  git push      │
└───────────────────────────────────┬──────────────────────────────┘
                                    │
                                    ▼  (automatic trigger)
┌──────────────────────────────────────────────────────────────────┐
│                      GitHub Repository                            │
│               HariomBhatt / devsecops-pipeline                   │
└───────────────────────────────────┬──────────────────────────────┘
                                    │
                                    ▼
┌──────────────────────────────────────────────────────────────────┐
│                   GitHub Actions CI/CD Pipeline                   │
│             .github/workflows/devsecops.yml                      │
│                                                                  │
│    ┌──────────────┐    ┌──────────────┐    ┌─────────────────┐  │
│    │   Stage 1    │    │   Stage 2    │    │    Stage 3      │  │
│    │    SAST      │───▶│    SCA       │───▶│     DAST        │  │
│    │   CodeQL     │    │    Snyk      │    │  OWASP ZAP      │  │
│    │              │    │              │    │                 │  │
│    │  Scans the   │    │  Scans npm   │    │  Scans live     │  │
│    │  source code │    │  packages    │    │  running app    │  │
│    └──────────────┘    └──────────────┘    └─────────────────┘  │
│                                                                  │
│                         ▼ Results                                │
│               ┌─────────────────────────┐                        │
│               │  Security Report        │                        │
│               │  Vulnerability Flagged  │                        │
│               │  Developer Notified     │                        │
│               └─────────────────────────┘                        │
└──────────────────────────────────────────────────────────────────┘
```

---

## 🔍 The Three Security Layers — Deep Dive

### 🔬 Layer 1: SAST — Static Application Security Testing
**Tool: GitHub CodeQL**

CodeQL analyzes the **raw source code** without running the application. It builds a semantic model of the entire codebase, then queries it for known vulnerability patterns — catching issues like unsanitized user input, insecure data flows, and improper error handling.

```
Source Code Files
       │
       ▼
  CodeQL Engine         ← Builds a queryable model of the code
       │
       ▼
  Security Queries      ← Pattern matching against known CVEs & CWEs
       │
       ▼
  GitHub Security Tab   ← Results visible as alerts with line numbers
```

**Best suited for detecting:** XSS, SQL Injection, path traversal, insecure deserialization, hardcoded secrets.

---

### 📦 Layer 2: SCA — Software Composition Analysis
**Tool: Snyk**

Modern applications use hundreds of open-source npm packages. Snyk checks every package in `package.json` against its continuously updated vulnerability database. If any dependency (or its sub-dependency) has a known CVE, Snyk reports it along with the fix.

```
package.json
     │
     ▼
  Dependency Tree Built  ← All direct + transitive packages mapped
     │
     ▼
  Snyk CVE Database      ← Cross-referenced against 1M+ vulnerabilities
     │
     ▼
  Report Generated       ← Lists vulnerable packages with fix versions
```

**Best suited for detecting:** Known CVEs in open-source libraries, outdated packages, license violations.

---

### 🌐 Layer 3: DAST — Dynamic Application Security Testing
**Tool: OWASP ZAP (Zed Attack Proxy)**

Unlike SAST, DAST tests the **live, running application** from the outside — exactly how a real attacker would. ZAP sends crafted HTTP requests, probes endpoints, and analyzes responses to find vulnerabilities that only appear at runtime.

```
Application Server Started
          │
          ▼
   ZAP Spider / Crawler   ← Maps all accessible URLs and endpoints
          │
          ▼
   Automated Attack Scan  ← Injects payloads (XSS, SQLi, etc.)
          │
          ▼
   Response Analysis      ← Flags abnormal responses
          │
          ▼
   HTML/JSON Report       ← Uploaded as pipeline artifact
```

**Best suited for detecting:** Reflected XSS, authentication flaws, broken access control, server misconfigurations.

---

## 🛠️ Tech Stack

| Category | Technology | Purpose |
|----------|-----------|---------|
| **Development OS** | Kali Linux (Virtual Machine) | Secure development environment |
| **Application** | Node.js v18 + Express.js | Web application framework |
| **Version Control** | Git + GitHub | Source code management |
| **CI/CD Automation** | GitHub Actions | Pipeline orchestration |
| **SAST Scanner** | GitHub CodeQL | Static code vulnerability analysis |
| **SCA Scanner** | Snyk | Dependency vulnerability scanning |
| **DAST Scanner** | OWASP ZAP | Dynamic live application testing |
| **Container Runtime** | Docker | Tool dependency management |

---

## 📁 Repository Structure

```
devsecops-pipeline/
│
├── 📄 app.js                       # Express.js web application (main entry)
├── 📄 package.json                 # Project metadata and npm dependencies
├── 📄 package-lock.json            # Locked dependency tree (reproducible builds)
│
└── 📁 .github/
    └── 📁 workflows/
        └── 📄 devsecops.yml        # ← CI/CD pipeline definition (core file)
```

---

## 🚀 Step-by-Step Implementation

### Step 1 — Environment Setup

The project was developed inside a **Kali Linux virtual machine** to provide an isolated, security-focused development environment.

```bash
# Update package index and install all required tools
sudo apt update
sudo apt install git nodejs npm docker.io -y

# Verify installations
git --version
node --version
npm --version
docker --version
```

---

### Step 2 — Application Development

A Node.js + Express.js project was initialized and a simple web application built:

```bash
# Create and initialize the project
mkdir devsecops-project
cd devsecops-project
npm init -y
npm install express
```

The application exposes a `/user` endpoint that accepts a `name` query parameter. This endpoint was **intentionally written without input sanitization** to create a realistic vulnerable target for the security pipeline to detect:

```javascript
// app.js
const express = require('express');
const app = express();

// ⚠️ Vulnerable endpoint — unsanitized user input
app.get('/user', (req, res) => {
  const name = req.query.name;
  res.send("Hello " + name);
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
```

> **Why intentionally vulnerable?**
> A pipeline that only processes clean code proves nothing. By introducing a real vulnerability, we validate that the scanner correctly identifies, locates, and reports the issue — end-to-end.

---

### Step 3 — Git Initialization & GitHub Push

```bash
# Initialize the local repository
git init
git add .
git commit -m "feat: initial express application setup"

# Connect to GitHub remote
git remote add origin https://github.com/HariomBhatt/devsecops-pipeline.git
git branch -M main

# Push to GitHub
git push -u origin main
```

> **Note on Authentication:** GitHub requires a Personal Access Token (PAT) for terminal-based authentication. The token is generated from:
> `GitHub → Settings → Developer Settings → Personal Access Tokens → Generate New Token`

---

### Step 4 — Snyk API Token Configuration

A Snyk account was created at [snyk.io](https://snyk.io) and the API token was securely stored as a GitHub Actions Secret:

```
GitHub Repository Settings
  └── Secrets and Variables
      └── Actions
          └── New Repository Secret
              Name:  SNYK_TOKEN
              Value: <api_token_from_snyk_dashboard>
```

The secret is accessed in the pipeline using `${{ secrets.SNYK_TOKEN }}` — it is never stored in the codebase.

---

### Step 5 — CI/CD Pipeline Configuration

The entire automation is defined in `.github/workflows/devsecops.yml`. GitHub Actions reads this file and triggers the pipeline on every push:

```yaml
name: DevSecOps Security Pipeline

on:
  push:
    branches: [ "main" ]
  pull_request:
    branches: [ "main" ]

permissions:
  security-events: write   # Allows CodeQL to upload results to Security tab
  actions: read
  contents: read

jobs:

  # ─────────────────────────────────────────────────────────────
  # STAGE 1: SAST — Static Application Security Testing (CodeQL)
  # ─────────────────────────────────────────────────────────────
  codeql-analysis:
    name: "SAST — CodeQL Static Scan"
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Source Code
        uses: actions/checkout@v4

      - name: Initialize CodeQL Engine
        uses: github/codeql-action/init@v2
        with:
          languages: javascript

      - name: Execute CodeQL Analysis
        uses: github/codeql-action/analyze@v2

  # ─────────────────────────────────────────────────────────────
  # STAGE 2: SCA — Software Composition Analysis (Snyk)
  # ─────────────────────────────────────────────────────────────
  snyk-dependency-scan:
    name: "SCA — Snyk Dependency Scan"
    runs-on: ubuntu-latest
    needs: codeql-analysis   # Runs only after SAST completes

    steps:
      - name: Checkout Source Code
        uses: actions/checkout@v4

      - name: Install Project Dependencies
        run: npm install

      - name: Authenticate with Snyk
        run: npx snyk auth ${{ secrets.SNYK_TOKEN }}

      - name: Run Snyk Vulnerability Scan
        run: npx snyk test --severity-threshold=high

  # ─────────────────────────────────────────────────────────────
  # STAGE 3: DAST — Dynamic Application Security Testing (ZAP)
  # ─────────────────────────────────────────────────────────────
  owasp-zap-scan:
    name: "DAST — OWASP ZAP Live Scan"
    runs-on: ubuntu-latest
    needs: snyk-dependency-scan   # Runs only after SCA completes

    steps:
      - name: Checkout Source Code
        uses: actions/checkout@v4

      - name: Start HTTP Server (Scan Target)
        run: |
          python3 -m http.server 8000 &
          sleep 5   # Wait for server to be ready

      - name: Run OWASP ZAP Baseline Scan
        uses: zaproxy/action-baseline@v0.10.0
        with:
          target: 'http://localhost:8000'
```

---

## 🔴 Vulnerability Detection — XSS Found

After the initial pipeline run, **CodeQL flagged a High-severity vulnerability**:

```
╔══════════════════════════════════════════════════════════════════╗
║                   SECURITY ALERT — HIGH SEVERITY                 ║
╠══════════════════════════════════════════════════════════════════╣
║  Vulnerability : Reflected Cross-Site Scripting (XSS)            ║
║  Location      : app.js  →  GET /user  →  Line 6                ║
║  Severity      : 🔴 HIGH                                         ║
║  CWE           : CWE-79 (Improper Neutralization of Input)       ║
║  Root Cause    : User-supplied query parameter written directly   ║
║                  into HTTP response without sanitization          ║
╚══════════════════════════════════════════════════════════════════╝
```

**How an attacker would exploit this:**

```
Attacker crafts a URL:
http://target.com/user?name=<script>document.cookie</script>

Server responds with:
Hello <script>document.cookie</script>

Browser executes the injected JavaScript → session hijacked
```

---

## ✅ Vulnerability Fix & Re-Validation

The fix was implemented by adding an **HTML escape function** that converts special characters into their safe HTML entity equivalents, preventing the browser from interpreting them as executable code:

```javascript
// ✅ Secure app.js — Post-fix

const express = require('express');
const app = express();

// HTML escape function — neutralizes injected tags
function escapeHTML(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ✅ Secure endpoint — input sanitized before output
app.get('/user', (req, res) => {
  const name = escapeHTML(req.query.name);
  res.send("Hello " + name);
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
```

**Effect of the fix:**

| User Input | Before Fix (Dangerous) | After Fix (Safe) |
|-----------|----------------------|-----------------|
| `<script>alert(1)</script>` | Executes JavaScript | Renders as plain text |
| `<img src=x onerror=hack()>` | Triggers error handler | Rendered as safe string |
| `John` | Works normally | Works normally ✅ |

The fix was committed and pushed:

```bash
git add app.js
git commit -m "security: sanitize user input to prevent reflected XSS (CWE-79)"
git push
```

**The pipeline re-triggered automatically → all three scans passed → zero vulnerabilities** ✅

---

## 📊 Final Pipeline Results

| Stage | Tool | Result | Details |
|-------|------|--------|---------|
| SAST | CodeQL | ✅ **Passed** | XSS detected → patched → re-scan clean |
| SCA | Snyk | ✅ **Passed** | No vulnerable dependencies found |
| DAST | OWASP ZAP | ✅ **Passed** | Baseline scan completed, no critical findings |
| **Pipeline** | GitHub Actions | ✅ **Operational** | Runs automatically on every push |

---

## 💡 Core Concepts Demonstrated

| Concept | How It's Applied |
|---------|-----------------|
| **Shift-Left Security** | Security scanning happens at commit time, not post-deployment |
| **CI/CD Automation** | Zero manual steps — fully triggered by `git push` |
| **Defense in Depth** | Three independent scanners covering code, packages, and runtime |
| **Secrets Management** | API tokens stored in GitHub Secrets — never committed to code |
| **Full Remediation Cycle** | Complete detect → fix → verify → re-scan loop demonstrated |
| **Input Validation** | HTML escaping as a defense-in-depth control against XSS |
| **Least Privilege** | Pipeline permissions scoped to only what's needed |

---

## 🔮 Roadmap — Planned Enhancements

- [ ] **Secrets Scanning** — Detect accidentally committed API keys or credentials
- [ ] **Container Image Scanning** — Scan Docker images with Trivy before deployment
- [ ] **DAST on Live Node.js App** — Point ZAP directly at the running Express server
- [ ] **PR Merge Gate** — Block pull requests that introduce new vulnerabilities
- [ ] **Alert Notifications** — Slack/email alerts on pipeline failures
- [ ] **SBOM Generation** — Auto-generate a Software Bill of Materials per release
- [ ] **IaC Scanning** — Add Checkov to scan infrastructure configuration files

---

## 📚 References

| Resource | Link |
|----------|------|
| GitHub Actions Documentation | [docs.github.com/actions](https://docs.github.com/en/actions) |
| CodeQL Documentation | [codeql.github.com](https://codeql.github.com/) |
| Snyk Documentation | [docs.snyk.io](https://docs.snyk.io/) |
| OWASP ZAP | [zaproxy.org](https://www.zaproxy.org/) |
| OWASP XSS Prevention Cheatsheet | [owasp.org](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html) |
| OWASP DevSecOps Guideline | [owasp.org/DevSecOps](https://owasp.org/www-project-devsecops-guideline/) |

---

## 👨‍💻 Author

<div align="center">

**Hariom Bhatt**

[![GitHub](https://img.shields.io/badge/GitHub-HariomBhatt-181717?style=for-the-badge&logo=github)](https://github.com/HariomBhatt)

*A hands-on DevSecOps project demonstrating practical integration of automated security scanning into a real-world CI/CD pipeline using industry-standard open-source tools.*

---

**⭐ If this project was useful or insightful, consider giving it a star!**

</div>
