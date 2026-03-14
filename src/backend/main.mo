import Map "mo:core/Map";
import List "mo:core/List";
import Iter "mo:core/Iter";
import Time "mo:core/Time";
import Order "mo:core/Order";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Text "mo:core/Text";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  module Application {
    public func compare(a1 : Application, a2 : Application) : Order.Order {
      Text.compare(a1.id, a2.id);
    };
  };

  module Opportunity {
    public func compare(o1 : Opportunity, o2 : Opportunity) : Order.Order {
      Text.compare(o1.id, o2.id);
    };
  };

  let opportunities = Map.empty<Text, Opportunity>();
  let applications = Map.empty<Text, Application>();

  type Application = {
    id : Text;
    opportunityId : Text;
    applicantId : Principal;
    applicantName : Text;
    applicantEmail : Text;
    message : Text;
    status : ApplicationStatus;
    createdAt : Time.Time;
  };

  type Opportunity = {
    id : Text;
    title : Text;
    description : Text;
    category : OpportunityCategory;
    estimatedAmount : Text;
    requirements : Text;
    isActive : Bool;
    createdAt : Time.Time;
    createdBy : Principal;
  };

  type OpportunityCategory = {
    #freelance;
    #sales;
    #services;
    #digital;
    #other;
  };

  type ApplicationStatus = {
    #pending;
    #approved;
    #rejected;
  };

  // User profile type
  public type UserProfile = {
    name : Text;
  };

  // Authorization system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User profiles storage
  let userProfiles = Map.empty<Principal, UserProfile>();

  // User profile functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Admin functions
  public shared ({ caller }) func createOpportunity(title : Text, description : Text, category : OpportunityCategory, estimatedAmount : Text, requirements : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can create opportunities");
    };

    let id = Time.now().toText();
    let opportunity : Opportunity = {
      id;
      title;
      description;
      category;
      estimatedAmount;
      requirements;
      isActive = true;
      createdAt = Time.now();
      createdBy = caller;
    };
    opportunities.add(id, opportunity);
  };

  public shared ({ caller }) func updateOpportunity(id : Text, title : Text, description : Text, category : OpportunityCategory, estimatedAmount : Text, requirements : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can update opportunities");
    };

    let existing = switch (opportunities.get(id)) {
      case (null) { Runtime.trap("Opportunity not found") };
      case (?existing) { existing };
    };

    let updated : Opportunity = {
      id;
      title;
      description;
      category;
      estimatedAmount;
      requirements;
      isActive = existing.isActive;
      createdAt = existing.createdAt;
      createdBy = existing.createdBy;
    };

    opportunities.add(id, updated);
  };

  public shared ({ caller }) func deleteOpportunity(id : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can delete opportunities");
    };

    opportunities.remove(id);
  };

  public shared ({ caller }) func toggleOpportunityStatus(id : Text, isActive : Bool) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can toggle opportunity status");
    };

    let opportunity = switch (opportunities.get(id)) {
      case (null) { Runtime.trap("Opportunity not found") };
      case (?opportunity) { opportunity };
    };

    let updated : Opportunity = {
      id = opportunity.id;
      title = opportunity.title;
      description = opportunity.description;
      category = opportunity.category;
      estimatedAmount = opportunity.estimatedAmount;
      requirements = opportunity.requirements;
      isActive;
      createdAt = opportunity.createdAt;
      createdBy = opportunity.createdBy;
    };

    opportunities.add(id, updated);
  };

  // Public functions
  public query ({ caller }) func getActiveOpportunities() : async [Opportunity] {
    opportunities.values().toArray().sort().filter(
      func(opp) { opp.isActive }
    );
  };

  public query ({ caller }) func getOpportunityById(id : Text) : async Opportunity {
    switch (opportunities.get(id)) {
      case (null) { Runtime.trap("Opportunity not found") };
      case (?opportunity) { opportunity };
    };
  };

  public query ({ caller }) func getAllOpportunities() : async [Opportunity] {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can view all opportunities");
    };
    opportunities.values().toArray().sort();
  };

  // User functions
  public shared ({ caller }) func applyToOpportunity(opportunityId : Text, applicantName : Text, applicantEmail : Text, message : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can apply");
    };

    let applicationId = Time.now().toText();
    let newApplication : Application = {
      id = applicationId;
      opportunityId;
      applicantId = caller;
      applicantName;
      applicantEmail;
      message;
      status = #pending;
      createdAt = Time.now();
    };

    applications.add(applicationId, newApplication);
  };

  public query ({ caller }) func getMyApplications() : async [Application] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view their applications");
    };
    applications.values().toArray().sort().filter(
      func(app) { app.applicantId == caller }
    );
  };

  public shared ({ caller }) func updateApplicationStatus(applicationId : Text, status : ApplicationStatus) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can update application status");
    };

    let application = switch (applications.get(applicationId)) {
      case (null) { Runtime.trap("Application not found") };
      case (?application) { application };
    };

    let updatedApplication : Application = {
      id = application.id;
      opportunityId = application.opportunityId;
      applicantId = application.applicantId;
      applicantName = application.applicantName;
      applicantEmail = application.applicantEmail;
      message = application.message;
      status;
      createdAt = application.createdAt;
    };

    applications.add(applicationId, updatedApplication);
  };

  public query ({ caller }) func getAllApplications() : async [Application] {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can view all applications");
    };
    applications.values().toArray().sort();
  };
};
