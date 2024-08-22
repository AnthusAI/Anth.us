import React from 'react'
import { Highlight, themes } from "prism-react-renderer"
import { useColorScheme } from '../hooks/useColorScheme'

const getParams = (className = ``) => {
  const [lang = ``, params = ``] = className.split(`:`);
  return [lang.split(`language-`).pop().split(`{`).shift()].concat(
    params.split(`&`).reduce((merged, param) => {
      const [key, value] = param.split(`=`);
      merged[key] = value;
      return merged;
    }, {})
  );
};

const calculateLinesToHighlight = (meta) => {
  if (!meta) {
    return () => false;
  }
  const lineNumbers = meta.split(",").map(v => v.split("-").map(x => parseInt(x, 10)));
  console.log('Highlight lines:', lineNumbers);
  return index => {
    const lineNumber = index + 1;
    const inRange = lineNumbers.some(([start, end]) => 
      end ? lineNumber >= start && lineNumber <= end : lineNumber === start
    );
    console.log(`Line ${lineNumber} highlighted:`, inRange);
    return inRange;
  };
};

export const MDXCode = ({children}) => {
  const { colorScheme, isInitialized } = useColorScheme()
  console.log('MDXCode props:', { children })

  if (children.type !== "code") {
    return (
      <pre>{children}</pre>
    );
  }

  const {props: {className, children: code}} = children;
  const [language, { title = ``, highlight = ``, showLineNumbers = 'false' }] = getParams(className);
  const shouldHighlightLine = calculateLinesToHighlight(highlight);
  const showNumbers = showLineNumbers.toLowerCase() === 'true';

  console.log('MDXCode parsed:', { language, title, highlight, showLineNumbers });

  return (
    <div>
      {title && <pre className="prism-code code-title"><div className="token-line"><span class="token plain">{title}</span></div></pre>}
      <Highlight
        theme={colorScheme === 'dark' ? themes.vsDark : themes.vsLight}
        code={code.trim()}
        language={language}
      >
        {({className, style, tokens, getLineProps, getTokenProps}) => (
          <pre className={className} style={{...style}}>
            {tokens.map((line, index) => {
              const lineProps = getLineProps({line, key: index});
              if (shouldHighlightLine(index)) {
                lineProps.className = `${lineProps.className} highlight-line`;
              }
              return (
                <div key={index} {...lineProps}>
                  {showNumbers && <span className="line-number-style">{index + 1}</span>}
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({token, key})} />
                  ))}
                </div>
              );
            })}
          </pre>
        )}
      </Highlight>
    </div>
  );
};

export default MDXCode;