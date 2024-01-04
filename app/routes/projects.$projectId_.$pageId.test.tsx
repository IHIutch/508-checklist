import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Link, Outlet, json, useLoaderData } from "@remix-run/react";
import GithubSlugger from 'github-slugger'
import invariant from "tiny-invariant";
import { getPosts } from "~/utils/get-posts.server";

interface ContentGlob {
  [path: string]: { frontmatter: Record<string, unknown> };
}

export const loader = async ({ params }: LoaderFunctionArgs) => {
  invariant(params.projectId, "params.projectId is required");
  invariant(params.pageId, "params.pageId is required");

  const slugger = new GithubSlugger()
  const posts = await getPosts()
  return json({
    links: posts.map((p) => ({
      title: String(p?.frontmatter?.title || ''),
      order: Number(p?.frontmatter?.order || 1000),
      slug: slugger.slug(String(p?.frontmatter?.title || ''))
    }))
  })
}


export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Tests() {

  const { links } = useLoaderData<typeof loader>();

  return (
    <div>
      <div className="w-80 fixed inset-y-0 left-0">
        <div className="h-full pt-20 overflow-y-auto">
          <ul className='px-4 pb-8'>
            {links.map((link) => (
              <li key={link.title}>
                <Link to={link.slug} className="block text-blue-500 underline p-2">{link.title}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className='pl-80 pt-20'>
        <Outlet context={links} />
      </div>
    </div>
  );
}

