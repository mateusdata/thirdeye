/*
 * Copyright 2024 StarTree Inc
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
package ai.startree.thirdeye.detectionpipeline.operator.sql;

import static ai.startree.thirdeye.spi.Constants.DEFAULT_LOCALE;

import ai.startree.thirdeye.spi.detection.v2.DataTableToSqlAdapter;

public class DataTableToSqlAdapterFactory {

  public static DataTableToSqlAdapter create(final String sqlEngine) {
    switch (sqlEngine.toUpperCase(DEFAULT_LOCALE)) {
      case "CALCITE":
        return new CalciteDataTableToSqlAdapter();
      // todo cyril - remove hsqldb support 
      case "HYPERSQL": case "HSQLDB":
        return new HyperSqlDataTableToSqlAdapter();
      default:
        throw new IllegalArgumentException(String.format("Unknown SQL engine: %s", sqlEngine));
    }
  }
}
