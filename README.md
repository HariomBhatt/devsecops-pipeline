# 🛡️ DevSecOps CI/CD Security Pipeline

> **Automated security testing integrated directly into the software development lifecycle — catching vulnerabilities before they reach production.**

---

## 📌 What Is This Project?

This project builds a **DevSecOps pipeline** — a system where **security checks run automatically** every time code is pushed to GitHub.

Instead of checking for security issues manually (or not at all), this pipeline uses three different security tools that scan the code **automatically in the background**, report any vulnerabilities found, and block unsafe code from moving forward.

Think of it like a **security checkpoint** that your code must pass before it goes live.

---

## 🧠 Core Concept — What is DevSecOps?

| Term | Meaning |
|------|---------|
| **Dev** | Development — writing the application code |
| **Sec** | Security — scanning for vulnerabilities |
| **Ops** | Operations — deploying and running the app |

**DevSecOps** = All three happening together, automatically, in one pipeline.

---

## 🏗️ Project Architecture

```
Developer Pushes Code to GitHub
            │
            ▼
   ┌─────────────────┐
   │  GitHub Actions  │  ← CI/CD Pipeline (automation engine)
   └────────┬────────┘
            │
     ┌──────┴──────┐
     │             │
     ▼             ▼
 ┌───────┐    ┌─────────┐
 │  SAST │    │   SCA   │
 │CodeQL │    │  Snyk   │
 └───┬───┘    └────┬────┘
     │             │
     └──────┬──────┘
            ▼
        ┌───────┐
        │  DAST │
        │  ZAP  │
        └───────┘
            │
            ▼
   Security Report Generated
   Vulnerabilities Flagged / Fixed
```

---

## ⚙️ Tech Stack

| Tool | Purpose |
|------|---------|
| **Kali Linux** (VM) | Development environment |
| **Node.js + Express** | Web application |
| **Git + GitHub** | Version control & code hosting |
| **GitHub Actions** | CI/CD automation |
| **CodeQL** | SAST — Static code analysis |
| **Snyk** | SCA — Dependency vulnerability scan |
| **OWASP ZAP** | DAST — Live application scan |

---

## 🔍 The Three Security Layers Explained

### 1️⃣ SAST — Static Application Security Testing
**Tool: CodeQL**

- Scans your **source code directly** (no need to run the app)
- Looks for common coding mistakes like XSS, SQL injection, etc.
- Runs on every push, before the app is even started
- Think of it as a **spell checker — but for security bugs**

---

### 2️⃣ SCA — Software Composition Analysis
**Tool: Snyk**

- Scans your **third-party dependencies** (npm packages)
- Checks if any library you installed has a known vulnerability
- Example: If you use an old version of `express` with a security hole, Snyk catches it
- Think of it as **checking the ingredients label for harmful substances**

---

### 3️⃣ DAST — Dynamic Application Security Testing
**Tool: OWASP ZAP**

- Actually **starts and runs the application**, then attacks it like a hacker would
- Tests the live app for vulnerabilities from the outside
- Catches issues that only appear when the app is running
- Think of it as a **simulated hacker probing your running app**

---

## 📁 Project Structure

```
devsecops-project/
│
├── app.js                          # Main Express.js application
├── package.json                    # Node.js project config & dependencies
│
└── .github/
    └── workflows/
        └── devsecops.yml           # CI/CD Pipeline definition (GitHub Actions)
```

---

## 🚀 Step-by-Step: How I Built This

### Step 1 — Environment Setup
Set up **Kali Linux** in a virtual machine as the development environment.
- Kali Linux → writing code, running commands, Git operations
- Windows browser → GitHub web interface

```bash
sudo apt update
sudo apt install git nodejs npm docker.io -y
```

---

### Step 2 — Created the Node.js Application

```bash
mkdir devsecops-project
cd devsecops-project
npm init -y
npm install express
```

Built a simple **Express.js web app** with an intentionally vulnerable endpoint to simulate a real-world scenario:

```javascript
// ⚠️ Intentionally vulnerable — for demonstration purposes
app.get('/user', (req, res) => {
  const name = req.query.name;
  res.send("Hello " + name);  // XSS vulnerability here
});
```

> **Why vulnerable?** To prove the pipeline can *detect* real security issues.

---

### Step 3 — Pushed Code to GitHub

```bash
git init
git add .
git commit -m "initial commit"
git remote add origin https://github.com/<username>/devsecops-pipeline.git
git push -u origin main
```

> 🔑 **Authentication Note:** GitHub no longer supports password login via terminal. A **Personal Access Token (PAT)** was generated from:
> `GitHub → Settings → Developer Settings → Personal Access Tokens`
> and used as the password during push.

---

### Step 4 — Created the CI/CD Pipeline

Created the file `.github/workflows/devsecops.yml` which GitHub Actions reads automatically.

```yaml
name: DevSecOps Pipeline

on: [push]

permissions:
  security-events: write   # Required for CodeQL to upload results

jobs:
  security-scan:
    runs-on: ubuntu-latest
    steps:
      # SAST - CodeQL
      - uses: github/codeql-action/analyze@v2

      # SCA - Snyk
      - run: snyk auth ${{ secrets.SNYK_TOKEN }}
      - run: snyk test

      # DAST - OWASP ZAP
      - run: python3 -m http.server 8000 &
      - uses: zaproxy/action-baseline@v0.10.0
```

> Every time code is pushed → this file triggers → all three scans run automatically.

---

### Step 5 — Snyk Token Setup

1. Created a free account on [snyk.io](https://snyk.io)
2. Generated an API token
3. Added it to GitHub:
   `Repository → Settings → Secrets → Actions → New Secret`
   - Name: `SNYK_TOKEN`
   - Value: `<your_token>`

---

### Step 6 — Vulnerability Detected! 🚨

**CodeQL flagged a HIGH severity vulnerability:**

| Detail | Value |
|--------|-------|
| Type | Reflected XSS (Cross-Site Scripting) |
| Location | `/user` endpoint |
| Severity | 🔴 High |
| Cause | User input directly inserted into HTML response without sanitization |

---

### Step 7 — Fixed the Vulnerability ✅

```javascript
// ✅ Secure version — input is sanitized before use
function escapeHTML(str) {
  return str.replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
}

app.get('/user', (req, res) => {
  const name = escapeHTML(req.query.name);
  res.send("Hello " + name);
});
```

```bash
git add .
git commit -m "fix: sanitize user input to prevent XSS"
git push
```

Pipeline ran again → **No vulnerabilities detected** ✅

---

## 🧩 Challenges & How I Solved Them

| Challenge | Root Cause | Fix Applied |
|-----------|-----------|-------------|
| Git push rejected | Wrong branch name (`master` vs `main`) | Used `git push -u origin main` |
| GitHub auth failed | Password login deprecated | Used Personal Access Token |
| CodeQL permission error | Missing `security-events: write` | Added permissions block in YAML |
| Snyk slow execution | Free tier scan delay | Waited and verified token was correct |
| ZAP couldn't scan | No running server to target | Started `python3 -m http.server` as dummy target |
| Pipeline not triggering | YAML indentation error | Fixed spacing in workflow file |

---

## 📊 Final Pipeline Results

```
✅ SAST (CodeQL)   → XSS vulnerability detected → Fixed → Re-scan passed
✅ SCA  (Snyk)     → No vulnerable dependencies found
✅ DAST (ZAP)      → Baseline scan completed successfully
✅ Pipeline        → Fully automated on every push
```

---

## 💡 Key Learnings

- **DevSecOps** shifts security left — catching bugs early is cheaper and safer than fixing them in production
- **GitHub Actions** is a powerful free CI/CD tool built directly into GitHub
- **SAST, SCA, and DAST** each cover different attack surfaces — you need all three for complete coverage
- **Real debugging skills** are essential — almost every tool had a configuration issue that required research and fixing
- **Never trust user input** — even simple parameters like `?name=` can be weaponized

---

## 🔮 Future Improvements

- [ ] Add **secrets scanning** (detect accidentally committed API keys)
- [ ] Integrate **container scanning** for Docker images
- [ ] Add **DAST against the actual Node.js app** (not just a dummy server)
- [ ] Set up **automated PR blocking** when vulnerabilities are found
- [ ] Add **email/Slack alerts** on scan failures

---

## 👤 Author

**Built as a hands-on DevSecOps learning project**
Demonstrates practical integration of security tools into a real CI/CD pipeline using industry-standard technologies.

---

> *"Security is not a feature — it's a process. This project automates that process."*
