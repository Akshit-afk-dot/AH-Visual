export function renderLogitLens(data, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';
  const nLayers = data.layers.length;
  const nTokens = data.tokens.length;
  const grid = document.createElement('div');
  grid.style.display = 'grid';
  grid.style.gridTemplateColumns = `40px repeat(${nTokens}, 1fr)`;
  grid.style.gridTemplateRows = `32px repeat(${nLayers}, 1fr)`;
  grid.style.gap = '2px';
  // Top labels
  grid.appendChild(document.createElement('div'));
  for (let t = 0; t < nTokens; ++t) {
    const label = document.createElement('div');
    label.textContent = data.tokens[t];
    label.style.textAlign = 'center';
    label.style.color = '#7c6af7';
    label.style.fontWeight = 'bold';
    grid.appendChild(label);
  }
  // Rows
  for (let l = 0; l < nLayers; ++l) {
    const rowLabel = document.createElement('div');
    rowLabel.textContent = `L${l}`;
    rowLabel.style.display = 'flex';
    rowLabel.style.alignItems = 'center';
    rowLabel.style.color = '#7c6af7';
    rowLabel.style.fontWeight = 'bold';
    grid.appendChild(rowLabel);
    for (let t = 0; t < nTokens; ++t) {
      const cell = data.layers[l][t];
      const prob = cell.probs[0];
      const bg = `rgba(124,106,247,${prob})`;
      const div = document.createElement('div');
      div.style.background = bg;
      div.style.color = prob > 0.5 ? '#fff' : '#e0e0e0';
      div.style.textAlign = 'center';
      div.style.fontFamily = 'Fira Mono, monospace';
      div.style.fontSize = '0.95em';
      div.style.borderRadius = '4px';
      div.style.cursor = 'pointer';
      div.textContent = cell.top_tokens[0];
      div.onmouseenter = e => {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.style.position = 'fixed';
        tooltip.style.left = e.clientX + 10 + 'px';
        tooltip.style.top = e.clientY + 10 + 'px';
        tooltip.style.background = '#242424';
        tooltip.style.color = '#e0e0e0';
        tooltip.style.border = '1px solid #7c6af7';
        tooltip.style.padding = '10px';
        tooltip.style.borderRadius = '8px';
        tooltip.style.zIndex = 1000;
        let bars = '';
        for (let i = 0; i < cell.top_tokens.length; ++i) {
          bars += `<div style='display:flex;align-items:center;gap:6px;'><span style='width:40px;display:inline-block;'>${cell.top_tokens[i]}</span><div style='background:#7c6af7;height:8px;width:${Math.round(cell.probs[i] * 80)}px;display:inline-block;'></div><span>${(cell.probs[i] * 100).toFixed(1)}%</span></div>`;
        }
        tooltip.innerHTML = `<b>Layer ${l} Token ${data.tokens[t]}</b><br>${bars}`;
        document.body.appendChild(tooltip);
        div.onmousemove = ev => {
          tooltip.style.left = ev.clientX + 10 + 'px';
          tooltip.style.top = ev.clientY + 10 + 'px';
        };
        div.onmouseleave = () => {
          tooltip.remove();
        };
      };
      grid.appendChild(div);
    }
  }
  container.appendChild(grid);
}
