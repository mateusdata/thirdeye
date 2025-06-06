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
package ai.startree.thirdeye.spi.detection.v2;

import java.util.HashMap;
import java.util.Map;

/**
 * Abstract DataTable with properties management implemented.
 */
public abstract class AbstractDataTableImpl implements DataTable {

  private final Map<String, String> properties = new HashMap<>();

  @Override
  public Map<String, String> getProperties() {
    return properties;
  }

  @Override
  public void addProperties(final Map<String, String> metadata) {
    this.properties.putAll(metadata);
  }
}
