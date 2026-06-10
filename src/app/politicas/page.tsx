import Header from '@/components/layout/Header';
import { ShieldCheck, Database, Zap, Target, Users, Scale, FileText, Lock } from 'lucide-react';

const SECTIONS = [
  {
    title: 'Obtención de Datos',
    icon: Database,
    content: 'Los datos son capturados en tiempo real en los puntos de control (Garitas Principal y Nave 1) mediante dos canales principales: formularios digitales de entrada/salida y evidencias fotográficas enviadas vía Telegram. Esto garantiza la inmediatez de la información y evita la pérdida de trazabilidad física.',
    color: 'text-blue-400'
  },
  {
    title: 'Procesamiento Inteligente',
    icon: Zap,
    content: 'La información se procesa mediante flujos de automatización (n8n) que vinculan las fotos con los registros operativos. Los datos se almacenan en una base de datos cifrada (Supabase) bajo políticas de Seguridad a Nivel de Fila (RLS), asegurando que nadie pueda manipular registros históricos sin autorización.',
    color: 'text-purple-400'
  },
  {
    title: 'Finalidad del Sistema',
    icon: Target,
    content: 'El fin principal es el Control de Inteligencia Operativa. Buscamos mitigar riesgos de seguridad patrimonial y cumplir estrictamente con la Ley N° 29783 de Seguridad y Salud en el Trabajo, proporcionando evidencia auditable ante fiscalizaciones de SUNAFIL o incidentes operativos.',
    color: 'text-green-400'
  },
  {
    title: 'Usuarios Destinatarios',
    icon: Users,
    content: 'Diseñado exclusivamente para el personal de Supervisión de Seguridad y la Gerencia de Operaciones. El acceso está restringido mediante roles jerárquicos para proteger la privacidad de los datos personales (DNI, SCTR) de conductores y contratistas.',
    color: 'text-orange-400'
  }
];

const RESPONSIBILITIES = [
  { role: 'Agentes de Seguridad', task: 'Captura íntegra de datos y evidencias fotográficas en garita.' },
  { role: 'Supervisores', task: 'Auditoría diaria, verificación de alertas y mantenimiento del sistema.' },
  { role: 'Gerencia', task: 'Consulta de métricas, toma de decisiones SSOMA y gestión de infraestructura.' },
  { role: 'Administrador IT', task: 'Garantizar el 99.9% de disponibilidad y seguridad de las llaves de cifrado.' }
];

export default function PoliticasPage() {
  const sections = SECTIONS;
  const responsibilities = RESPONSIBILITIES;

  return (
    <div className="min-h-screen p-8 font-[family-name:var(--font-geist-sans)]">
      <Header />

      <main className="max-w-6xl mx-auto">
        <div className="mb-12 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-blue-500/10 border border-blue-500/20 rounded-2xl mb-4">
            <ShieldCheck className="w-8 h-8 text-blue-400" />
          </div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter mb-4 uppercase">
            Políticas de Seguridad y Privacidad
          </h1>
          <p className="text-slate-600 dark:text-gray-400 max-w-2xl mx-auto">
            Protocolo de manejo de información, trazabilidad y responsabilidades del portal 
            <span className="text-blue-500 dark:text-blue-400 font-bold"> NEXUS-CONTROL</span>.
          </p>
        </div>

        <div id="tour-politicas-cards" className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {sections.map((section, idx) => (
            <div key={idx} className="glass-panel p-8 rounded-3xl relative overflow-hidden group hover:border-blue-500/30 transition-all">
              <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <section.icon className="w-32 h-32 text-slate-900 dark:text-white" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <section.icon className={`w-6 h-6 ${section.color}`} />
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-tight">{section.title}</h2>
                </div>
                <p className="text-slate-600 dark:text-gray-400 leading-relaxed text-sm">
                  {section.content}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div id="tour-politicas-matriz" className="glass-panel rounded-3xl p-8 border-l-4 border-l-orange-500 bg-orange-500/5">
          <div className="flex items-center gap-3 mb-8">
            <Scale className="w-6 h-6 text-orange-500 dark:text-orange-400" />
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white uppercase tracking-tight">Matriz de Responsabilidades</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {responsibilities.map((res, idx) => (
              <div key={idx} className="bg-slate-100/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-5">
                <p className="text-[10px] font-black text-orange-600 dark:text-orange-400 uppercase tracking-widest mb-2">{res.role}</p>
                <p className="text-sm text-slate-600 dark:text-gray-300 font-medium leading-snug">{res.task}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col md:flex-row gap-6 justify-center items-center text-center md:text-left">
          <div className="flex items-center gap-2 text-gray-500 text-xs font-mono">
            <Lock className="w-4 h-4" />
            Cifrado de Extremo a Extremo (AES-256)
          </div>
          <div className="flex items-center gap-2 text-gray-500 text-xs font-mono">
            <FileText className="w-4 h-4" />
            Conforme a Ley N° 29733 de Protección de Datos Personales
          </div>
        </div>
      </main>
    </div>
  );
}
