(function () {
  const inputs = document.querySelectorAll("[data-filter]");

  inputs.forEach((input) => {
    const target = input.getAttribute("data-filter");
    const items = Array.from(document.querySelectorAll(`[data-filter-group="${target}"] [data-filter-item]`));

    input.addEventListener("input", () => {
      const term = input.value.trim().toLowerCase();

      items.forEach((item) => {
        const text = item.textContent.toLowerCase();
        item.hidden = term.length > 0 && !text.includes(term);
      });
    });
  });
})();
