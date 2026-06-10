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

  const statusClass = (priority) => {
    if (priority === "P0") return "stop";
    if (priority === "P1") return "warn";
    return "info";
  };

  const safeParse = (value, fallback) => {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : fallback;
    } catch {
      return fallback;
    }
  };

  const escapeHtml = (value) => String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

  document.querySelectorAll("[data-todo-board]").forEach((board) => {
    const rowsEl = board.querySelector("[data-todo-rows]");
    const addBtn = board.querySelector("[data-todo-add]");
    const storageKey = board.getAttribute("data-storage-key");
    const initial = safeParse(board.getAttribute("data-initial") || "[]", []);
    let rows = safeParse(localStorage.getItem(storageKey) || "", initial);

    const persist = () => {
      localStorage.setItem(storageKey, JSON.stringify(rows));
    };

    const nextCodes = () => {
      const last = rows.at(-1) || {};
      const projectNum = Number(String(last.project || "P01").replace(/\D/g, "")) || 1;
      const sameProjectTasks = rows
        .filter((row) => row.project === last.project)
        .map((row) => Number(String(row.task || "").replace(/\D/g, "")) || 0);
      const taskNum = Math.max(0, ...sameProjectTasks) + 1;
      return {
        project: `P${String(projectNum).padStart(2, "0")}`,
        task: `T${String(taskNum).padStart(2, "0")}`
      };
    };

    const updateField = (index, field, value) => {
      rows[index] = { ...rows[index], [field]: value.trim() };
      persist();
    };

    const render = () => {
      rowsEl.innerHTML = rows.map((row, index) => `
        <div class="todo-board-row" data-todo-index="${index}">
          <span class="todo-cell todo-code" contenteditable="true" data-field="project">${escapeHtml(row.project || "P01")}</span>
          <span class="todo-cell todo-code" contenteditable="true" data-field="task">${escapeHtml(row.task || "T01")}</span>
          <span class="todo-cell status ${statusClass(row.priority)}" contenteditable="true" data-field="priority">${escapeHtml(row.priority || "P2")}</span>
          <span class="todo-cell" contenteditable="true" data-field="status">${escapeHtml(row.status || "待办")}</span>
          <span class="todo-cell todo-title" contenteditable="true" data-field="title">${escapeHtml(row.title || "新增待办")}</span>
          <span class="todo-cell" contenteditable="true" data-field="owner">${escapeHtml(row.owner || "负责人待定")}</span>
          <span class="todo-cell" contenteditable="true" data-field="xp">${escapeHtml(row.xp || 0)}</span>
          <a class="todo-open" href="${escapeHtml(row.href || "#")}">打开</a>
        </div>
      `).join("");
    };

    rowsEl.addEventListener("input", (event) => {
      const cell = event.target.closest("[data-field]");
      const rowEl = event.target.closest("[data-todo-index]");
      if (!cell || !rowEl) return;
      updateField(Number(rowEl.getAttribute("data-todo-index")), cell.getAttribute("data-field"), cell.textContent);
    });

    addBtn?.addEventListener("click", () => {
      rows.push({
        ...nextCodes(),
        priority: "P2",
        status: "待办",
        title: "新增待办",
        owner: "负责人待定",
        xp: 0,
        href: "#"
      });
      persist();
      render();
    });

    render();
  });
})();
