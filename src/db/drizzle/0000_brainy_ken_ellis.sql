CREATE TABLE "profiles" (
	"id" uuid PRIMARY KEY NOT NULL,
	"email" text,
	"email_confirmed_at" timestamp with time zone,
	"last_sign_in_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"changelog_last_viewed" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "profiles_id_idx" ON "profiles" USING btree ("id");--> statement-breakpoint
CREATE INDEX "profiles_email_idx" ON "profiles" USING btree ("email");