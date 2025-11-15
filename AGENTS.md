# AGENTS.md

This file provides instructions for AI coding agents working on the Anth.us Gatsby website project.

## Project Overview

Anth.us is a Gatsby-based website for Anthus AI Solutions, showcasing AI solutions, blog articles, and posts about artificial intelligence, machine learning, and software development. The site emphasizes serverless architectures, AI agents, and practical AI applications.

**Target Audience**: Business-oriented AI engineers, product developers, and potential clients
**Tech Stack**: Gatsby 5.x, React 18, MDX, SCSS, Node.js 20

## Setup Commands

### Initial Setup
```bash
npm install              # Install dependencies
```

### Development
```bash
npm start               # Start development server (http://localhost:8000)
gatsby develop          # Alternative command
gatsby clean            # Clear cache if needed
```

### Build
```bash
npm run build           # Build for production
gatsby serve            # Serve production build locally
```

### Formatting
```bash
npm run format          # Format code with Prettier
```

### PlantUML Diagrams
```bash
bundle install                                    # Install Ruby dependencies
bundle exec plantuml_diagrams download_jar        # Download PlantUML
bundle exec plantuml_diagrams process -i src/blog/diagrams -o ./  # Generate diagrams
```

## Project Structure

```
/Users/ryan.porter/Projects/Anth.us/
├── src/
│   ├── blog/                    # Blog content (articles, posts, solutions)
│   │   ├── *.mdx               # Long-form articles
│   │   ├── posts/*.mdx         # Short updates/posts
│   │   ├── solutions/*.mdx     # Solution case studies
│   │   ├── images/             # Article images
│   │   │   └── posts/          # Post images
│   │   └── diagrams/           # PlantUML diagrams
│   ├── components/             # React components
│   ├── pages/                  # Static pages
│   ├── templates/              # Page templates
│   ├── images/                 # Site-wide images
│   └── styles/                 # Global styles
├── docs/
│   └── content-guide.xml       # Comprehensive content creation guide
├── gatsby-config.js            # Gatsby configuration
├── gatsby-node.js              # Node API customization
└── package.json                # Dependencies
```

## Content Creation

### Creating a Blog Post

Posts are short, timely updates (similar to social media posts) located in `src/blog/posts/*.mdx`.

**Required steps:**
1. Create placeholder image first (see Image Guidelines below)
2. Create MDX file in `src/blog/posts/` with kebab-case filename
3. Use this exact frontmatter structure:

```mdx
---
title: "Your Post Title"
slug: "your-post-slug"
date: "YYYY-MM-DD"
authors:
  - author: <a href="/ryan">Ryan Porter</a>
tags:
  - posts
excerpt: |
  A pithy, direct description that works as a standalone social media update. No emojis!
preview_image: "../images/posts/your-image.png"
images:
  - "../images/posts/your-image.png"
state: published
---

import BlogImage from '../../components/blog-image';

<p class="center-full-image">
    <BlogImage className="center-small-image"
        images={props.pageContext.frontmatter.images} 
        name="your-image.png"
        alt="Descriptive alt text" />
</p>

Your post content here...
```

### Creating a Blog Article

Articles are long-form, comprehensive content with citations and illustrations, located in `src/blog/*.mdx`.

**Structure similar to posts but:**
- Longer, more detailed content
- Include citations using `<Citation>` component
- May include multiple images and diagrams
- Tags should NOT include "posts"
- Typically include tags like "AI", "featured", "how-to", "explainer", etc.

### Creating a Solution

Solutions are case studies in `src/blog/solutions/*.mdx` with tag "solutions".

## Image Guidelines

**CRITICAL**: Always create placeholder images BEFORE creating content files.

### Image Locations
- Posts: `src/blog/images/posts/`
- Articles: `src/blog/images/`
- Site-wide: `src/images/`

### Creating Placeholder Images
```bash
# For posts (1200x630 for social media optimization)
convert -size 1200x630 xc:white -gravity center -pointsize 40 \
  -annotate 0 "Your Title Here" \
  src/blog/images/posts/your-title-here.png

# For articles
convert -size 1200x630 xc:white -gravity center -pointsize 40 \
  -annotate 0 "Your Title Here" \
  src/blog/images/your-title-here.png
```

### Image Naming
- Use kebab-case: `my-image-name.png`
- Match filename to content slug for consistency
- Dimensions: 1200x630 pixels (social media optimized)

### Using Images in MDX
```jsx
import BlogImage from '../../components/blog-image';

<BlogImage 
  images={props.pageContext.frontmatter.images} 
  name="image-filename.png"
  alt="Descriptive alt text" 
/>
```

## Editorial Guidelines

### Voice and Tone
- **Enthusiastic but grounded** about AI possibilities
- **Professional yet conversational**
- Share experiences without claiming invention
- Demonstrate expertise through helpful insights, not direct claims
- **Pithy, direct, engineering-focused** writing

### Content Approach
- Lead with practical value and real-world applications
- Include specific, actionable insights from hands-on experience
- Frame as "tips and learnings" not "teachings"
- Use concrete examples showcasing AI/ML familiarity
- Focus on business value and practical applications

### Writing Style
- Use active voice and present tense
- Keep paragraphs focused and concise
- Include technical details with business relevance
- Balance technical depth with accessibility
- Maintain helpful, peer-to-peer tone
- **NO EMOJIS** (especially in excerpts)

### Excerpt Guidelines
Excerpts should:
- Serve as standalone super-pithy microblog posts for social media
- Be direct and engineering-focused
- Avoid emojis completely
- Capture the essence in one compelling sentence or short paragraph

## Code Style

### JavaScript/JSX
- Use functional components with hooks
- Import React components at the top
- Use ES6+ syntax
- Prefer `const` over `let`
- Use template literals for strings with variables

### CSS/SCSS
- Use CSS modules (`*.module.css`)
- Follow BEM-like naming conventions
- Use CSS variables for theming
- Keep selectors specific but not overly nested

### MDX
- Import components before using them
- Use proper frontmatter YAML syntax
- Maintain consistent indentation
- Close all JSX tags properly

## Common Issues

### GraphQL Deprecation Warnings
The project uses deprecated GraphQL syntax for `sort` and `group` fields. Gatsby auto-converts these, but you may see warnings. This is expected and doesn't affect functionality.

### Image Processing Warnings
You may see warnings about `childImageSharp` with MDX files. This is normal - the system falls back to `publicURL` for non-image files.

### Missing CSS Classes
If you see import errors for CSS classes:
1. Check `src/components/index.module.css`
2. Ensure the class is defined
3. Verify the import statement matches the exported class name

## Testing

### Manual Testing
1. Start dev server: `npm start`
2. Navigate to http://localhost:8000
3. Test navigation between pages
4. Verify new content appears correctly
5. Check responsive design on different screen sizes

### Content Verification
- Verify all frontmatter fields are present
- Check that images load correctly
- Ensure links work (internal and external)
- Validate MDX syntax compiles without errors
- Confirm tags are correct for content type

## Deployment

The site is deployed via AWS Amplify (see `amplify.yml`). Deployments happen automatically on push to the main branch.

## Important Notes

- **Never run `npm run dev`** - use `npm start` or `gatsby develop` instead
- Don't run type checking (it takes too long)
- Always create images before creating content files
- Use the exact frontmatter structure shown in examples
- Follow the editorial guidelines for voice and tone
- Reference `docs/content-guide.xml` for detailed content creation instructions

## Resources

- [Gatsby Documentation](https://www.gatsbyjs.com/docs/)
- [MDX Documentation](https://mdxjs.com/)
- [PlantUML Documentation](https://plantuml.com/)
- Content Guide: `docs/content-guide.xml`

## Getting Help

When stuck:
1. Check this AGENTS.md file
2. Review `docs/content-guide.xml`
3. Look at existing content files for examples
4. Check Gatsby documentation for framework-specific issues
5. Review the repo-specific rules in the project configuration


