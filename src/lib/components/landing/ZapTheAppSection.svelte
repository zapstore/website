<script>
  import { Zap, ChevronRight } from "$lib/components/icons";

  // Varying sizes for zap icons (3 icons per side)
  const leftSizes = [32, 48, 40];
  const rightSizes = [40, 56, 32];

  // Vertical positions (as percentages from top) - moved closer to top
  const leftTopPositions = [
    "calc(10% - 40px)",
    "calc(25% - 40px)",
    "calc(50% - 40px)",
  ];
  const rightTopPositions = [
    "calc(8% - 40px)",
    "calc(25% - 40px)",
    "calc(55% - 40px)",
  ];

  // Horizontal positions (as percentages from left/right)
  // Small screens: top and bottom more centered, middle less centered
  const leftPositions = ["18%", "8%", "18%"];
  const rightPositions = ["18%", "8%", "18%"];

  // Opacity based on size (smaller = less opacity)
  function getOpacity(size) {
    if (size <= 32) return 0.5;
    if (size <= 40) return 0.7;
    return 1;
  }

  let openFeedButton;

  function handleMouseMove(event) {
    if (!openFeedButton) return;
    const rect = openFeedButton.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    openFeedButton.style.setProperty("--mouse-x", `${mouseX}px`);
    openFeedButton.style.setProperty("--mouse-y", `${mouseY}px`);
  }

  function handleOpenFeed() {
    // TODO: Navigate to feed
  }
</script>

<section class="relative border-t border-border/50 overflow-hidden">
  <!-- Left zap icons -->
  {#each Array(3) as _, i}
    <div
      class="absolute z-10 zap-icon-container zap-left-{i}"
      style="--left-pos: {leftPositions[i]}; top: {leftTopPositions[
        i
      ]}; animation-delay: {i * 0.2}s; opacity: {getOpacity(leftSizes[i])};"
    >
      <Zap variant="fill" color="hsl(43, 100%, 50%)" size={leftSizes[i]} />
    </div>
  {/each}

  <!-- Right zap icons -->
  {#each Array(3) as _, i}
    <div
      class="absolute z-10 zap-icon-container zap-right-{i}"
      style="--right-pos: {rightPositions[i]}; top: {rightTopPositions[
        i
      ]}; animation-delay: {(i + 3) * 0.2}s; opacity: {getOpacity(
        rightSizes[i]
      )};"
    >
      <Zap variant="fill" color="hsl(43, 100%, 50%)" size={rightSizes[i]} />
    </div>
  {/each}

  <div class="container mx-auto px-4 sm:px-6 lg:px-8 pt-16 lg:pt-20 pb-0">
    <!-- Center text -->
    <div class="relative z-20 text-center mb-8">
      <h2 class="section-title text-display-lg leading-tight">
        <span
          class="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl"
          style="background: var(--gradient-gray); -webkit-background-clip: text; background-clip: text; color: transparent;"
        >
          #ZapTheApp
        </span>
      </h2>
      <p class="section-description max-w-2xl mx-auto mt-7">
        Users, valuing devs.<br />No middlemen.
      </p>
    </div>

    <!-- Feed container -->
    <div
      class="feed-content rounded-t-[32px] relative overflow-hidden feed-container-border feed-bg"
    >
      <!-- Content placeholder -->
      <div class="h-64"></div>
      <!-- Open Feed Button - 32px from bottom edge -->
      <button
        type="button"
        bind:this={openFeedButton}
        on:click={handleOpenFeed}
        on:mousemove={handleMouseMove}
        class="absolute bottom-8 left-1/2 transform -translate-x-1/2 btn-glass-large btn-glass-with-chevron flex items-center group z-40"
      >
        Open Feed
        <ChevronRight
          variant="outline"
          color="hsl(var(--white33))"
          size={18}
          className="transition-transform group-hover:translate-x-0.5"
        />
      </button>
    </div>
  </div>
</section>

<style>
  .zap-icon-container {
    animation: float 3s ease-in-out infinite;
    filter: drop-shadow(0 0 8px hsl(43 100% 50% / 0.5));
  }

  .feed-bg {
    background: linear-gradient(
      to bottom,
      hsl(var(--gray33)) 0%,
      hsl(var(--gray) / 0.08) 100%
    );
  }

  .feed-container-border {
    border: var(--border-base) solid hsl(var(--white8));
  }

  /* Left icons - mobile */
  .zap-left-0 {
    left: var(--left-pos);
  }
  .zap-left-1 {
    left: var(--left-pos);
  }
  .zap-left-2 {
    left: var(--left-pos);
  }

  /* Right icons - mobile */
  .zap-right-0 {
    right: var(--right-pos);
  }
  .zap-right-1 {
    right: var(--right-pos);
  }
  .zap-right-2 {
    right: var(--right-pos);
  }

  /* Large screens - top and bottom more centered, middle less centered */
  @media (min-width: 1024px) {
    .zap-left-0 {
      left: 32%;
    }
    .zap-left-1 {
      left: 20%;
    }
    .zap-left-2 {
      left: 30%;
    }
    .zap-right-0 {
      right: 32%;
    }
    .zap-right-1 {
      right: 20%;
    }
    .zap-right-2 {
      right: 30%;
    }
  }

  @keyframes float {
    0%,
    100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-20px);
    }
  }
</style>
