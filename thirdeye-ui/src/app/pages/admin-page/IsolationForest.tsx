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
import React, { useState } from "react";
import axios from "axios";
import ReactECharts from "echarts-for-react";

// Tipagem para os dados retornados pelo backend
interface ChartDataPoint {
    time: string;
    values: number;
    anomaly: boolean;
}

// Tipagem para o payload da requisição
interface IsolationForestPayload {
    prom_query: string;
    end_time: string;
    query_duration_days: number;
    interval: string;
    days_train: number;
    contamination_level: number;
}

export const IsolationForest: React.FC = () => {
    // Estados tipados
    const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Inputs do formulário
    const [promQuery, setPromQuery] = useState<string>(
        "go_gc_heap_frees_bytes_total"
    );
    const [endTime, setEndTime] = useState<string>(
        new Date().toISOString().slice(0, 16)
    );
    const [queryDurationDays, setQueryDurationDays] = useState<number>(1);
    const [interval, setInterval] = useState<string>("5m");
    const [daysTrain, setDaysTrain] = useState<number>(1);
    const [contaminationLevel, setContaminationLevel] = useState<number>(0.01);

    const fetchIsolationForestData = async (): Promise<void> => {
        // Validação dos inputs
        if (
            !promQuery ||
            !interval ||
            queryDurationDays < 1 ||
            daysTrain < 1 ||
            daysTrain > queryDurationDays
        ) {
            //setError("Preencha todos os campos corretamente!");
            setError(
                "A duração da consulta deve ser maior que os dias de treinamento para que haja dados para predição."
            );
            return;
        }

        if (queryDurationDays === daysTrain) {
            // setError("A duração da consulta deve ser maior que os dias de treinamento para que haja dados para predição.");
            setError(
                "A duração da consulta deve ser maior que os dias de treinamento para que haja dados para predição."
            );
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const payload: IsolationForestPayload = {
                prom_query: promQuery,
                end_time: new Date(endTime).toISOString(),
                query_duration_days: queryDurationDays,
                interval: interval,
                days_train: daysTrain,
                contamination_level: contaminationLevel,
            };

            const response = await axios.post<{ data: ChartDataPoint[] }>(
                "http://localhost:8003/isolation-forest",
                payload
            );
            setChartData(response.data.data);
        } catch (err) {
            setError(
                "Erro ao buscar os dados. Verifique os campos ou o servidor."
            );
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Configuração do gráfico ECharts
    const option = {
        title: {
            text: "Detecção de Anomalias com Isolation Forest",
            left: "center",
            textStyle: { color: "#333" },
        },
        tooltip: { trigger: "axis" },
        xAxis: {
            type: "time",
            axisLabel: {
                formatter: (value: string): string => {
                    const date = new Date(value);
                    return date.toLocaleString("pt-BR", {
                        day: "2-digit",
                        month: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                    });
                },
            },
        },
        yAxis: {
            type: "value",
            axisLabel: {
                formatter: (value: number): string =>
                    `${(value / 1e9).toFixed(2)}B`,
            },
        },
        series: [
            {
                name: "Dados",
                type: "line",
                data: chartData.map((item) => [item.time, item.values]),
                lineStyle: { color: "#8A05BE", width: 2 },
                smooth: true,
            },
            {
                name: "Anomalias",
                type: "scatter",
                data: chartData
                    .filter((item) => item.anomaly)
                    .map((item) => [item.time, item.values]),
                symbolSize: 10,
                itemStyle: { color: "red" },
            },
        ],
        // Destaca visualmente o período de treinamento
        graphic:
            chartData.length > 0
                ? [
                      {
                          type: "rect",
                          shape: {
                              x: 0,
                              y: 0,
                              width: `${
                                  (daysTrain / queryDurationDays) * 100
                              }%`,
                              height: "100%",
                          },
                          style: { fill: "rgba(128, 128, 128, 0.2)" },
                          z: -1,
                      },
                  ]
                : [],
    };

    return (
        <div style={{ padding: "40px", maxWidth: "1200px", margin: "0 auto" }}>
            <h1
                style={{
                    textAlign: "center",
                    color: "#4CAF50",
                    marginBottom: "30px",
                }}
            >
                Isolation Forest - Gráfico de Anomalias
            </h1>

            {/* Formulário */}
            <div
                style={{
                    background: "#fff",
                    padding: "20px",
                    borderRadius: "8px",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                }}
            >
                <div style={{ display: "grid", gap: "15px" }}>
                    <label style={{ fontWeight: "bold", color: "#333" }}>
                        Métrica (Prometheus Query):
                        <input
                            type="text"
                            value={promQuery}
                            onChange={(e) => setPromQuery(e.target.value)}
                            style={{
                                width: "100%",
                                padding: "8px",
                                border: "1px solid #ddd",
                                borderRadius: "4px",
                                marginTop: "5px",
                            }}
                        />
                    </label>

                    <label style={{ fontWeight: "bold", color: "#333" }}>
                        Data de Fim:
                        <input
                            type="datetime-local"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            style={{
                                width: "100%",
                                padding: "8px",
                                border: "1px solid #ddd",
                                borderRadius: "4px",
                                marginTop: "5px",
                            }}
                        />
                    </label>

                    <label style={{ fontWeight: "bold", color: "#333" }}>
                        Duração da Consulta (dias):
                        <input
                            type="number"
                            min={1}
                            value={queryDurationDays}
                            onChange={(e) =>
                                setQueryDurationDays(Number(e.target.value))
                            }
                            style={{
                                width: "100%",
                                padding: "8px",
                                border: "1px solid #ddd",
                                borderRadius: "4px",
                                marginTop: "5px",
                            }}
                        />
                    </label>

                    <label style={{ fontWeight: "bold", color: "#333" }}>
                        Intervalo:
                        <input
                            type="text"
                            value={interval}
                            onChange={(e) => setInterval(e.target.value)}
                            style={{
                                width: "100%",
                                padding: "8px",
                                border: "1px solid #ddd",
                                borderRadius: "4px",
                                marginTop: "5px",
                            }}
                        />
                    </label>

                    <label style={{ fontWeight: "bold", color: "#333" }}>
                        Dias de Treinamento (1 a {queryDurationDays}):
                        <input
                            type="number"
                            min={1}
                            max={queryDurationDays}
                            value={daysTrain}
                            onChange={(e) =>
                                setDaysTrain(Number(e.target.value))
                            }
                            style={{
                                width: "100%",
                                padding: "8px",
                                border: "1px solid #ddd",
                                borderRadius: "4px",
                                marginTop: "5px",
                            }}
                        />
                    </label>

                    <label style={{ fontWeight: "bold", color: "#333" }}>
                        Nível de Contaminação (0.001 a 0.1):
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                marginTop: "5px",
                            }}
                        >
                            <input
                                type="range"
                                min="0.001"
                                max="0.1"
                                step="0.001"
                                value={contaminationLevel}
                                onChange={(e) =>
                                    setContaminationLevel(
                                        Number(e.target.value)
                                    )
                                }
                                style={{ flex: 1 }}
                            />
                            <span
                                style={{ marginLeft: "10px", minWidth: "50px" }}
                            >
                                {contaminationLevel.toFixed(3)}
                            </span>
                        </div>
                    </label>

                    <button
                        onClick={fetchIsolationForestData}
                        style={{
                            padding: "10px",
                            backgroundColor: "#4CAF50",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontSize: "16px",
                        }}
                    >
                        Buscar Dados
                    </button>
                </div>
            </div>

            {/* Mensagem de erro ou loading */}
            {error && (
                <div
                    style={{
                        color: "red",
                        textAlign: "center",
                        margin: "20px 0",
                    }}
                >
                    {error}
                </div>
            )}
            {loading && (
                <div style={{ textAlign: "center", margin: "20px 0" }}>
                    Carregando...
                </div>
            )}

            {/* Gráfico */}
            {!loading && chartData.length > 0 && (
                <div
                    style={{
                        marginTop: "30px",
                        background: "#fff",
                        borderRadius: "8px",
                        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                    }}
                >
                    <ReactECharts option={option} style={{ height: "500px" }} />
                </div>
            )}
        </div>
    );
};
