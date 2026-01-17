<script>
  import { onMount } from "svelte";
  import SectionHeader from "./SectionHeader.svelte";

  export let testimonials = [];

  $: visibleTestimonials = testimonials;

  let testimonialsContainer;
  let scrollPosition = 0;
  const SCROLL_SPEED = 0.3;
  let animationFrameId;
  let isPaused = false;
  let lastScrollLeft = 0;
  let isScrolling = false;

  // Organize testimonials into columns (3 per column)
  $: columns = (() => {
    if (!visibleTestimonials || visibleTestimonials.length === 0) {
      return [];
    }
    const cols = [];
    const itemsPerColumn = 3;
    for (let i = 0; i < visibleTestimonials.length; i += itemsPerColumn) {
      cols.push(visibleTestimonials.slice(i, i + itemsPerColumn));
    }
    return cols.length > 0 ? [...cols, ...cols] : [];
  })();

  function getDisplayName(testimonial) {
    if (testimonial.profile?.displayName)
      return testimonial.profile.displayName;
    if (testimonial.profile?.name) return testimonial.profile.name;
    if (testimonial.profile?.nip05)
      return testimonial.profile.nip05.split("@")[0];
    return testimonial.npub?.slice(0, 12) + "...";
  }

  function formatDateTime(timestamp) {
    if (!timestamp) return "";

    const now = new Date();
    const date = new Date(timestamp * 1000);

    if (isNaN(date.getTime())) return "";

    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);

    if (diffSec < 60) {
      return "Just now";
    }

    const isToday = date.toDateString() === now.toDateString();
    if (isToday) {
      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");
      return `Today ${hours}:${minutes}`;
    }

    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const isYesterday = date.toDateString() === yesterday.toDateString();
    if (isYesterday) {
      return "yesterday";
    }

    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString().slice(-2);
    return `${day}/${month}/${year}`;
  }

  function handleMouseEnter() {
    isPaused = true;
  }

  function handleMouseLeave() {
    isPaused = false;
  }

  function handleScroll() {
    if (!testimonialsContainer || isPaused) return;

    const scrollLeft = testimonialsContainer.scrollLeft;
    const scrollWidth = testimonialsContainer.scrollWidth;
    const halfWidth = scrollWidth / 2;

    const isLargeScreen = window.innerWidth >= 768;
    if (!isLargeScreen) return;

    const scrollDelta = scrollLeft - lastScrollLeft;
    lastScrollLeft = scrollLeft;

    if (isScrolling) return;

    if (scrollLeft >= halfWidth - 100) {
      isScrolling = true;
      testimonialsContainer.scrollLeft = scrollLeft - halfWidth;
      setTimeout(() => {
        isScrolling = false;
      }, 50);
    } else if (scrollLeft <= 100 && scrollDelta < 0) {
      isScrolling = true;
      testimonialsContainer.scrollLeft = halfWidth + scrollLeft;
      setTimeout(() => {
        isScrolling = false;
      }, 50);
    }
  }

  let isAnimating = false;

  function animateScroll() {
    if (
      !testimonialsContainer ||
      !visibleTestimonials ||
      visibleTestimonials.length === 0 ||
      testimonialsContainer.scrollWidth <= testimonialsContainer.clientWidth
    ) {
      isAnimating = false;
      return;
    }

    const isLargeScreen = window.innerWidth >= 768;
    if (!isLargeScreen) {
      isAnimating = false;
      return;
    }

    if (!isPaused && isAnimating && !isScrolling) {
      scrollPosition += SCROLL_SPEED;
      testimonialsContainer.scrollLeft = scrollPosition;

      const maxScroll = testimonialsContainer.scrollWidth / 2;
      if (scrollPosition >= maxScroll - 100) {
        scrollPosition = scrollPosition - maxScroll;
        testimonialsContainer.scrollLeft = scrollPosition;
      }
    }

    if (isAnimating) {
      animationFrameId = requestAnimationFrame(animateScroll);
    }
  }

  function handleSeeMore() {
    // TODO: Navigate to testimonials page
  }

  onMount(() => {
    if (visibleTestimonials && visibleTestimonials.length > 0) {
      const checkAndStart = () => {
        const isLargeScreen = window.innerWidth >= 768;
        if (
          testimonialsContainer &&
          testimonialsContainer.scrollWidth >
            testimonialsContainer.clientWidth &&
          !isAnimating &&
          isLargeScreen
        ) {
          lastScrollLeft = testimonialsContainer.scrollLeft;
          isAnimating = true;
          animateScroll();
        } else if (!isAnimating && isLargeScreen) {
          setTimeout(checkAndStart, 100);
        }
      };
      setTimeout(checkAndStart, 500);
    }
    return () => {
      isAnimating = false;
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
    };
  });
</script>

{#if testimonials.length > 0}
  <section class="border-t border-border/50 pt-16 pb-8 lg:pt-20 lg:pb-10">
    <SectionHeader
      title="What people are saying"
      description="Real posts from the Nostr community"
      showSeeMore={true}
      seeMoreAction={handleSeeMore}
    />

    <!-- Horizontal Scrolling Testimonials Grid -->
    <div class="relative w-screen overflow-hidden">
      <!-- Left gradient fade -->
      <div
        class="hidden md:block absolute left-0 top-0 bottom-0 w-24 sm:w-32 md:w-48 lg:w-64 xl:w-80 z-30 pointer-events-none"
        style="background: linear-gradient(to right, hsl(var(--background)) 0%, hsl(var(--background) / 0.95) 20%, hsl(var(--background) / 0.7) 50%, transparent 100%);"
      ></div>

      <!-- Right gradient fade -->
      <div
        class="hidden md:block absolute right-0 top-0 bottom-0 w-24 sm:w-32 md:w-48 lg:w-64 xl:w-80 z-30 pointer-events-none"
        style="background: linear-gradient(to left, hsl(var(--background)) 0%, hsl(var(--background) / 0.95) 20%, hsl(var(--background) / 0.7) 50%, transparent 100%);"
      ></div>

      <!-- Scrolling container -->
      <div
        bind:this={testimonialsContainer}
        on:mouseenter={handleMouseEnter}
        on:mouseleave={handleMouseLeave}
        on:scroll={handleScroll}
        role="region"
        aria-label="Testimonials carousel"
        class="flex gap-6 px-4 md:px-32 py-2 overflow-x-auto scrollbar-hide relative z-10"
        style="scroll-behavior: auto;"
      >
        {#each columns as column, columnIndex (columnIndex)}
          <div class="flex flex-col gap-6 flex-shrink-0" style="width: 320px;">
            {#each column as testimonial (testimonial.id)}
              <a
                href={testimonial.nevent
                  ? `https://primal.net/e/${testimonial.nevent}`
                  : "#"}
                target="_blank"
                rel="noopener noreferrer"
                class="testimonial-card group block"
              >
                <!-- Top row: Profile pic, name, date/time -->
                <div class="flex items-center gap-3 mb-3">
                  {#if testimonial.profile?.picture}
                    <img
                      src={testimonial.profile.picture}
                      alt={getDisplayName(testimonial)}
                      class="w-10 h-10 rounded-full object-cover flex-shrink-0"
                      loading="lazy"
                    />
                  {:else}
                    <div
                      class="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center flex-shrink-0"
                    >
                      <span class="text-primary font-semibold text-sm">
                        {getDisplayName(testimonial).charAt(0).toUpperCase()}
                      </span>
                    </div>
                  {/if}

                  <div
                    class="flex-1 min-w-0 flex items-center justify-between gap-2"
                  >
                    <span
                      class="font-semibold text-foreground truncate text-base"
                    >
                      {getDisplayName(testimonial)}
                    </span>
                    <span
                      class="text-xs whitespace-nowrap flex-shrink-0"
                      style="color: hsl(var(--white33));"
                    >
                      {formatDateTime(testimonial.created_at)}
                    </span>
                  </div>
                </div>

                <!-- Content -->
                <p
                  class="text-base text-foreground leading-relaxed whitespace-pre-wrap"
                >
                  {testimonial.content}
                </p>
              </a>
            {/each}
          </div>
        {/each}
      </div>
    </div>
  </section>
{/if}

<style>
  .testimonial-card {
    display: block;
    padding: 1rem;
    background: hsl(var(--gray44));
    border: 1px solid hsl(var(--border) / 0.4);
    border-radius: 1.25rem;
    transition: transform 0.2s ease;
    text-decoration: none;
    height: fit-content;
  }

  .testimonial-card:hover {
    transform: scale(1.01);
  }

  .testimonial-card:active {
    transform: scale(0.99);
  }

  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
</style>
