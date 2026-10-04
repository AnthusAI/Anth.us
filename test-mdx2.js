const { compile } = require('@mdx-js/mdx');

async function test() {
  const content = `<Citation
  data={{
    type: "article-journal",
    author: [
      { family: "Qian", given: "Chenglin" },
      { family: "Cong", given: "Xin" },
      { family: "Yang", given: "Cheng" },
      { family: "Chen", given: "Weize" },
      { family: "Su", given: "Yusheng" },
      { family: "Xu", given: "Juyuan" },
      { family: "Liu", given: "Zhiyuan" },
      { family: "Sun", given: "Maosong" }
    ],
    title: "Communicative Agents for Software Development",
    "container-title": "arXiv preprint arXiv:2307.07924",
    issued: { "date-parts": [[2023]] },
    URL: "https://arxiv.org/abs/2307.07924"
  }}
/>`;
  try {
    await compile(content);
    console.log("MDX parsed successfully");
  } catch (e) {
    console.error("MDX Error:", e);
  }
}
test();
