<h1 align="center">
  <img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&weight=700&size=45&duration=4000&color=00D4FF&center=true&vCenter=true&lines=commitgpt+%E2%9A%A1" alt="commitgpt">
</h1>

<p align="center">
  <strong>AI-powered commit messages, standups, and PR descriptions</strong><br>
  <em>Generated from your git diff in 2 seconds</em>
</p>

<div align="center">

![PyPI](https://img.shields.io/badge/PyPI-1.0.0-00D4FF?style=flat-square&logo=pypi)
![Python](https://img.shields.io/badge/Python-3.8+-3776AB?style=flat-square&logo=python)
![License](https://img.shields.io/badge/License-MIT-FF6B6B?style=flat-square)
![Status](https://img.shields.io/badge/Status-Active-00D4FF?style=flat-square)

</div>

---

## 🚀 The Problem

Every day developers waste time writing:

- ❌ `git commit -m "fix"` — lazy, meaningless messages
- ❌ Standup updates — "what did I do yesterday??"
- ❌ PR descriptions — explaining changes all over again

**commitgpt fixes all 3 with one command** ✅

---

## 💻 Demo

```bash
$ git add .
$ cmt

✨ feat(auth): add Google OAuth2 login with session timeout

- Implemented OAuth2 flow using Google provider
- Sessions expire after 30 mins of inactivity
- Fixed bug where users stayed logged in after password change
- Added redirect to dashboard on successful login
```

---

## 📥 Install

```bash
pip install commitgpt-nikesh
```

---

## 🔐 Setup

Choose **ONE** option:

### Option 1: GitHub Token (FREE)

✓ No credit card
✓ 150 requests/day

1. Go to [github.com](https://github.com) → Settings
2. Developer Settings → Personal Access Tokens → Tokens (classic)
3. Generate new token
4. Copy token (starts with `ghp_`)

Create `.env`:
```
GITHUB_TOKEN=ghp_your_token_here
```

---

### Option 2: Gemini (FREE - Best)

✓ No credit card
✓ 1,500 requests/day

1. Go to [aistudio.google.com](https://aistudio.google.com)
2. Get API Key → Create API key
3. Copy key (starts with `AIza`)

Create `.env`:
```
GEMINI_API_KEY=AIza_your_key_here
```

---

### Option 3: OpenAI (Paid)

✓ Best quality
✓ ~$0.001 per request

1. Go to [platform.openai.com](https://platform.openai.com)
2. API Keys → Create secret key
3. Copy key (starts with `sk-proj-`)

Create `.env`:
```
OPENAI_API_KEY=sk-proj-your_key_here
```

---

### Option 4: Anthropic Claude (Paid)

✓ Great quality
✓ ~$0.001 per request

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. API Keys → Create Key
3. Copy key (starts with `sk-ant-`)

Create `.env`:
```
ANTHROPIC_API_KEY=sk-ant-your_key_here
```

---

## 🔒 Make Token Permanent

**Mac/Linux:**
```bash
echo 'export GITHUB_TOKEN=ghp_yourtoken' >> ~/.zshrc
source ~/.zshrc
```

**Windows:**
```bash
setx GITHUB_TOKEN "ghp_yourtoken"
```

---

## 📖 Usage

### Commit Message
```bash
git add .
cmt
```

### Standup Report
```bash
cmt standup
```

Output:
```
Yesterday: Implemented OAuth2 login flow, fixed session expiry bug
Today: Writing tests for auth middleware, reviewing PR #42
Blockers: None
```

### PR Description
```bash
cmt pr
```

Output:
```
## What changed
Added Google OAuth2 login with automatic session timeout after 30 minutes.

## Why
Users were kept logged in indefinitely, creating a security risk.

## Testing
- Manual: tested login, logout, session expiry
- Unit: auth middleware coverage at 94%
- Edge: concurrent login sessions handled correctly
```

### Extra Flags

```bash
cmt --emoji    # Add emoji to message
cmt --copy     # Auto-copy to clipboard
```

---

## 🧠 How API Selection Works

Just add your key to `.env` and it auto-detects:

```
1. GITHUB_TOKEN       → GitHub Models (gpt-4o-mini)
2. GEMINI_API_KEY     → Gemini 2.0 Flash
3. OPENAI_API_KEY     → OpenAI gpt-4o-mini
4. ANTHROPIC_API_KEY  → Claude Haiku
```

**First key found gets used**

---

## ✅ Requirements

- Python 3.8+
- Git installed
- Any API key from above

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| `cmt: command not found` | `pip install commitgpt` |
| `No API key found` | Add key to `.env` file |
| `Not a git repository` | Run `git init` first |
| `No staged changes` | Run `git add .` first |
| `pip install fails` | Check: `python --version` |

---

## 🤝 Contributing

1. Fork the repo
2. Create branch: `git checkout -b feat/your-feature`
3. Make changes
4. Use commitgpt for your message 😄
5. Push and open PR

---

## 📄 License

MIT — Free to use, modify, and distribute

---

<div align="center">

[![Star](https://img.shields.io/github/stars/nikeshsundar/commitgpt?style=social)](https://github.com/nikeshsundar/commitgpt)
[![Fork](https://img.shields.io/github/forks/nikeshsundar/commitgpt?style=social)](https://github.com/nikeshsundar/commitgpt)
[![Watch](https://img.shields.io/github/watchers/nikeshsundar/commitgpt?style=social)](https://github.com/nikeshsundar/commitgpt)

<p>Made with ❤️ by <a href="https://github.com/nikeshsundar">Nikesh Sundar</a></p>

</div>