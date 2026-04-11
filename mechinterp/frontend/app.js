import { renderAttentionGrid } from './viz/attention_grid.js';
import { renderLogitLens } from './viz/logit_lens.js';
import { renderCircuitGraph } from './viz/circuit_graph.js';

const $ = sel => document.querySelector(sel);
const $$ = sel => document.querySelectorAll(sel);

const showSpinner = show => {
  $('#loading-spinner').style.display = show ? '' : 'none';
};

const showResult = (msg) => {
  const card = $('#result-card');
  card.textContent = msg;
  card.style.display = msg ? '' : 'none';
};

// Tab switching
$$('.tab').forEach(tab => {
  tab.onclick = () => {
    $$('.tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    $$('.tab-content').forEach(panel => panel.style.display = 'none');
    if (tab.dataset.tab === 'attention') $('#attention-container').style.display = '';
    if (tab.dataset.tab === 'logit') $('#logit-container').style.display = '';
    if (tab.dataset.tab === 'circuit') $('#circuit-container').style.display = '';
  };
});

$('#analyse-btn').onclick = async () => {
  showSpinner(true);
  showResult('');
  const prompt = $('#prompt').value;
  const [attn, logit] = await Promise.all([
    fetch('/api/attention', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    }).then(r => r.json()),
    fetch('/api/logit_lens', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    }).then(r => r.json())
  ]);
  renderAttentionGrid(attn, 'attention-container');
  renderLogitLens(logit, 'logit-container');
  showSpinner(false);
};

$('#patch-btn').onclick = async () => {
  if (!window.selectedHead) {
    showResult('Select a head in the grid first.');
    return;
  }
  showSpinner(true);
  const prompt_clean = $('#prompt').value;
  const prompt_corrupted = $('#corrupted-prompt').value;
  const { layer, head } = window.selectedHead;
  const res = await fetch('/api/patch', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt_clean, prompt_corrupted, layer, head })
  }).then(r => r.json());
  showResult(`Layer ${layer} Head ${head} contributes ${res.delta.toFixed(4)} to the output.`);
  showSpinner(false);
};

$('#circuit-btn').onclick = async () => {
  showSpinner(true);
  showResult('');
  $('#circuit-container').innerHTML = '<div style="color:#7c6af7">Testing 144 head combinations...</div>';
  const prompt_clean = $('#prompt').value;
  const prompt_corrupted = $('#corrupted-prompt').value;
  const res = await fetch('/api/circuit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt_clean, prompt_corrupted })
  }).then(r => r.json());
  renderCircuitGraph(res, 'circuit-container');
  showSpinner(false);
};
