from model_loader import ModelLoader
import torch
import torch.nn.functional as F

def patch_head(prompt_clean: str, prompt_corrupted: str, layer: int, head: int) -> dict:
    model = ModelLoader.get_model()
    tokens_clean = model.to_tokens(prompt_clean)
    tokens_corr = model.to_tokens(prompt_corrupted)
    with torch.no_grad():
        _, cache_clean = model.run_with_cache(tokens_clean)
        _, cache_corr = model.run_with_cache(tokens_corr)
    # Patch function
    def patch_hook(value, hook, **kwargs):
        # value: [batch, n_heads, seq, d_head]
        value[:, head] = cache_corr["z", layer][0, head]
        return value
    # Compute original logits
    resid_clean = cache_clean["resid_post", model.cfg.n_layers-1][0]
    normed_clean = model.ln_final(resid_clean)
    logits_clean = model.unembed(normed_clean)
    probs_clean = F.softmax(logits_clean[-1], dim=-1)
    top2_clean = torch.topk(probs_clean, 2)
    correct_idx, incorrect_idx = top2_clean.indices.tolist()[:2]
    # Patch and re-run
    with torch.no_grad():
        _, cache_patched = model.run_with_cache(
            tokens_clean,
            return_type=None,
            stop_at_layer=None,
            names_filter=None,
            prepend_hooks=[
                (f"blocks.{layer}.attn.hook_z", patch_hook)
            ]
        )
    resid_patched = cache_patched["resid_post", model.cfg.n_layers-1][0]
    normed_patched = model.ln_final(resid_patched)
    logits_patched = model.unembed(normed_patched)
    probs_patched = F.softmax(logits_patched[-1], dim=-1)
    original_logit_diff = (logits_clean[-1, correct_idx] - logits_clean[-1, incorrect_idx]).item()
    patched_logit_diff = (logits_patched[-1, correct_idx] - logits_patched[-1, incorrect_idx]).item()
    delta = patched_logit_diff - original_logit_diff
    interpretation = f"This head contributes {delta:.4f} to the output"
    return {
        "original_logit_diff": original_logit_diff,
        "patched_logit_diff": patched_logit_diff,
        "delta": delta,
        "interpretation": interpretation
    }
