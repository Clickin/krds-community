/**
 * remark-framework-preview.mjs
 *
 * MDX에서 <FrameworkPreview> / <PracticeExample> 자식의 펜스드 코드블록 중
 * infostring에 `fw=<framework>`가 포함된 것을 수집해
 * `code` prop으로 주입한다.
 */
export default function remarkFrameworkPreview() {
  /** @param {any} tree */
  return (tree) => {
    /** @param {any} node */
    const walk = (node) => {
      if (node.type !== "mdxJsxFlowElement") return;
      if (!node.name || !/^(FrameworkPreview|PracticeExample)$/i.test(node.name)) return;

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
