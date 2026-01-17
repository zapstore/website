<script>
  import { ChevronDown } from "lucide-svelte";

  export let leftText = "";
  export let selectedOption = "";
  export let options = []; // Can be array of strings or objects: [{label: "iOS", url: "/download/ios", action: () => {}}]
  export let onLeftClick = () => {};
  export let onOptionSelect = (option) => {}; // Called with the option (string or object)
  export let size = "default"; // "large" | "default" | "small"

  let dropdownOpen = false;

  $: sizeClass =
    size === "large"
      ? "split-button-large"
      : size === "small"
        ? "split-button-small"
        : "split-button";

  // Helper to get option label
  function getOptionLabel(option) {
    return typeof option === "string"
      ? option
      : option.label || option.name || "";
  }

  // Helper to get option value for display
  function getSelectedLabel() {
    if (!selectedOption) return "Android";
    return typeof selectedOption === "string"
      ? selectedOption
      : getOptionLabel(selectedOption);
  }

  function toggleDropdown() {
    dropdownOpen = !dropdownOpen;
  }

  function selectOption(option) {
    // If option has a URL, navigate to it
    if (typeof option === "object" && option.url) {
      window.location.href = option.url;
    }
    // If option has an action, call it
    if (typeof option === "object" && option.action) {
      option.action(option);
    }
    // Always call the onOptionSelect callback
    onOptionSelect(option);
    dropdownOpen = false;
  }

  function handleClickOutside(event) {
    if (dropdownOpen && !event.target.closest(".split-button-container")) {
      dropdownOpen = false;
    }
  }
</script>

<svelte:window on:click={handleClickOutside} />

<div
  class="split-button-container relative w-full inline-flex items-stretch {sizeClass}"
  style="gap: 0;"
>
  <button
    type="button"
    on:click={onLeftClick}
    class="split-button-left flex-1 flex items-center justify-center rounded-l-2xl"
  >
    {leftText}
  </button>

  <!-- Divider -->
  <div
    class="split-button-divider flex-shrink-0"
    style="width: 1.4px; background-color: hsl(var(--white16)); margin: 0;"
  ></div>

  <!-- Right dropdown part -->
  <div class="relative flex items-center" style="margin: 0; padding: 0;">
    <button
      type="button"
      on:click={toggleDropdown}
      on:mousedown|preventDefault|stopPropagation={(e) => {
        e.preventDefault();
        e.stopPropagation();
        const container = e.currentTarget.closest(".split-button-container");
        if (container) {
          container.classList.add("split-button-right-active");
          setTimeout(
            () => container.classList.remove("split-button-right-active"),
            200
          );
        }
      }}
      class="split-button-right flex items-center justify-center gap-2 rounded-r-2xl"
    >
      <span>{getSelectedLabel()}</span>
      <ChevronDown class="split-button-chevron text-primary-foreground" />
    </button>

    {#if dropdownOpen}
      <div
        class="absolute right-0 top-full mt-1 w-48 rounded-lg overlay-surface shadow-lg py-1 z-50"
      >
        {#each options as option}
          <button
            type="button"
            on:click={() => selectOption(option)}
            class="flex items-center gap-2 px-4 py-2.5 text-sm text-foreground hover:bg-white/5 transition-colors w-full text-left"
          >
            {getOptionLabel(option)}
          </button>
        {/each}
      </div>
    {/if}
  </div>
</div>
