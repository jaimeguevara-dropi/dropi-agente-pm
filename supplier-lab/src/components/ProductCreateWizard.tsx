"use client";

import { useState } from "react";
import { 
  X, CheckSquare, Square, Info, Bold, Italic, List, AlignLeft, AlignCenter, AlignRight, CircleDot, Circle, Trash, Bot
} from "lucide-react";
import { trackEvent } from "@/lib/analytics";

export function ProductCreateWizard({ onBack, onSaveSuccess, interceptSave }: { onBack?: () => void, onSaveSuccess?: () => void, interceptSave?: () => void }) {
  const [currentStep, setCurrentStep] = useState(1);
  
  // Estados para validación
  const [productName, setProductName] = useState("jabon");
  const [stockQuantity, setStockQuantity] = useState<number | "">("");
  const [imagesCount, setImagesCount] = useState(0);

  // Estados para Garantías
  const [garantiaIncompleta, setGarantiaIncompleta] = useState(false);
  const [garantiaMalFuncionamiento, setGarantiaMalFuncionamiento] = useState(false);
  const [garantiaRoto, setGarantiaRoto] = useState(false);

  // Estados para Modales de Éxito
  const [showVerifyModal, setShowVerifyModal] = useState(false);

  // Estado del Modal de Alerta de Validación (Error local del Wizard)
  const [errorMsg, setErrorMsg] = useState("");

  const steps = [
    { id: 1, name: "General" },
    { id: 2, name: "Stock" },
    { id: 3, name: "Imágenes" },
    { id: 4, name: "Garantías" }
  ];

  const handleNext = () => {
    setErrorMsg("");

    if (currentStep === 1) {
      if (!productName.trim()) {
        setErrorMsg("El nombre del producto es obligatorio.");
        return;
      }
      trackEvent('wizard_step_completed', { step: 1, name: 'General' });
      setCurrentStep(2);
    } 
    else if (currentStep === 2) {
      const currentStock = typeof stockQuantity === "number" ? stockQuantity : 0;
      if (currentStock < 100) {
        setErrorMsg("Al menos una bodega debe tener un mínimo de 100 unidades.");
        trackEvent('wizard_validation_failed', { step: 2, reason: 'stock_low' });
        return;
      }
      trackEvent('wizard_step_completed', { step: 2, name: 'Stock' });
      setCurrentStep(3);
    }
    else if (currentStep === 3) {
      if (imagesCount < 3) {
        setErrorMsg("Debes subir al menos 3 imágenes del producto.");
        trackEvent('wizard_validation_failed', { step: 3, reason: 'images_low' });
        return;
      }
      trackEvent('wizard_step_completed', { step: 3, name: 'Imágenes' });
      setCurrentStep(4);
    }
    else if (currentStep === 4) {
      if (!garantiaIncompleta || !garantiaMalFuncionamiento || !garantiaRoto) {
        setErrorMsg("Las garantías: Orden incompleta, Mal funcionamiento y Producto roto son obligatorias.");
        trackEvent('wizard_validation_failed', { step: 4, reason: 'warranties_missing' });
        return;
      }
      trackEvent('wizard_step_completed', { step: 4, name: 'Garantías' });
      // Finalizar
      handleSaveAttempt();
    }
  };

  const handlePrev = () => {
    setErrorMsg("");
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  const handleSaveAttempt = () => {
    trackEvent('product_save_attempted', { variant: 'wizard' });
    if (interceptSave) {
      interceptSave();
    } else {
      setShowVerifyModal(true);
    }
  };

  const handleVerifyStart = () => {
    trackEvent('product_saved', { variant: 'wizard' });
    trackEvent('survey_started');
    window.open("https://link.dropi.co/widget/survey/RHwFslXWbg01teWQk04b", "_blank");
    if (onSaveSuccess) onSaveSuccess();
  };

  return (
    <div className="flex flex-col gap-6 pb-24 animate-in fade-in duration-300 relative max-w-4xl mx-auto w-full">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-800">Crear Producto (Wizard)</h1>
        {onBack && <button onClick={onBack} className="text-zinc-500 hover:text-zinc-700">Volver</button>}
      </div>

      {/* Stepper Header */}
      <div className="bg-white rounded-xl border border-zinc-200 p-6 flex justify-between items-center shadow-sm">
        {steps.map((step) => (
          <div key={step.id} className="flex flex-col items-center flex-1 relative">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm z-10 ${
              currentStep >= step.id ? 'bg-[#0ea5e9] text-white' : 'bg-zinc-100 text-zinc-400'
            }`}>
              {step.id}
            </div>
            <span className={`text-xs mt-2 font-medium ${currentStep >= step.id ? 'text-[#0ea5e9]' : 'text-zinc-400'}`}>
              {step.name}
            </span>
            {step.id !== 4 && (
              <div className={`absolute top-4 left-[50%] w-full h-[2px] ${
                currentStep > step.id ? 'bg-[#0ea5e9]' : 'bg-zinc-100'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Modal: Verificar operación */}
      {showVerifyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 backdrop-blur-[2px]">
          <div className="bg-white rounded-2xl shadow-2xl w-[500px] overflow-hidden animate-in zoom-in-95 duration-200 relative">
            <button 
              onClick={() => setShowVerifyModal(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="p-8">
              <h3 className="text-2xl font-bold text-zinc-800 mb-6">Verificar operación</h3>
              <p className="text-[15px] text-zinc-700 mb-6 leading-relaxed">
                Antes de publicar tu primer producto en el catálogo público, queremos conocerte y acompañarte para que tengas todo listo como proveedor Dropi.<br/><br/>
                Por eso, realizaremos una verificación de tu operación.
              </p>
              <div className="flex items-center gap-4 w-full">
                <button 
                  onClick={handleVerifyStart}
                  className="flex-1 bg-[#f08c3e] hover:bg-[#e67e22] text-white font-bold py-3 px-4 rounded-xl shadow-sm transition-colors border-2 border-[#f08c3e] hover:border-[#e67e22]"
                >
                  Comenzar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-8 min-h-[500px] flex flex-col">
        
        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm font-medium flex items-center gap-2">
            <Bot className="w-5 h-5" />
            {errorMsg}
          </div>
        )}

        <div className="flex-1">
          {/* --- PASO 1: GENERAL --- */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-in slide-in-from-right-4">
              <h2 className="text-xl font-bold text-zinc-800 border-b pb-2">Información General</h2>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-zinc-700">Nombre del producto *</label>
                <input 
                  type="text" 
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="w-full px-4 py-2 border border-zinc-200 rounded-md focus:outline-none focus:border-orange-400 text-sm"
                />
              </div>

              <div className="space-y-4 pt-2">
                <label className="text-sm font-semibold text-zinc-700 block">Medidas del producto:</label>
                <div className="bg-sky-50 border border-sky-100 rounded-md p-4 flex gap-3 text-sky-800">
                  <Info className="w-5 h-5 shrink-0 mt-0.5" />
                  <p className="text-sm font-medium">Asegúrate de ingresar medidas reales para calcular el envío.</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-1.5"><label className="text-xs font-semibold text-zinc-600">Peso (g)</label><input type="number" defaultValue="10" className="w-full px-3 py-2 border border-zinc-200 rounded-md text-sm" /></div>
                  <div className="space-y-1.5"><label className="text-xs font-semibold text-zinc-600">Largo (cm)</label><input type="number" defaultValue="10" className="w-full px-3 py-2 border border-zinc-200 rounded-md text-sm" /></div>
                  <div className="space-y-1.5"><label className="text-xs font-semibold text-zinc-600">Ancho (cm)</label><input type="number" defaultValue="10" className="w-full px-3 py-2 border border-zinc-200 rounded-md text-sm" /></div>
                  <div className="space-y-1.5"><label className="text-xs font-semibold text-zinc-600">Alto (cm)</label><input type="number" defaultValue="10" className="w-full px-3 py-2 border border-zinc-200 rounded-md text-sm" /></div>
                </div>
              </div>
            </div>
          )}

          {/* --- PASO 2: STOCK --- */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-in slide-in-from-right-4">
              <h2 className="text-xl font-bold text-zinc-800 border-b pb-2">Asignar Stock</h2>
              <p className="text-sm text-zinc-600">Para productos públicos, requerimos al menos 100 unidades en stock para garantizar disponibilidad a los dropshippers.</p>
              
              <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-6 flex items-center justify-between">
                <div className="font-medium text-zinc-700">bodega 1 (Principal)</div>
                <div className="flex flex-col items-end">
                  <input 
                    type="number" 
                    value={stockQuantity} 
                    onChange={e => setStockQuantity(e.target.value === "" ? "" : Number(e.target.value))}
                    placeholder="Cantidad" 
                    className="w-32 px-4 py-2 border border-zinc-200 rounded-md text-center focus:outline-none focus:border-orange-400"
                  />
                  <span className="text-xs text-zinc-500 mt-1">Mínimo: 100</span>
                </div>
              </div>
            </div>
          )}

          {/* --- PASO 3: IMÁGENES --- */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-in slide-in-from-right-4">
              <h2 className="text-xl font-bold text-zinc-800 border-b pb-2">Imágenes del Producto</h2>
              <p className="text-sm text-zinc-600">Sube mínimo 3 imágenes que muestren tu producto desde distintos ángulos.</p>
              
              <button 
                onClick={() => {
                  setImagesCount(c => c + 1);
                  setErrorMsg(""); // Limpia error si agrega
                }} 
                className="w-full border border-dashed border-emerald-400 bg-emerald-50/50 text-emerald-600 rounded-xl py-8 flex flex-col items-center justify-center font-bold transition-all hover:bg-emerald-50"
              >
                AGREGAR UNA IMAGEN ({imagesCount} cargadas)
              </button>
              
              {imagesCount > 0 && (
                <div className="flex flex-wrap gap-4 mt-6">
                  {Array.from({length: imagesCount}).map((_, i) => (
                    <div key={i} className="relative w-24 h-24 bg-zinc-100 rounded-lg border border-zinc-200">
                      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600857062241-98e5dba7f214?q=80&w=100&auto=format&fit=crop')] bg-cover bg-center rounded-lg opacity-80" />
                      <button 
                        onClick={() => setImagesCount(c => c - 1)} 
                        className="absolute -top-2 -right-2 bg-red-400 text-white p-1 rounded-full hover:bg-red-500"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* --- PASO 4: GARANTÍAS --- */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-in slide-in-from-right-4">
              <h2 className="text-xl font-bold text-zinc-800 border-b pb-2">Garantías por Defecto</h2>
              <p className="text-sm text-zinc-600">Las siguientes garantías son de carácter obligatorio para proteger al ecosistema.</p>
              
              <div className="space-y-4">
                <label className="flex items-center gap-3 p-4 border rounded-lg bg-zinc-50 cursor-pointer">
                  <div className={`w-5 h-5 rounded flex items-center justify-center ${garantiaIncompleta ? 'bg-[#0ea5e9] text-white' : 'bg-white border border-zinc-300'}`} onClick={() => {setGarantiaIncompleta(!garantiaIncompleta); setErrorMsg("");}}>
                    {garantiaIncompleta && <CheckSquare className="w-4 h-4" />}
                  </div>
                  <span className="font-medium text-zinc-700">Orden incompleta</span>
                </label>

                <label className="flex items-center gap-3 p-4 border rounded-lg bg-zinc-50 cursor-pointer">
                  <div className={`w-5 h-5 rounded flex items-center justify-center ${garantiaMalFuncionamiento ? 'bg-[#0ea5e9] text-white' : 'bg-white border border-zinc-300'}`} onClick={() => {setGarantiaMalFuncionamiento(!garantiaMalFuncionamiento); setErrorMsg("");}}>
                    {garantiaMalFuncionamiento && <CheckSquare className="w-4 h-4" />}
                  </div>
                  <span className="font-medium text-zinc-700">Mal funcionamiento</span>
                </label>

                <label className="flex items-center gap-3 p-4 border rounded-lg bg-zinc-50 cursor-pointer">
                  <div className={`w-5 h-5 rounded flex items-center justify-center ${garantiaRoto ? 'bg-[#0ea5e9] text-white' : 'bg-white border border-zinc-300'}`} onClick={() => {setGarantiaRoto(!garantiaRoto); setErrorMsg("");}}>
                    {garantiaRoto && <CheckSquare className="w-4 h-4" />}
                  </div>
                  <span className="font-medium text-zinc-700">Producto roto</span>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Wizard Footer Actions */}
        <div className="mt-8 pt-6 border-t flex items-center justify-between">
          <button 
            onClick={handlePrev}
            disabled={currentStep === 1}
            className={`px-6 py-2.5 rounded-lg font-bold transition-colors ${currentStep === 1 ? 'text-zinc-300 bg-zinc-50 cursor-not-allowed' : 'text-zinc-600 bg-zinc-100 hover:bg-zinc-200'}`}
          >
            Atrás
          </button>
          
          <button 
            onClick={handleNext}
            className="px-8 py-2.5 bg-[#f08c3e] hover:bg-[#e67e22] text-white font-bold rounded-lg shadow-sm transition-colors"
          >
            {currentStep === 4 ? "Guardar y Finalizar" : "Siguiente"}
          </button>
        </div>
      </div>
    </div>
  );
}
