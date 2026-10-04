const { compile } = require('@mdx-js/mdx');
const fs = require('fs');

async function test() {
  const content = `Some people call this a software factory<Citation
  data={{
    type: "book",
    author: [{ family: "Cusumano", given: "Michael A." }],
    title: "Japan's Software Factories: A Challenge to U.S. Management",
    publisher: "Oxford University Press",
    issued: { "date-parts": [[1991]] }
  }}
/>, others call it a model zoo or a coder agent swarm<Citation
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
