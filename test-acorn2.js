const acorn = require('acorn');
try {
  acorn.parseExpressionAt(`{
    type: "book",
    author: [{ family: "Cusumano", given: "Michael A." }],
    title: "Japan's Software Factories: A Challenge to U.S. Management",
    publisher: "Oxford University Press",
    issued: { "date-parts": [[1991]] }
  }`, 0, { ecmaVersion: 2020 });
  console.log('Passed QA2');
} catch (e) { console.error('QA2 failed', e); }
