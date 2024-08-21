import React from 'react'
import { Highlight, themes } from "prism-react-renderer"
import { useColorScheme } from '../hooks/useColorScheme'

export const MDXCode = ({children}) => {
  const { colorScheme, isInitialized } = useColorScheme()
  console.log('Color scheme initialized:', isInitialized, 'Current scheme:', colorScheme)

  if (children.type != "code") {
    return (
      <pre>{children}</pre>
    );
  }

  const {props: {className, children: code}} = children;
  const language = className?.replace(/language-/, "").trim() || "";

  return (
    <Highlight
      theme={colorScheme === 'dark' ? themes.vsDark : themes.vsLight}
      code={code.trim()}
      language={language}
    >
      {({className, style, tokens, getLineProps, getTokenProps}) => (
        <pre className={className} style={{...style}}>
          {tokens.map((line, index) => {
            const lineProps = getLineProps({line, key: index});
            return (
              <div key={index} {...lineProps}>
                {line.map((token, key) => (
                  <span key={key}{...getTokenProps({token, key})} />
                ))}
              </div>
            );
          })}
        </pre>
      )}
    </Highlight>
  );
};

export default MDXCode;