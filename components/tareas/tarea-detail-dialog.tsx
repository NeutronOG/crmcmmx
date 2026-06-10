"use client"

import { useState, useRef } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Calendar,
  Building2,
  Briefcase,
  Upload,
  Image as ImageIcon,
  FileText,
  Trash2,
  Download,
  Paperclip,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Eye,
  ListChecks,
  Plus,
  Underline,
} from "lucide-react"
import type { Tarea, Evidencia, Subtarea } from "@/lib/store"
import { addEvidencia, removeEvidencia, updateTarea, addSubtarea, updateSubtarea, deleteSubtarea, getSubtareas } from "@/lib/store"
import { toast } from "sonner"

interface TareaDetailDialogProps {
  tarea: Tarea | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdate: () => void
}

export function TareaDetailDialog({ tarea, open, onOpenChange, onUpdate }: TareaDetailDialogProps) {
  const [uploading, setUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [nuevaSubtarea, setNuevaSubtarea] = useState("")
  const [savingSubtarea, setSavingSubtarea] = useState(false)
  const [subtareas, setSubtareas] = useState<Subtarea[]>(tarea?.subtareas || [])
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Sync subtareas when tarea changes
  const tareaId = tarea?.id
  const tareaSubtareas = tarea?.subtareas
  if (tarea && tarea.subtareas !== subtareas && tareaSubtareas) {
    // only update if the tarea id changes (avoid infinite loop)
  }

  const reloadSubtareas = async () => {
    if (!tarea) return
    const data = await getSubtareas(tarea.id)
    setSubtareas(data)
  }

  const handleAddSubtarea = async () => {
    if (!tarea || !nuevaSubtarea.trim()) return
    setSavingSubtarea(true)
    try {
      const sub = await addSubtarea(tarea.id, nuevaSubtarea)
      setSubtareas(prev => [...prev, sub])
      setNuevaSubtarea("")
    } catch {
      // silently fail, subtareas table may not exist yet
    } finally {
      setSavingSubtarea(false)
    }
  }

  const handleToggleSubtarea = async (sub: Subtarea) => {
    try {
      await updateSubtarea(sub.id, { completada: !sub.completada })
      setSubtareas(prev => prev.map(s => s.id === sub.id ? { ...s, completada: !s.completada } : s))
    } catch {
      // silently fail
    }
  }

  const handleDeleteSubtarea = async (id: string) => {
    try {
      await deleteSubtarea(id)
      setSubtareas(prev => prev.filter(s => s.id !== id))
    } catch {
      // silently fail
    }
  }

  const handleToggleSubrayado = async () => {
    if (!tarea) return
    try {
      await updateTarea(tarea.id, { tituloSubrayado: !tarea.tituloSubrayado })
      onUpdate()
    } catch {
      // silently fail
    }
  }

  if (!tarea) return null

  const isOverdue = tarea.fechaVencimiento && new Date(tarea.fechaVencimiento) < new Date() && tarea.estado !== "Completada"

  const getPrioridadColor = (prioridad: string) => {
    switch (prioridad) {
      case "Alta": return "satin-red border satin-red-border satin-red-bg"
      case "Media": return "satin-yellow border satin-yellow-border satin-yellow-bg"
      case "Baja": return "satin-green border satin-green-border satin-green-bg"
      default: return ""
    }
  }

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case "Pendiente": return <Clock className="h-4 w-4" />
      case "En Progreso": return <Briefcase className="h-4 w-4" />
      case "En Revisión": return <Eye className="h-4 w-4" />
      case "Completada": return <CheckCircle2 className="h-4 w-4" />
      default: return null
    }
  }

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "Pendiente": return "bg-white/5 text-white/50 border-white/10"
      case "En Progreso": return "satin-yellow-bg satin-yellow border satin-yellow-border"
      case "En Revisión": return "satin-yellow-bg satin-yellow border satin-yellow-border"
      case "Completada": return "satin-green-bg satin-green border satin-green-border"
      default: return ""
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const maxSize = 5 * 1024 * 1024 // 5MB
      if (file.size > maxSize) {
        toast.error(`${file.name} excede el tamaño máximo de 5MB`)
        continue
      }

      try {
        await addEvidencia(tarea.id, file)
        toast.success(`${file.name} subido correctamente`)
      } catch {
        toast.error(`Error al subir ${file.name}`)
      }
    }

    setUploading(false)
    onUpdate()

    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleRemoveEvidencia = async (evidenciaId: string) => {
    try {
      await removeEvidencia(tarea.id, evidenciaId)
      toast.success("Evidencia eliminada")
      onUpdate()
    } catch {
      toast.error("Error al eliminar evidencia")
    }
  }

  const handleDownload = (evidencia: Evidencia) => {
    window.open(evidencia.url, '_blank')
  }

  const handleEstadoChange = async (estado: Tarea["estado"]) => {
    await updateTarea(tarea.id, {
      estado,
      fechaCompletada: estado === "Completada" ? new Date().toISOString().split("T")[0] : "",
    })
    toast.success(`Tarea movida a ${estado}`)
    onUpdate()
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const estados: Tarea["estado"][] = ["Pendiente", "En Progreso", "En Revisión", "Completada"]

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto ">
          <DialogHeader>
            <div className="flex items-center gap-3 flex-wrap">
              <Badge variant="outline" className={`rounded-full ${getPrioridadColor(tarea.prioridad)}`}>
                {tarea.prioridad}
              </Badge>
              <Badge variant="outline" className={`rounded-full gap-1 ${getEstadoColor(tarea.estado)}`}>
                {getEstadoIcon(tarea.estado)}
                {tarea.estado}
              </Badge>
              {isOverdue && (
                <Badge variant="destructive" className="rounded-full gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  Atrasada
                </Badge>
              )}
            </div>
            <DialogTitle className="text-xl flex items-center gap-2">
              <span className={tarea.tituloSubrayado ? "underline underline-offset-4 decoration-primary" : ""}>
                {tarea.titulo}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className={`h-7 w-7 shrink-0 ${tarea.tituloSubrayado ? "text-primary" : "text-muted-foreground"}`}
                onClick={handleToggleSubrayado}
                title="Subrayar título"
              >
                <Underline className="h-4 w-4" />
              </Button>
            </DialogTitle>
            <DialogDescription>{tarea.id}</DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="detalles" className="mt-2">
            <TabsList className="w-full">
              <TabsTrigger value="detalles" className="flex-1">Detalles</TabsTrigger>
              <TabsTrigger value="subtareas" className="flex-1 gap-1">
                <ListChecks className="h-3 w-3" />
                Subtareas ({subtareas.length})
              </TabsTrigger>
              <TabsTrigger value="evidencias" className="flex-1 gap-1">
                <Paperclip className="h-3 w-3" />
                Evidencias ({tarea.evidencias.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="detalles" className="space-y-4 mt-4">
              {tarea.descripcion && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground">Descripción</h4>
                  <p className="text-sm">{tarea.descripcion}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Building2 className="h-3 w-3" /> Cliente
                  </h4>
                  <p className="text-sm">{tarea.cliente || "Sin asignar"}</p>
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Briefcase className="h-3 w-3" /> Proyecto
                  </h4>
                  <p className="text-sm">{tarea.proyecto || "Sin asignar"}</p>
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-3 w-3" /> Fecha de creación
                  </h4>
                  <p className="text-sm">
                    {tarea.fechaCreacion
                      ? new Date(tarea.fechaCreacion).toLocaleDateString("es-ES")
                      : "—"}
                  </p>
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-3 w-3" /> Fecha de vencimiento
                  </h4>
                  <p className={`text-sm ${isOverdue ? "satin-red font-medium" : ""}`}>
                    {tarea.fechaVencimiento
                      ? new Date(tarea.fechaVencimiento).toLocaleDateString("es-ES")
                      : "—"}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">Asignado a</h4>
                <div className="flex items-center gap-2">
                  <Avatar className="size-8">
                    <AvatarFallback className="text-xs bg-primary/20">
                      {tarea.asignado
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{tarea.asignado}</span>
                </div>
              </div>

              {tarea.etiquetas.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground">Etiquetas</h4>
                  <div className="flex flex-wrap gap-2">
                    {tarea.etiquetas.map((tag) => (
                      <Badge key={tag} variant="outline" className="rounded-full">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {tarea.fechaCompletada && (
                <div className="space-y-1">
                  <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <CheckCircle2 className="h-3 w-3 satin-green" /> Completada el
                  </h4>
                  <p className="text-sm satin-green">
                    {new Date(tarea.fechaCompletada).toLocaleDateString("es-ES")}
                  </p>
                </div>
              )}

              <div className="space-y-2 pt-2 border-t border-border/40">
                <h4 className="text-sm font-medium text-muted-foreground">Cambiar estado</h4>
                <div className="flex flex-wrap gap-2">
                  {estados.map((estado) => (
                    <Button
                      key={estado}
                      variant={tarea.estado === estado ? "default" : "outline"}
                      size="sm"
                      className="gap-1"
                      disabled={tarea.estado === estado}
                      onClick={() => handleEstadoChange(estado)}
                    >
                      {getEstadoIcon(estado)}
                      {estado}
                    </Button>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="subtareas" className="space-y-4 mt-4">
              {/* Agregar nueva subtarea */}
              <div className="flex gap-2">
                <Input
                  placeholder="Agregar subtarea..."
                  value={nuevaSubtarea}
                  onChange={e => setNuevaSubtarea(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); handleAddSubtarea() } }}
                  className="flex-1"
                />
                <Button
                  size="sm"
                  onClick={handleAddSubtarea}
                  disabled={savingSubtarea || !nuevaSubtarea.trim()}
                  className="gap-1"
                >
                  <Plus className="h-4 w-4" />
                  Agregar
                </Button>
              </div>

              {subtareas.length === 0 ? (
                <div className="text-center py-8">
                  <ListChecks className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
                  <p className="text-sm text-muted-foreground">No hay subtareas</p>
                  <p className="text-xs text-muted-foreground mt-1">Divide esta tarea en pasos más pequeños</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {/* Barra de progreso de subtareas */}
                  {subtareas.length > 0 && (
                    <div className="space-y-1 mb-3">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{subtareas.filter(s => s.completada).length} de {subtareas.length} completadas</span>
                        <span>{Math.round((subtareas.filter(s => s.completada).length / subtareas.length) * 100)}%</span>
                      </div>
                      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full satin-green-bg rounded-full transition-all duration-500"
                          style={{ width: `${Math.round((subtareas.filter(s => s.completada).length / subtareas.length) * 100)}%` }}
                        />
                      </div>
                    </div>
                  )}
                  {subtareas.map(sub => (
                    <div
                      key={sub.id}
                      className="flex items-center gap-3 p-3 rounded-lg glass-subtle hover:bg-white/10 transition-colors group"
                    >
                      <Checkbox
                        id={`sub-${sub.id}`}
                        checked={sub.completada}
                        onCheckedChange={() => handleToggleSubtarea(sub)}
                      />
                      <label
                        htmlFor={`sub-${sub.id}`}
                        className={`flex-1 text-sm cursor-pointer ${sub.completada ? "line-through text-muted-foreground" : ""}`}
                      >
                        {sub.titulo}
                      </label>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
                        onClick={() => handleDeleteSubtarea(sub.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="evidencias" className="space-y-4 mt-4">
              <div
                className="border-2 border-dashed border-border/60 rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.rar,.txt,.csv"
                  className="hidden"
                  onChange={handleFileUpload}
                />
                <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                <p className="text-sm font-medium">
                  {uploading ? "Subiendo archivos..." : "Haz clic o arrastra archivos aquí"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Imágenes, PDFs, documentos, hojas de cálculo (máx. 5MB)
                </p>
              </div>

              {tarea.evidencias.length === 0 ? (
                <div className="text-center py-8">
                  <Paperclip className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
                  <p className="text-sm text-muted-foreground">No hay evidencias adjuntas</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Sube imágenes o archivos como evidencia de esta tarea
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {tarea.evidencias.map((evidencia) => (
                    <div
                      key={evidencia.id}
                      className="flex items-center gap-3 p-3 rounded-lg glass-subtle hover:bg-white/10 transition-colors group"
                    >
                      <div className="shrink-0">
                        {evidencia.tipo === "imagen" ? (
                          <div
                            className="size-12 rounded-lg bg-cover bg-center border border-border/40 cursor-pointer hover:opacity-80 transition-opacity"
                            style={{ backgroundImage: `url(${evidencia.url})` }}
                            onClick={() => setPreviewUrl(evidencia.url)}
                          />
                        ) : (
                          <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center">
                            <FileText className="h-6 w-6 text-primary" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{evidencia.nombre}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{formatFileSize(evidencia.tamaño)}</span>
                          <span>•</span>
                          <span>{new Date(evidencia.fechaSubida).toLocaleDateString("es-ES")}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {evidencia.tipo === "imagen" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => setPreviewUrl(evidencia.url)}
                          >
                            <ImageIcon className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => handleDownload(evidencia)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                          onClick={() => handleRemoveEvidencia(evidencia.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      <Dialog open={!!previewUrl} onOpenChange={() => setPreviewUrl(null)}>
        <DialogContent className="sm:max-w-4xl p-2">
          <DialogHeader className="sr-only">
            <DialogTitle>Vista previa de imagen</DialogTitle>
            <DialogDescription>Vista previa de la evidencia</DialogDescription>
          </DialogHeader>
          {previewUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={previewUrl}
              alt="Vista previa"
              className="w-full h-auto rounded-lg max-h-[80vh] object-contain"
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
