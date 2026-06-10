'use client';

import React from 'react';
import { HelpCircle } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { driver } from 'driver.js';
import { useTheme } from 'next-themes';

const DASHBOARD_STEPS = [
  { element: '#tour-alerts', popover: { title: 'Alertas Inteligentes', description: 'Aquí aparecerán advertencias críticas si hay personas o vehículos que han excedido su tiempo de estadía.', side: "bottom" } },
  { element: '#tour-metrics', popover: { title: 'Métricas Principales', description: 'Un resumen en tiempo real del personal operativo dentro de planta.', side: "bottom", align: 'start' } },
  { element: '#tour-funnel', popover: { title: 'Embudo Operativo', description: 'Observa la eficiencia de tu proceso de auditoría y detecta cuellos de botella.', side: "right" } },
  { element: '#tour-timeline', popover: { title: 'Línea de Tiempo', description: 'Registro de los últimos eventos y observaciones de SSOMA en tiempo real.', side: "left" } },
];

const GARITA_STEPS = [
  { element: '#tour-garita-repartidores', popover: { title: 'Control de Repartidores', description: 'Registra la entrada, salida y kilometraje de los camiones de despacho.' } },
  { element: '#tour-garita-visitas', popover: { title: 'Pases de Visita', description: 'Genera pases temporales y captura fotos del DNI para visitantes.' } },
  { element: '#tour-garita-proveedores', popover: { title: 'Proveedores de Carga', description: 'Revisa las guías de remisión y valida el SCTR antes de autorizar el ingreso.' } },
  { element: '#tour-garita-contratistas', popover: { title: 'Control de Contratistas', description: 'Registra herramientas, equipos y el personal autorizado para trabajos de riesgo.' } },
  { element: '#tour-garita-ocurrencias', popover: { title: 'Cuaderno Virtual', description: 'Libro digital inmutable para registrar cualquier anomalía o novedad durante el turno.' } },
];

const POLITICAS_STEPS = [
  { element: '#tour-politicas-cards', popover: { title: 'Bases del Sistema', description: 'Conoce cómo se capturan, procesan y almacenan los datos bajo altos estándares de seguridad.' } },
  { element: '#tour-politicas-matriz', popover: { title: 'Matriz de Responsabilidades', description: 'Cada rol tiene acceso restringido según sus funciones operativas.' } },
];

export function GuidedTourButton() {
  const pathname = usePathname();
  const { resolvedTheme } = useTheme();

  const handleStartTour = () => {
    let steps: any[] = [];
    
    if (pathname === '/') {
      steps = DASHBOARD_STEPS;
    } else if (pathname === '/garita') {
      steps = GARITA_STEPS;
    } else if (pathname === '/politicas') {
      steps = POLITICAS_STEPS;
    } else {
      steps = [
        { popover: { title: 'Tour No Disponible', description: 'No hay un recorrido guiado configurado para esta sección específica aún.' } }
      ];
    }

    // Initialize driver
    const driverObj = driver({
      showProgress: true,
      animate: true,
      allowClose: false, // Evita que se cierre al hacer clic fuera
      nextBtnText: 'Siguiente',
      prevBtnText: 'Anterior',
      doneBtnText: 'Finalizar',
      progressText: 'Paso {{current}} de {{total}}',
      steps: steps
    });

    driverObj.drive();
  };

  return (
    <button 
      onClick={handleStartTour}
      className="p-1.5 rounded-lg text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
      title="Tour Guiado"
    >
      <HelpCircle className="w-5 h-5" />
    </button>
  );
}
