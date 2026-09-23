/**
 * Implement Gatsby's SSR (Server Side Rendering) APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-ssr/
 */

/**
 * @type {import('gatsby').GatsbySSR['onRenderBody']}
 */
exports.onRenderBody = ({ setHtmlAttributes }) => {
  setHtmlAttributes({ lang: `en` })
}

// Owner opt-out for Google Analytics. Visit any page with ?notrack=1 once per
// browser to stop counting that browser; ?notrack=0 turns counting back on.
// Google's documented `ga-disable-<ID>` flag has to be set before gtag('config')
// runs, so onPreRenderHTML moves this script ahead of the gtag plugin's own.
const OPT_OUT_SCRIPT = `(function(){try{var k='anthus-no-analytics',q=location.search.match(/[?&]notrack=(\\w+)/);if(q){if(q[1]==='1')localStorage.setItem(k,'1');else localStorage.removeItem(k)}if(localStorage.getItem(k)==='1')window['ga-disable-G-31SC26SDGX']=true}catch(e){}})();`

/**
 * @type {import('gatsby').GatsbySSR['onPreRenderHTML']}
 */
exports.onPreRenderHTML = ({ getHeadComponents, replaceHeadComponents }) => {
  const React = require(`react`)
  replaceHeadComponents([
    React.createElement(`script`, {
      key: `analytics-opt-out`,
      dangerouslySetInnerHTML: { __html: OPT_OUT_SCRIPT },
    }),
    ...getHeadComponents(),
  ])
}
