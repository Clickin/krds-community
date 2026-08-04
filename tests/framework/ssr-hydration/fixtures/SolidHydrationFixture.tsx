import { createSignal } from "solid-js";
import { Accordion, Checkbox, Tab, TextInput } from "../../../../packages/solid/src/index.tsx";

const accordionItems = [
  { id: "first", title: "First section", content: "First section content" },
  { id: "second", title: "Second section", content: "Second section content" },
];
const tabs = [
  { id: "first", label: "First tab" },
  { id: "second", label: "Second tab" },
];

export function SolidHydrationFixture() {
  const [value, setValue] = createSignal("server value");
  const [accepted, setAccepted] = createSignal(false);
  const [submitted, setSubmitted] = createSignal("");

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(new FormData(event.currentTarget).get("query")?.toString() ?? "");
      }}
    >
      <TextInput
        id="solid-query"
        name="query"
        label="Query"
        hint="Hydrated field"
        value={value()}
        onInput={(event) => setValue(event.currentTarget.value)}
      />
      <Checkbox
        id="solid-accepted"
        name="accepted"
        label="Accept"
        checked={accepted()}
        onChange={(event) => setAccepted(event.currentTarget.checked)}
      />
      <Accordion items={accordionItems} defaultOpen={["first"]} />
      <Tab
        id="solid-tabs"
        tabs={tabs}
        panels={{ first: "First panel", second: "Second panel" }}
        message="Selected"
      />
      <output data-testid="value-length">{value().length}</output>
      <output data-testid="submitted">{submitted()}</output>
      <button type="submit">Submit</button>
    </form>
  );
}
