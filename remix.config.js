/** @type {import('@remix-run/dev').AppConfig} */
export default {
  ignoredRouteFiles: ["**/.*"],
  // appDirectory: "app",
  // assetsBuildDirectory: "public/build",
  // publicPath: "/build/",
  // serverBuildPath: "build/index.js",
  serverDependenciesToBundle: [
    // MDX:
    /^rehype.*/,
    /^remark.*/,
    /^unified.*/,
    /^unist.*/,
    /^mdast.*/,
    /^micromark.*/,
    /^estree.*/,
    "devlop",
    "ccount",
    "markdown-table",
    "zwitch",
    "fault",
    "decode-named-character-reference",
    "longest-streak",
    "character-entities",
    "format",
    "escape-string-regexp",
    "is-plain-obj",
    "toml",
    "yaml"
  ],
};
