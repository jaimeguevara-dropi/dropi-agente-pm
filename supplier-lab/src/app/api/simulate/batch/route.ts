import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Tasas históricas (Variante A / Control) basadas en datos reales de UserPilot (90 días)
const METRICS = {
  a_tabs: {
    bodegaStartProb: 0.355, // 787 / 2212
    bodegaCompleteProb: 0.68, // 535 / 787
    productStartProb: 0.86, // 460 / 535
    productCompleteProb: 0.402 // 185 / 460
  },
  b_wizard: {
    // Asumimos que el flujo antes del producto no cambia
    bodegaStartProb: 0.355,
    bodegaCompleteProb: 0.68,
    productStartProb: 0.86,
    // Hipótesis: El Wizard aumenta la compleción de 40% a 75% al reducir fricción final
    productCompleteProb: 0.75 
  }
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { variant = 'a_tabs', totalUsers = 2212, engine = 'determinist' } = body;

    const rates = variant === 'b_wizard' ? METRICS.b_wizard : METRICS.a_tabs;

    let step_bodega_started = 0;
    let step_bodega_completed = 0;
    let step_product_started = 0;
    let step_product_completed = 0;

    // Simulación estocástica por usuario
    for (let i = 0; i < totalUsers; i++) {
      // 1. Inicia Bodega?
      if (Math.random() <= rates.bodegaStartProb) {
        step_bodega_started++;
        
        // 2. Completa Bodega?
        if (Math.random() <= rates.bodegaCompleteProb) {
          step_bodega_completed++;
          
          // 3. Inicia Producto?
          if (Math.random() <= rates.productStartProb) {
            step_product_started++;
            
            // 4. Completa Producto?
            if (Math.random() <= rates.productCompleteProb) {
              step_product_completed++;
            }
          }
        }
      }
    }

    const payload = {
      variant_name: variant,
      total_users_started: totalUsers,
      step_bodega_started,
      step_bodega_completed,
      step_product_started,
      step_product_completed,
      engine
    };

    // Intentar guardar en Supabase (no bloquea si falla por falta de credenciales)
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      const { error } = await supabase.from('lab_simulation_runs').insert([payload]);
      if (error) {
        console.error("Error inserting into Supabase:", error);
      }
    }

    return NextResponse.json({
      status: 'success',
      data: payload
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ status: 'error', message: 'Error in bulk simulation' }, { status: 500 });
  }
}
