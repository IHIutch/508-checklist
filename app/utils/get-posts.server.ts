import fs from 'node:fs/promises'
import path from 'path'
import { bundleMDX } from 'mdx-bundler';
import GithubSlugger from 'github-slugger'
import matter from 'gray-matter'

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
  const files = await fs.readdir(contentDir)

  const slugger = new GithubSlugger()
  const posts = files.map(file => {
    const filePath = path.join(contentDir, file)
    const { data: frontmatter } = matter.read(filePath)
    return {
      path: filePath,
      slug: slugger.slug(frontmatter.title),
      frontmatter,
    }
  })

  return posts.sort((a, b) => (a.frontmatter.order || 1000) - (b.frontmatter.order || 1000))
}

export const getPost = async (filePath: string) => {
  return await handleMdxBundle({ filePath, cwd: contentDir })
}
