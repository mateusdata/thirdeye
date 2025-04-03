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
import axios from "axios";
import ReactECharts from "echarts-for-react";
import React, { useState } from "react";
import { PageV1 } from "../../platform/components";

export const MatrixProfile: React.FunctionComponent = () => {
    const [chartData, setChartData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [promQuery, setPromQuery] = useState("go_gc_heap_frees_bytes_total");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [interval, setInterval] = useState("5m");
    const [subsequenceLength, setSubsequenceLength] = useState(6);
    const [stdMultiplier, setStdMultiplier] = useState(3);

    const fetchMatrixProfileData = async (): Promise<void> => {
        if (!promQuery || !startTime || !endTime || !interval) {
            setError("Por favor, preencha todos os campos obrigatórios!");

            return;
        }

        setLoading(true);
        setError(null);

        try {
            const payload = {
                prom_query: promQuery,
                start_time: new Date(startTime).toISOString(),
                end_time: new Date(endTime).toISOString(),
                interval: interval,
                m: subsequenceLength,
                std_multiplier: stdMultiplier,
            };

            const response = await axios.post(
                "http://localhost:8000/matrix-profile/",
                payload
            );

            setChartData(response.data);
        } catch (err) {
            setError(
                "Erro ao buscar os dados da API. Verifique os campos e tente novamente."
            );
        } finally {
            setLoading(false);
        }
    };

    const option = {
        title: {
            text: "Matrix Profile: Detecção de Anomalias",
        },
        tooltip: {
            trigger: "axis",
        },
        xAxis: {
            type: "time",
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
                },
            },
        },
        yAxis: {
            type: "value",
            axisLabel: {
                formatter: (value: number) => `${(value / 1e9).toFixed(2)}B`,
            },
        },
        series: [
            {
                name: "Matrix Profile",
                type: "line",
                data: chartData.map(({ time, matrix_profile }) => [
                    time,
                    matrix_profile,
                ]),
                lineStyle: {
                    width: 2,
                    color: "#8A05BE",
                },
                smooth: true,
            },
            {
                name: "Anomalies",
                type: "scatter",
                data: chartData
                    .filter(({ anomaly }) => anomaly)
                    .map(({ time, matrix_profile }) => [time, matrix_profile]),
                symbolSize: 8,
                itemStyle: {
                    color: "red",
                },
            },
        ],
    };

    return (
        <PageV1>
            <div style={{ padding: "60px" }}>
                <h2
                    style={{
                        color: "#4CAF50",
                        textAlign: "center",
                        marginBottom: "20px",
                    }}
                >
                    Matrix Profile - Gráfico de Anomalias
                </h2>

                <div
                    style={{
                        background: "#fff",
                        padding: "20px",
                        borderRadius: "10px",
                        boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
                        marginBottom: "20px",
                    }}
                >
                    {/* Campo para Prometheus Query */}
                    <label
                        style={{
                            display: "block",
                            marginBottom: "10px",
                            fontWeight: "bold",
                            color: "#333",
                        }}
                    >
                        Métrica (Prometheus Query):
                        <input
                            style={{
                                display: "block",
                                width: "100%",
                                padding: "10px",
                                border: "1px solid #ccc",
                                borderRadius: "5px",
                                marginTop: "5px",
                            }}
                            type="text"
                            value={promQuery}
                            onChange={(e) => setPromQuery(e.target.value)}
                        />
                    </label>

                    {/* Campo para Data de Início */}
                    <label
                        style={{
                            display: "block",
                            marginBottom: "10px",
                            fontWeight: "bold",
                            color: "#333",
                        }}
                    >
                        Data de Início:
                        <input
                            style={{
                                display: "block",
                                width: "100%",
                                padding: "10px",
                                border: "1px solid #ccc",
                                borderRadius: "5px",
                                marginTop: "5px",
                            }}
                            type="datetime-local"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                        />
                    </label>

                    {/* Campo para Data de Fim */}
                    <label
                        style={{
                            display: "block",
                            marginBottom: "10px",
                            fontWeight: "bold",
                            color: "#333",
                        }}
                    >
                        Data de Fim:
                        <input
                            style={{
                                display: "block",
                                width: "100%",
                                padding: "10px",
                                border: "1px solid #ccc",
                                borderRadius: "5px",
                                marginTop: "5px",
                            }}
                            type="datetime-local"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                        />
                    </label>

                    {/* Campo para Intervalo */}
                    <label
                        style={{
                            display: "block",
                            marginBottom: "10px",
                            fontWeight: "bold",
                            color: "#333",
                        }}
                    >
                        Intervalo:
                        <input
                            style={{
                                display: "block",
                                width: "100%",
                                padding: "10px",
                                border: "1px solid #ccc",
                                borderRadius: "5px",
                                marginTop: "5px",
                            }}
                            type="text"
                            value={interval}
                            onChange={(e) => setInterval(e.target.value)}
                        />
                    </label>

                    {/* Campo para Tamanho da Subsequência (m) */}
                    <label
                        style={{
                            display: "block",
                            marginBottom: "10px",
                            fontWeight: "bold",
                            color: "#333",
                        }}
                    >
                        Tamanho da Subsequência (m):
                        <input
                            style={{
                                display: "block",
                                width: "100%",
                                padding: "10px",
                                border: "1px solid #ccc",
                                borderRadius: "5px",
                                marginTop: "5px",
                            }}
                            type="number"
                            value={subsequenceLength}
                            onChange={(e) =>
                                setSubsequenceLength(Number(e.target.value))
                            }
                        />
                    </label>

                    {/* Campo para Multiplicador do Desvio Padrão */}
                    <label
                        style={{
                            display: "block",
                            marginBottom: "10px",
                            fontWeight: "bold",
                            color: "#333",
                        }}
                    >
                        Multiplicador do Desvio Padrão:
                        <input
                            style={{
                                display: "block",
                                width: "100%",
                                padding: "10px",
                                border: "1px solid #ccc",
                                borderRadius: "5px",
                                marginTop: "5px",
                            }}
                            type="number"
                            value={stdMultiplier}
                            onChange={(e) =>
                                setStdMultiplier(Number(e.target.value))
                            }
                        />
                    </label>

                    {/* Botão para buscar os dados */}
                    <button
                        style={{
                            padding: "10px 20px",
                            backgroundColor: "#4CAF50",
                            color: "white",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                            width: "100%",
                            fontSize: "16px",
                            marginTop: "10px",
                        }}
                        onClick={fetchMatrixProfileData}
                    >
                        Buscar Dados
                    </button>
                </div>

                {/* Mensagens de erro */}
                {error && (
                    <div
                        style={{
                            color: "red",
                            marginBottom: "20px",
                            textAlign: "center",
                        }}
                    >
                        {error}
                    </div>
                )}

                {/* Gráfico */}
                {loading ? (
                    <p style={{ textAlign: "center" }}>Carregando...</p>
                ) : (
                    <div
                        style={{
                            width: "100%",
                            height: "400px",
                            margin: "0 auto",
                            background: "#fff",
                            borderRadius: "10px",
                            boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
                        }}
                    >
                        {chartData.length > 0 ? (
                            <ReactECharts
                                option={option}
                                style={{ height: "100%", width: "100%" }}
                            />
                        ) : (
                            <p style={{ textAlign: "center", padding: "20px" }}>
                                Nenhum dado disponível. Preencha os campos e
                                clique em &quot;Buscar Dados&quot;.
                            </p>
                        )}
                    </div>
                )}
            </div>
        </PageV1>
    );
};
