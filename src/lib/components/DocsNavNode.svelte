<script>
  import { page } from '$app/stores';

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
    <div class="flex items-center justify-between w-full text-left text-sm mb-1 px-3 py-1 rounded-md transition-colors hover:bg-gray-800/70">
      {#if node.href}
        <a href={node.href} class="transition-colors {isActive(node.href) || isAncestorActive(node.href) ? 'text-white font-semibold' : 'text-gray-500 hover:text-white'}">
          {node.title}
        </a>
      {:else}
        <span class="{isAncestorActive(node.id) ? 'text-white font-semibold' : 'text-gray-500'}">{node.title}</span>
      {/if}
      <button
        type="button"
        class="text-xs rounded ml-2 shrink-0"
        on:click={() => toggle(node.id)}
        aria-expanded={!!expanded[node.id]}
        aria-controls={`section-${node.id}`}
        aria-label={expanded[node.id] ? 'Collapse section' : 'Expand section'}
      >
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" class="h-[18px] w-[18px] {expanded[node.id] ? 'rotate-90' : ''}" style="transition: transform 150ms; transform-origin: center;">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
        </svg>
      </button>
    </div>
    {#if expanded[node.id]}
      <ul id={`section-${node.id}`} class="ml-4 space-y-1">
        {#each node.children as child}
          <svelte:self node={child} {expanded} {toggle} />
        {/each}
      </ul>
    {/if}
  {:else}
    {#if node.href}
      <a
        href={node.href}
        class="block text-sm px-3 py-1 rounded-md transition-colors {isActive(node.href) ? 'bg-gray-800 text-white font-semibold' : 'text-gray-500 hover:text-white hover:bg-gray-800/70'}"
      >{node.title}</a>
    {/if}
  {/if}
</li>

<style>
</style>


