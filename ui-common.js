(function () {
  "use strict";

  function setField(name, value, root = document) {
    if (!name || !root) return;

    const text = value ?? "-";
    const fieldSelector = `[data-field="${name}"]`;
    const fields = root.querySelectorAll(fieldSelector);

    if (fields.length) {
      fields.forEach((field) => {
        field.textContent = text;
      });
      return;
    }

    const element = document.getElementById(name);
    if (element) element.textContent = text;
  }

  window.EIMPUI = Object.freeze({ setField });
})();
