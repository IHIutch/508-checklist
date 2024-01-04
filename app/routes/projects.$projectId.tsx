import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Link, json, useLoaderData } from "@remix-run/react";
import { ChevronDown, Search } from "lucide-react";
import * as React from "react";
import invariant from "tiny-invariant";
import { Button } from "~/ui/button";
import { Input } from "~/ui/input";
import { Label } from "~/ui/label";
import { ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from "~/ui/modal";
import { SearchField, SearchFieldInput } from "~/ui/search-field";
import { Select, SelectButton, SelectContent, SelectItem, SelectValue } from "~/ui/select";
import { TextField, TextFieldDescription } from "~/ui/text-field";
import { prisma } from "~/utils/prisma.server";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export const loader = async ({ params }: LoaderFunctionArgs) => {
  invariant(params.projectId, "params.projectId is required");

  const [tests, project] = await Promise.all([
    prisma.test.findMany({}),
    prisma.project.findUnique({
      where: {
        id: Number(params.projectId)
      },
      include: {
        Pages: {
          include: {
            Results: {
              distinct: ['testId'],
              orderBy: {
                id: 'desc',
              },
            },
          },
        },
      },
    })
  ])

  if (!project) {
    throw new Response("Not Found", { status: 404 });
  }

  return json({
    tests,
    project
  })

}

export default function Project() {

  const { project, tests } = useLoaderData<typeof loader>();

  const pages = project.Pages.map(p => {
    const passingTestCount = p.Results.filter(r => r.value === 'PASS').length
    const failingTestCount = p.Results.filter(r => r.value === 'FAIL').length
    const unfinishedTestCount = tests.length - p.Results.length
    const updatedAt = p.Results[p.Results.length - 1]?.createdAt || p.updatedAt || p.createdAt
    return {
      ...p,
      passingTestCount,
      failingTestCount,
      unfinishedTestCount,
      updatedAt
    }
  })

  return (
    <div className="mt-20">
      <div className="max-w-screen-lg mx-auto">
        <div className="flex">
          <h1 className="text-2xl font-semibold">Pages</h1>
          <div className="ml-auto">
            <ImportSitemap />
          </div>
        </div>

        {(pages.length > 0 ? (
          <div className="mt-12 space-y-12">

            <div className="flex">
              <div>
                <SearchField>
                  <Label>Search by URL</Label>
                  <div className="relative">
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute flex h-full w-10 items-center justify-center text-slate-500 dark:text-slate-400"
                    >
                      <Search size="18" />
                    </div>
                    <SearchFieldInput className="px-10" />
                  </div>
                </SearchField>
              </div>
              <div className="ml-auto">
                <Select defaultSelectedKey="updated-desc">
                  <Label>Sort</Label>
                  <SelectButton variant="outline" className="max-w-48">
                    <SelectValue className="truncate">
                      {({ selectedText }) => (
                        <span>{selectedText || 'Select an item'}</span>
                      )}
                    </SelectValue>
                    <ChevronDown className="shrink-0" size="16" strokeWidth="3" />
                  </SelectButton>
                  <SelectContent>
                    <SelectItem id="updated-asc" textValue="Updated (Old to New)">Updated (Old to New)</SelectItem>
                    <SelectItem id="updated-desc" textValue="Updated (New to Old)">Updated (New to Old)</SelectItem>
                    <SelectItem id="alpha-asc" textValue="URL (A to Z)">URL (A to Z)</SelectItem>
                    <SelectItem id="alpha-desc" textValue="URL (Z to A)">URL (Z to A)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-6">
              {(pages.map((page) => (
                <div key={page.id} className="border rounded p-4 relative">
                  <div className="mb-2">
                    <h2 className="text-lg font-semibold">
                      <Link to={`/projects/${page.projectId}/${page.id}/test`} className="after:absolute after:inset-0">{page.url}</Link>
                    </h2>
                  </div>
                  <div className="flex">
                    <div className="flex gap-4">
                      <div className="flex gap-1 text-sm">
                        <span>{page.passingTestCount}</span>
                        <span>Passing</span>
                      </div>
                      <div className="flex gap-1 text-sm">
                        <span>{page.failingTestCount}</span>
                        <span>Failing</span>
                      </div>
                      <div className="flex gap-1 text-sm">
                        <span>{page.unfinishedTestCount}</span>
                        <span>Pending</span>
                      </div>
                    </div>
                    <div className="ml-auto">
                      <div className="flex gap-1 text-sm">
                        <span>Updated: </span>
                        <span>{new Date(page.updatedAt).toDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )))}
            </div>

            <div className="flex">
              <div>
                <Select defaultSelectedKey="10">
                  <Label>Per Page</Label>
                  <SelectButton variant="outline" className="max-w-48">
                    <SelectValue className="truncate">
                      {({ selectedText }) => (
                        <span>{selectedText || 'Select an item'}</span>
                      )}
                    </SelectValue>
                    <ChevronDown className="shrink-0" size="16" strokeWidth="3" />
                  </SelectButton>
                  <SelectContent>
                    <SelectItem id="10" textValue="10">10</SelectItem>
                    <SelectItem id="25" textValue="25">25</SelectItem>
                    <SelectItem id="50" textValue="50">50</SelectItem>
                    <SelectItem id="100" textValue="100">100</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

          </div>
        ) : null)}
      </div>
    </div>
  );
}


const ImportSitemap = () => {
  const [isOpen, setIsOpen] = React.useState(false)

  return (<>
    <Button onPress={() => setIsOpen(true)} isDisabled>Import from Sitemap</Button>
    <ModalOverlay isOpen={isOpen} onOpenChange={setIsOpen}>
      <ModalContent>
        <ModalHeader>Import Pages from Sitemap</ModalHeader>
        <ModalBody>
          <div className="space-y-6">
            <TextField>
              <Label>Sitemap URL</Label>
              <Input type="url" />
              <TextFieldDescription>The first 25 URLs of your sitemap will automatically be imported</TextFieldDescription>
            </TextField>
          </div>
        </ModalBody>
        <ModalFooter className="flex">
          <Button className="ml-auto" variant="outline" onPress={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button
            className="ml-2"
            onPress={() => setIsOpen(false)}
          >
            Import
          </Button>
        </ModalFooter>
      </ModalContent>
    </ModalOverlay>
  </>)
}
