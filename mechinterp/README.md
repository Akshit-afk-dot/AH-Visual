# MechInterp: Mechanistic Interpretability IDE

A local web app for interactively exploring GPT-2 Small's attention heads and circuits using TransformerLens. Visualize, patch, and discover circuits in a clean browser UI.

## Setup Instructions

```bash
cd mechinterp
pip install -r requirements.txt
cd backend && uvicorn main:app --reload
```
Then open [http://localhost:8000](http://localhost:8000) in your browser.

## How it works

- **Attention Patterns:** Visualize all 144 attention heads' patterns for any prompt. See which tokens each head attends to at every layer.
- **Logit Lens:** See what each layer "thinks" the next token will be, for every position, using the model's unembedding.
- **Activation Patching:** Swap a single head's output between two prompts to see its causal effect on the model's prediction.
- **Circuit Discovery:** Systematically patch every head to find the most important ones for a given behavioral difference.

## Best Demo Prompts

1. When Mary and John went to the store, John gave a drink to
2. The Eiffel Tower is in the city of
3. The nurse said that she
