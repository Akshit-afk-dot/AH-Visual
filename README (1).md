# 🔍 AH-Visual — Attention Head Visualizer

A web-based mechanistic interpretability tool for visualizing and exploring attention head behavior in GPT-2 and other small transformer models. Built to make the internals of language models more legible and interactive.

---

## What It Does

Transformers learn by routing information through attention heads — but understanding *what* each head attends to is notoriously opaque. AH-Visual bridges that gap with an interactive interface that lets you:

- Input any text and watch attention patterns unfold in real time
- Inspect individual attention heads across all layers of GPT-2
- Identify patterns like induction heads, positional heads, and syntactic heads
- Compare attention distributions across heads and layers side by side

---

## Demo

> _Add a screenshot or GIF of the interface here_

---

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | JavaScript, HTML, CSS |
| Model inference | Python (Transformers / PyTorch) |
| Model | GPT-2 (via HuggingFace) |
| Visualization | D3.js / Canvas (see `mechinterp/`) |

---

## Project Structure

```
AH-Visual/
└── mechinterp/
    ├── app.js              # Main frontend application
    ├── index.html          # Entry point
    ├── style.css           # Styling
    └── ...                 # Inference backend, visualization logic
```

---

## Getting Started

### Prerequisites

- Python 3.9+
- Node.js (for frontend dev server, if applicable)
- A HuggingFace-compatible environment

### Installation

```bash
git clone https://github.com/Akshit-afk-dot/AH-Visual.git
cd AH-Visual
pip install transformers torch
```

### Run

```bash
# Start the backend (Python inference server)
python mechinterp/server.py

# Open index.html in your browser, or serve it:
npx serve mechinterp/
```

---

## How It Works

1. **Text input** — you provide a sentence or passage
2. **Tokenization** — GPT-2's tokenizer splits it into tokens
3. **Forward pass** — the model runs and attention weights are extracted from each head in each layer
4. **Visualization** — weights are rendered as an attention matrix, letting you trace which tokens attend to which

GPT-2 small has 12 layers × 12 heads = 144 attention heads in total. AH-Visual lets you navigate all of them.

---

## Background

This project is rooted in **mechanistic interpretability** — the effort to reverse-engineer neural networks into human-understandable algorithms. Key papers that inspired this work:

- [A Mathematical Framework for Transformer Circuits](https://transformer-circuits.pub/2021/framework/index.html) — Elhage et al., Anthropic (2021)
- [In-context Learning and Induction Heads](https://transformer-circuits.pub/2022/in-context-learning-and-induction-heads/index.html) — Olsson et al. (2022)
- [Attention is All You Need](https://arxiv.org/abs/1706.03762) — Vaswani et al. (2017)

---

## Roadmap

- [ ] Support for GPT-2 Medium / Large
- [ ] Attention head labeling (induction, positional, etc.)
- [ ] Token-level ablation experiments
- [ ] Export attention maps as images
- [ ] Support for other HuggingFace models

---

## License

MIT
