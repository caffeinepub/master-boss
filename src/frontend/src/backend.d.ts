import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Application {
    id: string;
    status: ApplicationStatus;
    applicantName: string;
    applicantId: Principal;
    createdAt: Time;
    opportunityId: string;
    message: string;
    applicantEmail: string;
}
export type Time = bigint;
export interface UserProfile {
    name: string;
}
export interface Opportunity {
    id: string;
    title: string;
    createdAt: Time;
    createdBy: Principal;
    description: string;
    isActive: boolean;
    category: OpportunityCategory;
    requirements: string;
    estimatedAmount: string;
}
export enum ApplicationStatus {
    pending = "pending",
    approved = "approved",
    rejected = "rejected"
}
export enum OpportunityCategory {
    other = "other",
    sales = "sales",
    freelance = "freelance",
    digital = "digital",
    services = "services"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    applyToOpportunity(opportunityId: string, applicantName: string, applicantEmail: string, message: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createOpportunity(title: string, description: string, category: OpportunityCategory, estimatedAmount: string, requirements: string): Promise<void>;
    deleteOpportunity(id: string): Promise<void>;
    getActiveOpportunities(): Promise<Array<Opportunity>>;
    getAllApplications(): Promise<Array<Application>>;
    getAllOpportunities(): Promise<Array<Opportunity>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getMyApplications(): Promise<Array<Application>>;
    getOpportunityById(id: string): Promise<Opportunity>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    toggleOpportunityStatus(id: string, isActive: boolean): Promise<void>;
    updateApplicationStatus(applicationId: string, status: ApplicationStatus): Promise<void>;
    updateOpportunity(id: string, title: string, description: string, category: OpportunityCategory, estimatedAmount: string, requirements: string): Promise<void>;
}
