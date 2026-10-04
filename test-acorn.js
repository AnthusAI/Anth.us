const acorn = require('acorn');
try {
  acorn.parseExpressionAt(`{
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
  }`, 0, { ecmaVersion: 2020 });
  console.log('Passed QA1');
} catch (e) { console.error('QA1 failed', e); }
