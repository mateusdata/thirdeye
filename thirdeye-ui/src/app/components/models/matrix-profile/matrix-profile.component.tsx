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
interface MatrixProfilePayload {
    prom_query: string;
    end_time: string;
    query_duration_days: number;
    interval: string;
    m: number;
    std_multiplier: number;
}

export const MatrixProfile: React.FC = () => {
    // Estados tipados com valores padrão
    const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Inputs do formulário com valores padrão
    const [promQuery, setPromQuery] = useState<string>(
        "go_gc_heap_frees_bytes_total"
    );
    const [endTime, setEndTime] = useState<string>(
        new Date().toISOString().slice(0, 16)
    );
    const [queryDurationDays, setQueryDurationDays] = useState<number>(4);
    const [interval, setInterval] = useState<string>("5m");
    const [m, setM] = useState<number>(8);
    const [stdMultiplier, setStdMultiplier] = useState<number>(3.0);

    // Função para buscar os dados do backend para Matrix Profile
    const fetchMatrixProfileData = async (): Promise<void> => {
        // Validação dos inputs (básica)
        if (
            !promQuery ||
            !interval ||
            queryDurationDays < 1 ||
            m < 2 ||
            stdMultiplier <= 0
        ) {
            setError("Preencha todos os campos corretamente!");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const payload: MatrixProfilePayload = {
                prom_query: promQuery,
                end_time: new Date(endTime).toISOString(),
                query_duration_days: queryDurationDays,
                interval: interval,
                m: m,
                std_multiplier: stdMultiplier,
            };

            // Note que ajustamos o tipo para que a resposta seja um array de ChartDataPoint
            const response = await axios.post<ChartDataPoint[]>(
                "http://localhost:8003/matrix-profile",
                payload
            );
            setChartData(response.data);
        } catch (err) {
            setError(
                "Erro ao buscar os dados. Verifique os campos ou o servidor."
            );
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Configuração do gráfico ECharts (mesmo estilo do IsolationForest)
    const option = {
        title: {
            text: "Detecção de Anomalias com Matrix Profile",
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
    };

    return (
        <div
            style={{
                padding: "40px",
                maxWidth: "1200px",
                margin: "0 auto",
                width: "100%",
            }}
        >
            <h1
                style={{
                    textAlign: "center",
                    color: "#0b263f",
                    marginBottom: "30px",
                }}
            >
                Matrix Profile - Detecção de Padrões
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
                            placeholder="Ex: go_gc_heap_frees_bytes_total"
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
                            placeholder="Ex: 5m, 1h, etc."
                        />
                    </label>

                    <label style={{ fontWeight: "bold", color: "#333" }}>
                        Tamanho da Janela (m):
                        <input
                            type="number"
                            min={2}
                            value={m}
                            onChange={(e) => setM(Number(e.target.value))}
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
                        Multiplicador do Desvio Padrão:
                        <input
                            type="number"
                            step={0.1}
                            value={stdMultiplier}
                            onChange={(e) =>
                                setStdMultiplier(Number(e.target.value))
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

                    <button
                        onClick={fetchMatrixProfileData}
                        style={{
                            padding: "10px",
                            backgroundColor: "#0B263F",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontSize: "16px",
                            marginTop: "10px",
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

export default MatrixProfile;
