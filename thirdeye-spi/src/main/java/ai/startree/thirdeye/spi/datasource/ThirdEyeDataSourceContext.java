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
package ai.startree.thirdeye.spi.datasource;

import ai.startree.thirdeye.spi.config.QuotasConfiguration;
import ai.startree.thirdeye.spi.datalayer.dto.DataSourceDTO;

public class ThirdEyeDataSourceContext {

  private DataSourceDTO dataSourceDTO;
  private QuotasConfiguration quotasConfiguration;

  public DataSourceDTO getDataSourceDTO() {
    return dataSourceDTO;
  }

  public ThirdEyeDataSourceContext setDataSourceDTO(
      final DataSourceDTO dataSourceDTO) {
    this.dataSourceDTO = dataSourceDTO;
    return this;
  }

  public QuotasConfiguration getQuotasConfiguration() {
    return quotasConfiguration;
  }

  public ThirdEyeDataSourceContext setQuotasConfiguration(
      final QuotasConfiguration quotasConfiguration) {
    this.quotasConfiguration = quotasConfiguration;
    return this;
  }
}
