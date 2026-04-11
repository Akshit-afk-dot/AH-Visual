from activation_patch import patch_head

def discover_circuit(prompt_clean: str, prompt_corrupted: str) -> dict:
    n_layers = 12
    n_heads = 12
    results = []
    for layer in range(n_layers):
        for head in range(n_heads):
            res = patch_head(prompt_clean, prompt_corrupted, layer, head)
            results.append({
                "layer": layer,
                "head": head,
                "delta": res["delta"]
            })
    abs_sum = sum(abs(r["delta"]) for r in results) or 1e-8
    for r in results:
        r["importance"] = abs(r["delta"]) / abs_sum
    results_sorted = sorted(results, key=lambda x: abs(x["delta"]), reverse=True)[:10]
    return {
        "heads": results_sorted,
        "total_heads_tested": n_layers * n_heads
    }
