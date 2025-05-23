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
import { ActionHook } from "../actions.interfaces";
import {
    Anomaly,
    AnomalyFeedback,
    AnomalyStats,
} from "../dto/anomaly.interfaces";

export interface GetAnomaly extends ActionHook {
    anomaly: Anomaly | null;
    getAnomaly: (anomalyId: number) => Promise<Anomaly | undefined>;
}
export interface GetAnomalies extends ActionHook {
    anomalies: Anomaly[] | null;
    getAnomalies: (
        getAnomaliesParams?: GetAnomaliesProps
    ) => Promise<Anomaly[] | undefined>;
}

export interface GetAnomaliesProps {
    alertId?: number | string;
    alertIds?: number[] | string[];
    startTime?: number;
    endTime?: number;
    dataset?: string;
    metric?: string;
    enumerationItemId?: number;
    filterIgnoredAnomalies?: boolean;
}

export interface GetAnomalyStatsProps {
    startTime?: number;
    endTime?: number;
}

export interface GetAnomalyStats extends ActionHook {
    anomalyStats: AnomalyStats | null;
    getAnomalyStats: (
        getAnomalyStatsParams?: GetAnomalyStatsProps
    ) => Promise<AnomalyStats | undefined>;
}

export interface UpdateAnomalyFeedback extends ActionHook {
    anomalyFeedback: AnomalyFeedback | null;
    updateAnomalyFeedback: (
        anomalyId: number,
        feedback: AnomalyFeedback
    ) => Promise<AnomalyFeedback | undefined>;
}
