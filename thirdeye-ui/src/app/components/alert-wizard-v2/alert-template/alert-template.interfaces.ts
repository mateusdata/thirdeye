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
 *
 * See the License for the specific language governing permissions and limitations under
 * the License.
 */
import {
    AlertTemplate,
    MetadataProperty,
} from "../../../rest/dto/alert-template.interfaces";
import { EditableAlert } from "../../../rest/dto/alert.interfaces";

export interface AlertTemplateProps {
    alert: EditableAlert;
    onAlertPropertyChange: (contents: Partial<EditableAlert>) => void;
    selectedAlertTemplate: AlertTemplate | null;
    setSelectedAlertTemplate: (newAlertTemplate: AlertTemplate | null) => void;
    alertTemplateOptions: AlertTemplate[];
    onChartDataLoadSuccess?: () => void;
}

export interface AlertTemplatePropertyParsedMetadata {
    name: string;
    isOptional: boolean;
    metadata: MetadataProperty;
}
