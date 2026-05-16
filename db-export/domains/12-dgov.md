# Dominio DGOV — Data Governance (Multi-tenant + RLS + Audit + GDPR)

> Trasversale, enforce P1+P4+P5+P7

**Tabelle in questo dominio**: 188

## Tabelle

| Tabella                                                         | Rows   | Tenant | RLS | FK out | Cols |
| --------------------------------------------------------------- | ------ | ------ | --- | ------ | ---- |
| [`admin_component_registry`](#admincomponentregistry)           | 15     | ✓      | ✓   | 2      | 22   |
| [`crawl_runs`](#crawlruns)                                      | 1      | ✓      | ✓   | 2      | 11   |
| [`crawler_configs`](#crawlerconfigs)                            | 1      | ✓      | ✓   | 1      | 15   |
| [`dashboard_elements`](#dashboardelements)                      | 199    | ✓      | ✓   | 4      | 17   |
| [`dashboard_presets`](#dashboardpresets)                        | 22     | —      | —   | 1      | 15   |
| [`dashboard_widgets`](#dashboardwidgets)                        | 160    | ✓      | ✓   | 2      | 17   |
| [`dashboards`](#dashboards)                                     | 20     | ✓      | ✓   | 2      | 11   |
| [`data_retention_policies`](#dataretentionpolicies)             | 8      | —      | —   | 0      | 10   |
| [`data_subject_requests`](#datasubjectrequests)                 | 20     | ✓      | ✓   | 2      | 15   |
| [`db_table_registry`](#dbtableregistry)                         | 503    | —      | —   | 0      | 13   |
| [`document_acknowledgments`](#documentacknowledgments)          | 250    | ✓      | ✓   | 3      | 9    |
| [`document_comments`](#documentcomments)                        | 15     | —      | —   | 3      | 9    |
| [`document_locks`](#documentlocks)                              | 0      | —      | —   | 2      | 8    |
| [`document_requests`](#documentrequests)                        | 15     | ✓      | ✓   | 4      | 15   |
| [`document_versions`](#documentversions)                        | 24     | —      | —   | 2      | 13   |
| [`enrichment_candidates`](#enrichmentcandidates)                | 38     | ✓      | ✓   | 4      | 13   |
| [`enrichment_entity_descriptors`](#enrichmententitydescriptors) | 3      | ✓      | ✓   | 3      | 18   |
| [`enrichment_extraction_schemas`](#enrichmentextractionschemas) | 2      | ✓      | ✓   | 1      | 9    |
| [`enrichment_job_events`](#enrichmentjobevents)                 | 91     | ✓      | ✓   | 2      | 6    |
| [`enrichment_jobs`](#enrichmentjobs)                            | 18     | ✓      | ✓   | 4      | 17   |
| [`enrichment_lineage`](#enrichmentlineage)                      | 0      | ✓      | ✓   | 6      | 9    |
| [`enrichment_llm_providers`](#enrichmentllmproviders)           | 3      | —      | —   | 0      | 14   |
| [`enrichment_matches`](#enrichmentmatches)                      | 0      | ✓      | ✓   | 4      | 13   |
| [`enrichment_merge_policies`](#enrichmentmergepolicies)         | 2      | ✓      | ✓   | 1      | 13   |
| [`enrichment_merges`](#enrichmentmerges)                        | 0      | ✓      | ✓   | 5      | 16   |
| [`enrichment_observations`](#enrichmentobservations)            | 0      | ✓      | ✓   | 3      | 10   |
| [`enrichment_source_snapshots`](#enrichmentsourcesnapshots)     | 27     | ✓      | ✓   | 2      | 11   |
| [`enrichment_sources`](#enrichmentsources)                      | 31     | ✓      | ✓   | 2      | 11   |
| [`enrichment_trust_rules`](#enrichmenttrustrules)               | 10     | ✓      | ✓   | 1      | 8    |
| [`enrichment_writes`](#enrichmentwrites)                        | 1      | ✓      | ✓   | 4      | 16   |
| [`error_analytics_hourly`](#erroranalyticshourly)               | 0      | ✓      | ✓   | 1      | 10   |
| [`error_logs`](#errorlogs)                                      | 0      | ✓      | ✓   | 2      | 18   |
| [`error_patterns`](#errorpatterns)                              | 0      | —      | —   | 1      | 15   |
| [`export_configurations`](#exportconfigurations)                | 15     | ✓      | ✓   | 2      | 17   |
| [`export_jobs`](#exportjobs)                                    | 45     | ✓      | ✓   | 3      | 14   |
| [`ext_hrp1007`](#exthrp1007)                                    | 0      | ✓      | ✓   | 1      | 14   |
| [`ext_pa0002`](#extpa0002)                                      | 1064   | ✓      | ✓   | 1      | 10   |
| [`ext_pa0024`](#extpa0024)                                      | 18.272 | —      | —   | 0      | 5    |
| [`ext_pa0025`](#extpa0025)                                      | 0      | —      | —   | 0      | 8    |
| [`ext_pb0002`](#extpb0002)                                      | 0      | ✓      | ✓   | 1      | 8    |
| [`feature_categories`](#featurecategories)                      | 13     | —      | —   | 0      | 7    |
| [`feature_modules`](#featuremodules)                            | 99     | —      | —   | 0      | 13   |
| [`features`](#features)                                         | 104    | —      | —   | 0      | 12   |
| [`heuresys_sap_mapping`](#heuresyssapmapping)                   | 21     | —      | —   | 0      | 18   |
| [`hrp1000`](#hrp1000)                                           | 320    | —      | —   | 0      | 11   |
| [`hrp1001`](#hrp1001)                                           | 164    | —      | —   | 0      | 12   |
| [`hrp1002`](#hrp1002)                                           | 15     | —      | —   | 0      | 9    |
| [`hrp1003`](#hrp1003)                                           | 0      | —      | —   | 0      | 11   |
| [`hrp1005`](#hrp1005)                                           | 34     | —      | —   | 0      | 14   |
| [`hrp1006`](#hrp1006)                                           | 0      | —      | —   | 0      | 10   |
| [`hrp1007`](#hrp1007)                                           | 0      | —      | —   | 0      | 14   |
| [`hrp1008`](#hrp1008)                                           | 0      | —      | —   | 0      | 11   |
| [`hrp1010`](#hrp1010)                                           | 0      | —      | —   | 0      | 11   |
| [`hrp1011`](#hrp1011)                                           | 0      | —      | —   | 0      | 12   |
| [`hrp1013`](#hrp1013)                                           | 0      | —      | —   | 0      | 10   |
| [`hrp1014`](#hrp1014)                                           | 0      | —      | —   | 0      | 11   |
| [`hrp1035`](#hrp1035)                                           | 400    | —      | —   | 0      | 15   |
| [`hrp1036`](#hrp1036)                                           | 200    | —      | —   | 0      | 19   |
| [`hrp5001`](#hrp5001)                                           | 6      | —      | —   | 0      | 21   |
| [`hrp5002`](#hrp5002)                                           | 0      | —      | —   | 0      | 17   |
| [`hrpdev1`](#hrpdev1)                                           | 200    | —      | —   | 0      | 20   |
| [`import_jobs`](#importjobs)                                    | 2      | ✓      | ✓   | 1      | 21   |
| [`import_skill_links`](#importskilllinks)                       | 0      | ✓      | ✓   | 3      | 9    |
| [`integration_sync_logs`](#integrationsynclogs)                 | 100    | ✓      | ✓   | 2      | 13   |
| [`integrations`](#integrations)                                 | 20     | ✓      | ✓   | 1      | 15   |
| [`notification_preferences`](#notificationpreferences)          | 266    | —      | —   | 2      | 19   |
| [`notifications`](#notifications)                               | 238    | ✓      | ✓   | 3      | 15   |
| [`pa0000`](#pa0000)                                             | 1142   | —      | —   | 0      | 9    |
| [`pa0001`](#pa0001)                                             | 1774   | —      | —   | 0      | 14   |
| [`pa0002`](#pa0002)                                             | 1458   | —      | —   | 0      | 13   |
| [`pa0003`](#pa0003)                                             | 1142   | —      | —   | 0      | 13   |
| [`pa0005`](#pa0005)                                             | 1142   | —      | —   | 0      | 12   |
| [`pa0006`](#pa0006)                                             | 1142   | —      | —   | 0      | 11   |
| [`pa0007`](#pa0007)                                             | 1142   | —      | —   | 0      | 11   |
| [`pa0008`](#pa0008)                                             | 1142   | —      | —   | 0      | 18   |
| [`pa0009`](#pa0009)                                             | 1134   | —      | —   | 0      | 11   |
| [`pa0014`](#pa0014)                                             | 1142   | —      | —   | 0      | 14   |
| [`pa0015`](#pa0015)                                             | 912    | —      | —   | 0      | 15   |
| [`pa0016`](#pa0016)                                             | 1142   | —      | —   | 0      | 12   |
| [`pa0017`](#pa0017)                                             | 1142   | —      | —   | 0      | 11   |
| [`pa0019`](#pa0019)                                             | 1142   | —      | —   | 0      | 13   |
| [`pa0021`](#pa0021)                                             | 1530   | —      | —   | 0      | 12   |
| [`pa0022`](#pa0022)                                             | 1138   | —      | —   | 0      | 15   |
| [`pa0024`](#pa0024)                                             | 9640   | —      | —   | 0      | 13   |
| [`pa0025`](#pa0025)                                             | 264    | —      | —   | 0      | 16   |
| [`pa0027`](#pa0027)                                             | 1142   | —      | —   | 0      | 12   |
| [`pa0032`](#pa0032)                                             | 1142   | —      | —   | 0      | 11   |
| [`pa0041`](#pa0041)                                             | 1142   | —      | —   | 0      | 12   |
| [`pa0105`](#pa0105)                                             | 2598   | —      | —   | 0      | 8    |
| [`pa0167`](#pa0167)                                             | 1142   | —      | —   | 0      | 18   |
| [`pa0168`](#pa0168)                                             | 1142   | —      | —   | 0      | 16   |
| [`pa0169`](#pa0169)                                             | 1142   | —      | —   | 0      | 16   |
| [`pa0170`](#pa0170)                                             | 1142   | —      | —   | 0      | 16   |
| [`pa0171`](#pa0171)                                             | 1142   | —      | —   | 0      | 14   |
| [`pa0185`](#pa0185)                                             | 2268   | —      | —   | 0      | 12   |
| [`pa2000`](#pa2000)                                             | 1142   | —      | —   | 0      | 21   |
| [`pa2001`](#pa2001)                                             | 1444   | —      | —   | 0      | 9    |
| [`pa2002`](#pa2002)                                             | 6072   | —      | —   | 0      | 9    |
| [`pa2003`](#pa2003)                                             | 0      | —      | —   | 0      | 9    |
| [`pa2004`](#pa2004)                                             | 0      | —      | —   | 0      | 10   |
| [`pa2005`](#pa2005)                                             | 5358   | —      | —   | 0      | 22   |
| [`pa2006`](#pa2006)                                             | 3426   | —      | —   | 0      | 21   |
| [`pa2007`](#pa2007)                                             | 1142   | —      | —   | 0      | 19   |
| [`pa2010`](#pa2010)                                             | 0      | —      | —   | 0      | 19   |
| [`pa2011`](#pa2011)                                             | 0      | —      | —   | 0      | 14   |
| [`pa2012`](#pa2012)                                             | 0      | —      | —   | 0      | 10   |
| [`pa2013`](#pa2013)                                             | 0      | —      | —   | 0      | 10   |
| [`page_table_relations`](#pagetablerelations)                   | 300    | —      | —   | 1      | 8    |
| [`page_table_sync_log`](#pagetablesynclog)                      | 45     | —      | —   | 0      | 9    |
| [`pb0001`](#pb0001)                                             | 1000   | —      | —   | 0      | 13   |
| [`pb0002`](#pb0002)                                             | 1010   | —      | —   | 0      | 19   |
| [`pb0003`](#pb0003)                                             | 0      | —      | —   | 0      | 11   |
| [`pb0022`](#pb0022)                                             | 1600   | —      | —   | 0      | 15   |
| [`pb0024`](#pb0024)                                             | 2400   | —      | —   | 0      | 12   |
| [`pb4000`](#pb4000)                                             | 2000   | —      | —   | 0      | 15   |
| [`pb4001`](#pb4001)                                             | 2000   | —      | —   | 0      | 15   |
| [`pb4005`](#pb4005)                                             | 2000   | —      | —   | 0      | 15   |
| [`pcl1`](#pcl1)                                                 | 0      | —      | —   | 0      | 11   |
| [`pcl2`](#pcl2)                                                 | 12.562 | —      | —   | 0      | 14   |
| [`platform_features`](#platformfeatures)                        | 77     | —      | —   | 0      | 21   |
| [`platform_pages`](#platformpages)                              | 154    | —      | —   | 0      | 25   |
| [`plugin_api_keys`](#pluginapikeys)                             | 1      | ✓      | ✓   | 3      | 15   |
| [`plugin_categories`](#plugincategories)                        | 10     | —      | —   | 1      | 9    |
| [`plugin_configurations`](#pluginconfigurations)                | 0      | ✓      | ✓   | 3      | 9    |
| [`plugin_dependencies`](#plugindependencies)                    | 1      | —      | —   | 2      | 7    |
| [`plugin_hook_executions`](#pluginhookexecutions)               | 0      | ✓      | ✓   | 2      | 12   |
| [`plugin_hooks`](#pluginhooks)                                  | 0      | —      | —   | 1      | 10   |
| [`plugin_installations`](#plugininstallations)                  | 2      | ✓      | ✓   | 4      | 13   |
| [`plugin_reviews`](#pluginreviews)                              | 0      | ✓      | ✓   | 4      | 13   |
| [`plugin_ui_slots`](#pluginuislots)                             | 0      | —      | —   | 1      | 9    |
| [`plugin_versions`](#pluginversions)                            | 7      | —      | —   | 1      | 18   |
| [`plugin_webhook_deliveries`](#pluginwebhookdeliveries)         | 0      | —      | —   | 1      | 13   |
| [`plugin_webhooks`](#pluginwebhooks)                            | 0      | ✓      | ✓   | 3      | 13   |
| [`plugins`](#plugins)                                           | 7      | —      | —   | 2      | 26   |
| [`rag_document_chunks`](#ragdocumentchunks)                     | 0      | ✓      | ✓   | 2      | 14   |
| [`rag_documents`](#ragdocuments)                                | 24     | ✓      | ✓   | 4      | 21   |
| [`rag_knowledge_bases`](#ragknowledgebases)                     | 0      | ✓      | ✓   | 1      | 15   |
| [`rag_messages`](#ragmessages)                                  | 118    | —      | —   | 1      | 20   |
| [`rag_provider_keys`](#ragproviderkeys)                         | 9      | ✓      | ✓   | 1      | 10   |
| [`rag_sessions`](#ragsessions)                                  | 30     | ✓      | ✓   | 3      | 12   |
| [`rag_usage_stats`](#ragusagestats)                             | 248    | ✓      | ✓   | 1      | 12   |
| [`report_definitions`](#reportdefinitions)                      | 6      | ✓      | ✓   | 2      | 21   |
| [`report_delivery_log`](#reportdeliverylog)                     | 108    | ✓      | ✓   | 3      | 10   |
| [`report_executions`](#reportexecutions)                        | 60     | ✓      | ✓   | 3      | 13   |
| [`report_schedules`](#reportschedules)                          | 6      | ✓      | ✓   | 2      | 12   |
| [`report_subscriptions`](#reportsubscriptions)                  | 54     | ✓      | ✓   | 3      | 15   |
| [`sap_config`](#sapconfig)                                      | 49     | —      | —   | 0      | 6    |
| [`sap_delta_sync_log`](#sapdeltasynclog)                        | 0      | ✓      | ✓   | 1      | 14   |
| [`sap_employee_mapping`](#sapemployeemapping)                   | 0      | ✓      | ✓   | 2      | 10   |
| [`sap_infotype_mappings`](#sapinfotypemappings)                 | 0      | ✓      | ✓   | 1      | 19   |
| [`sap_migration_jobs`](#sapmigrationjobs)                       | 0      | ✓      | ✓   | 1      | 26   |
| [`sap_migration_rollback_log`](#sapmigrationrollbacklog)        | 0      | ✓      | ✓   | 2      | 11   |
| [`sap_staged_data`](#sapstageddata)                             | 0      | ✓      | ✓   | 2      | 19   |
| [`schema_migrations`](#schemamigrations)                        | 214    | —      | —   | 0      | 2    |
| [`service_config`](#serviceconfig)                              | 33     | —      | —   | 0      | 7    |
| [`sync_field_mapping`](#syncfieldmapping)                       | 10     | —      | —   | 0      | 10   |
| [`sync_log`](#synclog)                                          | 3      | ✓      | ✓   | 1      | 15   |
| [`sync_queue`](#syncqueue)                                      | 522    | ✓      | ✓   | 1      | 12   |
| [`t001p`](#t001p)                                               | 9      | —      | —   | 0      | 6    |
| [`t005`](#t005)                                                 | 10     | —      | —   | 0      | 8    |
| [`t005s`](#t005s)                                               | 16     | —      | —   | 0      | 5    |
| [`t005t`](#t005t)                                               | 15     | —      | —   | 0      | 6    |
| [`t500c`](#t500c)                                               | 9      | —      | —   | 0      | 7    |
| [`t500p`](#t500p)                                               | 9      | —      | —   | 0      | 6    |
| [`t503`](#t503)                                                 | 6      | —      | —   | 0      | 4    |
| [`t503k`](#t503k)                                               | 12     | —      | —   | 0      | 5    |
| [`t510`](#t510)                                                 | 0      | —      | —   | 0      | 14   |
| [`t510a`](#t510a)                                               | 9      | —      | —   | 0      | 9    |
| [`t510g`](#t510g)                                               | 0      | —      | —   | 0      | 11   |
| [`t512w`](#t512w)                                               | 17     | —      | —   | 0      | 15   |
| [`t513`](#t513)                                                 | 69     | —      | —   | 0      | 6    |
| [`t527x`](#t527x)                                               | 91     | —      | —   | 0      | 5    |
| [`t528b`](#t528b)                                               | 70     | —      | —   | 0      | 6    |
| [`t529a`](#t529a)                                               | 10     | —      | —   | 0      | 4    |
| [`t529g`](#t529g)                                               | 15     | —      | —   | 0      | 5    |
| [`t549a`](#t549a)                                               | 5      | —      | —   | 0      | 11   |
| [`t549q`](#t549q)                                               | 12     | —      | —   | 0      | 11   |
| [`t5ubp`](#t5ubp)                                               | 8      | —      | —   | 0      | 19   |
| [`t771q`](#t771q)                                               | 50     | —      | —   | 0      | 13   |
| [`table_usage_rules`](#tableusagerules)                         | 38     | —      | —   | 0      | 9    |
| [`tenant_sap_mapping`](#tenantsapmapping)                       | 9      | —      | —   | 0      | 8    |
| [`tenant_schema_version`](#tenantschemaversion)                 | 4      | ✓      | ✓   | 2      | 6    |
| [`webhook_deliveries`](#webhookdeliveries)                      | 60     | ✓      | ✓   | 2      | 11   |
| [`webhooks`](#webhooks)                                         | 12     | ✓      | ✓   | 1      | 16   |
| [`widget_catalog`](#widgetcatalog)                              | 27     | —      | —   | 2      | 25   |
| [`widget_templates`](#widgettemplates)                          | 7      | ✓      | ✓   | 1      | 16   |
| [`workspace_templates`](#workspacetemplates)                    | 8      | ✓      | ✓   | 2      | 18   |
| [`workspace_widgets`](#workspacewidgets)                        | 1      | —      | ✓   | 2      | 13   |

---

### `admin_component_registry`

- **Tenant scoped**: yes
- **Row estimate**: 15
- **Domains**: DGOV
- **Prisma model**: `admin_component_registry`
- **RLS**: enabled (forced)

#### Columns

| #   | Column                 | Type         | Null | Default                                | Notes |
| --- | ---------------------- | ------------ | ---- | -------------------------------------- | ----- |
| 1   | `id`                   | uuid         | NO   | `uuid_generate_v4()`                   | PK    |
| 2   | `tenant_id`            | uuid         | YES  | —                                      |       |
| 3   | `code`                 | varchar(100) | NO   | —                                      |       |
| 4   | `name`                 | varchar(200) | NO   | —                                      |       |
| 5   | `description`          | text         | YES  | —                                      |       |
| 6   | `frontend_path`        | text         | NO   | —                                      |       |
| 7   | `export_name`          | varchar(100) | NO   | —                                      |       |
| 8   | `export_kind`          | varchar(20)  | NO   | `'named'::character varying`           |       |
| 9   | `prop_shape`           | jsonb        | NO   | `'{}'::jsonb`                          |       |
| 10  | `functional_area_code` | varchar(50)  | NO   | —                                      |       |
| 11  | `scope_level`          | varchar(20)  | NO   | `'employee'::character varying`        |       |
| 12  | `read_only`            | bool         | NO   | `true`                                 |       |
| 13  | `reuse_contexts`       | \_text       | NO   | `ARRAY['admin'::text, 'portal'::text]` |       |
| 14  | `api_endpoints`        | \_text       | YES  | —                                      |       |
| 15  | `verified_with_data`   | bool         | NO   | `false`                                |       |
| 16  | `verified_at`          | timestamptz  | YES  | —                                      |       |
| 17  | `created_at`           | timestamptz  | YES  | `now()`                                |       |
| 18  | `updated_at`           | timestamptz  | YES  | `now()`                                |       |
| 19  | `name_it`              | varchar(200) | YES  | —                                      |       |
| 20  | `name_en`              | varchar(200) | YES  | —                                      |       |
| 21  | `description_it`       | text         | YES  | —                                      |       |
| 22  | `description_en`       | text         | YES  | —                                      |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns                | References                   | ON UPDATE | ON DELETE | Notes |
| ---------------------- | ---------------------------- | --------- | --------- | ----- |
| `functional_area_code` | `rbp_functional_areas(code)` | NO ACTION | RESTRICT  |       |
| `tenant_id`            | `tenants(id)`                | NO ACTION | CASCADE   |       |

#### Indexes

- `admin_component_registry_pkey` [PRIMARY] · (`id`)
- `admin_component_registry_tenant_id_code_key` [UNIQUE] · (`tenant_id`, `code`)
- `idx_admin_components_area` [INDEX] · (`functional_area_code`)
- `idx_admin_components_tenant` [INDEX] · (`tenant_id`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `((tenant_id IS NULL) OR (tenant_id = current_tenant_id()))`

---

### `crawl_runs`

- **Tenant scoped**: yes
- **Row estimate**: 1
- **Domains**: DGOV
- **Prisma model**: `crawl_runs`
- **RLS**: enabled (forced)

#### Columns

| #   | Column             | Type        | Null | Default                        | Notes |
| --- | ------------------ | ----------- | ---- | ------------------------------ | ----- |
| 1   | `id`               | uuid        | NO   | `gen_random_uuid()`            | PK    |
| 2   | `tenant_id`        | uuid        | NO   | —                              |       |
| 3   | `config_id`        | uuid        | NO   | —                              |       |
| 4   | `status`           | varchar(50) | NO   | `'pending'::character varying` |       |
| 5   | `started_at`       | timestamptz | YES  | —                              |       |
| 6   | `completed_at`     | timestamptz | YES  | —                              |       |
| 7   | `postings_found`   | int4(32)    | YES  | `0`                            |       |
| 8   | `postings_saved`   | int4(32)    | YES  | `0`                            |       |
| 9   | `skills_extracted` | int4(32)    | YES  | `0`                            |       |
| 10  | `errors`           | jsonb       | YES  | `'[]'::jsonb`                  |       |
| 11  | `created_at`       | timestamptz | YES  | `now()`                        |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns     | References            | ON UPDATE | ON DELETE | Notes |
| ----------- | --------------------- | --------- | --------- | ----- |
| `config_id` | `crawler_configs(id)` | NO ACTION | CASCADE   |       |
| `tenant_id` | `tenants(id)`         | NO ACTION | CASCADE   |       |

#### Indexes

- `crawl_runs_pkey` [PRIMARY] · (`id`)
- `idx_crawl_runs_config` [INDEX] · (`config_id`)
- `idx_crawl_runs_status` [INDEX] · (`status`)
- `idx_crawl_runs_tenant` [INDEX] · (`tenant_id`)

#### RLS Policies

- **tenant_insert** (INSERT · PERMISSIVE) · roles: `public`
  - WITH CHECK: `(tenant_id = current_tenant_id())`
- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`

#### Inverse relations (referenced by)

- `job_postings_raw` via (`crawl_run_id`)

---

### `crawler_configs`

- **Tenant scoped**: yes
- **Row estimate**: 1
- **Domains**: DGOV
- **Prisma model**: `crawler_configs`
- **RLS**: enabled (forced)

#### Columns

| #   | Column                | Type         | Null | Default                          | Notes |
| --- | --------------------- | ------------ | ---- | -------------------------------- | ----- |
| 1   | `id`                  | uuid         | NO   | `gen_random_uuid()`              | PK    |
| 2   | `tenant_id`           | uuid         | NO   | —                                |       |
| 3   | `name`                | varchar(255) | NO   | —                                |       |
| 4   | `source`              | varchar(100) | NO   | —                                |       |
| 5   | `is_active`           | bool         | YES  | `true`                           |       |
| 6   | `schedule_cron`       | varchar(100) | YES  | `'0 0 * * 0'::character varying` |       |
| 7   | `search_criteria`     | jsonb        | NO   | `'{}'::jsonb`                    |       |
| 8   | `rate_limit_delay_ms` | int4(32)     | YES  | `5000`                           |       |
| 9   | `max_pages_per_run`   | int4(32)     | YES  | `50`                             |       |
| 10  | `last_run_at`         | timestamptz  | YES  | —                                |       |
| 11  | `last_run_status`     | varchar(50)  | YES  | —                                |       |
| 12  | `last_run_stats`      | jsonb        | YES  | —                                |       |
| 13  | `created_at`          | timestamptz  | YES  | `now()`                          |       |
| 14  | `updated_at`          | timestamptz  | YES  | `now()`                          |       |
| 15  | `deleted_at`          | timestamptz  | YES  | —                                |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns     | References    | ON UPDATE | ON DELETE | Notes |
| ----------- | ------------- | --------- | --------- | ----- |
| `tenant_id` | `tenants(id)` | NO ACTION | CASCADE   |       |

#### Indexes

- `crawler_configs_pkey` [PRIMARY] · (`id`)
- `idx_crawler_configs_active` [INDEX] · (`id`)
- `idx_crawler_configs_source` [INDEX] · (`source`)
- `idx_crawler_configs_tenant` [INDEX] · (`tenant_id`)

#### RLS Policies

- **tenant_insert** (INSERT · PERMISSIVE) · roles: `public`
  - WITH CHECK: `(tenant_id = current_tenant_id())`
- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`

#### Inverse relations (referenced by)

- `crawl_runs` via (`config_id`)

---

### `dashboard_elements`

- **Tenant scoped**: yes
- **Row estimate**: 199
- **Domains**: DGOV
- **Prisma model**: `dashboard_elements`
- **RLS**: enabled (forced)

#### Columns

| #   | Column                | Type        | Null | Default                                          | Notes                                                                                                                                                                                                                                            |
| --- | --------------------- | ----------- | ---- | ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | `id`                  | int8(64)    | NO   | `nextval('dashboard_elements_id_seq'::regclass)` | PK                                                                                                                                                                                                                                               |
| 2   | `dashboard_preset_id` | int8(64)    | NO   | —                                                |                                                                                                                                                                                                                                                  |
| 3   | `widget_catalog_id`   | int4(32)    | YES  | —                                                |                                                                                                                                                                                                                                                  |
| 4   | `widget_code`         | varchar(64) | NO   | —                                                | Stable widget identifier. Either matches widget_catalog.widget_code OR points to a packages/ui atomic component (Phase 13.A): KpiRing, IntegrationHealthPill, SuccessionCard, CareerArc, KgMiniGraph, SkillHeatmap, CapabilityRadar, RbacMatrix. |
| 5   | `position`            | int4(32)    | NO   | —                                                |                                                                                                                                                                                                                                                  |
| 6   | `grid_col_start`      | int4(32)    | NO   | `1`                                              |                                                                                                                                                                                                                                                  |
| 7   | `grid_col_span`       | int4(32)    | NO   | `12`                                             |                                                                                                                                                                                                                                                  |
| 8   | `grid_row_start`      | int4(32)    | NO   | `1`                                              |                                                                                                                                                                                                                                                  |
| 9   | `grid_row_span`       | int4(32)    | NO   | `1`                                              |                                                                                                                                                                                                                                                  |
| 10  | `perspective_code`    | varchar(32) | YES  | —                                                |                                                                                                                                                                                                                                                  |
| 11  | `visibility_min_role` | int4(32)    | NO   | `6`                                              | RBP role level required to render (-1 SUPERUSER ... 6 EMPLOYEE). Default 6 = visible to everyone.                                                                                                                                                |
| 12  | `config_overrides`    | jsonb       | YES  | —                                                |                                                                                                                                                                                                                                                  |
| 13  | `tenant_id`           | uuid        | YES  | —                                                | NULL = platform default seeded; non-NULL = tenant-specific override. RLS enforces P1 isolation on non-NULL rows.                                                                                                                                 |
| 14  | `created_at`          | timestamptz | NO   | `now()`                                          |                                                                                                                                                                                                                                                  |
| 15  | `updated_at`          | timestamptz | NO   | `now()`                                          |                                                                                                                                                                                                                                                  |
| 16  | `parent_element_id`   | int8(64)    | YES  | —                                                | Self-FK per gerarchia slot. NULL = top-level (figlio diretto del preset). Non-NULL = slot figlio (es. left/right di .double-split). Cascade delete: rimuovendo un parent, rimuove tutti i figli.                                                 |
| 17  | `variant`             | varchar(64) | YES  | —                                                | Catalog livello 2 modifier (BEM-like). Es. 'pill-warn', 'tenant-card-platform', 'fill-info', 'heat-6'. NULL = default base senza variant. Validazione lato app contro brand-dashboard-catalog.md.                                                |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns               | References               | ON UPDATE | ON DELETE | Notes |
| --------------------- | ------------------------ | --------- | --------- | ----- |
| `dashboard_preset_id` | `dashboard_presets(id)`  | NO ACTION | CASCADE   |       |
| `parent_element_id`   | `dashboard_elements(id)` | NO ACTION | CASCADE   |       |
| `perspective_code`    | `rbp_perspectives(code)` | CASCADE   | RESTRICT  |       |
| `tenant_id`           | `tenants(id)`            | NO ACTION | CASCADE   |       |

#### Indexes

- `dashboard_elements_pkey` [PRIMARY] · (`id`)
- `dashboard_elements_unique_platform` [UNIQUE] · (`dashboard_preset_id`, `position`)
- `dashboard_elements_unique_tenant` [UNIQUE] · (`dashboard_preset_id`, `position`, `tenant_id`)
- `idx_dashboard_elements_parent` [INDEX] · (`parent_element_id`)
- `idx_dashboard_elements_perspective` [INDEX] · (`perspective_code`)
- `idx_dashboard_elements_preset` [INDEX] · (`dashboard_preset_id`)
- `idx_dashboard_elements_tenant` [INDEX] · (`tenant_id`)

#### RLS Policies

- **dashboard_elements_tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `((tenant_id IS NULL) OR (tenant_id = current_tenant_id()))`
  - WITH CHECK: `((tenant_id IS NULL) OR (tenant_id = current_tenant_id()))`

#### Inverse relations (referenced by)

- `dashboard_elements` via (`parent_element_id`)

---

### `dashboard_presets`

> Phase 13.B — dashboard_presets (registry of mockup-derived templates) + dashboard_elements (widget binding). RLS on dashboard_elements (tenant_id NULL = platform default · non-NULL = tenant override P10).

- **Tenant scoped**: no
- **Row estimate**: 22
- **Domains**: DGOV
- **Prisma model**: `dashboard_presets`

#### Columns

| #   | Column               | Type         | Null | Default                                         | Notes |
| --- | -------------------- | ------------ | ---- | ----------------------------------------------- | ----- |
| 1   | `id`                 | int8(64)     | NO   | `nextval('dashboard_presets_id_seq'::regclass)` | PK    |
| 2   | `code`               | varchar(64)  | NO   | —                                               |       |
| 3   | `name_it`            | varchar(255) | NO   | —                                               |       |
| 4   | `name_en`            | varchar(255) | NO   | —                                               |       |
| 5   | `description_it`     | text         | YES  | —                                               |       |
| 6   | `description_en`     | text         | YES  | —                                               |       |
| 7   | `perspective_code`   | varchar(32)  | NO   | —                                               |       |
| 8   | `source_mockup_path` | text         | YES  | —                                               |       |
| 9   | `rbp_dashboard_code` | varchar(64)  | YES  | —                                               |       |
| 10  | `persona_label`      | varchar(255) | YES  | —                                               |       |
| 11  | `is_published`       | bool         | NO   | `false`                                         |       |
| 12  | `sort_order`         | int4(32)     | NO   | `0`                                             |       |
| 13  | `theme_config`       | jsonb        | YES  | —                                               |       |
| 14  | `created_at`         | timestamptz  | NO   | `now()`                                         |       |
| 15  | `updated_at`         | timestamptz  | NO   | `now()`                                         |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns            | References               | ON UPDATE | ON DELETE | Notes |
| ------------------ | ------------------------ | --------- | --------- | ----- |
| `perspective_code` | `rbp_perspectives(code)` | CASCADE   | RESTRICT  |       |

#### Indexes

- `dashboard_presets_code_key` [UNIQUE] · (`code`)
- `dashboard_presets_pkey` [PRIMARY] · (`id`)
- `idx_dashboard_presets_perspective` [INDEX] · (`perspective_code`)
- `idx_dashboard_presets_published` [INDEX] · (`is_published`)

#### Inverse relations (referenced by)

- `dashboard_elements` via (`dashboard_preset_id`)
- `role_default_dashboards` via (`preset_code`)

---

### `dashboard_widgets`

- **Tenant scoped**: yes
- **Row estimate**: 160
- **Domains**: DGOV
- **Prisma model**: `dashboard_widgets`
- **RLS**: enabled (forced)

#### Columns

| #   | Column             | Type         | Null | Default             | Notes |
| --- | ------------------ | ------------ | ---- | ------------------- | ----- |
| 1   | `id`               | uuid         | NO   | `gen_random_uuid()` | PK    |
| 2   | `tenant_id`        | uuid         | NO   | —                   |       |
| 3   | `dashboard_id`     | uuid         | YES  | —                   |       |
| 4   | `widget_type`      | varchar(50)  | NO   | —                   |       |
| 5   | `title`            | varchar(200) | YES  | —                   |       |
| 6   | `data_source`      | varchar(100) | NO   | —                   |       |
| 7   | `query_config`     | jsonb        | NO   | `'{}'::jsonb`       |       |
| 8   | `display_config`   | jsonb        | NO   | `'{}'::jsonb`       |       |
| 9   | `position_x`       | int4(32)     | YES  | `0`                 |       |
| 10  | `position_y`       | int4(32)     | YES  | `0`                 |       |
| 11  | `width`            | int4(32)     | YES  | `4`                 |       |
| 12  | `height`           | int4(32)     | YES  | `3`                 |       |
| 13  | `refresh_interval` | int4(32)     | YES  | —                   |       |
| 14  | `is_active`        | bool         | YES  | `true`              |       |
| 15  | `created_at`       | timestamptz  | YES  | `now()`             |       |
| 16  | `updated_at`       | timestamptz  | YES  | `now()`             |       |
| 17  | `deleted_at`       | timestamptz  | YES  | —                   |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns        | References       | ON UPDATE | ON DELETE | Notes |
| -------------- | ---------------- | --------- | --------- | ----- |
| `dashboard_id` | `dashboards(id)` | NO ACTION | CASCADE   |       |
| `tenant_id`    | `tenants(id)`    | NO ACTION | CASCADE   |       |

#### Indexes

- `dashboard_widgets_pkey` [PRIMARY] · (`id`)
- `idx_dashboard_widgets_active` [INDEX] · (`id`)
- `idx_widgets_dashboard` [INDEX] · (`dashboard_id`)
- `idx_widgets_tenant` [INDEX] · (`tenant_id`)

#### RLS Policies

- **tenant_isolation_widgets** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`

---

### `dashboards`

- **Tenant scoped**: yes
- **Row estimate**: 20
- **Domains**: DGOV
- **Prisma model**: `dashboards`
- **RLS**: enabled (forced)

#### Columns

| #   | Column              | Type         | Null | Default             | Notes                                                                                           |
| --- | ------------------- | ------------ | ---- | ------------------- | ----------------------------------------------------------------------------------------------- |
| 1   | `id`                | uuid         | NO   | `gen_random_uuid()` | PK                                                                                              |
| 2   | `tenant_id`         | uuid         | NO   | —                   |                                                                                                 |
| 3   | `owner_id`          | uuid         | YES  | —                   |                                                                                                 |
| 4   | `name`              | varchar(100) | NO   | —                   |                                                                                                 |
| 5   | `description`       | text         | YES  | —                   |                                                                                                 |
| 6   | `layout`            | jsonb        | YES  | `'{}'::jsonb`       | JSONB BY DESIGN: widget layout grid configuration.                                              |
| 7   | `is_default`        | bool         | YES  | `false`             |                                                                                                 |
| 8   | `is_shared`         | bool         | YES  | `false`             |                                                                                                 |
| 9   | `shared_with_roles` | jsonb        | YES  | `'[]'::jsonb`       | NORMALIZABLE: should become dashboard_role_access (M:N junction). Contains array of role names. |
| 10  | `created_at`        | timestamptz  | YES  | `now()`             |                                                                                                 |
| 11  | `updated_at`        | timestamptz  | YES  | `now()`             |                                                                                                 |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns     | References           | ON UPDATE | ON DELETE | Notes |
| ----------- | -------------------- | --------- | --------- | ----- |
| `owner_id`  | `employees_core(id)` | NO ACTION | SET NULL  |       |
| `tenant_id` | `tenants(id)`        | NO ACTION | CASCADE   |       |

#### Indexes

- `dashboards_pkey` [PRIMARY] · (`id`)
- `idx_dashboards_owner` [INDEX] · (`owner_id`)
- `idx_dashboards_tenant` [INDEX] · (`tenant_id`)

#### RLS Policies

- **tenant_isolation_dashboards** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`

#### Inverse relations (referenced by)

- `dashboard_widgets` via (`dashboard_id`)

---

### `data_retention_policies`

- **Tenant scoped**: no
- **Row estimate**: 8
- **Domains**: DGOV
- **Prisma model**: `data_retention_policies`

#### Columns

| #   | Column                   | Type         | Null | Default                          | Notes |
| --- | ------------------------ | ------------ | ---- | -------------------------------- | ----- |
| 1   | `id`                     | uuid         | NO   | `gen_random_uuid()`              | PK    |
| 2   | `name`                   | varchar(100) | NO   | —                                |       |
| 3   | `description`            | text         | YES  | —                                |       |
| 4   | `data_type`              | varchar(100) | NO   | —                                |       |
| 5   | `retention_days`         | int4(32)     | NO   | —                                |       |
| 6   | `action_after_retention` | varchar(50)  | YES  | `'anonymize'::character varying` |       |
| 7   | `is_active`              | bool         | YES  | `true`                           |       |
| 8   | `created_at`             | timestamp    | YES  | `now()`                          |       |
| 9   | `updated_at`             | timestamp    | YES  | `now()`                          |       |
| 10  | `deleted_at`             | timestamptz  | YES  | —                                |       |

#### Primary Key

`(`id`)`

#### Indexes

- `data_retention_policies_pkey` [PRIMARY] · (`id`)
- `idx_data_retention_policies_active` [INDEX] · (`id`)

---

### `data_subject_requests`

- **Tenant scoped**: yes
- **Row estimate**: 20
- **Domains**: DGOV
- **Prisma model**: `data_subject_requests`
- **RLS**: enabled (forced)

#### Columns

| #   | Column                     | Type         | Null | Default                        | Notes |
| --- | -------------------------- | ------------ | ---- | ------------------------------ | ----- |
| 1   | `id`                       | uuid         | NO   | `gen_random_uuid()`            | PK    |
| 2   | `request_type`             | varchar(50)  | NO   | —                              |       |
| 3   | `subject_email`            | varchar(255) | NO   | —                              |       |
| 4   | `subject_id`               | uuid         | YES  | —                              |       |
| 5   | `status`                   | varchar(50)  | YES  | `'pending'::character varying` |       |
| 6   | `requested_at`             | timestamp    | YES  | `now()`                        |       |
| 7   | `due_date`                 | date         | YES  | —                              |       |
| 8   | `completed_at`             | timestamp    | YES  | —                              |       |
| 9   | `completed_by`             | uuid         | YES  | —                              |       |
| 10  | `notes`                    | text         | YES  | —                              |       |
| 11  | `response_data`            | jsonb        | YES  | —                              |       |
| 12  | `tenant_id`                | uuid         | NO   | —                              |       |
| 13  | `completed_by_employee_id` | uuid         | YES  | —                              |       |
| 14  | `created_at`               | timestamptz  | YES  | `now()`                        |       |
| 15  | `updated_at`               | timestamptz  | YES  | `now()`                        |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns                    | References           | ON UPDATE | ON DELETE | Notes |
| -------------------------- | -------------------- | --------- | --------- | ----- |
| `completed_by_employee_id` | `employees_core(id)` | NO ACTION | SET NULL  |       |
| `tenant_id`                | `tenants(id)`        | NO ACTION | CASCADE   |       |

#### Indexes

- `data_subject_requests_pkey` [PRIMARY] · (`id`)
- `idx_data_subject_requests_completed_by_employee_id` [INDEX] · (`completed_by_employee_id`)
- `idx_dsr_due` [INDEX] · (`due_date`)
- `idx_dsr_email` [INDEX] · (`subject_email`)
- `idx_dsr_status` [INDEX] · (`status`)
- `idx_dsr_tenant` [INDEX] · (`tenant_id`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

---

### `db_table_registry`

- **Tenant scoped**: no
- **Row estimate**: 503
- **Domains**: DGOV
- **Prisma model**: `db_table_registry`

#### Columns

| #   | Column           | Type         | Null | Default                         | Notes |
| --- | ---------------- | ------------ | ---- | ------------------------------- | ----- |
| 1   | `table_name`     | varchar(128) | NO   | —                               | PK    |
| 2   | `table_category` | varchar(50)  | NO   | `'business'::character varying` |       |
| 3   | `module`         | varchar(50)  | YES  | —                               |       |
| 4   | `row_count`      | int8(64)     | YES  | `0`                             |       |
| 5   | `column_count`   | int4(32)     | YES  | `0`                             |       |
| 6   | `has_tenant_id`  | bool         | YES  | `false`                         |       |
| 7   | `has_rls`        | bool         | YES  | `false`                         |       |
| 8   | `has_created_at` | bool         | YES  | `false`                         |       |
| 9   | `has_updated_at` | bool         | YES  | `false`                         |       |
| 10  | `fk_out_count`   | int4(32)     | YES  | `0`                             |       |
| 11  | `fk_in_count`    | int4(32)     | YES  | `0`                             |       |
| 12  | `last_synced_at` | timestamptz  | NO   | `now()`                         |       |
| 13  | `created_at`     | timestamptz  | NO   | `now()`                         |       |

#### Primary Key

`(`table_name`)`

#### Indexes

- `db_table_registry_pkey` [PRIMARY] · (`table_name`)

---

### `document_acknowledgments`

- **Tenant scoped**: yes
- **Row estimate**: 250
- **Domains**: DGOV
- **Prisma model**: `document_acknowledgments`
- **RLS**: enabled (forced)

#### Columns

| #   | Column            | Type        | Null | Default             | Notes |
| --- | ----------------- | ----------- | ---- | ------------------- | ----- |
| 1   | `id`              | uuid        | NO   | `gen_random_uuid()` | PK    |
| 2   | `tenant_id`       | uuid        | NO   | —                   |       |
| 3   | `document_id`     | uuid        | NO   | —                   |       |
| 4   | `employee_id`     | uuid        | NO   | —                   |       |
| 5   | `acknowledged_at` | timestamp   | YES  | `CURRENT_TIMESTAMP` |       |
| 6   | `ip_address`      | varchar(45) | YES  | —                   |       |
| 7   | `user_agent`      | text        | YES  | —                   |       |
| 8   | `created_at`      | timestamptz | YES  | `now()`             |       |
| 9   | `updated_at`      | timestamptz | YES  | `now()`             |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns       | References               | ON UPDATE | ON DELETE | Notes |
| ------------- | ------------------------ | --------- | --------- | ----- |
| `document_id` | `employee_documents(id)` | NO ACTION | CASCADE   |       |
| `employee_id` | `employees_core(id)`     | NO ACTION | CASCADE   |       |
| `tenant_id`   | `tenants(id)`            | NO ACTION | CASCADE   |       |

#### Indexes

- `document_acknowledgments_document_id_employee_id_key` [UNIQUE] · (`document_id`, `employee_id`)
- `document_acknowledgments_pkey` [PRIMARY] · (`id`)
- `idx_document_acknowledgments_tenant_id` [INDEX] · (`tenant_id`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

---

### `document_comments`

- **Tenant scoped**: no
- **Row estimate**: 15
- **Domains**: DGOV
- **Prisma model**: `document_comments`

#### Columns

| #   | Column                | Type        | Null | Default             | Notes |
| --- | --------------------- | ----------- | ---- | ------------------- | ----- |
| 1   | `id`                  | uuid        | NO   | `gen_random_uuid()` | PK    |
| 2   | `document_id`         | uuid        | NO   | —                   |       |
| 3   | `version_id`          | uuid        | YES  | —                   |       |
| 4   | `user_id`             | uuid        | NO   | —                   |       |
| 5   | `comment`             | text        | NO   | —                   |       |
| 6   | `created_at`          | timestamptz | YES  | `now()`             |       |
| 7   | `updated_at`          | timestamptz | YES  | `now()`             |       |
| 8   | `is_resolved`         | bool        | YES  | `false`             |       |
| 9   | `user_id_employee_id` | uuid        | YES  | —                   |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns               | References           | ON UPDATE | ON DELETE | Notes |
| --------------------- | -------------------- | --------- | --------- | ----- |
| `document_id`         | `rag_documents(id)`  | NO ACTION | CASCADE   |       |
| `user_id_employee_id` | `employees_core(id)` | NO ACTION | SET NULL  |       |
| `user_id`             | `users(id)`          | NO ACTION | SET NULL  |       |

#### Indexes

- `document_comments_pkey` [PRIMARY] · (`id`)
- `idx_document_comments_doc` [INDEX] · (`document_id`)
- `idx_document_comments_user_id` [INDEX] · (`user_id`)
- `idx_document_comments_user_id_employee_id` [INDEX] · (`user_id_employee_id`)

---

### `document_locks`

- **Tenant scoped**: no
- **Row estimate**: 0
- **Domains**: DGOV
- **Prisma model**: `document_locks`

#### Columns

| #   | Column                  | Type        | Null | Default             | Notes |
| --- | ----------------------- | ----------- | ---- | ------------------- | ----- |
| 1   | `id`                    | uuid        | NO   | `gen_random_uuid()` | PK    |
| 2   | `document_id`           | uuid        | NO   | —                   |       |
| 3   | `locked_by`             | uuid        | NO   | —                   |       |
| 4   | `locked_at`             | timestamptz | YES  | `now()`             |       |
| 5   | `lock_reason`           | text        | YES  | —                   |       |
| 6   | `expires_at`            | timestamptz | YES  | —                   |       |
| 7   | `locked_by_employee_id` | uuid        | YES  | —                   |       |
| 8   | `created_at`            | timestamptz | YES  | `now()`             |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns                 | References           | ON UPDATE | ON DELETE | Notes |
| ----------------------- | -------------------- | --------- | --------- | ----- |
| `document_id`           | `rag_documents(id)`  | NO ACTION | CASCADE   |       |
| `locked_by_employee_id` | `employees_core(id)` | NO ACTION | SET NULL  |       |

#### Indexes

- `document_locks_document_id_key` [UNIQUE] · (`document_id`)
- `document_locks_pkey` [PRIMARY] · (`id`)
- `idx_document_locks_locked_by_employee_id` [INDEX] · (`locked_by_employee_id`)

---

### `document_requests`

- **Tenant scoped**: yes
- **Row estimate**: 15
- **Domains**: DGOV
- **Prisma model**: `document_requests`
- **RLS**: enabled (forced)

#### Columns

| #   | Column               | Type        | Null | Default                        | Notes |
| --- | -------------------- | ----------- | ---- | ------------------------------ | ----- |
| 1   | `id`                 | uuid        | NO   | `gen_random_uuid()`            | PK    |
| 2   | `tenant_id`          | uuid        | NO   | —                              |       |
| 3   | `employee_id`        | uuid        | NO   | —                              |       |
| 4   | `document_type`      | varchar(50) | NO   | —                              |       |
| 5   | `purpose`            | text        | YES  | —                              |       |
| 6   | `additional_notes`   | text        | YES  | —                              |       |
| 7   | `status`             | varchar(20) | YES  | `'pending'::character varying` |       |
| 8   | `priority`           | varchar(20) | YES  | `'normal'::character varying`  |       |
| 9   | `assigned_to`        | uuid        | YES  | —                              |       |
| 10  | `assigned_at`        | timestamp   | YES  | —                              |       |
| 11  | `completed_at`       | timestamp   | YES  | —                              |       |
| 12  | `rejection_reason`   | text        | YES  | —                              |       |
| 13  | `result_document_id` | uuid        | YES  | —                              |       |
| 14  | `created_at`         | timestamp   | YES  | `CURRENT_TIMESTAMP`            |       |
| 15  | `updated_at`         | timestamp   | YES  | `CURRENT_TIMESTAMP`            |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns              | References               | ON UPDATE | ON DELETE | Notes |
| -------------------- | ------------------------ | --------- | --------- | ----- |
| `assigned_to`        | `employees_core(id)`     | NO ACTION | SET NULL  |       |
| `employee_id`        | `employees_core(id)`     | NO ACTION | CASCADE   |       |
| `result_document_id` | `employee_documents(id)` | NO ACTION | CASCADE   |       |
| `tenant_id`          | `tenants(id)`            | NO ACTION | CASCADE   |       |

#### Indexes

- `document_requests_pkey` [PRIMARY] · (`id`)
- `idx_document_requests_assigned` [INDEX] · (`assigned_to`)
- `idx_document_requests_employee` [INDEX] · (`employee_id`)
- `idx_document_requests_result_document_id` [INDEX] · (`result_document_id`)
- `idx_document_requests_status` [INDEX] · (`status`)
- `idx_document_requests_tenant` [INDEX] · (`tenant_id`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

---

### `document_versions`

- **Tenant scoped**: no
- **Row estimate**: 24
- **Domains**: DGOV
- **Prisma model**: `document_versions`

#### Columns

| #   | Column                   | Type         | Null | Default             | Notes |
| --- | ------------------------ | ------------ | ---- | ------------------- | ----- |
| 1   | `id`                     | uuid         | NO   | `gen_random_uuid()` | PK    |
| 2   | `document_id`            | uuid         | NO   | —                   |       |
| 3   | `version`                | int4(32)     | NO   | —                   |       |
| 4   | `filename`               | varchar(255) | NO   | —                   |       |
| 5   | `file_path`              | varchar(500) | NO   | —                   |       |
| 6   | `file_size`              | int4(32)     | YES  | —                   |       |
| 7   | `checksum`               | varchar(64)  | YES  | —                   |       |
| 8   | `version_notes`          | text         | YES  | —                   |       |
| 9   | `created_by`             | uuid         | YES  | —                   |       |
| 10  | `created_at`             | timestamptz  | YES  | `now()`             |       |
| 11  | `is_active`              | bool         | YES  | `true`              |       |
| 12  | `created_by_employee_id` | uuid         | YES  | —                   |       |
| 13  | `deleted_at`             | timestamptz  | YES  | —                   |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns                  | References           | ON UPDATE | ON DELETE | Notes |
| ------------------------ | -------------------- | --------- | --------- | ----- |
| `created_by_employee_id` | `employees_core(id)` | NO ACTION | SET NULL  |       |
| `document_id`            | `rag_documents(id)`  | NO ACTION | CASCADE   |       |

#### Indexes

- `document_versions_pkey` [PRIMARY] · (`id`)
- `idx_document_versions_active` [INDEX] · (`id`)
- `idx_document_versions_created_by_employee_id` [INDEX] · (`created_by_employee_id`)
- `idx_document_versions_version` [INDEX] · (`document_id`, `version`)

---

### `enrichment_candidates`

- **Tenant scoped**: yes
- **Row estimate**: 38
- **Domains**: DGOV
- **Prisma model**: `enrichment_candidates`
- **RLS**: enabled (forced)

#### Columns

| #   | Column               | Type         | Null | Default              | Notes |
| --- | -------------------- | ------------ | ---- | -------------------- | ----- |
| 1   | `id`                 | uuid         | NO   | `uuid_generate_v4()` | PK    |
| 2   | `tenant_id`          | uuid         | NO   | —                    |       |
| 3   | `job_id`             | uuid         | NO   | —                    |       |
| 4   | `source_snapshot_id` | uuid         | YES  | —                    |       |
| 5   | `entity_type`        | varchar(100) | NO   | —                    |       |
| 6   | `entity_anchor`      | varchar(500) | YES  | —                    |       |
| 7   | `field_name`         | varchar(100) | NO   | —                    |       |
| 8   | `candidate_value`    | jsonb        | NO   | —                    |       |
| 9   | `confidence`         | numeric(3,2) | NO   | `0`                  |       |
| 10  | `extraction_method`  | varchar(50)  | NO   | —                    |       |
| 11  | `llm_provider_code`  | varchar(50)  | YES  | —                    |       |
| 12  | `fact_hash`          | bpchar(64)   | NO   | —                    |       |
| 13  | `created_at`         | timestamptz  | NO   | `now()`              |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns              | References                        | ON UPDATE | ON DELETE | Notes |
| -------------------- | --------------------------------- | --------- | --------- | ----- |
| `job_id`             | `enrichment_jobs(id)`             | NO ACTION | CASCADE   |       |
| `llm_provider_code`  | `enrichment_llm_providers(code)`  | NO ACTION | CASCADE   |       |
| `source_snapshot_id` | `enrichment_source_snapshots(id)` | NO ACTION | SET NULL  |       |
| `tenant_id`          | `tenants(id)`                     | NO ACTION | CASCADE   |       |

#### Indexes

- `enrichment_candidates_fact_hash_unique` [UNIQUE] · (`tenant_id`, `fact_hash`)
- `enrichment_candidates_pkey` [PRIMARY] · (`id`)
- `idx_enrichment_candidates_field` [INDEX] · (`entity_type`, `field_name`, `confidence`)
- `idx_enrichment_candidates_job` [INDEX] · (`job_id`)
- `idx_enrichment_candidates_llm_provider_code` [INDEX] · (`llm_provider_code`)
- `idx_enrichment_candidates_source_snapshot_id` [INDEX] · (`source_snapshot_id`)

#### RLS Policies

- **enrichment_candidates_tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `((tenant_id IS NULL) OR (tenant_id = COALESCE((NULLIF(current_setting('app.current_tenant_id'::text, true), ''::text))::uuid, tenant_id)))`

#### Inverse relations (referenced by)

- `enrichment_lineage` via (`candidate_id`)
- `enrichment_matches` via (`candidate_id`)
- `enrichment_writes` via (`candidate_id`)

---

### `enrichment_entity_descriptors`

- **Tenant scoped**: yes
- **Row estimate**: 3
- **Domains**: DGOV
- **Prisma model**: `enrichment_entity_descriptors`
- **RLS**: enabled (forced)

#### Columns

| #   | Column                    | Type         | Null | Default                         | Notes                                                                             |
| --- | ------------------------- | ------------ | ---- | ------------------------------- | --------------------------------------------------------------------------------- |
| 1   | `id`                      | uuid         | NO   | `uuid_generate_v4()`            | PK                                                                                |
| 2   | `tenant_id`               | uuid         | YES  | —                               |                                                                                   |
| 3   | `entity_name`             | varchar(100) | NO   | —                               |                                                                                   |
| 4   | `target_table`            | varchar(100) | NO   | —                               |                                                                                   |
| 5   | `pk_field`                | varchar(100) | NO   | `'id'::character varying`       |                                                                                   |
| 6   | `match_keys`              | \_text       | NO   | `'{}'::text[]`                  |                                                                                   |
| 7   | `source_strategy_jsonb`   | jsonb        | NO   | `'{}'::jsonb`                   |                                                                                   |
| 8   | `extraction_schema_id`    | uuid         | YES  | —                               |                                                                                   |
| 9   | `default_merge_policy_id` | uuid         | YES  | —                               |                                                                                   |
| 10  | `default_mode`            | varchar(20)  | NO   | `'suggest'::character varying`  |                                                                                   |
| 11  | `scope_level`             | varchar(20)  | NO   | `'platform'::character varying` |                                                                                   |
| 12  | `is_active`               | bool         | NO   | `true`                          |                                                                                   |
| 13  | `description`             | text         | YES  | —                               |                                                                                   |
| 14  | `created_at`              | timestamptz  | NO   | `now()`                         |                                                                                   |
| 15  | `updated_at`              | timestamptz  | NO   | `now()`                         |                                                                                   |
| 16  | `crawl_config`            | jsonb        | NO   | `'{}'::jsonb`                   | P9 data-driven crawl settings: max_depth, max_pages, include_paths, exclude_paths |
| 17  | `description_it`          | text         | YES  | —                               |                                                                                   |
| 18  | `description_en`          | text         | YES  | —                               |                                                                                   |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns                   | References                          | ON UPDATE | ON DELETE | Notes |
| ------------------------- | ----------------------------------- | --------- | --------- | ----- |
| `default_merge_policy_id` | `enrichment_merge_policies(id)`     | NO ACTION | RESTRICT  |       |
| `extraction_schema_id`    | `enrichment_extraction_schemas(id)` | NO ACTION | RESTRICT  |       |
| `tenant_id`               | `tenants(id)`                       | NO ACTION | CASCADE   |       |

#### Indexes

- `enrichment_entity_descriptors_pkey` [PRIMARY] · (`id`)
- `enrichment_entity_descriptors_unique` [UNIQUE] · (`tenant_id`, `entity_name`)
- `idx_enrichment_entity_descriptors_default_merge_policy_id` [INDEX] · (`default_merge_policy_id`)
- `idx_enrichment_entity_descriptors_extraction_schema_id` [INDEX] · (`extraction_schema_id`)
- `idx_enrichment_entity_descriptors_target` [INDEX] · (`target_table`, `is_active`)

#### RLS Policies

- **enrichment_entity_descriptors_tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `((tenant_id IS NULL) OR (tenant_id = COALESCE((NULLIF(current_setting('app.current_tenant_id'::text, true), ''::text))::uuid, tenant_id)))`

#### Inverse relations (referenced by)

- `enrichment_jobs` via (`descriptor_id`)

---

### `enrichment_extraction_schemas`

> This model contains an index with non-default null sort order and requires additional setup for migrations. Visit https://pris.ly/d/default-index-null-ordering for more info.

- **Tenant scoped**: yes
- **Row estimate**: 2
- **Domains**: DGOV
- **Prisma model**: `enrichment_extraction_schemas`
- **RLS**: enabled (forced)

#### Columns

| #   | Column         | Type         | Null | Default              | Notes |
| --- | -------------- | ------------ | ---- | -------------------- | ----- |
| 1   | `id`           | uuid         | NO   | `uuid_generate_v4()` | PK    |
| 2   | `tenant_id`    | uuid         | YES  | —                    |       |
| 3   | `code`         | varchar(100) | NO   | —                    |       |
| 4   | `version`      | int4(32)     | NO   | `1`                  |       |
| 5   | `schema_jsonb` | jsonb        | NO   | —                    |       |
| 6   | `description`  | text         | YES  | —                    |       |
| 7   | `is_active`    | bool         | NO   | `true`               |       |
| 8   | `created_at`   | timestamptz  | NO   | `now()`              |       |
| 9   | `updated_at`   | timestamptz  | NO   | `now()`              |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns     | References    | ON UPDATE | ON DELETE | Notes |
| ----------- | ------------- | --------- | --------- | ----- |
| `tenant_id` | `tenants(id)` | NO ACTION | CASCADE   |       |

#### Indexes

- `enrichment_extraction_schemas_pkey` [PRIMARY] · (`id`)
- `enrichment_extraction_schemas_unique` [UNIQUE] · (`tenant_id`, `code`, `version`)
- `idx_enrichment_extraction_schemas_code` [INDEX] · (`code`, `tenant_id`)

#### RLS Policies

- **enrichment_extraction_schemas_tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `((tenant_id IS NULL) OR (tenant_id = COALESCE((NULLIF(current_setting('app.current_tenant_id'::text, true), ''::text))::uuid, tenant_id)))`

#### Inverse relations (referenced by)

- `enrichment_entity_descriptors` via (`extraction_schema_id`)

---

### `enrichment_job_events`

- **Tenant scoped**: yes
- **Row estimate**: 91
- **Domains**: DGOV
- **Prisma model**: `enrichment_job_events`
- **RLS**: enabled (forced)

#### Columns

| #   | Column          | Type        | Null | Default                                             | Notes |
| --- | --------------- | ----------- | ---- | --------------------------------------------------- | ----- |
| 1   | `id`            | int8(64)    | NO   | `nextval('enrichment_job_events_id_seq'::regclass)` | PK    |
| 2   | `job_id`        | uuid        | NO   | —                                                   |       |
| 3   | `tenant_id`     | uuid        | NO   | —                                                   |       |
| 4   | `event_type`    | varchar(50) | NO   | —                                                   |       |
| 5   | `payload_jsonb` | jsonb       | YES  | —                                                   |       |
| 6   | `created_at`    | timestamptz | NO   | `now()`                                             |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns     | References            | ON UPDATE | ON DELETE | Notes |
| ----------- | --------------------- | --------- | --------- | ----- |
| `job_id`    | `enrichment_jobs(id)` | NO ACTION | CASCADE   |       |
| `tenant_id` | `tenants(id)`         | NO ACTION | CASCADE   |       |

#### Indexes

- `enrichment_job_events_pkey` [PRIMARY] · (`id`)
- `idx_enrichment_job_events_job` [INDEX] · (`job_id`, `created_at`)
- `idx_enrichment_job_events_tenant_id` [INDEX] · (`tenant_id`)

#### RLS Policies

- **enrichment_job_events_tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `((tenant_id IS NULL) OR (tenant_id = COALESCE((NULLIF(current_setting('app.current_tenant_id'::text, true), ''::text))::uuid, tenant_id)))`

---

### `enrichment_jobs`

- **Tenant scoped**: yes
- **Row estimate**: 18
- **Domains**: DGOV
- **Prisma model**: `enrichment_jobs`
- **RLS**: enabled (forced)

#### Columns

| #   | Column                 | Type          | Null | Default                        | Notes |
| --- | ---------------------- | ------------- | ---- | ------------------------------ | ----- |
| 1   | `id`                   | uuid          | NO   | `uuid_generate_v4()`           | PK    |
| 2   | `tenant_id`            | uuid          | NO   | —                              |       |
| 3   | `descriptor_id`        | uuid          | NO   | —                              |       |
| 4   | `target_table`         | varchar(100)  | NO   | —                              |       |
| 5   | `target_pk_field`      | varchar(100)  | NO   | —                              |       |
| 6   | `target_record_id`     | text          | NO   | —                              |       |
| 7   | `semantic_scope_jsonb` | jsonb         | NO   | `'{}'::jsonb`                  |       |
| 8   | `policy_id`            | uuid          | YES  | —                              |       |
| 9   | `mode`                 | varchar(20)   | NO   | `'suggest'::character varying` |       |
| 10  | `idempotency_key`      | varchar(64)   | NO   | —                              |       |
| 11  | `status`               | varchar(30)   | NO   | `'pending'::character varying` |       |
| 12  | `requested_by_user_id` | uuid          | YES  | —                              |       |
| 13  | `freshness_days`       | int4(32)      | NO   | `7`                            |       |
| 14  | `llm_cost_eur`         | numeric(10,4) | NO   | `0`                            |       |
| 15  | `error_details`        | jsonb         | YES  | —                              |       |
| 16  | `created_at`           | timestamptz   | NO   | `now()`                        |       |
| 17  | `completed_at`         | timestamptz   | YES  | —                              |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns                | References                          | ON UPDATE | ON DELETE | Notes |
| ---------------------- | ----------------------------------- | --------- | --------- | ----- |
| `descriptor_id`        | `enrichment_entity_descriptors(id)` | NO ACTION | RESTRICT  |       |
| `policy_id`            | `enrichment_merge_policies(id)`     | NO ACTION | RESTRICT  |       |
| `requested_by_user_id` | `users(id)`                         | NO ACTION | SET NULL  |       |
| `tenant_id`            | `tenants(id)`                       | NO ACTION | CASCADE   |       |

#### Indexes

- `enrichment_jobs_idempotency_unique` [UNIQUE] · (`tenant_id`, `idempotency_key`)
- `enrichment_jobs_pkey` [PRIMARY] · (`id`)
- `idx_enrichment_jobs_descriptor_id` [INDEX] · (`descriptor_id`)
- `idx_enrichment_jobs_policy_id` [INDEX] · (`policy_id`)
- `idx_enrichment_jobs_requested_by_user_id` [INDEX] · (`requested_by_user_id`)
- `idx_enrichment_jobs_target` [INDEX] · (`target_table`, `target_record_id`)
- `idx_enrichment_jobs_tenant_status` [INDEX] · (`tenant_id`, `status`, `created_at`)

#### RLS Policies

- **enrichment_jobs_tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `((tenant_id IS NULL) OR (tenant_id = COALESCE((NULLIF(current_setting('app.current_tenant_id'::text, true), ''::text))::uuid, tenant_id)))`

#### Inverse relations (referenced by)

- `enrichment_candidates` via (`job_id`)
- `enrichment_job_events` via (`job_id`)
- `enrichment_lineage` via (`job_id`)
- `enrichment_matches` via (`job_id`)
- `enrichment_merges` via (`job_id`)
- `enrichment_observations` via (`job_id`)
- `enrichment_sources` via (`job_id`)
- `enrichment_writes` via (`job_id` · `rolled_back_by`)

---

### `enrichment_lineage`

- **Tenant scoped**: yes
- **Row estimate**: 0
- **Domains**: DGOV
- **Prisma model**: `enrichment_lineage`
- **RLS**: enabled (forced)

#### Columns

| #   | Column           | Type        | Null | Default              | Notes |
| --- | ---------------- | ----------- | ---- | -------------------- | ----- |
| 1   | `id`             | uuid        | NO   | `uuid_generate_v4()` | PK    |
| 2   | `tenant_id`      | uuid        | NO   | —                    |       |
| 3   | `job_id`         | uuid        | NO   | —                    |       |
| 4   | `candidate_id`   | uuid        | YES  | —                    |       |
| 5   | `match_id`       | uuid        | YES  | —                    |       |
| 6   | `merge_id`       | uuid        | YES  | —                    |       |
| 7   | `observation_id` | uuid        | YES  | —                    |       |
| 8   | `lineage_type`   | varchar(50) | NO   | —                    |       |
| 9   | `created_at`     | timestamptz | NO   | `now()`              |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns          | References                    | ON UPDATE | ON DELETE | Notes |
| ---------------- | ----------------------------- | --------- | --------- | ----- |
| `candidate_id`   | `enrichment_candidates(id)`   | NO ACTION | SET NULL  |       |
| `job_id`         | `enrichment_jobs(id)`         | NO ACTION | CASCADE   |       |
| `match_id`       | `enrichment_matches(id)`      | NO ACTION | SET NULL  |       |
| `merge_id`       | `enrichment_merges(id)`       | NO ACTION | SET NULL  |       |
| `observation_id` | `enrichment_observations(id)` | NO ACTION | SET NULL  |       |
| `tenant_id`      | `tenants(id)`                 | NO ACTION | CASCADE   |       |

#### Indexes

- `enrichment_lineage_pkey` [PRIMARY] · (`id`)
- `idx_enrichment_lineage_candidate_id` [INDEX] · (`candidate_id`)
- `idx_enrichment_lineage_job` [INDEX] · (`job_id`)
- `idx_enrichment_lineage_match_id` [INDEX] · (`match_id`)
- `idx_enrichment_lineage_merge` [INDEX] · (`merge_id`)
- `idx_enrichment_lineage_observation_id` [INDEX] · (`observation_id`)
- `idx_enrichment_lineage_tenant_id` [INDEX] · (`tenant_id`)

#### RLS Policies

- **enrichment_lineage_tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `((tenant_id IS NULL) OR (tenant_id = COALESCE((NULLIF(current_setting('app.current_tenant_id'::text, true), ''::text))::uuid, tenant_id)))`

---

### `enrichment_llm_providers`

- **Tenant scoped**: no
- **Row estimate**: 3
- **Domains**: DGOV
- **Prisma model**: `enrichment_llm_providers`

#### Columns

| #   | Column                       | Type          | Null | Default                                                | Notes |
| --- | ---------------------------- | ------------- | ---- | ------------------------------------------------------ | ----- |
| 1   | `id`                         | int4(32)      | NO   | `nextval('enrichment_llm_providers_id_seq'::regclass)` | PK    |
| 2   | `code`                       | varchar(50)   | NO   | —                                                      |       |
| 3   | `display_name`               | varchar(100)  | NO   | —                                                      |       |
| 4   | `api_key_env_ref`            | varchar(100)  | NO   | —                                                      |       |
| 5   | `base_url`                   | varchar(500)  | YES  | —                                                      |       |
| 6   | `default_model`              | varchar(100)  | NO   | —                                                      |       |
| 7   | `priority`                   | int4(32)      | NO   | `100`                                                  |       |
| 8   | `is_active`                  | bool          | NO   | `true`                                                 |       |
| 9   | `cost_per_1k_input_tokens`   | numeric(10,6) | NO   | `0`                                                    |       |
| 10  | `cost_per_1k_output_tokens`  | numeric(10,6) | NO   | `0`                                                    |       |
| 11  | `supports_structured_output` | bool          | NO   | `false`                                                |       |
| 12  | `notes`                      | text          | YES  | —                                                      |       |
| 13  | `created_at`                 | timestamptz   | NO   | `now()`                                                |       |
| 14  | `updated_at`                 | timestamptz   | NO   | `now()`                                                |       |

#### Primary Key

`(`id`)`

#### Indexes

- `enrichment_llm_providers_code_key` [UNIQUE] · (`code`)
- `enrichment_llm_providers_pkey` [PRIMARY] · (`id`)
- `idx_enrichment_llm_providers_active` [INDEX] · (`is_active`, `priority`)

#### Inverse relations (referenced by)

- `enrichment_candidates` via (`llm_provider_code`)

---

### `enrichment_matches`

- **Tenant scoped**: yes
- **Row estimate**: 0
- **Domains**: DGOV
- **Prisma model**: `enrichment_matches`
- **RLS**: enabled (forced)

#### Columns

| #   | Column                | Type         | Null | Default              | Notes |
| --- | --------------------- | ------------ | ---- | -------------------- | ----- |
| 1   | `id`                  | uuid         | NO   | `uuid_generate_v4()` | PK    |
| 2   | `tenant_id`           | uuid         | NO   | —                    |       |
| 3   | `job_id`              | uuid         | NO   | —                    |       |
| 4   | `candidate_id`        | uuid         | NO   | —                    |       |
| 5   | `target_table`        | varchar(100) | NO   | —                    |       |
| 6   | `target_pk_field`     | varchar(100) | NO   | —                    |       |
| 7   | `target_record_id`    | text         | NO   | —                    |       |
| 8   | `match_score`         | numeric(3,2) | NO   | `0`                  |       |
| 9   | `match_reason`        | jsonb        | YES  | —                    |       |
| 10  | `accepted`            | bool         | NO   | `false`              |       |
| 11  | `reviewed_at`         | timestamptz  | YES  | —                    |       |
| 12  | `reviewed_by_user_id` | uuid         | YES  | —                    |       |
| 13  | `created_at`          | timestamptz  | NO   | `now()`              |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns               | References                  | ON UPDATE | ON DELETE | Notes |
| --------------------- | --------------------------- | --------- | --------- | ----- |
| `candidate_id`        | `enrichment_candidates(id)` | NO ACTION | CASCADE   |       |
| `job_id`              | `enrichment_jobs(id)`       | NO ACTION | CASCADE   |       |
| `reviewed_by_user_id` | `users(id)`                 | NO ACTION | SET NULL  |       |
| `tenant_id`           | `tenants(id)`               | NO ACTION | CASCADE   |       |

#### Indexes

- `enrichment_matches_pkey` [PRIMARY] · (`id`)
- `idx_enrichment_matches_candidate_id` [INDEX] · (`candidate_id`)
- `idx_enrichment_matches_job` [INDEX] · (`job_id`, `accepted`)
- `idx_enrichment_matches_reviewed_by_user_id` [INDEX] · (`reviewed_by_user_id`)
- `idx_enrichment_matches_target` [INDEX] · (`target_table`, `target_record_id`)
- `idx_enrichment_matches_tenant_id` [INDEX] · (`tenant_id`)

#### RLS Policies

- **enrichment_matches_tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `((tenant_id IS NULL) OR (tenant_id = COALESCE((NULLIF(current_setting('app.current_tenant_id'::text, true), ''::text))::uuid, tenant_id)))`

#### Inverse relations (referenced by)

- `enrichment_lineage` via (`match_id`)
- `enrichment_merges` via (`match_id`)

---

### `enrichment_merge_policies`

> This model contains an index with non-default null sort order and requires additional setup for migrations. Visit https://pris.ly/d/default-index-null-ordering for more info.

- **Tenant scoped**: yes
- **Row estimate**: 2
- **Domains**: DGOV
- **Prisma model**: `enrichment_merge_policies`
- **RLS**: enabled (forced)

#### Columns

| #   | Column                  | Type          | Null | Default               | Notes                                                   |
| --- | ----------------------- | ------------- | ---- | --------------------- | ------------------------------------------------------- |
| 1   | `id`                    | uuid          | NO   | `uuid_generate_v4()`  | PK                                                      |
| 2   | `tenant_id`             | uuid          | YES  | —                     |                                                         |
| 3   | `code`                  | varchar(100)  | NO   | —                     |                                                         |
| 4   | `version`               | int4(32)      | NO   | `1`                   |                                                         |
| 5   | `rules_jsonb`           | jsonb         | NO   | —                     |                                                         |
| 6   | `budget_cap_eur`        | numeric(10,2) | NO   | `10.00`               |                                                         |
| 7   | `current_usage_eur`     | numeric(10,2) | NO   | `0`                   |                                                         |
| 8   | `budget_reset_at`       | timestamptz   | NO   | `now()`               |                                                         |
| 9   | `description`           | text          | YES  | —                     |                                                         |
| 10  | `is_active`             | bool          | NO   | `true`                |                                                         |
| 11  | `created_at`            | timestamptz   | NO   | `now()`               |                                                         |
| 12  | `updated_at`            | timestamptz   | NO   | `now()`               |                                                         |
| 13  | `budget_reset_interval` | interval      | NO   | `'30 days'::interval` | P9 data-driven interval between automatic budget resets |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns     | References    | ON UPDATE | ON DELETE | Notes |
| ----------- | ------------- | --------- | --------- | ----- |
| `tenant_id` | `tenants(id)` | NO ACTION | CASCADE   |       |

#### Indexes

- `enrichment_merge_policies_pkey` [PRIMARY] · (`id`)
- `enrichment_merge_policies_unique` [UNIQUE] · (`tenant_id`, `code`, `version`)
- `idx_enrichment_merge_policies_code` [INDEX] · (`code`, `tenant_id`)

#### RLS Policies

- **enrichment_merge_policies_tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `((tenant_id IS NULL) OR (tenant_id = COALESCE((NULLIF(current_setting('app.current_tenant_id'::text, true), ''::text))::uuid, tenant_id)))`

#### Inverse relations (referenced by)

- `enrichment_entity_descriptors` via (`default_merge_policy_id`)
- `enrichment_jobs` via (`policy_id`)

---

### `enrichment_merges`

- **Tenant scoped**: yes
- **Row estimate**: 0
- **Domains**: DGOV
- **Prisma model**: `enrichment_merges`
- **RLS**: enabled (forced)

#### Columns

| #   | Column                   | Type         | Null | Default              | Notes |
| --- | ------------------------ | ------------ | ---- | -------------------- | ----- |
| 1   | `id`                     | uuid         | NO   | `uuid_generate_v4()` | PK    |
| 2   | `tenant_id`              | uuid         | NO   | —                    |       |
| 3   | `job_id`                 | uuid         | NO   | —                    |       |
| 4   | `match_id`               | uuid         | NO   | —                    |       |
| 5   | `target_table`           | varchar(100) | NO   | —                    |       |
| 6   | `target_pk_field`        | varchar(100) | NO   | —                    |       |
| 7   | `target_record_id`       | text         | NO   | —                    |       |
| 8   | `target_column`          | varchar(100) | NO   | —                    |       |
| 9   | `previous_value`         | jsonb        | YES  | —                    |       |
| 10  | `new_value`              | jsonb        | NO   | —                    |       |
| 11  | `merge_rule`             | varchar(100) | NO   | —                    |       |
| 12  | `confidence`             | numeric(3,2) | NO   | —                    |       |
| 13  | `committed_by_user_id`   | uuid         | YES  | —                    |       |
| 14  | `committed_at`           | timestamptz  | NO   | `now()`              |       |
| 15  | `rolled_back_at`         | timestamptz  | YES  | —                    |       |
| 16  | `rolled_back_by_user_id` | uuid         | YES  | —                    |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns                  | References               | ON UPDATE | ON DELETE | Notes |
| ------------------------ | ------------------------ | --------- | --------- | ----- |
| `committed_by_user_id`   | `users(id)`              | NO ACTION | SET NULL  |       |
| `job_id`                 | `enrichment_jobs(id)`    | NO ACTION | RESTRICT  |       |
| `match_id`               | `enrichment_matches(id)` | NO ACTION | RESTRICT  |       |
| `rolled_back_by_user_id` | `users(id)`              | NO ACTION | SET NULL  |       |
| `tenant_id`              | `tenants(id)`            | NO ACTION | CASCADE   |       |

#### Indexes

- `enrichment_merges_idempotent` [UNIQUE] · (`tenant_id`, `target_table`, `target_record_id`, `target_column`, `match_id`)
- `enrichment_merges_pkey` [PRIMARY] · (`id`)
- `idx_enrichment_merges_committed_by_user_id` [INDEX] · (`committed_by_user_id`)
- `idx_enrichment_merges_job` [INDEX] · (`job_id`, `committed_at`)
- `idx_enrichment_merges_rolled_back_by_user_id` [INDEX] · (`rolled_back_by_user_id`)
- `idx_enrichment_merges_target` [INDEX] · (`target_table`, `target_record_id`)

#### RLS Policies

- **enrichment_merges_tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `((tenant_id IS NULL) OR (tenant_id = COALESCE((NULLIF(current_setting('app.current_tenant_id'::text, true), ''::text))::uuid, tenant_id)))`

#### Inverse relations (referenced by)

- `enrichment_lineage` via (`merge_id`)

---

### `enrichment_observations`

- **Tenant scoped**: yes
- **Row estimate**: 0
- **Domains**: DGOV
- **Prisma model**: `enrichment_observations`
- **RLS**: enabled (forced)

#### Columns

| #   | Column               | Type         | Null | Default              | Notes |
| --- | -------------------- | ------------ | ---- | -------------------- | ----- |
| 1   | `id`                 | uuid         | NO   | `uuid_generate_v4()` | PK    |
| 2   | `tenant_id`          | uuid         | NO   | —                    |       |
| 3   | `job_id`             | uuid         | NO   | —                    |       |
| 4   | `target_table`       | varchar(100) | NO   | —                    |       |
| 5   | `target_record_id`   | text         | NO   | —                    |       |
| 6   | `field_name`         | varchar(100) | NO   | —                    |       |
| 7   | `observed_value`     | jsonb        | NO   | —                    |       |
| 8   | `confidence`         | numeric(3,2) | NO   | `0`                  |       |
| 9   | `source_snapshot_id` | uuid         | YES  | —                    |       |
| 10  | `observed_at`        | timestamptz  | NO   | `now()`              |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns              | References                        | ON UPDATE | ON DELETE | Notes |
| -------------------- | --------------------------------- | --------- | --------- | ----- |
| `job_id`             | `enrichment_jobs(id)`             | NO ACTION | CASCADE   |       |
| `source_snapshot_id` | `enrichment_source_snapshots(id)` | NO ACTION | SET NULL  |       |
| `tenant_id`          | `tenants(id)`                     | NO ACTION | CASCADE   |       |

#### Indexes

- `enrichment_observations_pkey` [PRIMARY] · (`id`)
- `idx_enrichment_observations_job_id` [INDEX] · (`job_id`)
- `idx_enrichment_observations_source_snapshot_id` [INDEX] · (`source_snapshot_id`)
- `idx_enrichment_observations_target_time` [INDEX] · (`target_table`, `target_record_id`, `field_name`, `observed_at`)
- `idx_enrichment_observations_tenant_id` [INDEX] · (`tenant_id`)

#### RLS Policies

- **enrichment_observations_tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `((tenant_id IS NULL) OR (tenant_id = COALESCE((NULLIF(current_setting('app.current_tenant_id'::text, true), ''::text))::uuid, tenant_id)))`

#### Inverse relations (referenced by)

- `enrichment_lineage` via (`observation_id`)

---

### `enrichment_source_snapshots`

- **Tenant scoped**: yes
- **Row estimate**: 27
- **Domains**: DGOV
- **Prisma model**: `enrichment_source_snapshots`
- **RLS**: enabled (forced)

#### Columns

| #   | Column                   | Type        | Null | Default              | Notes |
| --- | ------------------------ | ----------- | ---- | -------------------- | ----- |
| 1   | `id`                     | uuid        | NO   | `uuid_generate_v4()` | PK    |
| 2   | `tenant_id`              | uuid        | NO   | —                    |       |
| 3   | `source_id`              | uuid        | NO   | —                    |       |
| 4   | `content_hash`           | bpchar(64)  | NO   | —                    |       |
| 5   | `content_text`           | text        | YES  | —                    |       |
| 6   | `content_markdown`       | text        | YES  | —                    |       |
| 7   | `content_metadata_jsonb` | jsonb       | YES  | —                    |       |
| 8   | `retrieved_at`           | timestamptz | NO   | `now()`              |       |
| 9   | `crawler_used`           | varchar(50) | NO   | —                    |       |
| 10  | `http_status`            | int4(32)    | YES  | —                    |       |
| 11  | `bytes_size`             | int4(32)    | YES  | —                    |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns     | References               | ON UPDATE | ON DELETE | Notes |
| ----------- | ------------------------ | --------- | --------- | ----- |
| `source_id` | `enrichment_sources(id)` | NO ACTION | CASCADE   |       |
| `tenant_id` | `tenants(id)`            | NO ACTION | CASCADE   |       |

#### Indexes

- `enrichment_source_snapshots_pkey` [PRIMARY] · (`id`)
- `enrichment_source_snapshots_unique` [UNIQUE] · (`tenant_id`, `source_id`, `content_hash`)
- `idx_enrichment_source_snapshots_hash` [INDEX] · (`content_hash`)
- `idx_enrichment_source_snapshots_retrieval` [INDEX] · (`retrieved_at`)

#### RLS Policies

- **enrichment_source_snapshots_tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `((tenant_id IS NULL) OR (tenant_id = COALESCE((NULLIF(current_setting('app.current_tenant_id'::text, true), ''::text))::uuid, tenant_id)))`

#### Inverse relations (referenced by)

- `enrichment_candidates` via (`source_snapshot_id`)
- `enrichment_observations` via (`source_snapshot_id`)

---

### `enrichment_sources`

- **Tenant scoped**: yes
- **Row estimate**: 31
- **Domains**: DGOV
- **Prisma model**: `enrichment_sources`
- **RLS**: enabled (forced)

#### Columns

| #   | Column            | Type          | Null | Default              | Notes |
| --- | ----------------- | ------------- | ---- | -------------------- | ----- |
| 1   | `id`              | uuid          | NO   | `uuid_generate_v4()` | PK    |
| 2   | `tenant_id`       | uuid          | NO   | —                    |       |
| 3   | `job_id`          | uuid          | NO   | —                    |       |
| 4   | `url`             | varchar(2048) | NO   | —                    |       |
| 5   | `canonical_url`   | varchar(2048) | NO   | —                    |       |
| 6   | `source_type`     | varchar(50)   | NO   | —                    |       |
| 7   | `discovered_via`  | varchar(50)   | NO   | —                    |       |
| 8   | `trust_score`     | numeric(3,2)  | NO   | `0`                  |       |
| 9   | `relevance_score` | numeric(3,2)  | NO   | `0`                  |       |
| 10  | `language`        | varchar(10)   | YES  | —                    |       |
| 11  | `created_at`      | timestamptz   | NO   | `now()`              |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns     | References            | ON UPDATE | ON DELETE | Notes |
| ----------- | --------------------- | --------- | --------- | ----- |
| `job_id`    | `enrichment_jobs(id)` | NO ACTION | CASCADE   |       |
| `tenant_id` | `tenants(id)`         | NO ACTION | CASCADE   |       |

#### Indexes

- `enrichment_sources_pkey` [PRIMARY] · (`id`)
- `idx_enrichment_sources_canonical` [INDEX] · (`tenant_id`, `canonical_url`)
- `idx_enrichment_sources_job` [INDEX] · (`job_id`)

#### RLS Policies

- **enrichment_sources_tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `((tenant_id IS NULL) OR (tenant_id = COALESCE((NULLIF(current_setting('app.current_tenant_id'::text, true), ''::text))::uuid, tenant_id)))`

#### Inverse relations (referenced by)

- `enrichment_source_snapshots` via (`source_id`)

---

### `enrichment_trust_rules`

> This model contains an index with non-default null sort order and requires additional setup for migrations. Visit https://pris.ly/d/default-index-null-ordering for more info.

- **Tenant scoped**: yes
- **Row estimate**: 10
- **Domains**: DGOV
- **Prisma model**: `enrichment_trust_rules`
- **RLS**: enabled (forced)

#### Columns

| #   | Column           | Type         | Null | Default                                              | Notes |
| --- | ---------------- | ------------ | ---- | ---------------------------------------------------- | ----- |
| 1   | `id`             | int4(32)     | NO   | `nextval('enrichment_trust_rules_id_seq'::regclass)` | PK    |
| 2   | `tenant_id`      | uuid         | YES  | —                                                    |       |
| 3   | `source_type`    | varchar(50)  | NO   | —                                                    |       |
| 4   | `domain_pattern` | varchar(255) | YES  | —                                                    |       |
| 5   | `trust_score`    | numeric(3,2) | NO   | —                                                    |       |
| 6   | `notes`          | text         | YES  | —                                                    |       |
| 7   | `created_at`     | timestamptz  | NO   | `now()`                                              |       |
| 8   | `updated_at`     | timestamptz  | NO   | `now()`                                              |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns     | References    | ON UPDATE | ON DELETE | Notes |
| ----------- | ------------- | --------- | --------- | ----- |
| `tenant_id` | `tenants(id)` | NO ACTION | CASCADE   |       |

#### Indexes

- `enrichment_trust_rules_pkey` [PRIMARY] · (`id`)
- `enrichment_trust_rules_unique` [UNIQUE] · (`tenant_id`, `source_type`, `domain_pattern`)
- `idx_enrichment_trust_rules_lookup` [INDEX] · (`source_type`, `tenant_id`)

#### RLS Policies

- **enrichment_trust_rules_tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `((tenant_id IS NULL) OR (tenant_id = COALESCE((NULLIF(current_setting('app.current_tenant_id'::text, true), ''::text))::uuid, tenant_id)))`

---

### `enrichment_writes`

- **Tenant scoped**: yes
- **Row estimate**: 1
- **Domains**: DGOV
- **Prisma model**: `enrichment_writes`
- **RLS**: enabled (forced)

#### Columns

| #   | Column             | Type         | Null | Default              | Notes |
| --- | ------------------ | ------------ | ---- | -------------------- | ----- |
| 1   | `id`               | uuid         | NO   | `uuid_generate_v4()` | PK    |
| 2   | `tenant_id`        | uuid         | NO   | —                    |       |
| 3   | `job_id`           | uuid         | NO   | —                    |       |
| 4   | `candidate_id`     | uuid         | YES  | —                    |       |
| 5   | `entity_name`      | varchar(100) | NO   | —                    |       |
| 6   | `target_table`     | varchar(100) | NO   | —                    |       |
| 7   | `target_record_id` | text         | NO   | —                    |       |
| 8   | `entity_anchor`    | varchar(500) | NO   | —                    |       |
| 9   | `field_name`       | varchar(100) | NO   | —                    |       |
| 10  | `written_value`    | jsonb        | NO   | —                    |       |
| 11  | `previous_value`   | jsonb        | YES  | —                    |       |
| 12  | `fact_hash`        | bpchar(64)   | NO   | —                    |       |
| 13  | `committed_at`     | timestamptz  | NO   | `now()`              |       |
| 14  | `committed_by_job` | uuid         | NO   | —                    |       |
| 15  | `rolled_back_at`   | timestamptz  | YES  | —                    |       |
| 16  | `rolled_back_by`   | uuid         | YES  | —                    |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns          | References                  | ON UPDATE | ON DELETE | Notes |
| ---------------- | --------------------------- | --------- | --------- | ----- |
| `candidate_id`   | `enrichment_candidates(id)` | NO ACTION | SET NULL  |       |
| `job_id`         | `enrichment_jobs(id)`       | NO ACTION | RESTRICT  |       |
| `rolled_back_by` | `enrichment_jobs(id)`       | NO ACTION | SET NULL  |       |
| `tenant_id`      | `tenants(id)`               | NO ACTION | CASCADE   |       |

#### Indexes

- `enrichment_writes_pkey` [PRIMARY] · (`id`)
- `enrichment_writes_unique_fact` [UNIQUE] · (`tenant_id`, `target_table`, `target_record_id`, `field_name`, `fact_hash`)
- `idx_enrichment_writes_anchor` [INDEX] · (`tenant_id`, `entity_anchor`)
- `idx_enrichment_writes_candidate_id` [INDEX] · (`candidate_id`)
- `idx_enrichment_writes_job` [INDEX] · (`job_id`)
- `idx_enrichment_writes_rolled_back_by` [INDEX] · (`rolled_back_by`)
- `idx_enrichment_writes_target` [INDEX] · (`tenant_id`, `target_table`, `target_record_id`)

#### RLS Policies

- **enrichment_writes_tenant_policy** (ALL · PERMISSIVE) · roles: `public`
  - USING: `((tenant_id)::text = current_setting('app.current_tenant_id'::text, true))`

---

### `error_analytics_hourly`

- **Tenant scoped**: yes
- **Row estimate**: 0
- **Domains**: DGOV
- **Prisma model**: `error_analytics_hourly`
- **RLS**: enabled (forced)

#### Columns

| #   | Column            | Type        | Null | Default             | Notes |
| --- | ----------------- | ----------- | ---- | ------------------- | ----- |
| 1   | `id`              | uuid        | NO   | `gen_random_uuid()` | PK    |
| 2   | `hour_start`      | timestamptz | NO   | —                   |       |
| 3   | `tenant_id`       | uuid        | NO   | —                   |       |
| 4   | `category`        | varchar(30) | NO   | —                   |       |
| 5   | `severity`        | varchar(20) | NO   | —                   |       |
| 6   | `error_count`     | int4(32)    | NO   | `0`                 |       |
| 7   | `unique_errors`   | int4(32)    | NO   | `0`                 |       |
| 8   | `affected_users`  | int4(32)    | NO   | `0`                 |       |
| 9   | `top_error_codes` | \_text      | YES  | —                   |       |
| 10  | `created_at`      | timestamptz | NO   | `now()`             |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns     | References    | ON UPDATE | ON DELETE | Notes |
| ----------- | ------------- | --------- | --------- | ----- |
| `tenant_id` | `tenants(id)` | NO ACTION | CASCADE   |       |

#### Indexes

- `error_analytics_hourly_hour_start_tenant_id_category_severi_key` [UNIQUE] · (`hour_start`, `tenant_id`, `category`, `severity`)
- `error_analytics_hourly_pkey` [PRIMARY] · (`id`)
- `idx_error_analytics_hourly_category` [INDEX] · (`category`)
- `idx_error_analytics_hourly_codes` [INDEX] · (`top_error_codes`)
- `idx_error_analytics_hourly_hour` [INDEX] · (`hour_start`)
- `idx_error_analytics_hourly_tenant` [INDEX] · (`tenant_id`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

---

### `error_logs`

- **Tenant scoped**: yes
- **Row estimate**: 0
- **Domains**: DGOV
- **Prisma model**: `error_logs`
- **RLS**: enabled (forced)

#### Columns

| #   | Column             | Type         | Null | Default             | Notes |
| --- | ------------------ | ------------ | ---- | ------------------- | ----- |
| 1   | `id`               | uuid         | NO   | `gen_random_uuid()` | PK    |
| 2   | `error_id`         | varchar(50)  | NO   | —                   |       |
| 3   | `code`             | varchar(50)  | NO   | —                   |       |
| 4   | `category`         | varchar(30)  | NO   | —                   |       |
| 5   | `severity`         | varchar(20)  | NO   | —                   |       |
| 6   | `message`          | text         | NO   | —                   |       |
| 7   | `http_status`      | int4(32)     | NO   | —                   |       |
| 8   | `tenant_id`        | uuid         | NO   | —                   |       |
| 9   | `user_id`          | uuid         | YES  | —                   |       |
| 10  | `request_method`   | varchar(10)  | YES  | —                   |       |
| 11  | `request_path`     | text         | YES  | —                   |       |
| 12  | `request_ip`       | varchar(45)  | YES  | —                   |       |
| 13  | `request_id`       | varchar(100) | YES  | —                   |       |
| 14  | `user_agent`       | text         | YES  | —                   |       |
| 15  | `details`          | jsonb        | YES  | —                   |       |
| 16  | `database_context` | jsonb        | YES  | —                   |       |
| 17  | `stack_trace`      | text         | YES  | —                   |       |
| 18  | `created_at`       | timestamptz  | NO   | `now()`             |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns     | References    | ON UPDATE | ON DELETE | Notes |
| ----------- | ------------- | --------- | --------- | ----- |
| `tenant_id` | `tenants(id)` | NO ACTION | SET NULL  |       |
| `user_id`   | `users(id)`   | NO ACTION | SET NULL  |       |

#### Indexes

- `error_logs_pkey` [PRIMARY] · (`id`)
- `idx_error_logs_category` [INDEX] · (`category`)
- `idx_error_logs_code` [INDEX] · (`code`)
- `idx_error_logs_created_at` [INDEX] · (`created_at`)
- `idx_error_logs_details` [INDEX] · (`details`)
- `idx_error_logs_http_status` [INDEX] · (`http_status`)
- `idx_error_logs_severity` [INDEX] · (`severity`)
- `idx_error_logs_tenant_created` [INDEX] · (`tenant_id`, `created_at`)
- `idx_error_logs_tenant_id` [INDEX] · (`tenant_id`)
- `idx_error_logs_user_id` [INDEX] · (`user_id`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

---

### `error_patterns`

- **Tenant scoped**: no
- **Row estimate**: 0
- **Domains**: DGOV
- **Prisma model**: `error_patterns`

#### Columns

| #   | Column             | Type        | Null | Default             | Notes |
| --- | ------------------ | ----------- | ---- | ------------------- | ----- |
| 1   | `id`               | uuid        | NO   | `gen_random_uuid()` | PK    |
| 2   | `pattern_type`     | varchar(50) | NO   | —                   |       |
| 3   | `description`      | text        | NO   | —                   |       |
| 4   | `error_code`       | varchar(50) | YES  | —                   |       |
| 5   | `category`         | varchar(30) | YES  | —                   |       |
| 6   | `first_seen`       | timestamptz | NO   | —                   |       |
| 7   | `last_seen`        | timestamptz | NO   | —                   |       |
| 8   | `occurrence_count` | int4(32)    | NO   | `1`                 |       |
| 9   | `affected_tenants` | \_uuid      | YES  | —                   |       |
| 10  | `is_resolved`      | bool        | YES  | `false`             |       |
| 11  | `resolution_notes` | text        | YES  | —                   |       |
| 12  | `resolved_at`      | timestamptz | YES  | —                   |       |
| 13  | `resolved_by`      | uuid        | YES  | —                   |       |
| 14  | `created_at`       | timestamptz | NO   | `now()`             |       |
| 15  | `updated_at`       | timestamptz | NO   | `now()`             |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns       | References  | ON UPDATE | ON DELETE | Notes |
| ------------- | ----------- | --------- | --------- | ----- |
| `resolved_by` | `users(id)` | NO ACTION | SET NULL  |       |

#### Indexes

- `error_patterns_pkey` [PRIMARY] · (`id`)
- `idx_error_patterns_code` [INDEX] · (`error_code`)
- `idx_error_patterns_last_seen` [INDEX] · (`last_seen`)
- `idx_error_patterns_resolved` [INDEX] · (`is_resolved`)
- `idx_error_patterns_resolved_by` [INDEX] · (`resolved_by`)
- `idx_error_patterns_type` [INDEX] · (`pattern_type`)

---

### `export_configurations`

- **Tenant scoped**: yes
- **Row estimate**: 15
- **Domains**: DGOV
- **Prisma model**: `export_configurations`
- **RLS**: enabled (forced)

#### Columns

| #   | Column            | Type         | Null | Default                           | Notes |
| --- | ----------------- | ------------ | ---- | --------------------------------- | ----- |
| 1   | `id`              | uuid         | NO   | `gen_random_uuid()`               | PK    |
| 2   | `tenant_id`       | uuid         | NO   | —                                 |       |
| 3   | `name`            | varchar(200) | NO   | —                                 |       |
| 4   | `description`     | text         | YES  | —                                 |       |
| 5   | `data_source`     | varchar(100) | NO   | —                                 |       |
| 6   | `columns`         | jsonb        | NO   | `'[]'::jsonb`                     |       |
| 7   | `filters`         | jsonb        | YES  | `'{}'::jsonb`                     |       |
| 8   | `format`          | varchar(20)  | YES  | `'csv'::character varying`        |       |
| 9   | `delimiter`       | varchar(5)   | YES  | `','::character varying`          |       |
| 10  | `include_headers` | bool         | YES  | `true`                            |       |
| 11  | `date_format`     | varchar(50)  | YES  | `'YYYY-MM-DD'::character varying` |       |
| 12  | `encoding`        | varchar(20)  | YES  | `'UTF-8'::character varying`      |       |
| 13  | `compression`     | varchar(10)  | YES  | —                                 |       |
| 14  | `is_template`     | bool         | YES  | `false`                           |       |
| 15  | `created_by`      | uuid         | YES  | —                                 |       |
| 16  | `created_at`      | timestamptz  | YES  | `now()`                           |       |
| 17  | `updated_at`      | timestamptz  | YES  | `now()`                           |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns      | References           | ON UPDATE | ON DELETE | Notes |
| ------------ | -------------------- | --------- | --------- | ----- |
| `created_by` | `employees_core(id)` | NO ACTION | SET NULL  |       |
| `tenant_id`  | `tenants(id)`        | NO ACTION | CASCADE   |       |

#### Indexes

- `export_configurations_pkey` [PRIMARY] · (`id`)
- `idx_export_configs_tenant` [INDEX] · (`tenant_id`)
- `idx_export_configurations_created_by` [INDEX] · (`created_by`)

#### RLS Policies

- **tenant_isolation_export_configs** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`

#### Inverse relations (referenced by)

- `export_jobs` via (`config_id`)

---

### `export_jobs`

- **Tenant scoped**: yes
- **Row estimate**: 45
- **Domains**: DGOV
- **Prisma model**: `export_jobs`
- **RLS**: enabled (forced)

#### Columns

| #   | Column          | Type        | Null | Default                        | Notes |
| --- | --------------- | ----------- | ---- | ------------------------------ | ----- |
| 1   | `id`            | uuid        | NO   | `gen_random_uuid()`            | PK    |
| 2   | `tenant_id`     | uuid        | NO   | —                              |       |
| 3   | `config_id`     | uuid        | YES  | —                              |       |
| 4   | `triggered_by`  | uuid        | YES  | —                              |       |
| 5   | `status`        | varchar(20) | YES  | `'pending'::character varying` |       |
| 6   | `row_count`     | int4(32)    | YES  | —                              |       |
| 7   | `file_size`     | int8(64)    | YES  | —                              |       |
| 8   | `file_path`     | text        | YES  | —                              |       |
| 9   | `file_url`      | text        | YES  | —                              |       |
| 10  | `expires_at`    | timestamptz | YES  | —                              |       |
| 11  | `error_message` | text        | YES  | —                              |       |
| 12  | `started_at`    | timestamptz | YES  | —                              |       |
| 13  | `completed_at`  | timestamptz | YES  | —                              |       |
| 14  | `created_at`    | timestamptz | YES  | `now()`                        |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns        | References                  | ON UPDATE | ON DELETE | Notes |
| -------------- | --------------------------- | --------- | --------- | ----- |
| `config_id`    | `export_configurations(id)` | NO ACTION | CASCADE   |       |
| `tenant_id`    | `tenants(id)`               | NO ACTION | CASCADE   |       |
| `triggered_by` | `employees_core(id)`        | NO ACTION | SET NULL  |       |

#### Indexes

- `export_jobs_pkey` [PRIMARY] · (`id`)
- `idx_export_jobs_config` [INDEX] · (`config_id`)
- `idx_export_jobs_status` [INDEX] · (`status`)
- `idx_export_jobs_tenant` [INDEX] · (`tenant_id`)
- `idx_export_jobs_triggered` [INDEX] · (`triggered_by`)

#### RLS Policies

- **tenant_isolation_export_jobs** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`

---

### `ext_hrp1007`

- **Tenant scoped**: yes
- **Row estimate**: 0
- **Domains**: DGOV
- **Prisma model**: `ext_hrp1007`
- **RLS**: enabled (forced)

#### Columns

| #   | Column                    | Type          | Null | Default                     | Notes |
| --- | ------------------------- | ------------- | ---- | --------------------------- | ----- |
| 1   | `objid`                   | varchar(8)    | NO   | —                           | PK    |
| 2   | `subty`                   | varchar(4)    | NO   | `'0001'::character varying` | PK    |
| 3   | `tenant_id`               | uuid          | NO   | —                           |       |
| 4   | `title`                   | varchar(255)  | YES  | —                           |       |
| 5   | `description`             | text          | YES  | —                           |       |
| 6   | `requirements`            | text          | YES  | —                           |       |
| 7   | `salary_min`              | numeric(12,2) | YES  | —                           |       |
| 8   | `salary_max`              | numeric(12,2) | YES  | —                           |       |
| 9   | `salary_currency`         | varchar(3)    | YES  | `'EUR'::character varying`  |       |
| 10  | `hiring_manager_pernr`    | varchar(8)    | YES  | —                           |       |
| 11  | `recruiter_pernr`         | varchar(8)    | YES  | —                           |       |
| 12  | `priority`                | varchar(10)   | YES  | —                           |       |
| 13  | `original_requisition_id` | uuid          | YES  | —                           |       |
| 14  | `created_at`              | timestamp     | YES  | `now()`                     |       |

#### Primary Key

`(`objid`, `subty`)`

#### Foreign Keys

| Columns     | References    | ON UPDATE | ON DELETE | Notes |
| ----------- | ------------- | --------- | --------- | ----- |
| `tenant_id` | `tenants(id)` | NO ACTION | CASCADE   |       |

#### Indexes

- `ext_hrp1007_pkey` [PRIMARY] · (`objid`, `subty`)
- `idx_ext_hrp1007_tenant_id` [INDEX] · (`tenant_id`)

#### RLS Policies

- **tenant_isolation_ext_hrp1007** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`

---

### `ext_pa0002`

> The underlying table does not contain a valid unique identifier and can therefore currently not be handled by Prisma Client.

- **Tenant scoped**: yes
- **Row estimate**: 1064
- **Domains**: DGOV
- **Prisma model**: `ext_pa0002`
- **RLS**: enabled (forced)

#### Columns

| #   | Column               | Type         | Null | Default | Notes                                     |
| --- | -------------------- | ------------ | ---- | ------- | ----------------------------------------- |
| 1   | `pernr`              | varchar(8)   | NO   | —       |                                           |
| 2   | `tenant_id`          | uuid         | NO   | —       |                                           |
| 3   | `manager_pernr`      | varchar(8)   | YES  | —       |                                           |
| 4   | `skills`             | \_text       | YES  | —       | ESCO skill names array                    |
| 5   | `performance_rating` | numeric(3,2) | YES  | —       |                                           |
| 6   | `potential`          | varchar(10)  | YES  | —       | Talent potential rating (High/Medium/Low) |
| 7   | `is_active`          | bool         | YES  | `true`  |                                           |
| 8   | `created_at`         | timestamp    | YES  | `now()` |                                           |
| 9   | `updated_at`         | timestamp    | YES  | `now()` |                                           |
| 10  | `deleted_at`         | timestamptz  | YES  | —       |                                           |

#### Foreign Keys

| Columns     | References    | ON UPDATE | ON DELETE | Notes |
| ----------- | ------------- | --------- | --------- | ----- |
| `tenant_id` | `tenants(id)` | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_ext_pa0002_not_deleted` [INDEX] · (`pernr`)
- `idx_ext_pa0002_tenant_id` [INDEX] · (`tenant_id`)

#### RLS Policies

- **tenant_isolation_ext_pa0002** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`

---

### `ext_pa0024`

> The underlying table does not contain a valid unique identifier and can therefore currently not be handled by Prisma Client.

- **Tenant scoped**: no
- **Row estimate**: 18.272
- **Domains**: DGOV
- **Prisma model**: `ext_pa0024`

#### Columns

| #   | Column          | Type        | Null | Default | Notes |
| --- | --------------- | ----------- | ---- | ------- | ----- |
| 1   | `pernr`         | varchar(8)  | NO   | —       |       |
| 2   | `quali`         | varchar(50) | NO   | —       |       |
| 3   | `is_primary`    | bool        | YES  | `false` |       |
| 4   | `acquired_date` | date        | YES  | —       |       |
| 5   | `created_at`    | timestamp   | YES  | `now()` |       |

---

### `ext_pa0025`

- **Tenant scoped**: no
- **Row estimate**: 0
- **Domains**: DGOV
- **Prisma model**: `ext_pa0025`

#### Columns

| #   | Column                    | Type         | Null | Default | Notes |
| --- | ------------------------- | ------------ | ---- | ------- | ----- |
| 1   | `pernr`                   | varchar(8)   | NO   | —       | PK    |
| 2   | `appraisal_id`            | varchar(50)  | NO   | —       | PK    |
| 3   | `goal_achievement_rating` | numeric(3,2) | YES  | —       |       |
| 4   | `competency_rating`       | numeric(3,2) | YES  | —       |       |
| 5   | `strengths`               | text         | YES  | —       |       |
| 6   | `areas_for_improvement`   | text         | YES  | —       |       |
| 7   | `employee_comments`       | text         | YES  | —       |       |
| 8   | `created_at`              | timestamp    | YES  | `now()` |       |

#### Primary Key

`(`pernr`, `appraisal_id`)`

#### Indexes

- `ext_pa0025_pkey` [PRIMARY] · (`pernr`, `appraisal_id`)

---

### `ext_pb0002`

> The underlying table does not contain a valid unique identifier and can therefore currently not be handled by Prisma Client.

- **Tenant scoped**: yes
- **Row estimate**: 0
- **Domains**: DGOV
- **Prisma model**: `ext_pb0002`
- **RLS**: enabled (forced)

#### Columns

| #   | Column                  | Type         | Null | Default | Notes |
| --- | ----------------------- | ------------ | ---- | ------- | ----- |
| 1   | `aplnr`                 | varchar(20)  | NO   | —       |       |
| 2   | `tenant_id`             | uuid         | NO   | —       |       |
| 3   | `linkedin_url`          | varchar(255) | YES  | —       |       |
| 4   | `skills`                | jsonb        | YES  | —       |       |
| 5   | `consent_given`         | bool         | YES  | `false` |       |
| 6   | `fit_score`             | numeric(3,2) | YES  | —       |       |
| 7   | `original_candidate_id` | uuid         | YES  | —       |       |
| 8   | `created_at`            | timestamp    | YES  | `now()` |       |

#### Foreign Keys

| Columns     | References    | ON UPDATE | ON DELETE | Notes |
| ----------- | ------------- | --------- | --------- | ----- |
| `tenant_id` | `tenants(id)` | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_ext_pb0002_tenant_id` [INDEX] · (`tenant_id`)

#### RLS Policies

- **tenant_isolation_ext_pb0002** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`

---

### `feature_categories`

- **Tenant scoped**: no
- **Row estimate**: 13
- **Domains**: DGOV
- **Prisma model**: `feature_categories`

#### Columns

| #   | Column          | Type         | Null | Default             | Notes |
| --- | --------------- | ------------ | ---- | ------------------- | ----- |
| 1   | `id`            | uuid         | NO   | `gen_random_uuid()` | PK    |
| 2   | `name`          | varchar(100) | NO   | —                   |       |
| 3   | `display_order` | int4(32)     | YES  | `0`                 |       |
| 4   | `icon`          | varchar(50)  | YES  | —                   |       |
| 5   | `description`   | text         | YES  | —                   |       |
| 6   | `created_at`    | timestamp    | YES  | `now()`             |       |
| 7   | `updated_at`    | timestamp    | YES  | `now()`             |       |

#### Primary Key

`(`id`)`

#### Indexes

- `feature_categories_pkey` [PRIMARY] · (`id`)

---

### `feature_modules`

- **Tenant scoped**: no
- **Row estimate**: 99
- **Domains**: DGOV
- **Prisma model**: `feature_modules`

#### Columns

| #   | Column            | Type         | Null | Default             | Notes                                                        |
| --- | ----------------- | ------------ | ---- | ------------------- | ------------------------------------------------------------ |
| 1   | `id`              | uuid         | NO   | `gen_random_uuid()` | PK                                                           |
| 2   | `code`            | varchar(50)  | NO   | —                   | Unique code identifier (e.g., employees_view, goals)         |
| 3   | `name`            | varchar(100) | NO   | —                   |                                                              |
| 4   | `description`     | text         | YES  | —                   |                                                              |
| 5   | `category`        | varchar(50)  | NO   | —                   | Category: platform, employees, performance, learning, etc.   |
| 6   | `api_prefix`      | varchar(100) | YES  | —                   |                                                              |
| 7   | `frontend_path`   | varchar(100) | YES  | —                   |                                                              |
| 8   | `is_active`       | bool         | YES  | `true`              |                                                              |
| 9   | `requires_tenant` | bool         | YES  | `true`              | If false, accessible without tenant context (e.g., ontology) |
| 10  | `sort_order`      | int4(32)     | YES  | `0`                 |                                                              |
| 11  | `created_at`      | timestamptz  | YES  | `now()`             |                                                              |
| 12  | `updated_at`      | timestamptz  | YES  | `now()`             |                                                              |
| 13  | `deleted_at`      | timestamptz  | YES  | —                   |                                                              |

#### Primary Key

`(`id`)`

#### Indexes

- `feature_modules_pkey` [PRIMARY] · (`id`)
- `idx_feature_modules_active` [INDEX] · (`is_active`)
- `idx_feature_modules_category` [INDEX] · (`category`)
- `idx_feature_modules_not_deleted` [INDEX] · (`id`)
- `uq_feature_modules_code` [UNIQUE] · (`code`)

#### Inverse relations (referenced by)

- `permissions` via (`module_id`)

---

### `features`

- **Tenant scoped**: no
- **Row estimate**: 104
- **Domains**: DGOV
- **Prisma model**: `features`

#### Columns

| #   | Column                  | Type         | Null | Default                        | Notes |
| --- | ----------------------- | ------------ | ---- | ------------------------------ | ----- |
| 1   | `id`                    | uuid         | NO   | `gen_random_uuid()`            | PK    |
| 2   | `category_id`           | uuid         | YES  | —                              |       |
| 3   | `name`                  | varchar(200) | NO   | —                              |       |
| 4   | `description`           | text         | YES  | —                              |       |
| 5   | `status`                | varchar(20)  | YES  | `'planned'::character varying` |       |
| 6   | `notes`                 | text         | YES  | —                              |       |
| 7   | `priority`              | int4(32)     | YES  | `0`                            |       |
| 8   | `phase`                 | varchar(50)  | YES  | —                              |       |
| 9   | `target_date`           | date         | YES  | —                              |       |
| 10  | `completion_percentage` | int4(32)     | YES  | `0`                            |       |
| 11  | `created_at`            | timestamp    | YES  | `now()`                        |       |
| 12  | `updated_at`            | timestamp    | YES  | `now()`                        |       |

#### Primary Key

`(`id`)`

#### Indexes

- `features_pkey` [PRIMARY] · (`id`)
- `idx_features_phase` [INDEX] · (`phase`)

---

### `heuresys_sap_mapping`

- **Tenant scoped**: no
- **Row estimate**: 21
- **Domains**: DGOV
- **Prisma model**: `heuresys_sap_mapping`

#### Columns

| #   | Column                 | Type         | Null | Default                                            | Notes                                                                               |
| --- | ---------------------- | ------------ | ---- | -------------------------------------------------- | ----------------------------------------------------------------------------------- |
| 1   | `id`                   | int4(32)     | NO   | `nextval('heuresys_sap_mapping_id_seq'::regclass)` | PK                                                                                  |
| 2   | `heuresys_table`       | varchar(100) | NO   | —                                                  | Heuresys table name - SOURCE OF TRUTH for platform operations                       |
| 3   | `heuresys_field`       | varchar(100) | NO   | —                                                  |                                                                                     |
| 4   | `heuresys_description` | varchar(255) | YES  | —                                                  |                                                                                     |
| 5   | `sap_table`            | varchar(100) | NO   | —                                                  | SAP table name - used ONLY for import/export operations                             |
| 6   | `sap_field`            | varchar(100) | NO   | —                                                  |                                                                                     |
| 7   | `sap_description`      | varchar(255) | YES  | —                                                  |                                                                                     |
| 8   | `mapping_type`         | varchar(20)  | NO   | —                                                  | direct=1:1, transform=needs conversion, lookup=reference table, computed=calculated |
| 9   | `sync_direction`       | varchar(20)  | NO   | —                                                  | Direction of data sync between systems                                              |
| 10  | `transform_rule`       | text         | YES  | —                                                  |                                                                                     |
| 11  | `is_key_field`         | bool         | YES  | `false`                                            |                                                                                     |
| 12  | `is_required`          | bool         | YES  | `false`                                            |                                                                                     |
| 13  | `is_active`            | bool         | YES  | `true`                                             |                                                                                     |
| 14  | `domain`               | varchar(50)  | YES  | —                                                  |                                                                                     |
| 15  | `priority`             | int4(32)     | YES  | `100`                                              |                                                                                     |
| 16  | `created_at`           | timestamp    | YES  | `now()`                                            |                                                                                     |
| 17  | `updated_at`           | timestamp    | YES  | `now()`                                            |                                                                                     |
| 18  | `deleted_at`           | timestamptz  | YES  | —                                                  |                                                                                     |

#### Primary Key

`(`id`)`

#### Indexes

- `heuresys_sap_mapping_pkey` [PRIMARY] · (`id`)
- `idx_heuresys_sap_mapping_active` [INDEX] · (`id`)
- `idx_mapping_domain` [INDEX] · (`domain`)
- `idx_mapping_heuresys` [INDEX] · (`heuresys_table`, `heuresys_field`)
- `idx_mapping_sap` [INDEX] · (`sap_table`, `sap_field`)

---

### `hrp1000`

> The underlying table does not contain a valid unique identifier and can therefore currently not be handled by Prisma Client.

- **Tenant scoped**: no
- **Row estimate**: 320
- **Domains**: DGOV
- **Prisma model**: `hrp1000`

#### Columns

| #   | Column       | Type        | Null | Default                               | Notes |
| --- | ------------ | ----------- | ---- | ------------------------------------- | ----- |
| 1   | `id`         | int4(32)    | NO   | `nextval('hrp1000_id_seq'::regclass)` |       |
| 2   | `plvar`      | varchar(2)  | NO   | `'01'::character varying`             |       |
| 3   | `otype`      | varchar(2)  | NO   | —                                     |       |
| 4   | `objid`      | varchar(8)  | NO   | —                                     |       |
| 5   | `endda`      | date        | NO   | —                                     |       |
| 6   | `begda`      | date        | NO   | —                                     |       |
| 7   | `istat`      | varchar(1)  | YES  | `'1'::character varying`              |       |
| 8   | `short`      | varchar(12) | YES  | —                                     |       |
| 9   | `stext`      | varchar(40) | YES  | —                                     |       |
| 10  | `langu`      | varchar(2)  | YES  | `'EN'::character varying`             |       |
| 11  | `created_at` | timestamp   | YES  | `now()`                               |       |

#### Indexes

- `idx_hrp1000_objid` [INDEX] · (`objid`)
- `idx_hrp1000_otype` [INDEX] · (`otype`)

---

### `hrp1001`

> The underlying table does not contain a valid unique identifier and can therefore currently not be handled by Prisma Client.

- **Tenant scoped**: no
- **Row estimate**: 164
- **Domains**: DGOV
- **Prisma model**: `hrp1001`

#### Columns

| #   | Column       | Type         | Null | Default                               | Notes |
| --- | ------------ | ------------ | ---- | ------------------------------------- | ----- |
| 1   | `id`         | int4(32)     | NO   | `nextval('hrp1001_id_seq'::regclass)` |       |
| 2   | `plvar`      | varchar(2)   | NO   | `'01'::character varying`             |       |
| 3   | `otype`      | varchar(2)   | NO   | —                                     |       |
| 4   | `objid`      | varchar(8)   | NO   | —                                     |       |
| 5   | `rsign`      | varchar(1)   | NO   | —                                     |       |
| 6   | `relat`      | varchar(3)   | NO   | —                                     |       |
| 7   | `endda`      | date         | NO   | —                                     |       |
| 8   | `begda`      | date         | NO   | —                                     |       |
| 9   | `sclas`      | varchar(2)   | YES  | —                                     |       |
| 10  | `sobid`      | varchar(45)  | YES  | —                                     |       |
| 11  | `prozt`      | numeric(5,2) | YES  | —                                     |       |
| 12  | `created_at` | timestamp    | YES  | `now()`                               |       |

#### Indexes

- `idx_hrp1001_objid` [INDEX] · (`objid`)
- `idx_hrp1001_sobid` [INDEX] · (`sobid`)

---

### `hrp1002`

- **Tenant scoped**: no
- **Row estimate**: 15
- **Domains**: DGOV
- **Prisma model**: `hrp1002`

#### Columns

| #   | Column       | Type       | Null | Default                               | Notes |
| --- | ------------ | ---------- | ---- | ------------------------------------- | ----- |
| 1   | `id`         | int4(32)   | NO   | `nextval('hrp1002_id_seq'::regclass)` | PK    |
| 2   | `plvar`      | varchar(2) | NO   | `'01'::character varying`             |       |
| 3   | `otype`      | varchar(2) | NO   | —                                     |       |
| 4   | `objid`      | varchar(8) | NO   | —                                     |       |
| 5   | `subty`      | varchar(4) | NO   | `'EN'::character varying`             |       |
| 6   | `endda`      | date       | NO   | —                                     |       |
| 7   | `begda`      | date       | NO   | —                                     |       |
| 8   | `tline`      | text       | YES  | —                                     |       |
| 9   | `created_at` | timestamp  | YES  | `now()`                               |       |

#### Primary Key

`(`id`)`

#### Indexes

- `hrp1002_pkey` [PRIMARY] · (`id`)

---

### `hrp1003`

- **Tenant scoped**: no
- **Row estimate**: 0
- **Domains**: DGOV
- **Prisma model**: `hrp1003`

#### Columns

| #   | Column          | Type       | Null | Default                               | Notes |
| --- | --------------- | ---------- | ---- | ------------------------------------- | ----- |
| 1   | `id`            | int4(32)   | NO   | `nextval('hrp1003_id_seq'::regclass)` | PK    |
| 2   | `plvar`         | varchar(2) | YES  | `'01'::character varying`             |       |
| 3   | `otype`         | varchar(2) | NO   | —                                     |       |
| 4   | `objid`         | varchar(8) | NO   | —                                     |       |
| 5   | `subty`         | varchar(4) | YES  | `'0001'::character varying`           |       |
| 6   | `endda`         | date       | NO   | `'9999-12-31'::date`                  |       |
| 7   | `begda`         | date       | NO   | —                                     |       |
| 8   | `stession`      | int4(32)   | YES  | —                                     |       |
| 9   | `besession`     | int4(32)   | YES  | —                                     |       |
| 10  | `vacancy_count` | int4(32)   | YES  | —                                     |       |
| 11  | `created_at`    | timestamp  | YES  | `CURRENT_TIMESTAMP`                   |       |

#### Primary Key

`(`id`)`

#### Indexes

- `hrp1003_pkey` [PRIMARY] · (`id`)
- `hrp1003_unique` [UNIQUE] · (`plvar`, `otype`, `objid`, `subty`, `begda`)

---

### `hrp1005`

> The underlying table does not contain a valid unique identifier and can therefore currently not be handled by Prisma Client.

- **Tenant scoped**: no
- **Row estimate**: 34
- **Domains**: DGOV
- **Prisma model**: `hrp1005`

#### Columns

| #   | Column          | Type          | Null | Default                               | Notes |
| --- | --------------- | ------------- | ---- | ------------------------------------- | ----- |
| 1   | `id`            | int4(32)      | NO   | `nextval('hrp1005_id_seq'::regclass)` |       |
| 2   | `plvar`         | varchar(2)    | NO   | `'01'::character varying`             |       |
| 3   | `otype`         | varchar(2)    | NO   | —                                     |       |
| 4   | `objid`         | varchar(8)    | NO   | —                                     |       |
| 5   | `subty`         | varchar(4)    | NO   | `'0001'::character varying`           |       |
| 6   | `endda`         | date          | NO   | `'9999-12-31'::date`                  |       |
| 7   | `begda`         | date          | NO   | —                                     |       |
| 8   | `waession`      | varchar(4)    | YES  | —                                     |       |
| 9   | `min_salary`    | numeric(15,2) | YES  | —                                     |       |
| 10  | `mid_salary`    | numeric(15,2) | YES  | —                                     |       |
| 11  | `max_salary`    | numeric(15,2) | YES  | —                                     |       |
| 12  | `currency`      | varchar(3)    | YES  | `'EUR'::character varying`            |       |
| 13  | `pay_frequency` | varchar(2)    | YES  | `'M'::character varying`              |       |
| 14  | `created_at`    | timestamp     | YES  | `now()`                               |       |

#### Indexes

- `idx_hrp1005_objid` [INDEX] · (`objid`)

---

### `hrp1006`

- **Tenant scoped**: no
- **Row estimate**: 0
- **Domains**: DGOV
- **Prisma model**: `hrp1006`

#### Columns

| #   | Column              | Type        | Null | Default                               | Notes |
| --- | ------------------- | ----------- | ---- | ------------------------------------- | ----- |
| 1   | `id`                | int4(32)    | NO   | `nextval('hrp1006_id_seq'::regclass)` | PK    |
| 2   | `plvar`             | varchar(2)  | YES  | `'01'::character varying`             |       |
| 3   | `otype`             | varchar(2)  | NO   | —                                     |       |
| 4   | `objid`             | varchar(8)  | NO   | —                                     |       |
| 5   | `subty`             | varchar(4)  | YES  | `'0001'::character varying`           |       |
| 6   | `endda`             | date        | NO   | `'9999-12-31'::date`                  |       |
| 7   | `begda`             | date        | NO   | —                                     |       |
| 8   | `restriction_type`  | varchar(4)  | YES  | —                                     |       |
| 9   | `restriction_value` | varchar(40) | YES  | —                                     |       |
| 10  | `created_at`        | timestamp   | YES  | `CURRENT_TIMESTAMP`                   |       |

#### Primary Key

`(`id`)`

#### Indexes

- `hrp1006_pkey` [PRIMARY] · (`id`)
- `hrp1006_unique` [UNIQUE] · (`plvar`, `otype`, `objid`, `subty`, `begda`)

---

### `hrp1007`

- **Tenant scoped**: no
- **Row estimate**: 0
- **Domains**: DGOV
- **Prisma model**: `hrp1007`

#### Columns

| #   | Column             | Type        | Null | Default                               | Notes |
| --- | ------------------ | ----------- | ---- | ------------------------------------- | ----- |
| 1   | `id`               | int4(32)    | NO   | `nextval('hrp1007_id_seq'::regclass)` | PK    |
| 2   | `plvar`            | varchar(2)  | NO   | `'01'::character varying`             |       |
| 3   | `otype`            | varchar(2)  | NO   | `'S'::character varying`              |       |
| 4   | `objid`            | varchar(8)  | NO   | —                                     |       |
| 5   | `subty`            | varchar(4)  | NO   | `'0001'::character varying`           |       |
| 6   | `endda`            | date        | NO   | `'9999-12-31'::date`                  |       |
| 7   | `begda`            | date        | NO   | —                                     |       |
| 8   | `vacancy_status`   | varchar(2)  | YES  | —                                     |       |
| 9   | `vacancy_reason`   | varchar(4)  | YES  | —                                     |       |
| 10  | `target_fill_date` | date        | YES  | —                                     |       |
| 11  | `headcount`        | int4(32)    | YES  | `1`                                   |       |
| 12  | `filled_count`     | int4(32)    | YES  | `0`                                   |       |
| 13  | `requisition_id`   | varchar(20) | YES  | —                                     |       |
| 14  | `created_at`       | timestamp   | YES  | `now()`                               |       |

#### Primary Key

`(`id`)`

#### Indexes

- `hrp1007_pkey` [PRIMARY] · (`id`)
- `hrp1007_plvar_otype_objid_subty_endda_key` [UNIQUE] · (`plvar`, `otype`, `objid`, `subty`, `endda`)
- `idx_hrp1007_objid` [INDEX] · (`objid`)

---

### `hrp1008`

- **Tenant scoped**: no
- **Row estimate**: 0
- **Domains**: DGOV
- **Prisma model**: `hrp1008`

#### Columns

| #   | Column       | Type        | Null | Default                               | Notes |
| --- | ------------ | ----------- | ---- | ------------------------------------- | ----- |
| 1   | `id`         | int4(32)    | NO   | `nextval('hrp1008_id_seq'::regclass)` | PK    |
| 2   | `plvar`      | varchar(2)  | YES  | `'01'::character varying`             |       |
| 3   | `otype`      | varchar(2)  | NO   | —                                     |       |
| 4   | `objid`      | varchar(8)  | NO   | —                                     |       |
| 5   | `subty`      | varchar(4)  | YES  | `'0001'::character varying`           |       |
| 6   | `endda`      | date        | NO   | `'9999-12-31'::date`                  |       |
| 7   | `begda`      | date        | NO   | —                                     |       |
| 8   | `bukrs`      | varchar(4)  | YES  | —                                     |       |
| 9   | `kostl`      | varchar(10) | YES  | —                                     |       |
| 10  | `prctr`      | varchar(10) | YES  | —                                     |       |
| 11  | `created_at` | timestamp   | YES  | `CURRENT_TIMESTAMP`                   |       |

#### Primary Key

`(`id`)`

#### Indexes

- `hrp1008_pkey` [PRIMARY] · (`id`)
- `hrp1008_unique` [UNIQUE] · (`plvar`, `otype`, `objid`, `subty`, `begda`)

---

### `hrp1010`

- **Tenant scoped**: no
- **Row estimate**: 0
- **Domains**: DGOV
- **Prisma model**: `hrp1010`

#### Columns

| #   | Column             | Type       | Null | Default                               | Notes |
| --- | ------------------ | ---------- | ---- | ------------------------------------- | ----- |
| 1   | `id`               | int4(32)   | NO   | `nextval('hrp1010_id_seq'::regclass)` | PK    |
| 2   | `plvar`            | varchar(2) | YES  | `'01'::character varying`             |       |
| 3   | `otype`            | varchar(2) | YES  | `'S'::character varying`              |       |
| 4   | `objid`            | varchar(8) | NO   | —                                     |       |
| 5   | `subty`            | varchar(4) | YES  | `'0001'::character varying`           |       |
| 6   | `endda`            | date       | NO   | `'9999-12-31'::date`                  |       |
| 7   | `begda`            | date       | NO   | —                                     |       |
| 8   | `exam_type`        | varchar(4) | YES  | —                                     |       |
| 9   | `exam_required`    | bool       | YES  | `false`                               |       |
| 10  | `frequency_months` | int4(32)   | YES  | —                                     |       |
| 11  | `created_at`       | timestamp  | YES  | `CURRENT_TIMESTAMP`                   |       |

#### Primary Key

`(`id`)`

#### Indexes

- `hrp1010_pkey` [PRIMARY] · (`id`)
- `hrp1010_unique` [UNIQUE] · (`plvar`, `otype`, `objid`, `subty`, `begda`)

---

### `hrp1011`

- **Tenant scoped**: no
- **Row estimate**: 0
- **Domains**: DGOV
- **Prisma model**: `hrp1011`

#### Columns

| #   | Column            | Type         | Null | Default                               | Notes |
| --- | ----------------- | ------------ | ---- | ------------------------------------- | ----- |
| 1   | `id`              | int4(32)     | NO   | `nextval('hrp1011_id_seq'::regclass)` | PK    |
| 2   | `plvar`           | varchar(2)   | YES  | `'01'::character varying`             |       |
| 3   | `otype`           | varchar(2)   | NO   | —                                     |       |
| 4   | `objid`           | varchar(8)   | NO   | —                                     |       |
| 5   | `subty`           | varchar(4)   | YES  | `'0001'::character varying`           |       |
| 6   | `endda`           | date         | NO   | `'9999-12-31'::date`                  |       |
| 7   | `begda`           | date         | NO   | —                                     |       |
| 8   | `work_schedule`   | varchar(8)   | YES  | —                                     |       |
| 9   | `weekly_hours`    | numeric(5,2) | YES  | —                                     |       |
| 10  | `daily_hours`     | numeric(5,2) | YES  | —                                     |       |
| 11  | `shift_indicator` | varchar(2)   | YES  | —                                     |       |
| 12  | `created_at`      | timestamp    | YES  | `CURRENT_TIMESTAMP`                   |       |

#### Primary Key

`(`id`)`

#### Indexes

- `hrp1011_pkey` [PRIMARY] · (`id`)
- `hrp1011_unique` [UNIQUE] · (`plvar`, `otype`, `objid`, `subty`, `begda`)

---

### `hrp1013`

- **Tenant scoped**: no
- **Row estimate**: 0
- **Domains**: DGOV
- **Prisma model**: `hrp1013`

#### Columns

| #   | Column       | Type       | Null | Default                               | Notes |
| --- | ------------ | ---------- | ---- | ------------------------------------- | ----- |
| 1   | `id`         | int4(32)   | NO   | `nextval('hrp1013_id_seq'::regclass)` | PK    |
| 2   | `plvar`      | varchar(2) | YES  | `'01'::character varying`             |       |
| 3   | `otype`      | varchar(2) | NO   | —                                     |       |
| 4   | `objid`      | varchar(8) | NO   | —                                     |       |
| 5   | `subty`      | varchar(4) | YES  | `'0001'::character varying`           |       |
| 6   | `endda`      | date       | NO   | `'9999-12-31'::date`                  |       |
| 7   | `begda`      | date       | NO   | —                                     |       |
| 8   | `persg`      | varchar(1) | YES  | —                                     |       |
| 9   | `persk`      | varchar(2) | YES  | —                                     |       |
| 10  | `created_at` | timestamp  | YES  | `CURRENT_TIMESTAMP`                   |       |

#### Primary Key

`(`id`)`

#### Indexes

- `hrp1013_pkey` [PRIMARY] · (`id`)
- `hrp1013_unique` [UNIQUE] · (`plvar`, `otype`, `objid`, `subty`, `begda`)

---

### `hrp1014`

- **Tenant scoped**: no
- **Row estimate**: 0
- **Domains**: DGOV
- **Prisma model**: `hrp1014`

#### Columns

| #   | Column              | Type       | Null | Default                               | Notes |
| --- | ------------------- | ---------- | ---- | ------------------------------------- | ----- |
| 1   | `id`                | int4(32)   | NO   | `nextval('hrp1014_id_seq'::regclass)` | PK    |
| 2   | `plvar`             | varchar(2) | YES  | `'01'::character varying`             |       |
| 3   | `otype`             | varchar(2) | NO   | —                                     |       |
| 4   | `objid`             | varchar(8) | NO   | —                                     |       |
| 5   | `subty`             | varchar(4) | YES  | `'0001'::character varying`           |       |
| 6   | `endda`             | date       | NO   | `'9999-12-31'::date`                  |       |
| 7   | `begda`             | date       | NO   | —                                     |       |
| 8   | `obsolete`          | bool       | YES  | `false`                               |       |
| 9   | `obsolete_reason`   | varchar(4) | YES  | —                                     |       |
| 10  | `replacement_objid` | varchar(8) | YES  | —                                     |       |
| 11  | `created_at`        | timestamp  | YES  | `CURRENT_TIMESTAMP`                   |       |

#### Primary Key

`(`id`)`

#### Indexes

- `hrp1014_pkey` [PRIMARY] · (`id`)
- `hrp1014_unique` [UNIQUE] · (`plvar`, `otype`, `objid`, `subty`, `begda`)

---

### `hrp1035`

> The underlying table does not contain a valid unique identifier and can therefore currently not be handled by Prisma Client.

- **Tenant scoped**: no
- **Row estimate**: 400
- **Domains**: DGOV
- **Prisma model**: `hrp1035`

#### Columns

| #   | Column                  | Type         | Null | Default                               | Notes |
| --- | ----------------------- | ------------ | ---- | ------------------------------------- | ----- |
| 1   | `id`                    | int4(32)     | NO   | `nextval('hrp1035_id_seq'::regclass)` |       |
| 2   | `plvar`                 | varchar(2)   | YES  | `'01'::character varying`             |       |
| 3   | `otype`                 | varchar(2)   | NO   | —                                     |       |
| 4   | `objid`                 | varchar(8)   | NO   | —                                     |       |
| 5   | `subty`                 | varchar(4)   | YES  | `'0001'::character varying`           |       |
| 6   | `endda`                 | date         | NO   | `'9999-12-31'::date`                  |       |
| 7   | `begda`                 | date         | NO   | `'1900-01-01'::date`                  |       |
| 8   | `quali`                 | varchar(8)   | NO   | —                                     |       |
| 9   | `proficiency_required`  | varchar(2)   | YES  | —                                     |       |
| 10  | `proficiency_essential` | bool         | YES  | `false`                               |       |
| 11  | `weight`                | numeric(3,2) | YES  | `1.00`                                |       |
| 12  | `esco_skill_uri`        | varchar(255) | YES  | —                                     |       |
| 13  | `esco_skill_type`       | varchar(50)  | YES  | —                                     |       |
| 14  | `created_at`            | timestamp    | YES  | `CURRENT_TIMESTAMP`                   |       |
| 15  | `updated_at`            | timestamp    | YES  | `CURRENT_TIMESTAMP`                   |       |

#### Indexes

- `idx_hrp1035_esco` [INDEX] · (`esco_skill_uri`)
- `idx_hrp1035_obj` [INDEX] · (`otype`, `objid`)
- `idx_hrp1035_quali` [INDEX] · (`quali`)

---

### `hrp1036`

> The underlying table does not contain a valid unique identifier and can therefore currently not be handled by Prisma Client.

- **Tenant scoped**: no
- **Row estimate**: 200
- **Domains**: DGOV
- **Prisma model**: `hrp1036`

#### Columns

| #   | Column             | Type         | Null | Default                               | Notes |
| --- | ------------------ | ------------ | ---- | ------------------------------------- | ----- |
| 1   | `id`               | int4(32)     | NO   | `nextval('hrp1036_id_seq'::regclass)` |       |
| 2   | `plvar`            | varchar(2)   | YES  | `'01'::character varying`             |       |
| 3   | `otype`            | varchar(2)   | YES  | `'Q'::character varying`              |       |
| 4   | `objid`            | varchar(8)   | NO   | —                                     |       |
| 5   | `endda`            | date         | NO   | `'9999-12-31'::date`                  |       |
| 6   | `begda`            | date         | NO   | `'1900-01-01'::date`                  |       |
| 7   | `langu`            | varchar(2)   | YES  | `'EN'::character varying`             |       |
| 8   | `short_name`       | varchar(12)  | YES  | —                                     |       |
| 9   | `qual_name`        | varchar(80)  | NO   | —                                     |       |
| 10  | `qual_description` | text         | YES  | —                                     |       |
| 11  | `qual_group`       | varchar(8)   | YES  | —                                     |       |
| 12  | `qual_type`        | varchar(4)   | YES  | —                                     |       |
| 13  | `esco_skill_uri`   | varchar(255) | YES  | —                                     |       |
| 14  | `esco_skill_type`  | varchar(50)  | YES  | —                                     |       |
| 15  | `esco_reuse_level` | varchar(20)  | YES  | —                                     |       |
| 16  | `is_active`        | bool         | YES  | `true`                                |       |
| 17  | `created_at`       | timestamp    | YES  | `CURRENT_TIMESTAMP`                   |       |
| 18  | `updated_at`       | timestamp    | YES  | `CURRENT_TIMESTAMP`                   |       |
| 19  | `deleted_at`       | timestamptz  | YES  | —                                     |       |

#### Indexes

- `idx_hrp1036_active` [INDEX] · (`id`)
- `idx_hrp1036_esco` [INDEX] · (`esco_skill_uri`)
- `idx_hrp1036_group` [INDEX] · (`qual_group`)
- `idx_hrp1036_objid` [INDEX] · (`objid`)

---

### `hrp5001`

> The underlying table does not contain a valid unique identifier and can therefore currently not be handled by Prisma Client.

- **Tenant scoped**: no
- **Row estimate**: 6
- **Domains**: DGOV
- **Prisma model**: `hrp5001`

#### Columns

| #   | Column                 | Type        | Null | Default                               | Notes |
| --- | ---------------------- | ----------- | ---- | ------------------------------------- | ----- |
| 1   | `id`                   | int4(32)    | NO   | `nextval('hrp5001_id_seq'::regclass)` |       |
| 2   | `plvar`                | varchar(2)  | YES  | `'01'::character varying`             |       |
| 3   | `otype`                | varchar(2)  | YES  | `'VA'::character varying`             |       |
| 4   | `objid`                | varchar(8)  | NO   | —                                     |       |
| 5   | `subty`                | varchar(4)  | YES  | `'0001'::character varying`           |       |
| 6   | `endda`                | date        | NO   | `'9999-12-31'::date`                  |       |
| 7   | `begda`                | date        | NO   | `'1900-01-01'::date`                  |       |
| 8   | `template_name`        | varchar(80) | NO   | —                                     |       |
| 9   | `template_description` | text        | YES  | —                                     |       |
| 10  | `template_type`        | varchar(4)  | YES  | —                                     |       |
| 11  | `rating_scale`         | varchar(4)  | YES  | `'5PT'::character varying`            |       |
| 12  | `include_goals`        | bool        | YES  | `true`                                |       |
| 13  | `include_competencies` | bool        | YES  | `true`                                |       |
| 14  | `include_development`  | bool        | YES  | `true`                                |       |
| 15  | `self_assessment`      | bool        | YES  | `true`                                |       |
| 16  | `manager_assessment`   | bool        | YES  | `true`                                |       |
| 17  | `peer_assessment`      | bool        | YES  | `false`                               |       |
| 18  | `is_active`            | bool        | YES  | `true`                                |       |
| 19  | `created_at`           | timestamp   | YES  | `CURRENT_TIMESTAMP`                   |       |
| 20  | `updated_at`           | timestamp   | YES  | `CURRENT_TIMESTAMP`                   |       |
| 21  | `deleted_at`           | timestamptz | YES  | —                                     |       |

#### Indexes

- `idx_hrp5001_active` [INDEX] · (`id`)
- `idx_hrp5001_type` [INDEX] · (`template_type`)

---

### `hrp5002`

- **Tenant scoped**: no
- **Row estimate**: 0
- **Domains**: DGOV
- **Prisma model**: `hrp5002`

#### Columns

| #   | Column                  | Type         | Null | Default                               | Notes |
| --- | ----------------------- | ------------ | ---- | ------------------------------------- | ----- |
| 1   | `id`                    | int4(32)     | NO   | `nextval('hrp5002_id_seq'::regclass)` | PK    |
| 2   | `plvar`                 | varchar(2)   | YES  | `'01'::character varying`             |       |
| 3   | `otype`                 | varchar(2)   | YES  | `'VC'::character varying`             |       |
| 4   | `objid`                 | varchar(8)   | NO   | —                                     |       |
| 5   | `template_id`           | varchar(8)   | NO   | —                                     |       |
| 6   | `subty`                 | varchar(4)   | YES  | `'0001'::character varying`           |       |
| 7   | `endda`                 | date         | NO   | `'9999-12-31'::date`                  |       |
| 8   | `begda`                 | date         | NO   | `'1900-01-01'::date`                  |       |
| 9   | `criterion_name`        | varchar(80)  | NO   | —                                     |       |
| 10  | `criterion_description` | text         | YES  | —                                     |       |
| 11  | `criterion_type`        | varchar(4)   | YES  | —                                     |       |
| 12  | `weight`                | numeric(5,2) | YES  | `1.00`                                |       |
| 13  | `sequence`              | int4(32)     | YES  | `1`                                   |       |
| 14  | `quali`                 | varchar(8)   | YES  | —                                     |       |
| 15  | `min_rating`            | int4(32)     | YES  | `1`                                   |       |
| 16  | `max_rating`            | int4(32)     | YES  | `5`                                   |       |
| 17  | `created_at`            | timestamp    | YES  | `CURRENT_TIMESTAMP`                   |       |

#### Primary Key

`(`id`)`

#### Indexes

- `hrp5002_pkey` [PRIMARY] · (`id`)
- `hrp5002_unique` [UNIQUE] · (`plvar`, `template_id`, `objid`)
- `idx_hrp5002_quali` [INDEX] · (`quali`)
- `idx_hrp5002_template` [INDEX] · (`template_id`)

---

### `hrpdev1`

> The underlying table does not contain a valid unique identifier and can therefore currently not be handled by Prisma Client.

- **Tenant scoped**: no
- **Row estimate**: 200
- **Domains**: DGOV
- **Prisma model**: `hrpdev1`

#### Columns

| #   | Column                | Type         | Null | Default                               | Notes |
| --- | --------------------- | ------------ | ---- | ------------------------------------- | ----- |
| 1   | `id`                  | int4(32)     | NO   | `nextval('hrpdev1_id_seq'::regclass)` |       |
| 2   | `plvar`               | varchar(2)   | YES  | `'01'::character varying`             |       |
| 3   | `position_id`         | varchar(8)   | NO   | —                                     |       |
| 4   | `successor_pernr`     | varchar(8)   | NO   | —                                     |       |
| 5   | `endda`               | date         | NO   | `'9999-12-31'::date`                  |       |
| 6   | `begda`               | date         | NO   | `'1900-01-01'::date`                  |       |
| 7   | `readiness`           | varchar(2)   | YES  | —                                     |       |
| 8   | `readiness_pct`       | numeric(5,2) | YES  | —                                     |       |
| 9   | `ranking`             | int4(32)     | YES  | —                                     |       |
| 10  | `talent_pool`         | varchar(4)   | YES  | —                                     |       |
| 11  | `potential_rating`    | varchar(2)   | YES  | —                                     |       |
| 12  | `performance_rating`  | varchar(2)   | YES  | —                                     |       |
| 13  | `mobility`            | varchar(2)   | YES  | —                                     |       |
| 14  | `development_plan_id` | varchar(20)  | YES  | —                                     |       |
| 15  | `gap_analysis`        | text         | YES  | —                                     |       |
| 16  | `status`              | varchar(2)   | YES  | `'01'::character varying`             |       |
| 17  | `reviewed_date`       | date         | YES  | —                                     |       |
| 18  | `reviewed_by`         | varchar(8)   | YES  | —                                     |       |
| 19  | `created_at`          | timestamp    | YES  | `CURRENT_TIMESTAMP`                   |       |
| 20  | `updated_at`          | timestamp    | YES  | `CURRENT_TIMESTAMP`                   |       |

#### Indexes

- `idx_hrpdev1_position` [INDEX] · (`position_id`)
- `idx_hrpdev1_readiness` [INDEX] · (`readiness`)
- `idx_hrpdev1_successor` [INDEX] · (`successor_pernr`)

---

### `import_jobs`

- **Tenant scoped**: yes
- **Row estimate**: 2
- **Domains**: DGOV
- **Prisma model**: `import_jobs`
- **RLS**: enabled (forced)

#### Columns

| #   | Column            | Type         | Null | Default                               | Notes |
| --- | ----------------- | ------------ | ---- | ------------------------------------- | ----- |
| 1   | `id`              | uuid         | NO   | `gen_random_uuid()`                   | PK    |
| 2   | `tenant_id`       | uuid         | NO   | —                                     |       |
| 3   | `import_type`     | varchar(50)  | NO   | —                                     |       |
| 4   | `file_name`       | varchar(500) | NO   | —                                     |       |
| 5   | `file_size_bytes` | int4(32)     | NO   | —                                     |       |
| 6   | `mime_type`       | varchar(100) | NO   | —                                     |       |
| 7   | `status`          | varchar(20)  | NO   | `'pending_review'::character varying` |       |
| 8   | `total_rows`      | int4(32)     | NO   | `0`                                   |       |
| 9   | `valid_rows`      | int4(32)     | NO   | `0`                                   |       |
| 10  | `error_rows`      | int4(32)     | NO   | `0`                                   |       |
| 11  | `created_rows`    | int4(32)     | YES  | —                                     |       |
| 12  | `updated_rows`    | int4(32)     | YES  | —                                     |       |
| 13  | `skipped_rows`    | int4(32)     | YES  | —                                     |       |
| 14  | `errors`          | jsonb        | YES  | `'[]'::jsonb`                         |       |
| 15  | `warnings`        | jsonb        | YES  | `'[]'::jsonb`                         |       |
| 16  | `preview_data`    | jsonb        | YES  | —                                     |       |
| 17  | `uploaded_by`     | uuid         | NO   | —                                     |       |
| 18  | `executed_at`     | timestamptz  | YES  | —                                     |       |
| 19  | `completed_at`    | timestamptz  | YES  | —                                     |       |
| 20  | `created_at`      | timestamptz  | NO   | `now()`                               |       |
| 21  | `updated_at`      | timestamptz  | NO   | `now()`                               |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns     | References    | ON UPDATE | ON DELETE | Notes |
| ----------- | ------------- | --------- | --------- | ----- |
| `tenant_id` | `tenants(id)` | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_import_jobs_status` [INDEX] · (`tenant_id`, `status`)
- `idx_import_jobs_tenant` [INDEX] · (`tenant_id`)
- `import_jobs_pkey` [PRIMARY] · (`id`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`

#### Inverse relations (referenced by)

- `import_skill_links` via (`import_job_id`)

---

### `import_skill_links`

- **Tenant scoped**: yes
- **Row estimate**: 0
- **Domains**: SKILGRO · DGOV
- **Prisma model**: `import_skill_links`
- **RLS**: enabled (forced)

#### Columns

| #   | Column          | Type         | Null | Default                     | Notes |
| --- | --------------- | ------------ | ---- | --------------------------- | ----- |
| 1   | `id`            | uuid         | NO   | `gen_random_uuid()`         | PK    |
| 2   | `import_job_id` | uuid         | NO   | —                           |       |
| 3   | `tenant_id`     | uuid         | NO   | —                           |       |
| 4   | `input_text`    | varchar(500) | NO   | —                           |       |
| 5   | `esco_skill_id` | uuid         | YES  | —                           |       |
| 6   | `similarity`    | numeric(5,4) | YES  | —                           |       |
| 7   | `confidence`    | varchar(10)  | NO   | `'none'::character varying` |       |
| 8   | `accepted`      | bool         | YES  | —                           |       |
| 9   | `created_at`    | timestamptz  | NO   | `now()`                     |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns         | References        | ON UPDATE | ON DELETE | Notes |
| --------------- | ----------------- | --------- | --------- | ----- |
| `esco_skill_id` | `esco_skills(id)` | NO ACTION | RESTRICT  |       |
| `import_job_id` | `import_jobs(id)` | NO ACTION | CASCADE   |       |
| `tenant_id`     | `tenants(id)`     | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_import_skill_links_esco_skill_id` [INDEX] · (`esco_skill_id`)
- `idx_import_skill_links_job` [INDEX] · (`import_job_id`)
- `idx_import_skill_links_tenant` [INDEX] · (`tenant_id`)
- `import_skill_links_pkey` [PRIMARY] · (`id`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`

---

### `integration_sync_logs`

- **Tenant scoped**: yes
- **Row estimate**: 100
- **Domains**: DGOV
- **Prisma model**: `integration_sync_logs`
- **RLS**: enabled (forced)

#### Columns

| #   | Column              | Type        | Null | Default                            | Notes |
| --- | ------------------- | ----------- | ---- | ---------------------------------- | ----- |
| 1   | `id`                | uuid        | NO   | `gen_random_uuid()`                | PK    |
| 2   | `integration_id`    | uuid        | NO   | —                                  |       |
| 3   | `tenant_id`         | uuid        | NO   | —                                  |       |
| 4   | `status`            | varchar(50) | YES  | `'pending'::character varying`     |       |
| 5   | `sync_type`         | varchar(50) | YES  | `'incremental'::character varying` |       |
| 6   | `records_processed` | int4(32)    | YES  | `0`                                |       |
| 7   | `records_created`   | int4(32)    | YES  | `0`                                |       |
| 8   | `records_updated`   | int4(32)    | YES  | `0`                                |       |
| 9   | `records_failed`    | int4(32)    | YES  | `0`                                |       |
| 10  | `error_message`     | text        | YES  | —                                  |       |
| 11  | `started_at`        | timestamptz | YES  | `now()`                            |       |
| 12  | `completed_at`      | timestamptz | YES  | —                                  |       |
| 13  | `created_at`        | timestamptz | YES  | `now()`                            |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns          | References         | ON UPDATE | ON DELETE | Notes |
| ---------------- | ------------------ | --------- | --------- | ----- |
| `integration_id` | `integrations(id)` | NO ACTION | CASCADE   |       |
| `tenant_id`      | `tenants(id)`      | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_integration_sync_logs_int` [INDEX] · (`integration_id`)
- `idx_integration_sync_logs_tenant_id` [INDEX] · (`tenant_id`)
- `integration_sync_logs_pkey` [PRIMARY] · (`id`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

---

### `integrations`

- **Tenant scoped**: yes
- **Row estimate**: 20
- **Domains**: DGOV
- **Prisma model**: `integrations`
- **RLS**: enabled (forced)

#### Columns

| #   | Column             | Type         | Null | Default                              | Notes |
| --- | ------------------ | ------------ | ---- | ------------------------------------ | ----- |
| 1   | `id`               | uuid         | NO   | `gen_random_uuid()`                  | PK    |
| 2   | `tenant_id`        | uuid         | NO   | —                                    |       |
| 3   | `name`             | varchar(255) | NO   | —                                    |       |
| 4   | `type`             | varchar(50)  | NO   | —                                    |       |
| 5   | `provider`         | varchar(100) | NO   | —                                    |       |
| 6   | `status`           | varchar(50)  | YES  | `'pending_setup'::character varying` |       |
| 7   | `config`           | jsonb        | YES  | —                                    |       |
| 8   | `sync_frequency`   | varchar(50)  | YES  | `'daily'::character varying`         |       |
| 9   | `sync_direction`   | varchar(50)  | YES  | `'bidirectional'::character varying` |       |
| 10  | `field_mappings`   | jsonb        | YES  | —                                    |       |
| 11  | `last_sync_at`     | timestamptz  | YES  | —                                    |       |
| 12  | `last_sync_status` | varchar(50)  | YES  | —                                    |       |
| 13  | `error_count`      | int4(32)     | YES  | `0`                                  |       |
| 14  | `created_at`       | timestamptz  | YES  | `now()`                              |       |
| 15  | `updated_at`       | timestamptz  | YES  | `now()`                              |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns     | References    | ON UPDATE | ON DELETE | Notes |
| ----------- | ------------- | --------- | --------- | ----- |
| `tenant_id` | `tenants(id)` | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_integrations_status` [INDEX] · (`tenant_id`, `status`)
- `idx_integrations_tenant` [INDEX] · (`tenant_id`)
- `integrations_pkey` [PRIMARY] · (`id`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

#### Inverse relations (referenced by)

- `integration_sync_logs` via (`integration_id`)

---

### `notification_preferences`

- **Tenant scoped**: no
- **Row estimate**: 266
- **Domains**: DGOV
- **Prisma model**: `notification_preferences`

#### Columns

| #   | Column                      | Type      | Null | Default             | Notes |
| --- | --------------------------- | --------- | ---- | ------------------- | ----- |
| 1   | `id`                        | uuid      | NO   | `gen_random_uuid()` | PK    |
| 2   | `user_id`                   | uuid      | NO   | —                   |       |
| 3   | `email_enabled`             | bool      | YES  | `true`              |       |
| 4   | `in_app_enabled`            | bool      | YES  | `true`              |       |
| 5   | `goal_reminders`            | bool      | YES  | `true`              |       |
| 6   | `review_reminders`          | bool      | YES  | `true`              |       |
| 7   | `flight_risk_alerts`        | bool      | YES  | `true`              |       |
| 8   | `checkin_reminders`         | bool      | YES  | `true`              |       |
| 9   | `survey_notifications`      | bool      | YES  | `true`              |       |
| 10  | `recognition_notifications` | bool      | YES  | `true`              |       |
| 11  | `system_notifications`      | bool      | YES  | `true`              |       |
| 12  | `quiet_hours_start`         | time      | YES  | —                   |       |
| 13  | `quiet_hours_end`           | time      | YES  | —                   |       |
| 14  | `created_at`                | timestamp | YES  | `now()`             |       |
| 15  | `updated_at`                | timestamp | YES  | `now()`             |       |
| 16  | `mentorship_notifications`  | bool      | YES  | `true`              |       |
| 17  | `mobility_notifications`    | bool      | YES  | `true`              |       |
| 18  | `wellbeing_notifications`   | bool      | YES  | `true`              |       |
| 19  | `user_id_employee_id`       | uuid      | YES  | —                   |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns               | References           | ON UPDATE | ON DELETE | Notes |
| --------------------- | -------------------- | --------- | --------- | ----- |
| `user_id`             | `users(id)`          | NO ACTION | SET NULL  |       |
| `user_id_employee_id` | `employees_core(id)` | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_notification_preferences_user_id_employee_id` [INDEX] · (`user_id_employee_id`)
- `notification_preferences_pkey` [PRIMARY] · (`id`)
- `notification_preferences_user_id_unique` [UNIQUE] · (`user_id`)

---

### `notifications`

- **Tenant scoped**: yes
- **Row estimate**: 238
- **Domains**: DGOV
- **Prisma model**: `notifications`
- **RLS**: enabled (forced)

#### Columns

| #   | Column                | Type         | Null | Default                       | Notes |
| --- | --------------------- | ------------ | ---- | ----------------------------- | ----- |
| 1   | `id`                  | uuid         | NO   | `gen_random_uuid()`           | PK    |
| 2   | `type`                | varchar(50)  | NO   | —                             |       |
| 3   | `title`               | varchar(255) | NO   | —                             |       |
| 4   | `message`             | text         | NO   | —                             |       |
| 5   | `priority`            | varchar(20)  | YES  | `'medium'::character varying` |       |
| 6   | `read`                | bool         | YES  | `false`                       |       |
| 7   | `read_at`             | timestamp    | YES  | —                             |       |
| 8   | `user_id`             | uuid         | NO   | —                             |       |
| 9   | `tenant_id`           | uuid         | NO   | —                             |       |
| 10  | `action_url`          | varchar(500) | YES  | —                             |       |
| 11  | `action_label`        | varchar(100) | YES  | —                             |       |
| 12  | `metadata`            | jsonb        | YES  | `'{}'::jsonb`                 |       |
| 13  | `created_at`          | timestamp    | YES  | `now()`                       |       |
| 14  | `expires_at`          | timestamp    | YES  | —                             |       |
| 15  | `user_id_employee_id` | uuid         | YES  | —                             |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns               | References           | ON UPDATE | ON DELETE | Notes |
| --------------------- | -------------------- | --------- | --------- | ----- |
| `user_id`             | `users(id)`          | NO ACTION | SET NULL  |       |
| `tenant_id`           | `tenants(id)`        | NO ACTION | CASCADE   |       |
| `user_id_employee_id` | `employees_core(id)` | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_notifications_created_at` [INDEX] · (`created_at`)
- `idx_notifications_tenant` [INDEX] · (`tenant_id`)
- `idx_notifications_type` [INDEX] · (`type`)
- `idx_notifications_user_id` [INDEX] · (`user_id`)
- `idx_notifications_user_id_employee_id` [INDEX] · (`user_id_employee_id`)
- `idx_notifications_user_read` [INDEX] · (`user_id`, `read`)
- `notifications_pkey` [PRIMARY] · (`id`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

---

### `pa0000`

> The underlying table does not contain a valid unique identifier and can therefore currently not be handled by Prisma Client.

- **Tenant scoped**: no
- **Row estimate**: 1142
- **Domains**: DGOV
- **Prisma model**: `pa0000`

#### Columns

| #   | Column       | Type       | Null | Default                              | Notes |
| --- | ------------ | ---------- | ---- | ------------------------------------ | ----- |
| 1   | `id`         | int4(32)   | NO   | `nextval('pa0000_id_seq'::regclass)` |       |
| 2   | `pernr`      | varchar(8) | NO   | —                                    |       |
| 3   | `subty`      | varchar(4) | NO   | `''::character varying`              |       |
| 4   | `endda`      | date       | NO   | —                                    |       |
| 5   | `begda`      | date       | NO   | —                                    |       |
| 6   | `massn`      | varchar(2) | YES  | —                                    |       |
| 7   | `massg`      | varchar(2) | YES  | —                                    |       |
| 8   | `stat2`      | varchar(1) | YES  | —                                    |       |
| 9   | `created_at` | timestamp  | YES  | `now()`                              |       |

#### Indexes

- `idx_pa0000_pernr` [INDEX] · (`pernr`)

---

### `pa0001`

> The underlying table does not contain a valid unique identifier and can therefore currently not be handled by Prisma Client.

- **Tenant scoped**: no
- **Row estimate**: 1774
- **Domains**: DGOV
- **Prisma model**: `pa0001`

#### Columns

| #   | Column       | Type        | Null | Default                              | Notes |
| --- | ------------ | ----------- | ---- | ------------------------------------ | ----- |
| 1   | `id`         | int4(32)    | NO   | `nextval('pa0001_id_seq'::regclass)` |       |
| 2   | `pernr`      | varchar(8)  | NO   | —                                    |       |
| 3   | `endda`      | date        | NO   | —                                    |       |
| 4   | `begda`      | date        | NO   | —                                    |       |
| 5   | `bukrs`      | varchar(4)  | YES  | —                                    |       |
| 6   | `werks`      | varchar(4)  | YES  | —                                    |       |
| 7   | `btrtl`      | varchar(4)  | YES  | —                                    |       |
| 8   | `persg`      | varchar(1)  | YES  | —                                    |       |
| 9   | `persk`      | varchar(2)  | YES  | —                                    |       |
| 10  | `plans`      | varchar(8)  | YES  | —                                    |       |
| 11  | `orgeh`      | varchar(8)  | YES  | —                                    |       |
| 12  | `stell`      | varchar(8)  | YES  | —                                    |       |
| 13  | `kostl`      | varchar(10) | YES  | —                                    |       |
| 14  | `created_at` | timestamp   | YES  | `now()`                              |       |

#### Indexes

- `idx_pa0001_orgeh` [INDEX] · (`orgeh`)
- `idx_pa0001_pernr` [INDEX] · (`pernr`)
- `idx_pa0001_plans` [INDEX] · (`plans`)

---

### `pa0002`

> The underlying table does not contain a valid unique identifier and can therefore currently not be handled by Prisma Client.

- **Tenant scoped**: no
- **Row estimate**: 1458
- **Domains**: DGOV
- **Prisma model**: `pa0002`

#### Columns

| #   | Column       | Type        | Null | Default                              | Notes |
| --- | ------------ | ----------- | ---- | ------------------------------------ | ----- |
| 1   | `id`         | int4(32)    | NO   | `nextval('pa0002_id_seq'::regclass)` |       |
| 2   | `pernr`      | varchar(8)  | NO   | —                                    |       |
| 3   | `endda`      | date        | NO   | —                                    |       |
| 4   | `begda`      | date        | NO   | —                                    |       |
| 5   | `nachn`      | varchar(40) | NO   | —                                    |       |
| 6   | `vorna`      | varchar(40) | NO   | —                                    |       |
| 7   | `midnm`      | varchar(40) | YES  | —                                    |       |
| 8   | `gbdat`      | date        | YES  | —                                    |       |
| 9   | `gbort`      | varchar(40) | YES  | —                                    |       |
| 10  | `natio`      | varchar(3)  | YES  | —                                    |       |
| 11  | `gesch`      | varchar(1)  | YES  | —                                    |       |
| 12  | `famst`      | varchar(1)  | YES  | —                                    |       |
| 13  | `created_at` | timestamp   | YES  | `now()`                              |       |

#### Indexes

- `idx_pa0002_pernr` [INDEX] · (`pernr`)

---

### `pa0003`

> The underlying table does not contain a valid unique identifier and can therefore currently not be handled by Prisma Client.

- **Tenant scoped**: no
- **Row estimate**: 1142
- **Domains**: DGOV
- **Prisma model**: `pa0003`

#### Columns

| #   | Column                | Type       | Null | Default                              | Notes |
| --- | --------------------- | ---------- | ---- | ------------------------------------ | ----- |
| 1   | `id`                  | int4(32)   | NO   | `nextval('pa0003_id_seq'::regclass)` |       |
| 2   | `pernr`               | varchar(8) | NO   | —                                    |       |
| 3   | `subty`               | varchar(4) | YES  | `'0001'::character varying`          |       |
| 4   | `endda`               | date       | NO   | `'9999-12-31'::date`                 |       |
| 5   | `begda`               | date       | NO   | —                                    |       |
| 6   | `abession`            | varchar(4) | YES  | —                                    |       |
| 7   | `aession`             | varchar(2) | YES  | —                                    |       |
| 8   | `stat2`               | varchar(2) | YES  | —                                    |       |
| 9   | `most_recent_payroll` | date       | YES  | —                                    |       |
| 10  | `next_payroll`        | date       | YES  | —                                    |       |
| 11  | `retro_from`          | date       | YES  | —                                    |       |
| 12  | `created_at`          | timestamp  | YES  | `CURRENT_TIMESTAMP`                  |       |
| 13  | `updated_at`          | timestamp  | YES  | `CURRENT_TIMESTAMP`                  |       |

#### Indexes

- `idx_pa0003_pernr` [INDEX] · (`pernr`)

---

### `pa0005`

> The underlying table does not contain a valid unique identifier and can therefore currently not be handled by Prisma Client.

- **Tenant scoped**: no
- **Row estimate**: 1142
- **Domains**: DGOV
- **Prisma model**: `pa0005`

#### Columns

| #   | Column               | Type         | Null | Default                              | Notes |
| --- | -------------------- | ------------ | ---- | ------------------------------------ | ----- |
| 1   | `id`                 | int4(32)     | NO   | `nextval('pa0005_id_seq'::regclass)` |       |
| 2   | `pernr`              | varchar(8)   | NO   | —                                    |       |
| 3   | `subty`              | varchar(4)   | NO   | —                                    |       |
| 4   | `endda`              | date         | NO   | `'9999-12-31'::date`                 |       |
| 5   | `begda`              | date         | NO   | —                                    |       |
| 6   | `annual_entitlement` | numeric(7,2) | YES  | —                                    |       |
| 7   | `carry_over_max`     | numeric(7,2) | YES  | —                                    |       |
| 8   | `accrual_rule`       | varchar(4)   | YES  | —                                    |       |
| 9   | `service_years_rule` | bool         | YES  | `false`                              |       |
| 10  | `service_increment`  | numeric(5,2) | YES  | —                                    |       |
| 11  | `created_at`         | timestamp    | YES  | `CURRENT_TIMESTAMP`                  |       |
| 12  | `updated_at`         | timestamp    | YES  | `CURRENT_TIMESTAMP`                  |       |

#### Indexes

- `idx_pa0005_pernr` [INDEX] · (`pernr`)

---

### `pa0006`

> The underlying table does not contain a valid unique identifier and can therefore currently not be handled by Prisma Client.

- **Tenant scoped**: no
- **Row estimate**: 1142
- **Domains**: DGOV
- **Prisma model**: `pa0006`

#### Columns

| #   | Column       | Type        | Null | Default                              | Notes |
| --- | ------------ | ----------- | ---- | ------------------------------------ | ----- |
| 1   | `id`         | int4(32)    | NO   | `nextval('pa0006_id_seq'::regclass)` |       |
| 2   | `pernr`      | varchar(8)  | NO   | —                                    |       |
| 3   | `subty`      | varchar(4)  | NO   | —                                    |       |
| 4   | `endda`      | date        | NO   | —                                    |       |
| 5   | `begda`      | date        | NO   | —                                    |       |
| 6   | `stras`      | varchar(60) | YES  | —                                    |       |
| 7   | `ort01`      | varchar(40) | YES  | —                                    |       |
| 8   | `pstlz`      | varchar(10) | YES  | —                                    |       |
| 9   | `land1`      | varchar(3)  | YES  | —                                    |       |
| 10  | `regio`      | varchar(3)  | YES  | —                                    |       |
| 11  | `created_at` | timestamp   | YES  | `now()`                              |       |

#### Indexes

- `idx_pa0006_pernr` [INDEX] · (`pernr`)

---

### `pa0007`

> The underlying table does not contain a valid unique identifier and can therefore currently not be handled by Prisma Client.

- **Tenant scoped**: no
- **Row estimate**: 1142
- **Domains**: DGOV
- **Prisma model**: `pa0007`

#### Columns

| #   | Column       | Type         | Null | Default                              | Notes |
| --- | ------------ | ------------ | ---- | ------------------------------------ | ----- |
| 1   | `id`         | int4(32)     | NO   | `nextval('pa0007_id_seq'::regclass)` |       |
| 2   | `pernr`      | varchar(8)   | NO   | —                                    |       |
| 3   | `subty`      | varchar(4)   | NO   | `'0'::character varying`             |       |
| 4   | `endda`      | date         | NO   | `'9999-12-31'::date`                 |       |
| 5   | `begda`      | date         | NO   | —                                    |       |
| 6   | `schkz`      | varchar(8)   | YES  | —                                    |       |
| 7   | `zession`    | numeric(5,2) | YES  | —                                    |       |
| 8   | `wession`    | numeric(5,2) | YES  | —                                    |       |
| 9   | `arbst`      | numeric(5,2) | YES  | —                                    |       |
| 10  | `wkwdy`      | int4(32)     | YES  | `5`                                  |       |
| 11  | `created_at` | timestamp    | YES  | `now()`                              |       |

#### Indexes

- `idx_pa0007_pernr` [INDEX] · (`pernr`)

---

### `pa0008`

> The underlying table does not contain a valid unique identifier and can therefore currently not be handled by Prisma Client.

- **Tenant scoped**: no
- **Row estimate**: 1142
- **Domains**: DGOV
- **Prisma model**: `pa0008`

#### Columns

| #   | Column       | Type          | Null | Default                              | Notes |
| --- | ------------ | ------------- | ---- | ------------------------------------ | ----- |
| 1   | `id`         | int4(32)      | NO   | `nextval('pa0008_id_seq'::regclass)` |       |
| 2   | `pernr`      | varchar(8)    | NO   | —                                    |       |
| 3   | `subty`      | varchar(4)    | NO   | `'0'::character varying`             |       |
| 4   | `endda`      | date          | NO   | `'9999-12-31'::date`                 |       |
| 5   | `begda`      | date          | NO   | —                                    |       |
| 6   | `trfar`      | varchar(2)    | YES  | —                                    |       |
| 7   | `trfgb`      | varchar(2)    | YES  | —                                    |       |
| 8   | `trfgr`      | varchar(8)    | YES  | —                                    |       |
| 9   | `trfst`      | varchar(2)    | YES  | —                                    |       |
| 10  | `ansal`      | numeric(15,2) | YES  | —                                    |       |
| 11  | `bet01`      | numeric(15,2) | YES  | —                                    |       |
| 12  | `lga01`      | varchar(4)    | YES  | —                                    |       |
| 13  | `bet02`      | numeric(15,2) | YES  | —                                    |       |
| 14  | `lga02`      | varchar(4)    | YES  | —                                    |       |
| 15  | `divgv`      | int4(32)      | YES  | `12`                                 |       |
| 16  | `waession`   | varchar(5)    | YES  | `'EUR'::character varying`           |       |
| 17  | `bession`    | numeric(5,2)  | YES  | `100.00`                             |       |
| 18  | `created_at` | timestamp     | YES  | `now()`                              |       |

#### Indexes

- `idx_pa0008_pernr` [INDEX] · (`pernr`)

---

### `pa0009`

> The underlying table does not contain a valid unique identifier and can therefore currently not be handled by Prisma Client.

- **Tenant scoped**: no
- **Row estimate**: 1134
- **Domains**: DGOV
- **Prisma model**: `pa0009`

#### Columns

| #   | Column       | Type        | Null | Default                              | Notes |
| --- | ------------ | ----------- | ---- | ------------------------------------ | ----- |
| 1   | `id`         | int4(32)    | NO   | `nextval('pa0009_id_seq'::regclass)` |       |
| 2   | `pernr`      | varchar(8)  | NO   | —                                    |       |
| 3   | `subty`      | varchar(4)  | NO   | `'0'::character varying`             |       |
| 4   | `endda`      | date        | NO   | —                                    |       |
| 5   | `begda`      | date        | NO   | —                                    |       |
| 6   | `banks`      | varchar(3)  | YES  | —                                    |       |
| 7   | `bankl`      | varchar(15) | YES  | —                                    |       |
| 8   | `bankn`      | varchar(18) | YES  | —                                    |       |
| 9   | `iban`       | varchar(34) | YES  | —                                    |       |
| 10  | `swift`      | varchar(11) | YES  | —                                    |       |
| 11  | `created_at` | timestamp   | YES  | `now()`                              |       |

---

### `pa0014`

> The underlying table does not contain a valid unique identifier and can therefore currently not be handled by Prisma Client.

- **Tenant scoped**: no
- **Row estimate**: 1142
- **Domains**: DGOV
- **Prisma model**: `pa0014`

#### Columns

| #   | Column       | Type          | Null | Default                              | Notes |
| --- | ------------ | ------------- | ---- | ------------------------------------ | ----- |
| 1   | `id`         | int4(32)      | NO   | `nextval('pa0014_id_seq'::regclass)` |       |
| 2   | `pernr`      | varchar(8)    | NO   | —                                    |       |
| 3   | `subty`      | varchar(4)    | NO   | —                                    |       |
| 4   | `lgart`      | varchar(4)    | NO   | —                                    |       |
| 5   | `endda`      | date          | NO   | `'9999-12-31'::date`                 |       |
| 6   | `begda`      | date          | NO   | —                                    |       |
| 7   | `seqnr`      | int4(32)      | YES  | `1`                                  |       |
| 8   | `betrg`      | numeric(13,2) | YES  | —                                    |       |
| 9   | `anzhl`      | numeric(7,3)  | YES  | —                                    |       |
| 10  | `waession`   | varchar(5)    | YES  | `'USD'::character varying`           |       |
| 11  | `zession`    | varchar(2)    | YES  | —                                    |       |
| 12  | `kostl`      | varchar(10)   | YES  | —                                    |       |
| 13  | `created_at` | timestamp     | YES  | `CURRENT_TIMESTAMP`                  |       |
| 14  | `updated_at` | timestamp     | YES  | `CURRENT_TIMESTAMP`                  |       |

#### Indexes

- `idx_pa0014_lgart` [INDEX] · (`lgart`)
- `idx_pa0014_pernr` [INDEX] · (`pernr`)

---

### `pa0015`

> The underlying table does not contain a valid unique identifier and can therefore currently not be handled by Prisma Client.

- **Tenant scoped**: no
- **Row estimate**: 912
- **Domains**: DGOV
- **Prisma model**: `pa0015`

#### Columns

| #   | Column       | Type          | Null | Default                              | Notes |
| --- | ------------ | ------------- | ---- | ------------------------------------ | ----- |
| 1   | `id`         | int4(32)      | NO   | `nextval('pa0015_id_seq'::regclass)` |       |
| 2   | `pernr`      | varchar(8)    | NO   | —                                    |       |
| 3   | `subty`      | varchar(4)    | YES  | `'0001'::character varying`          |       |
| 4   | `lgart`      | varchar(4)    | NO   | —                                    |       |
| 5   | `endda`      | date          | NO   | —                                    |       |
| 6   | `begda`      | date          | NO   | —                                    |       |
| 7   | `seqnr`      | int4(32)      | YES  | `1`                                  |       |
| 8   | `betrg`      | numeric(13,2) | NO   | —                                    |       |
| 9   | `waession`   | varchar(5)    | YES  | `'USD'::character varying`           |       |
| 10  | `reason`     | varchar(4)    | YES  | —                                    |       |
| 11  | `pay_date`   | date          | YES  | —                                    |       |
| 12  | `processed`  | bool          | YES  | `false`                              |       |
| 13  | `kostl`      | varchar(10)   | YES  | —                                    |       |
| 14  | `created_at` | timestamp     | YES  | `CURRENT_TIMESTAMP`                  |       |
| 15  | `updated_at` | timestamp     | YES  | `CURRENT_TIMESTAMP`                  |       |

#### Indexes

- `idx_pa0015_lgart` [INDEX] · (`lgart`)
- `idx_pa0015_pernr` [INDEX] · (`pernr`)

---

### `pa0016`

> The underlying table does not contain a valid unique identifier and can therefore currently not be handled by Prisma Client.

- **Tenant scoped**: no
- **Row estimate**: 1142
- **Domains**: DGOV
- **Prisma model**: `pa0016`

#### Columns

| #   | Column             | Type        | Null | Default                              | Notes |
| --- | ------------------ | ----------- | ---- | ------------------------------------ | ----- |
| 1   | `id`               | int4(32)    | NO   | `nextval('pa0016_id_seq'::regclass)` |       |
| 2   | `pernr`            | varchar(8)  | NO   | —                                    |       |
| 3   | `subty`            | varchar(4)  | NO   | `'01'::character varying`            |       |
| 4   | `endda`            | date        | NO   | `'9999-12-31'::date`                 |       |
| 5   | `begda`            | date        | NO   | —                                    |       |
| 6   | `cttyp`            | varchar(2)  | YES  | —                                    |       |
| 7   | `cession`          | varchar(20) | YES  | —                                    |       |
| 8   | `pession`          | varchar(3)  | YES  | —                                    |       |
| 9   | `massn`            | varchar(2)  | YES  | —                                    |       |
| 10  | `termination_date` | date        | YES  | —                                    |       |
| 11  | `probation_end`    | date        | YES  | —                                    |       |
| 12  | `created_at`       | timestamp   | YES  | `now()`                              |       |

#### Indexes

- `idx_pa0016_pernr` [INDEX] · (`pernr`)

---

### `pa0017`

> The underlying table does not contain a valid unique identifier and can therefore currently not be handled by Prisma Client.

- **Tenant scoped**: no
- **Row estimate**: 1142
- **Domains**: DGOV
- **Prisma model**: `pa0017`

#### Columns

| #   | Column          | Type         | Null | Default                              | Notes |
| --- | --------------- | ------------ | ---- | ------------------------------------ | ----- |
| 1   | `id`            | int4(32)     | NO   | `nextval('pa0017_id_seq'::regclass)` |       |
| 2   | `pernr`         | varchar(8)   | NO   | —                                    |       |
| 3   | `subty`         | varchar(4)   | YES  | `'0001'::character varying`          |       |
| 4   | `endda`         | date         | NO   | `'9999-12-31'::date`                 |       |
| 5   | `begda`         | date         | NO   | —                                    |       |
| 6   | `travel_class`  | varchar(4)   | YES  | —                                    |       |
| 7   | `car_policy`    | varchar(4)   | YES  | —                                    |       |
| 8   | `hotel_policy`  | varchar(4)   | YES  | —                                    |       |
| 9   | `per_diem_rate` | numeric(9,2) | YES  | —                                    |       |
| 10  | `currency`      | varchar(5)   | YES  | `'USD'::character varying`           |       |
| 11  | `created_at`    | timestamp    | YES  | `CURRENT_TIMESTAMP`                  |       |

---

### `pa0019`

> The underlying table does not contain a valid unique identifier and can therefore currently not be handled by Prisma Client.

- **Tenant scoped**: no
- **Row estimate**: 1142
- **Domains**: DGOV
- **Prisma model**: `pa0019`

#### Columns

| #   | Column           | Type        | Null | Default                              | Notes |
| --- | ---------------- | ----------- | ---- | ------------------------------------ | ----- |
| 1   | `id`             | int4(32)    | NO   | `nextval('pa0019_id_seq'::regclass)` |       |
| 2   | `pernr`          | varchar(8)  | NO   | —                                    |       |
| 3   | `subty`          | varchar(4)  | NO   | —                                    |       |
| 4   | `endda`          | date        | NO   | `'9999-12-31'::date`                 |       |
| 5   | `begda`          | date        | NO   | `'1900-01-01'::date`                 |       |
| 6   | `dat01`          | date        | YES  | —                                    |       |
| 7   | `dat02`          | date        | YES  | —                                    |       |
| 8   | `dat03`          | date        | YES  | —                                    |       |
| 9   | `date_type_text` | varchar(40) | YES  | —                                    |       |
| 10  | `reminder_days`  | int4(32)    | YES  | —                                    |       |
| 11  | `reminder_sent`  | bool        | YES  | `false`                              |       |
| 12  | `created_at`     | timestamp   | YES  | `CURRENT_TIMESTAMP`                  |       |
| 13  | `updated_at`     | timestamp   | YES  | `CURRENT_TIMESTAMP`                  |       |

#### Indexes

- `idx_pa0019_dates` [INDEX] · (`dat01`, `dat02`, `dat03`)
- `idx_pa0019_pernr` [INDEX] · (`pernr`)

---

### `pa0021`

> The underlying table does not contain a valid unique identifier and can therefore currently not be handled by Prisma Client.

- **Tenant scoped**: no
- **Row estimate**: 1530
- **Domains**: DGOV
- **Prisma model**: `pa0021`

#### Columns

| #   | Column       | Type        | Null | Default                              | Notes |
| --- | ------------ | ----------- | ---- | ------------------------------------ | ----- |
| 1   | `id`         | int4(32)    | NO   | `nextval('pa0021_id_seq'::regclass)` |       |
| 2   | `pernr`      | varchar(8)  | NO   | —                                    |       |
| 3   | `subty`      | varchar(4)  | NO   | —                                    |       |
| 4   | `endda`      | date        | NO   | `'9999-12-31'::date`                 |       |
| 5   | `begda`      | date        | NO   | —                                    |       |
| 6   | `famsa`      | varchar(2)  | YES  | —                                    |       |
| 7   | `faession`   | varchar(40) | YES  | —                                    |       |
| 8   | `fession`    | varchar(40) | YES  | —                                    |       |
| 9   | `gbdat`      | date        | YES  | —                                    |       |
| 10  | `fasession`  | varchar(1)  | YES  | —                                    |       |
| 11  | `favor`      | bool        | YES  | `false`                              |       |
| 12  | `created_at` | timestamp   | YES  | `now()`                              |       |

#### Indexes

- `idx_pa0021_pernr` [INDEX] · (`pernr`)

---

### `pa0022`

> The underlying table does not contain a valid unique identifier and can therefore currently not be handled by Prisma Client.

- **Tenant scoped**: no
- **Row estimate**: 1138
- **Domains**: DGOV
- **Prisma model**: `pa0022`

#### Columns

| #   | Column                   | Type         | Null | Default                              | Notes |
| --- | ------------------------ | ------------ | ---- | ------------------------------------ | ----- |
| 1   | `id`                     | int4(32)     | NO   | `nextval('pa0022_id_seq'::regclass)` |       |
| 2   | `pernr`                  | varchar(8)   | NO   | —                                    |       |
| 3   | `subty`                  | varchar(4)   | NO   | —                                    |       |
| 4   | `endda`                  | date         | NO   | `'9999-12-31'::date`                 |       |
| 5   | `begda`                  | date         | NO   | —                                    |       |
| 6   | `slart`                  | varchar(4)   | YES  | —                                    |       |
| 7   | `insti`                  | varchar(80)  | YES  | —                                    |       |
| 8   | `slabs`                  | varchar(80)  | YES  | —                                    |       |
| 9   | `anession`               | varchar(4)   | YES  | —                                    |       |
| 10  | `sltp1`                  | varchar(40)  | YES  | —                                    |       |
| 11  | `sltp2`                  | varchar(40)  | YES  | —                                    |       |
| 12  | `end_year`               | int4(32)     | YES  | —                                    |       |
| 13  | `grade`                  | varchar(10)  | YES  | —                                    |       |
| 14  | `esco_qualification_uri` | varchar(255) | YES  | —                                    |       |
| 15  | `created_at`             | timestamp    | YES  | `now()`                              |       |

#### Indexes

- `idx_pa0022_pernr` [INDEX] · (`pernr`)

---

### `pa0024`

> The underlying table does not contain a valid unique identifier and can therefore currently not be handled by Prisma Client.

- **Tenant scoped**: no
- **Row estimate**: 9640
- **Domains**: DGOV
- **Prisma model**: `pa0024`

#### Columns

| #   | Column               | Type         | Null | Default                              | Notes |
| --- | -------------------- | ------------ | ---- | ------------------------------------ | ----- |
| 1   | `id`                 | int4(32)     | NO   | `nextval('pa0024_id_seq'::regclass)` |       |
| 2   | `pernr`              | varchar(8)   | NO   | —                                    |       |
| 3   | `subty`              | varchar(4)   | NO   | `'0001'::character varying`          |       |
| 4   | `endda`              | date         | NO   | `'9999-12-31'::date`                 |       |
| 5   | `begda`              | date         | NO   | —                                    |       |
| 6   | `quali`              | varchar(8)   | NO   | —                                    |       |
| 7   | `proficiency`        | varchar(2)   | YES  | —                                    |       |
| 8   | `target_proficiency` | varchar(2)   | YES  | —                                    |       |
| 9   | `years_experience`   | numeric(4,1) | YES  | —                                    |       |
| 10  | `verified_date`      | date         | YES  | —                                    |       |
| 11  | `verified_by`        | varchar(8)   | YES  | —                                    |       |
| 12  | `esco_skill_uri`     | varchar(255) | YES  | —                                    |       |
| 13  | `created_at`         | timestamp    | YES  | `now()`                              |       |

#### Indexes

- `idx_pa0024_esco` [INDEX] · (`esco_skill_uri`)
- `idx_pa0024_pernr` [INDEX] · (`pernr`)
- `idx_pa0024_quali` [INDEX] · (`quali`)

---

### `pa0025`

- **Tenant scoped**: no
- **Row estimate**: 264
- **Domains**: DGOV
- **Prisma model**: `pa0025`

#### Columns

| #   | Column                | Type        | Null | Default                              | Notes |
| --- | --------------------- | ----------- | ---- | ------------------------------------ | ----- |
| 1   | `id`                  | int4(32)    | NO   | `nextval('pa0025_id_seq'::regclass)` | PK    |
| 2   | `pernr`               | varchar(8)  | NO   | —                                    |       |
| 3   | `subty`               | varchar(4)  | NO   | —                                    |       |
| 4   | `endda`               | date        | NO   | `'9999-12-31'::date`                 |       |
| 5   | `begda`               | date        | NO   | —                                    |       |
| 6   | `appraisal_id`        | varchar(20) | YES  | —                                    |       |
| 7   | `bession`             | varchar(2)  | YES  | —                                    |       |
| 8   | `potential_rating`    | varchar(2)  | YES  | —                                    |       |
| 9   | `reviewer_pernr`      | varchar(8)  | YES  | —                                    |       |
| 10  | `appraisal_date`      | date        | YES  | —                                    |       |
| 11  | `review_period_start` | date        | YES  | —                                    |       |
| 12  | `review_period_end`   | date        | YES  | —                                    |       |
| 13  | `status`              | varchar(2)  | YES  | —                                    |       |
| 14  | `comments`            | text        | YES  | —                                    |       |
| 15  | `development_notes`   | text        | YES  | —                                    |       |
| 16  | `created_at`          | timestamp   | YES  | `now()`                              |       |

#### Primary Key

`(`id`)`

#### Indexes

- `idx_pa0025_pernr` [INDEX] · (`pernr`)
- `idx_pa0025_reviewer` [INDEX] · (`reviewer_pernr`)
- `pa0025_pernr_subty_endda_appraisal_id_key` [UNIQUE] · (`pernr`, `subty`, `endda`, `appraisal_id`)
- `pa0025_pkey` [PRIMARY] · (`id`)

---

### `pa0027`

> The underlying table does not contain a valid unique identifier and can therefore currently not be handled by Prisma Client.

- **Tenant scoped**: no
- **Row estimate**: 1142
- **Domains**: DGOV
- **Prisma model**: `pa0027`

#### Columns

| #   | Column       | Type         | Null | Default                              | Notes |
| --- | ------------ | ------------ | ---- | ------------------------------------ | ----- |
| 1   | `id`         | int4(32)     | NO   | `nextval('pa0027_id_seq'::regclass)` |       |
| 2   | `pernr`      | varchar(8)   | NO   | —                                    |       |
| 3   | `subty`      | varchar(4)   | YES  | `'0001'::character varying`          |       |
| 4   | `endda`      | date         | NO   | `'9999-12-31'::date`                 |       |
| 5   | `begda`      | date         | NO   | —                                    |       |
| 6   | `seqnr`      | int4(32)     | YES  | `1`                                  |       |
| 7   | `kostl`      | varchar(10)  | NO   | —                                    |       |
| 8   | `pession`    | numeric(5,2) | NO   | —                                    |       |
| 9   | `bukrs`      | varchar(4)   | YES  | —                                    |       |
| 10  | `gsber`      | varchar(4)   | YES  | —                                    |       |
| 11  | `created_at` | timestamp    | YES  | `CURRENT_TIMESTAMP`                  |       |
| 12  | `updated_at` | timestamp    | YES  | `CURRENT_TIMESTAMP`                  |       |

#### Indexes

- `idx_pa0027_kostl` [INDEX] · (`kostl`)
- `idx_pa0027_pernr` [INDEX] · (`pernr`)

---

### `pa0032`

> The underlying table does not contain a valid unique identifier and can therefore currently not be handled by Prisma Client.

- **Tenant scoped**: no
- **Row estimate**: 1142
- **Domains**: DGOV
- **Prisma model**: `pa0032`

#### Columns

| #   | Column            | Type        | Null | Default                              | Notes |
| --- | ----------------- | ----------- | ---- | ------------------------------------ | ----- |
| 1   | `id`              | int4(32)    | NO   | `nextval('pa0032_id_seq'::regclass)` |       |
| 2   | `pernr`           | varchar(8)  | NO   | —                                    |       |
| 3   | `subty`           | varchar(4)  | YES  | `'0001'::character varying`          |       |
| 4   | `endda`           | date        | NO   | `'9999-12-31'::date`                 |       |
| 5   | `begda`           | date        | NO   | —                                    |       |
| 6   | `internal_field1` | varchar(40) | YES  | —                                    |       |
| 7   | `internal_field2` | varchar(40) | YES  | —                                    |       |
| 8   | `internal_field3` | varchar(40) | YES  | —                                    |       |
| 9   | `internal_field4` | varchar(40) | YES  | —                                    |       |
| 10  | `notes`           | text        | YES  | —                                    |       |
| 11  | `created_at`      | timestamp   | YES  | `CURRENT_TIMESTAMP`                  |       |

---

### `pa0041`

> The underlying table does not contain a valid unique identifier and can therefore currently not be handled by Prisma Client.

- **Tenant scoped**: no
- **Row estimate**: 1142
- **Domains**: DGOV
- **Prisma model**: `pa0041`

#### Columns

| #   | Column       | Type       | Null | Default                              | Notes |
| --- | ------------ | ---------- | ---- | ------------------------------------ | ----- |
| 1   | `id`         | int4(32)   | NO   | `nextval('pa0041_id_seq'::regclass)` |       |
| 2   | `pernr`      | varchar(8) | NO   | —                                    |       |
| 3   | `subty`      | varchar(4) | YES  | `'0001'::character varying`          |       |
| 4   | `endda`      | date       | NO   | `'9999-12-31'::date`                 |       |
| 5   | `begda`      | date       | NO   | —                                    |       |
| 6   | `dar01`      | date       | YES  | —                                    |       |
| 7   | `dar02`      | date       | YES  | —                                    |       |
| 8   | `dar03`      | date       | YES  | —                                    |       |
| 9   | `dar04`      | date       | YES  | —                                    |       |
| 10  | `dar05`      | date       | YES  | —                                    |       |
| 11  | `dar06`      | date       | YES  | —                                    |       |
| 12  | `created_at` | timestamp  | YES  | `CURRENT_TIMESTAMP`                  |       |

---

### `pa0105`

> The underlying table does not contain a valid unique identifier and can therefore currently not be handled by Prisma Client.

- **Tenant scoped**: no
- **Row estimate**: 2598
- **Domains**: DGOV
- **Prisma model**: `pa0105`

#### Columns

| #   | Column       | Type         | Null | Default                              | Notes |
| --- | ------------ | ------------ | ---- | ------------------------------------ | ----- |
| 1   | `id`         | int4(32)     | NO   | `nextval('pa0105_id_seq'::regclass)` |       |
| 2   | `pernr`      | varchar(8)   | NO   | —                                    |       |
| 3   | `subty`      | varchar(4)   | NO   | —                                    |       |
| 4   | `endda`      | date         | NO   | —                                    |       |
| 5   | `begda`      | date         | NO   | —                                    |       |
| 6   | `usrid`      | varchar(30)  | YES  | —                                    |       |
| 7   | `usrid_long` | varchar(241) | YES  | —                                    |       |
| 8   | `created_at` | timestamp    | YES  | `now()`                              |       |

#### Indexes

- `idx_pa0105_pernr` [INDEX] · (`pernr`)

---

### `pa0167`

> The underlying table does not contain a valid unique identifier and can therefore currently not be handled by Prisma Client.

- **Tenant scoped**: no
- **Row estimate**: 1142
- **Domains**: DGOV
- **Prisma model**: `pa0167`

#### Columns

| #   | Column             | Type          | Null | Default                              | Notes |
| --- | ------------------ | ------------- | ---- | ------------------------------------ | ----- |
| 1   | `id`               | int4(32)      | NO   | `nextval('pa0167_id_seq'::regclass)` |       |
| 2   | `pernr`            | varchar(8)    | NO   | —                                    |       |
| 3   | `subty`            | varchar(4)    | NO   | —                                    |       |
| 4   | `endda`            | date          | NO   | `'9999-12-31'::date`                 |       |
| 5   | `begda`            | date          | NO   | —                                    |       |
| 6   | `seqnr`            | int4(32)      | YES  | `1`                                  |       |
| 7   | `bession`          | varchar(4)    | NO   | —                                    |       |
| 8   | `bession_option`   | varchar(4)    | YES  | —                                    |       |
| 9   | `coverage_level`   | varchar(2)    | YES  | —                                    |       |
| 10  | `enrollment_date`  | date          | YES  | —                                    |       |
| 11  | `effective_date`   | date          | YES  | —                                    |       |
| 12  | `ee_contribution`  | numeric(13,2) | YES  | —                                    |       |
| 13  | `er_contribution`  | numeric(13,2) | YES  | —                                    |       |
| 14  | `total_premium`    | numeric(13,2) | YES  | —                                    |       |
| 15  | `currency`         | varchar(5)    | YES  | `'USD'::character varying`           |       |
| 16  | `dependents_count` | int4(32)      | YES  | `0`                                  |       |
| 17  | `created_at`       | timestamp     | YES  | `CURRENT_TIMESTAMP`                  |       |
| 18  | `updated_at`       | timestamp     | YES  | `CURRENT_TIMESTAMP`                  |       |

#### Indexes

- `idx_pa0167_bession` [INDEX] · (`bession`)
- `idx_pa0167_pernr` [INDEX] · (`pernr`)

---

### `pa0168`

> The underlying table does not contain a valid unique identifier and can therefore currently not be handled by Prisma Client.

- **Tenant scoped**: no
- **Row estimate**: 1142
- **Domains**: DGOV
- **Prisma model**: `pa0168`

#### Columns

| #   | Column              | Type          | Null | Default                              | Notes |
| --- | ------------------- | ------------- | ---- | ------------------------------------ | ----- |
| 1   | `id`                | int4(32)      | NO   | `nextval('pa0168_id_seq'::regclass)` |       |
| 2   | `pernr`             | varchar(8)    | NO   | —                                    |       |
| 3   | `subty`             | varchar(4)    | NO   | —                                    |       |
| 4   | `endda`             | date          | NO   | `'9999-12-31'::date`                 |       |
| 5   | `begda`             | date          | NO   | —                                    |       |
| 6   | `bession`           | varchar(4)    | NO   | —                                    |       |
| 7   | `coverage_amount`   | numeric(13,2) | YES  | —                                    |       |
| 8   | `coverage_multiple` | numeric(3,1)  | YES  | —                                    |       |
| 9   | `ee_contribution`   | numeric(13,2) | YES  | —                                    |       |
| 10  | `er_contribution`   | numeric(13,2) | YES  | —                                    |       |
| 11  | `currency`          | varchar(5)    | YES  | `'USD'::character varying`           |       |
| 12  | `beneficiary_type`  | varchar(4)    | YES  | —                                    |       |
| 13  | `beneficiary_name`  | varchar(80)   | YES  | —                                    |       |
| 14  | `beneficiary_pct`   | numeric(5,2)  | YES  | `100.00`                             |       |
| 15  | `created_at`        | timestamp     | YES  | `CURRENT_TIMESTAMP`                  |       |
| 16  | `updated_at`        | timestamp     | YES  | `CURRENT_TIMESTAMP`                  |       |

#### Indexes

- `idx_pa0168_bession` [INDEX] · (`bession`)
- `idx_pa0168_pernr` [INDEX] · (`pernr`)

---

### `pa0169`

> The underlying table does not contain a valid unique identifier and can therefore currently not be handled by Prisma Client.

- **Tenant scoped**: no
- **Row estimate**: 1142
- **Domains**: DGOV
- **Prisma model**: `pa0169`

#### Columns

| #   | Column                | Type          | Null | Default                              | Notes |
| --- | --------------------- | ------------- | ---- | ------------------------------------ | ----- |
| 1   | `id`                  | int4(32)      | NO   | `nextval('pa0169_id_seq'::regclass)` |       |
| 2   | `pernr`               | varchar(8)    | NO   | —                                    |       |
| 3   | `subty`               | varchar(4)    | NO   | —                                    |       |
| 4   | `endda`               | date          | NO   | `'9999-12-31'::date`                 |       |
| 5   | `begda`               | date          | NO   | —                                    |       |
| 6   | `bession`             | varchar(4)    | NO   | —                                    |       |
| 7   | `ee_contribution_pct` | numeric(5,2)  | YES  | —                                    |       |
| 8   | `ee_contribution_amt` | numeric(13,2) | YES  | —                                    |       |
| 9   | `er_match_pct`        | numeric(5,2)  | YES  | —                                    |       |
| 10  | `er_match_cap`        | numeric(5,2)  | YES  | —                                    |       |
| 11  | `investment_option`   | varchar(4)    | YES  | —                                    |       |
| 12  | `vesting_pct`         | numeric(5,2)  | YES  | —                                    |       |
| 13  | `vesting_date`        | date          | YES  | —                                    |       |
| 14  | `current_balance`     | numeric(15,2) | YES  | —                                    |       |
| 15  | `created_at`          | timestamp     | YES  | `CURRENT_TIMESTAMP`                  |       |
| 16  | `updated_at`          | timestamp     | YES  | `CURRENT_TIMESTAMP`                  |       |

#### Indexes

- `idx_pa0169_bession` [INDEX] · (`bession`)
- `idx_pa0169_pernr` [INDEX] · (`pernr`)

---

### `pa0170`

> The underlying table does not contain a valid unique identifier and can therefore currently not be handled by Prisma Client.

- **Tenant scoped**: no
- **Row estimate**: 1142
- **Domains**: DGOV
- **Prisma model**: `pa0170`

#### Columns

| #   | Column              | Type          | Null | Default                              | Notes |
| --- | ------------------- | ------------- | ---- | ------------------------------------ | ----- |
| 1   | `id`                | int4(32)      | NO   | `nextval('pa0170_id_seq'::regclass)` |       |
| 2   | `pernr`             | varchar(8)    | NO   | —                                    |       |
| 3   | `subty`             | varchar(4)    | NO   | —                                    |       |
| 4   | `endda`             | date          | NO   | `'9999-12-31'::date`                 |       |
| 5   | `begda`             | date          | NO   | —                                    |       |
| 6   | `bession`           | varchar(4)    | NO   | —                                    |       |
| 7   | `annual_election`   | numeric(13,2) | YES  | —                                    |       |
| 8   | `er_contribution`   | numeric(13,2) | YES  | —                                    |       |
| 9   | `ytd_contributions` | numeric(13,2) | YES  | —                                    |       |
| 10  | `ytd_disbursements` | numeric(13,2) | YES  | —                                    |       |
| 11  | `current_balance`   | numeric(13,2) | YES  | —                                    |       |
| 12  | `rollover_balance`  | numeric(13,2) | YES  | —                                    |       |
| 13  | `plan_year`         | int4(32)      | YES  | —                                    |       |
| 14  | `grace_period_end`  | date          | YES  | —                                    |       |
| 15  | `created_at`        | timestamp     | YES  | `CURRENT_TIMESTAMP`                  |       |
| 16  | `updated_at`        | timestamp     | YES  | `CURRENT_TIMESTAMP`                  |       |

#### Indexes

- `idx_pa0170_bession` [INDEX] · (`bession`)
- `idx_pa0170_pernr` [INDEX] · (`pernr`)

---

### `pa0171`

> The underlying table does not contain a valid unique identifier and can therefore currently not be handled by Prisma Client.

- **Tenant scoped**: no
- **Row estimate**: 1142
- **Domains**: DGOV
- **Prisma model**: `pa0171`

#### Columns

| #   | Column              | Type          | Null | Default                              | Notes |
| --- | ------------------- | ------------- | ---- | ------------------------------------ | ----- |
| 1   | `id`                | int4(32)      | NO   | `nextval('pa0171_id_seq'::regclass)` |       |
| 2   | `pernr`             | varchar(8)    | NO   | —                                    |       |
| 3   | `subty`             | varchar(4)    | NO   | —                                    |       |
| 4   | `endda`             | date          | NO   | `'9999-12-31'::date`                 |       |
| 5   | `begda`             | date          | NO   | —                                    |       |
| 6   | `bession`           | varchar(4)    | NO   | —                                    |       |
| 7   | `bession_text`      | varchar(80)   | YES  | —                                    |       |
| 8   | `annual_allowance`  | numeric(13,2) | YES  | —                                    |       |
| 9   | `ytd_used`          | numeric(13,2) | YES  | —                                    |       |
| 10  | `remaining`         | numeric(13,2) | YES  | —                                    |       |
| 11  | `enrollment_status` | varchar(2)    | YES  | `'01'::character varying`            |       |
| 12  | `eligible_date`     | date          | YES  | —                                    |       |
| 13  | `created_at`        | timestamp     | YES  | `CURRENT_TIMESTAMP`                  |       |
| 14  | `updated_at`        | timestamp     | YES  | `CURRENT_TIMESTAMP`                  |       |

#### Indexes

- `idx_pa0171_bession` [INDEX] · (`bession`)
- `idx_pa0171_pernr` [INDEX] · (`pernr`)

---

### `pa0185`

> The underlying table does not contain a valid unique identifier and can therefore currently not be handled by Prisma Client.

- **Tenant scoped**: no
- **Row estimate**: 2268
- **Domains**: DGOV
- **Prisma model**: `pa0185`

#### Columns

| #   | Column        | Type        | Null | Default                              | Notes |
| --- | ------------- | ----------- | ---- | ------------------------------------ | ----- |
| 1   | `id`          | int4(32)    | NO   | `nextval('pa0185_id_seq'::regclass)` |       |
| 2   | `pernr`       | varchar(8)  | NO   | —                                    |       |
| 3   | `subty`       | varchar(4)  | NO   | —                                    |       |
| 4   | `endda`       | date        | NO   | `'9999-12-31'::date`                 |       |
| 5   | `begda`       | date        | NO   | —                                    |       |
| 6   | `ictyp`       | varchar(2)  | YES  | —                                    |       |
| 7   | `icnum`       | varchar(40) | YES  | —                                    |       |
| 8   | `icnam`       | varchar(80) | YES  | —                                    |       |
| 9   | `fpession`    | varchar(3)  | YES  | —                                    |       |
| 10  | `issue_date`  | date        | YES  | —                                    |       |
| 11  | `expiry_date` | date        | YES  | —                                    |       |
| 12  | `created_at`  | timestamp   | YES  | `now()`                              |       |

#### Indexes

- `idx_pa0185_pernr` [INDEX] · (`pernr`)
- `pa0185_pernr_subty_endda_ictyp_key` [UNIQUE] · (`pernr`, `subty`, `endda`, `ictyp`)

---

### `pa2000`

> The underlying table does not contain a valid unique identifier and can therefore currently not be handled by Prisma Client.

- **Tenant scoped**: no
- **Row estimate**: 1142
- **Domains**: DGOV
- **Prisma model**: `pa2000`

#### Columns

| #   | Column       | Type         | Null | Default                              | Notes |
| --- | ------------ | ------------ | ---- | ------------------------------------ | ----- |
| 1   | `id`         | int4(32)     | NO   | `nextval('pa2000_id_seq'::regclass)` |       |
| 2   | `pernr`      | varchar(8)   | NO   | —                                    |       |
| 3   | `subty`      | varchar(4)   | YES  | `'0001'::character varying`          |       |
| 4   | `objps`      | varchar(2)   | YES  | `'01'::character varying`            |       |
| 5   | `sprps`      | bool         | YES  | `false`                              |       |
| 6   | `endda`      | date         | NO   | `'9999-12-31'::date`                 |       |
| 7   | `begda`      | date         | NO   | —                                    |       |
| 8   | `seqnr`      | int4(32)     | YES  | `1`                                  |       |
| 9   | `mession`    | varchar(2)   | YES  | —                                    |       |
| 10  | `zession`    | varchar(2)   | YES  | —                                    |       |
| 11  | `schkz`      | varchar(8)   | YES  | —                                    |       |
| 12  | `zterf`      | varchar(4)   | YES  | —                                    |       |
| 13  | `empct`      | numeric(5,2) | YES  | `100.00`                             |       |
| 14  | `mostd`      | numeric(5,2) | YES  | —                                    |       |
| 15  | `wostd`      | numeric(5,2) | YES  | —                                    |       |
| 16  | `arbst`      | numeric(5,2) | YES  | —                                    |       |
| 17  | `wkmod`      | varchar(4)   | YES  | —                                    |       |
| 18  | `aession`    | varchar(12)  | YES  | —                                    |       |
| 19  | `uession`    | timestamp    | YES  | `CURRENT_TIMESTAMP`                  |       |
| 20  | `created_at` | timestamp    | YES  | `CURRENT_TIMESTAMP`                  |       |
| 21  | `updated_at` | timestamp    | YES  | `CURRENT_TIMESTAMP`                  |       |

#### Indexes

- `idx_pa2000_dates` [INDEX] · (`begda`, `endda`)
- `idx_pa2000_pernr` [INDEX] · (`pernr`)
- `idx_pa2000_schkz` [INDEX] · (`schkz`)

---

### `pa2001`

> The underlying table does not contain a valid unique identifier and can therefore currently not be handled by Prisma Client.

- **Tenant scoped**: no
- **Row estimate**: 1444
- **Domains**: DGOV
- **Prisma model**: `pa2001`

#### Columns

| #   | Column       | Type         | Null | Default                              | Notes |
| --- | ------------ | ------------ | ---- | ------------------------------------ | ----- |
| 1   | `id`         | int4(32)     | NO   | `nextval('pa2001_id_seq'::regclass)` |       |
| 2   | `pernr`      | varchar(8)   | NO   | —                                    |       |
| 3   | `subty`      | varchar(4)   | NO   | —                                    |       |
| 4   | `endda`      | date         | NO   | —                                    |       |
| 5   | `begda`      | date         | NO   | —                                    |       |
| 6   | `abwtg`      | numeric(9,2) | YES  | —                                    |       |
| 7   | `stdaz`      | numeric(9,2) | YES  | —                                    |       |
| 8   | `awart`      | varchar(30)  | YES  | —                                    |       |
| 9   | `created_at` | timestamp    | YES  | `now()`                              |       |

#### Indexes

- `idx_pa2001_dates` [INDEX] · (`begda`, `endda`)
- `idx_pa2001_pernr` [INDEX] · (`pernr`)
- `idx_pa2001_subty` [INDEX] · (`subty`)

---

### `pa2002`

- **Tenant scoped**: no
- **Row estimate**: 6072
- **Domains**: DGOV
- **Prisma model**: `pa2002`

#### Columns

| #   | Column       | Type         | Null | Default                              | Notes |
| --- | ------------ | ------------ | ---- | ------------------------------------ | ----- |
| 1   | `id`         | int4(32)     | NO   | `nextval('pa2002_id_seq'::regclass)` | PK    |
| 2   | `pernr`      | varchar(8)   | NO   | —                                    |       |
| 3   | `subty`      | varchar(4)   | NO   | —                                    |       |
| 4   | `ldate`      | date         | NO   | —                                    |       |
| 5   | `beguz`      | time         | YES  | —                                    |       |
| 6   | `enduz`      | time         | YES  | —                                    |       |
| 7   | `anzhl`      | numeric(5,2) | YES  | —                                    |       |
| 8   | `awart`      | varchar(4)   | YES  | —                                    |       |
| 9   | `created_at` | timestamp    | YES  | `now()`                              |       |

#### Primary Key

`(`id`)`

#### Indexes

- `idx_pa2002_pernr` [INDEX] · (`pernr`)
- `pa2002_pkey` [PRIMARY] · (`id`)

---

### `pa2003`

- **Tenant scoped**: no
- **Row estimate**: 0
- **Domains**: DGOV
- **Prisma model**: `pa2003`

#### Columns

| #   | Column                | Type       | Null | Default                              | Notes |
| --- | --------------------- | ---------- | ---- | ------------------------------------ | ----- |
| 1   | `id`                  | int4(32)   | NO   | `nextval('pa2003_id_seq'::regclass)` | PK    |
| 2   | `pernr`               | varchar(8) | NO   | —                                    |       |
| 3   | `subty`               | varchar(4) | YES  | `'0001'::character varying`          |       |
| 4   | `endda`               | date       | NO   | —                                    |       |
| 5   | `begda`               | date       | NO   | —                                    |       |
| 6   | `substitute_pernr`    | varchar(8) | YES  | —                                    |       |
| 7   | `substitute_position` | varchar(8) | YES  | —                                    |       |
| 8   | `reason`              | varchar(4) | YES  | —                                    |       |
| 9   | `created_at`          | timestamp  | YES  | `CURRENT_TIMESTAMP`                  |       |

#### Primary Key

`(`id`)`

#### Indexes

- `pa2003_pkey` [PRIMARY] · (`id`)
- `pa2003_unique` [UNIQUE] · (`pernr`, `subty`, `begda`)

---

### `pa2004`

- **Tenant scoped**: no
- **Row estimate**: 0
- **Domains**: DGOV
- **Prisma model**: `pa2004`

#### Columns

| #   | Column              | Type       | Null | Default                              | Notes |
| --- | ------------------- | ---------- | ---- | ------------------------------------ | ----- |
| 1   | `id`                | int4(32)   | NO   | `nextval('pa2004_id_seq'::regclass)` | PK    |
| 2   | `pernr`             | varchar(8) | NO   | —                                    |       |
| 3   | `subty`             | varchar(4) | YES  | `'0001'::character varying`          |       |
| 4   | `endda`             | date       | NO   | —                                    |       |
| 5   | `begda`             | date       | NO   | —                                    |       |
| 6   | `oncall_type`       | varchar(4) | YES  | —                                    |       |
| 7   | `start_time`        | time       | YES  | —                                    |       |
| 8   | `end_time`          | time       | YES  | —                                    |       |
| 9   | `compensation_type` | varchar(4) | YES  | —                                    |       |
| 10  | `created_at`        | timestamp  | YES  | `CURRENT_TIMESTAMP`                  |       |

#### Primary Key

`(`id`)`

#### Indexes

- `pa2004_pkey` [PRIMARY] · (`id`)
- `pa2004_unique` [UNIQUE] · (`pernr`, `subty`, `begda`)

---

### `pa2005`

> The underlying table does not contain a valid unique identifier and can therefore currently not be handled by Prisma Client.

- **Tenant scoped**: no
- **Row estimate**: 5358
- **Domains**: DGOV
- **Prisma model**: `pa2005`

#### Columns

| #   | Column         | Type         | Null | Default                              | Notes |
| --- | -------------- | ------------ | ---- | ------------------------------------ | ----- |
| 1   | `id`           | int4(32)     | NO   | `nextval('pa2005_id_seq'::regclass)` |       |
| 2   | `pernr`        | varchar(8)   | NO   | —                                    |       |
| 3   | `subty`        | varchar(4)   | YES  | `'0001'::character varying`          |       |
| 4   | `objps`        | varchar(2)   | YES  | `'01'::character varying`            |       |
| 5   | `sprps`        | bool         | YES  | `false`                              |       |
| 6   | `endda`        | date         | NO   | —                                    |       |
| 7   | `begda`        | date         | NO   | —                                    |       |
| 8   | `seqnr`        | int4(32)     | YES  | `1`                                  |       |
| 9   | `uession_type` | varchar(4)   | YES  | —                                    |       |
| 10  | `stdaz`        | numeric(7,2) | YES  | —                                    |       |
| 11  | `beguz`        | time         | YES  | —                                    |       |
| 12  | `enduz`        | time         | YES  | —                                    |       |
| 13  | `zession_type` | varchar(2)   | YES  | —                                    |       |
| 14  | `multi`        | numeric(3,2) | YES  | `1.50`                               |       |
| 15  | `kostl`        | varchar(10)  | YES  | —                                    |       |
| 16  | `approved`     | bool         | YES  | `false`                              |       |
| 17  | `approved_by`  | varchar(12)  | YES  | —                                    |       |
| 18  | `approved_at`  | timestamp    | YES  | —                                    |       |
| 19  | `aession`      | varchar(12)  | YES  | —                                    |       |
| 20  | `uession`      | timestamp    | YES  | `CURRENT_TIMESTAMP`                  |       |
| 21  | `created_at`   | timestamp    | YES  | `CURRENT_TIMESTAMP`                  |       |
| 22  | `updated_at`   | timestamp    | YES  | `CURRENT_TIMESTAMP`                  |       |

#### Indexes

- `idx_pa2005_dates` [INDEX] · (`begda`, `endda`)
- `idx_pa2005_pernr` [INDEX] · (`pernr`)

---

### `pa2006`

> The underlying table does not contain a valid unique identifier and can therefore currently not be handled by Prisma Client.

- **Tenant scoped**: no
- **Row estimate**: 3426
- **Domains**: DGOV
- **Prisma model**: `pa2006`

#### Columns

| #   | Column         | Type         | Null | Default                              | Notes |
| --- | -------------- | ------------ | ---- | ------------------------------------ | ----- |
| 1   | `id`           | int4(32)     | NO   | `nextval('pa2006_id_seq'::regclass)` |       |
| 2   | `pernr`        | varchar(8)   | NO   | —                                    |       |
| 3   | `subty`        | varchar(4)   | NO   | —                                    |       |
| 4   | `objps`        | varchar(2)   | YES  | `'01'::character varying`            |       |
| 5   | `sprps`        | bool         | YES  | `false`                              |       |
| 6   | `endda`        | date         | NO   | `'9999-12-31'::date`                 |       |
| 7   | `begda`        | date         | NO   | —                                    |       |
| 8   | `seqnr`        | int4(32)     | YES  | `1`                                  |       |
| 9   | `ktart`        | varchar(4)   | YES  | —                                    |       |
| 10  | `kession_text` | varchar(40)  | YES  | —                                    |       |
| 11  | `anzhl`        | numeric(7,2) | YES  | —                                    |       |
| 12  | `kession`      | numeric(7,2) | YES  | —                                    |       |
| 13  | `remainder`    | numeric(7,2) | YES  | —                                    |       |
| 14  | `unit`         | varchar(3)   | YES  | `'DAY'::character varying`           |       |
| 15  | `desta`        | date         | YES  | —                                    |       |
| 16  | `deession`     | date         | YES  | —                                    |       |
| 17  | `quession`     | date         | YES  | —                                    |       |
| 18  | `aession`      | varchar(12)  | YES  | —                                    |       |
| 19  | `uession`      | timestamp    | YES  | `CURRENT_TIMESTAMP`                  |       |
| 20  | `created_at`   | timestamp    | YES  | `CURRENT_TIMESTAMP`                  |       |
| 21  | `updated_at`   | timestamp    | YES  | `CURRENT_TIMESTAMP`                  |       |

#### Indexes

- `idx_pa2006_dates` [INDEX] · (`begda`, `endda`)
- `idx_pa2006_ktart` [INDEX] · (`ktart`)
- `idx_pa2006_pernr` [INDEX] · (`pernr`)

---

### `pa2007`

> The underlying table does not contain a valid unique identifier and can therefore currently not be handled by Prisma Client.

- **Tenant scoped**: no
- **Row estimate**: 1142
- **Domains**: DGOV
- **Prisma model**: `pa2007`

#### Columns

| #   | Column            | Type         | Null | Default                              | Notes |
| --- | ----------------- | ------------ | ---- | ------------------------------------ | ----- |
| 1   | `id`              | int4(32)     | NO   | `nextval('pa2007_id_seq'::regclass)` |       |
| 2   | `pernr`           | varchar(8)   | NO   | —                                    |       |
| 3   | `subty`           | varchar(4)   | NO   | —                                    |       |
| 4   | `objps`           | varchar(2)   | YES  | `'01'::character varying`            |       |
| 5   | `sprps`           | bool         | YES  | `false`                              |       |
| 6   | `endda`           | date         | NO   | `'9999-12-31'::date`                 |       |
| 7   | `begda`           | date         | NO   | —                                    |       |
| 8   | `seqnr`           | int4(32)     | YES  | `1`                                  |       |
| 9   | `ktart`           | varchar(4)   | YES  | —                                    |       |
| 10  | `anzhl`           | numeric(7,2) | YES  | —                                    |       |
| 11  | `kession`         | numeric(7,2) | YES  | —                                    |       |
| 12  | `remainder`       | numeric(7,2) | YES  | —                                    |       |
| 13  | `unit`            | varchar(3)   | YES  | `'HRS'::character varying`           |       |
| 14  | `quession_source` | varchar(4)   | YES  | —                                    |       |
| 15  | `quession_rule`   | varchar(8)   | YES  | —                                    |       |
| 16  | `aession`         | varchar(12)  | YES  | —                                    |       |
| 17  | `uession`         | timestamp    | YES  | `CURRENT_TIMESTAMP`                  |       |
| 18  | `created_at`      | timestamp    | YES  | `CURRENT_TIMESTAMP`                  |       |
| 19  | `updated_at`      | timestamp    | YES  | `CURRENT_TIMESTAMP`                  |       |

#### Indexes

- `idx_pa2007_ktart` [INDEX] · (`ktart`)
- `idx_pa2007_pernr` [INDEX] · (`pernr`)

---

### `pa2010`

- **Tenant scoped**: no
- **Row estimate**: 0
- **Domains**: DGOV
- **Prisma model**: `pa2010`

#### Columns

| #   | Column           | Type          | Null | Default                              | Notes |
| --- | ---------------- | ------------- | ---- | ------------------------------------ | ----- |
| 1   | `id`             | int4(32)      | NO   | `nextval('pa2010_id_seq'::regclass)` | PK    |
| 2   | `pernr`          | varchar(8)    | NO   | —                                    |       |
| 3   | `subty`          | varchar(4)    | YES  | `'0001'::character varying`          |       |
| 4   | `objps`          | varchar(2)    | YES  | `'01'::character varying`            |       |
| 5   | `sprps`          | bool          | YES  | `false`                              |       |
| 6   | `endda`          | date          | NO   | —                                    |       |
| 7   | `begda`          | date          | NO   | —                                    |       |
| 8   | `seqnr`          | int4(32)      | YES  | `1`                                  |       |
| 9   | `lgart`          | varchar(4)    | NO   | —                                    |       |
| 10  | `beession`       | numeric(13,2) | YES  | —                                    |       |
| 11  | `anzhl`          | numeric(7,3)  | YES  | —                                    |       |
| 12  | `eession`        | varchar(3)    | YES  | —                                    |       |
| 13  | `waession`       | varchar(5)    | YES  | `'USD'::character varying`           |       |
| 14  | `zession_period` | varchar(2)    | YES  | —                                    |       |
| 15  | `kostl`          | varchar(10)   | YES  | —                                    |       |
| 16  | `aession`        | varchar(12)   | YES  | —                                    |       |
| 17  | `uession`        | timestamp     | YES  | `CURRENT_TIMESTAMP`                  |       |
| 18  | `created_at`     | timestamp     | YES  | `CURRENT_TIMESTAMP`                  |       |
| 19  | `updated_at`     | timestamp     | YES  | `CURRENT_TIMESTAMP`                  |       |

#### Primary Key

`(`id`)`

#### Indexes

- `idx_pa2010_dates` [INDEX] · (`begda`, `endda`)
- `idx_pa2010_lgart` [INDEX] · (`lgart`)
- `idx_pa2010_pernr` [INDEX] · (`pernr`)
- `pa2010_pkey` [PRIMARY] · (`id`)
- `pa2010_unique` [UNIQUE] · (`pernr`, `lgart`, `begda`, `seqnr`)

---

### `pa2011`

- **Tenant scoped**: no
- **Row estimate**: 0
- **Domains**: DGOV
- **Prisma model**: `pa2011`

#### Columns

| #   | Column       | Type        | Null | Default                              | Notes |
| --- | ------------ | ----------- | ---- | ------------------------------------ | ----- |
| 1   | `id`         | int4(32)    | NO   | `nextval('pa2011_id_seq'::regclass)` | PK    |
| 2   | `pernr`      | varchar(8)  | NO   | —                                    |       |
| 3   | `subty`      | varchar(4)  | YES  | `'0001'::character varying`          |       |
| 4   | `ldate`      | date        | NO   | —                                    |       |
| 5   | `ltime`      | time        | NO   | —                                    |       |
| 6   | `seession`   | int4(32)    | YES  | `1`                                  |       |
| 7   | `satession`  | varchar(2)  | NO   | —                                    |       |
| 8   | `terminal`   | varchar(8)  | YES  | —                                    |       |
| 9   | `origession` | varchar(2)  | YES  | `'M'::character varying`             |       |
| 10  | `status`     | varchar(2)  | YES  | `'0'::character varying`             |       |
| 11  | `processed`  | bool        | YES  | `false`                              |       |
| 12  | `aession`    | varchar(12) | YES  | —                                    |       |
| 13  | `uession`    | timestamp   | YES  | `CURRENT_TIMESTAMP`                  |       |
| 14  | `created_at` | timestamp   | YES  | `CURRENT_TIMESTAMP`                  |       |

#### Primary Key

`(`id`)`

#### Indexes

- `idx_pa2011_date` [INDEX] · (`ldate`)
- `idx_pa2011_event` [INDEX] · (`satession`)
- `idx_pa2011_pernr` [INDEX] · (`pernr`)
- `pa2011_pkey` [PRIMARY] · (`id`)
- `pa2011_unique` [UNIQUE] · (`pernr`, `ldate`, `ltime`, `satession`)

---

### `pa2012`

- **Tenant scoped**: no
- **Row estimate**: 0
- **Domains**: DGOV
- **Prisma model**: `pa2012`

#### Columns

| #   | Column          | Type         | Null | Default                              | Notes |
| --- | --------------- | ------------ | ---- | ------------------------------------ | ----- |
| 1   | `id`            | int4(32)     | NO   | `nextval('pa2012_id_seq'::regclass)` | PK    |
| 2   | `pernr`         | varchar(8)   | NO   | —                                    |       |
| 3   | `subty`         | varchar(4)   | YES  | `'0001'::character varying`          |       |
| 4   | `endda`         | date         | NO   | `'9999-12-31'::date`                 |       |
| 5   | `begda`         | date         | NO   | —                                    |       |
| 6   | `transfer_type` | varchar(4)   | YES  | —                                    |       |
| 7   | `source_quota`  | varchar(4)   | YES  | —                                    |       |
| 8   | `target_quota`  | varchar(4)   | YES  | —                                    |       |
| 9   | `amount`        | numeric(7,2) | YES  | —                                    |       |
| 10  | `created_at`    | timestamp    | YES  | `CURRENT_TIMESTAMP`                  |       |

#### Primary Key

`(`id`)`

#### Indexes

- `pa2012_pkey` [PRIMARY] · (`id`)
- `pa2012_unique` [UNIQUE] · (`pernr`, `subty`, `begda`)

---

### `pa2013`

- **Tenant scoped**: no
- **Row estimate**: 0
- **Domains**: DGOV
- **Prisma model**: `pa2013`

#### Columns

| #   | Column              | Type         | Null | Default                              | Notes |
| --- | ------------------- | ------------ | ---- | ------------------------------------ | ----- |
| 1   | `id`                | int4(32)     | NO   | `nextval('pa2013_id_seq'::regclass)` | PK    |
| 2   | `pernr`             | varchar(8)   | NO   | —                                    |       |
| 3   | `subty`             | varchar(4)   | NO   | —                                    |       |
| 4   | `endda`             | date         | NO   | —                                    |       |
| 5   | `begda`             | date         | NO   | —                                    |       |
| 6   | `quota_type`        | varchar(4)   | YES  | —                                    |       |
| 7   | `correction_amount` | numeric(7,2) | YES  | —                                    |       |
| 8   | `correction_reason` | varchar(4)   | YES  | —                                    |       |
| 9   | `approved_by`       | varchar(8)   | YES  | —                                    |       |
| 10  | `created_at`        | timestamp    | YES  | `CURRENT_TIMESTAMP`                  |       |

#### Primary Key

`(`id`)`

#### Indexes

- `pa2013_pkey` [PRIMARY] · (`id`)
- `pa2013_unique` [UNIQUE] · (`pernr`, `subty`, `quota_type`, `begda`)

---

### `page_table_relations`

- **Tenant scoped**: no
- **Row estimate**: 300
- **Domains**: DGOV
- **Prisma model**: `page_table_relations`

#### Columns

| #   | Column          | Type         | Null | Default                        | Notes |
| --- | --------------- | ------------ | ---- | ------------------------------ | ----- |
| 1   | `id`            | uuid         | NO   | `gen_random_uuid()`            | PK    |
| 2   | `page_id`       | uuid         | NO   | —                              |       |
| 3   | `table_name`    | varchar(128) | NO   | —                              |       |
| 4   | `relation_type` | varchar(20)  | NO   | `'primary'::character varying` |       |
| 5   | `source`        | varchar(20)  | NO   | `'manual'::character varying`  |       |
| 6   | `confidence`    | int2(16)     | NO   | `100`                          |       |
| 7   | `created_at`    | timestamptz  | NO   | `now()`                        |       |
| 8   | `updated_at`    | timestamptz  | NO   | `now()`                        |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns   | References           | ON UPDATE | ON DELETE | Notes |
| --------- | -------------------- | --------- | --------- | ----- |
| `page_id` | `platform_pages(id)` | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_ptr_page` [INDEX] · (`page_id`)
- `idx_ptr_table` [INDEX] · (`table_name`)
- `idx_ptr_type` [INDEX] · (`relation_type`)
- `page_table_relations_page_id_table_name_relation_type_key` [UNIQUE] · (`page_id`, `table_name`, `relation_type`)
- `page_table_relations_pkey` [PRIMARY] · (`id`)

---

### `page_table_sync_log`

- **Tenant scoped**: no
- **Row estimate**: 45
- **Domains**: DGOV
- **Prisma model**: `page_table_sync_log`

#### Columns

| #   | Column              | Type        | Null | Default                                           | Notes |
| --- | ------------------- | ----------- | ---- | ------------------------------------------------- | ----- |
| 1   | `id`                | int8(64)    | NO   | `nextval('page_table_sync_log_id_seq'::regclass)` | PK    |
| 2   | `sync_type`         | varchar(30) | NO   | —                                                 |       |
| 3   | `tables_discovered` | int4(32)    | YES  | `0`                                               |       |
| 4   | `relations_created` | int4(32)    | YES  | `0`                                               |       |
| 5   | `relations_removed` | int4(32)    | YES  | `0`                                               |       |
| 6   | `orphans_found`     | int4(32)    | YES  | `0`                                               |       |
| 7   | `duration_ms`       | int4(32)    | YES  | —                                                 |       |
| 8   | `details`           | jsonb       | YES  | —                                                 |       |
| 9   | `created_at`        | timestamptz | NO   | `now()`                                           |       |

#### Primary Key

`(`id`)`

#### Indexes

- `page_table_sync_log_pkey` [PRIMARY] · (`id`)

---

### `pb0001`

> The underlying table does not contain a valid unique identifier and can therefore currently not be handled by Prisma Client.

- **Tenant scoped**: no
- **Row estimate**: 1000
- **Domains**: DGOV
- **Prisma model**: `pb0001`

#### Columns

| #   | Column        | Type       | Null | Default                              | Notes |
| --- | ------------- | ---------- | ---- | ------------------------------------ | ----- |
| 1   | `id`          | int4(32)   | NO   | `nextval('pb0001_id_seq'::regclass)` |       |
| 2   | `aplnr`       | varchar(8) | NO   | —                                    |       |
| 3   | `subty`       | varchar(4) | YES  | `'0001'::character varying`          |       |
| 4   | `endda`       | date       | NO   | `'9999-12-31'::date`                 |       |
| 5   | `begda`       | date       | NO   | —                                    |       |
| 6   | `seqnr`       | int4(32)   | YES  | `1`                                  |       |
| 7   | `massn`       | varchar(2) | NO   | —                                    |       |
| 8   | `massg`       | varchar(2) | YES  | —                                    |       |
| 9   | `stat2`       | varchar(2) | YES  | `'01'::character varying`            |       |
| 10  | `processor`   | varchar(8) | YES  | —                                    |       |
| 11  | `action_date` | date       | YES  | —                                    |       |
| 12  | `created_at`  | timestamp  | YES  | `CURRENT_TIMESTAMP`                  |       |
| 13  | `updated_at`  | timestamp  | YES  | `CURRENT_TIMESTAMP`                  |       |

#### Indexes

- `idx_pb0001_aplnr` [INDEX] · (`aplnr`)
- `idx_pb0001_massn` [INDEX] · (`massn`)
- `idx_pb0001_stat2` [INDEX] · (`stat2`)

---

### `pb0002`

> The underlying table does not contain a valid unique identifier and can therefore currently not be handled by Prisma Client.

- **Tenant scoped**: no
- **Row estimate**: 1010
- **Domains**: DGOV
- **Prisma model**: `pb0002`

#### Columns

| #   | Column           | Type         | Null | Default                              | Notes |
| --- | ---------------- | ------------ | ---- | ------------------------------------ | ----- |
| 1   | `id`             | int4(32)     | NO   | `nextval('pb0002_id_seq'::regclass)` |       |
| 2   | `aplnr`          | varchar(8)   | NO   | —                                    |       |
| 3   | `endda`          | date         | NO   | `'9999-12-31'::date`                 |       |
| 4   | `begda`          | date         | NO   | `'1900-01-01'::date`                 |       |
| 5   | `nachn`          | varchar(40)  | NO   | —                                    |       |
| 6   | `vorna`          | varchar(40)  | NO   | —                                    |       |
| 7   | `midnm`          | varchar(40)  | YES  | —                                    |       |
| 8   | `gbdat`          | date         | YES  | —                                    |       |
| 9   | `gbort`          | varchar(40)  | YES  | —                                    |       |
| 10  | `natio`          | varchar(3)   | YES  | —                                    |       |
| 11  | `gesch`          | varchar(1)   | YES  | —                                    |       |
| 12  | `famst`          | varchar(1)   | YES  | —                                    |       |
| 13  | `email`          | varchar(241) | YES  | —                                    |       |
| 14  | `phone`          | varchar(30)  | YES  | —                                    |       |
| 15  | `mobile`         | varchar(30)  | YES  | —                                    |       |
| 16  | `source_channel` | varchar(4)   | YES  | —                                    |       |
| 17  | `referral_pernr` | varchar(8)   | YES  | —                                    |       |
| 18  | `created_at`     | timestamp    | YES  | `CURRENT_TIMESTAMP`                  |       |
| 19  | `updated_at`     | timestamp    | YES  | `CURRENT_TIMESTAMP`                  |       |

#### Indexes

- `idx_pb0002_aplnr` [INDEX] · (`aplnr`)
- `idx_pb0002_email` [INDEX] · (`email`)
- `idx_pb0002_name` [INDEX] · (`nachn`, `vorna`)

---

### `pb0003`

- **Tenant scoped**: no
- **Row estimate**: 0
- **Domains**: DGOV
- **Prisma model**: `pb0003`

#### Columns

| #   | Column       | Type        | Null | Default                              | Notes |
| --- | ------------ | ----------- | ---- | ------------------------------------ | ----- |
| 1   | `id`         | int4(32)    | NO   | `nextval('pb0003_id_seq'::regclass)` | PK    |
| 2   | `aplnr`      | varchar(8)  | NO   | —                                    |       |
| 3   | `subty`      | varchar(4)  | YES  | `'1'::character varying`             |       |
| 4   | `endda`      | date        | NO   | `'9999-12-31'::date`                 |       |
| 5   | `begda`      | date        | NO   | `'1900-01-01'::date`                 |       |
| 6   | `stras`      | varchar(60) | YES  | —                                    |       |
| 7   | `ort01`      | varchar(40) | YES  | —                                    |       |
| 8   | `pstlz`      | varchar(10) | YES  | —                                    |       |
| 9   | `land1`      | varchar(3)  | YES  | —                                    |       |
| 10  | `regio`      | varchar(3)  | YES  | —                                    |       |
| 11  | `created_at` | timestamp   | YES  | `CURRENT_TIMESTAMP`                  |       |

#### Primary Key

`(`id`)`

#### Indexes

- `idx_pb0003_aplnr` [INDEX] · (`aplnr`)
- `pb0003_pkey` [PRIMARY] · (`id`)
- `pb0003_unique` [UNIQUE] · (`aplnr`, `subty`, `begda`)

---

### `pb0022`

> The underlying table does not contain a valid unique identifier and can therefore currently not be handled by Prisma Client.

- **Tenant scoped**: no
- **Row estimate**: 1600
- **Domains**: DGOV
- **Prisma model**: `pb0022`

#### Columns

| #   | Column                   | Type         | Null | Default                              | Notes |
| --- | ------------------------ | ------------ | ---- | ------------------------------------ | ----- |
| 1   | `id`                     | int4(32)     | NO   | `nextval('pb0022_id_seq'::regclass)` |       |
| 2   | `aplnr`                  | varchar(8)   | NO   | —                                    |       |
| 3   | `subty`                  | varchar(4)   | YES  | `'0001'::character varying`          |       |
| 4   | `endda`                  | date         | NO   | `'9999-12-31'::date`                 |       |
| 5   | `begda`                  | date         | NO   | `'1900-01-01'::date`                 |       |
| 6   | `seqnr`                  | int4(32)     | YES  | `1`                                  |       |
| 7   | `slart`                  | varchar(4)   | YES  | —                                    |       |
| 8   | `insti`                  | varchar(80)  | YES  | —                                    |       |
| 9   | `slabs`                  | varchar(80)  | YES  | —                                    |       |
| 10  | `anession`               | varchar(4)   | YES  | —                                    |       |
| 11  | `sltp1`                  | varchar(40)  | YES  | —                                    |       |
| 12  | `end_year`               | int4(32)     | YES  | —                                    |       |
| 13  | `grade`                  | varchar(10)  | YES  | —                                    |       |
| 14  | `esco_qualification_uri` | varchar(255) | YES  | —                                    |       |
| 15  | `created_at`             | timestamp    | YES  | `CURRENT_TIMESTAMP`                  |       |

#### Indexes

- `idx_pb0022_aplnr` [INDEX] · (`aplnr`)

---

### `pb0024`

> The underlying table does not contain a valid unique identifier and can therefore currently not be handled by Prisma Client.

- **Tenant scoped**: no
- **Row estimate**: 2400
- **Domains**: DGOV
- **Prisma model**: `pb0024`

#### Columns

| #   | Column             | Type         | Null | Default                              | Notes |
| --- | ------------------ | ------------ | ---- | ------------------------------------ | ----- |
| 1   | `id`               | int4(32)     | NO   | `nextval('pb0024_id_seq'::regclass)` |       |
| 2   | `aplnr`            | varchar(8)   | NO   | —                                    |       |
| 3   | `subty`            | varchar(4)   | YES  | `'0001'::character varying`          |       |
| 4   | `quali`            | varchar(8)   | NO   | —                                    |       |
| 5   | `endda`            | date         | NO   | `'9999-12-31'::date`                 |       |
| 6   | `begda`            | date         | NO   | `'1900-01-01'::date`                 |       |
| 7   | `proficiency`      | varchar(2)   | YES  | —                                    |       |
| 8   | `years_experience` | numeric(4,1) | YES  | —                                    |       |
| 9   | `verified`         | bool         | YES  | `false`                              |       |
| 10  | `self_assessed`    | bool         | YES  | `true`                               |       |
| 11  | `esco_skill_uri`   | varchar(255) | YES  | —                                    |       |
| 12  | `created_at`       | timestamp    | YES  | `CURRENT_TIMESTAMP`                  |       |

#### Indexes

- `idx_pb0024_aplnr` [INDEX] · (`aplnr`)
- `idx_pb0024_esco` [INDEX] · (`esco_skill_uri`)
- `idx_pb0024_quali` [INDEX] · (`quali`)

---

### `pb4000`

> The underlying table does not contain a valid unique identifier and can therefore currently not be handled by Prisma Client.

- **Tenant scoped**: no
- **Row estimate**: 2000
- **Domains**: DGOV
- **Prisma model**: `pb4000`

#### Columns

| #   | Column              | Type        | Null | Default                              | Notes |
| --- | ------------------- | ----------- | ---- | ------------------------------------ | ----- |
| 1   | `id`                | int4(32)    | NO   | `nextval('pb4000_id_seq'::regclass)` |       |
| 2   | `aplnr`             | varchar(8)  | NO   | —                                    |       |
| 3   | `activity_id`       | varchar(10) | NO   | —                                    |       |
| 4   | `activity_date`     | date        | NO   | —                                    |       |
| 5   | `activity_time`     | time        | YES  | —                                    |       |
| 6   | `activity_type`     | varchar(4)  | NO   | —                                    |       |
| 7   | `activity_status`   | varchar(2)  | YES  | `'01'::character varying`            |       |
| 8   | `activity_result`   | varchar(2)  | YES  | —                                    |       |
| 9   | `interviewer_pernr` | varchar(8)  | YES  | —                                    |       |
| 10  | `location`          | varchar(80) | YES  | —                                    |       |
| 11  | `notes`             | text        | YES  | —                                    |       |
| 12  | `rating`            | varchar(2)  | YES  | —                                    |       |
| 13  | `document_ref`      | varchar(50) | YES  | —                                    |       |
| 14  | `created_at`        | timestamp   | YES  | `CURRENT_TIMESTAMP`                  |       |
| 15  | `updated_at`        | timestamp   | YES  | `CURRENT_TIMESTAMP`                  |       |

#### Indexes

- `idx_pb4000_aplnr` [INDEX] · (`aplnr`)
- `idx_pb4000_date` [INDEX] · (`activity_date`)
- `idx_pb4000_type` [INDEX] · (`activity_type`)

---

### `pb4001`

> The underlying table does not contain a valid unique identifier and can therefore currently not be handled by Prisma Client.

- **Tenant scoped**: no
- **Row estimate**: 2000
- **Domains**: DGOV
- **Prisma model**: `pb4001`

#### Columns

| #   | Column              | Type        | Null | Default                              | Notes |
| --- | ------------------- | ----------- | ---- | ------------------------------------ | ----- |
| 1   | `id`                | int4(32)    | NO   | `nextval('pb4001_id_seq'::regclass)` |       |
| 2   | `aplnr`             | varchar(8)  | NO   | —                                    |       |
| 3   | `vacancy_id`        | varchar(10) | NO   | —                                    |       |
| 4   | `endda`             | date        | NO   | `'9999-12-31'::date`                 |       |
| 5   | `begda`             | date        | NO   | —                                    |       |
| 6   | `assignment_status` | varchar(2)  | YES  | `'01'::character varying`            |       |
| 7   | `assignment_date`   | date        | YES  | —                                    |       |
| 8   | `priority`          | int4(32)    | YES  | `0`                                  |       |
| 9   | `position_id`       | varchar(8)  | YES  | —                                    |       |
| 10  | `job_id`            | varchar(8)  | YES  | —                                    |       |
| 11  | `decision_date`     | date        | YES  | —                                    |       |
| 12  | `decision_by`       | varchar(8)  | YES  | —                                    |       |
| 13  | `rejection_reason`  | varchar(4)  | YES  | —                                    |       |
| 14  | `created_at`        | timestamp   | YES  | `CURRENT_TIMESTAMP`                  |       |
| 15  | `updated_at`        | timestamp   | YES  | `CURRENT_TIMESTAMP`                  |       |

#### Indexes

- `idx_pb4001_aplnr` [INDEX] · (`aplnr`)
- `idx_pb4001_position` [INDEX] · (`position_id`)
- `idx_pb4001_status` [INDEX] · (`assignment_status`)
- `idx_pb4001_vacancy` [INDEX] · (`vacancy_id`)

---

### `pb4005`

> The underlying table does not contain a valid unique identifier and can therefore currently not be handled by Prisma Client.

- **Tenant scoped**: no
- **Row estimate**: 2000
- **Domains**: DGOV
- **Prisma model**: `pb4005`

#### Columns

| #   | Column                | Type         | Null | Default                              | Notes |
| --- | --------------------- | ------------ | ---- | ------------------------------------ | ----- |
| 1   | `id`                  | int4(32)     | NO   | `nextval('pb4005_id_seq'::regclass)` |       |
| 2   | `aplnr`               | varchar(8)   | NO   | —                                    |       |
| 3   | `vacancy_id`          | varchar(10)  | YES  | —                                    |       |
| 4   | `evaluation_id`       | varchar(10)  | NO   | —                                    |       |
| 5   | `evaluation_date`     | date         | NO   | —                                    |       |
| 6   | `evaluator_pernr`     | varchar(8)   | NO   | —                                    |       |
| 7   | `evaluation_type`     | varchar(4)   | YES  | —                                    |       |
| 8   | `technical_score`     | numeric(3,1) | YES  | —                                    |       |
| 9   | `communication_score` | numeric(3,1) | YES  | —                                    |       |
| 10  | `cultural_fit_score`  | numeric(3,1) | YES  | —                                    |       |
| 11  | `experience_score`    | numeric(3,1) | YES  | —                                    |       |
| 12  | `overall_score`       | numeric(3,1) | YES  | —                                    |       |
| 13  | `recommendation`      | varchar(2)   | YES  | —                                    |       |
| 14  | `comments`            | text         | YES  | —                                    |       |
| 15  | `created_at`          | timestamp    | YES  | `CURRENT_TIMESTAMP`                  |       |

#### Indexes

- `idx_pb4005_aplnr` [INDEX] · (`aplnr`)
- `idx_pb4005_evaluator` [INDEX] · (`evaluator_pernr`)
- `idx_pb4005_vacancy` [INDEX] · (`vacancy_id`)

---

### `pcl1`

- **Tenant scoped**: no
- **Row estimate**: 0
- **Domains**: DGOV
- **Prisma model**: `pcl1`

#### Columns

| #   | Column       | Type       | Null | Default                            | Notes |
| --- | ------------ | ---------- | ---- | ---------------------------------- | ----- |
| 1   | `id`         | int4(32)   | NO   | `nextval('pcl1_id_seq'::regclass)` | PK    |
| 2   | `pernr`      | varchar(8) | NO   | —                                  |       |
| 3   | `seqnr`      | int4(32)   | NO   | `1`                                |       |
| 4   | `relession`  | varchar(4) | NO   | —                                  |       |
| 5   | `paession`   | int4(32)   | NO   | —                                  |       |
| 6   | `pession_no` | int4(32)   | NO   | —                                  |       |
| 7   | `time_data`  | jsonb      | YES  | —                                  |       |
| 8   | `rgdate`     | timestamp  | YES  | `CURRENT_TIMESTAMP`                |       |
| 9   | `status`     | varchar(2) | YES  | `'0'::character varying`           |       |
| 10  | `created_at` | timestamp  | YES  | `CURRENT_TIMESTAMP`                |       |
| 11  | `updated_at` | timestamp  | YES  | `CURRENT_TIMESTAMP`                |       |

#### Primary Key

`(`id`)`

#### Indexes

- `idx_pcl1_period` [INDEX] · (`paession`, `pession_no`)
- `idx_pcl1_pernr` [INDEX] · (`pernr`)
- `idx_pcl1_relession` [INDEX] · (`relession`)
- `pcl1_pkey` [PRIMARY] · (`id`)
- `pcl1_unique` [UNIQUE] · (`pernr`, `relession`, `paession`, `pession_no`, `seqnr`)

---

### `pcl2`

> The underlying table does not contain a valid unique identifier and can therefore currently not be handled by Prisma Client.

- **Tenant scoped**: no
- **Row estimate**: 12.562
- **Domains**: DGOV
- **Prisma model**: `pcl2`

#### Columns

| #   | Column         | Type          | Null | Default                            | Notes |
| --- | -------------- | ------------- | ---- | ---------------------------------- | ----- |
| 1   | `id`           | int4(32)      | NO   | `nextval('pcl2_id_seq'::regclass)` |       |
| 2   | `pernr`        | varchar(8)    | NO   | —                                  |       |
| 3   | `seqnr`        | int4(32)      | NO   | `1`                                |       |
| 4   | `relession`    | varchar(4)    | NO   | —                                  |       |
| 5   | `paession`     | int4(32)      | NO   | —                                  |       |
| 6   | `pession_no`   | int4(32)      | NO   | —                                  |       |
| 7   | `abkrs`        | varchar(4)    | YES  | —                                  |       |
| 8   | `payroll_data` | jsonb         | YES  | —                                  |       |
| 9   | `gross_pay`    | numeric(13,2) | YES  | —                                  |       |
| 10  | `net_pay`      | numeric(13,2) | YES  | —                                  |       |
| 11  | `rgdate`       | timestamp     | YES  | `CURRENT_TIMESTAMP`                |       |
| 12  | `status`       | varchar(2)    | YES  | `'0'::character varying`           |       |
| 13  | `created_at`   | timestamp     | YES  | `CURRENT_TIMESTAMP`                |       |
| 14  | `updated_at`   | timestamp     | YES  | `CURRENT_TIMESTAMP`                |       |

#### Indexes

- `idx_pcl2_abkrs` [INDEX] · (`abkrs`)
- `idx_pcl2_period` [INDEX] · (`paession`, `pession_no`)
- `idx_pcl2_pernr` [INDEX] · (`pernr`)

---

### `platform_features`

- **Tenant scoped**: no
- **Row estimate**: 77
- **Domains**: DGOV
- **Prisma model**: `platform_features`

#### Columns

| #   | Column                   | Type         | Null | Default                                         | Notes                                                                           |
| --- | ------------------------ | ------------ | ---- | ----------------------------------------------- | ------------------------------------------------------------------------------- |
| 1   | `id`                     | int4(32)     | NO   | `nextval('platform_features_id_seq'::regclass)` | PK                                                                              |
| 2   | `feature_code`           | varchar(50)  | NO   | —                                               |                                                                                 |
| 3   | `feature_name`           | varchar(255) | NO   | —                                               |                                                                                 |
| 4   | `category`               | varchar(100) | NO   | —                                               |                                                                                 |
| 5   | `subcategory`            | varchar(100) | YES  | —                                               |                                                                                 |
| 6   | `description`            | text         | NO   | —                                               |                                                                                 |
| 7   | `business_value`         | text         | YES  | —                                               |                                                                                 |
| 8   | `current_coverage_pct`   | int4(32)     | YES  | `0`                                             |                                                                                 |
| 9   | `implementation_status`  | varchar(50)  | YES  | `'not_started'::character varying`              |                                                                                 |
| 10  | `priority`               | varchar(20)  | YES  | `'medium'::character varying`                   |                                                                                 |
| 11  | `estimated_effort_days`  | int4(32)     | YES  | —                                               |                                                                                 |
| 12  | `market_leaders`         | \_text       | YES  | —                                               |                                                                                 |
| 13  | `market_standard_score`  | int4(32)     | YES  | `100`                                           |                                                                                 |
| 14  | `requires_tables`        | \_text       | YES  | —                                               | DEPRECATED: will be replaced by feature_required_tables junction in Phase 8     |
| 15  | `requires_views`         | \_text       | YES  | —                                               | DEPRECATED: will be replaced by feature_required_views junction in Phase 8      |
| 16  | `requires_api_endpoints` | \_text       | YES  | —                                               | DEPRECATED: will be replaced by feature_required_endpoints junction in Phase 8  |
| 17  | `requires_ui_components` | \_text       | YES  | —                                               | DEPRECATED: will be replaced by feature_required_components junction in Phase 8 |
| 18  | `created_at`             | timestamp    | YES  | `now()`                                         |                                                                                 |
| 19  | `updated_at`             | timestamp    | YES  | `now()`                                         |                                                                                 |
| 20  | `implemented_at`         | timestamp    | YES  | —                                               |                                                                                 |
| 21  | `notes`                  | text         | YES  | —                                               |                                                                                 |

#### Primary Key

`(`id`)`

#### Indexes

- `idx_features_category` [INDEX] · (`category`)
- `idx_features_priority` [INDEX] · (`priority`)
- `idx_features_status` [INDEX] · (`implementation_status`)
- `platform_features_pkey` [PRIMARY] · (`id`)

---

### `platform_pages`

- **Tenant scoped**: no
- **Row estimate**: 154
- **Domains**: DGOV
- **Prisma model**: `platform_pages`

#### Columns

| #   | Column             | Type         | Null | Default                                             | Notes                                                                                                             |
| --- | ------------------ | ------------ | ---- | --------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| 1   | `id`               | uuid         | NO   | `gen_random_uuid()`                                 | PK                                                                                                                |
| 2   | `section_key`      | varchar(50)  | NO   | —                                                   |                                                                                                                   |
| 3   | `section_title`    | varchar(100) | NO   | —                                                   |                                                                                                                   |
| 4   | `section_desc`     | text         | YES  | —                                                   |                                                                                                                   |
| 5   | `section_color`    | varchar(60)  | YES  | `'bg-gray-500/10 text-gray-600'::character varying` |                                                                                                                   |
| 6   | `section_icon`     | varchar(30)  | YES  | `'Compass'::character varying`                      |                                                                                                                   |
| 7   | `section_order`    | int4(32)     | NO   | `0`                                                 |                                                                                                                   |
| 8   | `path`             | varchar(200) | NO   | —                                                   |                                                                                                                   |
| 9   | `name`             | varchar(100) | NO   | —                                                   |                                                                                                                   |
| 10  | `description`      | text         | YES  | —                                                   |                                                                                                                   |
| 11  | `tags`             | \_text       | YES  | `'{}'::text[]`                                      | DEPRECATED: will be replaced by page_table_relations in Phase 8. >20% invalid values require data cleaning first. |
| 12  | `status`           | varchar(20)  | NO   | `'active'::character varying`                       |                                                                                                                   |
| 13  | `redirect_to`      | varchar(200) | YES  | —                                                   |                                                                                                                   |
| 14  | `page_order`       | int4(32)     | NO   | `0`                                                 |                                                                                                                   |
| 15  | `is_visible`       | bool         | NO   | `true`                                              |                                                                                                                   |
| 16  | `created_at`       | timestamptz  | NO   | `now()`                                             |                                                                                                                   |
| 17  | `updated_at`       | timestamptz  | NO   | `now()`                                             |                                                                                                                   |
| 18  | `section_title_it` | varchar(100) | YES  | —                                                   |                                                                                                                   |
| 19  | `section_title_en` | varchar(100) | YES  | —                                                   |                                                                                                                   |
| 20  | `section_desc_it`  | text         | YES  | —                                                   |                                                                                                                   |
| 21  | `section_desc_en`  | text         | YES  | —                                                   |                                                                                                                   |
| 22  | `name_it`          | varchar(100) | YES  | —                                                   |                                                                                                                   |
| 23  | `name_en`          | varchar(100) | YES  | —                                                   |                                                                                                                   |
| 24  | `description_it`   | text         | YES  | —                                                   |                                                                                                                   |
| 25  | `description_en`   | text         | YES  | —                                                   |                                                                                                                   |

#### Primary Key

`(`id`)`

#### Indexes

- `idx_platform_pages_section` [INDEX] · (`section_key`)
- `idx_platform_pages_status` [INDEX] · (`status`)
- `platform_pages_path_key` [UNIQUE] · (`path`)
- `platform_pages_pkey` [PRIMARY] · (`id`)

#### Inverse relations (referenced by)

- `page_table_relations` via (`page_id`)

---

### `plugin_api_keys`

- **Tenant scoped**: yes
- **Row estimate**: 1
- **Domains**: RBP · DGOV
- **Prisma model**: `plugin_api_keys`
- **RLS**: enabled (forced)

#### Columns

| #   | Column                   | Type         | Null | Default             | Notes |
| --- | ------------------------ | ------------ | ---- | ------------------- | ----- |
| 1   | `id`                     | uuid         | NO   | `gen_random_uuid()` | PK    |
| 2   | `tenant_id`              | uuid         | NO   | —                   |       |
| 3   | `plugin_installation_id` | uuid         | YES  | —                   |       |
| 4   | `name`                   | varchar(200) | NO   | —                   |       |
| 5   | `key_hash`               | varchar(128) | NO   | —                   |       |
| 6   | `key_prefix`             | varchar(12)  | NO   | —                   |       |
| 7   | `scopes`                 | \_text       | YES  | `'{}'::text[]`      |       |
| 8   | `expires_at`             | timestamptz  | YES  | —                   |       |
| 9   | `last_used_at`           | timestamptz  | YES  | —                   |       |
| 10  | `is_active`              | bool         | YES  | `true`              |       |
| 11  | `created_by`             | uuid         | YES  | —                   |       |
| 12  | `created_at`             | timestamptz  | YES  | `now()`             |       |
| 13  | `revoked_at`             | timestamptz  | YES  | —                   |       |
| 14  | `created_by_employee_id` | uuid         | YES  | —                   |       |
| 15  | `deleted_at`             | timestamptz  | YES  | —                   |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns                  | References                 | ON UPDATE | ON DELETE | Notes |
| ------------------------ | -------------------------- | --------- | --------- | ----- |
| `created_by_employee_id` | `employees_core(id)`       | NO ACTION | SET NULL  |       |
| `plugin_installation_id` | `plugin_installations(id)` | NO ACTION | CASCADE   |       |
| `tenant_id`              | `tenants(id)`              | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_plugin_api_keys_active` [INDEX] · (`tenant_id`, `is_active`)
- `idx_plugin_api_keys_created_by_employee_id` [INDEX] · (`created_by_employee_id`)
- `idx_plugin_api_keys_installation` [INDEX] · (`plugin_installation_id`)
- `idx_plugin_api_keys_key_prefix` [INDEX] · (`key_prefix`)
- `idx_plugin_api_keys_not_deleted` [INDEX] · (`id`)
- `idx_plugin_api_keys_tenant` [INDEX] · (`tenant_id`)
- `plugin_api_keys_pkey` [PRIMARY] · (`id`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`

---

### `plugin_categories`

- **Tenant scoped**: no
- **Row estimate**: 10
- **Domains**: DGOV
- **Prisma model**: `plugin_categories`

#### Columns

| #   | Column        | Type         | Null | Default             | Notes |
| --- | ------------- | ------------ | ---- | ------------------- | ----- |
| 1   | `id`          | uuid         | NO   | `gen_random_uuid()` | PK    |
| 2   | `name`        | varchar(100) | NO   | —                   |       |
| 3   | `slug`        | varchar(100) | NO   | —                   |       |
| 4   | `description` | text         | YES  | —                   |       |
| 5   | `icon`        | varchar(100) | YES  | —                   |       |
| 6   | `sort_order`  | int4(32)     | YES  | `0`                 |       |
| 7   | `parent_id`   | uuid         | YES  | —                   |       |
| 8   | `created_at`  | timestamptz  | YES  | `now()`             |       |
| 9   | `updated_at`  | timestamptz  | YES  | `now()`             |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns     | References              | ON UPDATE | ON DELETE | Notes |
| ----------- | ----------------------- | --------- | --------- | ----- |
| `parent_id` | `plugin_categories(id)` | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_plugin_categories_parent` [INDEX] · (`parent_id`)
- `plugin_categories_name_key` [UNIQUE] · (`name`)
- `plugin_categories_pkey` [PRIMARY] · (`id`)
- `plugin_categories_slug_key` [UNIQUE] · (`slug`)

#### Inverse relations (referenced by)

- `plugin_categories` via (`parent_id`)
- `plugins` via (`category_id`)

---

### `plugin_configurations`

- **Tenant scoped**: yes
- **Row estimate**: 0
- **Domains**: DGOV
- **Prisma model**: `plugin_configurations`
- **RLS**: enabled (forced)

#### Columns

| #   | Column                   | Type        | Null | Default             | Notes |
| --- | ------------------------ | ----------- | ---- | ------------------- | ----- |
| 1   | `id`                     | uuid        | NO   | `gen_random_uuid()` | PK    |
| 2   | `tenant_id`              | uuid        | NO   | —                   |       |
| 3   | `plugin_installation_id` | uuid        | NO   | —                   |       |
| 4   | `config_data`            | jsonb       | YES  | `'{}'::jsonb`       |       |
| 5   | `config_version`         | int4(32)    | YES  | `1`                 |       |
| 6   | `updated_by`             | uuid        | YES  | —                   |       |
| 7   | `created_at`             | timestamptz | YES  | `now()`             |       |
| 8   | `updated_at`             | timestamptz | YES  | `now()`             |       |
| 9   | `updated_by_employee_id` | uuid        | YES  | —                   |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns                  | References                 | ON UPDATE | ON DELETE | Notes |
| ------------------------ | -------------------------- | --------- | --------- | ----- |
| `plugin_installation_id` | `plugin_installations(id)` | NO ACTION | CASCADE   |       |
| `tenant_id`              | `tenants(id)`              | NO ACTION | CASCADE   |       |
| `updated_by_employee_id` | `employees_core(id)`       | NO ACTION | SET NULL  |       |

#### Indexes

- `idx_plugin_configurations_installation` [INDEX] · (`plugin_installation_id`)
- `idx_plugin_configurations_tenant` [INDEX] · (`tenant_id`)
- `idx_plugin_configurations_updated_by_employee_id` [INDEX] · (`updated_by_employee_id`)
- `plugin_configurations_pkey` [PRIMARY] · (`id`)
- `plugin_configurations_tenant_id_plugin_installation_id_key` [UNIQUE] · (`tenant_id`, `plugin_installation_id`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`

---

### `plugin_dependencies`

- **Tenant scoped**: no
- **Row estimate**: 1
- **Domains**: DGOV
- **Prisma model**: `plugin_dependencies`

#### Columns

| #   | Column                 | Type        | Null | Default             | Notes |
| --- | ---------------------- | ----------- | ---- | ------------------- | ----- |
| 1   | `id`                   | uuid        | NO   | `gen_random_uuid()` | PK    |
| 2   | `plugin_id`            | uuid        | NO   | —                   |       |
| 3   | `depends_on_plugin_id` | uuid        | NO   | —                   |       |
| 4   | `min_version`          | varchar(50) | YES  | —                   |       |
| 5   | `max_version`          | varchar(50) | YES  | —                   |       |
| 6   | `is_optional`          | bool        | YES  | `false`             |       |
| 7   | `created_at`           | timestamptz | YES  | `now()`             |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns                | References    | ON UPDATE | ON DELETE | Notes |
| ---------------------- | ------------- | --------- | --------- | ----- |
| `depends_on_plugin_id` | `plugins(id)` | NO ACTION | CASCADE   |       |
| `plugin_id`            | `plugins(id)` | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_plugin_dependencies_depends_on` [INDEX] · (`depends_on_plugin_id`)
- `idx_plugin_dependencies_plugin` [INDEX] · (`plugin_id`)
- `plugin_dependencies_pkey` [PRIMARY] · (`id`)
- `plugin_dependencies_plugin_id_depends_on_plugin_id_key` [UNIQUE] · (`plugin_id`, `depends_on_plugin_id`)

---

### `plugin_hook_executions`

- **Tenant scoped**: yes
- **Row estimate**: 0
- **Domains**: DGOV
- **Prisma model**: `plugin_hook_executions`
- **RLS**: enabled (forced)

#### Columns

| #   | Column          | Type         | Null | Default                        | Notes |
| --- | --------------- | ------------ | ---- | ------------------------------ | ----- |
| 1   | `id`            | uuid         | NO   | `gen_random_uuid()`            | PK    |
| 2   | `hook_id`       | uuid         | NO   | —                              |       |
| 3   | `tenant_id`     | uuid         | NO   | —                              |       |
| 4   | `trigger_event` | varchar(200) | NO   | —                              |       |
| 5   | `input_data`    | jsonb        | YES  | —                              |       |
| 6   | `output_data`   | jsonb        | YES  | —                              |       |
| 7   | `status`        | varchar(50)  | YES  | `'pending'::character varying` |       |
| 8   | `error_message` | text         | YES  | —                              |       |
| 9   | `duration_ms`   | int4(32)     | YES  | —                              |       |
| 10  | `started_at`    | timestamptz  | YES  | `now()`                        |       |
| 11  | `completed_at`  | timestamptz  | YES  | —                              |       |
| 12  | `created_at`    | timestamptz  | YES  | `now()`                        |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns     | References         | ON UPDATE | ON DELETE | Notes |
| ----------- | ------------------ | --------- | --------- | ----- |
| `hook_id`   | `plugin_hooks(id)` | NO ACTION | CASCADE   |       |
| `tenant_id` | `tenants(id)`      | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_plugin_hook_executions_hook` [INDEX] · (`hook_id`)
- `idx_plugin_hook_executions_started` [INDEX] · (`started_at`)
- `idx_plugin_hook_executions_status` [INDEX] · (`status`)
- `idx_plugin_hook_executions_tenant` [INDEX] · (`tenant_id`)
- `plugin_hook_executions_pkey` [PRIMARY] · (`id`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`

---

### `plugin_hooks`

- **Tenant scoped**: no
- **Row estimate**: 0
- **Domains**: DGOV
- **Prisma model**: `plugin_hooks`

#### Columns

| #   | Column         | Type         | Null | Default             | Notes |
| --- | -------------- | ------------ | ---- | ------------------- | ----- |
| 1   | `id`           | uuid         | NO   | `gen_random_uuid()` | PK    |
| 2   | `plugin_id`    | uuid         | NO   | —                   |       |
| 3   | `hook_name`    | varchar(200) | NO   | —                   |       |
| 4   | `handler_path` | varchar(500) | NO   | —                   |       |
| 5   | `priority`     | int4(32)     | YES  | `100`               |       |
| 6   | `is_async`     | bool         | YES  | `false`             |       |
| 7   | `timeout_ms`   | int4(32)     | YES  | `5000`              |       |
| 8   | `enabled`      | bool         | YES  | `true`              |       |
| 9   | `created_at`   | timestamptz  | YES  | `now()`             |       |
| 10  | `updated_at`   | timestamptz  | YES  | `now()`             |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns     | References    | ON UPDATE | ON DELETE | Notes |
| ----------- | ------------- | --------- | --------- | ----- |
| `plugin_id` | `plugins(id)` | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_plugin_hooks_enabled` [INDEX] · (`hook_name`, `enabled`)
- `idx_plugin_hooks_name` [INDEX] · (`hook_name`)
- `idx_plugin_hooks_plugin` [INDEX] · (`plugin_id`)
- `plugin_hooks_pkey` [PRIMARY] · (`id`)
- `plugin_hooks_plugin_id_hook_name_key` [UNIQUE] · (`plugin_id`, `hook_name`)

#### Inverse relations (referenced by)

- `plugin_hook_executions` via (`hook_id`)

---

### `plugin_installations`

- **Tenant scoped**: yes
- **Row estimate**: 2
- **Domains**: DGOV
- **Prisma model**: `plugin_installations`
- **RLS**: enabled (forced)

#### Columns

| #   | Column                     | Type        | Null | Default                       | Notes |
| --- | -------------------------- | ----------- | ---- | ----------------------------- | ----- |
| 1   | `id`                       | uuid        | NO   | `gen_random_uuid()`           | PK    |
| 2   | `tenant_id`                | uuid        | NO   | —                             |       |
| 3   | `plugin_id`                | uuid        | NO   | —                             |       |
| 4   | `plugin_version_id`        | uuid        | NO   | —                             |       |
| 5   | `installed_by`             | uuid        | YES  | —                             |       |
| 6   | `status`                   | varchar(50) | YES  | `'active'::character varying` |       |
| 7   | `auto_update`              | bool        | YES  | `true`                        |       |
| 8   | `installed_at`             | timestamptz | YES  | `now()`                       |       |
| 9   | `updated_at`               | timestamptz | YES  | `now()`                       |       |
| 10  | `disabled_at`              | timestamptz | YES  | —                             |       |
| 11  | `disabled_reason`          | text        | YES  | —                             |       |
| 12  | `installed_by_employee_id` | uuid        | YES  | —                             |       |
| 13  | `created_at`               | timestamptz | YES  | `now()`                       |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns                    | References            | ON UPDATE | ON DELETE | Notes |
| -------------------------- | --------------------- | --------- | --------- | ----- |
| `installed_by_employee_id` | `employees_core(id)`  | NO ACTION | SET NULL  |       |
| `plugin_id`                | `plugins(id)`         | NO ACTION | CASCADE   |       |
| `plugin_version_id`        | `plugin_versions(id)` | NO ACTION | CASCADE   |       |
| `tenant_id`                | `tenants(id)`         | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_plugin_installations_installed_by_employee_id` [INDEX] · (`installed_by_employee_id`)
- `idx_plugin_installations_plugin` [INDEX] · (`plugin_id`)
- `idx_plugin_installations_plugin_version_id` [INDEX] · (`plugin_version_id`)
- `idx_plugin_installations_status` [INDEX] · (`status`)
- `idx_plugin_installations_tenant` [INDEX] · (`tenant_id`)
- `plugin_installations_pkey` [PRIMARY] · (`id`)
- `plugin_installations_tenant_id_plugin_id_key` [UNIQUE] · (`tenant_id`, `plugin_id`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`

#### Inverse relations (referenced by)

- `plugin_api_keys` via (`plugin_installation_id`)
- `plugin_configurations` via (`plugin_installation_id`)
- `plugin_webhooks` via (`plugin_installation_id`)

---

### `plugin_reviews`

- **Tenant scoped**: yes
- **Row estimate**: 0
- **Domains**: DGOV
- **Prisma model**: `plugin_reviews`
- **RLS**: enabled (forced)

#### Columns

| #   | Column                | Type         | Null | Default                          | Notes |
| --- | --------------------- | ------------ | ---- | -------------------------------- | ----- |
| 1   | `id`                  | uuid         | NO   | `gen_random_uuid()`              | PK    |
| 2   | `tenant_id`           | uuid         | NO   | —                                |       |
| 3   | `plugin_id`           | uuid         | NO   | —                                |       |
| 4   | `user_id`             | uuid         | NO   | —                                |       |
| 5   | `rating`              | int4(32)     | NO   | —                                |       |
| 6   | `title`               | varchar(200) | YES  | —                                |       |
| 7   | `review_text`         | text         | YES  | —                                |       |
| 8   | `is_verified_install` | bool         | YES  | `false`                          |       |
| 9   | `helpful_count`       | int4(32)     | YES  | `0`                              |       |
| 10  | `status`              | varchar(50)  | YES  | `'published'::character varying` |       |
| 11  | `created_at`          | timestamptz  | YES  | `now()`                          |       |
| 12  | `updated_at`          | timestamptz  | YES  | `now()`                          |       |
| 13  | `user_id_employee_id` | uuid         | YES  | —                                |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns               | References           | ON UPDATE | ON DELETE | Notes |
| --------------------- | -------------------- | --------- | --------- | ----- |
| `user_id`             | `users(id)`          | NO ACTION | SET NULL  |       |
| `plugin_id`           | `plugins(id)`        | NO ACTION | CASCADE   |       |
| `tenant_id`           | `tenants(id)`        | NO ACTION | CASCADE   |       |
| `user_id_employee_id` | `employees_core(id)` | NO ACTION | SET NULL  |       |

#### Indexes

- `idx_plugin_reviews_plugin` [INDEX] · (`plugin_id`)
- `idx_plugin_reviews_rating` [INDEX] · (`plugin_id`, `rating`)
- `idx_plugin_reviews_tenant` [INDEX] · (`tenant_id`)
- `idx_plugin_reviews_user` [INDEX] · (`user_id`)
- `idx_plugin_reviews_user_id_employee_id` [INDEX] · (`user_id_employee_id`)
- `plugin_reviews_pkey` [PRIMARY] · (`id`)
- `plugin_reviews_plugin_id_user_id_key` [UNIQUE] · (`plugin_id`, `user_id`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`

---

### `plugin_ui_slots`

- **Tenant scoped**: no
- **Row estimate**: 0
- **Domains**: DGOV
- **Prisma model**: `plugin_ui_slots`

#### Columns

| #   | Column           | Type         | Null | Default             | Notes |
| --- | ---------------- | ------------ | ---- | ------------------- | ----- |
| 1   | `id`             | uuid         | NO   | `gen_random_uuid()` | PK    |
| 2   | `plugin_id`      | uuid         | NO   | —                   |       |
| 3   | `slot_name`      | varchar(200) | NO   | —                   |       |
| 4   | `component_path` | varchar(500) | NO   | —                   |       |
| 5   | `props_schema`   | jsonb        | YES  | `'{}'::jsonb`       |       |
| 6   | `priority`       | int4(32)     | YES  | `100`               |       |
| 7   | `enabled`        | bool         | YES  | `true`              |       |
| 8   | `created_at`     | timestamptz  | YES  | `now()`             |       |
| 9   | `updated_at`     | timestamptz  | YES  | `now()`             |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns     | References    | ON UPDATE | ON DELETE | Notes |
| ----------- | ------------- | --------- | --------- | ----- |
| `plugin_id` | `plugins(id)` | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_plugin_ui_slots_enabled` [INDEX] · (`slot_name`, `enabled`)
- `idx_plugin_ui_slots_plugin` [INDEX] · (`plugin_id`)
- `idx_plugin_ui_slots_slot` [INDEX] · (`slot_name`)
- `plugin_ui_slots_pkey` [PRIMARY] · (`id`)
- `plugin_ui_slots_plugin_id_slot_name_key` [UNIQUE] · (`plugin_id`, `slot_name`)

---

### `plugin_versions`

- **Tenant scoped**: no
- **Row estimate**: 7
- **Domains**: DGOV
- **Prisma model**: `plugin_versions`

#### Columns

| #   | Column                 | Type         | Null | Default                      | Notes |
| --- | ---------------------- | ------------ | ---- | ---------------------------- | ----- |
| 1   | `id`                   | uuid         | NO   | `gen_random_uuid()`          | PK    |
| 2   | `plugin_id`            | uuid         | NO   | —                            |       |
| 3   | `version`              | varchar(50)  | NO   | —                            |       |
| 4   | `release_notes`        | text         | YES  | —                            |       |
| 5   | `changelog`            | text         | YES  | —                            |       |
| 6   | `min_platform_version` | varchar(50)  | YES  | —                            |       |
| 7   | `max_platform_version` | varchar(50)  | YES  | —                            |       |
| 8   | `config_schema`        | jsonb        | YES  | `'{}'::jsonb`                |       |
| 9   | `permissions_required` | \_text       | YES  | `'{}'::text[]`               |       |
| 10  | `entry_point`          | varchar(500) | YES  | —                            |       |
| 11  | `package_url`          | varchar(500) | YES  | —                            |       |
| 12  | `package_size_bytes`   | int8(64)     | YES  | —                            |       |
| 13  | `checksum`             | varchar(128) | YES  | —                            |       |
| 14  | `status`               | varchar(50)  | YES  | `'draft'::character varying` |       |
| 15  | `is_latest`            | bool         | YES  | `false`                      |       |
| 16  | `published_at`         | timestamptz  | YES  | —                            |       |
| 17  | `created_at`           | timestamptz  | YES  | `now()`                      |       |
| 18  | `updated_at`           | timestamptz  | YES  | `now()`                      |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns     | References    | ON UPDATE | ON DELETE | Notes |
| ----------- | ------------- | --------- | --------- | ----- |
| `plugin_id` | `plugins(id)` | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_plugin_versions_latest` [INDEX] · (`plugin_id`)
- `idx_plugin_versions_plugin` [INDEX] · (`plugin_id`)
- `plugin_versions_pkey` [PRIMARY] · (`id`)
- `plugin_versions_plugin_id_version_key` [UNIQUE] · (`plugin_id`, `version`)

#### Inverse relations (referenced by)

- `plugin_installations` via (`plugin_version_id`)

---

### `plugin_webhook_deliveries`

- **Tenant scoped**: no
- **Row estimate**: 0
- **Domains**: DGOV
- **Prisma model**: `plugin_webhook_deliveries`

#### Columns

| #   | Column             | Type         | Null | Default                        | Notes |
| --- | ------------------ | ------------ | ---- | ------------------------------ | ----- |
| 1   | `id`               | uuid         | NO   | `gen_random_uuid()`            | PK    |
| 2   | `webhook_id`       | uuid         | NO   | —                              |       |
| 3   | `event_type`       | varchar(200) | NO   | —                              |       |
| 4   | `payload`          | jsonb        | NO   | `'{}'::jsonb`                  |       |
| 5   | `response_status`  | int4(32)     | YES  | —                              |       |
| 6   | `response_body`    | text         | YES  | —                              |       |
| 7   | `response_headers` | jsonb        | YES  | —                              |       |
| 8   | `duration_ms`      | int4(32)     | YES  | —                              |       |
| 9   | `status`           | varchar(50)  | YES  | `'pending'::character varying` |       |
| 10  | `attempt_number`   | int4(32)     | YES  | `1`                            |       |
| 11  | `next_retry_at`    | timestamptz  | YES  | —                              |       |
| 12  | `delivered_at`     | timestamptz  | YES  | —                              |       |
| 13  | `created_at`       | timestamptz  | YES  | `now()`                        |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns      | References            | ON UPDATE | ON DELETE | Notes |
| ------------ | --------------------- | --------- | --------- | ----- |
| `webhook_id` | `plugin_webhooks(id)` | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_plugin_webhook_deliveries_created` [INDEX] · (`created_at`)
- `idx_plugin_webhook_deliveries_retry` [INDEX] · (`next_retry_at`)
- `idx_plugin_webhook_deliveries_status` [INDEX] · (`status`)
- `idx_plugin_webhook_deliveries_webhook` [INDEX] · (`webhook_id`)
- `plugin_webhook_deliveries_pkey` [PRIMARY] · (`id`)

---

### `plugin_webhooks`

- **Tenant scoped**: yes
- **Row estimate**: 0
- **Domains**: DGOV
- **Prisma model**: `plugin_webhooks`
- **RLS**: enabled (forced)

#### Columns

| #   | Column                   | Type          | Null | Default             | Notes |
| --- | ------------------------ | ------------- | ---- | ------------------- | ----- |
| 1   | `id`                     | uuid          | NO   | `gen_random_uuid()` | PK    |
| 2   | `tenant_id`              | uuid          | NO   | —                   |       |
| 3   | `plugin_installation_id` | uuid          | NO   | —                   |       |
| 4   | `url`                    | varchar(1000) | NO   | —                   |       |
| 5   | `secret_hash`            | varchar(128)  | YES  | —                   |       |
| 6   | `events`                 | \_text        | YES  | `'{}'::text[]`      |       |
| 7   | `is_active`              | bool          | YES  | `true`              |       |
| 8   | `description`            | varchar(500)  | YES  | —                   |       |
| 9   | `created_by`             | uuid          | YES  | —                   |       |
| 10  | `created_at`             | timestamptz   | YES  | `now()`             |       |
| 11  | `updated_at`             | timestamptz   | YES  | `now()`             |       |
| 12  | `created_by_employee_id` | uuid          | YES  | —                   |       |
| 13  | `deleted_at`             | timestamptz   | YES  | —                   |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns                  | References                 | ON UPDATE | ON DELETE | Notes |
| ------------------------ | -------------------------- | --------- | --------- | ----- |
| `created_by_employee_id` | `employees_core(id)`       | NO ACTION | SET NULL  |       |
| `plugin_installation_id` | `plugin_installations(id)` | NO ACTION | CASCADE   |       |
| `tenant_id`              | `tenants(id)`              | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_plugin_webhooks_active` [INDEX] · (`tenant_id`, `is_active`)
- `idx_plugin_webhooks_created_by_employee_id` [INDEX] · (`created_by_employee_id`)
- `idx_plugin_webhooks_installation` [INDEX] · (`plugin_installation_id`)
- `idx_plugin_webhooks_not_deleted` [INDEX] · (`id`)
- `idx_plugin_webhooks_tenant` [INDEX] · (`tenant_id`)
- `plugin_webhooks_pkey` [PRIMARY] · (`id`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`

#### Inverse relations (referenced by)

- `plugin_webhook_deliveries` via (`webhook_id`)

---

### `plugins`

- **Tenant scoped**: no
- **Row estimate**: 7
- **Domains**: DGOV
- **Prisma model**: `plugins`

#### Columns

| #   | Column                | Type         | Null | Default                            | Notes |
| --- | --------------------- | ------------ | ---- | ---------------------------------- | ----- |
| 1   | `id`                  | uuid         | NO   | `gen_random_uuid()`                | PK    |
| 2   | `name`                | varchar(200) | NO   | —                                  |       |
| 3   | `slug`                | varchar(200) | NO   | —                                  |       |
| 4   | `short_description`   | varchar(500) | YES  | —                                  |       |
| 5   | `description`         | text         | YES  | —                                  |       |
| 6   | `category_id`         | uuid         | YES  | —                                  |       |
| 7   | `publisher_tenant_id` | uuid         | YES  | —                                  |       |
| 8   | `publisher_name`      | varchar(200) | YES  | —                                  |       |
| 9   | `icon_url`            | varchar(500) | YES  | —                                  |       |
| 10  | `homepage_url`        | varchar(500) | YES  | —                                  |       |
| 11  | `repository_url`      | varchar(500) | YES  | —                                  |       |
| 12  | `license`             | varchar(100) | YES  | `'proprietary'::character varying` |       |
| 13  | `status`              | varchar(50)  | YES  | `'draft'::character varying`       |       |
| 14  | `visibility`          | varchar(50)  | YES  | `'public'::character varying`      |       |
| 15  | `pricing_model`       | varchar(50)  | YES  | `'free'::character varying`        |       |
| 16  | `price_cents`         | int4(32)     | YES  | `0`                                |       |
| 17  | `currency`            | varchar(3)   | YES  | `'EUR'::character varying`         |       |
| 18  | `tags`                | \_text       | YES  | `'{}'::text[]`                     |       |
| 19  | `avg_rating`          | numeric(3,2) | YES  | `0`                                |       |
| 20  | `total_ratings`       | int4(32)     | YES  | `0`                                |       |
| 21  | `total_installations` | int4(32)     | YES  | `0`                                |       |
| 22  | `featured`            | bool         | YES  | `false`                            |       |
| 23  | `created_at`          | timestamptz  | YES  | `now()`                            |       |
| 24  | `updated_at`          | timestamptz  | YES  | `now()`                            |       |
| 25  | `screenshot_urls`     | \_text       | YES  | `'{}'::text[]`                     |       |
| 26  | `banner_url`          | varchar(500) | YES  | —                                  |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns               | References              | ON UPDATE | ON DELETE | Notes |
| --------------------- | ----------------------- | --------- | --------- | ----- |
| `category_id`         | `plugin_categories(id)` | NO ACTION | CASCADE   |       |
| `publisher_tenant_id` | `tenants(id)`           | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_plugins_category` [INDEX] · (`category_id`)
- `idx_plugins_featured` [INDEX] · (`featured`)
- `idx_plugins_publisher_tenant` [INDEX] · (`publisher_tenant_id`)
- `idx_plugins_status` [INDEX] · (`status`)
- `idx_plugins_tags` [INDEX] · (`tags`)
- `idx_plugins_visibility` [INDEX] · (`visibility`)
- `plugins_pkey` [PRIMARY] · (`id`)
- `plugins_slug_key` [UNIQUE] · (`slug`)

#### Inverse relations (referenced by)

- `plugin_dependencies` via (`depends_on_plugin_id` · `plugin_id`)
- `plugin_hooks` via (`plugin_id`)
- `plugin_installations` via (`plugin_id`)
- `plugin_reviews` via (`plugin_id`)
- `plugin_ui_slots` via (`plugin_id`)
- `plugin_versions` via (`plugin_id`)

---

### `rag_document_chunks`

- **Tenant scoped**: yes
- **Row estimate**: 0
- **Domains**: DGOV
- **Prisma model**: `rag_document_chunks`
- **RLS**: enabled (forced)

#### Columns

| #   | Column                 | Type         | Null | Default             | Notes |
| --- | ---------------------- | ------------ | ---- | ------------------- | ----- |
| 1   | `id`                   | uuid         | NO   | `gen_random_uuid()` | PK    |
| 2   | `tenant_id`            | uuid         | NO   | —                   |       |
| 3   | `document_id`          | uuid         | NO   | —                   |       |
| 4   | `chunk_index`          | int4(32)     | NO   | —                   |       |
| 5   | `content`              | text         | NO   | —                   |       |
| 6   | `content_hash`         | varchar(64)  | YES  | —                   |       |
| 7   | `start_char`           | int4(32)     | YES  | —                   |       |
| 8   | `end_char`             | int4(32)     | YES  | —                   |       |
| 9   | `page_number`          | int4(32)     | YES  | —                   |       |
| 10  | `section_title`        | varchar(255) | YES  | —                   |       |
| 11  | `embedding_model`      | varchar(100) | YES  | —                   |       |
| 12  | `embedding_dimensions` | int4(32)     | YES  | —                   |       |
| 13  | `embedding`            | jsonb        | YES  | —                   |       |
| 14  | `created_at`           | timestamp    | YES  | `now()`             |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns       | References          | ON UPDATE | ON DELETE | Notes |
| ------------- | ------------------- | --------- | --------- | ----- |
| `document_id` | `rag_documents(id)` | NO ACTION | CASCADE   |       |
| `tenant_id`   | `tenants(id)`       | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_rag_chunks_document` [INDEX] · (`document_id`)
- `idx_rag_chunks_hash` [INDEX] · (`content_hash`)
- `idx_rag_chunks_tenant` [INDEX] · (`tenant_id`)
- `rag_document_chunks_pkey` [PRIMARY] · (`id`)

#### RLS Policies

- **tenant_isolation_rag_chunks** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

---

### `rag_documents`

- **Tenant scoped**: yes
- **Row estimate**: 24
- **Domains**: DGOV
- **Prisma model**: `rag_documents`
- **RLS**: enabled (forced)

#### Columns

| #   | Column                    | Type         | Null | Default                         | Notes |
| --- | ------------------------- | ------------ | ---- | ------------------------------- | ----- |
| 1   | `id`                      | uuid         | NO   | `gen_random_uuid()`             | PK    |
| 2   | `tenant_id`               | uuid         | NO   | —                               |       |
| 3   | `filename`                | varchar(255) | NO   | —                               |       |
| 4   | `original_name`           | varchar(255) | NO   | —                               |       |
| 5   | `mime_type`               | varchar(100) | NO   | —                               |       |
| 6   | `file_size`               | int4(32)     | NO   | —                               |       |
| 7   | `file_path`               | varchar(500) | YES  | —                               |       |
| 8   | `status`                  | varchar(50)  | YES  | `'pending'::character varying`  |       |
| 9   | `chunk_count`             | int4(32)     | YES  | `0`                             |       |
| 10  | `error_message`           | text         | YES  | —                               |       |
| 11  | `metadata`                | jsonb        | YES  | `'{}'::jsonb`                   |       |
| 12  | `created_at`              | timestamp    | YES  | `now()`                         |       |
| 13  | `processed_at`            | timestamp    | YES  | —                               |       |
| 14  | `uploaded_by`             | uuid         | YES  | —                               |       |
| 15  | `source_type`             | varchar(50)  | YES  | `'document'::character varying` |       |
| 16  | `version`                 | int4(32)     | YES  | `1`                             |       |
| 17  | `is_latest`               | bool         | YES  | `true`                          |       |
| 18  | `parent_document_id`      | uuid         | YES  | —                               |       |
| 19  | `version_notes`           | text         | YES  | —                               |       |
| 20  | `uploaded_by_employee_id` | uuid         | YES  | —                               |       |
| 21  | `knowledge_base_id`       | uuid         | YES  | —                               |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns                   | References                | ON UPDATE | ON DELETE | Notes |
| ------------------------- | ------------------------- | --------- | --------- | ----- |
| `knowledge_base_id`       | `rag_knowledge_bases(id)` | NO ACTION | CASCADE   |       |
| `parent_document_id`      | `rag_documents(id)`       | NO ACTION | CASCADE   |       |
| `tenant_id`               | `tenants(id)`             | NO ACTION | CASCADE   |       |
| `uploaded_by_employee_id` | `employees_core(id)`      | NO ACTION | SET NULL  |       |

#### Indexes

- `idx_rag_documents_kb` [INDEX] · (`knowledge_base_id`)
- `idx_rag_documents_parent_document_id` [INDEX] · (`parent_document_id`)
- `idx_rag_documents_status` [INDEX] · (`status`)
- `idx_rag_documents_tenant` [INDEX] · (`tenant_id`)
- `idx_rag_documents_uploaded_by_employee_id` [INDEX] · (`uploaded_by_employee_id`)
- `rag_documents_pkey` [PRIMARY] · (`id`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

#### Inverse relations (referenced by)

- `document_comments` via (`document_id`)
- `document_locks` via (`document_id`)
- `document_versions` via (`document_id`)
- `rag_document_chunks` via (`document_id`)
- `rag_documents` via (`parent_document_id`)

---

### `rag_knowledge_bases`

- **Tenant scoped**: yes
- **Row estimate**: 0
- **Domains**: DGOV
- **Prisma model**: `rag_knowledge_bases`
- **RLS**: enabled (forced)

#### Columns

| #   | Column            | Type         | Null | Default                                       | Notes |
| --- | ----------------- | ------------ | ---- | --------------------------------------------- | ----- |
| 1   | `id`              | uuid         | NO   | `gen_random_uuid()`                           | PK    |
| 2   | `tenant_id`       | uuid         | NO   | —                                             |       |
| 3   | `code`            | varchar(50)  | NO   | —                                             |       |
| 4   | `name`            | varchar(200) | NO   | —                                             |       |
| 5   | `description`     | text         | YES  | —                                             |       |
| 6   | `kb_type`         | varchar(50)  | NO   | —                                             |       |
| 7   | `is_public`       | bool         | YES  | `false`                                       |       |
| 8   | `allowed_roles`   | \_text       | YES  | —                                             |       |
| 9   | `embedding_model` | varchar(100) | YES  | `'text-embedding-3-small'::character varying` |       |
| 10  | `chunk_size`      | int4(32)     | YES  | `1000`                                        |       |
| 11  | `chunk_overlap`   | int4(32)     | YES  | `200`                                         |       |
| 12  | `is_active`       | bool         | YES  | `true`                                        |       |
| 13  | `created_at`      | timestamp    | YES  | `now()`                                       |       |
| 14  | `updated_at`      | timestamp    | YES  | `now()`                                       |       |
| 15  | `deleted_at`      | timestamptz  | YES  | —                                             |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns     | References    | ON UPDATE | ON DELETE | Notes |
| ----------- | ------------- | --------- | --------- | ----- |
| `tenant_id` | `tenants(id)` | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_rag_kb_code` [UNIQUE] · (`tenant_id`, `code`)
- `idx_rag_kb_tenant` [INDEX] · (`tenant_id`)
- `idx_rag_kb_type` [INDEX] · (`kb_type`)
- `idx_rag_knowledge_bases_active` [INDEX] · (`id`)
- `rag_knowledge_bases_pkey` [PRIMARY] · (`id`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

#### Inverse relations (referenced by)

- `rag_documents` via (`knowledge_base_id`)

---

### `rag_messages`

- **Tenant scoped**: no
- **Row estimate**: 118
- **Domains**: DGOV
- **Prisma model**: `rag_messages`

#### Columns

| #   | Column                | Type         | Null | Default             | Notes |
| --- | --------------------- | ------------ | ---- | ------------------- | ----- |
| 1   | `id`                  | uuid         | NO   | `gen_random_uuid()` | PK    |
| 2   | `session_id`          | uuid         | YES  | —                   |       |
| 3   | `role`                | varchar(20)  | NO   | —                   |       |
| 4   | `content`             | text         | NO   | —                   |       |
| 5   | `sources`             | jsonb        | YES  | `'[]'::jsonb`       |       |
| 6   | `generated_sql`       | text         | YES  | —                   |       |
| 7   | `sql_result`          | jsonb        | YES  | —                   |       |
| 8   | `tokens_input`        | int4(32)     | YES  | —                   |       |
| 9   | `tokens_output`       | int4(32)     | YES  | —                   |       |
| 10  | `created_at`          | timestamp    | YES  | `now()`             |       |
| 11  | `confidence_score`    | numeric(5,4) | YES  | —                   |       |
| 12  | `confidence_factors`  | jsonb        | YES  | —                   |       |
| 13  | `requires_escalation` | bool         | YES  | `false`             |       |
| 14  | `escalation_reason`   | varchar(255) | YES  | —                   |       |
| 15  | `escalated_at`        | timestamp    | YES  | —                   |       |
| 16  | `escalated_to`        | uuid         | YES  | —                   |       |
| 17  | `human_response`      | text         | YES  | —                   |       |
| 18  | `human_responded_at`  | timestamp    | YES  | —                   |       |
| 19  | `feedback_rating`     | int4(32)     | YES  | —                   |       |
| 20  | `feedback_comment`    | text         | YES  | —                   |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns      | References         | ON UPDATE | ON DELETE | Notes |
| ------------ | ------------------ | --------- | --------- | ----- |
| `session_id` | `rag_sessions(id)` | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_rag_messages_escalation` [INDEX] · (`requires_escalation`)
- `idx_rag_messages_session` [INDEX] · (`session_id`)
- `rag_messages_pkey` [PRIMARY] · (`id`)

#### Inverse relations (referenced by)

- `ai_escalation_queue` via (`message_id`)
- `ai_query_audit` via (`message_id`)

---

### `rag_provider_keys`

- **Tenant scoped**: yes
- **Row estimate**: 9
- **Domains**: DGOV
- **Prisma model**: `rag_provider_keys`
- **RLS**: enabled (forced)

#### Columns

| #   | Column              | Type        | Null | Default             | Notes |
| --- | ------------------- | ----------- | ---- | ------------------- | ----- |
| 1   | `id`                | uuid        | NO   | `gen_random_uuid()` | PK    |
| 2   | `tenant_id`         | uuid        | NO   | —                   |       |
| 3   | `provider`          | varchar(50) | NO   | —                   |       |
| 4   | `api_key_encrypted` | text        | NO   | —                   |       |
| 5   | `is_valid`          | bool        | YES  | `false`             |       |
| 6   | `last_validated`    | timestamp   | YES  | —                   |       |
| 7   | `requests_count`    | int4(32)    | YES  | `0`                 |       |
| 8   | `tokens_used`       | int4(32)    | YES  | `0`                 |       |
| 9   | `created_at`        | timestamp   | YES  | `now()`             |       |
| 10  | `updated_at`        | timestamp   | YES  | `now()`             |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns     | References    | ON UPDATE | ON DELETE | Notes |
| ----------- | ------------- | --------- | --------- | ----- |
| `tenant_id` | `tenants(id)` | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_rag_provider_keys_tenant` [INDEX] · (`tenant_id`)
- `rag_provider_keys_pkey` [PRIMARY] · (`id`)
- `rag_provider_keys_tenant_id_provider_key` [UNIQUE] · (`tenant_id`, `provider`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

---

### `rag_sessions`

- **Tenant scoped**: yes
- **Row estimate**: 30
- **Domains**: DGOV
- **Prisma model**: `rag_sessions`
- **RLS**: enabled (forced)

#### Columns

| #   | Column                | Type         | Null | Default                        | Notes |
| --- | --------------------- | ------------ | ---- | ------------------------------ | ----- |
| 1   | `id`                  | uuid         | NO   | `gen_random_uuid()`            | PK    |
| 2   | `user_id`             | uuid         | YES  | —                              |       |
| 3   | `tenant_id`           | uuid         | NO   | —                              |       |
| 4   | `provider`            | varchar(50)  | NO   | —                              |       |
| 5   | `model`               | varchar(100) | YES  | —                              |       |
| 6   | `title`               | varchar(255) | YES  | —                              |       |
| 7   | `system_prompt`       | text         | YES  | —                              |       |
| 8   | `sources_enabled`     | jsonb        | YES  | `'["db", "documents"]'::jsonb` |       |
| 9   | `created_at`          | timestamp    | YES  | `now()`                        |       |
| 10  | `updated_at`          | timestamp    | YES  | `now()`                        |       |
| 11  | `is_archived`         | bool         | YES  | `false`                        |       |
| 12  | `user_id_employee_id` | uuid         | YES  | —                              |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns               | References           | ON UPDATE | ON DELETE | Notes |
| --------------------- | -------------------- | --------- | --------- | ----- |
| `user_id`             | `users(id)`          | NO ACTION | SET NULL  |       |
| `tenant_id`           | `tenants(id)`        | NO ACTION | CASCADE   |       |
| `user_id_employee_id` | `employees_core(id)` | NO ACTION | SET NULL  |       |

#### Indexes

- `idx_rag_sessions_tenant` [INDEX] · (`tenant_id`)
- `idx_rag_sessions_user` [INDEX] · (`user_id`)
- `idx_rag_sessions_user_id_employee_id` [INDEX] · (`user_id_employee_id`)
- `rag_sessions_pkey` [PRIMARY] · (`id`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

#### Inverse relations (referenced by)

- `ai_escalation_queue` via (`session_id`)
- `ai_query_audit` via (`session_id`)
- `rag_messages` via (`session_id`)

---

### `rag_usage_stats`

- **Tenant scoped**: yes
- **Row estimate**: 248
- **Domains**: DGOV
- **Prisma model**: `rag_usage_stats`
- **RLS**: enabled (forced)

#### Columns

| #   | Column             | Type        | Null | Default             | Notes |
| --- | ------------------ | ----------- | ---- | ------------------- | ----- |
| 1   | `id`               | uuid        | NO   | `gen_random_uuid()` | PK    |
| 2   | `tenant_id`        | uuid        | NO   | —                   |       |
| 3   | `period_date`      | date        | NO   | —                   |       |
| 4   | `provider`         | varchar(50) | NO   | —                   |       |
| 5   | `chat_requests`    | int4(32)    | YES  | `0`                 |       |
| 6   | `search_requests`  | int4(32)    | YES  | `0`                 |       |
| 7   | `sql_requests`     | int4(32)    | YES  | `0`                 |       |
| 8   | `document_uploads` | int4(32)    | YES  | `0`                 |       |
| 9   | `tokens_input`     | int4(32)    | YES  | `0`                 |       |
| 10  | `tokens_output`    | int4(32)    | YES  | `0`                 |       |
| 11  | `embedding_tokens` | int4(32)    | YES  | `0`                 |       |
| 12  | `created_at`       | timestamptz | YES  | `now()`             |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns     | References    | ON UPDATE | ON DELETE | Notes |
| ----------- | ------------- | --------- | --------- | ----- |
| `tenant_id` | `tenants(id)` | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_rag_usage_stats_tenant_period` [INDEX] · (`tenant_id`, `period_date`)
- `rag_usage_stats_pkey` [PRIMARY] · (`id`)
- `rag_usage_stats_tenant_id_period_date_provider_key` [UNIQUE] · (`tenant_id`, `period_date`, `provider`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

---

### `report_definitions`

- **Tenant scoped**: yes
- **Row estimate**: 6
- **Domains**: DGOV
- **Prisma model**: `report_definitions`
- **RLS**: enabled (forced)

#### Columns

| #   | Column                   | Type         | Null | Default                               | Notes                                                  |
| --- | ------------------------ | ------------ | ---- | ------------------------------------- | ------------------------------------------------------ |
| 1   | `id`                     | uuid         | NO   | `gen_random_uuid()`                   | PK                                                     |
| 2   | `tenant_id`              | uuid         | NO   | —                                     |                                                        |
| 3   | `name`                   | varchar(255) | NO   | —                                     |                                                        |
| 4   | `description`            | text         | YES  | —                                     |                                                        |
| 5   | `data_source`            | varchar(100) | NO   | —                                     |                                                        |
| 6   | `columns`                | jsonb        | NO   | `'[]'::jsonb`                         | JSONB BY DESIGN: report builder column definition DSL. |
| 7   | `filters`                | jsonb        | YES  | `'[]'::jsonb`                         | JSONB BY DESIGN: report builder filter definition DSL. |
| 8   | `sorting`                | jsonb        | YES  | `'[]'::jsonb`                         | JSONB BY DESIGN: sort order config.                    |
| 9   | `grouping`               | jsonb        | YES  | `'[]'::jsonb`                         | JSONB BY DESIGN: aggregation grouping config.          |
| 10  | `chart_config`           | jsonb        | YES  | —                                     | JSONB BY DESIGN: chart rendering config.               |
| 11  | `is_template`            | bool         | YES  | `false`                               |                                                        |
| 12  | `is_public`              | bool         | YES  | `false`                               |                                                        |
| 13  | `created_by`             | uuid         | YES  | —                                     |                                                        |
| 14  | `created_at`             | timestamptz  | YES  | `now()`                               |                                                        |
| 15  | `updated_at`             | timestamptz  | YES  | `now()`                               |                                                        |
| 16  | `created_by_employee_id` | uuid         | YES  | —                                     |                                                        |
| 17  | `calculated_fields`      | jsonb        | YES  | `'[]'::jsonb`                         | JSONB BY DESIGN: computed field expressions.           |
| 18  | `joins`                  | jsonb        | YES  | `'[]'::jsonb`                         | JSONB BY DESIGN: report builder join definition DSL.   |
| 19  | `parameters`             | jsonb        | YES  | `'[]'::jsonb`                         | JSONB BY DESIGN: parameterized report inputs.          |
| 20  | `drill_down_config`      | jsonb        | YES  | —                                     | JSONB BY DESIGN: drill-down navigation config.         |
| 21  | `access_control`         | jsonb        | YES  | `'{"roles": [], "users": []}'::jsonb` | JSONB BY DESIGN: report access rules.                  |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns                  | References           | ON UPDATE | ON DELETE | Notes |
| ------------------------ | -------------------- | --------- | --------- | ----- |
| `created_by_employee_id` | `employees_core(id)` | NO ACTION | SET NULL  |       |
| `tenant_id`              | `tenants(id)`        | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_report_definitions_created_by` [INDEX] · (`created_by`)
- `idx_report_definitions_created_by_employee_id` [INDEX] · (`created_by_employee_id`)
- `idx_report_definitions_tenant` [INDEX] · (`tenant_id`)
- `report_definitions_pkey` [PRIMARY] · (`id`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

#### Inverse relations (referenced by)

- `report_executions` via (`report_id`)
- `report_schedules` via (`report_id`)
- `report_subscriptions` via (`report_id`)

---

### `report_delivery_log`

- **Tenant scoped**: yes
- **Row estimate**: 108
- **Domains**: DGOV
- **Prisma model**: `report_delivery_log`
- **RLS**: enabled (forced)

#### Columns

| #   | Column            | Type         | Null | Default                        | Notes |
| --- | ----------------- | ------------ | ---- | ------------------------------ | ----- |
| 1   | `id`              | uuid         | NO   | `gen_random_uuid()`            | PK    |
| 2   | `tenant_id`       | uuid         | NO   | —                              |       |
| 3   | `subscription_id` | uuid         | YES  | —                              |       |
| 4   | `execution_id`    | uuid         | YES  | —                              |       |
| 5   | `delivery_method` | varchar(20)  | YES  | —                              |       |
| 6   | `recipient`       | varchar(255) | YES  | —                              |       |
| 7   | `status`          | varchar(20)  | YES  | `'pending'::character varying` |       |
| 8   | `sent_at`         | timestamptz  | YES  | —                              |       |
| 9   | `error_message`   | text         | YES  | —                              |       |
| 10  | `created_at`      | timestamptz  | YES  | `now()`                        |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns           | References                 | ON UPDATE | ON DELETE | Notes |
| ----------------- | -------------------------- | --------- | --------- | ----- |
| `execution_id`    | `report_executions(id)`    | NO ACTION | CASCADE   |       |
| `subscription_id` | `report_subscriptions(id)` | NO ACTION | CASCADE   |       |
| `tenant_id`       | `tenants(id)`              | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_delivery_log_status` [INDEX] · (`status`)
- `idx_delivery_log_subscription` [INDEX] · (`subscription_id`)
- `idx_report_delivery_log_execution_id` [INDEX] · (`execution_id`)
- `idx_report_delivery_log_tenant_id` [INDEX] · (`tenant_id`)
- `report_delivery_log_pkey` [PRIMARY] · (`id`)

#### RLS Policies

- **tenant_isolation_delivery_log** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`

---

### `report_executions`

- **Tenant scoped**: yes
- **Row estimate**: 60
- **Domains**: DGOV
- **Prisma model**: `report_executions`
- **RLS**: enabled (forced)

#### Columns

| #   | Column                    | Type        | Null | Default                          | Notes |
| --- | ------------------------- | ----------- | ---- | -------------------------------- | ----- |
| 1   | `id`                      | uuid        | NO   | `gen_random_uuid()`              | PK    |
| 2   | `report_id`               | uuid        | YES  | —                                |       |
| 3   | `executed_by`             | uuid        | YES  | —                                |       |
| 4   | `execution_type`          | varchar(50) | YES  | `'manual'::character varying`    |       |
| 5   | `parameters`              | jsonb       | YES  | —                                |       |
| 6   | `row_count`               | int4(32)    | YES  | —                                |       |
| 7   | `duration_ms`             | int4(32)    | YES  | —                                |       |
| 8   | `status`                  | varchar(50) | YES  | `'completed'::character varying` |       |
| 9   | `error_message`           | text        | YES  | —                                |       |
| 10  | `file_path`               | text        | YES  | —                                |       |
| 11  | `created_at`              | timestamptz | YES  | `now()`                          |       |
| 12  | `executed_by_employee_id` | uuid        | YES  | —                                |       |
| 13  | `tenant_id`               | uuid        | YES  | —                                |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns                   | References               | ON UPDATE | ON DELETE | Notes |
| ------------------------- | ------------------------ | --------- | --------- | ----- |
| `tenant_id`               | `tenants(id)`            | NO ACTION | CASCADE   |       |
| `executed_by_employee_id` | `employees_core(id)`     | NO ACTION | SET NULL  |       |
| `report_id`               | `report_definitions(id)` | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_report_executions_executed_by_employee_id` [INDEX] · (`executed_by_employee_id`)
- `idx_report_executions_report` [INDEX] · (`report_id`)
- `idx_report_executions_tenant` [INDEX] · (`tenant_id`)
- `report_executions_pkey` [PRIMARY] · (`id`)

#### RLS Policies

- **tenant_isolation_report_executions** (ALL · PERMISSIVE) · roles: `public`
  - USING: `((tenant_id IS NULL) OR (tenant_id = current_tenant_id()))`
  - WITH CHECK: `((tenant_id IS NULL) OR (tenant_id = current_tenant_id()))`

#### Inverse relations (referenced by)

- `report_delivery_log` via (`execution_id`)

---

### `report_schedules`

- **Tenant scoped**: yes
- **Row estimate**: 6
- **Domains**: DGOV
- **Prisma model**: `report_schedules`
- **RLS**: enabled (forced)

#### Columns

| #   | Column            | Type        | Null | Default                      | Notes |
| --- | ----------------- | ----------- | ---- | ---------------------------- | ----- |
| 1   | `id`              | uuid        | NO   | `gen_random_uuid()`          | PK    |
| 2   | `report_id`       | uuid        | YES  | —                            |       |
| 3   | `schedule_type`   | varchar(50) | NO   | —                            |       |
| 4   | `schedule_config` | jsonb       | NO   | —                            |       |
| 5   | `recipients`      | jsonb       | YES  | `'[]'::jsonb`                |       |
| 6   | `format`          | varchar(20) | YES  | `'excel'::character varying` |       |
| 7   | `is_active`       | bool        | YES  | `true`                       |       |
| 8   | `last_run_at`     | timestamptz | YES  | —                            |       |
| 9   | `next_run_at`     | timestamptz | YES  | —                            |       |
| 10  | `created_at`      | timestamptz | YES  | `now()`                      |       |
| 11  | `deleted_at`      | timestamptz | YES  | —                            |       |
| 12  | `tenant_id`       | uuid        | YES  | —                            |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns     | References               | ON UPDATE | ON DELETE | Notes |
| ----------- | ------------------------ | --------- | --------- | ----- |
| `tenant_id` | `tenants(id)`            | NO ACTION | CASCADE   |       |
| `report_id` | `report_definitions(id)` | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_report_schedules_active` [INDEX] · (`id`)
- `idx_report_schedules_report` [INDEX] · (`report_id`)
- `idx_report_schedules_tenant` [INDEX] · (`tenant_id`)
- `report_schedules_pkey` [PRIMARY] · (`id`)

#### RLS Policies

- **tenant_isolation_report_schedules** (ALL · PERMISSIVE) · roles: `public`
  - USING: `((tenant_id IS NULL) OR (tenant_id = current_tenant_id()))`
  - WITH CHECK: `((tenant_id IS NULL) OR (tenant_id = current_tenant_id()))`

---

### `report_subscriptions`

- **Tenant scoped**: yes
- **Row estimate**: 54
- **Domains**: DGOV
- **Prisma model**: `report_subscriptions`
- **RLS**: enabled (forced)

#### Columns

| #   | Column              | Type        | Null | Default                      | Notes |
| --- | ------------------- | ----------- | ---- | ---------------------------- | ----- |
| 1   | `id`                | uuid        | NO   | `gen_random_uuid()`          | PK    |
| 2   | `tenant_id`         | uuid        | NO   | —                            |       |
| 3   | `report_id`         | uuid        | YES  | —                            |       |
| 4   | `subscriber_id`     | uuid        | YES  | —                            |       |
| 5   | `delivery_method`   | varchar(20) | YES  | `'email'::character varying` |       |
| 6   | `format`            | varchar(20) | YES  | `'excel'::character varying` |       |
| 7   | `filters`           | jsonb       | YES  | `'{}'::jsonb`                |       |
| 8   | `schedule_type`     | varchar(50) | NO   | —                            |       |
| 9   | `schedule_config`   | jsonb       | NO   | `'{}'::jsonb`                |       |
| 10  | `is_active`         | bool        | YES  | `true`                       |       |
| 11  | `last_delivered_at` | timestamptz | YES  | —                            |       |
| 12  | `delivery_count`    | int4(32)    | YES  | `0`                          |       |
| 13  | `created_at`        | timestamptz | YES  | `now()`                      |       |
| 14  | `updated_at`        | timestamptz | YES  | `now()`                      |       |
| 15  | `deleted_at`        | timestamptz | YES  | —                            |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns         | References               | ON UPDATE | ON DELETE | Notes |
| --------------- | ------------------------ | --------- | --------- | ----- |
| `report_id`     | `report_definitions(id)` | NO ACTION | CASCADE   |       |
| `subscriber_id` | `employees_core(id)`     | NO ACTION | CASCADE   |       |
| `tenant_id`     | `tenants(id)`            | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_report_subscriptions_active` [INDEX] · (`id`)
- `idx_subscriptions_report` [INDEX] · (`report_id`)
- `idx_subscriptions_subscriber` [INDEX] · (`subscriber_id`)
- `idx_subscriptions_tenant` [INDEX] · (`tenant_id`)
- `report_subscriptions_pkey` [PRIMARY] · (`id`)

#### RLS Policies

- **tenant_isolation_subscriptions** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`

#### Inverse relations (referenced by)

- `report_delivery_log` via (`subscription_id`)

---

### `sap_config`

- **Tenant scoped**: no
- **Row estimate**: 49
- **Domains**: DGOV
- **Prisma model**: `sap_config`

#### Columns

| #   | Column         | Type         | Null | Default                                  | Notes |
| --- | -------------- | ------------ | ---- | ---------------------------------------- | ----- |
| 1   | `id`           | int4(32)     | NO   | `nextval('sap_config_id_seq'::regclass)` | PK    |
| 2   | `config_key`   | varchar(50)  | NO   | —                                        |       |
| 3   | `config_value` | varchar(100) | NO   | —                                        |       |
| 4   | `description`  | varchar(255) | YES  | —                                        |       |
| 5   | `module`       | varchar(10)  | YES  | —                                        |       |
| 6   | `created_at`   | timestamp    | YES  | `CURRENT_TIMESTAMP`                      |       |

#### Primary Key

`(`id`)`

#### Indexes

- `sap_config_config_key_key` [UNIQUE] · (`config_key`)
- `sap_config_pkey` [PRIMARY] · (`id`)

---

### `sap_delta_sync_log`

- **Tenant scoped**: yes
- **Row estimate**: 0
- **Domains**: DGOV
- **Prisma model**: `sap_delta_sync_log`
- **RLS**: enabled (forced)

#### Columns

| #   | Column              | Type        | Null | Default                          | Notes |
| --- | ------------------- | ----------- | ---- | -------------------------------- | ----- |
| 1   | `id`                | uuid        | NO   | `gen_random_uuid()`              | PK    |
| 2   | `tenant_id`         | uuid        | NO   | —                                |       |
| 3   | `sync_type`         | varchar(30) | NO   | —                                |       |
| 4   | `source_timestamp`  | timestamp   | YES  | —                                |       |
| 5   | `local_timestamp`   | timestamp   | YES  | `now()`                          |       |
| 6   | `records_checked`   | int4(32)    | YES  | `0`                              |       |
| 7   | `records_created`   | int4(32)    | YES  | `0`                              |       |
| 8   | `records_updated`   | int4(32)    | YES  | `0`                              |       |
| 9   | `records_deleted`   | int4(32)    | YES  | `0`                              |       |
| 10  | `records_unchanged` | int4(32)    | YES  | `0`                              |       |
| 11  | `status`            | varchar(30) | YES  | `'completed'::character varying` |       |
| 12  | `error_message`     | text        | YES  | —                                |       |
| 13  | `details`           | jsonb       | YES  | —                                |       |
| 14  | `created_at`        | timestamp   | YES  | `now()`                          |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns     | References    | ON UPDATE | ON DELETE | Notes |
| ----------- | ------------- | --------- | --------- | ----- |
| `tenant_id` | `tenants(id)` | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_sap_delta_date` [INDEX] · (`created_at`)
- `idx_sap_delta_tenant` [INDEX] · (`tenant_id`)
- `sap_delta_sync_log_pkey` [PRIMARY] · (`id`)

#### RLS Policies

- **tenant_isolation_sap_delta** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

---

### `sap_employee_mapping`

- **Tenant scoped**: yes
- **Row estimate**: 0
- **Domains**: DGOV
- **Prisma model**: `sap_employee_mapping`
- **RLS**: enabled (forced)

#### Columns

| #   | Column              | Type        | Null | Default                       | Notes |
| --- | ------------------- | ----------- | ---- | ----------------------------- | ----- |
| 1   | `id`                | uuid        | NO   | `gen_random_uuid()`           | PK    |
| 2   | `tenant_id`         | uuid        | NO   | —                             |       |
| 3   | `pernr`             | varchar(20) | NO   | —                             |       |
| 4   | `employee_id`       | uuid        | NO   | —                             |       |
| 5   | `last_synced_at`    | timestamp   | YES  | —                             |       |
| 6   | `sync_status`       | varchar(30) | YES  | `'active'::character varying` |       |
| 7   | `sap_data_snapshot` | jsonb       | YES  | —                             |       |
| 8   | `notes`             | text        | YES  | —                             |       |
| 9   | `created_at`        | timestamp   | YES  | `now()`                       |       |
| 10  | `updated_at`        | timestamp   | YES  | `now()`                       |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns       | References           | ON UPDATE | ON DELETE | Notes |
| ------------- | -------------------- | --------- | --------- | ----- |
| `employee_id` | `employees_core(id)` | NO ACTION | CASCADE   |       |
| `tenant_id`   | `tenants(id)`        | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_sap_emp_mapping_employee` [INDEX] · (`employee_id`)
- `idx_sap_emp_mapping_pernr` [INDEX] · (`pernr`)
- `idx_sap_emp_mapping_tenant` [INDEX] · (`tenant_id`)
- `sap_employee_mapping_pkey` [PRIMARY] · (`id`)
- `sap_employee_mapping_tenant_id_pernr_key` [UNIQUE] · (`tenant_id`, `pernr`)

#### RLS Policies

- **tenant_isolation_sap_emp_mapping** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

---

### `sap_infotype_mappings`

- **Tenant scoped**: yes
- **Row estimate**: 0
- **Domains**: DGOV
- **Prisma model**: `sap_infotype_mappings`
- **RLS**: enabled (forced)

#### Columns

| #   | Column                  | Type         | Null | Default                       | Notes |
| --- | ----------------------- | ------------ | ---- | ----------------------------- | ----- |
| 1   | `id`                    | uuid         | NO   | `gen_random_uuid()`           | PK    |
| 2   | `tenant_id`             | uuid         | NO   | —                             |       |
| 3   | `infotype`              | varchar(10)  | NO   | —                             |       |
| 4   | `infotype_name`         | varchar(200) | YES  | —                             |       |
| 5   | `sap_field`             | varchar(100) | NO   | —                             |       |
| 6   | `sap_field_description` | varchar(255) | YES  | —                             |       |
| 7   | `target_table`          | varchar(100) | NO   | —                             |       |
| 8   | `target_field`          | varchar(100) | NO   | —                             |       |
| 9   | `transform_type`        | varchar(50)  | YES  | `'direct'::character varying` |       |
| 10  | `transform_config`      | jsonb        | YES  | —                             |       |
| 11  | `validation_rules`      | jsonb        | YES  | —                             |       |
| 12  | `required`              | bool         | YES  | `false`                       |       |
| 13  | `default_value`         | text         | YES  | —                             |       |
| 14  | `is_active`             | bool         | YES  | `true`                        |       |
| 15  | `priority`              | int4(32)     | YES  | `100`                         |       |
| 16  | `notes`                 | text         | YES  | —                             |       |
| 17  | `created_at`            | timestamp    | YES  | `now()`                       |       |
| 18  | `updated_at`            | timestamp    | YES  | `now()`                       |       |
| 19  | `deleted_at`            | timestamptz  | YES  | —                             |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns     | References    | ON UPDATE | ON DELETE | Notes |
| ----------- | ------------- | --------- | --------- | ----- |
| `tenant_id` | `tenants(id)` | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_sap_infotype_mappings_active` [INDEX] · (`id`)
- `idx_sap_mappings_infotype` [INDEX] · (`infotype`)
- `idx_sap_mappings_tenant` [INDEX] · (`tenant_id`)
- `sap_infotype_mappings_pkey` [PRIMARY] · (`id`)
- `sap_infotype_mappings_tenant_id_infotype_sap_field_key` [UNIQUE] · (`tenant_id`, `infotype`, `sap_field`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

---

### `sap_migration_jobs`

- **Tenant scoped**: yes
- **Row estimate**: 0
- **Domains**: DGOV
- **Prisma model**: `sap_migration_jobs`
- **RLS**: enabled (forced)

#### Columns

| #   | Column                 | Type         | Null | Default                        | Notes |
| --- | ---------------------- | ------------ | ---- | ------------------------------ | ----- |
| 1   | `id`                   | uuid         | NO   | `gen_random_uuid()`            | PK    |
| 2   | `tenant_id`            | uuid         | NO   | —                              |       |
| 3   | `job_name`             | varchar(200) | NO   | —                              |       |
| 4   | `job_type`             | varchar(50)  | NO   | —                              |       |
| 5   | `source_system`        | varchar(100) | YES  | —                              |       |
| 6   | `source_file_path`     | text         | YES  | —                              |       |
| 7   | `source_file_hash`     | varchar(64)  | YES  | —                              |       |
| 8   | `status`               | varchar(30)  | YES  | `'pending'::character varying` |       |
| 9   | `progress_percent`     | int4(32)     | YES  | `0`                            |       |
| 10  | `current_phase`        | varchar(50)  | YES  | —                              |       |
| 11  | `total_records`        | int4(32)     | YES  | `0`                            |       |
| 12  | `processed_records`    | int4(32)     | YES  | `0`                            |       |
| 13  | `success_count`        | int4(32)     | YES  | `0`                            |       |
| 14  | `error_count`          | int4(32)     | YES  | `0`                            |       |
| 15  | `warning_count`        | int4(32)     | YES  | `0`                            |       |
| 16  | `skipped_count`        | int4(32)     | YES  | `0`                            |       |
| 17  | `started_at`           | timestamp    | YES  | —                              |       |
| 18  | `completed_at`         | timestamp    | YES  | —                              |       |
| 19  | `estimated_completion` | timestamp    | YES  | —                              |       |
| 20  | `config`               | jsonb        | YES  | `'{}'::jsonb`                  |       |
| 21  | `infotype_selection`   | \_text       | YES  | —                              |       |
| 22  | `summary`              | jsonb        | YES  | —                              |       |
| 23  | `error_log`            | jsonb        | YES  | —                              |       |
| 24  | `created_by`           | uuid         | YES  | —                              |       |
| 25  | `created_at`           | timestamp    | YES  | `now()`                        |       |
| 26  | `updated_at`           | timestamp    | YES  | `now()`                        |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns     | References    | ON UPDATE | ON DELETE | Notes |
| ----------- | ------------- | --------- | --------- | ----- |
| `tenant_id` | `tenants(id)` | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_sap_jobs_status` [INDEX] · (`status`)
- `idx_sap_jobs_tenant` [INDEX] · (`tenant_id`)
- `idx_sap_jobs_type` [INDEX] · (`job_type`)
- `sap_migration_jobs_pkey` [PRIMARY] · (`id`)

#### RLS Policies

- **tenant_isolation_sap_jobs** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

#### Inverse relations (referenced by)

- `sap_migration_rollback_log` via (`job_id`)
- `sap_staged_data` via (`job_id`)

---

### `sap_migration_rollback_log`

- **Tenant scoped**: yes
- **Row estimate**: 0
- **Domains**: DGOV
- **Prisma model**: `sap_migration_rollback_log`
- **RLS**: enabled (forced)

#### Columns

| #   | Column           | Type         | Null | Default             | Notes |
| --- | ---------------- | ------------ | ---- | ------------------- | ----- |
| 1   | `id`             | uuid         | NO   | `gen_random_uuid()` | PK    |
| 2   | `tenant_id`      | uuid         | NO   | —                   |       |
| 3   | `job_id`         | uuid         | NO   | —                   |       |
| 4   | `operation`      | varchar(20)  | NO   | —                   |       |
| 5   | `target_table`   | varchar(100) | NO   | —                   |       |
| 6   | `target_id`      | uuid         | NO   | —                   |       |
| 7   | `old_data`       | jsonb        | YES  | —                   |       |
| 8   | `new_data`       | jsonb        | YES  | —                   |       |
| 9   | `rolled_back`    | bool         | YES  | `false`             |       |
| 10  | `rolled_back_at` | timestamp    | YES  | —                   |       |
| 11  | `created_at`     | timestamp    | YES  | `now()`             |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns     | References               | ON UPDATE | ON DELETE | Notes |
| ----------- | ------------------------ | --------- | --------- | ----- |
| `job_id`    | `sap_migration_jobs(id)` | NO ACTION | CASCADE   |       |
| `tenant_id` | `tenants(id)`            | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_sap_rollback_job` [INDEX] · (`job_id`)
- `idx_sap_rollback_tenant` [INDEX] · (`tenant_id`)
- `sap_migration_rollback_log_pkey` [PRIMARY] · (`id`)

#### RLS Policies

- **tenant_isolation_sap_rollback** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

---

### `sap_staged_data`

- **Tenant scoped**: yes
- **Row estimate**: 0
- **Domains**: DGOV
- **Prisma model**: `sap_staged_data`
- **RLS**: enabled (forced)

#### Columns

| #   | Column                | Type         | Null | Default                        | Notes                                           |
| --- | --------------------- | ------------ | ---- | ------------------------------ | ----------------------------------------------- |
| 1   | `id`                  | uuid         | NO   | `gen_random_uuid()`            | PK                                              |
| 2   | `tenant_id`           | uuid         | NO   | —                              |                                                 |
| 3   | `job_id`              | uuid         | NO   | —                              |                                                 |
| 4   | `infotype`            | varchar(10)  | NO   | —                              |                                                 |
| 5   | `pernr`               | varchar(20)  | NO   | —                              |                                                 |
| 6   | `subtype`             | varchar(10)  | YES  | —                              |                                                 |
| 7   | `object_id`           | varchar(50)  | YES  | —                              |                                                 |
| 8   | `begda`               | date         | YES  | —                              |                                                 |
| 9   | `endda`               | date         | YES  | —                              |                                                 |
| 10  | `seqnr`               | int4(32)     | YES  | —                              |                                                 |
| 11  | `raw_data`            | jsonb        | NO   | —                              | JSONB BY DESIGN: raw SAP data before mapping.   |
| 12  | `status`              | varchar(30)  | YES  | `'pending'::character varying` |                                                 |
| 13  | `validation_errors`   | jsonb        | YES  | —                              | JSONB BY DESIGN: transient validation results.  |
| 14  | `validation_warnings` | jsonb        | YES  | —                              | JSONB BY DESIGN: transient validation warnings. |
| 15  | `mapped_data`         | jsonb        | YES  | —                              | JSONB BY DESIGN: staging buffer for SAP import. |
| 16  | `target_table`        | varchar(100) | YES  | —                              |                                                 |
| 17  | `target_id`           | uuid         | YES  | —                              |                                                 |
| 18  | `processed_at`        | timestamp    | YES  | —                              |                                                 |
| 19  | `created_at`          | timestamp    | YES  | `now()`                        |                                                 |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns     | References               | ON UPDATE | ON DELETE | Notes |
| ----------- | ------------------------ | --------- | --------- | ----- |
| `job_id`    | `sap_migration_jobs(id)` | NO ACTION | CASCADE   |       |
| `tenant_id` | `tenants(id)`            | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_sap_staged_infotype` [INDEX] · (`infotype`)
- `idx_sap_staged_job` [INDEX] · (`job_id`)
- `idx_sap_staged_pernr` [INDEX] · (`pernr`)
- `idx_sap_staged_status` [INDEX] · (`status`)
- `idx_sap_staged_tenant` [INDEX] · (`tenant_id`)
- `sap_staged_data_pkey` [PRIMARY] · (`id`)

#### RLS Policies

- **tenant_isolation_sap_staged** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

---

### `schema_migrations`

- **Tenant scoped**: no
- **Row estimate**: 214
- **Domains**: DGOV
- **Prisma model**: `schema_migrations`

#### Columns

| #   | Column       | Type         | Null | Default | Notes |
| --- | ------------ | ------------ | ---- | ------- | ----- |
| 1   | `version`    | varchar(255) | NO   | —       | PK    |
| 2   | `applied_at` | timestamptz  | YES  | `now()` |       |

#### Primary Key

`(`version`)`

#### Indexes

- `schema_migrations_pkey` [PRIMARY] · (`version`)

---

### `service_config`

- **Tenant scoped**: no
- **Row estimate**: 33
- **Domains**: DGOV
- **Prisma model**: `service_config`

#### Columns

| #   | Column         | Type         | Null | Default                                      | Notes |
| --- | -------------- | ------------ | ---- | -------------------------------------------- | ----- |
| 1   | `id`           | int4(32)     | NO   | `nextval('service_config_id_seq'::regclass)` | PK    |
| 2   | `config_key`   | varchar(100) | NO   | —                                            |       |
| 3   | `config_value` | text         | NO   | —                                            |       |
| 4   | `config_type`  | varchar(50)  | YES  | `'string'::character varying`                |       |
| 5   | `description`  | text         | YES  | —                                            |       |
| 6   | `created_at`   | timestamp    | YES  | `CURRENT_TIMESTAMP`                          |       |
| 7   | `updated_at`   | timestamp    | YES  | `CURRENT_TIMESTAMP`                          |       |

#### Primary Key

`(`id`)`

#### Indexes

- `service_config_config_key_key` [UNIQUE] · (`config_key`)
- `service_config_pkey` [PRIMARY] · (`id`)

---

### `sync_field_mapping`

- **Tenant scoped**: no
- **Row estimate**: 10
- **Domains**: DGOV
- **Prisma model**: `sync_field_mapping`

#### Columns

| #   | Column               | Type         | Null | Default             | Notes |
| --- | -------------------- | ------------ | ---- | ------------------- | ----- |
| 1   | `id`                 | uuid         | NO   | `gen_random_uuid()` | PK    |
| 2   | `source_table`       | varchar(100) | NO   | —                   |       |
| 3   | `source_field`       | varchar(100) | NO   | —                   |       |
| 4   | `target_table`       | varchar(100) | NO   | —                   |       |
| 5   | `target_field`       | varchar(100) | NO   | —                   |       |
| 6   | `transform_function` | varchar(255) | YES  | —                   |       |
| 7   | `is_active`          | bool         | YES  | `true`              |       |
| 8   | `notes`              | text         | YES  | —                   |       |
| 9   | `created_at`         | timestamptz  | YES  | `now()`             |       |
| 10  | `deleted_at`         | timestamptz  | YES  | —                   |       |

#### Primary Key

`(`id`)`

#### Indexes

- `idx_sync_field_mapping_active` [INDEX] · (`id`)
- `sync_field_mapping_pkey` [PRIMARY] · (`id`)
- `sync_field_mapping_source_table_source_field_target_table_t_key` [UNIQUE] · (`source_table`, `source_field`, `target_table`, `target_field`)

---

### `sync_log`

- **Tenant scoped**: yes
- **Row estimate**: 3
- **Domains**: DGOV
- **Prisma model**: `sync_log`
- **RLS**: enabled (forced)

#### Columns

| #   | Column              | Type         | Null | Default                        | Notes |
| --- | ------------------- | ------------ | ---- | ------------------------------ | ----- |
| 1   | `id`                | uuid         | NO   | `gen_random_uuid()`            | PK    |
| 2   | `sync_type`         | varchar(50)  | NO   | —                              |       |
| 3   | `tenant_id`         | uuid         | NO   | —                              |       |
| 4   | `source_table`      | varchar(100) | NO   | —                              |       |
| 5   | `target_table`      | varchar(100) | NO   | —                              |       |
| 6   | `records_processed` | int4(32)     | YES  | `0`                            |       |
| 7   | `records_success`   | int4(32)     | YES  | `0`                            |       |
| 8   | `records_failed`    | int4(32)     | YES  | `0`                            |       |
| 9   | `status`            | varchar(20)  | YES  | `'pending'::character varying` |       |
| 10  | `started_at`        | timestamp    | YES  | `now()`                        |       |
| 11  | `completed_at`      | timestamp    | YES  | —                              |       |
| 12  | `error_message`     | text         | YES  | —                              |       |
| 13  | `details`           | jsonb        | YES  | —                              |       |
| 14  | `created_by`        | varchar(100) | YES  | —                              |       |
| 15  | `created_at`        | timestamptz  | YES  | `now()`                        |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns     | References    | ON UPDATE | ON DELETE | Notes |
| ----------- | ------------- | --------- | --------- | ----- |
| `tenant_id` | `tenants(id)` | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_sync_log_started` [INDEX] · (`started_at`)
- `idx_sync_log_status` [INDEX] · (`status`)
- `idx_sync_log_tenant` [INDEX] · (`tenant_id`)
- `sync_log_pkey` [PRIMARY] · (`id`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

---

### `sync_queue`

- **Tenant scoped**: yes
- **Row estimate**: 522
- **Domains**: DGOV
- **Prisma model**: `sync_queue`
- **RLS**: enabled (forced)

#### Columns

| #   | Column         | Type        | Null | Default                        | Notes |
| --- | -------------- | ----------- | ---- | ------------------------------ | ----- |
| 1   | `id`           | uuid        | NO   | `gen_random_uuid()`            | PK    |
| 2   | `entity_type`  | varchar(50) | NO   | —                              |       |
| 3   | `entity_id`    | uuid        | NO   | —                              |       |
| 4   | `tenant_id`    | uuid        | NO   | —                              |       |
| 5   | `operation`    | varchar(20) | NO   | —                              |       |
| 6   | `priority`     | int4(32)    | YES  | `5`                            |       |
| 7   | `status`       | varchar(20) | YES  | `'pending'::character varying` |       |
| 8   | `attempts`     | int4(32)    | YES  | `0`                            |       |
| 9   | `max_attempts` | int4(32)    | YES  | `3`                            |       |
| 10  | `last_error`   | text        | YES  | —                              |       |
| 11  | `created_at`   | timestamp   | YES  | `now()`                        |       |
| 12  | `processed_at` | timestamp   | YES  | —                              |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns     | References    | ON UPDATE | ON DELETE | Notes |
| ----------- | ------------- | --------- | --------- | ----- |
| `tenant_id` | `tenants(id)` | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_sync_queue_status` [INDEX] · (`status`, `priority`)
- `idx_sync_queue_tenant` [INDEX] · (`tenant_id`)
- `sync_queue_pkey` [PRIMARY] · (`id`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

---

### `t001p`

- **Tenant scoped**: no
- **Row estimate**: 9
- **Domains**: DGOV
- **Prisma model**: `t001p`

#### Columns

| #   | Column       | Type        | Null | Default                             | Notes |
| --- | ------------ | ----------- | ---- | ----------------------------------- | ----- |
| 1   | `id`         | int4(32)    | NO   | `nextval('t001p_id_seq'::regclass)` | PK    |
| 2   | `werks`      | varchar(4)  | NO   | —                                   |       |
| 3   | `btrtl`      | varchar(4)  | NO   | —                                   |       |
| 4   | `btext`      | varchar(40) | NO   | —                                   |       |
| 5   | `molga`      | varchar(2)  | YES  | `'IT'::character varying`           |       |
| 6   | `created_at` | timestamp   | YES  | `now()`                             |       |

#### Primary Key

`(`id`)`

#### Indexes

- `t001p_pkey` [PRIMARY] · (`id`)
- `t001p_werks_btrtl_key` [UNIQUE] · (`werks`, `btrtl`)

---

### `t005`

- **Tenant scoped**: no
- **Row estimate**: 10
- **Domains**: DGOV
- **Prisma model**: `t005`

#### Columns

| #   | Column       | Type       | Null | Default                            | Notes |
| --- | ------------ | ---------- | ---- | ---------------------------------- | ----- |
| 1   | `id`         | int4(32)   | NO   | `nextval('t005_id_seq'::regclass)` | PK    |
| 2   | `land1`      | varchar(3) | NO   | —                                  |       |
| 3   | `landk`      | varchar(3) | YES  | —                                  |       |
| 4   | `lnplz`      | varchar(2) | YES  | —                                  |       |
| 5   | `pression`   | varchar(4) | YES  | —                                  |       |
| 6   | `xession`    | varchar(3) | YES  | —                                  |       |
| 7   | `spession`   | varchar(2) | YES  | —                                  |       |
| 8   | `created_at` | timestamp  | YES  | `CURRENT_TIMESTAMP`                |       |

#### Primary Key

`(`id`)`

#### Indexes

- `t005_pkey` [PRIMARY] · (`id`)
- `t005_unique` [UNIQUE] · (`land1`)

---

### `t005s`

- **Tenant scoped**: no
- **Row estimate**: 16
- **Domains**: DGOV
- **Prisma model**: `t005s`

#### Columns

| #   | Column       | Type        | Null | Default                             | Notes |
| --- | ------------ | ----------- | ---- | ----------------------------------- | ----- |
| 1   | `id`         | int4(32)    | NO   | `nextval('t005s_id_seq'::regclass)` | PK    |
| 2   | `land1`      | varchar(3)  | NO   | —                                   |       |
| 3   | `bland`      | varchar(3)  | NO   | —                                   |       |
| 4   | `fession`    | varchar(25) | YES  | —                                   |       |
| 5   | `created_at` | timestamp   | YES  | `CURRENT_TIMESTAMP`                 |       |

#### Primary Key

`(`id`)`

#### Indexes

- `t005s_pkey` [PRIMARY] · (`id`)
- `t005s_unique` [UNIQUE] · (`land1`, `bland`)

---

### `t005t`

- **Tenant scoped**: no
- **Row estimate**: 15
- **Domains**: DGOV
- **Prisma model**: `t005t`

#### Columns

| #   | Column       | Type        | Null | Default                             | Notes |
| --- | ------------ | ----------- | ---- | ----------------------------------- | ----- |
| 1   | `id`         | int4(32)    | NO   | `nextval('t005t_id_seq'::regclass)` | PK    |
| 2   | `sprsl`      | varchar(2)  | NO   | —                                   |       |
| 3   | `land1`      | varchar(3)  | NO   | —                                   |       |
| 4   | `landx`      | varchar(50) | YES  | —                                   |       |
| 5   | `nession`    | varchar(50) | YES  | —                                   |       |
| 6   | `created_at` | timestamp   | YES  | `CURRENT_TIMESTAMP`                 |       |

#### Primary Key

`(`id`)`

#### Indexes

- `t005t_pkey` [PRIMARY] · (`id`)
- `t005t_unique` [UNIQUE] · (`sprsl`, `land1`)

---

### `t500c`

- **Tenant scoped**: no
- **Row estimate**: 9
- **Domains**: DGOV
- **Prisma model**: `t500c`

#### Columns

| #   | Column       | Type        | Null | Default                             | Notes |
| --- | ------------ | ----------- | ---- | ----------------------------------- | ----- |
| 1   | `id`         | int4(32)    | NO   | `nextval('t500c_id_seq'::regclass)` | PK    |
| 2   | `bukrs`      | varchar(4)  | NO   | —                                   |       |
| 3   | `butxt`      | varchar(40) | NO   | —                                   |       |
| 4   | `ort01`      | varchar(40) | YES  | —                                   |       |
| 5   | `land1`      | varchar(3)  | YES  | —                                   |       |
| 6   | `waession`   | varchar(5)  | YES  | `'EUR'::character varying`          |       |
| 7   | `created_at` | timestamp   | YES  | `now()`                             |       |

#### Primary Key

`(`id`)`

#### Indexes

- `t500c_bukrs_key` [UNIQUE] · (`bukrs`)
- `t500c_pkey` [PRIMARY] · (`id`)

#### Inverse relations (referenced by)

- `user_pernr_mapping` via (`bukrs`)

---

### `t500p`

- **Tenant scoped**: no
- **Row estimate**: 9
- **Domains**: DGOV
- **Prisma model**: `t500p`

#### Columns

| #   | Column       | Type        | Null | Default                             | Notes |
| --- | ------------ | ----------- | ---- | ----------------------------------- | ----- |
| 1   | `id`         | int4(32)    | NO   | `nextval('t500p_id_seq'::regclass)` | PK    |
| 2   | `persa`      | varchar(4)  | NO   | —                                   |       |
| 3   | `bukrs`      | varchar(4)  | NO   | —                                   |       |
| 4   | `name1`      | varchar(40) | NO   | —                                   |       |
| 5   | `molga`      | varchar(2)  | YES  | `'IT'::character varying`           |       |
| 6   | `created_at` | timestamp   | YES  | `now()`                             |       |

#### Primary Key

`(`id`)`

#### Indexes

- `t500p_persa_bukrs_key` [UNIQUE] · (`persa`, `bukrs`)
- `t500p_pkey` [PRIMARY] · (`id`)

---

### `t503`

- **Tenant scoped**: no
- **Row estimate**: 6
- **Domains**: DGOV
- **Prisma model**: `t503`

#### Columns

| #   | Column       | Type        | Null | Default                            | Notes |
| --- | ------------ | ----------- | ---- | ---------------------------------- | ----- |
| 1   | `id`         | int4(32)    | NO   | `nextval('t503_id_seq'::regclass)` | PK    |
| 2   | `persg`      | varchar(1)  | NO   | —                                  |       |
| 3   | `pgtxt`      | varchar(40) | NO   | —                                  |       |
| 4   | `created_at` | timestamp   | YES  | `now()`                            |       |

#### Primary Key

`(`id`)`

#### Indexes

- `t503_persg_key` [UNIQUE] · (`persg`)
- `t503_pkey` [PRIMARY] · (`id`)

---

### `t503k`

- **Tenant scoped**: no
- **Row estimate**: 12
- **Domains**: DGOV
- **Prisma model**: `t503k`

#### Columns

| #   | Column       | Type        | Null | Default                             | Notes |
| --- | ------------ | ----------- | ---- | ----------------------------------- | ----- |
| 1   | `id`         | int4(32)    | NO   | `nextval('t503k_id_seq'::regclass)` | PK    |
| 2   | `persg`      | varchar(1)  | NO   | —                                   |       |
| 3   | `persk`      | varchar(2)  | NO   | —                                   |       |
| 4   | `pktxt`      | varchar(40) | NO   | —                                   |       |
| 5   | `created_at` | timestamp   | YES  | `now()`                             |       |

#### Primary Key

`(`id`)`

#### Indexes

- `t503k_persg_persk_key` [UNIQUE] · (`persg`, `persk`)
- `t503k_pkey` [PRIMARY] · (`id`)

---

### `t510`

- **Tenant scoped**: no
- **Row estimate**: 0
- **Domains**: DGOV
- **Prisma model**: `t510`

#### Columns

| #   | Column       | Type          | Null | Default                            | Notes |
| --- | ------------ | ------------- | ---- | ---------------------------------- | ----- |
| 1   | `id`         | int4(32)      | NO   | `nextval('t510_id_seq'::regclass)` | PK    |
| 2   | `molga`      | varchar(2)    | YES  | `'US'::character varying`          |       |
| 3   | `trfar`      | varchar(2)    | NO   | —                                  |       |
| 4   | `trfgb`      | varchar(2)    | NO   | —                                  |       |
| 5   | `trfgr`      | varchar(8)    | NO   | —                                  |       |
| 6   | `trfst`      | varchar(2)    | NO   | —                                  |       |
| 7   | `endda`      | date          | NO   | `'9999-12-31'::date`               |       |
| 8   | `begda`      | date          | NO   | `'1900-01-01'::date`               |       |
| 9   | `betrg`      | numeric(13,2) | NO   | —                                  |       |
| 10  | `waession`   | varchar(5)    | YES  | `'USD'::character varying`         |       |
| 11  | `divgv`      | numeric(5,2)  | YES  | `1.00`                             |       |
| 12  | `zession`    | varchar(2)    | YES  | `'M'::character varying`           |       |
| 13  | `created_at` | timestamp     | YES  | `CURRENT_TIMESTAMP`                |       |
| 14  | `updated_at` | timestamp     | YES  | `CURRENT_TIMESTAMP`                |       |

#### Primary Key

`(`id`)`

#### Indexes

- `idx_t510_scale` [INDEX] · (`trfar`, `trfgb`, `trfgr`)
- `t510_pkey` [PRIMARY] · (`id`)
- `t510_unique` [UNIQUE] · (`molga`, `trfar`, `trfgb`, `trfgr`, `trfst`, `begda`)

---

### `t510a`

- **Tenant scoped**: no
- **Row estimate**: 9
- **Domains**: DGOV
- **Prisma model**: `t510a`

#### Columns

| #   | Column         | Type        | Null | Default                             | Notes |
| --- | -------------- | ----------- | ---- | ----------------------------------- | ----- |
| 1   | `id`           | int4(32)    | NO   | `nextval('t510a_id_seq'::regclass)` | PK    |
| 2   | `molga`        | varchar(2)  | YES  | `'US'::character varying`           |       |
| 3   | `trfar`        | varchar(2)  | NO   | —                                   |       |
| 4   | `endda`        | date        | NO   | `'9999-12-31'::date`                |       |
| 5   | `begda`        | date        | NO   | `'1900-01-01'::date`                |       |
| 6   | `aession_text` | varchar(40) | NO   | —                                   |       |
| 7   | `waession`     | varchar(5)  | YES  | `'USD'::character varying`          |       |
| 8   | `created_at`   | timestamp   | YES  | `CURRENT_TIMESTAMP`                 |       |
| 9   | `updated_at`   | timestamp   | YES  | `CURRENT_TIMESTAMP`                 |       |

#### Primary Key

`(`id`)`

#### Indexes

- `t510a_pkey` [PRIMARY] · (`id`)
- `t510a_unique` [UNIQUE] · (`molga`, `trfar`, `begda`)

---

### `t510g`

- **Tenant scoped**: no
- **Row estimate**: 0
- **Domains**: DGOV
- **Prisma model**: `t510g`

#### Columns

| #   | Column          | Type        | Null | Default                             | Notes |
| --- | --------------- | ----------- | ---- | ----------------------------------- | ----- |
| 1   | `id`            | int4(32)    | NO   | `nextval('t510g_id_seq'::regclass)` | PK    |
| 2   | `molga`         | varchar(2)  | YES  | `'US'::character varying`           |       |
| 3   | `trfar`         | varchar(2)  | NO   | —                                   |       |
| 4   | `trfgb`         | varchar(2)  | NO   | —                                   |       |
| 5   | `trfgr`         | varchar(8)  | NO   | —                                   |       |
| 6   | `endda`         | date        | NO   | `'9999-12-31'::date`                |       |
| 7   | `begda`         | date        | NO   | `'1900-01-01'::date`                |       |
| 8   | `sprsl`         | varchar(2)  | YES  | `'EN'::character varying`           |       |
| 9   | `gression_text` | varchar(40) | NO   | —                                   |       |
| 10  | `created_at`    | timestamp   | YES  | `CURRENT_TIMESTAMP`                 |       |
| 11  | `updated_at`    | timestamp   | YES  | `CURRENT_TIMESTAMP`                 |       |

#### Primary Key

`(`id`)`

#### Indexes

- `t510g_pkey` [PRIMARY] · (`id`)
- `t510g_unique` [UNIQUE] · (`molga`, `trfar`, `trfgb`, `trfgr`, `sprsl`, `begda`)

---

### `t512w`

- **Tenant scoped**: no
- **Row estimate**: 17
- **Domains**: DGOV
- **Prisma model**: `t512w`

#### Columns

| #   | Column               | Type         | Null | Default                             | Notes |
| --- | -------------------- | ------------ | ---- | ----------------------------------- | ----- |
| 1   | `id`                 | int4(32)     | NO   | `nextval('t512w_id_seq'::regclass)` | PK    |
| 2   | `molga`              | varchar(2)   | YES  | `'US'::character varying`           |       |
| 3   | `lgart`              | varchar(4)   | NO   | —                                   |       |
| 4   | `endda`              | date         | NO   | `'9999-12-31'::date`                |       |
| 5   | `begda`              | date         | NO   | `'1900-01-01'::date`                |       |
| 6   | `lgtxt`              | varchar(25)  | NO   | —                                   |       |
| 7   | `kurzt`              | varchar(12)  | YES  | —                                   |       |
| 8   | `lgession`           | varchar(2)   | YES  | —                                   |       |
| 9   | `opession`           | varchar(2)   | YES  | `'+'::character varying`            |       |
| 10  | `kumession`          | varchar(2)   | YES  | —                                   |       |
| 11  | `beession_type`      | varchar(2)   | YES  | —                                   |       |
| 12  | `indirect`           | bool         | YES  | `false`                             |       |
| 13  | `esco_wage_category` | varchar(100) | YES  | —                                   |       |
| 14  | `created_at`         | timestamp    | YES  | `CURRENT_TIMESTAMP`                 |       |
| 15  | `updated_at`         | timestamp    | YES  | `CURRENT_TIMESTAMP`                 |       |

#### Primary Key

`(`id`)`

#### Indexes

- `idx_t512w_lgart` [INDEX] · (`lgart`)
- `idx_t512w_molga` [INDEX] · (`molga`)
- `t512w_pkey` [PRIMARY] · (`id`)
- `t512w_unique` [UNIQUE] · (`molga`, `lgart`, `begda`)

---

### `t513`

- **Tenant scoped**: no
- **Row estimate**: 69
- **Domains**: DGOV
- **Prisma model**: `t513`

#### Columns

| #   | Column                | Type         | Null | Default                            | Notes |
| --- | --------------------- | ------------ | ---- | ---------------------------------- | ----- |
| 1   | `id`                  | int4(32)     | NO   | `nextval('t513_id_seq'::regclass)` | PK    |
| 2   | `stession`            | varchar(8)   | NO   | —                                  |       |
| 3   | `stltx`               | varchar(40)  | NO   | —                                  |       |
| 4   | `job_family`          | varchar(40)  | YES  | —                                  |       |
| 5   | `esco_occupation_uri` | varchar(255) | YES  | —                                  |       |
| 6   | `created_at`          | timestamp    | YES  | `now()`                            |       |

#### Primary Key

`(`id`)`

#### Indexes

- `t513_pkey` [PRIMARY] · (`id`)
- `t513_stession_key` [UNIQUE] · (`stession`)

---

### `t527x`

- **Tenant scoped**: no
- **Row estimate**: 91
- **Domains**: DGOV
- **Prisma model**: `t527x`

#### Columns

| #   | Column       | Type        | Null | Default                             | Notes |
| --- | ------------ | ----------- | ---- | ----------------------------------- | ----- |
| 1   | `id`         | int4(32)    | NO   | `nextval('t527x_id_seq'::regclass)` | PK    |
| 2   | `orgeh`      | varchar(8)  | NO   | —                                   |       |
| 3   | `orgtx`      | varchar(40) | NO   | —                                   |       |
| 4   | `ersda`      | date        | YES  | —                                   |       |
| 5   | `created_at` | timestamp   | YES  | `now()`                             |       |

#### Primary Key

`(`id`)`

#### Indexes

- `t527x_orgeh_key` [UNIQUE] · (`orgeh`)
- `t527x_pkey` [PRIMARY] · (`id`)

---

### `t528b`

- **Tenant scoped**: no
- **Row estimate**: 70
- **Domains**: DGOV
- **Prisma model**: `t528b`

#### Columns

| #   | Column       | Type        | Null | Default                             | Notes |
| --- | ------------ | ----------- | ---- | ----------------------------------- | ----- |
| 1   | `id`         | int4(32)    | NO   | `nextval('t528b_id_seq'::regclass)` | PK    |
| 2   | `plans`      | varchar(8)  | NO   | —                                   |       |
| 3   | `plstx`      | varchar(40) | NO   | —                                   |       |
| 4   | `orgeh`      | varchar(8)  | YES  | —                                   |       |
| 5   | `stell`      | varchar(8)  | YES  | —                                   |       |
| 6   | `created_at` | timestamp   | YES  | `now()`                             |       |

#### Primary Key

`(`id`)`

#### Indexes

- `t528b_pkey` [PRIMARY] · (`id`)
- `t528b_plans_key` [UNIQUE] · (`plans`)

---

### `t529a`

- **Tenant scoped**: no
- **Row estimate**: 10
- **Domains**: DGOV
- **Prisma model**: `t529a`

#### Columns

| #   | Column       | Type        | Null | Default                             | Notes |
| --- | ------------ | ----------- | ---- | ----------------------------------- | ----- |
| 1   | `id`         | int4(32)    | NO   | `nextval('t529a_id_seq'::regclass)` | PK    |
| 2   | `massn`      | varchar(2)  | NO   | —                                   |       |
| 3   | `mession`    | varchar(40) | NO   | —                                   |       |
| 4   | `created_at` | timestamp   | YES  | `now()`                             |       |

#### Primary Key

`(`id`)`

#### Indexes

- `t529a_massn_key` [UNIQUE] · (`massn`)
- `t529a_pkey` [PRIMARY] · (`id`)

---

### `t529g`

- **Tenant scoped**: no
- **Row estimate**: 15
- **Domains**: DGOV
- **Prisma model**: `t529g`

#### Columns

| #   | Column       | Type        | Null | Default                             | Notes |
| --- | ------------ | ----------- | ---- | ----------------------------------- | ----- |
| 1   | `id`         | int4(32)    | NO   | `nextval('t529g_id_seq'::regclass)` | PK    |
| 2   | `massn`      | varchar(2)  | NO   | —                                   |       |
| 3   | `massg`      | varchar(2)  | NO   | —                                   |       |
| 4   | `mession`    | varchar(40) | NO   | —                                   |       |
| 5   | `created_at` | timestamp   | YES  | `now()`                             |       |

#### Primary Key

`(`id`)`

#### Indexes

- `t529g_massn_massg_key` [UNIQUE] · (`massn`, `massg`)
- `t529g_pkey` [PRIMARY] · (`id`)

---

### `t549a`

- **Tenant scoped**: no
- **Row estimate**: 5
- **Domains**: DGOV
- **Prisma model**: `t549a`

#### Columns

| #   | Column         | Type        | Null | Default                             | Notes |
| --- | -------------- | ----------- | ---- | ----------------------------------- | ----- |
| 1   | `id`           | int4(32)    | NO   | `nextval('t549a_id_seq'::regclass)` | PK    |
| 2   | `abkrs`        | varchar(4)  | NO   | —                                   |       |
| 3   | `endda`        | date        | NO   | `'9999-12-31'::date`                |       |
| 4   | `begda`        | date        | NO   | `'1900-01-01'::date`                |       |
| 5   | `aession_text` | varchar(40) | NO   | —                                   |       |
| 6   | `molga`        | varchar(2)  | YES  | `'US'::character varying`           |       |
| 7   | `pession`      | varchar(2)  | YES  | —                                   |       |
| 8   | `datession`    | varchar(2)  | YES  | —                                   |       |
| 9   | `abession`     | bool        | YES  | `true`                              |       |
| 10  | `created_at`   | timestamp   | YES  | `CURRENT_TIMESTAMP`                 |       |
| 11  | `updated_at`   | timestamp   | YES  | `CURRENT_TIMESTAMP`                 |       |

#### Primary Key

`(`id`)`

#### Indexes

- `idx_t549a_abkrs` [INDEX] · (`abkrs`)
- `t549a_pkey` [PRIMARY] · (`id`)
- `t549a_unique` [UNIQUE] · (`abkrs`, `begda`)

---

### `t549q`

- **Tenant scoped**: no
- **Row estimate**: 12
- **Domains**: DGOV
- **Prisma model**: `t549q`

#### Columns

| #   | Column          | Type       | Null | Default                             | Notes |
| --- | --------------- | ---------- | ---- | ----------------------------------- | ----- |
| 1   | `id`            | int4(32)   | NO   | `nextval('t549q_id_seq'::regclass)` | PK    |
| 2   | `pession`       | varchar(2) | NO   | —                                   |       |
| 3   | `paession`      | int4(32)   | NO   | —                                   |       |
| 4   | `pession_no`    | int4(32)   | NO   | —                                   |       |
| 5   | `begda`         | date       | NO   | —                                   |       |
| 6   | `endda`         | date       | NO   | —                                   |       |
| 7   | `paession_date` | date       | NO   | —                                   |       |
| 8   | `bonession`     | varchar(2) | YES  | —                                   |       |
| 9   | `status`        | varchar(2) | YES  | `'0'::character varying`            |       |
| 10  | `created_at`    | timestamp  | YES  | `CURRENT_TIMESTAMP`                 |       |
| 11  | `updated_at`    | timestamp  | YES  | `CURRENT_TIMESTAMP`                 |       |

#### Primary Key

`(`id`)`

#### Indexes

- `idx_t549q_dates` [INDEX] · (`begda`, `endda`)
- `idx_t549q_period` [INDEX] · (`pession`, `paession`)
- `t549q_pkey` [PRIMARY] · (`id`)
- `t549q_unique` [UNIQUE] · (`pession`, `paession`, `pession_no`)

---

### `t5ubp`

- **Tenant scoped**: no
- **Row estimate**: 8
- **Domains**: DGOV
- **Prisma model**: `t5ubp`

#### Columns

| #   | Column                 | Type          | Null | Default                             | Notes |
| --- | ---------------------- | ------------- | ---- | ----------------------------------- | ----- |
| 1   | `id`                   | int4(32)      | NO   | `nextval('t5ubp_id_seq'::regclass)` | PK    |
| 2   | `bession`              | varchar(4)    | NO   | —                                   |       |
| 3   | `endda`                | date          | NO   | `'9999-12-31'::date`                |       |
| 4   | `begda`                | date          | NO   | `'1900-01-01'::date`                |       |
| 5   | `plan_name`            | varchar(80)   | NO   | —                                   |       |
| 6   | `plan_type`            | varchar(4)    | NO   | —                                   |       |
| 7   | `plan_category`        | varchar(4)    | YES  | —                                   |       |
| 8   | `provider`             | varchar(80)   | YES  | —                                   |       |
| 9   | `eligibility_rule`     | varchar(4)    | YES  | —                                   |       |
| 10  | `waiting_period`       | int4(32)      | YES  | `0`                                 |       |
| 11  | `ee_cost_monthly`      | numeric(13,2) | YES  | —                                   |       |
| 12  | `er_cost_monthly`      | numeric(13,2) | YES  | —                                   |       |
| 13  | `family_surcharge`     | numeric(13,2) | YES  | —                                   |       |
| 14  | `coverage_summary`     | text          | YES  | —                                   |       |
| 15  | `is_active`            | bool          | YES  | `true`                              |       |
| 16  | `open_enrollment_only` | bool          | YES  | `true`                              |       |
| 17  | `created_at`           | timestamp     | YES  | `CURRENT_TIMESTAMP`                 |       |
| 18  | `updated_at`           | timestamp     | YES  | `CURRENT_TIMESTAMP`                 |       |
| 19  | `deleted_at`           | timestamptz   | YES  | —                                   |       |

#### Primary Key

`(`id`)`

#### Indexes

- `idx_t5ubp_active` [INDEX] · (`id`)
- `idx_t5ubp_category` [INDEX] · (`plan_category`)
- `idx_t5ubp_type` [INDEX] · (`plan_type`)
- `t5ubp_pkey` [PRIMARY] · (`id`)
- `t5ubp_unique` [UNIQUE] · (`bession`, `begda`)

---

### `t771q`

- **Tenant scoped**: no
- **Row estimate**: 50
- **Domains**: DGOV
- **Prisma model**: `t771q`

#### Columns

| #   | Column              | Type         | Null | Default                             | Notes |
| --- | ------------------- | ------------ | ---- | ----------------------------------- | ----- |
| 1   | `id`                | int4(32)     | NO   | `nextval('t771q_id_seq'::regclass)` | PK    |
| 2   | `qualifi`           | varchar(8)   | NO   | —                                   |       |
| 3   | `endda`             | date         | NO   | `'9999-12-31'::date`                |       |
| 4   | `begda`             | date         | NO   | `'1900-01-01'::date`                |       |
| 5   | `qualifitext`       | varchar(80)  | NO   | —                                   |       |
| 6   | `quession_group`    | varchar(8)   | YES  | —                                   |       |
| 7   | `scale_id`          | varchar(4)   | YES  | —                                   |       |
| 8   | `max_level`         | int4(32)     | YES  | `5`                                 |       |
| 9   | `esco_skill_uri`    | varchar(255) | YES  | —                                   |       |
| 10  | `esco_concept_type` | varchar(50)  | YES  | —                                   |       |
| 11  | `is_active`         | bool         | YES  | `true`                              |       |
| 12  | `created_at`        | timestamp    | YES  | `CURRENT_TIMESTAMP`                 |       |
| 13  | `deleted_at`        | timestamptz  | YES  | —                                   |       |

#### Primary Key

`(`id`)`

#### Indexes

- `idx_t771q_active` [INDEX] · (`id`)
- `idx_t771q_esco` [INDEX] · (`esco_skill_uri`)
- `idx_t771q_qualifi` [INDEX] · (`qualifi`)
- `t771q_pkey` [PRIMARY] · (`id`)
- `t771q_unique` [UNIQUE] · (`qualifi`, `begda`)

---

### `table_usage_rules`

- **Tenant scoped**: no
- **Row estimate**: 38
- **Domains**: DGOV
- **Prisma model**: `table_usage_rules`

#### Columns

| #   | Column           | Type         | Null | Default                                         | Notes |
| --- | ---------------- | ------------ | ---- | ----------------------------------------------- | ----- |
| 1   | `id`             | int4(32)     | NO   | `nextval('table_usage_rules_id_seq'::regclass)` | PK    |
| 2   | `table_name`     | varchar(100) | NO   | —                                               |       |
| 3   | `schema_name`    | varchar(50)  | YES  | `'public'::character varying`                   |       |
| 4   | `table_category` | varchar(30)  | NO   | —                                               |       |
| 5   | `usage_allowed`  | varchar(20)  | NO   | —                                               |       |
| 6   | `description`    | text         | YES  | —                                               |       |
| 7   | `example_use`    | text         | YES  | —                                               |       |
| 8   | `forbidden_use`  | text         | YES  | —                                               |       |
| 9   | `created_at`     | timestamp    | YES  | `now()`                                         |       |

#### Primary Key

`(`id`)`

#### Indexes

- `table_usage_rules_pkey` [PRIMARY] · (`id`)

---

### `tenant_sap_mapping`

- **Tenant scoped**: no
- **Row estimate**: 9
- **Domains**: OPOURSKA · DGOV
- **Prisma model**: `tenant_sap_mapping`

#### Columns

| #   | Column        | Type        | Null | Default                                          | Notes |
| --- | ------------- | ----------- | ---- | ------------------------------------------------ | ----- |
| 1   | `id`          | int4(32)    | NO   | `nextval('tenant_sap_mapping_id_seq'::regclass)` | PK    |
| 2   | `tenant_uuid` | uuid        | NO   | —                                                |       |
| 3   | `tenant_name` | varchar(50) | NO   | —                                                |       |
| 4   | `sap_bukrs`   | varchar(4)  | NO   | —                                                |       |
| 5   | `emp_prefix`  | varchar(20) | NO   | —                                                |       |
| 6   | `is_active`   | bool        | YES  | `true`                                           |       |
| 7   | `created_at`  | timestamp   | YES  | `now()`                                          |       |
| 8   | `deleted_at`  | timestamptz | YES  | —                                                |       |

#### Primary Key

`(`id`)`

#### Indexes

- `idx_tenant_sap_mapping_active` [INDEX] · (`id`)
- `tenant_sap_mapping_pkey` [PRIMARY] · (`id`)
- `tenant_sap_mapping_sap_bukrs_key` [UNIQUE] · (`sap_bukrs`)
- `tenant_sap_mapping_tenant_uuid_key` [UNIQUE] · (`tenant_uuid`)

---

### `tenant_schema_version`

- **Tenant scoped**: yes
- **Row estimate**: 4
- **Domains**: OPOURSKA · DGOV
- **RLS**: enabled (forced)

#### Columns

| #   | Column       | Type        | Null | Default             | Notes |
| --- | ------------ | ----------- | ---- | ------------------- | ----- |
| 1   | `id`         | uuid        | NO   | `gen_random_uuid()` | PK    |
| 2   | `tenant_id`  | uuid        | NO   | —                   |       |
| 3   | `version`    | int4(32)    | NO   | —                   |       |
| 4   | `applied_at` | timestamptz | NO   | `now()`             |       |
| 5   | `applied_by` | uuid        | YES  | —                   |       |
| 6   | `notes`      | text        | YES  | —                   |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns      | References    | ON UPDATE | ON DELETE | Notes |
| ------------ | ------------- | --------- | --------- | ----- |
| `applied_by` | `users(id)`   | NO ACTION | SET NULL  |       |
| `tenant_id`  | `tenants(id)` | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_tenant_schema_version_applied_by` [INDEX] · (`applied_by`)
- `idx_tenant_schema_version_tenant` [INDEX] · (`tenant_id`, `version`)
- `tenant_schema_version_pkey` [PRIMARY] · (`id`)
- `tenant_schema_version_tenant_id_version_key` [UNIQUE] · (`tenant_id`, `version`)

#### RLS Policies

- **tenant_isolation_tenant_schema_version** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

---

### `webhook_deliveries`

- **Tenant scoped**: yes
- **Row estimate**: 60
- **Domains**: DGOV
- **Prisma model**: `webhook_deliveries`
- **RLS**: enabled (forced)

#### Columns

| #   | Column             | Type         | Null | Default                        | Notes |
| --- | ------------------ | ------------ | ---- | ------------------------------ | ----- |
| 1   | `id`               | uuid         | NO   | `gen_random_uuid()`            | PK    |
| 2   | `webhook_id`       | uuid         | NO   | —                              |       |
| 3   | `tenant_id`        | uuid         | NO   | —                              |       |
| 4   | `event_type`       | varchar(100) | NO   | —                              |       |
| 5   | `payload`          | jsonb        | YES  | —                              |       |
| 6   | `status`           | varchar(50)  | YES  | `'pending'::character varying` |       |
| 7   | `response_code`    | int4(32)     | YES  | —                              |       |
| 8   | `response_time_ms` | int4(32)     | YES  | —                              |       |
| 9   | `error_message`    | text         | YES  | —                              |       |
| 10  | `retry_count`      | int4(32)     | YES  | `0`                            |       |
| 11  | `created_at`       | timestamptz  | YES  | `now()`                        |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns      | References     | ON UPDATE | ON DELETE | Notes |
| ------------ | -------------- | --------- | --------- | ----- |
| `tenant_id`  | `tenants(id)`  | NO ACTION | CASCADE   |       |
| `webhook_id` | `webhooks(id)` | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_webhook_deliveries_status` [INDEX] · (`webhook_id`, `status`)
- `idx_webhook_deliveries_tenant_id` [INDEX] · (`tenant_id`)
- `idx_webhook_deliveries_webhook` [INDEX] · (`webhook_id`)
- `webhook_deliveries_pkey` [PRIMARY] · (`id`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

---

### `webhooks`

- **Tenant scoped**: yes
- **Row estimate**: 12
- **Domains**: DGOV
- **Prisma model**: `webhooks`
- **RLS**: enabled (forced)

#### Columns

| #   | Column              | Type         | Null | Default             | Notes |
| --- | ------------------- | ------------ | ---- | ------------------- | ----- |
| 1   | `id`                | uuid         | NO   | `gen_random_uuid()` | PK    |
| 2   | `tenant_id`         | uuid         | NO   | —                   |       |
| 3   | `name`              | varchar(255) | NO   | —                   |       |
| 4   | `url`               | text         | NO   | —                   |       |
| 5   | `event_types`       | \_text       | NO   | —                   |       |
| 6   | `secret_key`        | text         | NO   | —                   |       |
| 7   | `secret_key_hint`   | varchar(20)  | YES  | —                   |       |
| 8   | `headers`           | jsonb        | YES  | —                   |       |
| 9   | `retry_count`       | int4(32)     | YES  | `3`                 |       |
| 10  | `timeout_ms`        | int4(32)     | YES  | `30000`             |       |
| 11  | `is_active`         | bool         | YES  | `true`              |       |
| 12  | `last_triggered_at` | timestamptz  | YES  | —                   |       |
| 13  | `last_status`       | varchar(50)  | YES  | —                   |       |
| 14  | `created_at`        | timestamptz  | YES  | `now()`             |       |
| 15  | `updated_at`        | timestamptz  | YES  | `now()`             |       |
| 16  | `deleted_at`        | timestamptz  | YES  | —                   |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns     | References    | ON UPDATE | ON DELETE | Notes |
| ----------- | ------------- | --------- | --------- | ----- |
| `tenant_id` | `tenants(id)` | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_webhooks_active` [INDEX] · (`tenant_id`, `is_active`)
- `idx_webhooks_not_deleted` [INDEX] · (`id`)
- `idx_webhooks_tenant` [INDEX] · (`tenant_id`)
- `webhooks_pkey` [PRIMARY] · (`id`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(tenant_id = current_tenant_id())`
  - WITH CHECK: `(tenant_id = current_tenant_id())`

#### Inverse relations (referenced by)

- `webhook_deliveries` via (`webhook_id`)

---

### `widget_catalog`

- **Tenant scoped**: no
- **Row estimate**: 27
- **Domains**: DGOV
- **Prisma model**: `widget_catalog`

#### Columns

| #   | Column                 | Type         | Null | Default                                      | Notes                                             |
| --- | ---------------------- | ------------ | ---- | -------------------------------------------- | ------------------------------------------------- |
| 1   | `id`                   | int4(32)     | NO   | `nextval('widget_catalog_id_seq'::regclass)` | PK                                                |
| 2   | `code`                 | varchar(60)  | NO   | —                                            |                                                   |
| 3   | `name`                 | varchar(150) | NO   | —                                            |                                                   |
| 4   | `description`          | text         | YES  | —                                            |                                                   |
| 5   | `widget_type`          | varchar(30)  | NO   | —                                            |                                                   |
| 6   | `data_source_type`     | varchar(20)  | NO   | —                                            |                                                   |
| 7   | `data_source_config`   | jsonb        | YES  | `'{}'::jsonb`                                |                                                   |
| 8   | `default_size`         | jsonb        | YES  | `'{"h": 3, "w": 4}'::jsonb`                  |                                                   |
| 9   | `min_size`             | jsonb        | YES  | `'{"h": 2, "w": 2}'::jsonb`                  |                                                   |
| 10  | `max_size`             | jsonb        | YES  | `'{"h": 8, "w": 12}'::jsonb`                 |                                                   |
| 11  | `icon`                 | varchar(50)  | YES  | —                                            |                                                   |
| 12  | `functional_area_code` | varchar(60)  | YES  | —                                            |                                                   |
| 13  | `perspective_code`     | varchar(20)  | YES  | —                                            |                                                   |
| 14  | `is_active`            | bool         | YES  | `true`                                       |                                                   |
| 15  | `requires_min_role`    | int4(32)     | YES  | `8`                                          |                                                   |
| 16  | `metadata`             | jsonb        | YES  | `'{}'::jsonb`                                |                                                   |
| 17  | `created_at`           | timestamptz  | YES  | `now()`                                      |                                                   |
| 18  | `updated_at`           | timestamptz  | YES  | `now()`                                      |                                                   |
| 19  | `frontend_module`      | text         | YES  | —                                            |                                                   |
| 20  | `cache_ttl_seconds`    | int4(32)     | NO   | `0`                                          | Time-to-live for widget data cache (0 = no cache) |
| 21  | `swr_seconds`          | int4(32)     | NO   | `0`                                          | Stale-while-revalidate window (0 = disabled)      |
| 22  | `name_it`              | varchar(150) | YES  | —                                            |                                                   |
| 23  | `name_en`              | varchar(150) | YES  | —                                            |                                                   |
| 24  | `description_it`       | text         | YES  | —                                            |                                                   |
| 25  | `description_en`       | text         | YES  | —                                            |                                                   |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns                | References                   | ON UPDATE | ON DELETE | Notes |
| ---------------------- | ---------------------------- | --------- | --------- | ----- |
| `functional_area_code` | `rbp_functional_areas(code)` | NO ACTION | RESTRICT  |       |
| `perspective_code`     | `rbp_perspectives(code)`     | NO ACTION | RESTRICT  |       |

#### Indexes

- `idx_widget_catalog_functional_area_code` [INDEX] · (`functional_area_code`)
- `idx_widget_catalog_perspective_code` [INDEX] · (`perspective_code`)
- `widget_catalog_code_key` [UNIQUE] · (`code`)
- `widget_catalog_pkey` [PRIMARY] · (`id`)

#### Inverse relations (referenced by)

- `workspace_widgets` via (`widget_catalog_id`)

---

### `widget_templates`

- **Tenant scoped**: yes
- **Row estimate**: 7
- **Domains**: DGOV
- **Prisma model**: `widget_templates`
- **RLS**: enabled (forced)

#### Columns

| #   | Column           | Type         | Null | Default             | Notes |
| --- | ---------------- | ------------ | ---- | ------------------- | ----- |
| 1   | `id`             | uuid         | NO   | `gen_random_uuid()` | PK    |
| 2   | `tenant_id`      | uuid         | NO   | —                   |       |
| 3   | `code`           | varchar(100) | NO   | —                   |       |
| 4   | `name`           | varchar(200) | NO   | —                   |       |
| 5   | `description`    | text         | YES  | —                   |       |
| 6   | `widget_type`    | varchar(50)  | NO   | —                   |       |
| 7   | `data_source`    | varchar(100) | NO   | —                   |       |
| 8   | `query_config`   | jsonb        | NO   | `'{}'::jsonb`       |       |
| 9   | `display_config` | jsonb        | NO   | `'{}'::jsonb`       |       |
| 10  | `default_width`  | int4(32)     | YES  | `4`                 |       |
| 11  | `default_height` | int4(32)     | YES  | `3`                 |       |
| 12  | `category`       | varchar(50)  | YES  | —                   |       |
| 13  | `is_system`      | bool         | YES  | `false`             |       |
| 14  | `is_active`      | bool         | YES  | `true`              |       |
| 15  | `created_at`     | timestamptz  | YES  | `now()`             |       |
| 16  | `deleted_at`     | timestamptz  | YES  | —                   |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns     | References    | ON UPDATE | ON DELETE | Notes |
| ----------- | ------------- | --------- | --------- | ----- |
| `tenant_id` | `tenants(id)` | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_widget_templates_active` [INDEX] · (`id`)
- `idx_widget_templates_category` [INDEX] · (`category`)
- `idx_widget_templates_code` [UNIQUE] · (`tenant_id`, `code`)
- `widget_templates_pkey` [PRIMARY] · (`id`)

#### RLS Policies

- **tenant_isolation_widget_templates** (ALL · PERMISSIVE) · roles: `public`
  - USING: `((tenant_id IS NULL) OR (tenant_id = current_tenant_id()))`

---

### `workspace_templates`

- **Tenant scoped**: yes
- **Row estimate**: 8
- **Domains**: DGOV
- **Prisma model**: `workspace_templates`
- **RLS**: enabled (forced)

#### Columns

| #   | Column           | Type         | Null | Default                                                 | Notes |
| --- | ---------------- | ------------ | ---- | ------------------------------------------------------- | ----- |
| 1   | `id`             | int4(32)     | NO   | `nextval('workspace_templates_id_seq'::regclass)`       | PK    |
| 2   | `code`           | varchar(60)  | NO   | —                                                       |       |
| 3   | `name`           | varchar(150) | NO   | —                                                       |       |
| 4   | `description`    | text         | YES  | —                                                       |       |
| 5   | `target_role_id` | int4(32)     | YES  | —                                                       |       |
| 6   | `tenant_id`      | uuid         | YES  | —                                                       |       |
| 7   | `layout_config`  | jsonb        | YES  | `'{"gap": 16, "columns": 12, "row_height": 80}'::jsonb` |       |
| 8   | `widget_config`  | jsonb        | NO   | `'[]'::jsonb`                                           |       |
| 9   | `icon`           | varchar(50)  | YES  | —                                                       |       |
| 10  | `is_active`      | bool         | YES  | `true`                                                  |       |
| 11  | `is_system`      | bool         | YES  | `true`                                                  |       |
| 12  | `sort_order`     | int4(32)     | YES  | `0`                                                     |       |
| 13  | `created_at`     | timestamptz  | YES  | `now()`                                                 |       |
| 14  | `updated_at`     | timestamptz  | YES  | `now()`                                                 |       |
| 15  | `name_it`        | varchar(150) | YES  | —                                                       |       |
| 16  | `name_en`        | varchar(150) | YES  | —                                                       |       |
| 17  | `description_it` | text         | YES  | —                                                       |       |
| 18  | `description_en` | text         | YES  | —                                                       |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns          | References      | ON UPDATE | ON DELETE | Notes |
| ---------------- | --------------- | --------- | --------- | ----- |
| `target_role_id` | `rbp_roles(id)` | NO ACTION | RESTRICT  |       |
| `tenant_id`      | `tenants(id)`   | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_workspace_templates_role` [INDEX] · (`target_role_id`)
- `idx_workspace_templates_tenant` [INDEX] · (`tenant_id`)
- `workspace_templates_code_key` [UNIQUE] · (`code`)
- `workspace_templates_pkey` [PRIMARY] · (`id`)

#### RLS Policies

- **tenant_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `((tenant_id IS NULL) OR (tenant_id = current_tenant_id()))`

---

### `workspace_widgets`

- **Tenant scoped**: no
- **Row estimate**: 1
- **Domains**: DGOV
- **Prisma model**: `workspace_widgets`
- **RLS**: enabled (forced)

#### Columns

| #   | Column              | Type         | Null | Default                                         | Notes |
| --- | ------------------- | ------------ | ---- | ----------------------------------------------- | ----- |
| 1   | `id`                | int4(32)     | NO   | `nextval('workspace_widgets_id_seq'::regclass)` | PK    |
| 2   | `workspace_id`      | int4(32)     | NO   | —                                               |       |
| 3   | `widget_catalog_id` | int4(32)     | NO   | —                                               |       |
| 4   | `position_x`        | int4(32)     | NO   | `0`                                             |       |
| 5   | `position_y`        | int4(32)     | NO   | `0`                                             |       |
| 6   | `width`             | int4(32)     | NO   | `4`                                             |       |
| 7   | `height`            | int4(32)     | NO   | `3`                                             |       |
| 8   | `config_override`   | jsonb        | YES  | `'{}'::jsonb`                                   |       |
| 9   | `title_override`    | varchar(150) | YES  | —                                               |       |
| 10  | `is_visible`        | bool         | YES  | `true`                                          |       |
| 11  | `sort_order`        | int4(32)     | YES  | `0`                                             |       |
| 12  | `created_at`        | timestamptz  | YES  | `now()`                                         |       |
| 13  | `updated_at`        | timestamptz  | YES  | `now()`                                         |       |

#### Primary Key

`(`id`)`

#### Foreign Keys

| Columns             | References            | ON UPDATE | ON DELETE | Notes |
| ------------------- | --------------------- | --------- | --------- | ----- |
| `widget_catalog_id` | `widget_catalog(id)`  | NO ACTION | CASCADE   |       |
| `workspace_id`      | `user_workspaces(id)` | NO ACTION | CASCADE   |       |

#### Indexes

- `idx_workspace_widgets_widget_catalog_id` [INDEX] · (`widget_catalog_id`)
- `idx_workspace_widgets_workspace` [INDEX] · (`workspace_id`)
- `idx_workspace_widgets_workspace_id` [INDEX] · (`workspace_id`)
- `workspace_widgets_pkey` [PRIMARY] · (`id`)

#### RLS Policies

- **workspace_widgets_isolation** (ALL · PERMISSIVE) · roles: `public`
  - USING: `(workspace_id IN ( SELECT user_workspaces.id
 FROM user_workspaces
WHERE (user_workspaces.tenant_id = (NULLIF(current_setting('app.current_tenant_id'::text, true), ''::text))::uuid)))`
  - WITH CHECK: `(workspace_id IN ( SELECT user_workspaces.id
 FROM user_workspaces
WHERE (user_workspaces.tenant_id = (NULLIF(current_setting('app.current_tenant_id'::text, true), ''::text))::uuid)))`

---
