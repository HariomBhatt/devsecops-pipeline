<div align="center">

# 🌐 OWASP ZAP — DAST Scan Report

**Tool:** ZAP by [Checkmarx](https://checkmarx.com/) &nbsp;|&nbsp; **Target:** `http://127.0.0.1:3000` &nbsp;|&nbsp; **Scan Type:** Baseline

![High](https://img.shields.io/badge/High-0-brightgreen?style=flat-square)
![Medium](https://img.shields.io/badge/Medium-3-orange?style=flat-square)
![Low](https://img.shields.io/badge/Low-6-yellow?style=flat-square)
![Info](https://img.shields.io/badge/Informational-1-blue?style=flat-square)

</div>

---

## 📊 Summary of Alerts

| Severity | Count | Status |
|:--------:|:-----:|:------:|
| 🔴 **High** | 0 | ✅ None Found |
| 🟠 **Medium** | 3 | ⚠️ Action Required |
| 🟡 **Low** | 6 | 🔧 Should Fix |
| 🔵 **Informational** | 1 | ℹ️ Review |
| **Total** | **10** | |

---

## 📈 Scan Insights

| Level | Type | Site | Metric | Value |
|:-----:|:----:|:-----|:-------|:-----:|
| ⚠️ Low | Warning | — | ZAP errors logged | 1 |
| ⚠️ Low | Warning | — | ZAP warnings logged | 1 |
| ℹ️ Info | Informational | `127.0.0.1:3000` | Responses with status `2xx` | 50% |
| ℹ️ Info | Informational | `127.0.0.1:3000` | Responses with status `4xx` | 50% |
| ℹ️ Info | Informational | `127.0.0.1:3000` | Endpoints with content type `text/html` | 100% |
| ℹ️ Info | Informational | `127.0.0.1:3000` | Endpoints with method `GET` | 100% |
| ℹ️ Info | Informational | `127.0.0.1:3000` | Total endpoints scanned | 2 |

---

## 🚨 All Alerts — Quick Reference

| # | Severity | Alert | Instances |
|:--|:--------:|:------|:---------:|
| 1 | 🟠 **Medium** | CSP: Failure to Define Directive with No Fallback | 2 |
| 2 | 🟠 **Medium** | Content Security Policy (CSP) Header Not Set | 1 |
| 3 | 🟠 **Medium** | Missing Anti-Clickjacking Header | 1 |
| 4 | 🟡 **Low** | Cross-Origin-Embedder-Policy Header Missing or Invalid | 1 |
| 5 | 🟡 **Low** | Cross-Origin-Opener-Policy Header Missing or Invalid | 1 |
| 6 | 🟡 **Low** | Cross-Origin-Resource-Policy Header Missing or Invalid | 1 |
| 7 | 🟡 **Low** | Permissions Policy Header Not Set | 3 |
| 8 | 🟡 **Low** | Server Leaks Information via `X-Powered-By` Header | 3 |
| 9 | 🟡 **Low** | X-Content-Type-Options Header Missing | 1 |
| 10 | 🔵 **Info** | Storable and Cacheable Content | 3 |

---

## 🔍 Alert Details

---

### 🟠 `[MEDIUM]` — CSP: Failure to Define Directive with No Fallback

> **ZAP Alert ID:** [10055](https://www.zaproxy.org/docs/alerts/10055/) &nbsp;|&nbsp; **Confidence:** High &nbsp;|&nbsp; **Instances:** 2 &nbsp;|&nbsp; **CWE:** [693](https://cwe.mitre.org/data/definitions/693.html) &nbsp;|&nbsp; **WASC:** 15

#### 📝 Description
The Content Security Policy fails to define one of the directives that has no fallback to `default-src`. Missing or excluding `frame-ancestors` and `form-action` is equivalent to allowing anything from any origin.

#### 📍 Affected URLs

| URL | Method | Parameter | Evidence |
|:----|:------:|:----------|:---------|
| `http://127.0.0.1:3000/robots.txt` | GET | `Content-Security-Policy` | `default-src 'none'` |
| `http://127.0.0.1:3000/sitemap.xml` | GET | `Content-Security-Policy` | `default-src 'none'` |

> ⚠️ **Other Info:** The directives `frame-ancestors` and `form-action` do not fallback to `default-src` and must be explicitly defined.

#### ✅ Solution
```http
Content-Security-Policy: default-src 'self'; frame-ancestors 'none'; form-action 'self';
```
Ensure your web server / load balancer is properly configured to set the `Content-Security-Policy` header with all required directives.

#### 🔗 References
- [W3C CSP Spec](https://www.w3.org/TR/CSP/)
- [Can I Use — CSP](https://caniuse.com/#search=content+security+policy)
- [content-security-policy.com](https://content-security-policy.com/)
- [HtmlUnit CSP](https://github.com/HtmlUnit/htmlunit-csp)
- [web.dev — CSP Resource Options](https://web.dev/articles/csp#resource-options)

---

### 🟠 `[MEDIUM]` — Content Security Policy (CSP) Header Not Set

> **ZAP Alert ID:** [10038](https://www.zaproxy.org/docs/alerts/10038/) &nbsp;|&nbsp; **Confidence:** High &nbsp;|&nbsp; **Instances:** 1 &nbsp;|&nbsp; **CWE:** [693](https://cwe.mitre.org/data/definitions/693.html) &nbsp;|&nbsp; **WASC:** 15

#### 📝 Description
CSP is an added layer of security that helps detect and mitigate XSS and data injection attacks. Without it, the browser has no policy governing which content sources are trusted, leaving users exposed to script injection, data theft, and malware distribution.

#### 📍 Affected URLs

| URL | Method |
|:----|:------:|
| `http://127.0.0.1:3000` | GET |

#### ✅ Solution
```js
// Express.js — Add CSP header via middleware
app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy", "default-src 'self'");
  next();
});
```

#### 🔗 References
- [MDN — CSP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP)
- [OWASP CSP Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html)
- [W3C CSP](https://www.w3.org/TR/CSP/)
- [web.dev — CSP](https://web.dev/articles/csp)

---

### 🟠 `[MEDIUM]` — Missing Anti-Clickjacking Header

> **ZAP Alert ID:** [10020](https://www.zaproxy.org/docs/alerts/10020/) &nbsp;|&nbsp; **Confidence:** Medium &nbsp;|&nbsp; **Instances:** 1 &nbsp;|&nbsp; **CWE:** [1021](https://cwe.mitre.org/data/definitions/1021.html) &nbsp;|&nbsp; **WASC:** 15

#### 📝 Description
The response does not protect against **Clickjacking** attacks. An attacker can embed this page in an invisible iframe and trick users into clicking elements they didn't intend to, potentially leading to credential theft or unintended actions.

#### 📍 Affected URLs

| URL | Method | Parameter |
|:----|:------:|:----------|
| `http://127.0.0.1:3000` | GET | `x-frame-options` |

#### ✅ Solution
```js
// Option 1 — X-Frame-Options header
res.setHeader("X-Frame-Options", "DENY");

// Option 2 — CSP frame-ancestors directive (modern browsers)
res.setHeader("Content-Security-Policy", "frame-ancestors 'none'");
```

> Use `DENY` if the page should never be framed. Use `SAMEORIGIN` if it can only be framed by your own domain.

#### 🔗 References
- [MDN — X-Frame-Options](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/X-Frame-Options)

---

### 🟡 `[LOW]` — Cross-Origin-Embedder-Policy (COEP) Header Missing or Invalid

> **ZAP Alert ID:** [90004](https://www.zaproxy.org/docs/alerts/90004/) &nbsp;|&nbsp; **Confidence:** Medium &nbsp;|&nbsp; **Instances:** 1 &nbsp;|&nbsp; **WASC:** 15

#### 📝 Description
The `Cross-Origin-Embedder-Policy` header prevents a document from loading cross-origin resources that don't explicitly grant permission via CORP or CORS. Without it, the page may be vulnerable to cross-origin data leakage attacks.

#### 📍 Affected URLs

| URL | Method | Parameter |
|:----|:------:|:----------|
| `http://127.0.0.1:3000` | GET | `Cross-Origin-Embedder-Policy` |

#### ✅ Solution
```js
res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
```

---

### 🟡 `[LOW]` — Cross-Origin-Opener-Policy (COOP) Header Missing or Invalid

> **ZAP Alert ID:** [90004](https://www.zaproxy.org/docs/alerts/90004/) &nbsp;|&nbsp; **Confidence:** Medium &nbsp;|&nbsp; **Instances:** 1 &nbsp;|&nbsp; **WASC:** 15

#### 📝 Description
The `Cross-Origin-Opener-Policy` header allows you to ensure a top-level document does not share a browsing context group with cross-origin documents. This protects against cross-origin attacks and ensures process isolation.

#### 📍 Affected URLs

| URL | Method | Parameter |
|:----|:------:|:----------|
| `http://127.0.0.1:3000` | GET | `Cross-Origin-Opener-Policy` |

#### ✅ Solution
```js
res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
```

---

### 🟡 `[LOW]` — Cross-Origin-Resource-Policy (CORP) Header Missing or Invalid

> **ZAP Alert ID:** [90004](https://www.zaproxy.org/docs/alerts/90004/) &nbsp;|&nbsp; **Confidence:** Medium &nbsp;|&nbsp; **Instances:** 1 &nbsp;|&nbsp; **WASC:** 15

#### 📝 Description
The `Cross-Origin-Resource-Policy` header blocks other origins from reading the response of the resources to which this header is applied. This protects against side-channel attacks such as Spectre.

#### 📍 Affected URLs

| URL | Method | Parameter |
|:----|:------:|:----------|
| `http://127.0.0.1:3000` | GET | `Cross-Origin-Resource-Policy` |

#### ✅ Solution
```js
res.setHeader("Cross-Origin-Resource-Policy", "same-origin");
```

---

### 🟡 `[LOW]` — Permissions Policy Header Not Set

> **ZAP Alert ID:** [10063](https://www.zaproxy.org/docs/alerts/10063/) &nbsp;|&nbsp; **Confidence:** Medium &nbsp;|&nbsp; **Instances:** 3 &nbsp;|&nbsp; **CWE:** [693](https://cwe.mitre.org/data/definitions/693.html) &nbsp;|&nbsp; **WASC:** 15

#### 📝 Description
The `Permissions-Policy` header restricts which browser features (camera, microphone, geolocation, etc.) can be used by the page. Without it, any embedded third-party script could request sensitive device permissions.

#### 📍 Affected URLs

| URL | Method |
|:----|:------:|
| `http://127.0.0.1:3000` | GET |
| `http://127.0.0.1:3000/robots.txt` | GET |
| `http://127.0.0.1:3000/sitemap.xml` | GET |

#### ✅ Solution
```js
res.setHeader("Permissions-Policy", "geolocation=(), microphone=(), camera=()");
```

#### 🔗 References
- [MDN — Permissions-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Permissions-Policy)
- [Feature Policy — Smashing Magazine](https://www.smashingmagazine.com/2018/12/feature-policy/)

---

### 🟡 `[LOW]` — Server Leaks Information via `X-Powered-By` Header

> **ZAP Alert ID:** [10037](https://www.zaproxy.org/docs/alerts/10037/) &nbsp;|&nbsp; **Confidence:** Medium &nbsp;|&nbsp; **Instances:** 3 &nbsp;|&nbsp; **CWE:** [497](https://cwe.mitre.org/data/definitions/497.html) &nbsp;|&nbsp; **WASC:** 13

#### 📝 Description
The server is leaking its technology stack via the `X-Powered-By` HTTP response header. This exposes that the application is running **Express.js**, which helps attackers identify known framework-specific vulnerabilities to exploit.

#### 📍 Affected URLs

| URL | Method | Evidence |
|:----|:------:|:---------|
| `http://127.0.0.1:3000` | GET | `X-Powered-By: Express` |
| `http://127.0.0.1:3000/robots.txt` | GET | `X-Powered-By: Express` |
| `http://127.0.0.1:3000/sitemap.xml` | GET | `X-Powered-By: Express` |

#### ✅ Solution
```js
// Disable X-Powered-By header in Express
app.disable("x-powered-by");
```

#### 🔗 References
- [OWASP — Fingerprint Web Framework](https://owasp.org/www-project-web-security-testing-guide/v42/4-Web_Application_Security_Testing/01-Information_Gathering/08-Fingerprint_Web_Application_Framework)
- [Troy Hunt — Don't Let Response Headers](https://www.troyhunt.com/shhh-dont-let-your-response-headers/)

---

### 🟡 `[LOW]` — X-Content-Type-Options Header Missing

> **ZAP Alert ID:** [10021](https://www.zaproxy.org/docs/alerts/10021/) &nbsp;|&nbsp; **Confidence:** Medium &nbsp;|&nbsp; **Instances:** 1 &nbsp;|&nbsp; **CWE:** [693](https://cwe.mitre.org/data/definitions/693.html) &nbsp;|&nbsp; **WASC:** 15

#### 📝 Description
The `X-Content-Type-Options: nosniff` header was not set. Without it, older browsers may perform **MIME-sniffing** — interpreting a response body as a different content type than declared, which can allow script injection via disguised files.

#### 📍 Affected URLs

| URL | Method | Parameter |
|:----|:------:|:----------|
| `http://127.0.0.1:3000` | GET | `x-content-type-options` |

> ⚠️ **Note:** This issue also applies to error pages (401, 403, 500) which are often affected by injection issues.

#### ✅ Solution
```js
res.setHeader("X-Content-Type-Options", "nosniff");
```

#### 🔗 References
- [OWASP — Security Headers](https://owasp.org/www-community/Security_Headers)
- [Microsoft IE Dev — MIME Sniffing](https://learn.microsoft.com/en-us/previous-versions/windows/internet-explorer/ie-developer/compatibility/gg622941(v=vs.85))

---

### 🔵 `[INFORMATIONAL]` — Storable and Cacheable Content

> **ZAP Alert ID:** [10049](https://www.zaproxy.org/docs/alerts/10049/) &nbsp;|&nbsp; **Confidence:** Medium &nbsp;|&nbsp; **Instances:** 3 &nbsp;|&nbsp; **CWE:** [524](https://cwe.mitre.org/data/definitions/524.html) &nbsp;|&nbsp; **WASC:** 13

#### 📝 Description
Responses are storable by proxy caches and may be served to other users directly from cache. If any response contains user-specific or sensitive data, this could lead to **information leakage** or session hijacking in shared network environments (corporate/educational proxies).

> ℹ️ **Note:** In the absence of an explicit caching directive, a heuristic lifetime of **1 year** was assumed per RFC 7234.

#### 📍 Affected URLs

| URL | Method |
|:----|:------:|
| `http://127.0.0.1:3000` | GET |
| `http://127.0.0.1:3000/robots.txt` | GET |
| `http://127.0.0.1:3000/sitemap.xml` | GET |

#### ✅ Solution
```http
Cache-Control: no-cache, no-store, must-revalidate, private
Pragma: no-cache
Expires: 0
```
```js
res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate, private");
res.setHeader("Pragma", "no-cache");
res.setHeader("Expires", "0");
```

#### 🔗 References
- [RFC 7234 — HTTP Caching](https://datatracker.ietf.org/doc/html/rfc7234)
- [RFC 7231 — HTTP Semantics](https://datatracker.ietf.org/doc/html/rfc7231)

---

## 🔧 Complete Fix — All Headers in One Middleware

Apply all security headers at once in your Express app:

```js
// app.js — Security Headers Middleware
app.disable("x-powered-by");

app.use((req, res, next) => {
  // 🟠 Medium fixes
  res.setHeader("Content-Security-Policy",
    "default-src 'self'; frame-ancestors 'none'; form-action 'self'");
  res.setHeader("X-Frame-Options", "DENY");

  // 🟡 Low fixes
  res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader("Cross-Origin-Resource-Policy", "same-origin");
  res.setHeader("Permissions-Policy", "geolocation=(), microphone=(), camera=()");
  res.setHeader("X-Content-Type-Options", "nosniff");

  // 🔵 Informational fix
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate, private");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");

  next();
});
```

---

## ✅ Remediation Checklist

- [ ] 🟠 Add `Content-Security-Policy` header with `frame-ancestors` and `form-action`
- [ ] 🟠 Set `Content-Security-Policy` on all routes including `/`
- [ ] 🟠 Add `X-Frame-Options: DENY` to prevent clickjacking
- [ ] 🟡 Set `Cross-Origin-Embedder-Policy: require-corp`
- [ ] 🟡 Set `Cross-Origin-Opener-Policy: same-origin`
- [ ] 🟡 Set `Cross-Origin-Resource-Policy: same-origin`
- [ ] 🟡 Set `Permissions-Policy` to restrict device feature access
- [ ] 🟡 Run `app.disable("x-powered-by")` to hide framework info
- [ ] 🟡 Set `X-Content-Type-Options: nosniff`
- [ ] 🔵 Add explicit `Cache-Control` headers for sensitive responses

---

<div align="center">

*Generated by OWASP ZAP Baseline Scan &nbsp;|&nbsp; Part of the [DevSecOps Pipeline](../README.md)*

</div>
