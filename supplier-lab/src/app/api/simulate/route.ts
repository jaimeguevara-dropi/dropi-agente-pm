import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { profile, variant } = body;

    // En un entorno de producción, aquí conectaríamos con OpenAI o Gemini API.
    // Ej: const response = await openai.chat.completions.create({...})
    // 
    // Para el Laboratorio PoC, si no hay API KEY, devolvemos un log simulado 
    // pero con formato "generativo" para demostrar la diferencia.

    const isApiKeyConfigured = false; // cambiar si se agregan variables de entorno

    if (!isApiKeyConfigured) {
      // Mock de una respuesta generativa (difiere del determinista)
      const logs = [];
      logs.push({ type: 'thought', text: `[LLM] Evaluando el DOM para Variante ${variant === 'a_tabs' ? 'A (Pestañas)' : 'B (Wizard)'} con perfil ${profile}.` });
      
      if (profile === 'novato_offline') {
        logs.push({ type: 'thought', text: '[LLM] Como Novato Offline, mi prioridad es terminar rápido y evitar campos complejos.' });
        if (variant === 'a_tabs') {
          logs.push({ type: 'action', text: '[LLM] Hago clic en "Guardar" inmediatamente después de poner el nombre.' });
          logs.push({ type: 'error', text: '[LLM] El sistema devuelve 3 errores de validación simultáneos.' });
          logs.push({ type: 'thought', text: '[LLM] "No entiendo qué es stock ni por qué me pide tantas imágenes. Esto es muy difícil".' });
          logs.push({ type: 'error', text: 'DROP-OFF. El perfil sintético ha abandonado la tarea por sobrecarga cognitiva.' });
        } else {
          logs.push({ type: 'action', text: '[LLM] Intento avanzar de paso. El sistema me detiene y me pide explícitamente 100 de stock.' });
          logs.push({ type: 'thought', text: '[LLM] "Ok, solo me pide una cosa. Pongo 100 y le doy siguiente".' });
          logs.push({ type: 'action', text: '[LLM] El perfil completa paso a paso, guiado por los bloqueos.' });
          logs.push({ type: 'success', text: 'COMPLETADO. El perfil superó la fricción inicial gracias a la micro-interacción.' });
        }
      } else {
        logs.push({ type: 'thought', text: '[LLM] Soy un experto, conozco la plataforma. Quiero hacer esto en menos de 1 minuto.' });
        if (variant === 'a_tabs') {
          logs.push({ type: 'action', text: '[LLM] Navego por todas las pestañas sin problemas y lleno lo necesario.' });
          logs.push({ type: 'success', text: 'COMPLETADO. Tiempo estimado de fricción: Muy bajo.' });
        } else {
          logs.push({ type: 'thought', text: '[LLM] "Ugh, un wizard paso a paso. Me obliga a dar más clics en vez de llenar todo de una vez".' });
          logs.push({ type: 'action', text: '[LLM] El perfil completa el flujo, pero registra fricción por exceso de pasos forzados.' });
          logs.push({ type: 'success', text: 'COMPLETADO (Con fricción menor).' });
        }
      }

      // Simulamos latencia de red de LLM
      await new Promise(resolve => setTimeout(resolve, 2000));

      return NextResponse.json({ 
        status: 'success', 
        result: logs.some(l => l.text.includes('DROP-OFF')) ? 'dropoff' : 'success',
        logs 
      });
    }

    // Código real de LLM iría aquí...
    return NextResponse.json({ status: 'error', message: 'Not implemented' });

  } catch (error) {
    return NextResponse.json({ status: 'error', message: 'Error in simulation engine' }, { status: 500 });
  }
}
