<script>
  export let icon;
  export let label = '';
  export let value = '';
  export let delta = null; // { pct: number, up: boolean }
</script>

<div class="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-5 card-glow">
  <div class="flex items-center gap-3 mb-3">
    <div class="h-10 w-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
      <svelte:component this={icon} class="h-5 w-5" />
    </div>
    <span class="text-sm text-muted-foreground">{label}</span>
  </div>
  <div class="flex items-baseline gap-2">
    <span class="text-2xl font-semibold text-foreground">{value}</span>
    {#if delta}
      <span class="{delta.up ? 'text-emerald-400' : 'text-rose-400'} text-xs font-medium">
        {delta.up ? '↑' : '↓'} {delta.pct}%
      </span>
    {/if}
  </div>
</div>
