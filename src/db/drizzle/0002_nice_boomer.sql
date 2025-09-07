CREATE TABLE "assets" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" uuid,
	"influencer_id" uuid,
	"asset_type" text NOT NULL,
	"asset_url" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "influencers" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" uuid,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"main_image" text NOT NULL,
	"profile_image" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "assets" ADD CONSTRAINT "assets_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assets" ADD CONSTRAINT "assets_influencer_id_influencers_id_fk" FOREIGN KEY ("influencer_id") REFERENCES "public"."influencers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "influencers" ADD CONSTRAINT "influencers_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;