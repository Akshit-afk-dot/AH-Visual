export function renderCircuitGraph(data, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';
  const heads = data.heads;
  // D3 force-directed graph
  const width = 600, height = 320;
  const svg = d3.create('svg').attr('width', width).attr('height', height);
  const minR = 18, maxR = 38;
  const minImp = Math.min(...heads.map(h => h.importance));
  const maxImp = Math.max(...heads.map(h => h.importance));
  const colorScale = d3.scaleLinear().domain([minImp, maxImp]).range(['#888', '#7c6af7']);
  const nodes = heads.map((h, i) => ({
    id: i,
    label: `L${h.layer}H${h.head}`,
    ...h,
    r: minR + (maxR - minR) * h.importance
  }));
  const links = [];
  for (let i = 0; i < nodes.length - 1; ++i) {
    if (nodes[i + 1].layer === nodes[i].layer + 1) {
      links.push({ source: nodes[i].id, target: nodes[i + 1].id });
    }
  }
  const simulation = d3.forceSimulation(nodes)
    .force('link', d3.forceLink(links).distance(120).strength(0.7))
    .force('charge', d3.forceManyBody().strength(-220))
    .force('center', d3.forceCenter(width / 2, height / 2))
    .on('tick', ticked);
  function ticked() {
    svg.selectAll('*').remove();
    svg.selectAll('line')
      .data(links)
      .join('line')
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y)
      .attr('stroke', '#333')
      .attr('stroke-width', 2);
    svg.selectAll('circle')
      .data(nodes)
      .join('circle')
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
      .attr('r', d => d.r)
      .attr('fill', d => colorScale(d.importance))
      .attr('stroke', '#7c6af7')
      .attr('stroke-width', 2)
      .on('mouseenter', function (e, d) {
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
        tooltip.innerHTML = `<b>${d.label}</b><br>Layer: ${d.layer}<br>Head: ${d.head}<br>Delta: ${d.delta.toFixed(4)}<br>Importance: ${(d.importance * 100).toFixed(2)}%`;
        document.body.appendChild(tooltip);
        this.onmousemove = ev => {
          tooltip.style.left = ev.clientX + 10 + 'px';
          tooltip.style.top = ev.clientY + 10 + 'px';
        };
        this.onmouseleave = () => {
          tooltip.remove();
        };
      });
    svg.selectAll('text')
      .data(nodes)
      .join('text')
      .attr('x', d => d.x)
      .attr('y', d => d.y + 4)
      .attr('text-anchor', 'middle')
      .attr('fill', '#fff')
      .attr('font-size', '1em')
      .attr('font-family', 'Fira Mono, monospace')
      .text(d => d.label);
  }
  container.appendChild(svg.node());
  // Bar chart
  const barDiv = document.createElement('div');
  barDiv.style.marginTop = '32px';
  barDiv.innerHTML = '<b>Top 10 Head Importances</b>';
  const barSvg = d3.create('svg').attr('width', 600).attr('height', 120);
  const barScale = d3.scaleLinear().domain([0, maxImp]).range([0, 480]);
  barSvg.selectAll('rect')
    .data(nodes)
    .join('rect')
    .attr('x', 80)
    .attr('y', (d, i) => 16 + i * 10)
    .attr('width', d => barScale(d.importance))
    .attr('height', 8)
    .attr('fill', d => colorScale(d.importance));
  barSvg.selectAll('text')
    .data(nodes)
    .join('text')
    .attr('x', 10)
    .attr('y', (d, i) => 24 + i * 10)
    .attr('fill', '#e0e0e0')
    .attr('font-size', '0.95em')
    .attr('font-family', 'Fira Mono, monospace')
    .text(d => d.label);
  barDiv.appendChild(barSvg.node());
  container.appendChild(barDiv);
}
