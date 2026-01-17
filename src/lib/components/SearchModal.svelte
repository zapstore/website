<script>
  import { Search, X } from "lucide-svelte";
  import { fade } from "svelte/transition";

  export let open = false;
  export let searchQuery = "";
  export let categories = [];
  export let platforms = [];

  let searchInput;

  // Close handlers
  $: if (!open) {
    searchQuery = "";
  }

  // Focus search input when modal opens
  $: if (open && searchInput) {
    setTimeout(() => {
      searchInput?.focus();
    }, 100);
  }

  function handleBackdropClick(e) {
    if (e.target === e.currentTarget) {
      open = false;
    }
  }

  function handleKeydown(e) {
    if (e.key === "Escape") {
      open = false;
    }
  }
</script>

<svelte:window on:keydown={handleKeydown} />

{#if open}
  <!-- Backdrop -->
  <!-- svelte-ignore a11y_click_events_have_key_events a11y_interactive_supports_focus -->
  <div
    class="fixed inset-0 z-[100] bg-overlay flex justify-center items-start"
    style="position: fixed !important; top: 0 !important; left: 0 !important; right: 0 !important; bottom: 0 !important; width: 100vw !important; height: 100vh !important; margin: 0 !important;"
    transition:fade={{ duration: 150 }}
    on:click={handleBackdropClick}
    role="dialog"
    aria-modal="true"
    aria-label="Search overlay"
    tabindex="-1"
  >
    <!-- Modal -->
    <div
      class="border-subtle shadow-2xl overflow-hidden backdrop-blur-lg w-full search-modal-width mx-0 sm:mx-4"
      style="
        background: linear-gradient(
          to bottom,
          hsl(var(--gray33)),
          hsl(241 15% 25% / 0.5)
        );
        border-top-left-radius: 0;
        border-top-right-radius: 0;
        border-bottom-left-radius: var(--radius-32);
        border-bottom-right-radius: var(--radius-32);
      "
      transition:fade={{ duration: 150 }}
    >
      <!-- Search Input with padding -->
      <div class="p-3">
        <div
          class="search-bar-btn flex items-center gap-3 px-4 h-10 transition-all duration-200 focus-within:shadow-[0_0_80px_hsl(var(--blurpleColor)/0.2),0_0_160px_hsl(var(--blurpleColor)/0.15),0_0_240px_hsl(var(--blurpleColor)/0.12),0_0_320px_hsl(var(--blurpleColor)/0.08)]"
          style="border-color: hsl(var(--white16)); background-color: hsl(var(--black16));"
        >
          <Search class="h-5 w-5 text-muted-foreground flex-shrink-0" />
          <input
            bind:this={searchInput}
            type="text"
            bind:value={searchQuery}
            placeholder="Search Any App"
            class="search-input flex-1 bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-base"
          />
          <button
            type="button"
            on:click={() => (open = false)}
            class="p-1 rounded-lg hover:bg-white/5 transition-colors"
            aria-label="Close search"
          >
            <X class="h-5 w-5 text-muted-foreground" />
          </button>
        </div>
      </div>

      <!-- Content Area with Padding -->
      <div class="px-4 pt-2 pb-4">
        <!-- Label Pills -->
        <div class="mb-4">
          <h3 class="eyebrow-label mb-2">Labels</h3>
          <div class="flex flex-wrap gap-2">
            {#each categories as category}
              <button
                type="button"
                class="px-3 py-1.5 rounded-lg text-sm bg-white/5 hover:bg-white/10 text-foreground transition-colors"
              >
                {category}
              </button>
            {/each}
          </div>
        </div>

        <!-- Platform Pills -->
        <div>
          <h3 class="eyebrow-label mb-2">Platforms</h3>
          <div class="flex flex-wrap gap-2">
            {#each platforms as platform}
              <button
                type="button"
                class="px-3 py-1.5 rounded-lg text-sm bg-white/5 hover:bg-white/10 text-foreground transition-colors"
              >
                {platform}
              </button>
            {/each}
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}
