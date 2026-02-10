import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`plugin_ai_instructions_images\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`image_id\` integer,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`plugin_ai_instructions\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`plugin_ai_instructions_images_order_idx\` ON \`plugin_ai_instructions_images\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`plugin_ai_instructions_images_parent_id_idx\` ON \`plugin_ai_instructions_images\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`plugin_ai_instructions_images_image_idx\` ON \`plugin_ai_instructions_images\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`plugin_ai_instructions\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`schema_path\` text,
  	\`field_type\` text DEFAULT 'text',
  	\`relation_to\` text,
  	\`model_id\` text,
  	\`disabled\` integer DEFAULT false,
  	\`prompt\` text,
  	\`system\` text DEFAULT 'INSTRUCTIONS:
  You are a highly skilled and professional blog writer,
  renowned for crafting engaging and well-organized articles.
  When given a title, you meticulously create blogs that are not only
  informative and accurate but also captivating and beautifully structured.',
  	\`layout\` text DEFAULT '[paragraph] - Write a concise introduction (2-3 sentences) that outlines the main topic.
  [horizontalrule] - Insert a horizontal rule to separate the introduction from the main content.
  [list] - Create a list with 3-5 items. Each list item should contain:
     a. [heading] - A brief, descriptive heading (up to 5 words)
     b. [paragraph] - A short explanation or elaboration (1-2 sentences)
  [horizontalrule] - Insert another horizontal rule to separate the main content from the conclusion.
  [paragraph] - Compose a brief conclusion (2-3 sentences) summarizing the key points.
  [quote] - Include a relevant quote from a famous person, directly related to the topic. Format: "Quote text." - Author Name',
  	\`gemini_text_settings_model\` text DEFAULT 'gemini-flash-latest',
  	\`gemini_text_settings_max_tokens\` numeric DEFAULT 5000,
  	\`gemini_text_settings_temperature\` numeric DEFAULT 0.7,
  	\`gemini_text_settings_extract_attachments\` integer,
  	\`gemini_object_settings_model\` text DEFAULT 'gemini-flash-latest',
  	\`gemini_object_settings_max_tokens\` numeric DEFAULT 5000,
  	\`gemini_object_settings_temperature\` numeric DEFAULT 0.7,
  	\`gemini_object_settings_extract_attachments\` integer,
  	\`imagen_settings_model\` text DEFAULT 'imagen-4.0-fast-generate-001',
  	\`imagen_settings_aspect_ratio\` text DEFAULT '1:1',
  	\`imagen_settings_output_mime_type\` text DEFAULT 'image/png',
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`plugin_ai_instructions_schema_path_idx\` ON \`plugin_ai_instructions\` (\`schema_path\`);`)
  await db.run(sql`CREATE INDEX \`plugin_ai_instructions_updated_at_idx\` ON \`plugin_ai_instructions\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`plugin_ai_instructions_created_at_idx\` ON \`plugin_ai_instructions\` (\`created_at\`);`)
  await db.run(sql`DROP INDEX \`_case_studies_v_autosave_idx\`;`)
  await db.run(sql`ALTER TABLE \`_case_studies_v\` DROP COLUMN \`autosave\`;`)
  await db.run(sql`DROP INDEX \`_news_v_autosave_idx\`;`)
  await db.run(sql`ALTER TABLE \`_news_v\` DROP COLUMN \`autosave\`;`)
  await db.run(sql`DROP INDEX \`_team_v_autosave_idx\`;`)
  await db.run(sql`ALTER TABLE \`_team_v\` DROP COLUMN \`autosave\`;`)
  await db.run(sql`DROP INDEX \`_partners_v_autosave_idx\`;`)
  await db.run(sql`ALTER TABLE \`_partners_v\` DROP COLUMN \`autosave\`;`)
  await db.run(sql`DROP INDEX \`_jobs_v_autosave_idx\`;`)
  await db.run(sql`ALTER TABLE \`_jobs_v\` DROP COLUMN \`autosave\`;`)
  await db.run(sql`DROP INDEX \`_testimonials_v_autosave_idx\`;`)
  await db.run(sql`ALTER TABLE \`_testimonials_v\` DROP COLUMN \`autosave\`;`)
  await db.run(sql`DROP INDEX \`_industry_solutions_v_autosave_idx\`;`)
  await db.run(sql`ALTER TABLE \`_industry_solutions_v\` DROP COLUMN \`autosave\`;`)
  await db.run(sql`DROP INDEX \`_outcome_solutions_v_autosave_idx\`;`)
  await db.run(sql`ALTER TABLE \`_outcome_solutions_v\` DROP COLUMN \`autosave\`;`)
  await db.run(sql`DROP INDEX \`_homepage_v_autosave_idx\`;`)
  await db.run(sql`ALTER TABLE \`_homepage_v\` DROP COLUMN \`autosave\`;`)
  await db.run(sql`DROP INDEX \`_company_overview_v_autosave_idx\`;`)
  await db.run(sql`ALTER TABLE \`_company_overview_v\` DROP COLUMN \`autosave\`;`)
  await db.run(sql`DROP INDEX \`_mission_page_v_autosave_idx\`;`)
  await db.run(sql`ALTER TABLE \`_mission_page_v\` DROP COLUMN \`autosave\`;`)
  await db.run(sql`DROP INDEX \`_careers_page_v_autosave_idx\`;`)
  await db.run(sql`ALTER TABLE \`_careers_page_v\` DROP COLUMN \`autosave\`;`)
  await db.run(sql`DROP INDEX \`_platform_overview_v_autosave_idx\`;`)
  await db.run(sql`ALTER TABLE \`_platform_overview_v\` DROP COLUMN \`autosave\`;`)
  await db.run(sql`DROP INDEX \`_infrastructure_page_v_autosave_idx\`;`)
  await db.run(sql`ALTER TABLE \`_infrastructure_page_v\` DROP COLUMN \`autosave\`;`)
  await db.run(sql`DROP INDEX \`_digital_systems_page_v_autosave_idx\`;`)
  await db.run(sql`ALTER TABLE \`_digital_systems_page_v\` DROP COLUMN \`autosave\`;`)
  await db.run(sql`DROP INDEX \`_edge_ai_page_v_autosave_idx\`;`)
  await db.run(sql`ALTER TABLE \`_edge_ai_page_v\` DROP COLUMN \`autosave\`;`)
  await db.run(sql`DROP INDEX \`_stack_page_v_autosave_idx\`;`)
  await db.run(sql`ALTER TABLE \`_stack_page_v\` DROP COLUMN \`autosave\`;`)
  await db.run(sql`DROP INDEX \`_solutions_overview_v_autosave_idx\`;`)
  await db.run(sql`ALTER TABLE \`_solutions_overview_v\` DROP COLUMN \`autosave\`;`)
  await db.run(sql`DROP INDEX \`_impact_overview_v_autosave_idx\`;`)
  await db.run(sql`ALTER TABLE \`_impact_overview_v\` DROP COLUMN \`autosave\`;`)
  await db.run(sql`DROP INDEX \`_case_studies_page_v_autosave_idx\`;`)
  await db.run(sql`ALTER TABLE \`_case_studies_page_v\` DROP COLUMN \`autosave\`;`)
  await db.run(sql`DROP INDEX \`_metrics_page_v_autosave_idx\`;`)
  await db.run(sql`ALTER TABLE \`_metrics_page_v\` DROP COLUMN \`autosave\`;`)
  await db.run(sql`DROP INDEX \`_network_map_page_v_autosave_idx\`;`)
  await db.run(sql`ALTER TABLE \`_network_map_page_v\` DROP COLUMN \`autosave\`;`)
  await db.run(sql`DROP INDEX \`_last_mile_page_v_autosave_idx\`;`)
  await db.run(sql`ALTER TABLE \`_last_mile_page_v\` DROP COLUMN \`autosave\`;`)
  await db.run(sql`DROP INDEX \`_resources_overview_v_autosave_idx\`;`)
  await db.run(sql`ALTER TABLE \`_resources_overview_v\` DROP COLUMN \`autosave\`;`)
  await db.run(sql`DROP INDEX \`_trust_center_page_v_autosave_idx\`;`)
  await db.run(sql`ALTER TABLE \`_trust_center_page_v\` DROP COLUMN \`autosave\`;`)
  await db.run(sql`DROP INDEX \`_newsroom_page_v_autosave_idx\`;`)
  await db.run(sql`ALTER TABLE \`_newsroom_page_v\` DROP COLUMN \`autosave\`;`)
  await db.run(sql`DROP INDEX \`_docs_page_v_autosave_idx\`;`)
  await db.run(sql`ALTER TABLE \`_docs_page_v\` DROP COLUMN \`autosave\`;`)
  await db.run(sql`DROP INDEX \`_privacy_page_v_autosave_idx\`;`)
  await db.run(sql`ALTER TABLE \`_privacy_page_v\` DROP COLUMN \`autosave\`;`)
  await db.run(sql`DROP INDEX \`_terms_page_v_autosave_idx\`;`)
  await db.run(sql`ALTER TABLE \`_terms_page_v\` DROP COLUMN \`autosave\`;`)
  await db.run(sql`DROP INDEX \`_site_settings_v_autosave_idx\`;`)
  await db.run(sql`ALTER TABLE \`_site_settings_v\` DROP COLUMN \`autosave\`;`)
  await db.run(sql`DROP INDEX \`_navigation_v_autosave_idx\`;`)
  await db.run(sql`ALTER TABLE \`_navigation_v\` DROP COLUMN \`autosave\`;`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`plugin_ai_instructions_id\` integer REFERENCES plugin_ai_instructions(id);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_plugin_ai_instructions_id_idx\` ON \`payload_locked_documents_rels\` (\`plugin_ai_instructions_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`plugin_ai_instructions_images\`;`)
  await db.run(sql`DROP TABLE \`plugin_ai_instructions\`;`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_payload_locked_documents_rels\` (
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
  await db.run(sql`INSERT INTO \`__new_payload_locked_documents_rels\`("id", "order", "parent_id", "path", "users_id", "media_id", "case_studies_id", "news_id", "team_id", "partners_id", "jobs_id", "testimonials_id", "industry_solutions_id", "outcome_solutions_id") SELECT "id", "order", "parent_id", "path", "users_id", "media_id", "case_studies_id", "news_id", "team_id", "partners_id", "jobs_id", "testimonials_id", "industry_solutions_id", "outcome_solutions_id" FROM \`payload_locked_documents_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`)
  await db.run(sql`ALTER TABLE \`__new_payload_locked_documents_rels\` RENAME TO \`payload_locked_documents_rels\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
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
  await db.run(sql`ALTER TABLE \`_case_studies_v\` ADD \`autosave\` integer;`)
  await db.run(sql`CREATE INDEX \`_case_studies_v_autosave_idx\` ON \`_case_studies_v\` (\`autosave\`);`)
  await db.run(sql`ALTER TABLE \`_news_v\` ADD \`autosave\` integer;`)
  await db.run(sql`CREATE INDEX \`_news_v_autosave_idx\` ON \`_news_v\` (\`autosave\`);`)
  await db.run(sql`ALTER TABLE \`_team_v\` ADD \`autosave\` integer;`)
  await db.run(sql`CREATE INDEX \`_team_v_autosave_idx\` ON \`_team_v\` (\`autosave\`);`)
  await db.run(sql`ALTER TABLE \`_partners_v\` ADD \`autosave\` integer;`)
  await db.run(sql`CREATE INDEX \`_partners_v_autosave_idx\` ON \`_partners_v\` (\`autosave\`);`)
  await db.run(sql`ALTER TABLE \`_jobs_v\` ADD \`autosave\` integer;`)
  await db.run(sql`CREATE INDEX \`_jobs_v_autosave_idx\` ON \`_jobs_v\` (\`autosave\`);`)
  await db.run(sql`ALTER TABLE \`_testimonials_v\` ADD \`autosave\` integer;`)
  await db.run(sql`CREATE INDEX \`_testimonials_v_autosave_idx\` ON \`_testimonials_v\` (\`autosave\`);`)
  await db.run(sql`ALTER TABLE \`_industry_solutions_v\` ADD \`autosave\` integer;`)
  await db.run(sql`CREATE INDEX \`_industry_solutions_v_autosave_idx\` ON \`_industry_solutions_v\` (\`autosave\`);`)
  await db.run(sql`ALTER TABLE \`_outcome_solutions_v\` ADD \`autosave\` integer;`)
  await db.run(sql`CREATE INDEX \`_outcome_solutions_v_autosave_idx\` ON \`_outcome_solutions_v\` (\`autosave\`);`)
  await db.run(sql`ALTER TABLE \`_homepage_v\` ADD \`autosave\` integer;`)
  await db.run(sql`CREATE INDEX \`_homepage_v_autosave_idx\` ON \`_homepage_v\` (\`autosave\`);`)
  await db.run(sql`ALTER TABLE \`_company_overview_v\` ADD \`autosave\` integer;`)
  await db.run(sql`CREATE INDEX \`_company_overview_v_autosave_idx\` ON \`_company_overview_v\` (\`autosave\`);`)
  await db.run(sql`ALTER TABLE \`_mission_page_v\` ADD \`autosave\` integer;`)
  await db.run(sql`CREATE INDEX \`_mission_page_v_autosave_idx\` ON \`_mission_page_v\` (\`autosave\`);`)
  await db.run(sql`ALTER TABLE \`_careers_page_v\` ADD \`autosave\` integer;`)
  await db.run(sql`CREATE INDEX \`_careers_page_v_autosave_idx\` ON \`_careers_page_v\` (\`autosave\`);`)
  await db.run(sql`ALTER TABLE \`_platform_overview_v\` ADD \`autosave\` integer;`)
  await db.run(sql`CREATE INDEX \`_platform_overview_v_autosave_idx\` ON \`_platform_overview_v\` (\`autosave\`);`)
  await db.run(sql`ALTER TABLE \`_infrastructure_page_v\` ADD \`autosave\` integer;`)
  await db.run(sql`CREATE INDEX \`_infrastructure_page_v_autosave_idx\` ON \`_infrastructure_page_v\` (\`autosave\`);`)
  await db.run(sql`ALTER TABLE \`_digital_systems_page_v\` ADD \`autosave\` integer;`)
  await db.run(sql`CREATE INDEX \`_digital_systems_page_v_autosave_idx\` ON \`_digital_systems_page_v\` (\`autosave\`);`)
  await db.run(sql`ALTER TABLE \`_edge_ai_page_v\` ADD \`autosave\` integer;`)
  await db.run(sql`CREATE INDEX \`_edge_ai_page_v_autosave_idx\` ON \`_edge_ai_page_v\` (\`autosave\`);`)
  await db.run(sql`ALTER TABLE \`_stack_page_v\` ADD \`autosave\` integer;`)
  await db.run(sql`CREATE INDEX \`_stack_page_v_autosave_idx\` ON \`_stack_page_v\` (\`autosave\`);`)
  await db.run(sql`ALTER TABLE \`_solutions_overview_v\` ADD \`autosave\` integer;`)
  await db.run(sql`CREATE INDEX \`_solutions_overview_v_autosave_idx\` ON \`_solutions_overview_v\` (\`autosave\`);`)
  await db.run(sql`ALTER TABLE \`_impact_overview_v\` ADD \`autosave\` integer;`)
  await db.run(sql`CREATE INDEX \`_impact_overview_v_autosave_idx\` ON \`_impact_overview_v\` (\`autosave\`);`)
  await db.run(sql`ALTER TABLE \`_case_studies_page_v\` ADD \`autosave\` integer;`)
  await db.run(sql`CREATE INDEX \`_case_studies_page_v_autosave_idx\` ON \`_case_studies_page_v\` (\`autosave\`);`)
  await db.run(sql`ALTER TABLE \`_metrics_page_v\` ADD \`autosave\` integer;`)
  await db.run(sql`CREATE INDEX \`_metrics_page_v_autosave_idx\` ON \`_metrics_page_v\` (\`autosave\`);`)
  await db.run(sql`ALTER TABLE \`_network_map_page_v\` ADD \`autosave\` integer;`)
  await db.run(sql`CREATE INDEX \`_network_map_page_v_autosave_idx\` ON \`_network_map_page_v\` (\`autosave\`);`)
  await db.run(sql`ALTER TABLE \`_last_mile_page_v\` ADD \`autosave\` integer;`)
  await db.run(sql`CREATE INDEX \`_last_mile_page_v_autosave_idx\` ON \`_last_mile_page_v\` (\`autosave\`);`)
  await db.run(sql`ALTER TABLE \`_resources_overview_v\` ADD \`autosave\` integer;`)
  await db.run(sql`CREATE INDEX \`_resources_overview_v_autosave_idx\` ON \`_resources_overview_v\` (\`autosave\`);`)
  await db.run(sql`ALTER TABLE \`_trust_center_page_v\` ADD \`autosave\` integer;`)
  await db.run(sql`CREATE INDEX \`_trust_center_page_v_autosave_idx\` ON \`_trust_center_page_v\` (\`autosave\`);`)
  await db.run(sql`ALTER TABLE \`_newsroom_page_v\` ADD \`autosave\` integer;`)
  await db.run(sql`CREATE INDEX \`_newsroom_page_v_autosave_idx\` ON \`_newsroom_page_v\` (\`autosave\`);`)
  await db.run(sql`ALTER TABLE \`_docs_page_v\` ADD \`autosave\` integer;`)
  await db.run(sql`CREATE INDEX \`_docs_page_v_autosave_idx\` ON \`_docs_page_v\` (\`autosave\`);`)
  await db.run(sql`ALTER TABLE \`_privacy_page_v\` ADD \`autosave\` integer;`)
  await db.run(sql`CREATE INDEX \`_privacy_page_v_autosave_idx\` ON \`_privacy_page_v\` (\`autosave\`);`)
  await db.run(sql`ALTER TABLE \`_terms_page_v\` ADD \`autosave\` integer;`)
  await db.run(sql`CREATE INDEX \`_terms_page_v_autosave_idx\` ON \`_terms_page_v\` (\`autosave\`);`)
  await db.run(sql`ALTER TABLE \`_site_settings_v\` ADD \`autosave\` integer;`)
  await db.run(sql`CREATE INDEX \`_site_settings_v_autosave_idx\` ON \`_site_settings_v\` (\`autosave\`);`)
  await db.run(sql`ALTER TABLE \`_navigation_v\` ADD \`autosave\` integer;`)
  await db.run(sql`CREATE INDEX \`_navigation_v_autosave_idx\` ON \`_navigation_v\` (\`autosave\`);`)
}
