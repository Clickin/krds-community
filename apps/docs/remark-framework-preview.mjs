/**
 * remark-framework-preview.mjs
 *
 * MDX에서 <FrameworkPreview> 자식의 펜스드 코드블록 중
 * infostring에 `fw=<framework>`가 포함된 것을 수집해
 * `code` prop으로 주입한다.
 */
export default function remarkFrameworkPreview() {
  let previewOccurrence = 0;

  /** @param {any} tree */
  return (tree) => {
    previewOccurrence = 0;

    /** @param {any} node */
    const walk = (node) => {
      if (node.type !== "mdxJsxFlowElement") return;
      if (!node.name || !/^FrameworkPreview$/i.test(node.name)) return;

      previewOccurrence += 1;
      // MDX parses multiline text inside a framework component as an
      // implicit Markdown paragraph. That produces `<p>` inside native
      // controls for React/Vue/Svelte/Solid, while Angular/Astro receive the
      // same text directly. Flatten only implicit paragraph nodes in this
      // preview's slots; explicit `<p>` JSX nodes are left intact.
      const flattenImplicitParagraphs = (/** @type {any} */ parent) => {
        if (!Array.isArray(parent.children)) return;
        parent.children = parent.children.flatMap((/** @type {any} */ child) => {
          flattenImplicitParagraphs(child);
          return child.type === "paragraph" ? (child.children ?? []) : [child];
        });
      };
      flattenImplicitParagraphs(node);

      const title = node.attributes?.find(
        (/** @type {any} */ attribute) =>
          attribute.type === "mdxJsxAttribute" && attribute.name === "title",
      )?.value;
      const titleText = typeof title === "string" ? title : "example";
      const slug =
        titleText
          .toLowerCase()
          .replace(/[^a-z0-9가-힣]+/g, "-")
          .replace(/^-+|-+$/g, "") || "example";
      const previewId = `fp-${slug}-${previewOccurrence}`;
      node.attributes ??= [];
      if (
        !node.attributes.some(
          (/** @type {any} */ attribute) =>
            attribute.type === "mdxJsxAttribute" && attribute.name === "previewId",
        )
      ) {
        node.attributes.push({
          type: "mdxJsxAttribute",
          name: "previewId",
          value: previewId,
        });
      }

      const children = node.children ?? [];
      const codeBlocks = children.filter((/** @type {any} */ c) => c.type === "code");
      if (!codeBlocks.length) return;

      /** @type {Record<string, string>} */
      const codeAttr = {};
      for (const block of codeBlocks) {
        if (block.type !== "code") continue;
        const meta = (block.meta ?? "").trim();
        const frameMatch = meta.match(/fw=(\w+)/);
        if (!frameMatch) continue;
        codeAttr[frameMatch[1]] = block.value;
      }

      if (!Object.keys(codeAttr).length) return;

      if (!node.attributes) node.attributes = [];
      node.attributes.push({
        type: "mdxJsxAttribute",
        name: "code",
        value: {
          type: "mdxJsxAttributeValueExpression",
          value: JSON.stringify(codeAttr),
          data: {
            estree: {
              type: "Program",
              body: [
                {
                  type: "ExpressionStatement",
                  expression: {
                    type: "ObjectExpression",
                    properties: Object.entries(codeAttr).map(([key, val]) => ({
                      type: "Property",
                      method: false,
                      shorthand: false,
                      computed: false,
                      key: key.match(/^[a-z_$][a-z0-9_$]*$/i)
                        ? { type: "Identifier", name: key }
                        : { type: "Literal", value: key },
                      value: { type: "Literal", value: val },
                      kind: "init",
                    })),
                  },
                },
              ],
              sourceType: "module",
              comments: [],
            },
          },
        },
      });
    };

    // dfs traverse
    /** @param {any} node */
    const dfs = (node) => {
      walk(node);
      if ("children" in node && Array.isArray(node.children)) {
        node.children.forEach(dfs);
      }
    };

    dfs(tree);
  };
}
