/*
 * Copyright 2023 StarTree Inc
 *
 * Licensed under the StarTree Community License (the "License"); you may not use
 * this file except in compliance with the License. You may obtain a copy of the
 * License at http://www.startree.ai/legal/startree-community-license
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the
 * License is distributed on an "AS IS" BASIS, WITHOUT * WARRANTIES OF ANY KIND,
 * either express or implied.
 * See the License for the specific language governing permissions and limitations under
 * the License.
 */

-- tables had legacy unique constraints on entity names. This is not compatible with namespacing. 
-- See README.md in this folder for remaining todos
DROP INDEX uc_datasource ON data_source_index;
ALTER TABLE data_source_index ADD CONSTRAINT pk_base_id PRIMARY KEY (base_id);
