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

import { Icon } from "@iconify/react";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Button,
    Drawer,
    Typography,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { isEmpty } from "lodash";
import React, { FunctionComponent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    PropertyConfigValueTypes,
    TemplatePropertiesObject,
} from "../../rest/dto/alert.interfaces";
import {
    ALERT_PROPERTIES_DEFAULT_ORDER,
    ALERT_PROPERTIES_DEFAULT_STEP,
    extendablePropertyStepNameMap,
} from "../../utils/alerts/alerts.util";
import { FormComponentForTemplateField } from "../alert-wizard-v2/alert-template/alert-template-form-field/form-component-for-template-field/form-component-for-template-field.component";
import { LabelForTemplateFieldV2 } from "../alert-wizard-v2/alert-template/alert-template-form-field/label-for-template-field-v2/label-for-template-field-v2.component";
import { PropertyRenderConfig } from "../alert-wizard-v2/alert-template/alert-template-properties-builder/alert-template-properties-builder.interfaces";
import { AdditonalFiltersDrawerProps } from "./additional-filters-drawer.interfaces";
import { useAdditonalFiltersDrawerStyles } from "./additional-filters-drawer.styles";

// import { uniq } from "lodash";

/**
 * Convenience wrapper on top of HelpDrawerCoreV1 so consumers do not have
 * to maintain isOpen state
 */
export const AdditonalFiltersDrawer: FunctionComponent<AdditonalFiltersDrawerProps> =
    ({
        defaultValues,
        onApply,
        isOpen,
        onClose,
        availableConfigurations,
        emptyMessage,
    }) => {
        // const uniqueSections = uniq(availableConfigurations.map(option => option.section))
        const classes = useAdditonalFiltersDrawerStyles();
        const { t } = useTranslation();
        const [localCopyOfProperties, setLocalCopyOfProperties] =
            useState<TemplatePropertiesObject>({
                ...defaultValues,
            });

        useEffect(() => {
            setLocalCopyOfProperties({ ...defaultValues });
        }, [defaultValues]);

        const handleOnChange = (
            key: string,
            value: PropertyConfigValueTypes
        ): void => {
            setLocalCopyOfProperties((prev) => ({
                ...prev,
                [key]: value,
            }));
        };

        const onSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
            e.preventDefault();
            onApply(localCopyOfProperties);
        };

        const handleClose = (): void => {
            setLocalCopyOfProperties({ ...defaultValues });
            onClose();
        };

        const orderedGroupedProperties: Record<
            string,
            Record<string, PropertyRenderConfig[]>
        > = {};
        /* The idea is to display properties in a specifc order. We have that order pre-defined.
            In case there is a property that belongs to a step that is not in pre-defined order,
            we push it at the second last place, just before the properties of "OTHER" step
        */
        const keysPresent = Object.keys(availableConfigurations);

        ALERT_PROPERTIES_DEFAULT_ORDER.forEach((alertProperty) => {
            if (alertProperty !== ALERT_PROPERTIES_DEFAULT_STEP.STEP) {
                if (availableConfigurations[alertProperty]) {
                    orderedGroupedProperties[alertProperty] =
                        availableConfigurations[alertProperty];
                }
            }
        });
        const keysNotInDefaultOrder = keysPresent.filter(
            (key) => !ALERT_PROPERTIES_DEFAULT_ORDER.includes(key)
        );
        if (!isEmpty(keysNotInDefaultOrder)) {
            keysNotInDefaultOrder.forEach((key) => {
                orderedGroupedProperties[key] = availableConfigurations[key];
            });
        }
        if (availableConfigurations[ALERT_PROPERTIES_DEFAULT_STEP.STEP]) {
            orderedGroupedProperties[ALERT_PROPERTIES_DEFAULT_STEP.STEP] =
                availableConfigurations[ALERT_PROPERTIES_DEFAULT_STEP.STEP];
        }

        return (
            <Drawer
                PaperProps={{
                    className: classes.drawerPaper,
                }}
                anchor="right"
                open={isOpen}
                onClose={handleClose}
            >
                <form onSubmit={onSubmit}>
                    <Box
                        alignItems="center"
                        className={classes.header}
                        display="flex"
                        justifyContent="space-between"
                    >
                        <Typography variant="h6">
                            {t("label.advanced-options")}
                        </Typography>
                        <Icon
                            cursor="pointer"
                            fontSize={24}
                            icon="ic:round-close"
                            onClick={handleClose}
                        />
                    </Box>
                    {emptyMessage ? (
                        emptyMessage
                    ) : (
                        <>
                            <Box className={classes.content} flex={1}>
                                <Box>
                                    {Object.keys(orderedGroupedProperties).map(
                                        (config) => {
                                            const subStepMap =
                                                availableConfigurations[config];

                                            return (
                                                <Box
                                                    className={
                                                        classes.configItem
                                                    }
                                                    key={
                                                        extendablePropertyStepNameMap[
                                                            config
                                                        ]
                                                    }
                                                    mb={3}
                                                    width="100%"
                                                >
                                                    <Accordion>
                                                        <AccordionSummary
                                                            aria-controls={`${extendablePropertyStepNameMap[config]}-content`}
                                                            expandIcon={
                                                                <ExpandMoreIcon />
                                                            }
                                                            id={`${extendablePropertyStepNameMap[config]}-header`}
                                                        >
                                                            <Typography
                                                                color="inherit"
                                                                variant="h6"
                                                            >
                                                                {
                                                                    extendablePropertyStepNameMap[
                                                                        config
                                                                    ]
                                                                }
                                                            </Typography>
                                                        </AccordionSummary>
                                                        <AccordionDetails>
                                                            <Box
                                                                className={
                                                                    classes.configItemFields
                                                                }
                                                            >
                                                                {subStepMap[
                                                                    ALERT_PROPERTIES_DEFAULT_STEP
                                                                        .SUBSTEP
                                                                ] &&
                                                                    subStepMap[
                                                                        ALERT_PROPERTIES_DEFAULT_STEP
                                                                            .SUBSTEP
                                                                    ].map(
                                                                        (
                                                                            step
                                                                        ) => (
                                                                            <Box
                                                                                key={
                                                                                    step
                                                                                        .metadata
                                                                                        .name
                                                                                }
                                                                            >
                                                                                <LabelForTemplateFieldV2
                                                                                    className={
                                                                                        classes.formLabel
                                                                                    }
                                                                                    name={
                                                                                        step
                                                                                            .metadata
                                                                                            .name
                                                                                    }
                                                                                    tooltipText={
                                                                                        step
                                                                                            .metadata
                                                                                            .description
                                                                                    }
                                                                                />
                                                                                <FormComponentForTemplateField
                                                                                    propertyKey={
                                                                                        step
                                                                                            .metadata
                                                                                            .name
                                                                                    }
                                                                                    templateFieldProperty={
                                                                                        step.metadata
                                                                                    }
                                                                                    value={
                                                                                        localCopyOfProperties[
                                                                                            step
                                                                                                .metadata
                                                                                                .name
                                                                                        ] ||
                                                                                        step.value
                                                                                    }
                                                                                    onChange={(
                                                                                        newValue
                                                                                    ) => {
                                                                                        handleOnChange(
                                                                                            step
                                                                                                .metadata
                                                                                                .name,
                                                                                            newValue
                                                                                        );
                                                                                    }}
                                                                                />
                                                                            </Box>
                                                                        )
                                                                    )}
                                                                {Object.keys(
                                                                    subStepMap
                                                                )
                                                                    .filter(
                                                                        (
                                                                            subStep
                                                                        ) =>
                                                                            subStep !==
                                                                            ALERT_PROPERTIES_DEFAULT_STEP.SUBSTEP
                                                                    )
                                                                    .filter(
                                                                        (cs) =>
                                                                            subStepMap[
                                                                                cs
                                                                            ]
                                                                                .length >
                                                                            0
                                                                    )
                                                                    .map(
                                                                        (
                                                                            currentSubStep
                                                                        ) => (
                                                                            <Box
                                                                                key={
                                                                                    currentSubStep
                                                                                }
                                                                                pb={
                                                                                    3
                                                                                }
                                                                            >
                                                                                <Typography variant="h6">
                                                                                    {
                                                                                        currentSubStep
                                                                                    }
                                                                                </Typography>
                                                                                {subStepMap[
                                                                                    currentSubStep
                                                                                ].map(
                                                                                    (
                                                                                        step
                                                                                    ) => (
                                                                                        <Box
                                                                                            key={
                                                                                                step
                                                                                                    .metadata
                                                                                                    .name
                                                                                            }
                                                                                        >
                                                                                            <LabelForTemplateFieldV2
                                                                                                className={
                                                                                                    classes.formLabel
                                                                                                }
                                                                                                name={
                                                                                                    step
                                                                                                        .metadata
                                                                                                        .name
                                                                                                }
                                                                                                tooltipText={
                                                                                                    step
                                                                                                        .metadata
                                                                                                        .description
                                                                                                }
                                                                                            />
                                                                                            <FormComponentForTemplateField
                                                                                                propertyKey={
                                                                                                    step
                                                                                                        .metadata
                                                                                                        .name
                                                                                                }
                                                                                                templateFieldProperty={
                                                                                                    step.metadata
                                                                                                }
                                                                                                value={
                                                                                                    localCopyOfProperties[
                                                                                                        step
                                                                                                            .metadata
                                                                                                            .name
                                                                                                    ] ||
                                                                                                    step.value
                                                                                                }
                                                                                                onChange={(
                                                                                                    newValue
                                                                                                ) => {
                                                                                                    handleOnChange(
                                                                                                        step
                                                                                                            .metadata
                                                                                                            .name,
                                                                                                        newValue
                                                                                                    );
                                                                                                }}
                                                                                            />
                                                                                        </Box>
                                                                                    )
                                                                                )}
                                                                            </Box>
                                                                        )
                                                                    )}
                                                            </Box>
                                                        </AccordionDetails>
                                                    </Accordion>
                                                </Box>
                                            );
                                        }
                                    )}
                                </Box>
                            </Box>
                            <Box
                                className={classes.footer}
                                display="flex"
                                justifyContent="space-between"
                            >
                                <Button
                                    className={classes.actionSecondary}
                                    size="medium"
                                    variant="contained"
                                    onClick={handleClose}
                                >
                                    {t("label.close")}
                                </Button>
                                <Button
                                    className={classes.actionPrimary}
                                    color="primary"
                                    size="medium"
                                    type="submit"
                                    variant="contained"
                                >
                                    {t("label.apply-filter")}
                                </Button>
                            </Box>
                        </>
                    )}
                </form>
            </Drawer>
        );
    };
