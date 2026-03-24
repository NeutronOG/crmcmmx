export const getRolColor = (rol: string) => {
  const colors: Record<string, string> = {
    admin: "bg-purple-500/20 text-purple-700 dark:text-purple-300 border-purple-500/30",
    dueno: "bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 border-yellow-500/30",
    ejecutivo_cuenta: "bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-500/30",
    coord_diseno: "bg-pink-500/20 text-pink-700 dark:text-pink-300 border-pink-500/30",
    coord_mkt: "bg-green-500/20 text-green-700 dark:text-green-300 border-green-500/30",
    aux_mkt: "bg-green-500/15 text-green-700 dark:text-green-400/80 border-green-500/20",
    contabilidad: "bg-orange-500/20 text-orange-700 dark:text-orange-300 border-orange-500/30",
    ia: "bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border-cyan-500/30",
    disenador: "bg-rose-500/20 text-rose-700 dark:text-rose-300 border-rose-500/30",
    diseñador_grafico: "bg-rose-500/20 text-rose-700 dark:text-rose-300 border-rose-500/30",
    diseñador_industrial: "bg-rose-500/20 text-rose-700 dark:text-rose-300 border-rose-500/30",
    produccion_audiovisual: "bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border-indigo-500/30",
    produccion_activaciones: "bg-violet-500/20 text-violet-700 dark:text-violet-300 border-violet-500/30",
    marketing_digital: "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
    auxiliar_marketing: "bg-teal-500/20 text-teal-700 dark:text-teal-300 border-teal-500/30",
    creador_contenido: "bg-fuchsia-500/20 text-fuchsia-700 dark:text-fuchsia-300 border-fuchsia-500/30",
    creador_parrilla: "bg-pink-500/20 text-pink-700 dark:text-pink-300 border-pink-500/30",
    administracion: "bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/30",
    tareas: "bg-slate-500/20 text-slate-700 dark:text-slate-300 border-slate-500/30",
    influencer: "bg-red-500/20 text-red-700 dark:text-red-300 border-red-500/30",
    freelancer: "bg-gray-500/20 text-gray-700 dark:text-gray-300 border-gray-500/30",
  }
  return colors[rol] ?? "bg-white/10 text-gray-700 dark:text-white/70 border-white/15"
}
