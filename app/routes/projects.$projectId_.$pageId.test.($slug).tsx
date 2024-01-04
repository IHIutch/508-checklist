import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect, useFetcher, useLoaderData } from "@remix-run/react";
import { getMDXComponent } from 'mdx-bundler/client/index.js'
import * as React from 'react'
import invariant from "tiny-invariant";
import { Button } from "~/ui/button";
import { prisma } from "~/utils/prisma.server";
import { Result, Test } from "@prisma/client";
import { getPost, getPosts } from "~/utils/get-posts.server";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  invariant(params.projectId, "params.projectId is required");
  invariant(params.pageId, "params.pageId is introduction");

  if (!params.slug) {
    return redirect(`/projects/${params.projectId}/${params.pageId}/test/introduction`)
  }

  const posts = await getPosts()

  const post = posts.find(c => c.slug === params.slug)
  if (!post) {
    throw new Response("Not Found", { status: 404 });
  }

  const result = await getPost(post.path)
  const startingSlug = params.slug.split('-')[0]

  const results = await prisma.result.findMany({
    where: {
      pageId: Number(params.pageId)
    },
    distinct: 'testId',
    orderBy: {
      id: 'desc',
    },
  })
  const tests = await prisma.test.findMany()

  return json({
    mdxString: result.code,
    results,
    tests: tests.filter(test => {
      const startingName = test.name.split('.')[0]
      return startingSlug === startingName
    })
  })
}

export default function TestPage() {

  const { mdxString, results, tests } = useLoaderData<typeof loader>();
  const Component = React.useMemo(() => getMDXComponent(mdxString), [mdxString])

  return (
    <div className="flex">
      <div className="max-w-prose prose lg:prose-lg">
        <Component />
      </div>
      <div className="grow px-4 space-y-8">
        {tests.length > 0 ?
          tests.map((test) => (
            <div className="p-4 rounded border w-full" key={test.id}>
              <TestForm test={test} results={results} />
            </div>
          )) : null}
      </div>
    </div>
  );
}

const TestForm = ({ test, results }: { test: Test, results: Result[] }) => {
  const fetcher = useFetcher();

  const filteredResults = results.filter(r => r.testId === test.id)
  const latestResult = filteredResults.length > 0 ? filteredResults[filteredResults.length - 1] : null

  return (
    <div>
      <div className="mb-2">
        <h3 className="font-semibold">{test.name}</h3>
      </div>
      <div className="flex gap-2 mb-2">
        <fetcher.Form method="post" >
          <input name="value" value="pass" hidden readOnly />
          <Button type="submit" variant="solid" name="testId" value={String(test.id)}>Pass</Button>
        </fetcher.Form>
        <fetcher.Form method="post">
          <input name="value" value="fail" hidden readOnly />
          <Button type="submit" variant="outline" name="testId" value={String(test.id)}>Fail</Button>
        </fetcher.Form>
      </div>
      {latestResult ? (
        <>
          {latestResult.value === 'PASS' ? (
            <div className="bg-green-300 p-1">
              <span className="font-semibold">Passing :)</span>
            </div>
          ) : (
            <div className="bg-red-400 p-1">
              <span className="font-semibold">Failing :(</span>
            </div>
          )}
        </>
      ) : (
        <div className="bg-yellow-300 p-1">
          <span className="font-semibold">No Result</span>
        </div>
      )}
    </div>)
}

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const testId = formData.get("testId");
  const value = formData.get("value");

  const data = await prisma.result.create({
    data: {
      testId: Number(testId),
      pageId: Number(params.pageId),
      value: value === 'pass' ? 'PASS' : 'FAIL'
    }
  })
  return json(data)

}
