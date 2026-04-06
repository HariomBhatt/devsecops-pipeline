# 🔐 DevSecOps Pipeline with GitHub Actions

<div align="center">

![DevSecOps](https://img.shields.io/badge/DevSecOps-Pipeline-blue?style=for-the-badge&logo=github-actions&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-CI%2FCD-2088FF?style=for-the-badge&logo=github-actions&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Security](https://img.shields.io/badge/Security-Automated-red?style=for-the-badge&logo=owasp&logoColor=white)
![Status](https://img.shields.io/badge/Pipeline-Passing-brightgreen?style=for-the-badge)

**A fully automated security-integrated CI/CD pipeline that detects, reports, and validates the fix of real-world vulnerabilities — built from scratch on Kali Linux.**

</div>

---

## 📌 Table of Contents

- [Project Overview](#-project-overview)
- [Architecture & Pipeline Flow](#-architecture--pipeline-flow)
- [Tech Stack](#-tech-stack)
- [Application](#-application)
- [Security Tools](#-security-tools)
  - [SAST – CodeQL](#-sast--codeql)
  - [SCA – Snyk](#-sca--snyk)
  - [DAST – OWASP ZAP](#-dast--owasp-zap)
- [Pipeline Configuration](#-pipeline-configuration)
- [Vulnerability Detection & Fix](#-vulnerability-detection--fix)
- [Results](#-results)
- [Key Learnings](#-key-learnings)

---

## 🧭 Project Overview

This project demonstrates a complete **DevSecOps pipeline** that integrates security testing at every stage of the software development lifecycle. The goal is to implement **"shift-left" security** — catching vulnerabilities early in development rather than after deployment.

> **"Security is not a phase — it's a pipeline."**

### 🎯 What This Project Does

| Stage | Tool | What It Does |
|-------|------|-------------|
| **Static Analysis** | CodeQL | Scans source code for vulnerabilities before execution |
| **Dependency Scan** | Snyk | Audits npm packages for known CVEs |
| **Dynamic Analysis** | OWASP ZAP | Tests the running application for runtime vulnerabilities |

---

## 🏗️ Architecture & Pipeline Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                        DEVELOPER MACHINE                        │
│                         (Kali Linux)                            │
│                                                                 │
│   ┌──────────┐    git push    ┌──────────────────────────────┐  │
│   │  VS Code │ ────────────► │        GitHub Repository     │  │
│   │  / Nano  │               └──────────────┬───────────────┘  │
└───┴──────────┘                              │                   │
                                              │ triggers
                                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    GITHUB ACTIONS PIPELINE                      │
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐    │
│  │                    devsecops.yml                        │    │
│  └─────────────────────┬──────────────────────────────────┘    │
│                        │                                        │
│         ┌──────────────┼──────────────┐                        │
│         ▼              ▼              ▼                        │
│   ┌───────────┐  ┌───────────┐  ┌──────────┐                  │
│   │   SAST    │  │    SCA    │  │   DAST   │                  │
│   │  CodeQL   │  │   Snyk    │  │ OWASP ZAP│                  │
│   └─────┬─────┘  └─────┬─────┘  └────┬─────┘                  │
│         │              │             │                          │
│         └──────────────┼─────────────┘                         │
│                        ▼                                        │
│              ┌──────────────────┐                              │
│              │  Security Report │                              │
│              │  GitHub Security │                              │
│              │  & Code Scanning │                              │
│              └──────────────────┘                              │
└─────────────────────────────────────────────────────────────────┘
```

### Pipeline Trigger Flow

```
Code Push
    │
    ▼
┌───────────────────────────────────────────────────────┐
│  Job 1: SAST                                          │
│  ┌─────────────────────────────────────────────────┐  │
│  │  Checkout Code → Initialize CodeQL → Build      │  │
│  │  → Analyze → Upload SARIF Results               │  │
│  └─────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────┘
    │
    ▼
┌───────────────────────────────────────────────────────┐
│  Job 2: SCA                                           │
│  ┌─────────────────────────────────────────────────┐  │
│  │  Checkout Code → Setup Node.js → npm install    │  │
│  │  → snyk test → Report Dependencies              │  │
│  └─────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────┘
    │
    ▼
┌───────────────────────────────────────────────────────┐
│  Job 3: DAST                                          │
│  ┌─────────────────────────────────────────────────┐  │
│  │  Start App Server → Wait → Run ZAP Scan         │  │
│  │  → Generate Report → Upload Artifacts           │  │
│  └─────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────┘
    │
    ▼
 ✅ Security Dashboard Updated
```

---

## 🛠️ Tech Stack

```
┌─────────────────────────────────────────────────────────┐
│                     TECH STACK                          │
├────────────────────┬────────────────────────────────────┤
│  Operating System  │  Kali Linux                        │
│  Runtime           │  Node.js + npm                     │
│  Framework         │  Express.js                        │
│  Version Control   │  Git + GitHub (SSH Auth)           │
│  CI/CD             │  GitHub Actions                    │
│  SAST              │  CodeQL (GitHub Native)            │
│  SCA               │  Snyk CLI + GitHub Action          │
│  DAST              │  OWASP ZAP (Stable Docker)         │
│  Containerization  │  Docker                            │
└────────────────────┴────────────────────────────────────┘
```

---

## 💻 Application

A deliberately vulnerable **Node.js + Express** web application was built to demonstrate real security scanning.

### Application Structure

```
devsecops-project/
├── .github/
│   └── workflows/
│       └── devsecops.yml      ← CI/CD Pipeline
├── app.js                     ← Vulnerable Express App
├── package.json
└── README.md
```

### Application Endpoints

```
GET  /         → "Hello DevSecOps World!"
GET  /user     → Greets user by name (vulnerable to XSS)
```

### The Vulnerable Code (Intentional)

```javascript
// app.js — VULNERABLE VERSION
const express = require('express');
const app = express();

app.get('/user', (req, res) => {
  const name = req.query.name;
  res.send("Hello " + name);   // ⚠️ No sanitization — XSS vulnerability
});

app.listen(3000);
```

> ⚠️ **This vulnerability was intentionally introduced** to validate that the security pipeline correctly detects real-world flaws.

---

## 🔍 Security Tools

### 🛡️ SAST – CodeQL

**Static Application Security Testing**

CodeQL is GitHub's native code analysis engine. It treats code as data and runs queries against it to find vulnerabilities — without executing the application.

```
┌──────────────────────────────────────────────┐
│               HOW CodeQL WORKS               │
│                                              │
│  Source Code                                 │
│      │                                       │
│      ▼                                       │
│  ┌─────────────┐                             │
│  │  CodeQL DB  │  ← Compiles code into a     │
│  │  (built)    │    queryable database        │
│  └──────┬──────┘                             │
│         │                                    │
│         ▼                                    │
│  ┌─────────────┐                             │
│  │QL Query Run │  ← Runs security queries    │
│  └──────┬──────┘                             │
│         │                                    │
│         ▼                                    │
│  ┌─────────────┐                             │
│  │ SARIF Report│  ← Uploaded to GitHub       │
│  └─────────────┘    Security tab             │
└──────────────────────────────────────────────┘
```

**What CodeQL Detected:**

| Vulnerability | Severity | Location | CWE |
|---------------|----------|----------|-----|
| Reflected XSS | 🔴 High | `app.js:8` | CWE-79 |

**Pipeline Configuration (SAST Job):**

```yaml
codeql-analysis:
  runs-on: ubuntu-latest
  permissions:
    security-events: write
    actions: read
    contents: read
  steps:
    - uses: actions/checkout@v3
    - uses: github/codeql-action/init@v2
      with:
        languages: javascript
    - uses: github/codeql-action/autobuild@v2
    - uses: github/codeql-action/analyze@v2
```

---

### 📦 SCA – Snyk

**Software Composition Analysis**

Snyk scans your project's dependencies (`package.json`, `node_modules`) and cross-references them against a continuously updated vulnerability database (CVE/NVD).

```
┌──────────────────────────────────────────────┐
│               HOW SNYK WORKS                 │
│                                              │
│  package.json / package-lock.json            │
│      │                                       │
│      ▼                                       │
│  ┌─────────────────┐                         │
│  │ Dependency Tree │  ← Maps all direct +    │
│  │ Built by Snyk   │    transitive deps       │
│  └────────┬────────┘                         │
│           │                                  │
│           ▼                                  │
│  ┌────────────────────┐                      │
│  │ Snyk Vuln Database │  ← Checks against    │
│  │ (CVE/NVD/Snyk DB)  │    known CVEs        │
│  └────────┬───────────┘                      │
│           │                                  │
│           ▼                                  │
│  ┌────────────────────┐                      │
│  │   Report / Alert   │  ← Pass or Fail      │
│  └────────────────────┘                      │
└──────────────────────────────────────────────┘
```

**Result:** ✅ `No vulnerable paths found` — Dependencies are clean.

**Pipeline Configuration (SCA Job):**

```yaml
snyk-scan:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v3
    - uses: actions/setup-node@v3
      with:
        node-version: '18'
    - run: npm install
    - run: npm install -g snyk
    - run: snyk test --severity-threshold=high
      env:
        SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
```

> 🔑 **Snyk Token** is stored as a GitHub Actions Secret (`SNYK_TOKEN`) — never hardcoded.

---

### 🌐 DAST – OWASP ZAP

**Dynamic Application Security Testing**

OWASP ZAP (Zed Attack Proxy) interacts with a **running** instance of the application — simulating real-world attacks like an external attacker would.

```
┌──────────────────────────────────────────────┐
│             HOW OWASP ZAP WORKS              │
│                                              │
│  ┌──────────────────┐                        │
│  │  App Running on  │  ← python3 -m          │
│  │  localhost:8080  │    http.server / Node  │
│  └────────┬─────────┘                        │
│           │                                  │
│           ▼                                  │
│  ┌────────────────────┐                      │
│  │  ZAP Spider/Scan   │  ← Crawls the app    │
│  │  (Active Scan)     │    & probes endpoints │
│  └────────┬───────────┘                      │
│           │                                  │
│           ▼                                  │
│  ┌────────────────────┐                      │
│  │  Attack Simulation │  ← XSS, SQLi, etc.  │
│  └────────┬───────────┘                      │
│           │                                  │
│           ▼                                  │
│  ┌────────────────────┐                      │
│  │   ZAP HTML Report  │  ← Saved as artifact │
│  └────────────────────┘                      │
└──────────────────────────────────────────────┘
```

**Pipeline Configuration (DAST Job):**

```yaml
zap-scan:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v3
    - name: Start application server
      run: |
        python3 -m http.server 8080 &
        sleep 5
    - name: Run OWASP ZAP Scan
      uses: zaproxy/action-baseline@v0.9.0
      with:
        target: 'http://localhost:8080'
    - name: Upload ZAP Report
      uses: actions/upload-artifact@v3
      with:
        name: zap-report
        path: report_html.html
```

---

## ⚙️ Pipeline Configuration

The complete `.github/workflows/devsecops.yml` pipeline:

```yaml
name: DevSecOps Pipeline

on:
  push:
    branches: [ "main" ]
  pull_request:
    branches: [ "main" ]

jobs:

  # ─── Job 1: SAST with CodeQL ───────────────────────────
  codeql-analysis:
    name: SAST – CodeQL Analysis
    runs-on: ubuntu-latest
    permissions:
      security-events: write
      actions: read
      contents: read
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Initialize CodeQL
        uses: github/codeql-action/init@v2
        with:
          languages: javascript

      - name: Autobuild
        uses: github/codeql-action/autobuild@v2

      - name: Perform CodeQL Analysis
        uses: github/codeql-action/analyze@v2

  # ─── Job 2: SCA with Snyk ──────────────────────────────
  snyk-scan:
    name: SCA – Snyk Dependency Scan
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm install

      - name: Run Snyk scan
        run: |
          npm install -g snyk
          snyk test --severity-threshold=high
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}

  # ─── Job 3: DAST with OWASP ZAP ────────────────────────
  zap-scan:
    name: DAST – OWASP ZAP Scan
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Start application server
        run: |
          python3 -m http.server 8080 &
          sleep 5

      - name: Run OWASP ZAP Baseline Scan
        uses: zaproxy/action-baseline@v0.9.0
        with:
          target: 'http://localhost:8080'

      - name: Upload ZAP Report
        uses: actions/upload-artifact@v3
        with:
          name: zap-security-report
          path: report_html.html
```

---

## 🚨 Vulnerability Detection & Fix

### Phase 1 — Detection

CodeQL flagged a **Reflected XSS** vulnerability in `app.js`:

```
⚠️  Security Alert: Reflected Cross-Site Scripting (XSS)
    Severity   : HIGH
    CWE        : CWE-79
    Location   : app.js, line 8
    Description: User-controlled data is directly reflected in the
                 HTTP response without sanitization.
```

**Attack Example:**
```
GET /user?name=<script>alert('XSS')</script>

Response: Hello <script>alert('XSS')</script>
          ↑ Script executes in victim's browser!
```

---

### Phase 2 — Fix

The vulnerability was patched by adding an HTML sanitization function:

```javascript
// ✅ FIXED VERSION — app.js

const express = require('express');
const app = express();

// Sanitization function — escapes dangerous HTML characters
function escapeHTML(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

app.get('/user', (req, res) => {
  const name = escapeHTML(req.query.name || '');  // ✅ Sanitized
  res.send("Hello " + name);
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

**Before vs After:**

| Input | Before Fix | After Fix |
|-------|-----------|-----------|
| `<script>alert(1)</script>` | ⚠️ Script executes | ✅ Rendered as plain text |
| `<img src=x onerror=alert(1)>` | ⚠️ JS executes | ✅ Safely escaped |
| `John` | ✅ Normal | ✅ Normal |

---

### Phase 3 — Validation

After pushing the fix:

```bash
git add .
git commit -m "fix: sanitize user input to prevent XSS (CWE-79)"
git push origin main
```

The pipeline re-ran automatically → **CodeQL found 0 vulnerabilities** ✅

---

## 📊 Results

### Security Scan Summary

```
┌─────────────────────────────────────────────────────────┐
│               FINAL PIPELINE RESULTS                    │
├────────────────────┬──────────────┬─────────────────────┤
│  Tool              │  Before Fix  │  After Fix          │
├────────────────────┼──────────────┼─────────────────────┤
│  CodeQL (SAST)     │  ❌ 1 HIGH   │  ✅ 0 Issues        │
│  Snyk (SCA)        │  ✅ Clean    │  ✅ Clean           │
│  OWASP ZAP (DAST)  │  ✅ Complete │  ✅ Complete        │
└────────────────────┴──────────────┴─────────────────────┘
```

### What Was Achieved

- ✅ Automated pipeline triggers on every `git push`
- ✅ Real XSS vulnerability detected by CodeQL
- ✅ Dependency security validated by Snyk
- ✅ Runtime application scanned by OWASP ZAP
- ✅ Vulnerability patched and re-validated automatically
- ✅ Results visible in GitHub → Security → Code Scanning Alerts

---

## 🧠 Key Learnings

### DevSecOps Concepts Applied

```
Shift-Left Security
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Traditional:  Dev → Dev → Dev → Test → [Security] → Deploy
                                            ↑
                                    (too late, too costly)

DevSecOps:   Dev → [SAST] → [SCA] → [DAST] → Deploy
                      ↑        ↑       ↑
                   (early, automated, continuous)
```

### Security Coverage Model

```
         ┌─────────────────────────────────────────┐
         │            APPLICATION LAYERS            │
         │                                         │
         │  ┌──────────────┐  ← Covered by CodeQL  │
         │  │  Source Code │    (SAST)              │
         │  └──────────────┘                        │
         │  ┌──────────────┐  ← Covered by Snyk     │
         │  │ Dependencies │    (SCA)               │
         │  └──────────────┘                        │
         │  ┌──────────────┐  ← Covered by ZAP      │
         │  │ Runtime/HTTP │    (DAST)              │
         │  └──────────────┘                        │
         └─────────────────────────────────────────┘
```

### GitHub Secrets Used

| Secret Name | Purpose |
|-------------|---------|
| `SNYK_TOKEN` | Authenticates Snyk CLI with Snyk platform |

---

## 🏁 Conclusion

This project is a **real-world implementation** of DevSecOps principles — not just theory.

> By integrating CodeQL, Snyk, and OWASP ZAP into a single GitHub Actions pipeline, security became an automated, continuous, and non-negotiable part of the development workflow. A real vulnerability was introduced, detected, fixed, and re-validated — all through automation.

---

<div align="center">

**Built with 🔐 on Kali Linux | Powered by GitHub Actions**

![CodeQL](https://img.shields.io/badge/CodeQL-SAST-blue?style=flat-square&logo=github)
![Snyk](https://img.shields.io/badge/Snyk-SCA-4C4A73?style=flat-square&logo=snyk&logoColor=white)
![OWASP ZAP](https://img.shields.io/badge/OWASP_ZAP-DAST-orange?style=flat-square&logo=owasp)
![Kali Linux](https://img.shields.io/badge/Kali_Linux-557C94?style=flat-square&logo=kali-linux&logoColor=white)

</div>
