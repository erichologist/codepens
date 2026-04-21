/**
 * liquidGlassKit.js
 * ─────────────────────────────────────────────────────────────────────────
 * Class-based component architecture with custom events.
 * Each component:
 *   - Has an init() static factory method
 *   - Emits custom 'glass:*' events on its host element
 *   - Is keyboard accessible
 *   - Does not rely on global state
 * ─────────────────────────────────────────────────────────────────────────
 */
(function liquidGlassKit() {
  "use strict";

  /* ======================================================================
       UTILITIES
       ====================================================================== */

  function emit(el, name, detail) {
    el.dispatchEvent(
      new CustomEvent("glass:" + name, { bubbles: true, detail: detail || {} })
    );
  }

  function getFocusable(container) {
    return Array.from(
      container.querySelectorAll(
        "a[href], button:not([disabled]), input:not([disabled]), " +
          "select:not([disabled]), textarea:not([disabled]), " +
          '[tabindex]:not([tabindex="-1"])'
      )
    );
  }

  function trapFocus(container, evt) {
    var focusable = getFocusable(container);
    if (!focusable.length) return;
    var first = focusable[0];
    var last = focusable[focusable.length - 1];
    if (evt.key === "Tab") {
      if (evt.shiftKey && document.activeElement === first) {
        evt.preventDefault();
        last.focus();
      } else if (!evt.shiftKey && document.activeElement === last) {
        evt.preventDefault();
        first.focus();
      }
    }
  }

  /* ======================================================================
       GlassTheme
       ====================================================================== */
  var GlassTheme = {
    init: function () {
      var btn = document.getElementById("theme-toggle");
      var root = document.documentElement;
      var key = "glass-theme";
      var saved = localStorage.getItem(key);
      if (saved) root.setAttribute("data-theme", saved);

      if (btn) {
        btn.addEventListener("click", function () {
          var next =
            root.getAttribute("data-theme") === "light" ? "dark" : "light";
          root.setAttribute("data-theme", next);
          localStorage.setItem(key, next);
          emit(root, "theme:change", { theme: next });
        });
      }
    }
  };

  /* ======================================================================
       GlassModal
       ====================================================================== */
  function GlassModal(backdropEl) {
    this.backdrop = backdropEl;
    this.modal = backdropEl.querySelector(".glass-modal");
    this._onKey = this._handleKey.bind(this);
    this._bindTriggers();
  }

  GlassModal.prototype._bindTriggers = function () {
    var self = this;

    /* Open triggers — any [data-modal-open] or #modal-open */
    document
      .querySelectorAll("[data-modal-open], #modal-open")
      .forEach(function (el) {
        el.addEventListener("click", function () {
          self.open();
        });
      });

    /* Close triggers */
    this.backdrop
      .querySelectorAll(
        '[id^="modal-close"], [id^="modal-confirm"], [id^="modal-cancel"]'
      )
      .forEach(function (el) {
        el.addEventListener("click", function () {
          self.close();
        });
      });

    /* Backdrop click */
    this.backdrop.addEventListener("click", function (evt) {
      if (evt.target === self.backdrop) self.close();
    });
  };

  GlassModal.prototype.open = function () {
    this._lastFocus = document.activeElement;
    this.backdrop.removeAttribute("inert");
    this.backdrop.classList.add("is-open");
    document.addEventListener("keydown", this._onKey);

    /* Focus first focusable after animation */
    var self = this;
    setTimeout(function () {
      var focusable = getFocusable(self.modal);
      if (focusable.length) focusable[0].focus();
    }, 50);

    emit(this.backdrop, "modal:open");
  };

  GlassModal.prototype.close = function () {
    this.backdrop.classList.remove("is-open");
    this.backdrop.setAttribute("inert", "");
    document.removeEventListener("keydown", this._onKey);
    if (this._lastFocus) this._lastFocus.focus();
    emit(this.backdrop, "modal:close");
  };

  GlassModal.prototype._handleKey = function (evt) {
    if (evt.key === "Escape") {
      this.close();
      return;
    }
    trapFocus(this.modal, evt);
  };

  GlassModal.init = function () {
    var backdrop = document.getElementById("modal-backdrop");
    if (backdrop) new GlassModal(backdrop);
  };

  /* ======================================================================
       GlassTabs
       ====================================================================== */
  function GlassTabs(containerEl) {
    this.container = containerEl;
    this.tabs = Array.from(containerEl.querySelectorAll(".glass-tab"));
    this.panels = Array.from(containerEl.querySelectorAll(".glass-tab-panel"));
    this._bind();
  }

  GlassTabs.prototype._bind = function () {
    var self = this;
    this.tabs.forEach(function (tab, i) {
      tab.addEventListener("click", function () {
        self.activate(i);
      });
      tab.addEventListener("keydown", function (evt) {
        if (evt.key === "ArrowRight") {
          evt.preventDefault();
          self.activate((i + 1) % self.tabs.length);
          self.tabs[(i + 1) % self.tabs.length].focus();
        }
        if (evt.key === "ArrowLeft") {
          evt.preventDefault();
          var prev = (i - 1 + self.tabs.length) % self.tabs.length;
          self.activate(prev);
          self.tabs[prev].focus();
        }
        if (evt.key === "Home") {
          evt.preventDefault();
          self.activate(0);
          self.tabs[0].focus();
        }
        if (evt.key === "End") {
          evt.preventDefault();
          self.activate(self.tabs.length - 1);
          self.tabs[self.tabs.length - 1].focus();
        }
      });
    });
  };

  GlassTabs.prototype.activate = function (index) {
    var self = this;
    this.tabs.forEach(function (t, i) {
      var on = i === index;
      t.setAttribute("aria-selected", String(on));
      t.setAttribute("tabindex", on ? "0" : "-1");
    });
    this.panels.forEach(function (p, i) {
      if (i === index) {
        p.classList.add("is-active");
      } else {
        p.classList.remove("is-active");
      }
    });
    emit(this.container, "tabs:change", { index: index });
  };

  GlassTabs.init = function () {
    document.querySelectorAll(".glass-tabs").forEach(function (el) {
      new GlassTabs(el);
    });
  };

  /* ======================================================================
       GlassAccordion
       ====================================================================== */
  function GlassAccordion(containerEl) {
    this.container = containerEl;
    this._bind();
  }

  GlassAccordion.prototype._bind = function () {
    var self = this;
    this.container
      .querySelectorAll(".glass-accordion-trigger")
      .forEach(function (trigger) {
        trigger.addEventListener("click", function () {
          var item = trigger.closest(".glass-accordion-item");
          if (!item) return;
          var isOpen = item.classList.contains("is-open");

          /* Allow multiple open — remove this block to make exclusive */
          item.classList.toggle("is-open", !isOpen);
          trigger.setAttribute("aria-expanded", String(!isOpen));
          emit(item, "accordion:toggle", { open: !isOpen });
        });

        trigger.addEventListener("keydown", function (evt) {
          if (evt.key === "Enter" || evt.key === " ") {
            evt.preventDefault();
            trigger.click();
          }
        });
      });
  };

  GlassAccordion.init = function () {
    document.querySelectorAll(".glass-accordion").forEach(function (el) {
      new GlassAccordion(el);
    });
  };

  /* ======================================================================
       GlassDropdown
       ====================================================================== */
  function GlassDropdown(containerEl) {
    this.container = containerEl;
    this.trigger = containerEl.querySelector(".glass-dropdown-trigger");
    this.menu = containerEl.querySelector(".glass-dropdown-menu");
    this._onOutside = this._closeOnOutside.bind(this);
    this._bind();
  }

  GlassDropdown.prototype._bind = function () {
    var self = this;
    if (this.trigger) {
      this.trigger.addEventListener("click", function (evt) {
        evt.stopPropagation();
        self.toggle();
      });
      this.trigger.addEventListener("keydown", function (evt) {
        if (evt.key === "ArrowDown") {
          evt.preventDefault();
          self.open();
          self._focusFirst();
        }
        if (evt.key === "Escape") {
          self.close();
        }
      });
    }

    if (this.menu) {
      this.menu
        .querySelectorAll(".glass-dropdown-item")
        .forEach(function (item) {
          item.addEventListener("click", function () {
            self.close();
          });
          item.addEventListener("keydown", function (evt) {
            if (evt.key === "Escape") {
              self.close();
              self.trigger && self.trigger.focus();
            }
            if (evt.key === "ArrowDown") {
              evt.preventDefault();
              var next = item.nextElementSibling;
              while (next && next.classList.contains("glass-dropdown-divider"))
                next = next.nextElementSibling;
              if (next) next.focus();
            }
            if (evt.key === "ArrowUp") {
              evt.preventDefault();
              var prev = item.previousElementSibling;
              while (prev && prev.classList.contains("glass-dropdown-divider"))
                prev = prev.previousElementSibling;
              if (prev) prev.focus();
              else self.trigger && self.trigger.focus();
            }
          });
        });
    }
  };

  GlassDropdown.prototype.open = function () {
    this.container.classList.add("is-open");
    this.trigger && this.trigger.setAttribute("aria-expanded", "true");
    document.addEventListener("click", this._onOutside);
    document.addEventListener(
      "keydown",
      (this._onKey = function (evt) {
        if (evt.key === "Escape") this.close();
      }.bind(this))
    );
    emit(this.container, "dropdown:open");
  };

  GlassDropdown.prototype.close = function () {
    this.container.classList.remove("is-open");
    this.trigger && this.trigger.setAttribute("aria-expanded", "false");
    document.removeEventListener("click", this._onOutside);
    emit(this.container, "dropdown:close");
  };

  GlassDropdown.prototype.toggle = function () {
    this.container.classList.contains("is-open") ? this.close() : this.open();
  };

  GlassDropdown.prototype._focusFirst = function () {
    var first = this.menu && this.menu.querySelector(".glass-dropdown-item");
    if (first)
      setTimeout(function () {
        first.focus();
      }, 20);
  };

  GlassDropdown.prototype._closeOnOutside = function (evt) {
    if (!this.container.contains(evt.target)) this.close();
  };

  GlassDropdown.init = function () {
    document.querySelectorAll(".glass-dropdown").forEach(function (el) {
      new GlassDropdown(el);
    });
  };

  /* ======================================================================
       GlassToast
       ====================================================================== */
  var GlassToast = {
    ICONS: { success: "✓", error: "✕", warning: "⚠", info: "ℹ" },
    LABELS: {
      success: "Success",
      error: "Error",
      warning: "Warning",
      info: "Info"
    },

    show: function (type, title, desc, duration) {
      var region = document.getElementById("toast-region");
      if (!region) return;

      var toast = document.createElement("div");
      toast.className = "glass glass-toast glass-toast--" + type;
      toast.setAttribute("role", "status");
      toast.setAttribute("aria-live", "polite");
      toast.innerHTML =
        '<span class="glass-toast__icon" aria-hidden="true">' +
        (this.ICONS[type] || "ℹ") +
        "</span>" +
        '<div class="glass-toast__body">' +
        '<div class="glass-toast__title">' +
        (title || this.LABELS[type]) +
        "</div>" +
        (desc ? '<div class="glass-toast__desc">' + desc + "</div>" : "") +
        "</div>" +
        '<span class="glass-toast__close" aria-label="Dismiss">✕</span>';

      region.appendChild(toast);
      emit(region, "toast:show", { type: type, title: title });

      var dismiss = function () {
        toast.classList.add("is-exiting");
        toast.addEventListener(
          "animationend",
          function () {
            toast.remove();
          },
          { once: true }
        );
      };

      toast
        .querySelector(".glass-toast__close")
        .addEventListener("click", dismiss);
      toast.addEventListener("click", dismiss);
      if (duration !== 0) setTimeout(dismiss, duration || 4000);
    },

    init: function () {
      document.addEventListener("click", function (evt) {
        var btn = evt.target.closest("[data-toast]");
        if (!btn) return;
        GlassToast.show(
          btn.dataset.toast,
          btn.dataset.toastTitle,
          btn.dataset.toastDesc
        );
      });
    }
  };

  /* ======================================================================
       GlassStepper
       ====================================================================== */
  var GlassStepper = {
    init: function () {
      var stepper = document.getElementById("stepper-h");
      var prevBtn = document.getElementById("stepper-prev");
      var nextBtn = document.getElementById("stepper-next");
      if (!stepper || !prevBtn || !nextBtn) return;

      var steps = Array.from(stepper.querySelectorAll(".glass-step"));
      var current = steps.findIndex(function (s) {
        return s.classList.contains("is-active");
      });

      function update(idx) {
        steps.forEach(function (step, i) {
          step.classList.toggle("is-complete", i < idx);
          step.classList.toggle("is-active", i === idx);
          step.classList.toggle("is-pending", i > idx);
          var node = step.querySelector(".glass-step__node");
          if (node) {
            if (i < idx) node.textContent = "✓";
            else node.textContent = String(i + 1);
          }
          var nodeEl = step.querySelector(".glass-step__node");
          if (nodeEl) {
            if (i === idx) {
              nodeEl.setAttribute("aria-current", "step");
            } else {
              nodeEl.removeAttribute("aria-current");
            }
          }
        });
        current = idx;
        prevBtn.disabled = idx === 0;
        nextBtn.disabled = idx === steps.length - 1;
        emit(stepper, "stepper:change", { step: idx });
      }

      prevBtn.addEventListener("click", function () {
        if (current > 0) update(current - 1);
      });
      nextBtn.addEventListener("click", function () {
        if (current < steps.length - 1) update(current + 1);
      });
      update(current >= 0 ? current : 0);
    }
  };

  /* ======================================================================
       GlassNavTabs (pill nav)
       ====================================================================== */
  var GlassNavTabs = {
    init: function () {
      document.querySelectorAll(".glass-nav").forEach(function (nav) {
        nav.addEventListener("click", function (evt) {
          var item = evt.target.closest(".glass-nav__item");
          if (!item) return;
          nav.querySelectorAll(".glass-nav__item").forEach(function (el) {
            el.classList.remove("glass-nav__item--active");
          });
          item.classList.add("glass-nav__item--active");
        });
        nav.addEventListener("keydown", function (evt) {
          var item = evt.target.closest(".glass-nav__item");
          if (!item) return;
          if (evt.key === "Enter" || evt.key === " ") {
            evt.preventDefault();
            item.click();
          }
        });
      });
    }
  };

  /* ======================================================================
       GlassToggle
       ====================================================================== */
  var GlassToggle = {
    init: function () {
      document.querySelectorAll(".glass-toggle").forEach(function (toggle) {
        toggle.addEventListener("click", function (evt) {
          var opt = evt.target.closest(".glass-toggle__opt");
          if (!opt) return;
          toggle.querySelectorAll(".glass-toggle__opt").forEach(function (el) {
            el.classList.remove("is-on");
          });
          opt.classList.add("is-on");
        });
      });
    }
  };

  /* ======================================================================
       GlassRipple
       ====================================================================== */
  var GlassRipple = {
    create: function (el, evt) {
      /* Limit DOM nodes: skip if too many ripples present */
      if (el.querySelectorAll("[data-ripple]").length > 3) return;

      var ripple = document.createElement("span");
      ripple.setAttribute("data-ripple", "");
      var rect = el.getBoundingClientRect();
      var size = Math.max(rect.width, rect.height) * 1.2;
      var x = evt.clientX - rect.left - size / 2;
      var y = evt.clientY - rect.top - size / 2;

      Object.assign(ripple.style, {
        position: "absolute",
        left: x + "px",
        top: y + "px",
        width: size + "px",
        height: size + "px",
        borderRadius: "50%",
        background: "rgba(255,255,255,0.18)",
        transform: "scale(0)",
        pointerEvents: "none",
        animation: "ripple 600ms ease-out forwards",
        zIndex: "999"
      });

      el.appendChild(ripple);
      ripple.addEventListener(
        "animationend",
        function () {
          ripple.remove();
        },
        { once: true }
      );
    },

    init: function () {
      document.addEventListener("click", function (evt) {
        var target = evt.target.closest(".glass-btn, .glass-card, .notif");
        if (target) GlassRipple.create(target, evt);
      });
    }
  };

  /* ======================================================================
       GlassParallax (mouse tilt on cards)
       ====================================================================== */
  var GlassParallax = {
    init: function () {
      /* Skip on touch devices */
      if (window.matchMedia("(hover: none)").matches) return;
      /* Respect reduced motion */
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      document.querySelectorAll(".glass-card").forEach(function (card) {
        card.addEventListener("mousemove", function (evt) {
          var rect = card.getBoundingClientRect();
          var dx =
            (evt.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
          var dy =
            (evt.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
          card.style.transform =
            "translateY(-6px) scale(1.01) rotateX(" +
            -dy * 4 +
            "deg) rotateY(" +
            dx * 4 +
            "deg)";
          card.style.transition = "none";
        });
        card.addEventListener("mouseleave", function () {
          card.style.transform = "";
          card.style.transition = "";
        });
      });
    }
  };

  /* ======================================================================
       GlassChips
       ====================================================================== */
  var GlassChips = {
    init: function () {
      /* Dismiss */
      document.addEventListener("click", function (evt) {
        var btn = evt.target.closest(".glass-chip__dismiss");
        if (!btn) return;
        var chip = btn.closest(".glass-chip");
        if (!chip) return;
        chip.classList.add("is-exiting");
        chip.addEventListener(
          "animationend",
          function () {
            chip.remove();
          },
          { once: true }
        );
        emit(chip, "chip:dismiss");
      });

      /* Selectable */
      var filterGroup = document.getElementById("filter-chips");
      if (filterGroup) {
        function toggleChip(chip) {
          var on = !chip.classList.contains("is-selected");
          chip.classList.toggle("is-selected", on);
          chip.setAttribute("aria-checked", String(on));
          emit(chip, "chip:select", {
            value: chip.dataset.value,
            selected: on
          });
        }
        filterGroup.addEventListener("click", function (evt) {
          var chip = evt.target.closest(".js-selectable");
          if (chip) toggleChip(chip);
        });
        filterGroup.addEventListener("keydown", function (evt) {
          var chip = evt.target.closest(".js-selectable");
          if (chip && (evt.key === "Enter" || evt.key === " ")) {
            evt.preventDefault();
            toggleChip(chip);
          }
        });
      }

      /* Dynamic add */
      var addBtn = document.getElementById("chip-add-btn");
      var dynGroup = document.getElementById("dynamic-chips");
      if (!addBtn || !dynGroup) return;

      var activeInputWrap = null;

      function commitChip() {
        if (!activeInputWrap) return;
        var val =
          (activeInputWrap.querySelector(".glass-chip-input") || {}).value ||
          "";
        var label = val.trim();
        cancelInput();
        if (!label) return;
        var chip = document.createElement("span");
        chip.className = "glass glass-chip is-entering";
        chip.setAttribute("data-chip", "");
        chip.innerHTML =
          '<span class="glass-chip__label">' +
          label.replace(/</g, "&lt;").replace(/>/g, "&gt;") +
          '</span><span class="glass-chip__dismiss" role="button" aria-label="Remove ' +
          label +
          '">✕</span>';
        dynGroup.insertBefore(chip, addBtn);
        chip.addEventListener(
          "animationend",
          function () {
            chip.classList.remove("is-entering");
          },
          { once: true }
        );
        emit(dynGroup, "chip:add", { label: label });
      }

      function cancelInput() {
        if (!activeInputWrap) return;
        activeInputWrap.remove();
        activeInputWrap = null;
        addBtn.style.display = "";
      }

      function openInput() {
        if (activeInputWrap) return;
        addBtn.style.display = "none";
        var wrap = document.createElement("div");
        wrap.className = "glass-chip-input-wrap";
        wrap.innerHTML =
          '<input class="glass-chip-input" type="text" placeholder="Tag name…" maxlength="24" autocomplete="off" aria-label="New chip name"><button class="glass-chip-input-confirm" aria-label="Add chip">✓</button>';
        activeInputWrap = wrap;
        dynGroup.insertBefore(wrap, addBtn);

        var inputEl = wrap.querySelector(".glass-chip-input");
        var confirmEl = wrap.querySelector(".glass-chip-input-confirm");
        inputEl.focus();

        inputEl.addEventListener("keydown", function (evt) {
          if (evt.key === "Enter") {
            evt.preventDefault();
            commitChip();
          }
          if (evt.key === "Escape") {
            cancelInput();
          }
        });
        confirmEl.addEventListener("click", function (evt) {
          evt.stopPropagation();
          commitChip();
        });
        setTimeout(function () {
          document.addEventListener("click", function onOut(evt) {
            if (!wrap.contains(evt.target) && evt.target !== addBtn) {
              document.removeEventListener("click", onOut);
              cancelInput();
            }
          });
        }, 0);
      }

      addBtn.addEventListener("click", function (evt) {
        evt.stopPropagation();
        openInput();
      });
    }
  };

  /* ======================================================================
       GlassAvatarGroups
       ====================================================================== */
  var GlassAvatarGroups = {
    init: function () {
      document
        .querySelectorAll(".glass-avatar-group")
        .forEach(function (group) {
          var avatars = Array.from(group.querySelectorAll(".glass-avatar"));
          avatars.forEach(function (av, i) {
            av.style.zIndex = i + 1;
            av.addEventListener("mouseenter", function () {
              av.style.zIndex = avatars.length + 10;
            });
            av.addEventListener("mouseleave", function () {
              av.style.zIndex = i + 1;
            });
          });
        });
    }
  };

  /* ======================================================================
       GlassBreadcrumb
       ====================================================================== */
  var GlassBreadcrumb = {
    init: function () {
      var wrap = document.getElementById("bc-ellipsis-wrap");
      var btn = document.getElementById("bc-ellipsis");
      if (!wrap || !btn) return;

      function close() {
        wrap.classList.remove("is-open");
        btn.setAttribute("aria-expanded", "false");
      }

      btn.addEventListener("click", function (evt) {
        evt.stopPropagation();
        var open = wrap.classList.toggle("is-open");
        btn.setAttribute("aria-expanded", String(open));
      });

      wrap.querySelector(".glass-breadcrumb-dropdown") &&
        wrap
          .querySelector(".glass-breadcrumb-dropdown")
          .addEventListener("click", close);

      document.addEventListener("click", function (evt) {
        if (!wrap.contains(evt.target)) close();
      });
      document.addEventListener("keydown", function (evt) {
        if (evt.key === "Escape") close();
      });
    }
  };

  /* ======================================================================
       GlassTable — sort, search, row selection, bulk actions
       ====================================================================== */
  function GlassTable(wrapEl) {
    this.wrap = wrapEl;
    this.table = wrapEl.querySelector(".glass-table");
    this.tbody = wrapEl.querySelector("#tbl-body");
    this.searchEl = wrapEl.querySelector("#tbl-search");
    this.countEl = wrapEl.querySelector("#tbl-count");
    this.bulkBar = wrapEl.querySelector("#tbl-bulk");
    this.bulkCount = wrapEl.querySelector("#tbl-bulk-count");
    this.deselect = wrapEl.querySelector("#tbl-deselect");
    this.checkAll = wrapEl.querySelector("#tbl-check-all");
    this.pageInfo = wrapEl.querySelector("#tbl-page-info");
    this.sortCol = "name";
    this.sortDir = "asc";

    /* Cache all original rows as data objects */
    this._rows = Array.from(this.tbody.querySelectorAll("tr")).map(function (
      tr
    ) {
      return {
        el: tr,
        id: tr.dataset.id,
        name: tr.querySelector(".glass-table-member__name")
          ? tr.querySelector(".glass-table-member__name").textContent
          : "",
        role: tr.cells[2] ? tr.cells[2].textContent.trim() : "",
        projects: parseInt(
          tr.cells[4] ? tr.cells[4].textContent.trim() : "0",
          10
        ),
        score: parseInt(
          tr.querySelector(".glass-table-score__num")
            ? tr.querySelector(".glass-table-score__num").textContent.trim()
            : "0",
          10
        ),
        selected: false
      };
    });

    this._filtered = this._rows.slice();
    this._bind();
    this._refreshCount();
  }

  GlassTable.prototype._bind = function () {
    var self = this;

    /* Column sort */
    this.table.querySelectorAll("thead th[data-col]").forEach(function (th) {
      th.addEventListener("click", function () {
        var col = th.dataset.col;
        if (self.sortCol === col) {
          self.sortDir = self.sortDir === "asc" ? "desc" : "asc";
        } else {
          self.sortCol = col;
          self.sortDir = "asc";
        }
        self._applySort();
        self._updateSortUI();
      });
    });

    /* Search */
    if (this.searchEl) {
      this.searchEl.addEventListener("input", function () {
        self._applyFilter();
      });
    }

    /* Row checkboxes */
    this.tbody.addEventListener("change", function (evt) {
      if (!evt.target.classList.contains("glass-table-check")) return;
      var tr = evt.target.closest("tr");
      var row = self._rows.find(function (r) {
        return r.el === tr;
      });
      if (row) row.selected = evt.target.checked;
      tr.classList.toggle("is-selected", evt.target.checked);
      self._refreshBulk();
    });

    /* Select all */
    if (this.checkAll) {
      this.checkAll.addEventListener("change", function () {
        var checked = self.checkAll.checked;
        self._filtered.forEach(function (row) {
          row.selected = checked;
          row.el.classList.toggle("is-selected", checked);
          var cb = row.el.querySelector(".glass-table-check");
          if (cb) cb.checked = checked;
        });
        self._refreshBulk();
      });
    }

    /* Deselect all */
    if (this.deselect) {
      this.deselect.addEventListener("click", function () {
        self._rows.forEach(function (row) {
          row.selected = false;
          row.el.classList.remove("is-selected");
          var cb = row.el.querySelector(".glass-table-check");
          if (cb) cb.checked = false;
        });
        if (self.checkAll) self.checkAll.checked = false;
        self._refreshBulk();
      });
    }
  };

  GlassTable.prototype._applyFilter = function () {
    var query = this.searchEl ? this.searchEl.value.trim().toLowerCase() : "";
    this._filtered = this._rows.filter(function (row) {
      return (
        !query ||
        row.name.toLowerCase().includes(query) ||
        row.role.toLowerCase().includes(query)
      );
    });

    /* Show/hide rows */
    this._rows.forEach(function (row) {
      row.el.style.display = "none";
    });
    this._filtered.forEach(function (row) {
      row.el.style.display = "";
    });

    this._refreshCount();
  };

  GlassTable.prototype._applySort = function () {
    var col = this.sortCol;
    var dir = this.sortDir;

    this._filtered.sort(function (a, b) {
      var av = a[col],
        bv = b[col];
      if (typeof av === "string") av = av.toLowerCase();
      if (typeof bv === "string") bv = bv.toLowerCase();
      if (av < bv) return dir === "asc" ? -1 : 1;
      if (av > bv) return dir === "asc" ? 1 : -1;
      return 0;
    });

    /* Reorder DOM */
    var tbody = this.tbody;
    this._filtered.forEach(function (row) {
      tbody.appendChild(row.el);
    });

    /* Stagger re-entry */
    this._filtered.forEach(function (row, i) {
      row.el.style.animation = "none";
      row.el.offsetHeight; /* force reflow */
      row.el.style.animation = "cascade-in 200ms ease both";
      row.el.style.animationDelay = i * 30 + "ms";
    });
  };

  GlassTable.prototype._updateSortUI = function () {
    var col = this.sortCol;
    var dir = this.sortDir;
    this.table.querySelectorAll("thead th[data-col]").forEach(function (th) {
      var isSorted = th.dataset.col === col;
      th.classList.toggle("is-sorted", isSorted);
      th.classList.toggle("sort-desc", isSorted && dir === "desc");
      var icon = th.querySelector(".glass-table__sort-icon");
      if (icon) {
        if (!isSorted) {
          icon.textContent = "↕";
        } else {
          icon.textContent = dir === "asc" ? "↑" : "↓";
        }
      }
    });
  };

  GlassTable.prototype._refreshBulk = function () {
    var count = this._rows.filter(function (r) {
      return r.selected;
    }).length;
    if (this.bulkBar) this.bulkBar.classList.toggle("is-visible", count > 0);
    if (this.bulkCount) this.bulkCount.textContent = count + " selected";
    /* Sync indeterminate state on select-all */
    if (this.checkAll) {
      var total = this._filtered.length;
      this.checkAll.indeterminate = count > 0 && count < total;
      this.checkAll.checked = count > 0 && count === total;
    }
    emit(this.wrap, "table:select", { count: count });
  };

  GlassTable.prototype._refreshCount = function () {
    if (this.countEl) {
      this.countEl.textContent =
        this._filtered.length +
        " member" +
        (this._filtered.length !== 1 ? "s" : "");
    }
    if (this.pageInfo) {
      this.pageInfo.textContent =
        "Showing 1–" + this._filtered.length + " of " + this._rows.length;
    }
  };

  GlassTable.init = function () {
    var wrap = document.getElementById("data-table-wrap");
    if (wrap) new GlassTable(wrap);
  };
  function boot() {
    GlassTheme.init();
    GlassModal.init();
    GlassTabs.init();
    GlassAccordion.init();
    GlassDropdown.init();
    GlassToast.init();
    GlassStepper.init();
    GlassNavTabs.init();
    GlassToggle.init();
    GlassRipple.init();
    GlassParallax.init();
    GlassChips.init();
    GlassAvatarGroups.init();
    GlassBreadcrumb.init();
    GlassTable.init();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();