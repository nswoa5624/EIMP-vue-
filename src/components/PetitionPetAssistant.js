import { computed, h, onBeforeUnmount, onMounted, ref } from "vue";

const TOPICS = [
  { id: "air", name: "空氣", icon: "氣", total: 12, active: 7, today: 2, tone: "teal" },
  { id: "water", name: "水污染", icon: "水", total: 8, active: 5, today: 1, tone: "blue" },
  { id: "waste", name: "廢棄物", icon: "廢", total: 15, active: 9, today: 4, tone: "amber" },
  { id: "noise", name: "噪音", icon: "噪", total: 21, active: 13, today: 6, tone: "violet" },
];

const PET_SIZE = 88;
const EDGE_GAP = 16;
const PET_IMAGES = {
  idle: "/images/pet-2d-idle.webp",
  hover: "/images/pet-2d-hover.webp",
  "drag-left": "/images/pet-2d-drag-left.webp",
  "drag-right": "/images/pet-2d-drag-right.webp",
  "hands-up": "/images/pet-2d-hands-up.webp",
  thinking: "/images/pet-2d-thinking.webp",
};

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), Math.max(min, max));
}

export default {
  name: "PetitionPetAssistant",
  setup() {
    const position = ref({
      x: Math.max(EDGE_GAP, window.innerWidth - PET_SIZE - 24),
      y: Math.max(EDGE_GAP, window.innerHeight - PET_SIZE - 24),
    });
    const isOpen = ref(true);
    const isPressed = ref(false);
    const isDragging = ref(false);
    const dragDirection = ref("right");
    const isCelebrating = ref(false);
    const isHovered = ref(false);
    const isThinking = ref(false);
    const selectedTopic = ref(null);
    const petElement = ref(null);
    let pointerStart = null;
    let celebrationTimer = null;

    const selected = computed(() => TOPICS.find((topic) => topic.id === selectedTopic.value));
    const totalCases = TOPICS.reduce((sum, topic) => sum + topic.total, 0);
    const activeCases = TOPICS.reduce((sum, topic) => sum + topic.active, 0);
    const newCases = TOPICS.reduce((sum, topic) => sum + topic.today, 0);
    const petState = computed(() => {
      if (isDragging.value) return `drag-${dragDirection.value}`;
      if (isPressed.value || isCelebrating.value) return "hands-up";
      if (isThinking.value) return "thinking";
      if (isHovered.value) return "hover";
      return "idle";
    });
    const petImage = computed(() => PET_IMAGES[petState.value]);

    const assistantApi = {
      setThinking(value) {
        isThinking.value = Boolean(value);
      },
    };

    const assistantMessage = computed(() => {
      if (!selected.value) {
        return `目前四大主題共有 ${totalCases} 件陳情案件，${activeCases} 件處理中；今天新增 ${newCases} 件。點選主題可看摘要。`;
      }

      const topic = selected.value;
      return `${topic.name}主題目前 ${topic.total} 件，其中 ${topic.active} 件處理中，今天新增 ${topic.today} 件。我會持續替你留意進度。`;
    });

    const panelPlacement = computed(() => ({
      "is-panel-left": position.value.x > window.innerWidth - 420,
      "is-panel-below": position.value.y < 370,
    }));

    function setDefaultPosition() {
      position.value = {
        x: Math.max(EDGE_GAP, window.innerWidth - PET_SIZE - 24),
        y: Math.max(EDGE_GAP, window.innerHeight - PET_SIZE - 24),
      };
    }

    function keepInViewport() {
      position.value = {
        x: clamp(position.value.x, EDGE_GAP, window.innerWidth - PET_SIZE - EDGE_GAP),
        y: clamp(position.value.y, EDGE_GAP, window.innerHeight - PET_SIZE - EDGE_GAP),
      };
    }

    function onPointerDown(event) {
      if (event.button !== undefined && event.button !== 0) return;
      clearTimeout(celebrationTimer);
      isCelebrating.value = false;
      isPressed.value = true;
      isDragging.value = false;
      pointerStart = {
        clientX: event.clientX,
        clientY: event.clientY,
        lastClientX: event.clientX,
        x: position.value.x,
        y: position.value.y,
      };
      event.currentTarget.setPointerCapture?.(event.pointerId);
    }

    function onPointerMove(event) {
      if (!pointerStart) return;
      const dx = event.clientX - pointerStart.clientX;
      const dy = event.clientY - pointerStart.clientY;
      const horizontalMovement = event.clientX - pointerStart.lastClientX;

      if (Math.abs(horizontalMovement) > 1) {
        dragDirection.value = horizontalMovement < 0 ? "left" : "right";
      }
      pointerStart.lastClientX = event.clientX;

      if (Math.hypot(dx, dy) > 5) isDragging.value = true;
      if (!isDragging.value) return;

      position.value = {
        x: clamp(pointerStart.x + dx, EDGE_GAP, window.innerWidth - PET_SIZE - EDGE_GAP),
        y: clamp(pointerStart.y + dy, EDGE_GAP, window.innerHeight - PET_SIZE - EDGE_GAP),
      };
    }

    function finishPointer(event) {
      if (!pointerStart) return;
      const moved = isDragging.value;
      event.currentTarget.releasePointerCapture?.(event.pointerId);
      pointerStart = null;
      isPressed.value = false;
      isDragging.value = false;
      if (!moved) {
        isCelebrating.value = true;
        celebrationTimer = window.setTimeout(() => {
          isCelebrating.value = false;
        }, 650);
        isOpen.value = !isOpen.value;
      }
    }

    function cancelPointer() {
      pointerStart = null;
      isPressed.value = false;
      isDragging.value = false;
    }

    function onKeydown(event) {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      isOpen.value = !isOpen.value;
    }

    function chooseTopic(topic) {
      selectedTopic.value = selectedTopic.value === topic.id ? null : topic.id;
    }

    function onThinkingChange(event) {
      isThinking.value = Boolean(event.detail?.thinking ?? event.detail);
    }

    onMounted(() => {
      setDefaultPosition();
      Object.values(PET_IMAGES).forEach((src) => {
        const image = new Image();
        image.src = src;
      });
      window.EIMPPetAssistant = assistantApi;
      window.addEventListener("resize", keepInViewport);
      window.addEventListener("eimp:pet-thinking", onThinkingChange);
      window.addEventListener("pointermove", onPointerMove);
      window.addEventListener("pointerup", finishPointer);
      window.addEventListener("pointercancel", cancelPointer);
    });

    onBeforeUnmount(() => {
      clearTimeout(celebrationTimer);
      if (window.EIMPPetAssistant === assistantApi) delete window.EIMPPetAssistant;
      window.removeEventListener("resize", keepInViewport);
      window.removeEventListener("eimp:pet-thinking", onThinkingChange);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", finishPointer);
      window.removeEventListener("pointercancel", cancelPointer);
    });

    function renderPet() {
      return h("button", {
        ref: petElement,
        type: "button",
        class: ["eimp-pet", `is-${petState.value}`, { "is-pressed": isPressed.value, "is-dragging": isDragging.value }],
        "aria-label": isOpen.value ? "關閉陳情案件 AI 助理" : "開啟陳情案件 AI 助理",
        "aria-expanded": String(isOpen.value),
        "aria-busy": String(isThinking.value),
        onMouseenter: () => { isHovered.value = true; },
        onMouseleave: () => { isHovered.value = false; },
        onPointerdown: onPointerDown,
        onPointermove: onPointerMove,
        onPointerup: finishPointer,
        onPointercancel: cancelPointer,
        onKeydown,
      }, [
        h("span", { class: "eimp-flower-pet-shadow", "aria-hidden": "true" }),
        h("span", { class: "eimp-flower-pet-halo", "aria-hidden": "true" }),
        h("img", {
          class: "eimp-flower-pet-image",
          src: petImage.value,
          alt: "",
          draggable: "false",
          "aria-hidden": "true",
        }),
        h("span", { class: "eimp-pet-badge" }, String(newCases)),
      ]);
    }

    function renderTopic(topic) {
      const active = selectedTopic.value === topic.id;
      return h("button", {
        type: "button",
        class: ["eimp-topic-card", `is-${topic.tone}`, { "is-selected": active }],
        "aria-pressed": String(active),
        onClick: () => chooseTopic(topic),
      }, [
        h("span", { class: "eimp-topic-icon", "aria-hidden": "true" }, topic.icon),
        h("span", { class: "eimp-topic-copy" }, [
          h("strong", topic.name),
          h("small", `${topic.active} 件處理中`),
        ]),
        h("span", { class: "eimp-topic-count" }, [
          h("strong", String(topic.total)),
          h("small", `+${topic.today} 今日`),
        ]),
      ]);
    }

    function renderPanel() {
      if (!isOpen.value) return null;
      return h("section", {
        class: ["eimp-assistant-panel", panelPlacement.value],
        role: "dialog",
        "aria-label": "陳情案件 AI 助理",
        "aria-live": "polite",
      }, [
        h("div", { class: "eimp-assistant-header" }, [
          h("span", { class: "eimp-assistant-mini", "aria-hidden": "true" }, "AI"),
          h("div", { class: "eimp-assistant-title" }, [
            h("strong", "環境陳情小幫手"),
            h("span", [h("i"), " 即時守候中"]),
          ]),
          h("button", {
            type: "button",
            class: "eimp-assistant-close",
            "aria-label": "關閉對話視窗",
            onClick: () => { isOpen.value = false; },
          }, "×"),
        ]),
        h("div", { class: "eimp-assistant-content" }, [
          h("p", { class: "eimp-assistant-greeting" }, "嗨！我是你的環境推播助理 🌱"),
          h("p", { class: "eimp-assistant-message" }, assistantMessage.value),
          h("div", { class: "eimp-topic-grid", "aria-label": "四大陳情主題" }, TOPICS.map(renderTopic)),
          h("div", { class: "eimp-assistant-footer" }, [
            h("span", "示範資料 · 更新於今天 09:30"),
            h("button", {
              type: "button",
              onClick: () => { selectedTopic.value = null; },
            }, "查看總覽"),
          ]),
        ]),
        h("span", { class: "eimp-panel-tail", "aria-hidden": "true" }),
      ]);
    }

    return () => h("div", {
      class: "eimp-pet-assistant",
      style: { left: `${position.value.x}px`, top: `${position.value.y}px` },
    }, [renderPanel(), renderPet()]);
  },
};
