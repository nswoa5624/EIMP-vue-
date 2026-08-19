import { computed, h, nextTick, onBeforeUnmount, onMounted, ref } from "vue";

const ANALYSIS_API_ENDPOINT = "https://nswoa5624.zeabur.app/webhook/ai-analysis/latest";
const ROUTE_STORAGE_KEY = "eimp-analysis-route-key";
const ROUTE_OPTIONS = [
  { key: "DIV_1", label: "第一稽查分隊" },
  { key: "DIV_2", label: "第二稽查分隊" },
  { key: "DIV_3", label: "第三稽查分隊" },
  { key: "DIV_4", label: "第四稽查分隊" },
  { key: "DIV_5", label: "第五稽查分隊" },
  { key: "DIV_6", label: "第六稽查分隊" },
  { key: "HQ", label: "稽查科本部" },
];
const ROUTE_BY_UNIT = new Map(ROUTE_OPTIONS.filter((route) => route.key !== "HQ").map((route) => [route.label, route.key]));

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

function normalizeRouteKey(value) {
  const routeKey = String(value ?? "").trim().toUpperCase();
  return ROUTE_OPTIONS.some((route) => route.key === routeKey) ? routeKey : "";
}

function routeKeyFromUnit(unit) {
  const normalizedUnit = String(unit ?? "").trim();
  if (ROUTE_BY_UNIT.has(normalizedUnit)) return ROUTE_BY_UNIT.get(normalizedUnit);
  if (/^(EIMP|稽查科本部|新北市環保局|環境保護局)$/i.test(normalizedUnit)) return "HQ";
  return "";
}

function getQueryRouteKey() {
  return normalizeRouteKey(new URLSearchParams(window.location.search).get("route_key"));
}

function getInitialRouteKey() {
  const queryRouteKey = getQueryRouteKey();
  if (queryRouteKey) return queryRouteKey;

  const storedRouteKey = normalizeRouteKey(localStorage.getItem(ROUTE_STORAGE_KEY));
  if (storedRouteKey) return storedRouteKey;

  return routeKeyFromUnit(document.getElementById("companyInput")?.value) || "HQ";
}

function parsePushMessage(message = "") {
  const result = { title: "EIMP｜新北市環境陳情摘要", total: null, totalLabel: "案件總數", sections: [] };
  let currentSection = null;

  for (const rawLine of String(message).replace(/\r/g, "").split("\n")) {
    const line = rawLine.trim();
    if (!line) continue;

    if (/^【.*】$/.test(line)) {
      result.title = line.slice(1, -1);
      continue;
    }

    const totalMatch = line.match(/^(全市案件|目前案件|案件總數)[：:]\s*(\d+)\s*件/);
    if (totalMatch) {
      result.totalLabel = totalMatch[1];
      result.total = Number(totalMatch[2]);
      continue;
    }

    if (!line.startsWith("•") && /[：:]$/.test(line)) {
      currentSection = {
        title: line.replace(/[：:]$/, ""),
        tone: line.includes("⚠️") ? "warning" : line.includes("🔥") ? "hotspot" : line.startsWith("AI") ? "ai" : "default",
        paragraphs: [],
        items: [],
      };
      result.sections.push(currentSection);
      continue;
    }

    if (!currentSection) {
      currentSection = { title: "最新摘要", tone: "default", paragraphs: [], items: [] };
      result.sections.push(currentSection);
    }

    if (line.startsWith("•")) {
      currentSection.items.push({ title: line.replace(/^•\s*/, ""), details: [] });
    } else if (/^\s/.test(rawLine) && currentSection.items.length) {
      currentSection.items.at(-1).details.push(line);
    } else {
      currentSection.paragraphs.push(line);
    }
  }

  return result;
}

export default {
  name: "PetitionPetAssistant",
  setup() {
    const position = ref({
      x: Math.max(EDGE_GAP, window.innerWidth - PET_SIZE - 24),
      y: Math.max(EDGE_GAP, window.innerHeight - PET_SIZE - 24),
    });
    const isOpen = ref(false);
    const activeView = ref("prompt");
    const unreadCount = ref(1);
    const isPressed = ref(false);
    const isDragging = ref(false);
    const dragDirection = ref("right");
    const isCelebrating = ref(false);
    const isHovered = ref(false);
    const isThinking = ref(false);
    const notificationWaveFrame = ref(false);
    const currentRouteKey = ref(getInitialRouteKey());
    const pushMessage = ref("");
    const fetchError = ref("");
    const isLoading = ref(false);
    const updatedAt = ref("");
    const chatInput = ref("");
    const isChatSending = ref(false);
    const chatMessages = ref([
      { id: 1, role: "assistant", text: "嗨！我是環境陳情 AI 助理。你可以問我目前案件數、陳情熱點，或請我整理處理建議。" },
    ]);
    const petElement = ref(null);
    const chatContentElement = ref(null);
    let chatMessageId = 1;
    let fetchController = null;
    let pointerStart = null;
    let celebrationTimer = null;
    let notificationWaveTimer = null;
    let notificationWaveStep = 0;

    const analysis = computed(() => parsePushMessage(pushMessage.value));
    const hasUnread = computed(() => unreadCount.value > 0);
    const petState = computed(() => {
      if (isDragging.value) return `drag-${dragDirection.value}`;
      if (isPressed.value || isCelebrating.value) return "hands-up";
      if (isThinking.value) return "thinking";
      if (hasUnread.value) return "hover";
      if (isHovered.value) return "hover";
      return "idle";
    });
    const petImage = computed(() => {
      const shouldWave = hasUnread.value && !isOpen.value && !isDragging.value && !isPressed.value && !isThinking.value;
      if (shouldWave) return PET_IMAGES[notificationWaveFrame.value ? "drag-right" : "hover"];
      return PET_IMAGES[petState.value];
    });

    const assistantApi = {
      setThinking(value) {
        isThinking.value = Boolean(value);
      },
      notify(count = 1) {
        addNotification(count);
      },
      open() {
        openPanel();
      },
      openChat() {
        activeView.value = "chat";
        openPanel();
      },
      showPrompt() {
        activeView.value = "prompt";
      },
      close() {
        isOpen.value = false;
      },
      getRouteKey() {
        return currentRouteKey.value;
      },
      setRouteKey(value) {
        return changeRouteKey(value);
      },
    };

    const panelPlacement = computed(() => ({
      "is-panel-left": position.value.x > window.innerWidth - 470,
      "is-panel-below": position.value.y < 300,
    }));
    const contentMaxHeight = computed(() => {
      const space = panelPlacement.value["is-panel-below"]
        ? window.innerHeight - position.value.y - 190
        : position.value.y - 170;
      return `${clamp(space, 210, 500)}px`;
    });

    async function loadAnalysis({ clear = false } = {}) {
      fetchController?.abort();
      const controller = new AbortController();
      fetchController = controller;
      if (clear) pushMessage.value = "";
      isLoading.value = true;
      fetchError.value = "";
      isThinking.value = true;

      try {
        const apiUrl = new URL(ANALYSIS_API_ENDPOINT);
        apiUrl.searchParams.set("route_key", currentRouteKey.value);
        const response = await fetch(apiUrl, {
          headers: { Accept: "application/json" },
          signal: controller.signal,
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const payload = await response.json();
        if (typeof payload?.push_message !== "string" || !payload.push_message.trim()) {
          throw new Error("API 未回傳 push_message");
        }
        pushMessage.value = payload.push_message;
        updatedAt.value = new Intl.DateTimeFormat("zh-TW", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }).format(new Date());
      } catch (error) {
        if (error.name !== "AbortError") {
          fetchError.value = "目前無法取得最新分析，請稍後再試。";
          console.error("EIMP analysis fetch failed:", error);
        }
      } finally {
        if (fetchController === controller && !controller.signal.aborted) {
          isLoading.value = false;
          isThinking.value = false;
        }
      }
    }

    async function changeRouteKey(value, { syncUrl = true } = {}) {
      const routeKey = normalizeRouteKey(value);
      if (!routeKey) return false;

      const changed = currentRouteKey.value !== routeKey;
      currentRouteKey.value = routeKey;
      localStorage.setItem(ROUTE_STORAGE_KEY, routeKey);

      if (syncUrl) {
        const url = new URL(window.location.href);
        url.searchParams.set("route_key", routeKey);
        window.history.replaceState(window.history.state, "", url);
      }

      if (changed) await loadAnalysis({ clear: true });
      return true;
    }

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

    function markNotificationsRead() {
      unreadCount.value = 0;
    }

    function openPanel() {
      isOpen.value = true;
      markNotificationsRead();
    }

    function showChatView() {
      activeView.value = "chat";
      scrollChatToBottom();
    }

    function showPromptView() {
      activeView.value = "prompt";
    }

    function scrollChatToBottom() {
      nextTick(() => {
        const element = chatContentElement.value;
        if (element) element.scrollTop = element.scrollHeight;
      });
    }

    function buildLocalChatReply(question) {
      const normalized = question.replace(/\s+/g, "").toLowerCase();
      const sections = analysis.value.sections || [];
      const findSection = (pattern) => sections.find((section) => pattern.test(section.title));
      const sectionSummary = (section) => {
        if (!section) return "目前快報中沒有這項資訊。";
        const paragraphs = section.paragraphs.join("、");
        const items = section.items.map((item) => [item.title, ...item.details].join("：")).join("；");
        return [paragraphs, items].filter(Boolean).join("；") || "目前快報中沒有這項資訊。";
      };

      if (/總數|幾件|案件數/.test(normalized)) {
        return analysis.value.total == null
          ? "目前尚未取得案件總數，請先返回提示介面重新整理快報。"
          : `${analysis.value.totalLabel}為 ${analysis.value.total} 件。`;
      }
      if (/熱點|哪裡|區域|轄區/.test(normalized)) return sectionSummary(findSection(/熱點|轄區/));
      if (/建議|優先|怎麼處理|處理方式/.test(normalized)) return sectionSummary(findSection(/AI|建議|優先/));
      if (/類型|種類/.test(normalized)) return sectionSummary(findSection(/案件類型|類型/));
      return analysis.value.total == null
        ? "我目前還在等待快報資料。你可以先問我功能如何使用，或返回提示介面重新整理。"
        : `目前${analysis.value.totalLabel}為 ${analysis.value.total} 件。你也可以繼續詢問「陳情熱點」、「案件類型」或「處理建議」。`;
    }

    async function sendChatMessage(value = chatInput.value) {
      const question = String(value || "").trim();
      if (!question || isChatSending.value) return;
      chatMessages.value.push({ id: ++chatMessageId, role: "user", text: question });
      chatInput.value = "";
      isChatSending.value = true;
      isThinking.value = true;
      scrollChatToBottom();

      try {
        const chatHandler = window.EIMPPetChat?.send;
        const result = typeof chatHandler === "function"
          ? await chatHandler({
            message: question,
            routeKey: currentRouteKey.value,
            messages: chatMessages.value.map(({ role, text }) => ({ role, content: text })),
          })
          : buildLocalChatReply(question);
        const reply = typeof result === "string" ? result : result?.reply || result?.message;
        chatMessages.value.push({
          id: ++chatMessageId,
          role: "assistant",
          text: String(reply || "目前無法產生回覆，請稍後再試。"),
        });
      } catch (error) {
        console.error("EIMP pet chat failed:", error);
        chatMessages.value.push({ id: ++chatMessageId, role: "assistant", text: "對話服務暫時無法使用，請稍後再試。", isError: true });
      } finally {
        isChatSending.value = false;
        isThinking.value = false;
        scrollChatToBottom();
      }
    }

    function onChatInputKeydown(event) {
      if (event.key !== "Enter" || event.shiftKey) return;
      event.preventDefault();
      sendChatMessage();
    }

    function togglePanel() {
      if (isOpen.value) {
        isOpen.value = false;
        return;
      }
      openPanel();
    }

    function addNotification(value = 1) {
      const count = Math.max(1, Number(value) || 1);
      if (isOpen.value) {
        markNotificationsRead();
        return;
      }
      unreadCount.value += count;
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
        togglePanel();
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
      togglePanel();
    }

    function onThinkingChange(event) {
      isThinking.value = Boolean(event.detail?.thinking ?? event.detail);
    }

    function onNotification(event) {
      addNotification(event.detail?.count ?? event.detail ?? 1);
    }

    function onAccountChange(event) {
      // 網址有明確指定時，以網址參數為準，方便本機測試及分享測試連結。
      if (getQueryRouteKey()) return;
      const routeKey = normalizeRouteKey(event.detail?.account?.analysisRouteKey)
        || routeKeyFromUnit(event.detail?.account?.company);
      if (routeKey) changeRouteKey(routeKey, { syncUrl: false });
    }

    function onOutsidePointerDown(event) {
      if (!isOpen.value || petElement.value?.parentElement?.contains(event.target)) return;
      isOpen.value = false;
    }

    onMounted(() => {
      setDefaultPosition();
      loadAnalysis();
      Object.values(PET_IMAGES).forEach((src) => {
        const image = new Image();
        image.src = src;
      });
      window.EIMPPetAssistant = assistantApi;
      window.addEventListener("resize", keepInViewport);
      window.addEventListener("eimp:pet-thinking", onThinkingChange);
      window.addEventListener("eimp:pet-notification", onNotification);
      window.addEventListener("eimp:account-changed", onAccountChange);
      window.addEventListener("pointermove", onPointerMove);
      window.addEventListener("pointerup", finishPointer);
      window.addEventListener("pointercancel", cancelPointer);
      document.addEventListener("pointerdown", onOutsidePointerDown);
      const waveFrames = [false, true, false, true, false, false, false, false];
      notificationWaveTimer = window.setInterval(() => {
        if (!hasUnread.value || isOpen.value || isDragging.value || isPressed.value || isThinking.value) {
          notificationWaveStep = 0;
          notificationWaveFrame.value = false;
          return;
        }
        notificationWaveStep = (notificationWaveStep + 1) % waveFrames.length;
        notificationWaveFrame.value = waveFrames[notificationWaveStep];
      }, 300);
    });

    onBeforeUnmount(() => {
      clearTimeout(celebrationTimer);
      clearInterval(notificationWaveTimer);
      fetchController?.abort();
      if (window.EIMPPetAssistant === assistantApi) delete window.EIMPPetAssistant;
      window.removeEventListener("resize", keepInViewport);
      window.removeEventListener("eimp:pet-thinking", onThinkingChange);
      window.removeEventListener("eimp:pet-notification", onNotification);
      window.removeEventListener("eimp:account-changed", onAccountChange);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", finishPointer);
      window.removeEventListener("pointercancel", cancelPointer);
      document.removeEventListener("pointerdown", onOutsidePointerDown);
    });

    function renderPet() {
      return h("button", {
        ref: petElement,
        type: "button",
        class: ["eimp-pet", `is-${petState.value}`, { "is-pressed": isPressed.value, "is-dragging": isDragging.value, "has-unread": hasUnread.value }],
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
        h("img", {
          class: "eimp-flower-pet-image",
          src: petImage.value,
          alt: "",
          draggable: "false",
          "aria-hidden": "true",
        }),
        hasUnread.value ? h("span", { class: "eimp-pet-badge", "aria-label": `${unreadCount.value} 則未讀動態` }, String(unreadCount.value)) : null,
      ]);
    }

    function renderSection(section) {
      const isStats = section.title === "案件類型" || section.title === "轄區";
      return h("section", { class: ["eimp-analysis-section", `is-${section.tone}`] }, [
        h("h3", [
          h("span", { class: "eimp-section-marker", "aria-hidden": "true" }),
          section.title,
        ]),
        isStats
          ? h("div", { class: "eimp-analysis-chips" }, section.paragraphs
            .flatMap((paragraph) => paragraph.split(/[、，,]/))
            .filter(Boolean)
            .map((topic) => {
              const match = topic.match(/^(.*?)(\d+)件$/);
              return h("span", [
                h("em", match?.[1] || topic),
                match ? h("strong", match[2]) : null,
                match ? h("small", "件") : null,
              ]);
            }))
          : section.paragraphs.map((paragraph) => h("p", paragraph)),
        section.items.length
          ? h("div", { class: "eimp-analysis-items" }, section.items.map((item) => {
            const countIndex = item.details.findIndex((detail) => /^共\s*\d+\s*件$/.test(detail));
            const count = countIndex >= 0 ? item.details[countIndex].match(/\d+/)?.[0] : null;
            const details = item.details.filter((_, index) => index !== countIndex);
            return h("article", { class: "eimp-analysis-item" }, [
              h("div", { class: "eimp-analysis-item-heading" }, [
                h("strong", item.title),
                count ? h("span", `${count} 件`) : null,
              ]),
              details.map((detail, index) => h(index === details.length - 1 ? "p" : "small", detail)),
            ]);
          }))
          : null,
      ]);
    }

    function renderPanel() {
      if (!isOpen.value) return null;
      const isChatView = activeView.value === "chat";
      return h("section", {
        class: ["eimp-assistant-panel", panelPlacement.value, { "is-chat-view": isChatView }],
        role: "dialog",
        "aria-label": isChatView ? "環境陳情 AI 對話" : "陳情案件 AI 助理",
        "aria-live": "polite",
      }, [
        h("div", { class: "eimp-assistant-header" }, [
          h("span", { class: "eimp-assistant-mini", "aria-hidden": "true" }, "AI"),
          h("div", { class: "eimp-assistant-title" }, [
            h("strong", isChatView ? "環境陳情 AI 對話" : "環境陳情 AI 快報"),
            h("span", [h("i"), isChatView ? (isChatSending.value ? " 正在思考回覆" : " 可詢問案件與處理建議") : (isLoading.value ? " 正在整理最新資訊" : " 最新全市分析")]),
          ]),
          h("button", {
            type: "button",
            class: "eimp-assistant-mode-button",
            "aria-label": isChatView ? "返回 AI 快報提示介面" : "切換至 AI 對話介面",
            onClick: isChatView ? showPromptView : showChatView,
          }, isChatView ? "← 返回提示" : "對話"),
          h("button", {
            type: "button",
            class: "eimp-assistant-close",
            "aria-label": "關閉 AI 助理視窗",
            onClick: () => { isOpen.value = false; },
          }, "×"),
        ]),
        h("div", {
          ref: isChatView ? chatContentElement : null,
          class: ["eimp-assistant-content", { "is-chat-content": isChatView }],
          style: { maxHeight: contentMaxHeight.value },
        }, isChatView
          ? [
            h("div", { class: "eimp-chat-messages", role: "log", "aria-label": "AI 對話訊息" }, [
              ...chatMessages.value.map((message) => h("article", {
                key: message.id,
                class: ["eimp-chat-message", `is-${message.role}`, { "is-error": message.isError }],
              }, [
                h("span", { class: "eimp-chat-avatar", "aria-hidden": "true" }, message.role === "assistant" ? "AI" : "你"),
                h("p", message.text),
              ])),
              isChatSending.value
                ? h("article", { class: "eimp-chat-message is-assistant is-typing", role: "status" }, [
                  h("span", { class: "eimp-chat-avatar", "aria-hidden": "true" }, "AI"),
                  h("p", [h("i"), h("i"), h("i"), h("span", { class: "sr-only" }, "AI 正在輸入")]),
                ])
                : null,
            ]),
            h("div", { class: "eimp-chat-suggestions", "aria-label": "建議問題" }, [
              "目前有幾件案件？",
              "有哪些陳情熱點？",
              "請提供處理建議",
            ].map((suggestion) => h("button", {
              type: "button",
              disabled: isChatSending.value,
              onClick: () => sendChatMessage(suggestion),
            }, suggestion))),
            h("form", {
              class: "eimp-chat-composer",
              onSubmit: (event) => {
                event.preventDefault();
                sendChatMessage();
              },
            }, [
              h("textarea", {
                value: chatInput.value,
                rows: 2,
                maxlength: 500,
                placeholder: "輸入想詢問的環境陳情問題…",
                "aria-label": "輸入 AI 對話訊息",
                disabled: isChatSending.value,
                onInput: (event) => { chatInput.value = event.target.value; },
                onKeydown: onChatInputKeydown,
              }),
              h("button", {
                type: "submit",
                disabled: isChatSending.value || !chatInput.value.trim(),
                "aria-label": "送出訊息",
              }, "送出"),
            ]),
          ]
          : [
            isLoading.value && !pushMessage.value
              ? h("div", { class: "eimp-analysis-state", role: "status" }, [h("span", { class: "eimp-analysis-loader" }), "正在取得最新分析…"])
              : null,
            fetchError.value && !pushMessage.value
              ? h("div", { class: "eimp-analysis-state is-error", role: "alert" }, [
                h("strong", "資料讀取失敗"),
                h("span", fetchError.value),
                h("button", { type: "button", onClick: loadAnalysis }, "重新載入"),
              ])
              : null,
            pushMessage.value
              ? h("div", { class: "eimp-analysis-feed" }, [
                h("div", { class: "eimp-analysis-overview" }, [
                  h("div", [h("span", analysis.value.totalLabel), h("strong", String(analysis.value.total ?? "—")), h("small", "件")]),
                  h("p", analysis.value.title),
                ]),
                analysis.value.sections.map(renderSection),
              ])
              : null,
            h("label", { class: "eimp-analysis-route-picker" }, [
              h("span", "切換資料範圍"),
              h("select", {
                value: currentRouteKey.value,
                "aria-label": "切換環境陳情資料範圍",
                disabled: isLoading.value,
                onChange: (event) => changeRouteKey(event.target.value),
              }, ROUTE_OPTIONS.map((route) => h("option", { value: route.key }, `${route.label}（${route.key}）`))),
            ]),
            h("div", { class: "eimp-assistant-footer" }, [
              h("span", updatedAt.value ? `API 即時資料 · 擷取於 ${updatedAt.value}` : "API 即時資料"),
              h("button", {
                type: "button",
                disabled: isLoading.value,
                onClick: loadAnalysis,
              }, isLoading.value ? "更新中…" : "重新整理"),
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
