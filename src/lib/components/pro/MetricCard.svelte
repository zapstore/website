<script>
  export let icon;
  export let label = '';
  export let value = '';
  export let delta = null; // { pct: number, up: boolean }
</script>

<div class="rounded-lg border border-white/10 bg-white/5 p-4">
  <div class="flex items-center gap-3 mb-2">
    <div class="h-9 w-9 rounded-md bg-white/10 flex items-center justify-center text-white/90">
      <svelte:component this={icon} class="h-5 w-5" />
    </div>
    <span class="text-sm text-white/70">{label}</span>
  </div>
  <div class="flex items-baseline gap-2">
    <span class="text-2xl font-semibold text-white">{value}</span>
    {#if delta}
      <span class="{delta.up ? 'text-emerald-400' : 'text-rose-400'} text-xs">
        {delta.up ? '▲' : '▼'} {delta.pct}%
      </span>
    {/if}
  </div>
</div>


