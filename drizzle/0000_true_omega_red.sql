CREATE TABLE "actions" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" varchar(10) NOT NULL,
	"description" text,
	"isActive" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "groupRoles" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" bigint NOT NULL,
	"roleId" integer NOT NULL,
	"groupId" integer NOT NULL,
	"joinedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "groups" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(50) NOT NULL,
	"description" text,
	"isActive" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"userId" bigint,
	"avatarUrl" varchar(255),
	"avatarKey" varchar(255),
	"firstName" varchar(255),
	"lastName" varchar(255),
	"birthday" date
);
--> statement-breakpoint
CREATE TABLE "resourceRolePermissions" (
	"roleId" integer NOT NULL,
	"actionId" integer NOT NULL,
	"resourceId" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "resourceRoles" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" bigint NOT NULL,
	"roleId" integer NOT NULL,
	"resourceId" integer NOT NULL,
	"assignedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "resources" (
	"id" serial PRIMARY KEY NOT NULL,
	"groupId" integer,
	"name" varchar(50) NOT NULL,
	"description" text,
	"isActive" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "roles" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" varchar(10) NOT NULL,
	"name" varchar(50) NOT NULL,
	"isActive" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"userId" bigserial NOT NULL,
	"refreshToken" varchar(255) NOT NULL,
	"ipAddress" varchar(255) NOT NULL,
	"userAgent" varchar(1024) NOT NULL,
	"expiryDate" date NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"isActive" boolean DEFAULT true NOT NULL,
	CONSTRAINT "sessions_refreshToken_unique" UNIQUE("refreshToken")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"username" varchar(50) NOT NULL,
	"email" varchar(100) NOT NULL,
	"roleId" integer,
	"password" varchar(255) NOT NULL,
	"isActive" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "groupRoles" ADD CONSTRAINT "groupRoles_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "groupRoles" ADD CONSTRAINT "groupRoles_roleId_roles_id_fk" FOREIGN KEY ("roleId") REFERENCES "public"."roles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "groupRoles" ADD CONSTRAINT "groupRoles_groupId_groups_id_fk" FOREIGN KEY ("groupId") REFERENCES "public"."groups"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resourceRolePermissions" ADD CONSTRAINT "resourceRolePermissions_roleId_roles_id_fk" FOREIGN KEY ("roleId") REFERENCES "public"."roles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resourceRolePermissions" ADD CONSTRAINT "resourceRolePermissions_actionId_actions_id_fk" FOREIGN KEY ("actionId") REFERENCES "public"."actions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resourceRolePermissions" ADD CONSTRAINT "resourceRolePermissions_resourceId_resources_id_fk" FOREIGN KEY ("resourceId") REFERENCES "public"."resources"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resourceRoles" ADD CONSTRAINT "resourceRoles_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resourceRoles" ADD CONSTRAINT "resourceRoles_roleId_roles_id_fk" FOREIGN KEY ("roleId") REFERENCES "public"."roles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resourceRoles" ADD CONSTRAINT "resourceRoles_resourceId_resources_id_fk" FOREIGN KEY ("resourceId") REFERENCES "public"."resources"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resources" ADD CONSTRAINT "resources_groupId_groups_id_fk" FOREIGN KEY ("groupId") REFERENCES "public"."groups"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_roleId_roles_id_fk" FOREIGN KEY ("roleId") REFERENCES "public"."roles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_action_code" ON "actions" USING btree ("code");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_group_roles" ON "groupRoles" USING btree ("userId","roleId","groupId");--> statement-breakpoint
CREATE INDEX "idx_group_roles_user_id" ON "groupRoles" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "idx_group_roles_role_id" ON "groupRoles" USING btree ("roleId");--> statement-breakpoint
CREATE INDEX "idx_group_roles_group_id" ON "groupRoles" USING btree ("groupId");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_app_group_name" ON "groups" USING btree ((lower("name")));--> statement-breakpoint
CREATE INDEX "idx_profile_user_id" ON "profiles" USING btree ("userId");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_resource_role_permissions" ON "resourceRolePermissions" USING btree ("roleId","actionId","resourceId");--> statement-breakpoint
CREATE INDEX "idx_resource_role_permissions_role" ON "resourceRolePermissions" USING btree ("roleId");--> statement-breakpoint
CREATE INDEX "idx_resource_role_permissions_resource" ON "resourceRolePermissions" USING btree ("resourceId");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_resource_roles" ON "resourceRoles" USING btree ("userId","resourceId");--> statement-breakpoint
CREATE INDEX "idx_resource_role_user" ON "resourceRoles" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "idx_resource_role_resource" ON "resourceRoles" USING btree ("resourceId");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_app_resource" ON "resources" USING btree ("groupId",(lower("name")));--> statement-breakpoint
CREATE INDEX "idx_resources_group" ON "resources" USING btree ("groupId");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_app_role_code" ON "roles" USING btree ((lower("code")));--> statement-breakpoint
CREATE UNIQUE INDEX "unique_app_role_name" ON "roles" USING btree ((lower("name")));--> statement-breakpoint
CREATE UNIQUE INDEX "unique_session_refresh_token" ON "sessions" USING btree ("refreshToken");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_user_username" ON "users" USING btree ((lower("username")));--> statement-breakpoint
CREATE UNIQUE INDEX "unique_user_email" ON "users" USING btree ((lower("email")));--> statement-breakpoint
CREATE INDEX "idx_user_username" ON "users" USING btree ((lower("username")));--> statement-breakpoint
CREATE INDEX "idx_user_email" ON "users" USING btree ((lower("email")));