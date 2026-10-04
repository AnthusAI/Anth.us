const { compile } = require('@mdx-js/mdx');
const fs = require('fs');

async function test() {
  const content = fs.readFileSync('src/site-content/inspected-by-sticker.mdx', 'utf8');
  try {
    await compile(content);
    console.log("MDX parsed successfully");
  } catch (e) {
    console.error("MDX Error:", e);
  }
}
test();
