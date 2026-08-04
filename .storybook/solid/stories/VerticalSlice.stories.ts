import type { Meta, StoryObj } from "@storybook/html-vite";
import { createComponent } from "solid-js";
import { render } from "solid-js/web";
import { Accordion, Button, Checkbox, Radio, Switch, TextInput } from "@krds-community/solid";

const meta = { title: "SolidJS/기본 구성", parameters: { a11y: { test: "error" } } } satisfies Meta;

export default meta;
export const Default: StoryObj<typeof meta> = {
  name: "기본 예시",
  parameters: {
    fixtureIds: [
      "button.primary.medium.default",
      "text-input.default.medium",
      "checkbox.default.medium",
      "radio.default.medium",
      "switch.default.medium",
      "accordion.default.single",
    ],
    a11y: { test: "error" },
  },
  render: () => {
    const root = document.createElement("div");
    root.style.cssText = "display:grid;gap:1rem;max-width:30rem";
    const mount = (component: unknown, props: Record<string, unknown>) => {
      const target = document.createElement("div");
      root.append(target);
      render(
        () => createComponent(component as (props: Record<string, unknown>) => unknown, props),
        target,
      );
    };
    mount(Button, { children: "버튼" });
    mount(TextInput, { label: "이름", hint: "실명을 입력하세요." });
    mount(Checkbox, { label: "약관에 동의합니다.", name: "terms" });
    mount(Radio, { label: "첫 번째 선택지", name: "choice", value: "one" });
    mount(Switch, { label: "알림 받기", name: "notifications" });
    mount(Accordion, {
      items: [{ id: "one", title: "방문 안내", content: "서비스 이용 안내입니다." }],
    });
    return root;
  },
};
