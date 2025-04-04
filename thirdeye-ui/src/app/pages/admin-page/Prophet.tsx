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
import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactECharts from "echarts-for-react";

// Tipagem para os dados retornados pelo backend
interface ChartDataPoint {
    time: string;
    values: number;
}

// Tipagem para o payload da requisição
interface ProphetPayload {
    prom_query: string;
    end_time: string;
    query_duration_days: number;
    interval: string;
    days_train: number;
}

export const Prophet: React.FC = () => {
    // Estados tipados
    const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Inputs do formulário
    const [promQuery, setPromQuery] = useState<string>(
        "go_gc_duration_seconds"
    );
    const [endTime, setEndTime] = useState<string>(
        new Date().toISOString().slice(0, 16)
    );
    const [queryDurationDays, setQueryDurationDays] = useState<number>(7);
    const [interval, setInterval] = useState<string>("5m");
    const [daysTrain, setDaysTrain] = useState<number>(3);

    const fetchProphetData = async (signal: AbortSignal): Promise<void> => {
        if (
            !promQuery ||
            !interval ||
            queryDurationDays < 1 ||
            daysTrain < 1 ||
            daysTrain >= queryDurationDays
        ) {
            setError(
                "A duração da consulta deve ser maior que os dias de treinamento."
            );
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const payload: ProphetPayload = {
                prom_query: promQuery,
                end_time: new Date(endTime).toISOString(),
                query_duration_days: queryDurationDays,
                interval: interval,
                days_train: daysTrain,
            };

            const response = await axios.post<{ data: ChartDataPoint[] }>(
                "http://localhost:8003/prophet",
                payload,
                { signal }
            );

            // Só atualiza o estado se o componente ainda estiver montado
            if (!signal.aborted) {
                setChartData(
                    Array.isArray(response.data.data) ? response.data.data : []
                );
            }
        } catch (err) {
            if (!signal.aborted) {
                setError(
                    "Erro ao buscar os dados. Verifique os campos ou o servidor."
                );
                console.error(err);
            }
        } finally {
            if (!signal.aborted) {
                setLoading(false);
            }
        }
    };

    // useEffect para gerenciar o ciclo de vida do componente
    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        // Função para buscar dados (você pode chamá-la manualmente no botão)
        return () => {
            controller.abort(); // Cancela a requisição ao desmontar o componente
        };
    }, []); // Dependências vazias para rodar apenas na montagem/desmontagem

    // Configuração do gráfico ECharts
    const option = {
        title: {
            text: "Previsão de Séries Temporais com Prophet",
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
                name: "Previsão",
                type: "line",
                // Garante que chartData seja um array antes de mapear
                data: Array.isArray(chartData)
                    ? chartData.map((item) => [item.time, item.values])
                    : [],
                lineStyle: { color: "#4CAF50", width: 2 },
                smooth: true,
            },
        ],
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
                Prophet - Previsão de Séries Temporais
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
                        Dias de Treinamento (1 a {queryDurationDays - 1}):
                        <input
                            type="number"
                            min={1}
                            max={queryDurationDays - 1}
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

                    <button
                        onClick={() =>
                            fetchProphetData(new AbortController().signal)
                        }
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
            {!loading && Array.isArray(chartData) && chartData.length > 0 && (
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
