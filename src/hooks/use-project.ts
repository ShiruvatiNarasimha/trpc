import { api } from "@/trpc/react";
import { useLocalStorage } from "usehooks-ts";
import React from "react";

const useProject = () => {
  const { data: projects } = api.project.getProjects.useQuery();
  const [projectId, setProject] = useLocalStorage("dionysus-project", "");
  return {
    projects,
  };
};

export default useProject;
