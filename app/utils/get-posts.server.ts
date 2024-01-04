import fs from 'node:fs/promises'
import path from 'path'
import { bundleMDX } from 'mdx-bundler';
import GithubSlugger from 'github-slugger'


export const handleMdxBundle = async (content: string) => {
  return await bundleMDX({
    source: content,
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
  const contentDir = path.join(process.cwd(), 'app', 'content')
  const contentPaths = await fs.readdir(contentDir)

  const posts = await Promise.all(contentPaths.map(async cp => {
    const slugger = new GithubSlugger()

    const filePath = path.join(contentDir, cp)
    const content = await fs.readFile(filePath)
    const bundle = await handleMdxBundle(content.toString())
    const frontmatter = bundle.frontmatter
    return {
      path: filePath,
      slug: slugger.slug(frontmatter.title),
      frontmatter,
    }
  }))

  return posts
}

export const getPost = async (filePath: string) => {
  const content = await fs.readFile(filePath)
  return await handleMdxBundle(content.toString())
}
