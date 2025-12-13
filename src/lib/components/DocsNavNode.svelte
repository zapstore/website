<script>
  import { page } from '$app/stores';
  import { ChevronRight } from 'lucide-svelte';

  export let node;
  export let expanded = {};
  export let toggle = () => {};

  $: currentPath = $page.url.pathname;

  function isActive(href) {
    if (!href) return false;
    return currentPath === href;
  }

  function isAncestorActive(href) {
    if (!href) return false;
    if (href === '/') return false;
    return currentPath.startsWith(href + '/');
  }

  $: isFolder = Array.isArray(node.children) && node.children.length > 0;
</script>

<li>
  {#if isFolder}
    <div class="flex items-center justify-between w-full text-left text-sm mb-1">
      {#if node.href}
        <a 
          href={node.href} 
          class="flex-1 px-3 py-1.5 rounded-lg transition-colors {isActive(node.href) ? 'bg-primary/10 text-foreground font-medium' : isAncestorActive(node.href) ? 'text-foreground font-medium' : 'text-muted-foreground hover:text-foreground hover:bg-card'}"
        >
          {node.title}
        </a>
      {:else}
        <span class="flex-1 px-3 py-1.5 {isAncestorActive(node.id) ? 'text-foreground font-medium' : 'text-muted-foreground'}">
          {node.title}
        </span>
      {/if}
      <button
        type="button"
        class="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-card transition-colors"
        on:click={() => toggle(node.id)}
        aria-expanded={!!expanded[node.id]}
        aria-controls={`section-${node.id}`}
        aria-label={expanded[node.id] ? 'Collapse section' : 'Expand section'}
      >
        <ChevronRight class="h-4 w-4 transition-transform duration-200 {expanded[node.id] ? 'rotate-90' : ''}" />
      </button>
    </div>
    {#if expanded[node.id]}
      <ul id={`section-${node.id}`} class="ml-3 pl-3 border-l border-border/50 space-y-1 mt-1">
        {#each node.children as child}
          <svelte:self node={child} {expanded} {toggle} />
        {/each}
      </ul>
    {/if}
  {:else}
    {#if node.href}
      <a
        href={node.href}
        class="block text-sm px-3 py-1.5 rounded-lg transition-colors {isActive(node.href) ? 'bg-primary/10 text-foreground font-medium' : 'text-muted-foreground hover:text-foreground hover:bg-card'}"
      >
        {node.title}
      </a>
    {/if}
  {/if}
</li>
