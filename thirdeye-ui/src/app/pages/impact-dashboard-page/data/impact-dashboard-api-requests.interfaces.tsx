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
 *
 * See the License for the specific language governing permissions and limitations under
 * the License.
 */
import { Alert } from "../../../rest/dto/alert.interfaces";
import { Anomaly } from "../../../rest/dto/anomaly.interfaces";
import { EnumerationItem } from "../../../rest/dto/enumeration-item.interfaces";
import { Investigation } from "../../../rest/dto/rca.interfaces";
import { SubscriptionGroup } from "../../../rest/dto/subscription-group.interfaces";

export interface ApiRequestsProps {
    selectedAnalysisPeriod: string;
}

export interface APIRequestData {
    anomalies: Anomaly[] | null;
    previousPeriodAnomalies: Anomaly[] | null;
    investigations: Investigation[] | null;
    // alertsCount: { count: number } | null;
    subscriptionGroups: SubscriptionGroup[] | null;
    mostRecentlyInvestigatedAnomalyAlert?: Pick<Alert, "id" | "name">;
    alerts: Alert[] | null;
    enumerationItems: EnumerationItem[] | null;
}
