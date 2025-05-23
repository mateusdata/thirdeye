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
import { useHTTPAction } from "../create-rest-action";
import { Dataset, DemoDataset } from "../dto/dataset.interfaces";
import { GetDataset, GetDatasets, GetDemoDatasets } from "./dataset.interfaces";
import {
    getAllDatasets,
    getDataset as getDatasetREST,
    getDemoDatasets as getDemoDatasetsREST,
} from "./datasets.rest";

export const useGetDataset = (): GetDataset => {
    const { data, makeRequest, status, errorMessages, resetData } =
        useHTTPAction<Dataset>(getDatasetREST);

    const getDataset = (id: number): Promise<Dataset | undefined> => {
        return makeRequest(id);
    };

    return { dataset: data, getDataset, status, errorMessages, resetData };
};

export const useGetDatasets = (): GetDatasets => {
    const { data, makeRequest, status, errorMessages, resetData } =
        useHTTPAction<Dataset[]>(getAllDatasets);

    const getDatasets = (): Promise<Dataset[] | undefined> => {
        return makeRequest();
    };

    return { datasets: data, getDatasets, status, errorMessages, resetData };
};

export const useGetDemoDatasets = (): GetDemoDatasets => {
    const { data, makeRequest, status, errorMessages, resetData } =
        useHTTPAction<DemoDataset[]>(getDemoDatasetsREST);

    const getDemoDatasets = (
        id: number
    ): Promise<DemoDataset[] | undefined> => {
        return makeRequest(id);
    };

    return {
        datasets: data,
        getDemoDatasets,
        status,
        errorMessages,
        resetData,
    };
};
