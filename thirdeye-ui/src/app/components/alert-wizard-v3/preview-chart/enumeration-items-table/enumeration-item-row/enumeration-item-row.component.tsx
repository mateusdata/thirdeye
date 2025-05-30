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
    Box,
    Button,
    ButtonGroup,
    Card,
    CardContent,
    Grid,
    Typography,
} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import { KeyboardArrowDown, KeyboardArrowUp } from "@material-ui/icons";
import DeleteIcon from "@material-ui/icons/Delete";
import { DateTime } from "luxon";
import React, { FunctionComponent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { SkeletonV1, TooltipV1 } from "../../../../../platform/components";
import { generateNameForDetectionResult } from "../../../../../utils/enumeration-items/enumeration-items.util";
import {
    CHART_SIZE_OPTIONS,
    generateChartOptionsForAlert,
    SMALL_CHART_SIZE,
} from "../../../../rca/anomaly-time-series-card/anomaly-time-series-card.utils";
import { TimeSeriesChart } from "../../../../visualizations/time-series-chart/time-series-chart.component";
import { EnumerationItemRowProps } from "./enumeration-item-row.interfaces";
import { useInView } from "react-intersection-observer";
import { getAlertEvaluation } from "../../../../../rest/alerts/alerts.rest";
import { LoadingErrorStateSwitch } from "../../../../page-states/loading-error-state-switch/loading-error-state-switch.component";
import { NoDataIndicator } from "../../../../no-data-indicator/no-data-indicator.component";
import { cloneDeep } from "lodash";
import { useFetchQuery } from "../../../../../rest/hooks/useFetchQuery";

export const EnumerationItemRow: FunctionComponent<EnumerationItemRowProps> = ({
    detectionEvaluation,
    onDeleteClick,
    timezone,
    hideTime,
    showOnlyActivity,
    hideDelete,
    alert,
    evaluationTimeRange,
    legendsPlacement,
}) => {
    const { ref, inView } = useInView({
        triggerOnce: true,
        delay: 250,
        threshold: 1,
    });
    const { t } = useTranslation();
    const [expandedChartHeight, setExpandedChartHeight] =
        useState(SMALL_CHART_SIZE);
    const nameForDetectionEvaluation =
        generateNameForDetectionResult(detectionEvaluation);
    const [isExpanded, setIsExpanded] = useState(false);

    const [timeSeriesData, setTimeSeriesData] = useState<any>();
    const [timeSeriesExpandedData, setTimeSeriesExpandedData] = useState<any>();

    const alertParams = cloneDeep(alert);
    delete (alertParams as any).id;

    const getEvaluationQuery = useFetchQuery({
        enabled: false,
        queryKey: [
            "evaluation",
            alertParams,
            detectionEvaluation.enumerationItem,
            evaluationTimeRange?.startTime,
            evaluationTimeRange?.endTime,
        ],
        queryFn: () => {
            return getAlertEvaluation(
                {
                    alert: alertParams,
                    start: evaluationTimeRange?.startTime,
                    end: evaluationTimeRange?.endTime,
                },
                undefined,
                detectionEvaluation.enumerationItem
            );
        },
    });

    useEffect(() => {
        if (inView) {
            getEvaluationQuery.refetch();
        }
    }, [inView]);

    useEffect(() => {
        if (!getEvaluationQuery.data) {
            return;
        }

        const tsData = generateChartOptionsForAlert(
            Object.values(getEvaluationQuery.data?.detectionEvaluations)[0],
            showOnlyActivity
                ? []
                : Object.values(
                      getEvaluationQuery.data?.detectionEvaluations
                  )[0].anomalies,
            t,
            undefined,
            timezone,
            hideTime,
            showOnlyActivity,
            false,
            showOnlyActivity
        );

        const tsDataForExpanded = {
            ...tsData,
        };
        tsData.brush = false;
        tsData.zoom = true;
        tsData.legend = false;
        tsData.yAxis = {
            enabled: false,
        };
        tsData.margins = {
            top: 0,
            bottom: 10, // This needs to exist for the x axis
            left: 0,
            right: 0,
        };
        tsData.xAxis = {
            ...tsData.xAxis,
            tickFormatter: (d: string) => {
                return DateTime.fromJSDate(new Date(d), {
                    zone: timezone,
                }).toFormat("MMM dd");
            },
        };
        setTimeSeriesData(tsData);
        setTimeSeriesExpandedData(tsDataForExpanded);
    }, [getEvaluationQuery.data]);

    return (
        <Grid item ref={ref} xs={12}>
            <Card variant="outlined">
                <CardContent>
                    <Grid container alignItems="center">
                        <Grid
                            item
                            {...(isExpanded
                                ? { sm: 10, xs: 12 }
                                : { sm: 4, xs: 12 })}
                        >
                            <Typography variant="subtitle1">
                                {nameForDetectionEvaluation}
                            </Typography>
                        </Grid>
                        {!isExpanded && (
                            <Grid item sm={6} xs={12}>
                                <LoadingErrorStateSwitch
                                    errorState={
                                        <NoDataIndicator>
                                            {t(
                                                "message.experienced-an-issue-fetching-chart-data"
                                            )}
                                        </NoDataIndicator>
                                    }
                                    isError={getEvaluationQuery.isError}
                                    isLoading={getEvaluationQuery.isFetching}
                                    loadingState={
                                        <SkeletonV1
                                            animation="pulse"
                                            height={100}
                                            variant="rect"
                                            width={400}
                                        />
                                    }
                                >
                                    {!!timeSeriesData && (
                                        <TimeSeriesChart
                                            height={100}
                                            {...timeSeriesData}
                                        />
                                    )}
                                </LoadingErrorStateSwitch>
                            </Grid>
                        )}
                        <Grid item sm={1} xs={6}>
                            {!hideDelete && (
                                <Box textAlign="right">
                                    <TooltipV1
                                        delay={0}
                                        title={
                                            t(
                                                "message.remove-item-from-configuration"
                                            ) as string
                                        }
                                    >
                                        <IconButton
                                            color="primary"
                                            size="small"
                                            onClick={onDeleteClick}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </TooltipV1>
                                </Box>
                            )}
                        </Grid>
                        <Grid item sm={1} xs={6}>
                            <Box textAlign="right">
                                <IconButton
                                    color="primary"
                                    size="small"
                                    onClick={() => setIsExpanded(!isExpanded)}
                                >
                                    {isExpanded ? (
                                        <KeyboardArrowUp />
                                    ) : (
                                        <KeyboardArrowDown />
                                    )}
                                </IconButton>
                            </Box>
                        </Grid>
                    </Grid>
                </CardContent>
                {isExpanded && (
                    <CardContent>
                        <Grid
                            container
                            alignItems="center"
                            justifyContent="flex-end"
                        >
                            <Grid item>{t("label.chart-height")}:</Grid>
                            <Grid item>
                                <Box textAlign="right">
                                    <ButtonGroup
                                        color="secondary"
                                        variant="outlined"
                                    >
                                        {CHART_SIZE_OPTIONS.map(
                                            (sizeOption) => (
                                                <Button
                                                    color="primary"
                                                    disabled={
                                                        expandedChartHeight ===
                                                        sizeOption[1]
                                                    }
                                                    key={sizeOption[0]}
                                                    onClick={() =>
                                                        setExpandedChartHeight(
                                                            sizeOption[1] as number
                                                        )
                                                    }
                                                >
                                                    {sizeOption[0]}
                                                </Button>
                                            )
                                        )}
                                    </ButtonGroup>
                                </Box>
                            </Grid>
                        </Grid>

                        {timeSeriesExpandedData && (
                            <TimeSeriesChart
                                height={expandedChartHeight}
                                legendsPlacement={legendsPlacement}
                                {...timeSeriesExpandedData}
                            />
                        )}
                    </CardContent>
                )}
            </Card>
        </Grid>
    );
};
