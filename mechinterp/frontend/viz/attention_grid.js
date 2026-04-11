export function renderAttentionGrid(data, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';
  const nLayers = data.patterns.length;
  const nHeads = data.patterns[0].length;
  const seqLen = data.tokens.length;
  const grid = document.createElement('div');
  grid.style.display = 'grid';
  grid.style.gridTemplateColumns = `40px repeat(${nHeads}, 1fr)`;
  grid.style.gridTemplateRows = `32px repeat(${nLayers}, 1fr)`;
  grid.style.gap = '2px';
  // Top labels
  grid.appendChild(document.createElement('div'));
  for (let h = 0; h < nHeads; ++h) {
    const label = document.createElement('div');
    label.textContent = `H${h}`;
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
    for (let h = 0; h < nHeads; ++h) {
      const attn = data.patterns[l][h];
      const heatmap = document.createElement('canvas');
      const size = Math.max(4 * seqLen, 32);
      heatmap.width = size;
      heatmap.height = size;
      heatmap.style.width = '100%';
      heatmap.style.height = '100%';
      const ctx = heatmap.getContext('2d');
      for (let y = 0; y < seqLen; ++y) {
        for (let x = 0; x < seqLen; ++x) {
          const v = attn[y][x];
          ctx.fillStyle = `rgb(${255 - v * 124}, ${255 - v * 149}, ${255})`;
          ctx.fillRect(x * size / seqLen, y * size / seqLen, size / seqLen, size / seqLen);
        }
      }
      heatmap.style.border = '1px solid #333';
      heatmap.style.borderRadius = '4px';
      heatmap.style.cursor = 'pointer';
      heatmap.onmouseenter = e => {
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
        tooltip.innerHTML = `<b>Layer ${l} Head ${h}</b><br><pre style='font-size:0.9em'>${JSON.stringify(attn, null, 1)}</pre>`;
        document.body.appendChild(tooltip);
        heatmap.onmousemove = ev => {
          tooltip.style.left = ev.clientX + 10 + 'px';
          tooltip.style.top = ev.clientY + 10 + 'px';
        };
        heatmap.onmouseleave = () => {
          tooltip.remove();
        };
      };
      heatmap.onclick = () => {
        window.selectedHead = { layer: l, head: h };
        document.querySelectorAll('canvas').forEach(c => c.style.outline = '');
        heatmap.style.outline = '2px solid #7c6af7';
      };
      grid.appendChild(heatmap);
    }
  }
  container.appendChild(grid);
}
