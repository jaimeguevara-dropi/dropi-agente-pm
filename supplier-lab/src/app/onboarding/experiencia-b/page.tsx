"use client";

import { useState } from "react";
import { CheckCircle2, ChevronRight, Package, Store, Play, ArrowRight, ShieldCheck } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { ProductCreateWizard } from "@/components/ProductCreateWizard";

type Step = "welcome" | "bodega" | "producto" | "success";

export default function OnboardingE2EPage() {
  const [step, setStep] = useState<Step>("welcome");

  // Welcome -> Bodega
  const handleStartOnboarding = () => {
    trackEvent('onboarding_welcome_accepted');
    setStep("bodega");
  };

  // Bodega -> Producto
  const handleBodegaSave = () => {
    trackEvent('bodega_created');
    setStep("producto");
  };

  // Producto -> Success
  const handleProductSave = () => {
    trackEvent('product_saved');
    setStep("success");
  };

  return (
    <div className="w-full flex justify-center animate-in fade-in duration-500">
      
      {/* STEPS PROGRESS (Opcional, pero da contexto) */}
      {step !== "welcome" && step !== "success" && (
        <div className="fixed top-20 left-0 right-0 flex justify-center pointer-events-none z-40">
          <div className="bg-white px-6 py-3 rounded-full shadow-lg border border-zinc-200 flex items-center gap-4 text-sm font-bold">
            <div className={`flex items-center gap-2 ${step === 'bodega' ? 'text-indigo-600' : 'text-zinc-400'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step === 'bodega' ? 'bg-indigo-100' : 'bg-zinc-100'}`}>1</div>
              Bodega
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-300" />
            <div className={`flex items-center gap-2 ${step === 'producto' ? 'text-indigo-600' : 'text-zinc-400'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step === 'producto' ? 'bg-indigo-100' : 'bg-zinc-100'}`}>2</div>
              Producto
            </div>
          </div>
        </div>
      )}

      {/* STEP 1: WELCOME MODAL */}
      {step === "welcome" && (
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-zinc-200 text-center mt-12 animate-in zoom-in-95">
          <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Play className="w-10 h-10 ml-2" fill="currentColor" />
          </div>
          <h1 className="text-2xl font-black text-zinc-800 mb-4">¡Bienvenido a Dropi!</h1>
          <p className="text-zinc-600 mb-8 leading-relaxed">
            Estás a solo 2 pasos de empezar a vender tus productos a miles de droppers. Necesitaremos que configures tu primera <strong>Bodega</strong> y tu primer <strong>Producto</strong>.
          </p>
          <button 
            onClick={handleStartOnboarding}
            className="w-full bg-[#f08c3e] hover:bg-[#e67e22] text-white font-bold py-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-lg"
          >
            Empezar Onboarding <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* STEP 2: BODEGA FORM (Enfocado, sin lista) */}
      {step === "bodega" && (
        <div className="w-full max-w-2xl mt-12 animate-in slide-in-from-right-8 duration-300">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-zinc-800 flex items-center gap-3">
              <Store className="w-6 h-6 text-indigo-600" />
              Crea tu primera bodega
            </h2>
            <p className="text-zinc-500 mt-1">Configura el punto de origen para tus despachos.</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-zinc-700">Nombre de la Bodega *</label>
                <input type="text" placeholder="Ej. Bodega Principal Bogotá" className="w-full px-4 py-3 border border-zinc-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-zinc-700">Teléfono *</label>
                <input type="text" placeholder="320..." className="w-full px-4 py-3 border border-zinc-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-bold text-zinc-700">Dirección completa *</label>
                <textarea rows={2} placeholder="Calle 123 #45-67" className="w-full px-4 py-3 border border-zinc-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none" />
              </div>
            </div>
            
            <hr className="border-zinc-100" />
            
            <div className="flex justify-end">
              <button 
                onClick={handleBodegaSave}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-lg shadow-sm transition-all flex items-center gap-2"
              >
                Guardar y Continuar <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: PRODUCT WIZARD */}
      {step === "producto" && (
        <div className="w-full mt-12 animate-in slide-in-from-right-8 duration-300">
          <div className="mb-6 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-zinc-800 flex items-center gap-3">
              <Package className="w-6 h-6 text-indigo-600" />
              Sube tu primer producto
            </h2>
            <p className="text-zinc-500 mt-1">Sigue los pasos para que tu producto sea visible en el catálogo.</p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            {/* Reutilizamos el Wizard que ya construimos. Modificamos su onSave para interceptarlo */}
            <ProductCreateWizard interceptSave={handleProductSave} />
          </div>
        </div>
      )}

      {/* STEP 4: SUCCESS / SURVEY */}
      {step === "success" && (
        <div className="max-w-md w-full bg-white p-10 rounded-2xl shadow-xl border border-zinc-200 text-center mt-12 animate-in zoom-in-95">
          <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldCheck className="w-12 h-12" />
          </div>
          <h1 className="text-3xl font-black text-zinc-800 mb-4">¡Todo Listo!</h1>
          <p className="text-zinc-600 mb-8 leading-relaxed">
            Tu cuenta de Supplier está oficialmente activa y tu producto está siendo indexado en el catálogo.
          </p>
          
          <div className="bg-zinc-50 rounded-xl p-6 text-left border border-zinc-100 mb-8">
            <h3 className="font-bold text-sm text-zinc-800 mb-2">Ayúdanos a mejorar</h3>
            <p className="text-xs text-zinc-500 mb-4">¿Cómo calificarías este proceso de configuración?</p>
            <div className="flex justify-between gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} onClick={() => alert("¡Gracias por tu feedback!")} className="w-12 h-12 bg-white border border-zinc-200 rounded-lg font-bold text-zinc-600 hover:bg-orange-50 hover:border-orange-200 hover:text-orange-500 transition-colors">
                  {star}
                </button>
              ))}
            </div>
          </div>

          <button 
            onClick={() => window.location.href = "/"}
            className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-bold py-3 rounded-xl transition-all"
          >
            Ir al Dashboard Principal
          </button>
        </div>
      )}

    </div>
  );
}
