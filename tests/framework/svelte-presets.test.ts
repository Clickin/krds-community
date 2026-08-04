import { mount, tick, unmount } from "svelte";
import { afterEach, describe, expect, it } from "vitest";
import {
  Badge,
  CriticalAlerts,
  FileUpload,
  Header,
  MainMenuMobile,
  Modal,
  Select,
  Tab,
} from "../../packages/svelte/src/index.js";

const instances: Array<Record<string, unknown>> = [];
const hosts: HTMLDivElement[] = [];

afterEach(() => {
  for (const instance of instances) unmount(instance);
  for (const host of hosts) host.remove();
  instances.length = 0;
  hosts.length = 0;
});

function mountInHost(component: Parameters<typeof mount>[0], props: Record<string, unknown>) {
  const host = document.createElement("div");
  document.body.append(host);
  hosts.push(host);
  const instance = mount(component, { target: host, props });
  instances.push(instance);
  return host;
}

describe("Svelte additional presets", () => {
  it("selects the preset branch without exposing kind as a required prop", async () => {
    const host = mountInHost(Badge, { kind: "modal", label: "Preset badge" });
    await tick();

    expect(host.querySelector(".krds-badge")?.textContent).toBe("Preset badge");
    expect(host.querySelector("dialog")).toBeNull();
  });

  it("preserves bindable modelValue accessors through the preset wrapper", async () => {
    let selected = "second";
    const props: Record<string, unknown> = {
      options: [
        { value: "first", label: "First" },
        { value: "second", label: "Second" },
      ],
    };
    Object.defineProperty(props, "modelValue", {
      enumerable: true,
      get: () => selected,
      set: (value: string) => {
        selected = value;
      },
    });
    const host = mountInHost(Select, props);
    await tick();

    const select = host.querySelector<HTMLSelectElement>("select")!;
    expect(select.closest(".form-group")?.querySelector("label")?.htmlFor).toBe(select.id);
    expect(select.value).toBe("second");
    select.value = "first";
    select.dispatchEvent(new Event("change", { bubbles: true }));
    await tick();
    expect(selected).toBe("first");
  });

  it("moves tabs with keyboard and updates selected ARIA state", async () => {
    const host = mountInHost(Tab, {
      tabs: [
        { id: "first", label: "First" },
        { id: "second", label: "Second" },
      ],
      modelValue: "first",
    });
    await tick();

    const buttons = host.querySelectorAll<HTMLButtonElement>('[role="tab"]');
    expect(buttons[0].getAttribute("aria-selected")).toBe("true");
    expect(buttons[1].getAttribute("aria-selected")).toBe("false");
    buttons[0].dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
    await tick();
    expect(buttons[1].getAttribute("aria-selected")).toBe("true");
    expect(buttons[1].tabIndex).toBe(0);
  });

  it("keeps alerts, file picker controls, and search inputs semantically native", async () => {
    const alerts = mountInHost(CriticalAlerts, {
      items: [{ message: "Service notice", linkLabel: "Read more", href: "/notice" }],
      "aria-label": "Urgent notices",
    });
    await tick();
    const alertRegion = alerts.querySelector<HTMLElement>('[role="alert"]');
    expect(alertRegion?.tagName).toBe("DIV");
    expect(alertRegion?.getAttribute("aria-label")).toBe("Urgent notices");
    expect(alertRegion?.querySelector(":scope > ul.krds-critical-alerts")).not.toBeNull();
    expect(alerts.querySelector('ul[role="alert"]')).toBeNull();

    const upload = mountInHost(FileUpload, {
      id: "files",
      inputId: "files",
      selectLabel: "Choose files",
    });
    await tick();
    const uploadInput = upload.querySelector<HTMLInputElement>('input[type="file"]')!;
    const uploadButton = upload.querySelector<HTMLButtonElement>(".file-upload-btn-wrap > button")!;
    expect(uploadButton.previousElementSibling).toBe(uploadInput);
    let uploadInputClicks = 0;
    uploadInput.addEventListener("click", () => uploadInputClicks++);
    uploadButton.click();
    expect(uploadInputClicks).toBe(1);

    const mobileMenu = mountInHost(MainMenuMobile, {
      searchTitle: "Search",
      searchLabel: "Search",
    });
    await tick();
    expect(mobileMenu.querySelector(".sch-input")?.hasAttribute("role")).toBe(false);
    const mobileSearch = mobileMenu.querySelector<HTMLInputElement>(".sch-input input")!;
    expect(mobileSearch.getAttribute("title")).toBe("Search");
    expect(mobileSearch.getAttribute("aria-label")).toBe("Search");

    const header = mountInHost(Header, {
      mobileMenu: { searchTitle: "Header search", searchLabel: "Find" },
    });
    await tick();
    const headerSearch = header.querySelector<HTMLInputElement>(".sch-input input")!;
    expect(headerSearch.getAttribute("title")).toBe("Header search");
    expect(headerSearch.getAttribute("aria-label")).toBe("Find");
  });

  it("closes the modal through its KRDS section state and emits close", async () => {
    let closeCount = 0;
    const host = mountInHost(Modal, {
      open: true,
      title: "Preset modal",
      onclose: () => {
        closeCount += 1;
      },
    });
    await tick();

    const dialog = host.querySelector<HTMLElement>('section[role="dialog"]')!;
    expect(dialog.classList.contains("shown")).toBe(true);
    dialog.querySelector<HTMLButtonElement>("button")!.click();
    await tick();
    expect(dialog.classList.contains("shown")).toBe(false);
    expect(closeCount).toBe(1);
  });

  it("keeps the exact upload count and every upstream status/action row", async () => {
    const host = mountInHost(FileUpload, {
      currentCount: 3,
      maxCount: 10,
      countSuffix: "개",
      files: [
        { name: "업로드 파일", status: "uploading", statusLabel: "업로드 중" },
        { name: "완료 파일", status: "complete", statusLabel: "업로드 완료" },
        { name: "삭제 파일", status: "deletable", deleteLabel: "삭제" },
        {
          name: "오류 파일",
          status: "error",
          deleteLabel: "삭제",
          errors: ["용량을 초과하였습니다.", "작은 파일을 선택해주세요."],
        },
        {
          name: "다운로드 파일",
          status: "downloadable",
          downloadLabel: "다운로드",
          previewLabel: "바로보기",
        },
      ],
    });
    await tick();

    expect(host.querySelector(".file-list > .total")?.textContent).toBe("3개 / 10개");
    const rows = Array.from(host.querySelectorAll<HTMLLIElement>(".upload-list > li"));
    expect(rows).toHaveLength(5);
    expect(rows[0].querySelector('.krds-spinner[role="status"]')).not.toBeNull();
    expect(rows[1].querySelector(".ico-invalid.complete")).not.toBeNull();
    expect(rows[2].querySelector("button .ico-delete-fill")).not.toBeNull();
    expect(rows[3].className).toBe("is-error");
    expect(rows[3].querySelectorAll(".file-hint-invalid br")).toHaveLength(1);
    expect(rows[4].querySelector(".file-info.m-column")).not.toBeNull();
    expect(rows[4].querySelector("button .ico-down")).not.toBeNull();
    expect(rows[4].querySelector("button .ico-angle.right")).not.toBeNull();
  });
});
