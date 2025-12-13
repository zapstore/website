<script>
    import DocsNavNode from './DocsNavNode.svelte';
    import { page } from '$app/stores';

    export let navigation = [];
    export let mobileMenuOpen = false;
    export let toggleMobileMenu = () => {};

    let expanded = {};

    function toggle(id) {
        expanded[id] = !expanded[id];
        expanded = { ...expanded };
    }

    $: currentPath = $page.url.pathname;

    // Initialize expansion from frontmatter (sidebar.open) and active path
    $: if (navigation && navigation.length) {
        const next = {};
        function traverse(nodes, ancestors = []) {
            for (const node of nodes) {
                if (node.expandedByDefault === true) {
                    next[node.id] = true;
                }
                const isSelfActive = !!(node.href && currentPath === node.href);
                const isDescActive = !!(node.href && currentPath.startsWith(node.href + '/'));
                if (isSelfActive || isDescActive) {
                    for (const a of ancestors) next[a.id] = true;
                    if (node.children && node.children.length) next[node.id] = true;
                }
                if (node.children && node.children.length) {
                    traverse(node.children, [...ancestors, node]);
                }
            }
        }
        traverse(navigation, []);
        expanded = { ...expanded, ...next };
    }
</script>

<!-- Mobile menu overlay -->
{#if mobileMenuOpen}
    <div
        class="lg:hidden fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
        on:click={toggleMobileMenu}
        role="button"
        tabindex="0"
        on:keydown={(e) => e.key === 'Enter' && toggleMobileMenu()}
    ></div>
{/if}

<!-- Navigation sidebar -->
<aside 
    class="
        fixed lg:sticky top-0 lg:top-24 left-0 z-40 
        h-screen lg:h-auto w-72 lg:w-auto 
        bg-background lg:bg-transparent 
        border-r lg:border-r-0 border-border/50 
        overflow-y-auto 
        transition-transform duration-300 ease-out
        {mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:translate-x-0
    "
>
    <nav class="p-6 lg:p-0">
        <ul class="space-y-1">
            {#each navigation as node}
                <DocsNavNode node={node} {expanded} {toggle} />
            {/each}
        </ul>
    </nav>
</aside>

<style>
    aside {
        -webkit-overflow-scrolling: touch;
    }
</style>
