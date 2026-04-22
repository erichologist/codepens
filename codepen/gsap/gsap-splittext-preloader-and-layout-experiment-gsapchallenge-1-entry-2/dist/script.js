document.addEventListener("DOMContentLoaded", function () {
  // Register plugins
  gsap.registerPlugin(ScrambleTextPlugin, SplitText);

  // Create custom ease for animations
  const slideEase = "cubic-bezier(0.65,0.05,0.36,1)";

  // Initialize elements
  const terminalLines = document.querySelectorAll(".terminal-line");
  const preloaderEl = document.getElementById("preloader");
  const contentEl = document.getElementById("content");

  // Special characters for scramble effect
  const specialChars = "▪";

  // Store original text content for spans that will be scrambled
  const originalTexts = {};
  document
    .querySelectorAll('.terminal-line span[data-scramble="true"]')
    .forEach(function (span, index) {
      const originalText = span.textContent;
      originalTexts[index] = originalText;
      span.setAttribute("data-original-text", originalText);
      span.textContent = "";
    });

  // Set initial state - make sure terminal lines are initially hidden
  gsap.set(".terminal-line", {
    opacity: 0
  });

  // Function to update progress bar
  function updateProgress(percent) {
    const progressBar = document.getElementById("progress-bar");
    if (progressBar) {
      progressBar.style.transition = "none";
      progressBar.style.width = percent + "%";
    }
  }

  // Terminal preloader animation
  function animateTerminalPreloader() {
    // Reset progress to 0%
    updateProgress(0);

    // Create main timeline for text animation
    const tl = gsap.timeline({
      onComplete: function () {
        // Once preloader is done, reveal the content
        revealContent();
      }
    });

    // Total animation duration in seconds
    const totalDuration = 6;

    // Get all terminal lines and sort them by top position
    const allLines = Array.from(document.querySelectorAll(".terminal-line"));
    allLines.sort((a, b) => {
      const aTop = parseInt(a.style.top);
      const bTop = parseInt(b.style.top);
      return aTop - bTop;
    });

    // Create a timeline for text reveal that's synced with progress
    const textRevealTl = gsap.timeline();

    // Process each line for text reveal
    allLines.forEach((line, lineIndex) => {
      // Set base opacity - alternating between full and reduced opacity
      const baseOpacity = lineIndex % 2 === 0 ? 1 : 0.7;

      // Calculate when this line should appear based on total duration
      // Distribute evenly across the first 80% of the animation
      const timePoint = (lineIndex / allLines.length) * (totalDuration * 0.8);

      // Reveal the line
      textRevealTl.to(
        line,
        {
          opacity: baseOpacity,
          duration: 0.3
        },
        timePoint
      );

      // Get all spans in this line that should be scrambled
      const scrambleSpans = line.querySelectorAll('span[data-scramble="true"]');

      // Apply scramble effect to each span
      scrambleSpans.forEach((span) => {
        const originalText =
          span.getAttribute("data-original-text") || span.textContent;

        // Add scramble effect slightly after the line appears
        textRevealTl.to(
          span,
          {
            duration: 0.8,
            scrambleText: {
              text: originalText,
              chars: specialChars,
              revealDelay: 0,
              speed: 0.3
            },
            ease: "none"
          },
          timePoint + 0.1
        );
      });
    });

    // Add the text reveal timeline to the main timeline
    tl.add(textRevealTl, 0);

    // Add periodic scramble effects throughout the animation
    for (let i = 0; i < 3; i++) {
      const randomTime = 1 + i * 1.5; // Spread out the glitch effects
      tl.add(function () {
        const glitchTl = gsap.timeline();

        // Select random elements to glitch
        const allScrambleSpans = document.querySelectorAll(
          'span[data-scramble="true"]'
        );
        const randomSpans = [];

        // Select 3-5 random spans to glitch
        const numToGlitch = 3 + Math.floor(Math.random() * 3);
        for (let j = 0; j < numToGlitch; j++) {
          const randomIndex = Math.floor(
            Math.random() * allScrambleSpans.length
          );
          randomSpans.push(allScrambleSpans[randomIndex]);
        }

        // Apply glitch effect to selected spans
        randomSpans.forEach((span) => {
          const text =
            span.textContent || span.getAttribute("data-original-text");

          // Quick scramble for glitch effect
          glitchTl.to(
            span,
            {
              duration: 0.2,
              scrambleText: {
                text: text,
                chars: specialChars,
                revealDelay: 0,
                speed: 0.1
              },
              ease: "none",
              repeat: 1
            },
            Math.random() * 0.5
          );
        });

        return glitchTl;
      }, randomTime);
    }

    // Add staggered disappearing effect at the end
    const disappearTl = gsap.timeline();

    // Add staggered disappear effect for each line
    disappearTl.to(allLines, {
      opacity: 0,
      duration: 0.2,
      stagger: 0.1, // 0.1 second between each line disappearing
      ease: "power1.in"
    });

    // Add the disappear timeline near the end of the main timeline
    tl.add(disappearTl, totalDuration - 1);

    // Set up progress bar animation that's synced with the main timeline
    tl.eventCallback("onUpdate", function () {
      const progress = Math.min(99, tl.progress() * 100);
      updateProgress(progress);
    });

    // Force final update to 100% at the end
    tl.call(
      function () {
        updateProgress(100);
      },
      [],
      totalDuration - 0.5
    );

    return tl;
  }

  // Reveal content by transitioning the preloader out
  function revealContent() {
    const titleLines = document.querySelectorAll(
      ".quote-section .title-line span"
    );

    // Create timeline for content reveal
    const revealTl = gsap.timeline();

    // Clip the preloader from bottom to top (similar to menu animation)
    revealTl.to(preloaderEl, {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
      duration: 0.64,
      ease: slideEase,
      onComplete: () => {
        // Remove preloader after animation
        preloaderEl.style.display = "none";
      }
    });

    // Show the content
    revealTl.to(
      contentEl,
      {
        opacity: 1,
        visibility: "visible",
        duration: 0.3
      },
      "-=0.3"
    );

    // Initialize SplitText after content is visible
    revealTl.call(() => {
      // Initialize SplitText on nav links
      const navLinks = document.querySelectorAll(".nav-link");
      navLinks.forEach((link) => {
        // Create new SplitText instance with new features
        const splitLink = new SplitText(link, {
          type: "chars",
          charsClass: "char",
          position: "relative",
          linesClass: "line",
          deepSlice: true,
          propIndex: true
        });

        // Store the SplitText instance on the element
        link._splitText = splitLink;

        // Setup hover effect
        link.addEventListener("mouseenter", () => {
          gsap.to(splitLink.chars, {
            x: (i) => `${0.5 + i * 0.1}em`,
            duration: 0.64,
            ease: slideEase,
            stagger: {
              each: 0.015,
              from: "start"
            }
          });
        });

        link.addEventListener("mouseleave", () => {
          gsap.to(splitLink.chars, {
            x: 0,
            duration: 0.64,
            ease: slideEase,
            stagger: {
              each: 0.01,
              from: "end"
            }
          });
        });
      });
    });

    // Animate the title lines
    revealTl.to(
      titleLines,
      {
        y: "0%",
        duration: 0.64,
        stagger: 0.1,
        ease: slideEase
      },
      "-=0.2"
    );
  }

  // Initialize menu functionality
  function initializeMenu() {
    // Elements
    const menuBtn = document.getElementById("menu-btn");
    const closeBtn = document.getElementById("close-btn");
    const overlay = document.getElementById("overlay");
    const featuredImage = document.getElementById("featured-image");
    const brandLogo = document.querySelector(".brand .text-reveal a");
    const primaryNav = document.querySelector(".primary-nav .grid");
    const overlayBrand = document.querySelector(
      ".overlay-brand .text-reveal a"
    );
    const overlayClose = document.querySelector(".close-toggle .text-reveal p");
    const navLinks = document.querySelectorAll(".nav-link");
    const footerItems = document.querySelectorAll(
      ".overlay-footer .text-reveal p, .overlay-footer .text-reveal a"
    );
    const titleLines = document.querySelectorAll(
      ".quote-section .title-line span"
    );

    let isAnimating = false;

    // Initial setup
    gsap.set(overlay, {
      clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
      pointerEvents: "none"
    });

    gsap.set(featuredImage, {
      clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)"
    });

    gsap.set([overlayBrand, overlayClose], {
      y: "100%"
    });

    gsap.set(".nav-link", {
      y: "100%"
    });

    gsap.set(footerItems, {
      y: "100%"
    });

    // Open menu function
    function openMenu() {
      if (isAnimating) return;
      isAnimating = true;

      const tl = gsap.timeline({
        onComplete: () => (isAnimating = false)
      });

      // Hide the title lines with staggered animation
      tl.to(titleLines, {
        y: "100%",
        duration: 0.64,
        stagger: 0.075,
        ease: slideEase
      });

      tl.to(
        [brandLogo, menuBtn],
        {
          y: "-100%",
          duration: 0.64,
          stagger: 0.1,
          ease: slideEase,
          onComplete: () => {
            primaryNav.style.pointerEvents = "none";
            gsap.set([brandLogo, menuBtn], {
              y: "100%"
            });
          }
        },
        "-=0.4"
      );

      tl.to(
        overlay,
        {
          clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          duration: 0.64,
          ease: slideEase,
          onStart: () => {
            overlay.style.pointerEvents = "all";
          }
        },
        "-=0.4"
      );

      // First let the overlay animation complete, then animate the image from bottom to top
      tl.fromTo(
        featuredImage,
        {
          clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)"
        },
        {
          clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          duration: 0.64,
          ease: slideEase
        },
        "-=0.2"
      );

      tl.to(
        [overlayBrand, overlayClose],
        {
          y: "0%",
          duration: 0.64,
          stagger: 0.1,
          ease: slideEase
        },
        "-=0.3"
      );

      tl.to(
        ".nav-link",
        {
          y: "0%",
          duration: 0.64,
          stagger: 0.075,
          ease: slideEase
        },
        "<"
      );

      tl.to(
        footerItems,
        {
          y: "0%",
          duration: 0.64,
          stagger: 0.1,
          ease: slideEase
        },
        "<"
      );
    }

    // Close menu function
    function closeMenu() {
      if (isAnimating) return;
      isAnimating = true;

      const tl = gsap.timeline({
        onComplete: () => {
          isAnimating = false;
        }
      });

      tl.to([overlayBrand, overlayClose], {
        y: "-100%",
        duration: 0.64,
        stagger: 0.1,
        ease: slideEase
      });

      tl.to(
        ".nav-link",
        {
          y: "-100%",
          duration: 0.64,
          stagger: 0.05,
          ease: slideEase
        },
        "<"
      );

      // Make sure all footer items are animated, including social links
      tl.to(
        footerItems,
        {
          y: "-100%",
          duration: 0.64,
          stagger: 0.05,
          ease: slideEase
        },
        "<"
      );

      // Animate the featured image to close from top to bottom
      tl.to(
        featuredImage,
        {
          clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
          duration: 0.64,
          ease: slideEase
        },
        "-=0.64"
      );

      tl.to(
        overlay,
        {
          clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
          duration: 0.64,
          ease: slideEase,
          onComplete: () => {
            overlay.style.pointerEvents = "none";
            gsap.set(overlay, {
              clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)"
            });
            gsap.set(featuredImage, {
              clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)"
            });
            gsap.set([overlayBrand, overlayClose], {
              y: "100%"
            });
            gsap.set(".nav-link", {
              y: "100%"
            });
            gsap.set(footerItems, {
              y: "100%"
            });
          }
        },
        "+=0.2"
      );

      tl.to(
        [brandLogo, menuBtn],
        {
          y: "0%",
          duration: 0.64,
          stagger: 0.1,
          ease: slideEase,
          onStart: () => {
            primaryNav.style.pointerEvents = "all";
          }
        },
        "-=0.3"
      );

      // Show the title lines with staggered animation
      tl.to(
        titleLines,
        {
          y: "0%",
          duration: 0.64,
          stagger: 0.075,
          ease: slideEase
        },
        "-=0.4"
      );
    }

    // Event listeners
    menuBtn.addEventListener("click", openMenu);
    closeBtn.addEventListener("click", closeMenu);

    // Menu item click handlers
    navLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        closeMenu();
      });
    });
  }

  // Setup initial preloader state
  gsap.set(preloaderEl, {
    clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)"
  });

  // Set initial state for title lines
  const titleLines = document.querySelectorAll(
    ".quote-section .title-line span"
  );
  gsap.set(titleLines, {
    y: "100%"
  });

  // Start terminal preloader animation
  const terminalAnimation = animateTerminalPreloader();

  // Initialize menu functionality
  initializeMenu();
});