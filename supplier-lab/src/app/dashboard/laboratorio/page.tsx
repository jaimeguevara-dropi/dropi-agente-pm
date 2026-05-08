"use client";

import { useState } from "react";
import { Beaker, Bot, Play, Settings2, FileText, CheckCircle2, XCircle, AlertTriangle, ChevronRight, Activity, Users, BarChart3 } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { FunnelChart } from "@/components/FunnelChart";

type TesterProfile = "novato_offline" | "experto_impaciente";
type Variant = "a_tabs" | "b_wizard";
type Engine = "determinist" | "llm";

interface LogEntry {
  id: string;
  time: string;
  type: "thought" | "action" | "error" | "success";
  text: string;
}
interface FunnelResult {
  variant_name: string;
  total_users_started: number;
  step_bodega_started: number;
  step_bodega_completed: number;
  step_product_started: number;
  step_product_completed: number;
}

export default function LaboratorioPage() {
  const [viewMode, setViewMode] = useState<"micro" | "macro">("micro");
  
  // Estados Modo Micro
  const [profile, setProfile] = useState<TesterProfile>("novato_offline");
  const [variant, setVariant] = useState<Variant>("a_tabs");
  const [engine, setEngine] = useState<Engine>("determinist");
  
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [result, setResult] = useState<"pending" | "success" | "dropoff">("pending");

  // Estados Modo Macro
  const [bulkUsers, setBulkUsers] = useState<number>(2212);
  const [isBulkRunning, setIsBulkRunning] = useState(false);
  const [bulkResults, setBulkResults] = useState<(FunnelResult & { id: number })[]>([]);

  const handleRunSimulation = async () => {
    trackEvent('simulation_started', { profile, variant, engine });
    setIsRunning(true);
    setResult("pending");
    setLogs([]);

    // Añadir log inicial
    addLog("action", `Iniciando simulación con perfil: ${profile === 'novato_offline' ? 'Novato Offline' : 'Experto Impaciente'}`);
    addLog("thought", "Analizando el entorno y la tarea: Crear un producto.");

    if (engine === "determinist") {
      runDeterministicSimulation();
    } else {
      // Simular llamada a API LLM por ahora
      runLLMSimulationMock();
    }
  };

  const addLog = (type: LogEntry["type"], text: string) => {
    setLogs(prev => [...prev, {
      id: Math.random().toString(36).substring(7),
      time: new Date().toLocaleTimeString(),
      type,
      text
    }]);
  };

  // Simulación determinista con timeouts
  const runDeterministicSimulation = () => {
    let currentStep = 0;
    
    const steps = [
      () => { addLog("action", "Navegando a /dashboard/productos/nuevo"); return false; },
      () => {
        if (variant === "a_tabs") {
          addLog("thought", "Veo pestañas. Llenaré la info general rápida (nombre).");
        } else {
          addLog("thought", "Veo un paso 1: General. Lleno el nombre y presiono Siguiente.");
        }
        return false;
      },
      () => {
        if (profile === "novato_offline") {
          addLog("thought", "¿SKU? No sé qué es eso. Lo dejo vacío.");
        } else {
          addLog("thought", "Agrego SKU y configuro precio sugerido.");
        }
        return false;
      },
      () => {
        if (variant === "a_tabs" && profile === "novato_offline") {
          addLog("action", "Hago clic directamente en 'Guardar' sin visitar las otras pestañas.");
          addLog("error", "Error del sistema: 'Al menos una bodega debe tener 100 unidades', 'Faltan imágenes', 'Faltan garantías'.");
          setTimeout(() => {
            addLog("thought", "¡Son demasiados errores! No entiendo qué me piden.");
            addLog("error", "DROP-OFF: El usuario abandonó por frustración.");
            setResult("dropoff");
            setIsRunning(false);
            trackEvent('simulation_completed', { result: 'dropoff' });
          }, 1500);
          return true; // termina
        } else if (variant === "b_wizard" && profile === "novato_offline") {
          addLog("action", "Intento avanzar pero el Wizard me detiene.");
          addLog("error", "Alerta: 'Al menos una bodega debe tener un mínimo de 100 unidades'.");
          setTimeout(() => {
            addLog("thought", "Ah, entiendo, tengo que poner 100 en stock. Lo hago.");
            addLog("action", "Completo stock y avanzo a imágenes.");
          }, 1500);
        } else if (profile === "experto_impaciente") {
          addLog("thought", "Lleno todas las pestañas rápidamente de memoria.");
        }
        return false;
      },
      () => {
        if (variant === "b_wizard" && profile === "novato_offline") {
          addLog("thought", "Me pide 3 imágenes. Voy a subir fotos de mi celular.");
          addLog("action", "Imágenes subidas. Siguiente.");
          addLog("thought", "Me obliga a marcar garantías. Las marco.");
          addLog("action", "Clic en Finalizar.");
          addLog("success", "Producto guardado con éxito.");
          setResult("success");
          setIsRunning(false);
          trackEvent('simulation_completed', { result: 'success' });
        } else if (profile === "experto_impaciente") {
          addLog("action", "Clic en Guardar.");
          addLog("success", "Producto guardado con éxito.");
          setResult("success");
          setIsRunning(false);
          trackEvent('simulation_completed', { result: 'success' });
        }
        return true;
      }
    ];

    const runNextStep = () => {
      if (currentStep < steps.length) {
        const shouldStop = steps[currentStep]();
        if (!shouldStop) {
          currentStep++;
          setTimeout(runNextStep, 2000); // 2 segundos entre pasos
        }
      }
    };

    setTimeout(runNextStep, 1500);
  };

  const runLLMSimulationMock = async () => {
    try {
      addLog("thought", "[LLM Engine conectado] Iniciando solicitud a la API...");
      
      const response = await fetch('/api/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile, variant })
      });
      
      const data = await response.json();
      
      if (data.status === 'success') {
        // En lugar de renderizar todo de golpe, lo mostramos con delay para efecto de "escritura"
        let currentLogIndex = 0;
        
        const renderNextLog = () => {
          if (currentLogIndex < data.logs.length) {
            const log = data.logs[currentLogIndex];
            addLog(log.type as LogEntry["type"], log.text);
            currentLogIndex++;
            setTimeout(renderNextLog, 1500);
          } else {
            setResult(data.result);
            setIsRunning(false);
            trackEvent('simulation_completed', { result: data.result, engine: 'llm' });
          }
        };
        
        setTimeout(renderNextLog, 1000);
      } else {
        addLog("error", "Error en el motor LLM: " + data.message);
        setIsRunning(false);
      }
    } catch (error) {
      addLog("error", "Error de conexión con el motor LLM.");
      setIsRunning(false);
    }
  };

  const handleRunBulkSimulation = async () => {
    setIsBulkRunning(true);
    try {
      const response = await fetch('/api/simulate/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ variant, totalUsers: bulkUsers, engine })
      });
      const resData = await response.json();
      if (resData.status === 'success') {
        setBulkResults(prev => [{ ...resData.data, id: Date.now() }, ...prev]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsBulkRunning(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-24 max-w-6xl mx-auto w-full h-[calc(100vh-100px)]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
            <Beaker className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-zinc-800">Laboratorio de Experimentos</h1>
            <p className="text-sm text-zinc-500">Testea variantes de UI con perfiles sintéticos antes de desarrollar.</p>
          </div>
        </div>
        <div className="flex bg-zinc-200 p-1 rounded-lg">
          <button 
            onClick={() => setViewMode("micro")}
            className={`px-4 py-2 text-sm font-bold rounded-md transition-all ${viewMode === 'micro' ? 'bg-white shadow-sm text-zinc-800' : 'text-zinc-500 hover:text-zinc-700'}`}
          >
            Modo Microscopio (1 Perfil)
          </button>
          <button 
            onClick={() => setViewMode("macro")}
            className={`px-4 py-2 text-sm font-bold rounded-md transition-all flex items-center gap-2 ${viewMode === 'macro' ? 'bg-white shadow-sm text-indigo-700' : 'text-zinc-500 hover:text-zinc-700'}`}
          >
            Modo Telescopio (Bulk)
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
        
        {/* SIDEBAR DE CONFIGURACIÓN */}
        <div className="w-full lg:w-[320px] bg-white border border-zinc-200 rounded-xl shadow-sm flex flex-col shrink-0">
          <div className="p-4 border-b border-zinc-100 bg-zinc-50/50 rounded-t-xl flex items-center gap-2">
            <Settings2 className="w-4 h-4 text-zinc-500" />
            <h2 className="font-bold text-zinc-700 text-sm">Configuración del Experimento</h2>
          </div>

          <div className="p-5 space-y-6 flex-1 overflow-y-auto">
            {viewMode === "micro" && (
              <div className="space-y-3">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Perfil de Tester (Persona)</label>
                <div className="space-y-2">
                  <button 
                    onClick={() => setProfile("novato_offline")}
                    className={`w-full flex items-start gap-3 p-3 rounded-lg border text-left transition-colors ${profile === 'novato_offline' ? 'border-[#0ea5e9] bg-sky-50' : 'border-zinc-200 hover:border-zinc-300'}`}
                  >
                    <Bot className={`w-5 h-5 shrink-0 ${profile === 'novato_offline' ? 'text-[#0ea5e9]' : 'text-zinc-400'}`} />
                    <div>
                      <div className="text-sm font-bold text-zinc-800">El Novato Offline</div>
                      <div className="text-xs text-zinc-500">Baja madurez digital, se frustra con errores masivos.</div>
                    </div>
                  </button>
                  <button 
                    onClick={() => setProfile("experto_impaciente")}
                    className={`w-full flex items-start gap-3 p-3 rounded-lg border text-left transition-colors ${profile === 'experto_impaciente' ? 'border-[#0ea5e9] bg-sky-50' : 'border-zinc-200 hover:border-zinc-300'}`}
                  >
                    <Bot className={`w-5 h-5 shrink-0 ${profile === 'experto_impaciente' ? 'text-[#0ea5e9]' : 'text-zinc-400'}`} />
                    <div>
                      <div className="text-sm font-bold text-zinc-800">El Experto Impaciente</div>
                      <div className="text-xs text-zinc-500">Alta madurez digital, busca velocidad.</div>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {viewMode === "macro" && (
              <div className="space-y-3">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                  <Users className="w-4 h-4" /> Población a Simular
                </label>
                <input 
                  type="number"
                  value={bulkUsers}
                  onChange={(e) => setBulkUsers(Number(e.target.value))}
                  className="w-full px-3 py-2.5 bg-white border border-zinc-200 rounded-lg text-sm text-zinc-700 focus:outline-none focus:border-[#0ea5e9] shadow-sm font-mono"
                />
                <p className="text-xs text-zinc-500">Volumen histórico sugerido: 2,212</p>
              </div>
            )}

            {/* Variante */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Variante de Flujo (UI)</label>
              <select 
                value={variant}
                onChange={(e) => setVariant(e.target.value as Variant)}
                className="w-full px-3 py-2.5 bg-white border border-zinc-200 rounded-lg text-sm text-zinc-700 focus:outline-none focus:border-[#0ea5e9] shadow-sm"
              >
                <option value="a_tabs">Variante A: Pestañas de Navegación Libre (Actual)</option>
                <option value="b_wizard">Variante B: Wizard Secuencial con Bloqueos</option>
              </select>
              
              <div className="pt-2">
                {variant === "a_tabs" ? (
                  <a href="/dashboard/bodegas" target="_blank" className="text-xs text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1">
                    Ver Flujo Fragmentado (Actual) &rarr;
                  </a>
                ) : (
                  <a href="/onboarding/experiencia-b" target="_blank" className="text-xs text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1">
                    Ver Nuevo Flujo Unificado (E2E) &rarr;
                  </a>
                )}
              </div>
            </div>

            {/* Motor */}
            {viewMode === "micro" && (
              <div className="space-y-3">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Motor de Simulación</label>
                <select 
                  value={engine}
                  onChange={(e) => setEngine(e.target.value as Engine)}
                  className="w-full px-3 py-2.5 bg-white border border-zinc-200 rounded-lg text-sm text-zinc-700 focus:outline-none focus:border-[#0ea5e9] shadow-sm"
                >
                  <option value="determinist">Determinista (Script basado en reglas duras)</option>
                  <option value="llm">IA Generativa (LLM evaluando DOM)</option>
                </select>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-zinc-100 bg-white rounded-b-xl">
            {viewMode === "micro" ? (
              <button 
                onClick={handleRunSimulation}
                disabled={isRunning}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#f08c3e] hover:bg-[#e67e22] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-lg shadow-sm transition-all"
              >
                {isRunning ? (
                  <>
                    <Activity className="w-5 h-5 animate-pulse" />
                    Simulando...
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" fill="currentColor" />
                    Ejecutar Simulación
                  </>
                )}
              </button>
            ) : (
              <button 
                onClick={handleRunBulkSimulation}
                disabled={isBulkRunning}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-lg shadow-sm transition-all"
              >
                {isBulkRunning ? (
                  <>
                    <Activity className="w-5 h-5 animate-pulse" />
                    Calculando embudo...
                  </>
                ) : (
                  <>
                    <BarChart3 className="w-5 h-5" />
                    Procesar Lote
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* LOG DE SIMULACIÓN o GRAFICA FUNNEL */}
        {viewMode === "micro" ? (
          <div className="flex-1 bg-zinc-900 rounded-xl shadow-sm border border-zinc-800 flex flex-col min-h-0 overflow-hidden relative">
            <div className="p-4 border-b border-zinc-800 bg-zinc-950/50 flex items-center justify-between z-10">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-zinc-400" />
              <h2 className="font-bold text-zinc-200 text-sm">Terminal de Observación Sintética</h2>
            </div>
            {isRunning && (
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-mono text-emerald-500">EN CURSO</span>
              </div>
            )}
          </div>

          {/* Area de scroll de logs */}
          <div className="flex-1 overflow-y-auto p-6 font-mono text-sm space-y-4">
            {logs.length === 0 && !isRunning && (
              <div className="h-full flex flex-col items-center justify-center text-zinc-500 gap-4 opacity-50">
                <Beaker className="w-16 h-16" />
                <p>Configura el experimento y presiona Ejecutar para ver la simulación.</p>
              </div>
            )}

            {logs.map((log) => (
              <div key={log.id} className="flex gap-4 animate-in slide-in-from-bottom-2 fade-in">
                <div className="text-zinc-500 shrink-0 select-none">[{log.time}]</div>
                <div className="flex-1">
                  {log.type === 'thought' && (
                    <span className="text-blue-400">🤖 Pensamiento: <span className="text-blue-300/80 italic">"{log.text}"</span></span>
                  )}
                  {log.type === 'action' && (
                    <span className="text-zinc-300 flex items-center gap-2">
                      <ChevronRight className="w-4 h-4 text-emerald-500" />
                      Acción: {log.text}
                    </span>
                  )}
                  {log.type === 'error' && (
                    <span className="text-red-400 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      {log.text}
                    </span>
                  )}
                  {log.type === 'success' && (
                    <span className="text-emerald-400 flex items-center gap-2 font-bold">
                      <CheckCircle2 className="w-4 h-4" />
                      {log.text}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Result Banner Overlay */}
          {!isRunning && result !== "pending" && (
            <div className={`absolute bottom-0 left-0 right-0 p-6 border-t backdrop-blur-md flex items-center justify-between animate-in slide-in-from-bottom-4 ${
              result === "success" 
                ? "bg-emerald-950/90 border-emerald-900/50" 
                : "bg-red-950/90 border-red-900/50"
            }`}>
              <div className="flex items-center gap-4">
                {result === "success" ? (
                  <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                ) : (
                  <div className="w-12 h-12 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center">
                    <XCircle className="w-6 h-6" />
                  </div>
                )}
                <div>
                  <h3 className={`font-bold text-lg ${result === "success" ? "text-emerald-400" : "text-red-400"}`}>
                    {result === "success" ? "Simulación Exitosa" : "Abandono Detectado (Drop-off)"}
                  </h3>
                  <p className="text-zinc-300 text-sm">
                    {result === "success" 
                      ? "El tester logró completar el flujo sin frustraciones críticas." 
                      : "El tester experimentó demasiada fricción y abandonó la tarea."}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-zinc-400 uppercase tracking-wider mb-1">Métrica Resultante</div>
                <div className={`font-bold text-2xl font-mono ${result === "success" ? "text-emerald-400" : "text-red-400"}`}>
                  {result === "success" ? "100% FINALIZADO" : "0% FINALIZADO"}
                </div>
              </div>
            </div>
          )}
          </div>
        ) : (
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-zinc-200 flex flex-col min-h-0 overflow-hidden relative">
          <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
            <div>
              <h2 className="font-bold text-zinc-800 text-lg">Funnel de Activación: Modales → Bodega → Producto</h2>
              <p className="text-sm text-zinc-500">Simulación basada en métricas históricas vs proyección.</p>
            </div>
          </div>
          
          <div className="flex-1 p-6 flex flex-col items-center justify-start overflow-hidden">
            {bulkResults.length === 0 && !isBulkRunning && (
              <div className="text-center text-zinc-400 max-w-md my-auto">
                <BarChart3 className="w-16 h-16 mx-auto mb-4 text-zinc-300" />
                <p>Configura el volumen de población y presiona "Procesar Lote" para calcular la retención esperada de esta Variante y enviarlo a Supabase.</p>
              </div>
            )}

            {isBulkRunning && (
              <div className="text-indigo-500 flex flex-col items-center gap-4 py-12">
                <Activity className="w-12 h-12 animate-spin" />
                <span className="font-mono text-sm font-bold">PROCESANDO EVENTOS ESTOCÁSTICOS...</span>
              </div>
            )}

            {bulkResults.length > 0 && (
              <div className="w-full flex flex-col gap-6 overflow-y-auto pr-2 pb-12">
                {bulkResults.map((res) => {
                  const data = [
                    { name: '1. Registro', users: res.total_users_started, dropoff: '100%' },
                    { name: '2. Inició Bodega', users: res.step_bodega_started, dropoff: `${((res.step_bodega_started / res.total_users_started) * 100).toFixed(1)}%` },
                    { name: '3. Fin Bodega', users: res.step_bodega_completed, dropoff: `${((res.step_bodega_completed / (res.step_bodega_started || 1)) * 100).toFixed(1)}%` },
                    { name: '4. Inició Prod', users: res.step_product_started, dropoff: `${((res.step_product_started / (res.step_bodega_completed || 1)) * 100).toFixed(1)}%` },
                    { name: '5. Fin Prod', users: res.step_product_completed, dropoff: `${((res.step_product_completed / (res.step_product_started || 1)) * 100).toFixed(1)}%` }
                  ];

                  return (
                    <div key={res.id} className="w-full flex flex-col border border-zinc-200 rounded-xl p-6 shadow-sm animate-in fade-in zoom-in-95 bg-white">
                      <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200 mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Variante simulada:</span>
                            <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${res.variant_name === 'b_wizard' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
                              {res.variant_name === 'a_tabs' ? 'Variante A (Flujo Actual)' : 'Variante B (Nuevo Flujo)'}
                            </span>
                          </div>
                          <div className="flex items-end gap-3">
                            <span className="text-sm font-bold text-zinc-700 mb-1">Conversión Total E2E: </span>
                            <span className={`text-3xl font-black ${res.variant_name === 'b_wizard' ? 'text-orange-500' : 'text-blue-600'}`}>
                              {((res.step_product_completed / res.total_users_started) * 100).toFixed(2)}%
                            </span>
                          </div>
                        </div>
                        <div className="text-xs text-zinc-400 font-mono bg-white px-3 py-1.5 border border-zinc-200 rounded-md shadow-sm">
                          ID: {res.id.toString().slice(-6)} (Guardado en BD)
                        </div>
                      </div>
                      <div className="w-full h-[300px]">
                        <FunnelChart data={data} variant={res.variant_name} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
        )}
      </div>
    </div>
  );
}
