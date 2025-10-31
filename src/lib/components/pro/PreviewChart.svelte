<script>
  export let data = [];
  const max = Math.max(...data, 1);
  const width = data.length * 8;
  const points = data.map((v, i) => `${i * 8},${40 - (v / max) * 40}`).join(' ');
</script>

<svg viewBox="0 0 {width} 40" class="w-full h-24">
  <polyline points={points} fill="none" stroke="rgb(59,130,246)" stroke-width="2" />
  <polygon points={`0,40 ${points} ${width},40`} fill="rgba(59,130,246,0.15)" />
</svg>


