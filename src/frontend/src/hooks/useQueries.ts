import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  type Application,
  ApplicationStatus,
  type Opportunity,
  OpportunityCategory,
  type UserProfile,
} from "../backend.d";
import { useActor } from "./useActor";

export { ApplicationStatus, OpportunityCategory };
export type { UserProfile, Opportunity, Application };

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();
  const query = useQuery<UserProfile | null>({
    queryKey: ["currentUserProfile"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetActiveOpportunities() {
  const { actor, isFetching } = useActor();
  return useQuery<Opportunity[]>({
    queryKey: ["activeOpportunities"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getActiveOpportunities();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllOpportunities() {
  const { actor, isFetching } = useActor();
  return useQuery<Opportunity[]>({
    queryKey: ["allOpportunities"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllOpportunities();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetOpportunityById(id: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Opportunity>({
    queryKey: ["opportunity", id],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getOpportunityById(id);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useGetMyApplications() {
  const { actor, isFetching } = useActor();
  return useQuery<Application[]>({
    queryKey: ["myApplications"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyApplications();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllApplications() {
  const { actor, isFetching } = useActor();
  return useQuery<Application[]>({
    queryKey: ["allApplications"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllApplications();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useApplyToOpportunity() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      opportunityId,
      applicantName,
      applicantEmail,
      message,
    }: {
      opportunityId: string;
      applicantName: string;
      applicantEmail: string;
      message: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.applyToOpportunity(
        opportunityId,
        applicantName,
        applicantEmail,
        message,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myApplications"] });
      queryClient.invalidateQueries({ queryKey: ["allApplications"] });
    },
  });
}

export function useCreateOpportunity() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      title,
      description,
      category,
      estimatedAmount,
      requirements,
    }: {
      title: string;
      description: string;
      category: OpportunityCategory;
      estimatedAmount: string;
      requirements: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.createOpportunity(
        title,
        description,
        category,
        estimatedAmount,
        requirements,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allOpportunities"] });
      queryClient.invalidateQueries({ queryKey: ["activeOpportunities"] });
    },
  });
}

export function useUpdateOpportunity() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      title,
      description,
      category,
      estimatedAmount,
      requirements,
    }: {
      id: string;
      title: string;
      description: string;
      category: OpportunityCategory;
      estimatedAmount: string;
      requirements: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateOpportunity(
        id,
        title,
        description,
        category,
        estimatedAmount,
        requirements,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allOpportunities"] });
      queryClient.invalidateQueries({ queryKey: ["activeOpportunities"] });
    },
  });
}

export function useDeleteOpportunity() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteOpportunity(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allOpportunities"] });
      queryClient.invalidateQueries({ queryKey: ["activeOpportunities"] });
    },
  });
}

export function useToggleOpportunityStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.toggleOpportunityStatus(id, isActive);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allOpportunities"] });
      queryClient.invalidateQueries({ queryKey: ["activeOpportunities"] });
    },
  });
}

export function useUpdateApplicationStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      applicationId,
      status,
    }: { applicationId: string; status: ApplicationStatus }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateApplicationStatus(applicationId, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allApplications"] });
      queryClient.invalidateQueries({ queryKey: ["myApplications"] });
    },
  });
}

export function useSaveUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error("Actor not available");
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUserProfile"] });
    },
  });
}
