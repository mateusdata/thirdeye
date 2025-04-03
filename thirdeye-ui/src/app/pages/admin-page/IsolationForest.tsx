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

export const IsolationForest: React.FunctionComponent = () => {
    // Estado para armazenar os dados retornados pela API
    const [chartData, setChartData] = useState([]); // Dados para o gráfico
    const [loading, setLoading] = useState(false); // Status de carregamento
    const [error, setError] = useState<string | null>(null); // Mensagens de erro

    // Estado para os valores dinâmicos do formulário
    const [promQuery, setPromQuery] = useState("go_gc_heap_frees_bytes_total"); // Métrica padrão
    const [startTime, setStartTime] = useState(""); // Data de início
    const [endTime, setEndTime] = useState(""); // Data de fim
    const [interval, setInterval] = useState("5m"); // Intervalo padrão

    // Função para buscar os dados da API
    const fetchIsolationForestData = async (): Promise<void> => {
        // Validação dos campos
        if (!promQuery || !startTime || !endTime || !interval) {
            setError("Por favor, preencha todos os campos obrigatórios!");

            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Configura o payload com os valores fornecidos
            const payload = {
                prom_query: promQuery,
                start_time: new Date(startTime).toISOString(),
                end_time: new Date(endTime).toISOString(),
                interval: interval,
            };

            // Faz a requisição para a API
            const response = await axios.post(
                "http://localhost:8000/isolation-forest/",
                payload
            );

            // Atualiza os dados do gráfico
            setChartData(response.data);
        } catch (err) {
            setError(
                "Erro ao buscar os dados da API. Verifique os campos e tente novamente."
            );
        } finally {
            setLoading(false);
        }
    };

    // Configuração do gráfico
    const option = {
        title: {
            text: "Isolation Forest: Detecção de Anomalias",
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
                formatter: (value: number) => `${(value / 1e9).toFixed(2)}B`, // Valores em bilhões
            },
        },
        series: [
            {
                name: "Data",
                type: "line",
                data: chartData.map(({ time, values }) => [time, values]),
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
                    .map(({ time, values }) => [time, values]),
                symbolSize: 8,
                itemStyle: {
                    color: "red",
                },
            },
        ],
    };

    // Renderização do componente
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
                    Isolation Forest - Gráfico de Anomalias
                    <div className="bg-red-600 min-h-screen">
                        <p>sadas</p>
                    </div>
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
                        onClick={fetchIsolationForestData}
                    >
                        Buscar Dados
                    </button>
                </div>

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
                        <ReactECharts option={option} />
                    </div>
                )}
            </div>
        </PageV1>
    );
};
