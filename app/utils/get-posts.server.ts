import * as Keyboard01 from "../content/01Keyboard.mdx"
import * as FocusVisible02 from "../content/02FocusVisible.mdx"
import * as Noninterference03 from "../content/03Noninterference.mdx"
import * as RepetitiveContent04 from "../content/04RepetitiveContent.mdx"
import * as Changing05 from "../content/05Changing.mdx"
import * as Images06 from "../content/06Images.mdx"
import * as Sensory07 from "../content/07Sensory.mdx"
import * as Contrast08 from "../content/08Contrast.mdx"
import * as Flashing09 from "../content/09Flashing.mdx"
import * as Forms10 from "../content/10Forms.mdx"
import * as PageTitles11 from "../content/11PageTitles.mdx"
import * as DataTables12 from "../content/12DataTables.mdx"
import * as Structure13 from "../content/13Structure.mdx"
import * as Links14 from "../content/14Links.mdx"
import * as Language15 from "../content/15Language.mdx"
import * as AudioVideo16 from "../content/16AudioVideo.mdx"
import * as SyncMedia17 from "../content/17SyncMedia.mdx"
import * as Stylesheet18 from "../content/18Stylesheet.mdx"
import * as Frames19 from "../content/19Frames.mdx"
import * as AlternateVersions20 from "../content/20AlternateVersions.mdx"
import * as TimedEvents21 from "../content/21TimedEvents.mdx"
import * as Resize22 from "../content/22Resize.mdx"
import * as MultipleWays23 from "../content/23MultipleWays.mdx"
import * as Parsing24 from "../content/24Parsing.mdx"
import * as AppendixA from "../content/AppendixA.mdx"
import * as AppendixB from "../content/AppendixB.mdx"
import * as ChangeLog3 from "../content/ChangeLog3.mdx"
import * as introduction from "../content/introduction.mdx"

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
  const files = [
    Keyboard01,
    FocusVisible02,
    Noninterference03,
    RepetitiveContent04,
    Changing05,
    Images06,
    Sensory07,
    Contrast08,
    Flashing09,
    Forms10,
    PageTitles11,
    DataTables12,
    Structure13,
    Links14,
    Language15,
    AudioVideo16,
    SyncMedia17,
    Stylesheet18,
    Frames19,
    AlternateVersions20,
    TimedEvents21,
    Resize22,
    MultipleWays23,
    Parsing24,
    AppendixA,
    AppendixB,
    ChangeLog3,
    introduction
  ]

  const contentDir = path.join(process.cwd(), 'app', 'content')
  // const contentPaths = await fs.readdir(contentDir)

  const slugger = new GithubSlugger()
  const posts = await Promise.all(
    files.map(async file => {
      const filePath = path.join(contentDir, file.filename)
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
