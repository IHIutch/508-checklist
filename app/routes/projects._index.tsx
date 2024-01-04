import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Link, json, useLoaderData } from "@remix-run/react";
import * as React from "react";
import { Button } from "~/ui/button";
import { Input } from "~/ui/input";
import { Label } from "~/ui/label";
import { ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from "~/ui/modal";
import { TextField, TextFieldDescription } from "~/ui/text-field";
import { prisma } from "~/utils/prisma.server";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export const loader = async () => {
  const [tests, projects] = await Promise.all([
    prisma.test.findMany({}),
    prisma.project.findMany({
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

  return json({
    tests,
    projects
  })
}

export default function Projects() {
  const { projects, tests } = useLoaderData<typeof loader>();

  const filteredProjects = projects.map(p => {
    const totalPagesCount = p.Pages.length
    const uncheckedPagesCount = p.Pages.filter(pg => pg.Results.length === 0).length
    const pendingPagesCount = p.Pages.filter(pg => pg.Results.length > 0 && pg.Results.length < tests.length).length
    const passingPagesCount = p.Pages.filter(pg => pg.Results.filter(r => r.value === 'PASS').length === tests.length).length
    const failingPagesCount = p.Pages.filter(pg => pg.Results.filter(r => r.value === 'FAIL').length === tests.length).length
    return {
      ...p,
      totalPagesCount,
      uncheckedPagesCount,
      pendingPagesCount,
      passingPagesCount,
      failingPagesCount,
    }
  })

  return (
    <div className="mt-20">
      <div className="max-w-screen-lg mx-auto">
        <div className="flex">
          <h1 className="text-2xl font-semibold">Projects</h1>
          <div className="ml-auto">
            <CreateNew />
          </div>
        </div>

        {(filteredProjects.length > 0 ? (
          <div className="mt-12 space-y-8">

            {(filteredProjects.map((project) => (
              <div key={project.id} className="border rounded p-4 relative">
                <div className="mb-2">
                  <h2 className="text-lg font-semibold">
                    <Link to={`/projects/${project.id}`} className="after:absolute after:inset-0">{project.name}</Link>
                  </h2>
                </div>
                <div className="flex">
                  <div className="flex gap-4">
                    <div className="flex gap-1 text-sm">
                      <span>{project.totalPagesCount}</span>
                      <span>Pages</span>
                    </div>
                    <div className="flex gap-1 text-sm">
                      <span>{project.uncheckedPagesCount}</span>
                      <span>Unchecked</span>
                    </div>
                    <div className="flex gap-1 text-sm">
                      <span>{project.passingPagesCount}</span>
                      <span>Passing</span>
                    </div>
                    <div className="flex gap-1 text-sm">
                      <span>{project.failingPagesCount}</span>
                      <span>Failing</span>
                    </div>
                  </div>
                  <div className="ml-auto">
                    <div className="flex gap-1 text-sm">
                      <span>{project.pendingPagesCount}</span>
                      <span>Checks in Progress</span>
                    </div>
                  </div>
                </div>
              </div>
            )))}

          </div>
        ) : null)}
      </div>
    </div>
  );
}


const CreateNew = () => {
  const [isOpen, setIsOpen] = React.useState(false)

  return (<>
    <Button onPress={() => setIsOpen(true)}>Create New Project</Button>
    <ModalOverlay isOpen={isOpen} onOpenChange={setIsOpen}>
      <ModalContent>
        <ModalHeader>Create a New Project</ModalHeader>
        <ModalBody>
          <div className="space-y-6">
            <TextField>
              <Label>Project Name</Label>
              <Input />
            </TextField>
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
            Create Project
          </Button>
        </ModalFooter>
      </ModalContent>
    </ModalOverlay>
  </>)
}
