from model_loader import ModelLoader
import torch

def get_attention_patterns(prompt: str) -> dict:
    model = ModelLoader.get_model()
    tokens = model.to_tokens(prompt)
    with torch.no_grad():
        _, cache = model.run_with_cache(tokens)
    decoded = model.to_str_tokens(tokens[0])
    tokens_clean = [t.lstrip() for t in decoded]
    patterns = []
    for layer in range(model.cfg.n_layers):
        layer_heads = []
        attn = cache["pattern", layer, "attn"][0]  # (n_heads, seq, seq)
        for head in range(model.cfg.n_heads):
            head_attn = attn[head].cpu().tolist()
            layer_heads.append(head_attn)
        patterns.append(layer_heads)
    return {"tokens": tokens_clean, "patterns": patterns}
