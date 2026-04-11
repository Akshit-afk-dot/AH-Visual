from model_loader import ModelLoader
import torch
import torch.nn.functional as F

def get_logit_lens(prompt: str) -> dict:
    model = ModelLoader.get_model()
    tokens = model.to_tokens(prompt)
    with torch.no_grad():
        _, cache = model.run_with_cache(tokens)
    decoded = model.to_str_tokens(tokens[0])
    tokens_clean = [t.lstrip() for t in decoded]
    layers = []
    for layer in range(model.cfg.n_layers):
        resid = cache["resid_post", layer][0]  # (seq, d_model)
        normed = model.ln_final(resid)
        logits = model.unembed(normed)  # (seq, vocab)
        probs = F.softmax(logits, dim=-1)
        layer_out = []
        for pos in range(probs.shape[0]):
            topk = torch.topk(probs[pos], 5)
            top_tokens = [model.tokenizer.decode([i]) for i in topk.indices.tolist()]
            top_tokens = [t.lstrip() for t in top_tokens]
            layer_out.append({
                "top_tokens": top_tokens,
                "probs": topk.values.tolist()
            })
        layers.append(layer_out)
    return {"tokens": tokens_clean, "layers": layers}
