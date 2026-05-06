"use client";

import { useState, useEffect } from "react";
import { useDataStore } from "@/store/useDataStore";

interface InitialDataOptions {
  loadCompetencies?: boolean;
}

export function useInitialData(options: InitialDataOptions = {}) {
  const { loadCompetencies: shouldLoadCompetencies } = options;

  const {
    members,
    projects,
    competencies,
    loadMembers,
    loadProjects,
    loadCompetencies,
  } = useDataStore();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const hasData = members.length > 0 && projects.length > 0;

    if (hasData) {
      setIsLoading(false);
      return;
    }

    const promises = [loadMembers(), loadProjects()];

    if (shouldLoadCompetencies) {
      promises.push(loadCompetencies());
    }

    Promise.all(promises).finally(() => setIsLoading(false));
  }, [
    loadMembers,
    loadProjects,
    loadCompetencies,
    shouldLoadCompetencies,
    members.length,
    projects.length,
  ]);

  return {
    isLoading,
    setIsLoading,
    members,
    projects,
    competencies,
  };
}
