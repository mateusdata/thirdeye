/*
 * Copyright 2025 StarTree Inc
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
import ReactECharts from "echarts-for-react";
import { FunctionComponent, default as React } from "react";
import { PageV1 } from "../../platform/components";

export const AdminPage: FunctionComponent = () => {
    // Dados fornecidos em JSON
    const jsonData = [
        { time: "2025-03-28 01:47:41", values: 148157192.0 },
        { time: "2025-03-28 01:52:41", values: 236017944.0 },
        { time: "2025-03-28 01:57:41", values: 335405840.0 },
        { time: "2025-03-28 02:02:41", values: 416765376.0 },
        { time: "2025-03-28 02:07:41", values: 486270448.0 },
        { time: "2025-03-28 02:12:41", values: 571106584.0 },
        { time: "2025-03-28 02:17:41", values: 630036528.0 },
        { time: "2025-03-28 02:22:41", values: 712607144.0 },
        { time: "2025-03-28 02:27:41", values: 772602608.0 },
        { time: "2025-03-28 02:32:41", values: 842550728.0 },
        { time: "2025-03-28 02:37:41", values: 929629208.0 },
        { time: "2025-03-28 02:42:41", values: 1002194464.0 },
        { time: "2025-03-28 02:47:41", values: 1081642560.0 },
        { time: "2025-03-28 02:52:41", values: 1142921312.0 },
        { time: "2025-03-28 02:57:41", values: 1215467824.0 },
        { time: "2025-03-28 03:02:41", values: 1295153392.0 },
        { time: "2025-03-28 03:07:41", values: 1371917672.0 },
        { time: "2025-03-28 03:12:41", values: 1446412632.0 },
        { time: "2025-03-28 03:17:41", values: 1529707080.0 },
        { time: "2025-03-28 03:22:41", values: 1607130008.0 },
    ];

    // Configuração do gráfico
    const option = {
        title: {
            text: "Gráfico de Linha com Séries Temporais",
        },
        tooltip: {
            trigger: "axis",
        },
        xAxis: {
            type: "time", // Tipo de eixo "time" para tratar como série temporal
            axisLabel: {
                formatter: (value: string) => {
                    const date = new Date(value);

                    return date.toLocaleString("pt-BR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                    });
                }, // Formatar para o formato dd/MM/yyyy HH:mm
            },
        },
        yAxis: {
            type: "value",
            axisLabel: {
                formatter: (value: number) => `${(value / 1e9).toFixed(2)}B`, // Exibir valores em bilhões com até 2 casas decimais
            },
        },
        series: [
            {
                data: jsonData.map(({ time, values }) => [time, values]), // Transforma o JSON para o formato do gráfico
                type: "line",
                smooth: true, // Suaviza a linha
                lineStyle: {
                    width: 2,
                    color: "#8A05BE", // Cor da linha
                },
                symbol: "circle", // Tipo de símbolo nos pontos
                symbolSize: 6, // Tamanho dos pontos
            },
        ],
    };

    return (
        <PageV1>
            <div
                style={{
                    width: "80%",
                    height: "400px",
                    margin: "0 auto",
                    padding: "20px",
                    background: "#fff",
                    borderRadius: "10px",
                    boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
                }}
            >
                <ReactECharts option={option} />
            </div>
        </PageV1>
    );
};
