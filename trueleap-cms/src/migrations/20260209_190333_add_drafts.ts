import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`users_sessions\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`created_at\` text,
  	\`expires_at\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`users_sessions_order_idx\` ON \`users_sessions\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`users_sessions_parent_id_idx\` ON \`users_sessions\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`users\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text,
  	\`role\` text DEFAULT 'editor' NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`enable_a_p_i_key\` integer,
  	\`api_key\` text,
  	\`api_key_index\` text,
  	\`email\` text NOT NULL,
  	\`reset_password_token\` text,
  	\`reset_password_expiration\` text,
  	\`salt\` text,
  	\`hash\` text,
  	\`login_attempts\` numeric DEFAULT 0,
  	\`lock_until\` text
  );
  `)
  await db.run(sql`CREATE INDEX \`users_updated_at_idx\` ON \`users\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`users_created_at_idx\` ON \`users\` (\`created_at\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`users_email_idx\` ON \`users\` (\`email\`);`)
  await db.run(sql`CREATE TABLE \`media\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`alt\` text NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`url\` text,
  	\`thumbnail_u_r_l\` text,
  	\`filename\` text,
  	\`mime_type\` text,
  	\`filesize\` numeric,
  	\`width\` numeric,
  	\`height\` numeric
  );
  `)
  await db.run(sql`CREATE INDEX \`media_updated_at_idx\` ON \`media\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`media_created_at_idx\` ON \`media\` (\`created_at\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`media_filename_idx\` ON \`media\` (\`filename\`);`)
  await db.run(sql`CREATE TABLE \`case_studies_metrics\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`value\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`case_studies\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`case_studies_metrics_order_idx\` ON \`case_studies_metrics\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`case_studies_metrics_parent_id_idx\` ON \`case_studies_metrics\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`case_studies\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`subtitle\` text,
  	\`description\` text,
  	\`client\` text,
  	\`category\` text,
  	\`industry\` text DEFAULT 'governments',
  	\`region\` text,
  	\`country\` text,
  	\`image_id\` integer,
  	\`featured\` integer DEFAULT false,
  	\`published_at\` text,
  	\`quote_text\` text,
  	\`quote_attribution\` text,
  	\`quote_role\` text,
  	\`body\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft',
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`case_studies_image_idx\` ON \`case_studies\` (\`image_id\`);`)
  await db.run(sql`CREATE INDEX \`case_studies_updated_at_idx\` ON \`case_studies\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`case_studies_created_at_idx\` ON \`case_studies\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`case_studies__status_idx\` ON \`case_studies\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`_case_studies_v_version_metrics\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`value\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_case_studies_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_case_studies_v_version_metrics_order_idx\` ON \`_case_studies_v_version_metrics\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_case_studies_v_version_metrics_parent_id_idx\` ON \`_case_studies_v_version_metrics\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_case_studies_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_title\` text,
  	\`version_subtitle\` text,
  	\`version_description\` text,
  	\`version_client\` text,
  	\`version_category\` text,
  	\`version_industry\` text DEFAULT 'governments',
  	\`version_region\` text,
  	\`version_country\` text,
  	\`version_image_id\` integer,
  	\`version_featured\` integer DEFAULT false,
  	\`version_published_at\` text,
  	\`version_quote_text\` text,
  	\`version_quote_attribution\` text,
  	\`version_quote_role\` text,
  	\`version_body\` text,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	\`autosave\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`case_studies\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_case_studies_v_parent_idx\` ON \`_case_studies_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_case_studies_v_version_version_image_idx\` ON \`_case_studies_v\` (\`version_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_case_studies_v_version_version_updated_at_idx\` ON \`_case_studies_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_case_studies_v_version_version_created_at_idx\` ON \`_case_studies_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_case_studies_v_version_version__status_idx\` ON \`_case_studies_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_case_studies_v_created_at_idx\` ON \`_case_studies_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_case_studies_v_updated_at_idx\` ON \`_case_studies_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_case_studies_v_latest_idx\` ON \`_case_studies_v\` (\`latest\`);`)
  await db.run(sql`CREATE INDEX \`_case_studies_v_autosave_idx\` ON \`_case_studies_v\` (\`autosave\`);`)
  await db.run(sql`CREATE TABLE \`news\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`description\` text,
  	\`author\` text,
  	\`category\` text DEFAULT 'press',
  	\`image_id\` integer,
  	\`featured\` integer DEFAULT false,
  	\`published_at\` text,
  	\`body\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft',
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`news_image_idx\` ON \`news\` (\`image_id\`);`)
  await db.run(sql`CREATE INDEX \`news_updated_at_idx\` ON \`news\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`news_created_at_idx\` ON \`news\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`news__status_idx\` ON \`news\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`_news_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_title\` text,
  	\`version_description\` text,
  	\`version_author\` text,
  	\`version_category\` text DEFAULT 'press',
  	\`version_image_id\` integer,
  	\`version_featured\` integer DEFAULT false,
  	\`version_published_at\` text,
  	\`version_body\` text,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	\`autosave\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`news\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_news_v_parent_idx\` ON \`_news_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_news_v_version_version_image_idx\` ON \`_news_v\` (\`version_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_news_v_version_version_updated_at_idx\` ON \`_news_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_news_v_version_version_created_at_idx\` ON \`_news_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_news_v_version_version__status_idx\` ON \`_news_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_news_v_created_at_idx\` ON \`_news_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_news_v_updated_at_idx\` ON \`_news_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_news_v_latest_idx\` ON \`_news_v\` (\`latest\`);`)
  await db.run(sql`CREATE INDEX \`_news_v_autosave_idx\` ON \`_news_v\` (\`autosave\`);`)
  await db.run(sql`CREATE TABLE \`team\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text,
  	\`title\` text,
  	\`bio\` text,
  	\`initials\` text,
  	\`image_id\` integer,
  	\`linkedin\` text,
  	\`category\` text DEFAULT 'executive',
  	\`affiliation\` text,
  	\`order\` numeric DEFAULT 0,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft',
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`team_image_idx\` ON \`team\` (\`image_id\`);`)
  await db.run(sql`CREATE INDEX \`team_updated_at_idx\` ON \`team\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`team_created_at_idx\` ON \`team\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`team__status_idx\` ON \`team\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`_team_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_name\` text,
  	\`version_title\` text,
  	\`version_bio\` text,
  	\`version_initials\` text,
  	\`version_image_id\` integer,
  	\`version_linkedin\` text,
  	\`version_category\` text DEFAULT 'executive',
  	\`version_affiliation\` text,
  	\`version_order\` numeric DEFAULT 0,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	\`autosave\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`team\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_team_v_parent_idx\` ON \`_team_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_team_v_version_version_image_idx\` ON \`_team_v\` (\`version_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_team_v_version_version_updated_at_idx\` ON \`_team_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_team_v_version_version_created_at_idx\` ON \`_team_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_team_v_version_version__status_idx\` ON \`_team_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_team_v_created_at_idx\` ON \`_team_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_team_v_updated_at_idx\` ON \`_team_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_team_v_latest_idx\` ON \`_team_v\` (\`latest\`);`)
  await db.run(sql`CREATE INDEX \`_team_v_autosave_idx\` ON \`_team_v\` (\`autosave\`);`)
  await db.run(sql`CREATE TABLE \`partners\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text,
  	\`logo_id\` integer,
  	\`url\` text,
  	\`tier\` text DEFAULT 'strategic',
  	\`type\` text,
  	\`description\` text,
  	\`order\` numeric DEFAULT 0,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft',
  	FOREIGN KEY (\`logo_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`partners_logo_idx\` ON \`partners\` (\`logo_id\`);`)
  await db.run(sql`CREATE INDEX \`partners_updated_at_idx\` ON \`partners\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`partners_created_at_idx\` ON \`partners\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`partners__status_idx\` ON \`partners\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`_partners_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_name\` text,
  	\`version_logo_id\` integer,
  	\`version_url\` text,
  	\`version_tier\` text DEFAULT 'strategic',
  	\`version_type\` text,
  	\`version_description\` text,
  	\`version_order\` numeric DEFAULT 0,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	\`autosave\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`partners\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_logo_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_partners_v_parent_idx\` ON \`_partners_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_partners_v_version_version_logo_idx\` ON \`_partners_v\` (\`version_logo_id\`);`)
  await db.run(sql`CREATE INDEX \`_partners_v_version_version_updated_at_idx\` ON \`_partners_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_partners_v_version_version_created_at_idx\` ON \`_partners_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_partners_v_version_version__status_idx\` ON \`_partners_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_partners_v_created_at_idx\` ON \`_partners_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_partners_v_updated_at_idx\` ON \`_partners_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_partners_v_latest_idx\` ON \`_partners_v\` (\`latest\`);`)
  await db.run(sql`CREATE INDEX \`_partners_v_autosave_idx\` ON \`_partners_v\` (\`autosave\`);`)
  await db.run(sql`CREATE TABLE \`jobs\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`department\` text DEFAULT 'Engineering',
  	\`location\` text,
  	\`type\` text DEFAULT 'Full-time',
  	\`summary\` text,
  	\`active\` integer DEFAULT true,
  	\`order\` numeric DEFAULT 0,
  	\`source_pdf_id\` integer,
  	\`body\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft',
  	FOREIGN KEY (\`source_pdf_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`jobs_source_pdf_idx\` ON \`jobs\` (\`source_pdf_id\`);`)
  await db.run(sql`CREATE INDEX \`jobs_updated_at_idx\` ON \`jobs\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`jobs_created_at_idx\` ON \`jobs\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`jobs__status_idx\` ON \`jobs\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`_jobs_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_title\` text,
  	\`version_department\` text DEFAULT 'Engineering',
  	\`version_location\` text,
  	\`version_type\` text DEFAULT 'Full-time',
  	\`version_summary\` text,
  	\`version_active\` integer DEFAULT true,
  	\`version_order\` numeric DEFAULT 0,
  	\`version_source_pdf_id\` integer,
  	\`version_body\` text,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	\`autosave\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`jobs\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_source_pdf_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_jobs_v_parent_idx\` ON \`_jobs_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_jobs_v_version_version_source_pdf_idx\` ON \`_jobs_v\` (\`version_source_pdf_id\`);`)
  await db.run(sql`CREATE INDEX \`_jobs_v_version_version_updated_at_idx\` ON \`_jobs_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_jobs_v_version_version_created_at_idx\` ON \`_jobs_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_jobs_v_version_version__status_idx\` ON \`_jobs_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_jobs_v_created_at_idx\` ON \`_jobs_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_jobs_v_updated_at_idx\` ON \`_jobs_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_jobs_v_latest_idx\` ON \`_jobs_v\` (\`latest\`);`)
  await db.run(sql`CREATE INDEX \`_jobs_v_autosave_idx\` ON \`_jobs_v\` (\`autosave\`);`)
  await db.run(sql`CREATE TABLE \`testimonials\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`quote\` text,
  	\`attribution\` text,
  	\`role\` text,
  	\`order\` numeric DEFAULT 0,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft'
  );
  `)
  await db.run(sql`CREATE INDEX \`testimonials_updated_at_idx\` ON \`testimonials\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`testimonials_created_at_idx\` ON \`testimonials\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`testimonials__status_idx\` ON \`testimonials\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`_testimonials_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_quote\` text,
  	\`version_attribution\` text,
  	\`version_role\` text,
  	\`version_order\` numeric DEFAULT 0,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	\`autosave\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`testimonials\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_testimonials_v_parent_idx\` ON \`_testimonials_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_testimonials_v_version_version_updated_at_idx\` ON \`_testimonials_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_testimonials_v_version_version_created_at_idx\` ON \`_testimonials_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_testimonials_v_version_version__status_idx\` ON \`_testimonials_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_testimonials_v_created_at_idx\` ON \`_testimonials_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_testimonials_v_updated_at_idx\` ON \`_testimonials_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_testimonials_v_latest_idx\` ON \`_testimonials_v\` (\`latest\`);`)
  await db.run(sql`CREATE INDEX \`_testimonials_v_autosave_idx\` ON \`_testimonials_v\` (\`autosave\`);`)
  await db.run(sql`CREATE TABLE \`industry_solutions_benefits\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`metric\` text,
  	\`label\` text,
  	\`description\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`industry_solutions\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`industry_solutions_benefits_order_idx\` ON \`industry_solutions_benefits\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`industry_solutions_benefits_parent_id_idx\` ON \`industry_solutions_benefits\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`industry_solutions_use_cases\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`description\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`industry_solutions\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`industry_solutions_use_cases_order_idx\` ON \`industry_solutions_use_cases\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`industry_solutions_use_cases_parent_id_idx\` ON \`industry_solutions_use_cases\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`industry_solutions_case_study_results\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`metric\` text,
  	\`label\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`industry_solutions\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`industry_solutions_case_study_results_order_idx\` ON \`industry_solutions_case_study_results\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`industry_solutions_case_study_results_parent_id_idx\` ON \`industry_solutions_case_study_results\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`industry_solutions_why_cards\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`description\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`industry_solutions\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`industry_solutions_why_cards_order_idx\` ON \`industry_solutions_why_cards\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`industry_solutions_why_cards_parent_id_idx\` ON \`industry_solutions_why_cards\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`industry_solutions\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`headline\` text,
  	\`headline_accent\` text,
  	\`description\` text,
  	\`cta_primary_text\` text,
  	\`cta_primary_href\` text,
  	\`cta_secondary_text\` text,
  	\`cta_secondary_href\` text,
  	\`case_study_country\` text,
  	\`case_study_title\` text,
  	\`case_study_description\` text,
  	\`cta_section_headline\` text,
  	\`cta_section_description\` text,
  	\`cta_section_primary_cta_text\` text,
  	\`cta_section_primary_cta_href\` text,
  	\`cta_section_secondary_cta_text\` text,
  	\`cta_section_secondary_cta_href\` text,
  	\`body\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft'
  );
  `)
  await db.run(sql`CREATE INDEX \`industry_solutions_updated_at_idx\` ON \`industry_solutions\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`industry_solutions_created_at_idx\` ON \`industry_solutions\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`industry_solutions__status_idx\` ON \`industry_solutions\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`_industry_solutions_v_version_benefits\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`metric\` text,
  	\`label\` text,
  	\`description\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_industry_solutions_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_industry_solutions_v_version_benefits_order_idx\` ON \`_industry_solutions_v_version_benefits\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_industry_solutions_v_version_benefits_parent_id_idx\` ON \`_industry_solutions_v_version_benefits\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_industry_solutions_v_version_use_cases\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`description\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_industry_solutions_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_industry_solutions_v_version_use_cases_order_idx\` ON \`_industry_solutions_v_version_use_cases\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_industry_solutions_v_version_use_cases_parent_id_idx\` ON \`_industry_solutions_v_version_use_cases\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_industry_solutions_v_version_case_study_results\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`metric\` text,
  	\`label\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_industry_solutions_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_industry_solutions_v_version_case_study_results_order_idx\` ON \`_industry_solutions_v_version_case_study_results\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_industry_solutions_v_version_case_study_results_parent_id_idx\` ON \`_industry_solutions_v_version_case_study_results\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_industry_solutions_v_version_why_cards\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`description\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_industry_solutions_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_industry_solutions_v_version_why_cards_order_idx\` ON \`_industry_solutions_v_version_why_cards\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_industry_solutions_v_version_why_cards_parent_id_idx\` ON \`_industry_solutions_v_version_why_cards\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_industry_solutions_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_title\` text,
  	\`version_headline\` text,
  	\`version_headline_accent\` text,
  	\`version_description\` text,
  	\`version_cta_primary_text\` text,
  	\`version_cta_primary_href\` text,
  	\`version_cta_secondary_text\` text,
  	\`version_cta_secondary_href\` text,
  	\`version_case_study_country\` text,
  	\`version_case_study_title\` text,
  	\`version_case_study_description\` text,
  	\`version_cta_section_headline\` text,
  	\`version_cta_section_description\` text,
  	\`version_cta_section_primary_cta_text\` text,
  	\`version_cta_section_primary_cta_href\` text,
  	\`version_cta_section_secondary_cta_text\` text,
  	\`version_cta_section_secondary_cta_href\` text,
  	\`version_body\` text,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	\`autosave\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`industry_solutions\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_industry_solutions_v_parent_idx\` ON \`_industry_solutions_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_industry_solutions_v_version_version_updated_at_idx\` ON \`_industry_solutions_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_industry_solutions_v_version_version_created_at_idx\` ON \`_industry_solutions_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_industry_solutions_v_version_version__status_idx\` ON \`_industry_solutions_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_industry_solutions_v_created_at_idx\` ON \`_industry_solutions_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_industry_solutions_v_updated_at_idx\` ON \`_industry_solutions_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_industry_solutions_v_latest_idx\` ON \`_industry_solutions_v\` (\`latest\`);`)
  await db.run(sql`CREATE INDEX \`_industry_solutions_v_autosave_idx\` ON \`_industry_solutions_v\` (\`autosave\`);`)
  await db.run(sql`CREATE TABLE \`outcome_solutions_stats\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`value\` text,
  	\`label\` text,
  	\`description\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`outcome_solutions\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`outcome_solutions_stats_order_idx\` ON \`outcome_solutions_stats\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`outcome_solutions_stats_parent_id_idx\` ON \`outcome_solutions_stats\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`outcome_solutions_pillars\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`description\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`outcome_solutions\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`outcome_solutions_pillars_order_idx\` ON \`outcome_solutions_pillars\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`outcome_solutions_pillars_parent_id_idx\` ON \`outcome_solutions_pillars\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`outcome_solutions_use_cases\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`description\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`outcome_solutions\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`outcome_solutions_use_cases_order_idx\` ON \`outcome_solutions_use_cases\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`outcome_solutions_use_cases_parent_id_idx\` ON \`outcome_solutions_use_cases\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`outcome_solutions\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`headline\` text,
  	\`headline_accent\` text,
  	\`description\` text,
  	\`cta_primary_text\` text,
  	\`cta_primary_href\` text,
  	\`cta_secondary_text\` text,
  	\`cta_secondary_href\` text,
  	\`cta_section_headline\` text,
  	\`cta_section_description\` text,
  	\`cta_section_primary_cta_text\` text,
  	\`cta_section_primary_cta_href\` text,
  	\`cta_section_secondary_cta_text\` text,
  	\`cta_section_secondary_cta_href\` text,
  	\`body\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft'
  );
  `)
  await db.run(sql`CREATE INDEX \`outcome_solutions_updated_at_idx\` ON \`outcome_solutions\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`outcome_solutions_created_at_idx\` ON \`outcome_solutions\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`outcome_solutions__status_idx\` ON \`outcome_solutions\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`_outcome_solutions_v_version_stats\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`value\` text,
  	\`label\` text,
  	\`description\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_outcome_solutions_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_outcome_solutions_v_version_stats_order_idx\` ON \`_outcome_solutions_v_version_stats\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_outcome_solutions_v_version_stats_parent_id_idx\` ON \`_outcome_solutions_v_version_stats\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_outcome_solutions_v_version_pillars\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`description\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_outcome_solutions_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_outcome_solutions_v_version_pillars_order_idx\` ON \`_outcome_solutions_v_version_pillars\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_outcome_solutions_v_version_pillars_parent_id_idx\` ON \`_outcome_solutions_v_version_pillars\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_outcome_solutions_v_version_use_cases\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`description\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_outcome_solutions_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_outcome_solutions_v_version_use_cases_order_idx\` ON \`_outcome_solutions_v_version_use_cases\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_outcome_solutions_v_version_use_cases_parent_id_idx\` ON \`_outcome_solutions_v_version_use_cases\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_outcome_solutions_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_title\` text,
  	\`version_headline\` text,
  	\`version_headline_accent\` text,
  	\`version_description\` text,
  	\`version_cta_primary_text\` text,
  	\`version_cta_primary_href\` text,
  	\`version_cta_secondary_text\` text,
  	\`version_cta_secondary_href\` text,
  	\`version_cta_section_headline\` text,
  	\`version_cta_section_description\` text,
  	\`version_cta_section_primary_cta_text\` text,
  	\`version_cta_section_primary_cta_href\` text,
  	\`version_cta_section_secondary_cta_text\` text,
  	\`version_cta_section_secondary_cta_href\` text,
  	\`version_body\` text,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	\`autosave\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`outcome_solutions\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_outcome_solutions_v_parent_idx\` ON \`_outcome_solutions_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_outcome_solutions_v_version_version_updated_at_idx\` ON \`_outcome_solutions_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_outcome_solutions_v_version_version_created_at_idx\` ON \`_outcome_solutions_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_outcome_solutions_v_version_version__status_idx\` ON \`_outcome_solutions_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_outcome_solutions_v_created_at_idx\` ON \`_outcome_solutions_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_outcome_solutions_v_updated_at_idx\` ON \`_outcome_solutions_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_outcome_solutions_v_latest_idx\` ON \`_outcome_solutions_v\` (\`latest\`);`)
  await db.run(sql`CREATE INDEX \`_outcome_solutions_v_autosave_idx\` ON \`_outcome_solutions_v\` (\`autosave\`);`)
  await db.run(sql`CREATE TABLE \`payload_kv\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`key\` text NOT NULL,
  	\`data\` text NOT NULL
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`payload_kv_key_idx\` ON \`payload_kv\` (\`key\`);`)
  await db.run(sql`CREATE TABLE \`payload_locked_documents\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`global_slug\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_global_slug_idx\` ON \`payload_locked_documents\` (\`global_slug\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_updated_at_idx\` ON \`payload_locked_documents\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_created_at_idx\` ON \`payload_locked_documents\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`payload_locked_documents_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`users_id\` integer,
  	\`media_id\` integer,
  	\`case_studies_id\` integer,
  	\`news_id\` integer,
  	\`team_id\` integer,
  	\`partners_id\` integer,
  	\`jobs_id\` integer,
  	\`testimonials_id\` integer,
  	\`industry_solutions_id\` integer,
  	\`outcome_solutions_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_locked_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`case_studies_id\`) REFERENCES \`case_studies\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`news_id\`) REFERENCES \`news\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`team_id\`) REFERENCES \`team\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`partners_id\`) REFERENCES \`partners\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`jobs_id\`) REFERENCES \`jobs\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`testimonials_id\`) REFERENCES \`testimonials\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`industry_solutions_id\`) REFERENCES \`industry_solutions\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`outcome_solutions_id\`) REFERENCES \`outcome_solutions\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_order_idx\` ON \`payload_locked_documents_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_parent_idx\` ON \`payload_locked_documents_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_path_idx\` ON \`payload_locked_documents_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_users_id_idx\` ON \`payload_locked_documents_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_media_id_idx\` ON \`payload_locked_documents_rels\` (\`media_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_case_studies_id_idx\` ON \`payload_locked_documents_rels\` (\`case_studies_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_news_id_idx\` ON \`payload_locked_documents_rels\` (\`news_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_team_id_idx\` ON \`payload_locked_documents_rels\` (\`team_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_partners_id_idx\` ON \`payload_locked_documents_rels\` (\`partners_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_jobs_id_idx\` ON \`payload_locked_documents_rels\` (\`jobs_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_testimonials_id_idx\` ON \`payload_locked_documents_rels\` (\`testimonials_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_industry_solutions_id_idx\` ON \`payload_locked_documents_rels\` (\`industry_solutions_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_outcome_solutions_id_idx\` ON \`payload_locked_documents_rels\` (\`outcome_solutions_id\`);`)
  await db.run(sql`CREATE TABLE \`payload_preferences\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`key\` text,
  	\`value\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_preferences_key_idx\` ON \`payload_preferences\` (\`key\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_updated_at_idx\` ON \`payload_preferences\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_created_at_idx\` ON \`payload_preferences\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`payload_preferences_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`users_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_preferences\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_order_idx\` ON \`payload_preferences_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_parent_idx\` ON \`payload_preferences_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_path_idx\` ON \`payload_preferences_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_users_id_idx\` ON \`payload_preferences_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE TABLE \`payload_migrations\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text,
  	\`batch\` numeric,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_migrations_updated_at_idx\` ON \`payload_migrations\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`payload_migrations_created_at_idx\` ON \`payload_migrations\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`homepage_hero_stats\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`value\` text,
  	\`label\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`homepage\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`homepage_hero_stats_order_idx\` ON \`homepage_hero_stats\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`homepage_hero_stats_parent_id_idx\` ON \`homepage_hero_stats\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`homepage_platform_capabilities\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`title\` text,
  	\`description\` text,
  	\`href\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`homepage\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`homepage_platform_capabilities_order_idx\` ON \`homepage_platform_capabilities\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`homepage_platform_capabilities_parent_id_idx\` ON \`homepage_platform_capabilities\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`homepage_products_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`name\` text,
  	\`tagline\` text,
  	\`description\` text,
  	\`wireframe\` text DEFAULT 'dashboard',
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`homepage\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`homepage_products_items_order_idx\` ON \`homepage_products_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`homepage_products_items_parent_id_idx\` ON \`homepage_products_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`homepage_solutions_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`href\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`homepage\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`homepage_solutions_items_order_idx\` ON \`homepage_solutions_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`homepage_solutions_items_parent_id_idx\` ON \`homepage_solutions_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`homepage_case_studies_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`metric\` text,
  	\`metric_label\` text,
  	\`description\` text,
  	\`tag\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`homepage\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`homepage_case_studies_items_order_idx\` ON \`homepage_case_studies_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`homepage_case_studies_items_parent_id_idx\` ON \`homepage_case_studies_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`homepage_impact_metrics\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`value\` numeric,
  	\`suffix\` text,
  	\`prefix\` text,
  	\`label\` text,
  	\`format\` text DEFAULT 'number',
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`homepage\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`homepage_impact_metrics_order_idx\` ON \`homepage_impact_metrics\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`homepage_impact_metrics_parent_id_idx\` ON \`homepage_impact_metrics\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`homepage\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`hero_eyebrow\` text,
  	\`hero_line1\` text,
  	\`hero_line2\` text,
  	\`hero_subheadline\` text,
  	\`hero_cta_primary_text\` text,
  	\`hero_cta_primary_href\` text,
  	\`hero_cta_secondary_text\` text,
  	\`hero_cta_secondary_href\` text,
  	\`hero_partner_logos_title\` text,
  	\`mission_eyebrow\` text,
  	\`mission_headline\` text,
  	\`mission_headline_accent\` text,
  	\`mission_paragraph1\` text,
  	\`mission_paragraph2\` text,
  	\`mission_link_text\` text,
  	\`mission_link_href\` text,
  	\`platform_eyebrow\` text,
  	\`platform_headline\` text,
  	\`platform_description\` text,
  	\`products_eyebrow\` text,
  	\`products_headline\` text,
  	\`products_description\` text,
  	\`solutions_eyebrow\` text,
  	\`solutions_headline\` text,
  	\`solutions_link_text\` text,
  	\`solutions_link_href\` text,
  	\`case_studies_eyebrow\` text,
  	\`case_studies_headline\` text,
  	\`impact_eyebrow\` text,
  	\`impact_headline\` text,
  	\`impact_headline_accent\` text,
  	\`impact_description\` text,
  	\`impact_cta_text\` text,
  	\`impact_cta_href\` text,
  	\`testimonials_eyebrow\` text,
  	\`testimonials_headline\` text,
  	\`cta_headline\` text,
  	\`cta_description\` text,
  	\`cta_primary_cta_text\` text,
  	\`cta_primary_cta_href\` text,
  	\`cta_secondary_cta_text\` text,
  	\`cta_secondary_cta_href\` text,
  	\`cta_contact_email\` text,
  	\`_status\` text DEFAULT 'draft',
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`CREATE INDEX \`homepage__status_idx\` ON \`homepage\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`_homepage_v_version_hero_stats\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`value\` text,
  	\`label\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_homepage_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_homepage_v_version_hero_stats_order_idx\` ON \`_homepage_v_version_hero_stats\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_homepage_v_version_hero_stats_parent_id_idx\` ON \`_homepage_v_version_hero_stats\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_homepage_v_version_platform_capabilities\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`title\` text,
  	\`description\` text,
  	\`href\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_homepage_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_homepage_v_version_platform_capabilities_order_idx\` ON \`_homepage_v_version_platform_capabilities\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_homepage_v_version_platform_capabilities_parent_id_idx\` ON \`_homepage_v_version_platform_capabilities\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_homepage_v_version_products_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text,
  	\`tagline\` text,
  	\`description\` text,
  	\`wireframe\` text DEFAULT 'dashboard',
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_homepage_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_homepage_v_version_products_items_order_idx\` ON \`_homepage_v_version_products_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_homepage_v_version_products_items_parent_id_idx\` ON \`_homepage_v_version_products_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_homepage_v_version_solutions_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`href\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_homepage_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_homepage_v_version_solutions_items_order_idx\` ON \`_homepage_v_version_solutions_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_homepage_v_version_solutions_items_parent_id_idx\` ON \`_homepage_v_version_solutions_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_homepage_v_version_case_studies_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`metric\` text,
  	\`metric_label\` text,
  	\`description\` text,
  	\`tag\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_homepage_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_homepage_v_version_case_studies_items_order_idx\` ON \`_homepage_v_version_case_studies_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_homepage_v_version_case_studies_items_parent_id_idx\` ON \`_homepage_v_version_case_studies_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_homepage_v_version_impact_metrics\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`value\` numeric,
  	\`suffix\` text,
  	\`prefix\` text,
  	\`label\` text,
  	\`format\` text DEFAULT 'number',
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_homepage_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_homepage_v_version_impact_metrics_order_idx\` ON \`_homepage_v_version_impact_metrics\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_homepage_v_version_impact_metrics_parent_id_idx\` ON \`_homepage_v_version_impact_metrics\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_homepage_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`version_hero_eyebrow\` text,
  	\`version_hero_line1\` text,
  	\`version_hero_line2\` text,
  	\`version_hero_subheadline\` text,
  	\`version_hero_cta_primary_text\` text,
  	\`version_hero_cta_primary_href\` text,
  	\`version_hero_cta_secondary_text\` text,
  	\`version_hero_cta_secondary_href\` text,
  	\`version_hero_partner_logos_title\` text,
  	\`version_mission_eyebrow\` text,
  	\`version_mission_headline\` text,
  	\`version_mission_headline_accent\` text,
  	\`version_mission_paragraph1\` text,
  	\`version_mission_paragraph2\` text,
  	\`version_mission_link_text\` text,
  	\`version_mission_link_href\` text,
  	\`version_platform_eyebrow\` text,
  	\`version_platform_headline\` text,
  	\`version_platform_description\` text,
  	\`version_products_eyebrow\` text,
  	\`version_products_headline\` text,
  	\`version_products_description\` text,
  	\`version_solutions_eyebrow\` text,
  	\`version_solutions_headline\` text,
  	\`version_solutions_link_text\` text,
  	\`version_solutions_link_href\` text,
  	\`version_case_studies_eyebrow\` text,
  	\`version_case_studies_headline\` text,
  	\`version_impact_eyebrow\` text,
  	\`version_impact_headline\` text,
  	\`version_impact_headline_accent\` text,
  	\`version_impact_description\` text,
  	\`version_impact_cta_text\` text,
  	\`version_impact_cta_href\` text,
  	\`version_testimonials_eyebrow\` text,
  	\`version_testimonials_headline\` text,
  	\`version_cta_headline\` text,
  	\`version_cta_description\` text,
  	\`version_cta_primary_cta_text\` text,
  	\`version_cta_primary_cta_href\` text,
  	\`version_cta_secondary_cta_text\` text,
  	\`version_cta_secondary_cta_href\` text,
  	\`version_cta_contact_email\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	\`autosave\` integer
  );
  `)
  await db.run(sql`CREATE INDEX \`_homepage_v_version_version__status_idx\` ON \`_homepage_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_homepage_v_created_at_idx\` ON \`_homepage_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_homepage_v_updated_at_idx\` ON \`_homepage_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_homepage_v_latest_idx\` ON \`_homepage_v\` (\`latest\`);`)
  await db.run(sql`CREATE INDEX \`_homepage_v_autosave_idx\` ON \`_homepage_v\` (\`autosave\`);`)
  await db.run(sql`CREATE TABLE \`company_overview_facts\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`value\` text,
  	\`label\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`company_overview\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`company_overview_facts_order_idx\` ON \`company_overview_facts\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`company_overview_facts_parent_id_idx\` ON \`company_overview_facts\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`company_overview_story_paragraphs\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`company_overview\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`company_overview_story_paragraphs_order_idx\` ON \`company_overview_story_paragraphs\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`company_overview_story_paragraphs_parent_id_idx\` ON \`company_overview_story_paragraphs\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`company_overview_nav_cards\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`description\` text,
  	\`href\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`company_overview\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`company_overview_nav_cards_order_idx\` ON \`company_overview_nav_cards\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`company_overview_nav_cards_parent_id_idx\` ON \`company_overview_nav_cards\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`company_overview_offices\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`city\` text,
  	\`role\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`company_overview\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`company_overview_offices_order_idx\` ON \`company_overview_offices\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`company_overview_offices_parent_id_idx\` ON \`company_overview_offices\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`company_overview\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`hero_eyebrow\` text,
  	\`hero_headline\` text,
  	\`hero_headline_accent\` text,
  	\`hero_description\` text,
  	\`story_eyebrow\` text,
  	\`story_headline\` text,
  	\`story_link_text\` text,
  	\`story_link_href\` text,
  	\`story_quote_text\` text,
  	\`story_quote_name\` text,
  	\`story_quote_role\` text,
  	\`story_quote_initials\` text,
  	\`cta_headline\` text,
  	\`cta_description\` text,
  	\`cta_primary_cta_text\` text,
  	\`cta_primary_cta_href\` text,
  	\`cta_secondary_cta_text\` text,
  	\`cta_secondary_cta_href\` text,
  	\`_status\` text DEFAULT 'draft',
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`CREATE INDEX \`company_overview__status_idx\` ON \`company_overview\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`_company_overview_v_version_facts\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`value\` text,
  	\`label\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_company_overview_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_company_overview_v_version_facts_order_idx\` ON \`_company_overview_v_version_facts\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_company_overview_v_version_facts_parent_id_idx\` ON \`_company_overview_v_version_facts\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_company_overview_v_version_story_paragraphs\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`text\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_company_overview_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_company_overview_v_version_story_paragraphs_order_idx\` ON \`_company_overview_v_version_story_paragraphs\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_company_overview_v_version_story_paragraphs_parent_id_idx\` ON \`_company_overview_v_version_story_paragraphs\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_company_overview_v_version_nav_cards\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`description\` text,
  	\`href\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_company_overview_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_company_overview_v_version_nav_cards_order_idx\` ON \`_company_overview_v_version_nav_cards\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_company_overview_v_version_nav_cards_parent_id_idx\` ON \`_company_overview_v_version_nav_cards\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_company_overview_v_version_offices\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`city\` text,
  	\`role\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_company_overview_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_company_overview_v_version_offices_order_idx\` ON \`_company_overview_v_version_offices\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_company_overview_v_version_offices_parent_id_idx\` ON \`_company_overview_v_version_offices\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_company_overview_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`version_hero_eyebrow\` text,
  	\`version_hero_headline\` text,
  	\`version_hero_headline_accent\` text,
  	\`version_hero_description\` text,
  	\`version_story_eyebrow\` text,
  	\`version_story_headline\` text,
  	\`version_story_link_text\` text,
  	\`version_story_link_href\` text,
  	\`version_story_quote_text\` text,
  	\`version_story_quote_name\` text,
  	\`version_story_quote_role\` text,
  	\`version_story_quote_initials\` text,
  	\`version_cta_headline\` text,
  	\`version_cta_description\` text,
  	\`version_cta_primary_cta_text\` text,
  	\`version_cta_primary_cta_href\` text,
  	\`version_cta_secondary_cta_text\` text,
  	\`version_cta_secondary_cta_href\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	\`autosave\` integer
  );
  `)
  await db.run(sql`CREATE INDEX \`_company_overview_v_version_version__status_idx\` ON \`_company_overview_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_company_overview_v_created_at_idx\` ON \`_company_overview_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_company_overview_v_updated_at_idx\` ON \`_company_overview_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_company_overview_v_latest_idx\` ON \`_company_overview_v\` (\`latest\`);`)
  await db.run(sql`CREATE INDEX \`_company_overview_v_autosave_idx\` ON \`_company_overview_v\` (\`autosave\`);`)
  await db.run(sql`CREATE TABLE \`mission_page_values\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`description\` text,
  	\`icon\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`mission_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`mission_page_values_order_idx\` ON \`mission_page_values\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`mission_page_values_parent_id_idx\` ON \`mission_page_values\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`mission_page_milestones\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`year\` text,
  	\`title\` text,
  	\`description\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`mission_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`mission_page_milestones_order_idx\` ON \`mission_page_milestones\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`mission_page_milestones_parent_id_idx\` ON \`mission_page_milestones\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`mission_page_team_preview\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`name\` text,
  	\`role\` text,
  	\`bio\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`mission_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`mission_page_team_preview_order_idx\` ON \`mission_page_team_preview\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`mission_page_team_preview_parent_id_idx\` ON \`mission_page_team_preview\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`mission_page\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`hero_eyebrow\` text,
  	\`hero_headline\` text,
  	\`hero_headline_accent\` text,
  	\`hero_description\` text,
  	\`mission_title\` text,
  	\`mission_description\` text,
  	\`vision_title\` text,
  	\`vision_description\` text,
  	\`manifesto_quote\` text,
  	\`cta_headline\` text,
  	\`cta_description\` text,
  	\`cta_primary_cta_text\` text,
  	\`cta_primary_cta_href\` text,
  	\`cta_secondary_cta_text\` text,
  	\`cta_secondary_cta_href\` text,
  	\`_status\` text DEFAULT 'draft',
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`CREATE INDEX \`mission_page__status_idx\` ON \`mission_page\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`_mission_page_v_version_values\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`description\` text,
  	\`icon\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_mission_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_mission_page_v_version_values_order_idx\` ON \`_mission_page_v_version_values\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_mission_page_v_version_values_parent_id_idx\` ON \`_mission_page_v_version_values\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_mission_page_v_version_milestones\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`year\` text,
  	\`title\` text,
  	\`description\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_mission_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_mission_page_v_version_milestones_order_idx\` ON \`_mission_page_v_version_milestones\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_mission_page_v_version_milestones_parent_id_idx\` ON \`_mission_page_v_version_milestones\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_mission_page_v_version_team_preview\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text,
  	\`role\` text,
  	\`bio\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_mission_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_mission_page_v_version_team_preview_order_idx\` ON \`_mission_page_v_version_team_preview\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_mission_page_v_version_team_preview_parent_id_idx\` ON \`_mission_page_v_version_team_preview\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_mission_page_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`version_hero_eyebrow\` text,
  	\`version_hero_headline\` text,
  	\`version_hero_headline_accent\` text,
  	\`version_hero_description\` text,
  	\`version_mission_title\` text,
  	\`version_mission_description\` text,
  	\`version_vision_title\` text,
  	\`version_vision_description\` text,
  	\`version_manifesto_quote\` text,
  	\`version_cta_headline\` text,
  	\`version_cta_description\` text,
  	\`version_cta_primary_cta_text\` text,
  	\`version_cta_primary_cta_href\` text,
  	\`version_cta_secondary_cta_text\` text,
  	\`version_cta_secondary_cta_href\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	\`autosave\` integer
  );
  `)
  await db.run(sql`CREATE INDEX \`_mission_page_v_version_version__status_idx\` ON \`_mission_page_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_mission_page_v_created_at_idx\` ON \`_mission_page_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_mission_page_v_updated_at_idx\` ON \`_mission_page_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_mission_page_v_latest_idx\` ON \`_mission_page_v\` (\`latest\`);`)
  await db.run(sql`CREATE INDEX \`_mission_page_v_autosave_idx\` ON \`_mission_page_v\` (\`autosave\`);`)
  await db.run(sql`CREATE TABLE \`careers_page_stats\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`value\` text,
  	\`label\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`careers_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`careers_page_stats_order_idx\` ON \`careers_page_stats\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`careers_page_stats_parent_id_idx\` ON \`careers_page_stats\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`careers_page_benefits\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`description\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`careers_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`careers_page_benefits_order_idx\` ON \`careers_page_benefits\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`careers_page_benefits_parent_id_idx\` ON \`careers_page_benefits\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`careers_page_hiring_process\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`step\` text,
  	\`title\` text,
  	\`description\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`careers_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`careers_page_hiring_process_order_idx\` ON \`careers_page_hiring_process\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`careers_page_hiring_process_parent_id_idx\` ON \`careers_page_hiring_process\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`careers_page\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`hero_eyebrow\` text,
  	\`hero_headline\` text,
  	\`hero_headline_accent\` text,
  	\`hero_description\` text,
  	\`hero_cta_primary_text\` text,
  	\`hero_cta_primary_href\` text,
  	\`hero_cta_secondary_text\` text,
  	\`hero_cta_secondary_href\` text,
  	\`cta_headline\` text,
  	\`cta_description\` text,
  	\`cta_cta_text\` text,
  	\`cta_cta_href\` text,
  	\`_status\` text DEFAULT 'draft',
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`CREATE INDEX \`careers_page__status_idx\` ON \`careers_page\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`_careers_page_v_version_stats\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`value\` text,
  	\`label\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_careers_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_careers_page_v_version_stats_order_idx\` ON \`_careers_page_v_version_stats\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_careers_page_v_version_stats_parent_id_idx\` ON \`_careers_page_v_version_stats\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_careers_page_v_version_benefits\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`description\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_careers_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_careers_page_v_version_benefits_order_idx\` ON \`_careers_page_v_version_benefits\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_careers_page_v_version_benefits_parent_id_idx\` ON \`_careers_page_v_version_benefits\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_careers_page_v_version_hiring_process\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`step\` text,
  	\`title\` text,
  	\`description\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_careers_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_careers_page_v_version_hiring_process_order_idx\` ON \`_careers_page_v_version_hiring_process\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_careers_page_v_version_hiring_process_parent_id_idx\` ON \`_careers_page_v_version_hiring_process\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_careers_page_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`version_hero_eyebrow\` text,
  	\`version_hero_headline\` text,
  	\`version_hero_headline_accent\` text,
  	\`version_hero_description\` text,
  	\`version_hero_cta_primary_text\` text,
  	\`version_hero_cta_primary_href\` text,
  	\`version_hero_cta_secondary_text\` text,
  	\`version_hero_cta_secondary_href\` text,
  	\`version_cta_headline\` text,
  	\`version_cta_description\` text,
  	\`version_cta_cta_text\` text,
  	\`version_cta_cta_href\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	\`autosave\` integer
  );
  `)
  await db.run(sql`CREATE INDEX \`_careers_page_v_version_version__status_idx\` ON \`_careers_page_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_careers_page_v_created_at_idx\` ON \`_careers_page_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_careers_page_v_updated_at_idx\` ON \`_careers_page_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_careers_page_v_latest_idx\` ON \`_careers_page_v\` (\`latest\`);`)
  await db.run(sql`CREATE INDEX \`_careers_page_v_autosave_idx\` ON \`_careers_page_v\` (\`autosave\`);`)
  await db.run(sql`CREATE TABLE \`platform_overview_platform_areas_features\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`platform_overview_platform_areas\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`platform_overview_platform_areas_features_order_idx\` ON \`platform_overview_platform_areas_features\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`platform_overview_platform_areas_features_parent_id_idx\` ON \`platform_overview_platform_areas_features\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`platform_overview_platform_areas\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`description\` text,
  	\`href\` text,
  	\`metric\` text,
  	\`metric_label\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`platform_overview\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`platform_overview_platform_areas_order_idx\` ON \`platform_overview_platform_areas\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`platform_overview_platform_areas_parent_id_idx\` ON \`platform_overview_platform_areas\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`platform_overview_specs\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`value\` text,
  	\`detail\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`platform_overview\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`platform_overview_specs_order_idx\` ON \`platform_overview_specs\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`platform_overview_specs_parent_id_idx\` ON \`platform_overview_specs\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`platform_overview_architecture_layers\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`layer\` text,
  	\`title\` text,
  	\`description\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`platform_overview\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`platform_overview_architecture_layers_order_idx\` ON \`platform_overview_architecture_layers\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`platform_overview_architecture_layers_parent_id_idx\` ON \`platform_overview_architecture_layers\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`platform_overview\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`hero_eyebrow\` text,
  	\`hero_headline\` text,
  	\`hero_headline_accent\` text,
  	\`hero_description\` text,
  	\`hero_cta_primary_text\` text,
  	\`hero_cta_primary_href\` text,
  	\`hero_cta_secondary_text\` text,
  	\`hero_cta_secondary_href\` text,
  	\`cta_headline\` text,
  	\`cta_description\` text,
  	\`cta_primary_cta_text\` text,
  	\`cta_primary_cta_href\` text,
  	\`cta_secondary_cta_text\` text,
  	\`cta_secondary_cta_href\` text,
  	\`_status\` text DEFAULT 'draft',
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`CREATE INDEX \`platform_overview__status_idx\` ON \`platform_overview\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`_platform_overview_v_version_platform_areas_features\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`text\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_platform_overview_v_version_platform_areas\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_platform_overview_v_version_platform_areas_features_order_idx\` ON \`_platform_overview_v_version_platform_areas_features\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_platform_overview_v_version_platform_areas_features_parent_id_idx\` ON \`_platform_overview_v_version_platform_areas_features\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_platform_overview_v_version_platform_areas\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`description\` text,
  	\`href\` text,
  	\`metric\` text,
  	\`metric_label\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_platform_overview_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_platform_overview_v_version_platform_areas_order_idx\` ON \`_platform_overview_v_version_platform_areas\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_platform_overview_v_version_platform_areas_parent_id_idx\` ON \`_platform_overview_v_version_platform_areas\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_platform_overview_v_version_specs\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`value\` text,
  	\`detail\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_platform_overview_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_platform_overview_v_version_specs_order_idx\` ON \`_platform_overview_v_version_specs\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_platform_overview_v_version_specs_parent_id_idx\` ON \`_platform_overview_v_version_specs\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_platform_overview_v_version_architecture_layers\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`layer\` text,
  	\`title\` text,
  	\`description\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_platform_overview_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_platform_overview_v_version_architecture_layers_order_idx\` ON \`_platform_overview_v_version_architecture_layers\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_platform_overview_v_version_architecture_layers_parent_id_idx\` ON \`_platform_overview_v_version_architecture_layers\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_platform_overview_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`version_hero_eyebrow\` text,
  	\`version_hero_headline\` text,
  	\`version_hero_headline_accent\` text,
  	\`version_hero_description\` text,
  	\`version_hero_cta_primary_text\` text,
  	\`version_hero_cta_primary_href\` text,
  	\`version_hero_cta_secondary_text\` text,
  	\`version_hero_cta_secondary_href\` text,
  	\`version_cta_headline\` text,
  	\`version_cta_description\` text,
  	\`version_cta_primary_cta_text\` text,
  	\`version_cta_primary_cta_href\` text,
  	\`version_cta_secondary_cta_text\` text,
  	\`version_cta_secondary_cta_href\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	\`autosave\` integer
  );
  `)
  await db.run(sql`CREATE INDEX \`_platform_overview_v_version_version__status_idx\` ON \`_platform_overview_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_platform_overview_v_created_at_idx\` ON \`_platform_overview_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_platform_overview_v_updated_at_idx\` ON \`_platform_overview_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_platform_overview_v_latest_idx\` ON \`_platform_overview_v\` (\`latest\`);`)
  await db.run(sql`CREATE INDEX \`_platform_overview_v_autosave_idx\` ON \`_platform_overview_v\` (\`autosave\`);`)
  await db.run(sql`CREATE TABLE \`infrastructure_page_stats\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`value\` text,
  	\`label\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`infrastructure_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`infrastructure_page_stats_order_idx\` ON \`infrastructure_page_stats\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`infrastructure_page_stats_parent_id_idx\` ON \`infrastructure_page_stats\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`infrastructure_page_nodes_specs\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`value\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`infrastructure_page_nodes\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`infrastructure_page_nodes_specs_order_idx\` ON \`infrastructure_page_nodes_specs\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`infrastructure_page_nodes_specs_parent_id_idx\` ON \`infrastructure_page_nodes_specs\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`infrastructure_page_nodes\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`name\` text,
  	\`tagline\` text,
  	\`description\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`infrastructure_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`infrastructure_page_nodes_order_idx\` ON \`infrastructure_page_nodes\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`infrastructure_page_nodes_parent_id_idx\` ON \`infrastructure_page_nodes\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`infrastructure_page_features\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`description\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`infrastructure_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`infrastructure_page_features_order_idx\` ON \`infrastructure_page_features\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`infrastructure_page_features_parent_id_idx\` ON \`infrastructure_page_features\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`infrastructure_page_deployment_models\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`name\` text,
  	\`description\` text,
  	\`ideal\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`infrastructure_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`infrastructure_page_deployment_models_order_idx\` ON \`infrastructure_page_deployment_models\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`infrastructure_page_deployment_models_parent_id_idx\` ON \`infrastructure_page_deployment_models\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`infrastructure_page\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`hero_eyebrow\` text,
  	\`hero_headline\` text,
  	\`hero_headline_accent\` text,
  	\`hero_description\` text,
  	\`hero_cta_primary_text\` text,
  	\`hero_cta_primary_href\` text,
  	\`hero_cta_secondary_text\` text,
  	\`hero_cta_secondary_href\` text,
  	\`cta_headline\` text,
  	\`cta_description\` text,
  	\`cta_primary_cta_text\` text,
  	\`cta_primary_cta_href\` text,
  	\`cta_secondary_cta_text\` text,
  	\`cta_secondary_cta_href\` text,
  	\`_status\` text DEFAULT 'draft',
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`CREATE INDEX \`infrastructure_page__status_idx\` ON \`infrastructure_page\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`_infrastructure_page_v_version_stats\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`value\` text,
  	\`label\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_infrastructure_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_infrastructure_page_v_version_stats_order_idx\` ON \`_infrastructure_page_v_version_stats\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_infrastructure_page_v_version_stats_parent_id_idx\` ON \`_infrastructure_page_v_version_stats\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_infrastructure_page_v_version_nodes_specs\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`value\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_infrastructure_page_v_version_nodes\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_infrastructure_page_v_version_nodes_specs_order_idx\` ON \`_infrastructure_page_v_version_nodes_specs\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_infrastructure_page_v_version_nodes_specs_parent_id_idx\` ON \`_infrastructure_page_v_version_nodes_specs\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_infrastructure_page_v_version_nodes\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text,
  	\`tagline\` text,
  	\`description\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_infrastructure_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_infrastructure_page_v_version_nodes_order_idx\` ON \`_infrastructure_page_v_version_nodes\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_infrastructure_page_v_version_nodes_parent_id_idx\` ON \`_infrastructure_page_v_version_nodes\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_infrastructure_page_v_version_features\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`description\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_infrastructure_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_infrastructure_page_v_version_features_order_idx\` ON \`_infrastructure_page_v_version_features\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_infrastructure_page_v_version_features_parent_id_idx\` ON \`_infrastructure_page_v_version_features\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_infrastructure_page_v_version_deployment_models\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text,
  	\`description\` text,
  	\`ideal\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_infrastructure_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_infrastructure_page_v_version_deployment_models_order_idx\` ON \`_infrastructure_page_v_version_deployment_models\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_infrastructure_page_v_version_deployment_models_parent_id_idx\` ON \`_infrastructure_page_v_version_deployment_models\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_infrastructure_page_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`version_hero_eyebrow\` text,
  	\`version_hero_headline\` text,
  	\`version_hero_headline_accent\` text,
  	\`version_hero_description\` text,
  	\`version_hero_cta_primary_text\` text,
  	\`version_hero_cta_primary_href\` text,
  	\`version_hero_cta_secondary_text\` text,
  	\`version_hero_cta_secondary_href\` text,
  	\`version_cta_headline\` text,
  	\`version_cta_description\` text,
  	\`version_cta_primary_cta_text\` text,
  	\`version_cta_primary_cta_href\` text,
  	\`version_cta_secondary_cta_text\` text,
  	\`version_cta_secondary_cta_href\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	\`autosave\` integer
  );
  `)
  await db.run(sql`CREATE INDEX \`_infrastructure_page_v_version_version__status_idx\` ON \`_infrastructure_page_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_infrastructure_page_v_created_at_idx\` ON \`_infrastructure_page_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_infrastructure_page_v_updated_at_idx\` ON \`_infrastructure_page_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_infrastructure_page_v_latest_idx\` ON \`_infrastructure_page_v\` (\`latest\`);`)
  await db.run(sql`CREATE INDEX \`_infrastructure_page_v_autosave_idx\` ON \`_infrastructure_page_v\` (\`autosave\`);`)
  await db.run(sql`CREATE TABLE \`digital_systems_page_systems_features\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`digital_systems_page_systems\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`digital_systems_page_systems_features_order_idx\` ON \`digital_systems_page_systems_features\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`digital_systems_page_systems_features_parent_id_idx\` ON \`digital_systems_page_systems_features\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`digital_systems_page_systems\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`eyebrow\` text,
  	\`name\` text,
  	\`description\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`digital_systems_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`digital_systems_page_systems_order_idx\` ON \`digital_systems_page_systems\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`digital_systems_page_systems_parent_id_idx\` ON \`digital_systems_page_systems\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`digital_systems_page_integration_benefits\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`description\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`digital_systems_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`digital_systems_page_integration_benefits_order_idx\` ON \`digital_systems_page_integration_benefits\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`digital_systems_page_integration_benefits_parent_id_idx\` ON \`digital_systems_page_integration_benefits\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`digital_systems_page_use_cases\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`category\` text,
  	\`title\` text,
  	\`description\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`digital_systems_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`digital_systems_page_use_cases_order_idx\` ON \`digital_systems_page_use_cases\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`digital_systems_page_use_cases_parent_id_idx\` ON \`digital_systems_page_use_cases\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`digital_systems_page\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`hero_eyebrow\` text,
  	\`hero_headline\` text,
  	\`hero_headline_accent\` text,
  	\`hero_description\` text,
  	\`hero_cta_primary_text\` text,
  	\`hero_cta_primary_href\` text,
  	\`hero_cta_secondary_text\` text,
  	\`hero_cta_secondary_href\` text,
  	\`cta_headline\` text,
  	\`cta_description\` text,
  	\`cta_primary_cta_text\` text,
  	\`cta_primary_cta_href\` text,
  	\`cta_secondary_cta_text\` text,
  	\`cta_secondary_cta_href\` text,
  	\`_status\` text DEFAULT 'draft',
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`CREATE INDEX \`digital_systems_page__status_idx\` ON \`digital_systems_page\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`_digital_systems_page_v_version_systems_features\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`text\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_digital_systems_page_v_version_systems\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_digital_systems_page_v_version_systems_features_order_idx\` ON \`_digital_systems_page_v_version_systems_features\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_digital_systems_page_v_version_systems_features_parent_id_idx\` ON \`_digital_systems_page_v_version_systems_features\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_digital_systems_page_v_version_systems\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`eyebrow\` text,
  	\`name\` text,
  	\`description\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_digital_systems_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_digital_systems_page_v_version_systems_order_idx\` ON \`_digital_systems_page_v_version_systems\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_digital_systems_page_v_version_systems_parent_id_idx\` ON \`_digital_systems_page_v_version_systems\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_digital_systems_page_v_version_integration_benefits\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`description\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_digital_systems_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_digital_systems_page_v_version_integration_benefits_order_idx\` ON \`_digital_systems_page_v_version_integration_benefits\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_digital_systems_page_v_version_integration_benefits_parent_id_idx\` ON \`_digital_systems_page_v_version_integration_benefits\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_digital_systems_page_v_version_use_cases\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`category\` text,
  	\`title\` text,
  	\`description\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_digital_systems_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_digital_systems_page_v_version_use_cases_order_idx\` ON \`_digital_systems_page_v_version_use_cases\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_digital_systems_page_v_version_use_cases_parent_id_idx\` ON \`_digital_systems_page_v_version_use_cases\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_digital_systems_page_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`version_hero_eyebrow\` text,
  	\`version_hero_headline\` text,
  	\`version_hero_headline_accent\` text,
  	\`version_hero_description\` text,
  	\`version_hero_cta_primary_text\` text,
  	\`version_hero_cta_primary_href\` text,
  	\`version_hero_cta_secondary_text\` text,
  	\`version_hero_cta_secondary_href\` text,
  	\`version_cta_headline\` text,
  	\`version_cta_description\` text,
  	\`version_cta_primary_cta_text\` text,
  	\`version_cta_primary_cta_href\` text,
  	\`version_cta_secondary_cta_text\` text,
  	\`version_cta_secondary_cta_href\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	\`autosave\` integer
  );
  `)
  await db.run(sql`CREATE INDEX \`_digital_systems_page_v_version_version__status_idx\` ON \`_digital_systems_page_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_digital_systems_page_v_created_at_idx\` ON \`_digital_systems_page_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_digital_systems_page_v_updated_at_idx\` ON \`_digital_systems_page_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_digital_systems_page_v_latest_idx\` ON \`_digital_systems_page_v\` (\`latest\`);`)
  await db.run(sql`CREATE INDEX \`_digital_systems_page_v_autosave_idx\` ON \`_digital_systems_page_v\` (\`autosave\`);`)
  await db.run(sql`CREATE TABLE \`edge_ai_page_capabilities\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`description\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`edge_ai_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`edge_ai_page_capabilities_order_idx\` ON \`edge_ai_page_capabilities\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`edge_ai_page_capabilities_parent_id_idx\` ON \`edge_ai_page_capabilities\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`edge_ai_page_use_cases\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`category\` text,
  	\`title\` text,
  	\`description\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`edge_ai_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`edge_ai_page_use_cases_order_idx\` ON \`edge_ai_page_use_cases\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`edge_ai_page_use_cases_parent_id_idx\` ON \`edge_ai_page_use_cases\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`edge_ai_page_specs\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`value\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`edge_ai_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`edge_ai_page_specs_order_idx\` ON \`edge_ai_page_specs\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`edge_ai_page_specs_parent_id_idx\` ON \`edge_ai_page_specs\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`edge_ai_page_how_it_works\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`description\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`edge_ai_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`edge_ai_page_how_it_works_order_idx\` ON \`edge_ai_page_how_it_works\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`edge_ai_page_how_it_works_parent_id_idx\` ON \`edge_ai_page_how_it_works\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`edge_ai_page_privacy_features\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`description\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`edge_ai_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`edge_ai_page_privacy_features_order_idx\` ON \`edge_ai_page_privacy_features\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`edge_ai_page_privacy_features_parent_id_idx\` ON \`edge_ai_page_privacy_features\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`edge_ai_page\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`hero_eyebrow\` text,
  	\`hero_headline\` text,
  	\`hero_headline_accent\` text,
  	\`hero_description\` text,
  	\`hero_cta_primary_text\` text,
  	\`hero_cta_primary_href\` text,
  	\`hero_cta_secondary_text\` text,
  	\`hero_cta_secondary_href\` text,
  	\`cta_headline\` text,
  	\`cta_description\` text,
  	\`cta_primary_cta_text\` text,
  	\`cta_primary_cta_href\` text,
  	\`cta_secondary_cta_text\` text,
  	\`cta_secondary_cta_href\` text,
  	\`_status\` text DEFAULT 'draft',
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`CREATE INDEX \`edge_ai_page__status_idx\` ON \`edge_ai_page\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`_edge_ai_page_v_version_capabilities\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`description\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_edge_ai_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_edge_ai_page_v_version_capabilities_order_idx\` ON \`_edge_ai_page_v_version_capabilities\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_edge_ai_page_v_version_capabilities_parent_id_idx\` ON \`_edge_ai_page_v_version_capabilities\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_edge_ai_page_v_version_use_cases\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`category\` text,
  	\`title\` text,
  	\`description\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_edge_ai_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_edge_ai_page_v_version_use_cases_order_idx\` ON \`_edge_ai_page_v_version_use_cases\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_edge_ai_page_v_version_use_cases_parent_id_idx\` ON \`_edge_ai_page_v_version_use_cases\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_edge_ai_page_v_version_specs\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`value\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_edge_ai_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_edge_ai_page_v_version_specs_order_idx\` ON \`_edge_ai_page_v_version_specs\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_edge_ai_page_v_version_specs_parent_id_idx\` ON \`_edge_ai_page_v_version_specs\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_edge_ai_page_v_version_how_it_works\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`description\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_edge_ai_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_edge_ai_page_v_version_how_it_works_order_idx\` ON \`_edge_ai_page_v_version_how_it_works\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_edge_ai_page_v_version_how_it_works_parent_id_idx\` ON \`_edge_ai_page_v_version_how_it_works\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_edge_ai_page_v_version_privacy_features\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`description\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_edge_ai_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_edge_ai_page_v_version_privacy_features_order_idx\` ON \`_edge_ai_page_v_version_privacy_features\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_edge_ai_page_v_version_privacy_features_parent_id_idx\` ON \`_edge_ai_page_v_version_privacy_features\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_edge_ai_page_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`version_hero_eyebrow\` text,
  	\`version_hero_headline\` text,
  	\`version_hero_headline_accent\` text,
  	\`version_hero_description\` text,
  	\`version_hero_cta_primary_text\` text,
  	\`version_hero_cta_primary_href\` text,
  	\`version_hero_cta_secondary_text\` text,
  	\`version_hero_cta_secondary_href\` text,
  	\`version_cta_headline\` text,
  	\`version_cta_description\` text,
  	\`version_cta_primary_cta_text\` text,
  	\`version_cta_primary_cta_href\` text,
  	\`version_cta_secondary_cta_text\` text,
  	\`version_cta_secondary_cta_href\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	\`autosave\` integer
  );
  `)
  await db.run(sql`CREATE INDEX \`_edge_ai_page_v_version_version__status_idx\` ON \`_edge_ai_page_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_edge_ai_page_v_created_at_idx\` ON \`_edge_ai_page_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_edge_ai_page_v_updated_at_idx\` ON \`_edge_ai_page_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_edge_ai_page_v_latest_idx\` ON \`_edge_ai_page_v\` (\`latest\`);`)
  await db.run(sql`CREATE INDEX \`_edge_ai_page_v_autosave_idx\` ON \`_edge_ai_page_v\` (\`autosave\`);`)
  await db.run(sql`CREATE TABLE \`stack_page_quick_stats\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`value\` text,
  	\`label\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`stack_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`stack_page_quick_stats_order_idx\` ON \`stack_page_quick_stats\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`stack_page_quick_stats_parent_id_idx\` ON \`stack_page_quick_stats\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`stack_page_layers_products\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`name\` text,
  	\`desc\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`stack_page_layers\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`stack_page_layers_products_order_idx\` ON \`stack_page_layers_products\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`stack_page_layers_products_parent_id_idx\` ON \`stack_page_layers_products\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`stack_page_layers\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`number\` text,
  	\`name\` text,
  	\`tagline\` text,
  	\`description\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`stack_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`stack_page_layers_order_idx\` ON \`stack_page_layers\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`stack_page_layers_parent_id_idx\` ON \`stack_page_layers\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`stack_page_design_principles\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`description\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`stack_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`stack_page_design_principles_order_idx\` ON \`stack_page_design_principles\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`stack_page_design_principles_parent_id_idx\` ON \`stack_page_design_principles\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`stack_page_layer_integration\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`step\` numeric,
  	\`title\` text,
  	\`description\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`stack_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`stack_page_layer_integration_order_idx\` ON \`stack_page_layer_integration\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`stack_page_layer_integration_parent_id_idx\` ON \`stack_page_layer_integration\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`stack_page\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`hero_eyebrow\` text,
  	\`hero_headline\` text,
  	\`hero_headline_accent\` text,
  	\`hero_description\` text,
  	\`cta_headline\` text,
  	\`cta_description\` text,
  	\`cta_primary_cta_text\` text,
  	\`cta_primary_cta_href\` text,
  	\`cta_secondary_cta_text\` text,
  	\`cta_secondary_cta_href\` text,
  	\`_status\` text DEFAULT 'draft',
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`CREATE INDEX \`stack_page__status_idx\` ON \`stack_page\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`_stack_page_v_version_quick_stats\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`value\` text,
  	\`label\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_stack_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_stack_page_v_version_quick_stats_order_idx\` ON \`_stack_page_v_version_quick_stats\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_stack_page_v_version_quick_stats_parent_id_idx\` ON \`_stack_page_v_version_quick_stats\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_stack_page_v_version_layers_products\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text,
  	\`desc\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_stack_page_v_version_layers\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_stack_page_v_version_layers_products_order_idx\` ON \`_stack_page_v_version_layers_products\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_stack_page_v_version_layers_products_parent_id_idx\` ON \`_stack_page_v_version_layers_products\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_stack_page_v_version_layers\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`number\` text,
  	\`name\` text,
  	\`tagline\` text,
  	\`description\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_stack_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_stack_page_v_version_layers_order_idx\` ON \`_stack_page_v_version_layers\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_stack_page_v_version_layers_parent_id_idx\` ON \`_stack_page_v_version_layers\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_stack_page_v_version_design_principles\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`description\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_stack_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_stack_page_v_version_design_principles_order_idx\` ON \`_stack_page_v_version_design_principles\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_stack_page_v_version_design_principles_parent_id_idx\` ON \`_stack_page_v_version_design_principles\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_stack_page_v_version_layer_integration\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`step\` numeric,
  	\`title\` text,
  	\`description\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_stack_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_stack_page_v_version_layer_integration_order_idx\` ON \`_stack_page_v_version_layer_integration\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_stack_page_v_version_layer_integration_parent_id_idx\` ON \`_stack_page_v_version_layer_integration\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_stack_page_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`version_hero_eyebrow\` text,
  	\`version_hero_headline\` text,
  	\`version_hero_headline_accent\` text,
  	\`version_hero_description\` text,
  	\`version_cta_headline\` text,
  	\`version_cta_description\` text,
  	\`version_cta_primary_cta_text\` text,
  	\`version_cta_primary_cta_href\` text,
  	\`version_cta_secondary_cta_text\` text,
  	\`version_cta_secondary_cta_href\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	\`autosave\` integer
  );
  `)
  await db.run(sql`CREATE INDEX \`_stack_page_v_version_version__status_idx\` ON \`_stack_page_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_stack_page_v_created_at_idx\` ON \`_stack_page_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_stack_page_v_updated_at_idx\` ON \`_stack_page_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_stack_page_v_latest_idx\` ON \`_stack_page_v\` (\`latest\`);`)
  await db.run(sql`CREATE INDEX \`_stack_page_v_autosave_idx\` ON \`_stack_page_v\` (\`autosave\`);`)
  await db.run(sql`CREATE TABLE \`solutions_overview_industry_cards_features\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`solutions_overview_industry_cards\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`solutions_overview_industry_cards_features_order_idx\` ON \`solutions_overview_industry_cards_features\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`solutions_overview_industry_cards_features_parent_id_idx\` ON \`solutions_overview_industry_cards_features\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`solutions_overview_industry_cards\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`description\` text,
  	\`href\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`solutions_overview\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`solutions_overview_industry_cards_order_idx\` ON \`solutions_overview_industry_cards\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`solutions_overview_industry_cards_parent_id_idx\` ON \`solutions_overview_industry_cards\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`solutions_overview_outcome_cards\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`description\` text,
  	\`href\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`solutions_overview\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`solutions_overview_outcome_cards_order_idx\` ON \`solutions_overview_outcome_cards\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`solutions_overview_outcome_cards_parent_id_idx\` ON \`solutions_overview_outcome_cards\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`solutions_overview\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`hero_eyebrow\` text,
  	\`hero_headline\` text,
  	\`hero_headline_accent\` text,
  	\`hero_description\` text,
  	\`cta_headline\` text,
  	\`cta_description\` text,
  	\`cta_primary_cta_text\` text,
  	\`cta_primary_cta_href\` text,
  	\`cta_secondary_cta_text\` text,
  	\`cta_secondary_cta_href\` text,
  	\`_status\` text DEFAULT 'draft',
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`CREATE INDEX \`solutions_overview__status_idx\` ON \`solutions_overview\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`_solutions_overview_v_version_industry_cards_features\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`text\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_solutions_overview_v_version_industry_cards\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_solutions_overview_v_version_industry_cards_features_order_idx\` ON \`_solutions_overview_v_version_industry_cards_features\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_solutions_overview_v_version_industry_cards_features_parent_id_idx\` ON \`_solutions_overview_v_version_industry_cards_features\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_solutions_overview_v_version_industry_cards\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`description\` text,
  	\`href\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_solutions_overview_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_solutions_overview_v_version_industry_cards_order_idx\` ON \`_solutions_overview_v_version_industry_cards\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_solutions_overview_v_version_industry_cards_parent_id_idx\` ON \`_solutions_overview_v_version_industry_cards\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_solutions_overview_v_version_outcome_cards\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`description\` text,
  	\`href\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_solutions_overview_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_solutions_overview_v_version_outcome_cards_order_idx\` ON \`_solutions_overview_v_version_outcome_cards\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_solutions_overview_v_version_outcome_cards_parent_id_idx\` ON \`_solutions_overview_v_version_outcome_cards\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_solutions_overview_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`version_hero_eyebrow\` text,
  	\`version_hero_headline\` text,
  	\`version_hero_headline_accent\` text,
  	\`version_hero_description\` text,
  	\`version_cta_headline\` text,
  	\`version_cta_description\` text,
  	\`version_cta_primary_cta_text\` text,
  	\`version_cta_primary_cta_href\` text,
  	\`version_cta_secondary_cta_text\` text,
  	\`version_cta_secondary_cta_href\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	\`autosave\` integer
  );
  `)
  await db.run(sql`CREATE INDEX \`_solutions_overview_v_version_version__status_idx\` ON \`_solutions_overview_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_solutions_overview_v_created_at_idx\` ON \`_solutions_overview_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_solutions_overview_v_updated_at_idx\` ON \`_solutions_overview_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_solutions_overview_v_latest_idx\` ON \`_solutions_overview_v\` (\`latest\`);`)
  await db.run(sql`CREATE INDEX \`_solutions_overview_v_autosave_idx\` ON \`_solutions_overview_v\` (\`autosave\`);`)
  await db.run(sql`CREATE TABLE \`impact_overview_stats\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`value\` text,
  	\`label\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`impact_overview\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`impact_overview_stats_order_idx\` ON \`impact_overview_stats\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`impact_overview_stats_parent_id_idx\` ON \`impact_overview_stats\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`impact_overview_nav_cards\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`description\` text,
  	\`href\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`impact_overview\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`impact_overview_nav_cards_order_idx\` ON \`impact_overview_nav_cards\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`impact_overview_nav_cards_parent_id_idx\` ON \`impact_overview_nav_cards\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`impact_overview_regional_highlights\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`region\` text,
  	\`description\` text,
  	\`story\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`impact_overview\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`impact_overview_regional_highlights_order_idx\` ON \`impact_overview_regional_highlights\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`impact_overview_regional_highlights_parent_id_idx\` ON \`impact_overview_regional_highlights\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`impact_overview\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`hero_eyebrow\` text,
  	\`hero_headline\` text,
  	\`hero_headline_accent\` text,
  	\`hero_description\` text,
  	\`testimonial_quote_text\` text,
  	\`testimonial_quote_attribution\` text,
  	\`testimonial_quote_role\` text,
  	\`cta_headline\` text,
  	\`cta_description\` text,
  	\`cta_primary_cta_text\` text,
  	\`cta_primary_cta_href\` text,
  	\`cta_secondary_cta_text\` text,
  	\`cta_secondary_cta_href\` text,
  	\`_status\` text DEFAULT 'draft',
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`CREATE INDEX \`impact_overview__status_idx\` ON \`impact_overview\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`_impact_overview_v_version_stats\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`value\` text,
  	\`label\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_impact_overview_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_impact_overview_v_version_stats_order_idx\` ON \`_impact_overview_v_version_stats\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_impact_overview_v_version_stats_parent_id_idx\` ON \`_impact_overview_v_version_stats\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_impact_overview_v_version_nav_cards\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`description\` text,
  	\`href\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_impact_overview_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_impact_overview_v_version_nav_cards_order_idx\` ON \`_impact_overview_v_version_nav_cards\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_impact_overview_v_version_nav_cards_parent_id_idx\` ON \`_impact_overview_v_version_nav_cards\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_impact_overview_v_version_regional_highlights\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`region\` text,
  	\`description\` text,
  	\`story\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_impact_overview_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_impact_overview_v_version_regional_highlights_order_idx\` ON \`_impact_overview_v_version_regional_highlights\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_impact_overview_v_version_regional_highlights_parent_id_idx\` ON \`_impact_overview_v_version_regional_highlights\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_impact_overview_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`version_hero_eyebrow\` text,
  	\`version_hero_headline\` text,
  	\`version_hero_headline_accent\` text,
  	\`version_hero_description\` text,
  	\`version_testimonial_quote_text\` text,
  	\`version_testimonial_quote_attribution\` text,
  	\`version_testimonial_quote_role\` text,
  	\`version_cta_headline\` text,
  	\`version_cta_description\` text,
  	\`version_cta_primary_cta_text\` text,
  	\`version_cta_primary_cta_href\` text,
  	\`version_cta_secondary_cta_text\` text,
  	\`version_cta_secondary_cta_href\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	\`autosave\` integer
  );
  `)
  await db.run(sql`CREATE INDEX \`_impact_overview_v_version_version__status_idx\` ON \`_impact_overview_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_impact_overview_v_created_at_idx\` ON \`_impact_overview_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_impact_overview_v_updated_at_idx\` ON \`_impact_overview_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_impact_overview_v_latest_idx\` ON \`_impact_overview_v\` (\`latest\`);`)
  await db.run(sql`CREATE INDEX \`_impact_overview_v_autosave_idx\` ON \`_impact_overview_v\` (\`autosave\`);`)
  await db.run(sql`CREATE TABLE \`case_studies_page_category_filters\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`case_studies_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`case_studies_page_category_filters_order_idx\` ON \`case_studies_page_category_filters\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`case_studies_page_category_filters_parent_id_idx\` ON \`case_studies_page_category_filters\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`case_studies_page\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`hero_eyebrow\` text,
  	\`hero_headline\` text,
  	\`hero_headline_accent\` text,
  	\`hero_description\` text,
  	\`featured_title\` text,
  	\`all_title\` text,
  	\`_status\` text DEFAULT 'draft',
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`CREATE INDEX \`case_studies_page__status_idx\` ON \`case_studies_page\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`_case_studies_page_v_version_category_filters\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`text\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_case_studies_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_case_studies_page_v_version_category_filters_order_idx\` ON \`_case_studies_page_v_version_category_filters\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_case_studies_page_v_version_category_filters_parent_id_idx\` ON \`_case_studies_page_v_version_category_filters\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_case_studies_page_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`version_hero_eyebrow\` text,
  	\`version_hero_headline\` text,
  	\`version_hero_headline_accent\` text,
  	\`version_hero_description\` text,
  	\`version_featured_title\` text,
  	\`version_all_title\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	\`autosave\` integer
  );
  `)
  await db.run(sql`CREATE INDEX \`_case_studies_page_v_version_version__status_idx\` ON \`_case_studies_page_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_case_studies_page_v_created_at_idx\` ON \`_case_studies_page_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_case_studies_page_v_updated_at_idx\` ON \`_case_studies_page_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_case_studies_page_v_latest_idx\` ON \`_case_studies_page_v\` (\`latest\`);`)
  await db.run(sql`CREATE INDEX \`_case_studies_page_v_autosave_idx\` ON \`_case_studies_page_v\` (\`autosave\`);`)
  await db.run(sql`CREATE TABLE \`metrics_page_primary_metrics\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`value\` text,
  	\`label\` text,
  	\`description\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`metrics_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`metrics_page_primary_metrics_order_idx\` ON \`metrics_page_primary_metrics\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`metrics_page_primary_metrics_parent_id_idx\` ON \`metrics_page_primary_metrics\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`metrics_page_secondary_metrics\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`value\` text,
  	\`label\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`metrics_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`metrics_page_secondary_metrics_order_idx\` ON \`metrics_page_secondary_metrics\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`metrics_page_secondary_metrics_parent_id_idx\` ON \`metrics_page_secondary_metrics\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`metrics_page_impact_stories\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`description\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`metrics_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`metrics_page_impact_stories_order_idx\` ON \`metrics_page_impact_stories\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`metrics_page_impact_stories_parent_id_idx\` ON \`metrics_page_impact_stories\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`metrics_page\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`hero_eyebrow\` text,
  	\`hero_headline\` text,
  	\`hero_headline_accent\` text,
  	\`hero_description\` text,
  	\`methodology_headline\` text,
  	\`methodology_description\` text,
  	\`cta_headline\` text,
  	\`cta_description\` text,
  	\`cta_primary_cta_text\` text,
  	\`cta_primary_cta_href\` text,
  	\`cta_secondary_cta_text\` text,
  	\`cta_secondary_cta_href\` text,
  	\`_status\` text DEFAULT 'draft',
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`CREATE INDEX \`metrics_page__status_idx\` ON \`metrics_page\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`_metrics_page_v_version_primary_metrics\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`value\` text,
  	\`label\` text,
  	\`description\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_metrics_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_metrics_page_v_version_primary_metrics_order_idx\` ON \`_metrics_page_v_version_primary_metrics\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_metrics_page_v_version_primary_metrics_parent_id_idx\` ON \`_metrics_page_v_version_primary_metrics\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_metrics_page_v_version_secondary_metrics\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`value\` text,
  	\`label\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_metrics_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_metrics_page_v_version_secondary_metrics_order_idx\` ON \`_metrics_page_v_version_secondary_metrics\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_metrics_page_v_version_secondary_metrics_parent_id_idx\` ON \`_metrics_page_v_version_secondary_metrics\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_metrics_page_v_version_impact_stories\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`description\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_metrics_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_metrics_page_v_version_impact_stories_order_idx\` ON \`_metrics_page_v_version_impact_stories\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_metrics_page_v_version_impact_stories_parent_id_idx\` ON \`_metrics_page_v_version_impact_stories\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_metrics_page_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`version_hero_eyebrow\` text,
  	\`version_hero_headline\` text,
  	\`version_hero_headline_accent\` text,
  	\`version_hero_description\` text,
  	\`version_methodology_headline\` text,
  	\`version_methodology_description\` text,
  	\`version_cta_headline\` text,
  	\`version_cta_description\` text,
  	\`version_cta_primary_cta_text\` text,
  	\`version_cta_primary_cta_href\` text,
  	\`version_cta_secondary_cta_text\` text,
  	\`version_cta_secondary_cta_href\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	\`autosave\` integer
  );
  `)
  await db.run(sql`CREATE INDEX \`_metrics_page_v_version_version__status_idx\` ON \`_metrics_page_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_metrics_page_v_created_at_idx\` ON \`_metrics_page_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_metrics_page_v_updated_at_idx\` ON \`_metrics_page_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_metrics_page_v_latest_idx\` ON \`_metrics_page_v\` (\`latest\`);`)
  await db.run(sql`CREATE INDEX \`_metrics_page_v_autosave_idx\` ON \`_metrics_page_v\` (\`autosave\`);`)
  await db.run(sql`CREATE TABLE \`network_map_page_live_stats\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`value\` numeric,
  	\`suffix\` text,
  	\`label\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`network_map_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`network_map_page_live_stats_order_idx\` ON \`network_map_page_live_stats\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`network_map_page_live_stats_parent_id_idx\` ON \`network_map_page_live_stats\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`network_map_page_regional_distribution\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`region\` text,
  	\`nodes\` text,
  	\`growth\` text,
  	\`description\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`network_map_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`network_map_page_regional_distribution_order_idx\` ON \`network_map_page_regional_distribution\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`network_map_page_regional_distribution_parent_id_idx\` ON \`network_map_page_regional_distribution\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`network_map_page_recent_deployments\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`location\` text,
  	\`nodes\` text,
  	\`status\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`network_map_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`network_map_page_recent_deployments_order_idx\` ON \`network_map_page_recent_deployments\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`network_map_page_recent_deployments_parent_id_idx\` ON \`network_map_page_recent_deployments\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`network_map_page_network_architecture\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`description\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`network_map_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`network_map_page_network_architecture_order_idx\` ON \`network_map_page_network_architecture\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`network_map_page_network_architecture_parent_id_idx\` ON \`network_map_page_network_architecture\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`network_map_page\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`hero_eyebrow\` text,
  	\`hero_headline\` text,
  	\`hero_headline_accent\` text,
  	\`hero_description\` text,
  	\`cta_headline\` text,
  	\`cta_description\` text,
  	\`cta_primary_cta_text\` text,
  	\`cta_primary_cta_href\` text,
  	\`cta_secondary_cta_text\` text,
  	\`cta_secondary_cta_href\` text,
  	\`_status\` text DEFAULT 'draft',
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`CREATE INDEX \`network_map_page__status_idx\` ON \`network_map_page\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`_network_map_page_v_version_live_stats\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`value\` numeric,
  	\`suffix\` text,
  	\`label\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_network_map_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_network_map_page_v_version_live_stats_order_idx\` ON \`_network_map_page_v_version_live_stats\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_network_map_page_v_version_live_stats_parent_id_idx\` ON \`_network_map_page_v_version_live_stats\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_network_map_page_v_version_regional_distribution\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`region\` text,
  	\`nodes\` text,
  	\`growth\` text,
  	\`description\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_network_map_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_network_map_page_v_version_regional_distribution_order_idx\` ON \`_network_map_page_v_version_regional_distribution\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_network_map_page_v_version_regional_distribution_parent_id_idx\` ON \`_network_map_page_v_version_regional_distribution\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_network_map_page_v_version_recent_deployments\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`location\` text,
  	\`nodes\` text,
  	\`status\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_network_map_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_network_map_page_v_version_recent_deployments_order_idx\` ON \`_network_map_page_v_version_recent_deployments\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_network_map_page_v_version_recent_deployments_parent_id_idx\` ON \`_network_map_page_v_version_recent_deployments\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_network_map_page_v_version_network_architecture\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`description\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_network_map_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_network_map_page_v_version_network_architecture_order_idx\` ON \`_network_map_page_v_version_network_architecture\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_network_map_page_v_version_network_architecture_parent_id_idx\` ON \`_network_map_page_v_version_network_architecture\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_network_map_page_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`version_hero_eyebrow\` text,
  	\`version_hero_headline\` text,
  	\`version_hero_headline_accent\` text,
  	\`version_hero_description\` text,
  	\`version_cta_headline\` text,
  	\`version_cta_description\` text,
  	\`version_cta_primary_cta_text\` text,
  	\`version_cta_primary_cta_href\` text,
  	\`version_cta_secondary_cta_text\` text,
  	\`version_cta_secondary_cta_href\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	\`autosave\` integer
  );
  `)
  await db.run(sql`CREATE INDEX \`_network_map_page_v_version_version__status_idx\` ON \`_network_map_page_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_network_map_page_v_created_at_idx\` ON \`_network_map_page_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_network_map_page_v_updated_at_idx\` ON \`_network_map_page_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_network_map_page_v_latest_idx\` ON \`_network_map_page_v\` (\`latest\`);`)
  await db.run(sql`CREATE INDEX \`_network_map_page_v_autosave_idx\` ON \`_network_map_page_v\` (\`autosave\`);`)
  await db.run(sql`CREATE TABLE \`last_mile_page_stats\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`value\` text,
  	\`label\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`last_mile_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`last_mile_page_stats_order_idx\` ON \`last_mile_page_stats\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`last_mile_page_stats_parent_id_idx\` ON \`last_mile_page_stats\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`last_mile_page_topic_filters\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`last_mile_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`last_mile_page_topic_filters_order_idx\` ON \`last_mile_page_topic_filters\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`last_mile_page_topic_filters_parent_id_idx\` ON \`last_mile_page_topic_filters\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`last_mile_page\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`hero_eyebrow\` text,
  	\`hero_headline\` text,
  	\`hero_headline_accent\` text,
  	\`hero_description\` text,
  	\`about_section_headline\` text,
  	\`about_section_description\` text,
  	\`_status\` text DEFAULT 'draft',
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`CREATE INDEX \`last_mile_page__status_idx\` ON \`last_mile_page\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`_last_mile_page_v_version_stats\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`value\` text,
  	\`label\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_last_mile_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_last_mile_page_v_version_stats_order_idx\` ON \`_last_mile_page_v_version_stats\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_last_mile_page_v_version_stats_parent_id_idx\` ON \`_last_mile_page_v_version_stats\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_last_mile_page_v_version_topic_filters\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`text\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_last_mile_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_last_mile_page_v_version_topic_filters_order_idx\` ON \`_last_mile_page_v_version_topic_filters\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_last_mile_page_v_version_topic_filters_parent_id_idx\` ON \`_last_mile_page_v_version_topic_filters\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_last_mile_page_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`version_hero_eyebrow\` text,
  	\`version_hero_headline\` text,
  	\`version_hero_headline_accent\` text,
  	\`version_hero_description\` text,
  	\`version_about_section_headline\` text,
  	\`version_about_section_description\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	\`autosave\` integer
  );
  `)
  await db.run(sql`CREATE INDEX \`_last_mile_page_v_version_version__status_idx\` ON \`_last_mile_page_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_last_mile_page_v_created_at_idx\` ON \`_last_mile_page_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_last_mile_page_v_updated_at_idx\` ON \`_last_mile_page_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_last_mile_page_v_latest_idx\` ON \`_last_mile_page_v\` (\`latest\`);`)
  await db.run(sql`CREATE INDEX \`_last_mile_page_v_autosave_idx\` ON \`_last_mile_page_v\` (\`autosave\`);`)
  await db.run(sql`CREATE TABLE \`resources_overview_resource_sections_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`resources_overview_resource_sections\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`resources_overview_resource_sections_items_order_idx\` ON \`resources_overview_resource_sections_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`resources_overview_resource_sections_items_parent_id_idx\` ON \`resources_overview_resource_sections_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`resources_overview_resource_sections\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`description\` text,
  	\`href\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`resources_overview\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`resources_overview_resource_sections_order_idx\` ON \`resources_overview_resource_sections\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`resources_overview_resource_sections_parent_id_idx\` ON \`resources_overview_resource_sections\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`resources_overview_quick_links\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`description\` text,
  	\`href\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`resources_overview\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`resources_overview_quick_links_order_idx\` ON \`resources_overview_quick_links\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`resources_overview_quick_links_parent_id_idx\` ON \`resources_overview_quick_links\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`resources_overview\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`hero_eyebrow\` text,
  	\`hero_headline\` text,
  	\`hero_headline_accent\` text,
  	\`hero_description\` text,
  	\`newsletter_headline\` text,
  	\`newsletter_description\` text,
  	\`_status\` text DEFAULT 'draft',
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`CREATE INDEX \`resources_overview__status_idx\` ON \`resources_overview\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`_resources_overview_v_version_resource_sections_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`text\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_resources_overview_v_version_resource_sections\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_resources_overview_v_version_resource_sections_items_order_idx\` ON \`_resources_overview_v_version_resource_sections_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_resources_overview_v_version_resource_sections_items_parent_id_idx\` ON \`_resources_overview_v_version_resource_sections_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_resources_overview_v_version_resource_sections\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`description\` text,
  	\`href\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_resources_overview_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_resources_overview_v_version_resource_sections_order_idx\` ON \`_resources_overview_v_version_resource_sections\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_resources_overview_v_version_resource_sections_parent_id_idx\` ON \`_resources_overview_v_version_resource_sections\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_resources_overview_v_version_quick_links\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`description\` text,
  	\`href\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_resources_overview_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_resources_overview_v_version_quick_links_order_idx\` ON \`_resources_overview_v_version_quick_links\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_resources_overview_v_version_quick_links_parent_id_idx\` ON \`_resources_overview_v_version_quick_links\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_resources_overview_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`version_hero_eyebrow\` text,
  	\`version_hero_headline\` text,
  	\`version_hero_headline_accent\` text,
  	\`version_hero_description\` text,
  	\`version_newsletter_headline\` text,
  	\`version_newsletter_description\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	\`autosave\` integer
  );
  `)
  await db.run(sql`CREATE INDEX \`_resources_overview_v_version_version__status_idx\` ON \`_resources_overview_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_resources_overview_v_created_at_idx\` ON \`_resources_overview_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_resources_overview_v_updated_at_idx\` ON \`_resources_overview_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_resources_overview_v_latest_idx\` ON \`_resources_overview_v\` (\`latest\`);`)
  await db.run(sql`CREATE INDEX \`_resources_overview_v_autosave_idx\` ON \`_resources_overview_v\` (\`autosave\`);`)
  await db.run(sql`CREATE TABLE \`trust_center_page_security_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`description\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`trust_center_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`trust_center_page_security_items_order_idx\` ON \`trust_center_page_security_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`trust_center_page_security_items_parent_id_idx\` ON \`trust_center_page_security_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`trust_center_page_compliance_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`description\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`trust_center_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`trust_center_page_compliance_items_order_idx\` ON \`trust_center_page_compliance_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`trust_center_page_compliance_items_parent_id_idx\` ON \`trust_center_page_compliance_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`trust_center_page_certifications\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`trust_center_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`trust_center_page_certifications_order_idx\` ON \`trust_center_page_certifications\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`trust_center_page_certifications_parent_id_idx\` ON \`trust_center_page_certifications\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`trust_center_page_documents\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`description\` text,
  	\`access\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`trust_center_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`trust_center_page_documents_order_idx\` ON \`trust_center_page_documents\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`trust_center_page_documents_parent_id_idx\` ON \`trust_center_page_documents\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`trust_center_page\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`hero_eyebrow\` text,
  	\`hero_headline\` text,
  	\`hero_headline_accent\` text,
  	\`hero_description\` text,
  	\`incident_response_response_time\` text,
  	\`incident_response_monitoring\` text,
  	\`incident_response_notification\` text,
  	\`cta_headline\` text,
  	\`cta_description\` text,
  	\`cta_primary_cta_text\` text,
  	\`cta_primary_cta_href\` text,
  	\`_status\` text DEFAULT 'draft',
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`CREATE INDEX \`trust_center_page__status_idx\` ON \`trust_center_page\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`_trust_center_page_v_version_security_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`description\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_trust_center_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_trust_center_page_v_version_security_items_order_idx\` ON \`_trust_center_page_v_version_security_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_trust_center_page_v_version_security_items_parent_id_idx\` ON \`_trust_center_page_v_version_security_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_trust_center_page_v_version_compliance_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`description\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_trust_center_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_trust_center_page_v_version_compliance_items_order_idx\` ON \`_trust_center_page_v_version_compliance_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_trust_center_page_v_version_compliance_items_parent_id_idx\` ON \`_trust_center_page_v_version_compliance_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_trust_center_page_v_version_certifications\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`text\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_trust_center_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_trust_center_page_v_version_certifications_order_idx\` ON \`_trust_center_page_v_version_certifications\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_trust_center_page_v_version_certifications_parent_id_idx\` ON \`_trust_center_page_v_version_certifications\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_trust_center_page_v_version_documents\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`description\` text,
  	\`access\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_trust_center_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_trust_center_page_v_version_documents_order_idx\` ON \`_trust_center_page_v_version_documents\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_trust_center_page_v_version_documents_parent_id_idx\` ON \`_trust_center_page_v_version_documents\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_trust_center_page_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`version_hero_eyebrow\` text,
  	\`version_hero_headline\` text,
  	\`version_hero_headline_accent\` text,
  	\`version_hero_description\` text,
  	\`version_incident_response_response_time\` text,
  	\`version_incident_response_monitoring\` text,
  	\`version_incident_response_notification\` text,
  	\`version_cta_headline\` text,
  	\`version_cta_description\` text,
  	\`version_cta_primary_cta_text\` text,
  	\`version_cta_primary_cta_href\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	\`autosave\` integer
  );
  `)
  await db.run(sql`CREATE INDEX \`_trust_center_page_v_version_version__status_idx\` ON \`_trust_center_page_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_trust_center_page_v_created_at_idx\` ON \`_trust_center_page_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_trust_center_page_v_updated_at_idx\` ON \`_trust_center_page_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_trust_center_page_v_latest_idx\` ON \`_trust_center_page_v\` (\`latest\`);`)
  await db.run(sql`CREATE INDEX \`_trust_center_page_v_autosave_idx\` ON \`_trust_center_page_v\` (\`autosave\`);`)
  await db.run(sql`CREATE TABLE \`newsroom_page_press_kit_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`description\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`newsroom_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`newsroom_page_press_kit_items_order_idx\` ON \`newsroom_page_press_kit_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`newsroom_page_press_kit_items_parent_id_idx\` ON \`newsroom_page_press_kit_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`newsroom_page\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`hero_eyebrow\` text,
  	\`hero_headline\` text,
  	\`hero_headline_accent\` text,
  	\`hero_description\` text,
  	\`media_contact_name\` text,
  	\`media_contact_role\` text,
  	\`media_contact_email\` text,
  	\`cta_headline\` text,
  	\`cta_description\` text,
  	\`cta_cta_text\` text,
  	\`cta_cta_href\` text,
  	\`_status\` text DEFAULT 'draft',
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`CREATE INDEX \`newsroom_page__status_idx\` ON \`newsroom_page\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`_newsroom_page_v_version_press_kit_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`description\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_newsroom_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_newsroom_page_v_version_press_kit_items_order_idx\` ON \`_newsroom_page_v_version_press_kit_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_newsroom_page_v_version_press_kit_items_parent_id_idx\` ON \`_newsroom_page_v_version_press_kit_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_newsroom_page_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`version_hero_eyebrow\` text,
  	\`version_hero_headline\` text,
  	\`version_hero_headline_accent\` text,
  	\`version_hero_description\` text,
  	\`version_media_contact_name\` text,
  	\`version_media_contact_role\` text,
  	\`version_media_contact_email\` text,
  	\`version_cta_headline\` text,
  	\`version_cta_description\` text,
  	\`version_cta_cta_text\` text,
  	\`version_cta_cta_href\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	\`autosave\` integer
  );
  `)
  await db.run(sql`CREATE INDEX \`_newsroom_page_v_version_version__status_idx\` ON \`_newsroom_page_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_newsroom_page_v_created_at_idx\` ON \`_newsroom_page_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_newsroom_page_v_updated_at_idx\` ON \`_newsroom_page_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_newsroom_page_v_latest_idx\` ON \`_newsroom_page_v\` (\`latest\`);`)
  await db.run(sql`CREATE INDEX \`_newsroom_page_v_autosave_idx\` ON \`_newsroom_page_v\` (\`autosave\`);`)
  await db.run(sql`CREATE TABLE \`docs_page_doc_categories_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`docs_page_doc_categories\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`docs_page_doc_categories_items_order_idx\` ON \`docs_page_doc_categories_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`docs_page_doc_categories_items_parent_id_idx\` ON \`docs_page_doc_categories_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`docs_page_doc_categories\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`description\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`docs_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`docs_page_doc_categories_order_idx\` ON \`docs_page_doc_categories\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`docs_page_doc_categories_parent_id_idx\` ON \`docs_page_doc_categories\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`docs_page_sdks\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`language\` text,
  	\`install_command\` text,
  	\`badge\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`docs_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`docs_page_sdks_order_idx\` ON \`docs_page_sdks\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`docs_page_sdks_parent_id_idx\` ON \`docs_page_sdks\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`docs_page_support_channels\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`description\` text,
  	\`href\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`docs_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`docs_page_support_channels_order_idx\` ON \`docs_page_support_channels\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`docs_page_support_channels_parent_id_idx\` ON \`docs_page_support_channels\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`docs_page\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`hero_eyebrow\` text,
  	\`hero_headline\` text,
  	\`hero_headline_accent\` text,
  	\`hero_description\` text,
  	\`cta_headline\` text,
  	\`cta_description\` text,
  	\`cta_primary_cta_text\` text,
  	\`cta_primary_cta_href\` text,
  	\`cta_secondary_cta_text\` text,
  	\`cta_secondary_cta_href\` text,
  	\`_status\` text DEFAULT 'draft',
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`CREATE INDEX \`docs_page__status_idx\` ON \`docs_page\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`_docs_page_v_version_doc_categories_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`text\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_docs_page_v_version_doc_categories\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_docs_page_v_version_doc_categories_items_order_idx\` ON \`_docs_page_v_version_doc_categories_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_docs_page_v_version_doc_categories_items_parent_id_idx\` ON \`_docs_page_v_version_doc_categories_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_docs_page_v_version_doc_categories\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`description\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_docs_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_docs_page_v_version_doc_categories_order_idx\` ON \`_docs_page_v_version_doc_categories\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_docs_page_v_version_doc_categories_parent_id_idx\` ON \`_docs_page_v_version_doc_categories\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_docs_page_v_version_sdks\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`language\` text,
  	\`install_command\` text,
  	\`badge\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_docs_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_docs_page_v_version_sdks_order_idx\` ON \`_docs_page_v_version_sdks\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_docs_page_v_version_sdks_parent_id_idx\` ON \`_docs_page_v_version_sdks\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_docs_page_v_version_support_channels\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`description\` text,
  	\`href\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_docs_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_docs_page_v_version_support_channels_order_idx\` ON \`_docs_page_v_version_support_channels\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_docs_page_v_version_support_channels_parent_id_idx\` ON \`_docs_page_v_version_support_channels\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_docs_page_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`version_hero_eyebrow\` text,
  	\`version_hero_headline\` text,
  	\`version_hero_headline_accent\` text,
  	\`version_hero_description\` text,
  	\`version_cta_headline\` text,
  	\`version_cta_description\` text,
  	\`version_cta_primary_cta_text\` text,
  	\`version_cta_primary_cta_href\` text,
  	\`version_cta_secondary_cta_text\` text,
  	\`version_cta_secondary_cta_href\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	\`autosave\` integer
  );
  `)
  await db.run(sql`CREATE INDEX \`_docs_page_v_version_version__status_idx\` ON \`_docs_page_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_docs_page_v_created_at_idx\` ON \`_docs_page_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_docs_page_v_updated_at_idx\` ON \`_docs_page_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_docs_page_v_latest_idx\` ON \`_docs_page_v\` (\`latest\`);`)
  await db.run(sql`CREATE INDEX \`_docs_page_v_autosave_idx\` ON \`_docs_page_v\` (\`autosave\`);`)
  await db.run(sql`CREATE TABLE \`privacy_page\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`last_updated\` text,
  	\`body\` text,
  	\`_status\` text DEFAULT 'draft',
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`CREATE INDEX \`privacy_page__status_idx\` ON \`privacy_page\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`_privacy_page_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`version_title\` text,
  	\`version_last_updated\` text,
  	\`version_body\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	\`autosave\` integer
  );
  `)
  await db.run(sql`CREATE INDEX \`_privacy_page_v_version_version__status_idx\` ON \`_privacy_page_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_privacy_page_v_created_at_idx\` ON \`_privacy_page_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_privacy_page_v_updated_at_idx\` ON \`_privacy_page_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_privacy_page_v_latest_idx\` ON \`_privacy_page_v\` (\`latest\`);`)
  await db.run(sql`CREATE INDEX \`_privacy_page_v_autosave_idx\` ON \`_privacy_page_v\` (\`autosave\`);`)
  await db.run(sql`CREATE TABLE \`terms_page\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`last_updated\` text,
  	\`body\` text,
  	\`_status\` text DEFAULT 'draft',
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`CREATE INDEX \`terms_page__status_idx\` ON \`terms_page\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`_terms_page_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`version_title\` text,
  	\`version_last_updated\` text,
  	\`version_body\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	\`autosave\` integer
  );
  `)
  await db.run(sql`CREATE INDEX \`_terms_page_v_version_version__status_idx\` ON \`_terms_page_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_terms_page_v_created_at_idx\` ON \`_terms_page_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_terms_page_v_updated_at_idx\` ON \`_terms_page_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_terms_page_v_latest_idx\` ON \`_terms_page_v\` (\`latest\`);`)
  await db.run(sql`CREATE INDEX \`_terms_page_v_autosave_idx\` ON \`_terms_page_v\` (\`autosave\`);`)
  await db.run(sql`CREATE TABLE \`site_settings_social_links\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`href\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`site_settings\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`site_settings_social_links_order_idx\` ON \`site_settings_social_links\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`site_settings_social_links_parent_id_idx\` ON \`site_settings_social_links\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`site_settings\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`site_name\` text,
  	\`site_description\` text,
  	\`contact_emails_general\` text,
  	\`contact_emails_sales\` text,
  	\`contact_emails_press\` text,
  	\`contact_emails_security\` text,
  	\`contact_emails_careers\` text,
  	\`contact_emails_education\` text,
  	\`contact_emails_government\` text,
  	\`contact_emails_partners\` text,
  	\`contact_emails_privacy\` text,
  	\`contact_emails_legal\` text,
  	\`footer_quote\` text,
  	\`copyright\` text,
  	\`_status\` text DEFAULT 'draft',
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`CREATE INDEX \`site_settings__status_idx\` ON \`site_settings\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`_site_settings_v_version_social_links\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`href\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_site_settings_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_site_settings_v_version_social_links_order_idx\` ON \`_site_settings_v_version_social_links\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_site_settings_v_version_social_links_parent_id_idx\` ON \`_site_settings_v_version_social_links\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_site_settings_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`version_site_name\` text,
  	\`version_site_description\` text,
  	\`version_contact_emails_general\` text,
  	\`version_contact_emails_sales\` text,
  	\`version_contact_emails_press\` text,
  	\`version_contact_emails_security\` text,
  	\`version_contact_emails_careers\` text,
  	\`version_contact_emails_education\` text,
  	\`version_contact_emails_government\` text,
  	\`version_contact_emails_partners\` text,
  	\`version_contact_emails_privacy\` text,
  	\`version_contact_emails_legal\` text,
  	\`version_footer_quote\` text,
  	\`version_copyright\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	\`autosave\` integer
  );
  `)
  await db.run(sql`CREATE INDEX \`_site_settings_v_version_version__status_idx\` ON \`_site_settings_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_site_settings_v_created_at_idx\` ON \`_site_settings_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_site_settings_v_updated_at_idx\` ON \`_site_settings_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_site_settings_v_latest_idx\` ON \`_site_settings_v\` (\`latest\`);`)
  await db.run(sql`CREATE INDEX \`_site_settings_v_autosave_idx\` ON \`_site_settings_v\` (\`autosave\`);`)
  await db.run(sql`CREATE TABLE \`navigation_header_groups_children\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`href\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`navigation_header_groups\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`navigation_header_groups_children_order_idx\` ON \`navigation_header_groups_children\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`navigation_header_groups_children_parent_id_idx\` ON \`navigation_header_groups_children\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`navigation_header_groups\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`href\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`navigation\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`navigation_header_groups_order_idx\` ON \`navigation_header_groups\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`navigation_header_groups_parent_id_idx\` ON \`navigation_header_groups\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`navigation_footer_groups_links\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`href\` text,
  	\`external\` integer DEFAULT false,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`navigation_footer_groups\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`navigation_footer_groups_links_order_idx\` ON \`navigation_footer_groups_links\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`navigation_footer_groups_links_parent_id_idx\` ON \`navigation_footer_groups_links\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`navigation_footer_groups\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`navigation\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`navigation_footer_groups_order_idx\` ON \`navigation_footer_groups\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`navigation_footer_groups_parent_id_idx\` ON \`navigation_footer_groups\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`navigation\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`header_cta_secondary_text\` text,
  	\`header_cta_secondary_href\` text,
  	\`header_cta_primary_text\` text,
  	\`header_cta_primary_href\` text,
  	\`_status\` text DEFAULT 'draft',
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`CREATE INDEX \`navigation__status_idx\` ON \`navigation\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`_navigation_v_version_header_groups_children\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`href\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_navigation_v_version_header_groups\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_navigation_v_version_header_groups_children_order_idx\` ON \`_navigation_v_version_header_groups_children\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_navigation_v_version_header_groups_children_parent_id_idx\` ON \`_navigation_v_version_header_groups_children\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_navigation_v_version_header_groups\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`href\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_navigation_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_navigation_v_version_header_groups_order_idx\` ON \`_navigation_v_version_header_groups\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_navigation_v_version_header_groups_parent_id_idx\` ON \`_navigation_v_version_header_groups\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_navigation_v_version_footer_groups_links\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`href\` text,
  	\`external\` integer DEFAULT false,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_navigation_v_version_footer_groups\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_navigation_v_version_footer_groups_links_order_idx\` ON \`_navigation_v_version_footer_groups_links\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_navigation_v_version_footer_groups_links_parent_id_idx\` ON \`_navigation_v_version_footer_groups_links\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_navigation_v_version_footer_groups\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_navigation_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_navigation_v_version_footer_groups_order_idx\` ON \`_navigation_v_version_footer_groups\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_navigation_v_version_footer_groups_parent_id_idx\` ON \`_navigation_v_version_footer_groups\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_navigation_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`version_header_cta_secondary_text\` text,
  	\`version_header_cta_secondary_href\` text,
  	\`version_header_cta_primary_text\` text,
  	\`version_header_cta_primary_href\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	\`autosave\` integer
  );
  `)
  await db.run(sql`CREATE INDEX \`_navigation_v_version_version__status_idx\` ON \`_navigation_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_navigation_v_created_at_idx\` ON \`_navigation_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_navigation_v_updated_at_idx\` ON \`_navigation_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_navigation_v_latest_idx\` ON \`_navigation_v\` (\`latest\`);`)
  await db.run(sql`CREATE INDEX \`_navigation_v_autosave_idx\` ON \`_navigation_v\` (\`autosave\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`users_sessions\`;`)
  await db.run(sql`DROP TABLE \`users\`;`)
  await db.run(sql`DROP TABLE \`media\`;`)
  await db.run(sql`DROP TABLE \`case_studies_metrics\`;`)
  await db.run(sql`DROP TABLE \`case_studies\`;`)
  await db.run(sql`DROP TABLE \`_case_studies_v_version_metrics\`;`)
  await db.run(sql`DROP TABLE \`_case_studies_v\`;`)
  await db.run(sql`DROP TABLE \`news\`;`)
  await db.run(sql`DROP TABLE \`_news_v\`;`)
  await db.run(sql`DROP TABLE \`team\`;`)
  await db.run(sql`DROP TABLE \`_team_v\`;`)
  await db.run(sql`DROP TABLE \`partners\`;`)
  await db.run(sql`DROP TABLE \`_partners_v\`;`)
  await db.run(sql`DROP TABLE \`jobs\`;`)
  await db.run(sql`DROP TABLE \`_jobs_v\`;`)
  await db.run(sql`DROP TABLE \`testimonials\`;`)
  await db.run(sql`DROP TABLE \`_testimonials_v\`;`)
  await db.run(sql`DROP TABLE \`industry_solutions_benefits\`;`)
  await db.run(sql`DROP TABLE \`industry_solutions_use_cases\`;`)
  await db.run(sql`DROP TABLE \`industry_solutions_case_study_results\`;`)
  await db.run(sql`DROP TABLE \`industry_solutions_why_cards\`;`)
  await db.run(sql`DROP TABLE \`industry_solutions\`;`)
  await db.run(sql`DROP TABLE \`_industry_solutions_v_version_benefits\`;`)
  await db.run(sql`DROP TABLE \`_industry_solutions_v_version_use_cases\`;`)
  await db.run(sql`DROP TABLE \`_industry_solutions_v_version_case_study_results\`;`)
  await db.run(sql`DROP TABLE \`_industry_solutions_v_version_why_cards\`;`)
  await db.run(sql`DROP TABLE \`_industry_solutions_v\`;`)
  await db.run(sql`DROP TABLE \`outcome_solutions_stats\`;`)
  await db.run(sql`DROP TABLE \`outcome_solutions_pillars\`;`)
  await db.run(sql`DROP TABLE \`outcome_solutions_use_cases\`;`)
  await db.run(sql`DROP TABLE \`outcome_solutions\`;`)
  await db.run(sql`DROP TABLE \`_outcome_solutions_v_version_stats\`;`)
  await db.run(sql`DROP TABLE \`_outcome_solutions_v_version_pillars\`;`)
  await db.run(sql`DROP TABLE \`_outcome_solutions_v_version_use_cases\`;`)
  await db.run(sql`DROP TABLE \`_outcome_solutions_v\`;`)
  await db.run(sql`DROP TABLE \`payload_kv\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_preferences\`;`)
  await db.run(sql`DROP TABLE \`payload_preferences_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_migrations\`;`)
  await db.run(sql`DROP TABLE \`homepage_hero_stats\`;`)
  await db.run(sql`DROP TABLE \`homepage_platform_capabilities\`;`)
  await db.run(sql`DROP TABLE \`homepage_products_items\`;`)
  await db.run(sql`DROP TABLE \`homepage_solutions_items\`;`)
  await db.run(sql`DROP TABLE \`homepage_case_studies_items\`;`)
  await db.run(sql`DROP TABLE \`homepage_impact_metrics\`;`)
  await db.run(sql`DROP TABLE \`homepage\`;`)
  await db.run(sql`DROP TABLE \`_homepage_v_version_hero_stats\`;`)
  await db.run(sql`DROP TABLE \`_homepage_v_version_platform_capabilities\`;`)
  await db.run(sql`DROP TABLE \`_homepage_v_version_products_items\`;`)
  await db.run(sql`DROP TABLE \`_homepage_v_version_solutions_items\`;`)
  await db.run(sql`DROP TABLE \`_homepage_v_version_case_studies_items\`;`)
  await db.run(sql`DROP TABLE \`_homepage_v_version_impact_metrics\`;`)
  await db.run(sql`DROP TABLE \`_homepage_v\`;`)
  await db.run(sql`DROP TABLE \`company_overview_facts\`;`)
  await db.run(sql`DROP TABLE \`company_overview_story_paragraphs\`;`)
  await db.run(sql`DROP TABLE \`company_overview_nav_cards\`;`)
  await db.run(sql`DROP TABLE \`company_overview_offices\`;`)
  await db.run(sql`DROP TABLE \`company_overview\`;`)
  await db.run(sql`DROP TABLE \`_company_overview_v_version_facts\`;`)
  await db.run(sql`DROP TABLE \`_company_overview_v_version_story_paragraphs\`;`)
  await db.run(sql`DROP TABLE \`_company_overview_v_version_nav_cards\`;`)
  await db.run(sql`DROP TABLE \`_company_overview_v_version_offices\`;`)
  await db.run(sql`DROP TABLE \`_company_overview_v\`;`)
  await db.run(sql`DROP TABLE \`mission_page_values\`;`)
  await db.run(sql`DROP TABLE \`mission_page_milestones\`;`)
  await db.run(sql`DROP TABLE \`mission_page_team_preview\`;`)
  await db.run(sql`DROP TABLE \`mission_page\`;`)
  await db.run(sql`DROP TABLE \`_mission_page_v_version_values\`;`)
  await db.run(sql`DROP TABLE \`_mission_page_v_version_milestones\`;`)
  await db.run(sql`DROP TABLE \`_mission_page_v_version_team_preview\`;`)
  await db.run(sql`DROP TABLE \`_mission_page_v\`;`)
  await db.run(sql`DROP TABLE \`careers_page_stats\`;`)
  await db.run(sql`DROP TABLE \`careers_page_benefits\`;`)
  await db.run(sql`DROP TABLE \`careers_page_hiring_process\`;`)
  await db.run(sql`DROP TABLE \`careers_page\`;`)
  await db.run(sql`DROP TABLE \`_careers_page_v_version_stats\`;`)
  await db.run(sql`DROP TABLE \`_careers_page_v_version_benefits\`;`)
  await db.run(sql`DROP TABLE \`_careers_page_v_version_hiring_process\`;`)
  await db.run(sql`DROP TABLE \`_careers_page_v\`;`)
  await db.run(sql`DROP TABLE \`platform_overview_platform_areas_features\`;`)
  await db.run(sql`DROP TABLE \`platform_overview_platform_areas\`;`)
  await db.run(sql`DROP TABLE \`platform_overview_specs\`;`)
  await db.run(sql`DROP TABLE \`platform_overview_architecture_layers\`;`)
  await db.run(sql`DROP TABLE \`platform_overview\`;`)
  await db.run(sql`DROP TABLE \`_platform_overview_v_version_platform_areas_features\`;`)
  await db.run(sql`DROP TABLE \`_platform_overview_v_version_platform_areas\`;`)
  await db.run(sql`DROP TABLE \`_platform_overview_v_version_specs\`;`)
  await db.run(sql`DROP TABLE \`_platform_overview_v_version_architecture_layers\`;`)
  await db.run(sql`DROP TABLE \`_platform_overview_v\`;`)
  await db.run(sql`DROP TABLE \`infrastructure_page_stats\`;`)
  await db.run(sql`DROP TABLE \`infrastructure_page_nodes_specs\`;`)
  await db.run(sql`DROP TABLE \`infrastructure_page_nodes\`;`)
  await db.run(sql`DROP TABLE \`infrastructure_page_features\`;`)
  await db.run(sql`DROP TABLE \`infrastructure_page_deployment_models\`;`)
  await db.run(sql`DROP TABLE \`infrastructure_page\`;`)
  await db.run(sql`DROP TABLE \`_infrastructure_page_v_version_stats\`;`)
  await db.run(sql`DROP TABLE \`_infrastructure_page_v_version_nodes_specs\`;`)
  await db.run(sql`DROP TABLE \`_infrastructure_page_v_version_nodes\`;`)
  await db.run(sql`DROP TABLE \`_infrastructure_page_v_version_features\`;`)
  await db.run(sql`DROP TABLE \`_infrastructure_page_v_version_deployment_models\`;`)
  await db.run(sql`DROP TABLE \`_infrastructure_page_v\`;`)
  await db.run(sql`DROP TABLE \`digital_systems_page_systems_features\`;`)
  await db.run(sql`DROP TABLE \`digital_systems_page_systems\`;`)
  await db.run(sql`DROP TABLE \`digital_systems_page_integration_benefits\`;`)
  await db.run(sql`DROP TABLE \`digital_systems_page_use_cases\`;`)
  await db.run(sql`DROP TABLE \`digital_systems_page\`;`)
  await db.run(sql`DROP TABLE \`_digital_systems_page_v_version_systems_features\`;`)
  await db.run(sql`DROP TABLE \`_digital_systems_page_v_version_systems\`;`)
  await db.run(sql`DROP TABLE \`_digital_systems_page_v_version_integration_benefits\`;`)
  await db.run(sql`DROP TABLE \`_digital_systems_page_v_version_use_cases\`;`)
  await db.run(sql`DROP TABLE \`_digital_systems_page_v\`;`)
  await db.run(sql`DROP TABLE \`edge_ai_page_capabilities\`;`)
  await db.run(sql`DROP TABLE \`edge_ai_page_use_cases\`;`)
  await db.run(sql`DROP TABLE \`edge_ai_page_specs\`;`)
  await db.run(sql`DROP TABLE \`edge_ai_page_how_it_works\`;`)
  await db.run(sql`DROP TABLE \`edge_ai_page_privacy_features\`;`)
  await db.run(sql`DROP TABLE \`edge_ai_page\`;`)
  await db.run(sql`DROP TABLE \`_edge_ai_page_v_version_capabilities\`;`)
  await db.run(sql`DROP TABLE \`_edge_ai_page_v_version_use_cases\`;`)
  await db.run(sql`DROP TABLE \`_edge_ai_page_v_version_specs\`;`)
  await db.run(sql`DROP TABLE \`_edge_ai_page_v_version_how_it_works\`;`)
  await db.run(sql`DROP TABLE \`_edge_ai_page_v_version_privacy_features\`;`)
  await db.run(sql`DROP TABLE \`_edge_ai_page_v\`;`)
  await db.run(sql`DROP TABLE \`stack_page_quick_stats\`;`)
  await db.run(sql`DROP TABLE \`stack_page_layers_products\`;`)
  await db.run(sql`DROP TABLE \`stack_page_layers\`;`)
  await db.run(sql`DROP TABLE \`stack_page_design_principles\`;`)
  await db.run(sql`DROP TABLE \`stack_page_layer_integration\`;`)
  await db.run(sql`DROP TABLE \`stack_page\`;`)
  await db.run(sql`DROP TABLE \`_stack_page_v_version_quick_stats\`;`)
  await db.run(sql`DROP TABLE \`_stack_page_v_version_layers_products\`;`)
  await db.run(sql`DROP TABLE \`_stack_page_v_version_layers\`;`)
  await db.run(sql`DROP TABLE \`_stack_page_v_version_design_principles\`;`)
  await db.run(sql`DROP TABLE \`_stack_page_v_version_layer_integration\`;`)
  await db.run(sql`DROP TABLE \`_stack_page_v\`;`)
  await db.run(sql`DROP TABLE \`solutions_overview_industry_cards_features\`;`)
  await db.run(sql`DROP TABLE \`solutions_overview_industry_cards\`;`)
  await db.run(sql`DROP TABLE \`solutions_overview_outcome_cards\`;`)
  await db.run(sql`DROP TABLE \`solutions_overview\`;`)
  await db.run(sql`DROP TABLE \`_solutions_overview_v_version_industry_cards_features\`;`)
  await db.run(sql`DROP TABLE \`_solutions_overview_v_version_industry_cards\`;`)
  await db.run(sql`DROP TABLE \`_solutions_overview_v_version_outcome_cards\`;`)
  await db.run(sql`DROP TABLE \`_solutions_overview_v\`;`)
  await db.run(sql`DROP TABLE \`impact_overview_stats\`;`)
  await db.run(sql`DROP TABLE \`impact_overview_nav_cards\`;`)
  await db.run(sql`DROP TABLE \`impact_overview_regional_highlights\`;`)
  await db.run(sql`DROP TABLE \`impact_overview\`;`)
  await db.run(sql`DROP TABLE \`_impact_overview_v_version_stats\`;`)
  await db.run(sql`DROP TABLE \`_impact_overview_v_version_nav_cards\`;`)
  await db.run(sql`DROP TABLE \`_impact_overview_v_version_regional_highlights\`;`)
  await db.run(sql`DROP TABLE \`_impact_overview_v\`;`)
  await db.run(sql`DROP TABLE \`case_studies_page_category_filters\`;`)
  await db.run(sql`DROP TABLE \`case_studies_page\`;`)
  await db.run(sql`DROP TABLE \`_case_studies_page_v_version_category_filters\`;`)
  await db.run(sql`DROP TABLE \`_case_studies_page_v\`;`)
  await db.run(sql`DROP TABLE \`metrics_page_primary_metrics\`;`)
  await db.run(sql`DROP TABLE \`metrics_page_secondary_metrics\`;`)
  await db.run(sql`DROP TABLE \`metrics_page_impact_stories\`;`)
  await db.run(sql`DROP TABLE \`metrics_page\`;`)
  await db.run(sql`DROP TABLE \`_metrics_page_v_version_primary_metrics\`;`)
  await db.run(sql`DROP TABLE \`_metrics_page_v_version_secondary_metrics\`;`)
  await db.run(sql`DROP TABLE \`_metrics_page_v_version_impact_stories\`;`)
  await db.run(sql`DROP TABLE \`_metrics_page_v\`;`)
  await db.run(sql`DROP TABLE \`network_map_page_live_stats\`;`)
  await db.run(sql`DROP TABLE \`network_map_page_regional_distribution\`;`)
  await db.run(sql`DROP TABLE \`network_map_page_recent_deployments\`;`)
  await db.run(sql`DROP TABLE \`network_map_page_network_architecture\`;`)
  await db.run(sql`DROP TABLE \`network_map_page\`;`)
  await db.run(sql`DROP TABLE \`_network_map_page_v_version_live_stats\`;`)
  await db.run(sql`DROP TABLE \`_network_map_page_v_version_regional_distribution\`;`)
  await db.run(sql`DROP TABLE \`_network_map_page_v_version_recent_deployments\`;`)
  await db.run(sql`DROP TABLE \`_network_map_page_v_version_network_architecture\`;`)
  await db.run(sql`DROP TABLE \`_network_map_page_v\`;`)
  await db.run(sql`DROP TABLE \`last_mile_page_stats\`;`)
  await db.run(sql`DROP TABLE \`last_mile_page_topic_filters\`;`)
  await db.run(sql`DROP TABLE \`last_mile_page\`;`)
  await db.run(sql`DROP TABLE \`_last_mile_page_v_version_stats\`;`)
  await db.run(sql`DROP TABLE \`_last_mile_page_v_version_topic_filters\`;`)
  await db.run(sql`DROP TABLE \`_last_mile_page_v\`;`)
  await db.run(sql`DROP TABLE \`resources_overview_resource_sections_items\`;`)
  await db.run(sql`DROP TABLE \`resources_overview_resource_sections\`;`)
  await db.run(sql`DROP TABLE \`resources_overview_quick_links\`;`)
  await db.run(sql`DROP TABLE \`resources_overview\`;`)
  await db.run(sql`DROP TABLE \`_resources_overview_v_version_resource_sections_items\`;`)
  await db.run(sql`DROP TABLE \`_resources_overview_v_version_resource_sections\`;`)
  await db.run(sql`DROP TABLE \`_resources_overview_v_version_quick_links\`;`)
  await db.run(sql`DROP TABLE \`_resources_overview_v\`;`)
  await db.run(sql`DROP TABLE \`trust_center_page_security_items\`;`)
  await db.run(sql`DROP TABLE \`trust_center_page_compliance_items\`;`)
  await db.run(sql`DROP TABLE \`trust_center_page_certifications\`;`)
  await db.run(sql`DROP TABLE \`trust_center_page_documents\`;`)
  await db.run(sql`DROP TABLE \`trust_center_page\`;`)
  await db.run(sql`DROP TABLE \`_trust_center_page_v_version_security_items\`;`)
  await db.run(sql`DROP TABLE \`_trust_center_page_v_version_compliance_items\`;`)
  await db.run(sql`DROP TABLE \`_trust_center_page_v_version_certifications\`;`)
  await db.run(sql`DROP TABLE \`_trust_center_page_v_version_documents\`;`)
  await db.run(sql`DROP TABLE \`_trust_center_page_v\`;`)
  await db.run(sql`DROP TABLE \`newsroom_page_press_kit_items\`;`)
  await db.run(sql`DROP TABLE \`newsroom_page\`;`)
  await db.run(sql`DROP TABLE \`_newsroom_page_v_version_press_kit_items\`;`)
  await db.run(sql`DROP TABLE \`_newsroom_page_v\`;`)
  await db.run(sql`DROP TABLE \`docs_page_doc_categories_items\`;`)
  await db.run(sql`DROP TABLE \`docs_page_doc_categories\`;`)
  await db.run(sql`DROP TABLE \`docs_page_sdks\`;`)
  await db.run(sql`DROP TABLE \`docs_page_support_channels\`;`)
  await db.run(sql`DROP TABLE \`docs_page\`;`)
  await db.run(sql`DROP TABLE \`_docs_page_v_version_doc_categories_items\`;`)
  await db.run(sql`DROP TABLE \`_docs_page_v_version_doc_categories\`;`)
  await db.run(sql`DROP TABLE \`_docs_page_v_version_sdks\`;`)
  await db.run(sql`DROP TABLE \`_docs_page_v_version_support_channels\`;`)
  await db.run(sql`DROP TABLE \`_docs_page_v\`;`)
  await db.run(sql`DROP TABLE \`privacy_page\`;`)
  await db.run(sql`DROP TABLE \`_privacy_page_v\`;`)
  await db.run(sql`DROP TABLE \`terms_page\`;`)
  await db.run(sql`DROP TABLE \`_terms_page_v\`;`)
  await db.run(sql`DROP TABLE \`site_settings_social_links\`;`)
  await db.run(sql`DROP TABLE \`site_settings\`;`)
  await db.run(sql`DROP TABLE \`_site_settings_v_version_social_links\`;`)
  await db.run(sql`DROP TABLE \`_site_settings_v\`;`)
  await db.run(sql`DROP TABLE \`navigation_header_groups_children\`;`)
  await db.run(sql`DROP TABLE \`navigation_header_groups\`;`)
  await db.run(sql`DROP TABLE \`navigation_footer_groups_links\`;`)
  await db.run(sql`DROP TABLE \`navigation_footer_groups\`;`)
  await db.run(sql`DROP TABLE \`navigation\`;`)
  await db.run(sql`DROP TABLE \`_navigation_v_version_header_groups_children\`;`)
  await db.run(sql`DROP TABLE \`_navigation_v_version_header_groups\`;`)
  await db.run(sql`DROP TABLE \`_navigation_v_version_footer_groups_links\`;`)
  await db.run(sql`DROP TABLE \`_navigation_v_version_footer_groups\`;`)
  await db.run(sql`DROP TABLE \`_navigation_v\`;`)
}
