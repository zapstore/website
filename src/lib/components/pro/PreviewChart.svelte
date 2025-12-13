<script>
  export let data = [];
  const max = Math.max(...data, 1);
  const width = data.length * 8;
  const points = data.map((v, i) => `${i * 8},${40 - (v / max) * 40}`).join(' ');
</script>

<svg viewBox="0 0 {width} 40" class="w-full h-24">
  <defs>
    <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="hsl(var(--primary))" stop-opacity="0.3" />
      <stop offset="100%" stop-color="hsl(var(--primary))" stop-opacity="0" />
    </linearGradient>
  </defs>
  <polygon points={`0,40 ${points} ${width},40`} fill="url(#chartGradient)" />
  <polyline points={points} fill="none" stroke="hsl(var(--primary))" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
</svg>
