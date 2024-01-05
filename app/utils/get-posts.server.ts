import fs from 'node:fs/promises'
import path from 'path'
import { bundleMDX } from 'mdx-bundler';
import GithubSlugger from 'github-slugger'

const contentDir = path.join(process.cwd(), 'app', 'content')

export const handleMdxBundle = async ({ filePath, cwd }: { filePath: string, cwd: string }) => {
  return await bundleMDX({
    file: filePath,
    cwd,
    mdxOptions(options, frontmatter) {
      // this is the recommended way to add custom remark/rehype plugins:
      // The syntax might look weird, but it protects you in case we add/remove
      // plugins in the future.

      // options.remarkPlugins = [...(options.remarkPlugins ?? []), myRemarkPlugin]
      // options.rehypePlugins = [...(options.rehypePlugins ?? []), myRehypePlugin]

      return options
    },
  })
}

export const getPosts = async () => {
  const posts = [
    {
      path: path.join(contentDir, '07Sensory.mdx'),
      slug: '7-sensory-characteristics',
      frontmatter: { title: '7. Sensory Characteristics', order: 8 }
    },
    {
      path: path.join(contentDir, '11PageTitles.mdx'),
      slug: '11-page-titles',
      frontmatter: { title: '11. Page Titles', order: 12 }
    },
    {
      path: path.join(contentDir, '04RepetitiveContent.mdx'),
      slug: '4-repetitive-content',
      frontmatter: { title: '4. Repetitive Content', order: 5 }
    },
    {
      path: path.join(contentDir, '10Forms.mdx'),
      slug: '10-forms',
      frontmatter: { title: '10. Forms', order: 11 }
    },
    {
      path: path.join(contentDir, '15Language.mdx'),
      slug: '15-language',
      frontmatter: { title: '15. Language', order: 16 }
    },
    {
      path: path.join(contentDir, '01Keyboard.mdx'),
      slug: '1-keyboard-accessible',
      frontmatter: { title: '1. Keyboard Accessible', order: 2 }
    },
    {
      path: path.join(contentDir, '14Links.mdx'),
      slug: '14-links',
      frontmatter: { title: '14. Links', order: 15 }
    },
    {
      path: path.join(contentDir, '22Resize.mdx'),
      slug: '22-resize-text',
      frontmatter: { title: '22. Resize Text', order: 23 }
    },
    {
      path: path.join(contentDir, '05Changing.mdx'),
      slug: '5-changing-content',
      frontmatter: { title: '5. Changing Content', order: 6 }
    },
    {
      path: path.join(contentDir, '02FocusVisible.mdx'),
      slug: '2-focus',
      frontmatter: { title: '2. Focus', order: 3 }
    },
    {
      path: path.join(contentDir, '08Contrast.mdx'),
      slug: '8-contrast',
      frontmatter: { title: '8. Contrast', order: 9 }
    },
    {
      path: path.join(contentDir, '09Flashing.mdx'),
      slug: '9-flashing',
      frontmatter: { title: '9. Flashing', order: 10 }
    },
    {
      path: path.join(contentDir, '20AlternateVersions.mdx'),
      slug: '20-conforming-alternate-version',
      frontmatter: { title: '20. Conforming Alternate Version', order: 21 }
    },
    {
      path: path.join(contentDir, '24Parsing.mdx'),
      slug: '24-parsing',
      frontmatter: { title: '24. Parsing', order: 25 }
    },
    {
      path: path.join(contentDir, '03Noninterference.mdx'),
      slug: '3-non-interference',
      frontmatter: { title: '3. Non-Interference', order: 4 }
    },
    {
      path: path.join(contentDir, '16AudioVideo.mdx'),
      slug: '16-audio-only-and-video-only',
      frontmatter: { title: '16. Audio-Only and Video-Only', order: 17 }
    },
    {
      path: path.join(contentDir, '06Images.mdx'),
      slug: '6-images',
      frontmatter: { title: '6. Images', order: 7 }
    },
    {
      path: path.join(contentDir, '17SyncMedia.mdx'),
      slug: '17-synchronized-media',
      frontmatter: { title: '17. Synchronized Media', order: 18 }
    },
    {
      path: path.join(contentDir, '18Stylesheet.mdx'),
      slug: '18-css-content-and-positioning',
      frontmatter: { title: '18. CSS Content and Positioning', order: 19 }
    },
    {
      path: path.join(contentDir, '13Structure.mdx'),
      slug: '13-content-structure',
      frontmatter: { title: '13. Content Structure', order: 14 }
    },
    {
      path: path.join(contentDir, '12DataTables.mdx'),
      slug: '12-tables',
      frontmatter: { title: '12. Tables', order: 13 }
    },
    {
      path: path.join(contentDir, 'introduction.mdx'),
      slug: 'introduction',
      frontmatter: { title: 'Introduction', order: 1 }
    },
    {
      path: path.join(contentDir, '23MultipleWays.mdx'),
      slug: '23-multiple-ways',
      frontmatter: { title: '23. Multiple Ways', order: 24 }
    },
    {
      path: path.join(contentDir, 'AppendixA.mdx'),
      slug: 'appendix-a--cross-reference-tables',
      frontmatter: { title: 'Appendix A – Cross Reference Tables', order: 100 }
    },
    {
      path: path.join(contentDir, '21TimedEvents.mdx'),
      slug: '21-timed-events',
      frontmatter: { title: '21. Timed Events', order: 22 }
    },
    {
      path: path.join(contentDir, 'ChangeLog3.mdx'),
      slug: 'appendix-b---section-508-ict-testing-baseline-change-log',
      frontmatter: {
        title: 'A,ppendix B - Section 508 ICT Testing Baseline Change Log',
        order: 101
      }
    },
    {
      path: path.join(contentDir, '19Frames.mdx'),
      slug: '19-frames-and-iframes',
      frontmatter: { title: '19. Frames and iFrames', order: 20 }
    },
    {
      path: path.join(contentDir, 'AppendixB.mdx'),
      slug: '',
      frontmatter: {}
    }
  ]

  return posts.sort((a, b) => (a.frontmatter.order || 1000) - (b.frontmatter.order || 1000))
}

export const getPost = async (filePath: string) => {
  return await handleMdxBundle({ filePath, cwd: contentDir })
}
