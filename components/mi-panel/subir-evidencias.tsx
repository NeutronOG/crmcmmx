"use client"

import { useState, useRef, useCallback } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Upload, FileImage, FileText, X, Download, Trash2, Loader2, Image as ImageIcon, File } from "lucide-react"
import { addEvidencia, removeEvidencia, getTareaById, updateTarea, recalcularProgresoProyecto, notificarAdmins } from "@/lib/store"
import type { Tarea, Evidencia } from "@/lib/store"
import { useAuth } from "@/components/auth-provider"
import { toast } from "sonner"

interface SubirEvidenciasProps {
  tarea: Tarea | null
  onUpdate: () => void
  onClose: () => void
}

export function SubirEvidencias({ tarea, onUpdate, onClose }: SubirEvidenciasProps) {
  const { usuario } = useAuth()
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleUpload = useCallback(async (files: FileList | null) => {
    if (!files || !tarea) return
    setUploading(true)
    try {
      for (const file of Array.from(files)) {
        await addEvidencia(tarea.id, file)
      }

      // Auto-move task to "En Revisión" if it was Pendiente or En Progreso
      if (tarea.estado === "Pendiente" || tarea.estado === "En Progreso") {
        await updateTarea(tarea.id, { estado: "En Revisión" })
        if (tarea.proyecto) {
          await recalcularProgresoProyecto(tarea.proyecto)
        }
        // Notify all admins that evidence was uploaded and task is ready for review
        await notificarAdmins({
          tipo: "tarea",
          titulo: "Tarea lista para revisión",
          mensaje: `${usuario?.nombre || "Un empleado"} subió evidencia en "${tarea.titulo}" y está lista para tu revisión`,
        })
        toast.success(`Archivo${files.length > 1 ? "s" : ""} subido${files.length > 1 ? "s" : ""} — Tarea enviada a Revisión`)
      } else {
        toast.success(`${files.length} archivo${files.length > 1 ? "s" : ""} subido${files.length > 1 ? "s" : ""}`)
      }
      onUpdate()
    } catch (err) {
      console.error(err)
      toast.error("Error al subir archivo")
    } finally {
      setUploading(false)
    }
  }, [tarea, onUpdate, usuario])

  const handleRemove = async (evidenciaId: string) => {
    if (!tarea) return
    try {
      await removeEvidencia(tarea.id, evidenciaId)
      toast.success("Evidencia eliminada")
      onUpdate()
    } catch (err) {
      console.error(err)
      toast.error("Error al eliminar evidencia")
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    handleUpload(e.dataTransfer.files)
  }

  if (!tarea) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-white/10 flex items-center justify-center">
            <Upload className="size-5 satin-blue" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Subir Avances</h2>
            <p className="text-sm text-muted-foreground">Sube evidencias y archivos de avance</p>
          </div>
        </div>
        <Card className="glass-card p-8 rounded-xl text-center">
          <Upload className="size-12 mx-auto text-muted-foreground/30 mb-3" />
          <p className="text-muted-foreground">Selecciona una tarea de "Mis Tareas" para subir evidencias</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-white/10 flex items-center justify-center">
            <Upload className="size-5 satin-blue" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Subir Avances</h2>
            <p className="text-sm text-muted-foreground truncate max-w-[200px] sm:max-w-none">
              Tarea: {tarea.titulo}
            </p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose} className="hover:bg-white/10">
          <X className="size-4" />
        </Button>
      </div>

      {/* Drop zone */}
      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer ${
          dragOver
            ? "border-primary bg-primary/5 scale-[1.01]"
            : "border-white/10 hover:border-white/20 hover:bg-white/5"
        }`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => handleUpload(e.target.files)}
          accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.rar,.ai,.psd,.fig,.sketch"
        />
        {uploading ? (
          <div className="space-y-2">
            <Loader2 className="size-10 mx-auto text-primary animate-spin" />
            <p className="text-sm text-muted-foreground">Subiendo archivos...</p>
          </div>
        ) : (
          <div className="space-y-2">
            <Upload className="size-10 mx-auto text-muted-foreground/40" />
            <p className="text-sm font-medium">Arrastra archivos aquí o haz clic para seleccionar</p>
            <p className="text-xs text-muted-foreground">Imágenes, PDFs, documentos, archivos de diseño</p>
          </div>
        )}
      </div>

      {/* Evidencias existentes */}
      {tarea.evidencias.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">
            Archivos subidos ({tarea.evidencias.length})
          </p>
          {tarea.evidencias.map((evi) => (
            <Card key={evi.id} className="glass-card p-3 rounded-xl">
              <div className="flex items-center gap-3">
                <div className={`size-9 rounded-lg flex items-center justify-center shrink-0 ${
                  evi.tipo === "imagen" ? "bg-white/10" : "bg-white/10"
                }`}>
                  {evi.tipo === "imagen" ? (
                    <ImageIcon className="size-4 satin-blue" />
                  ) : (
                    <File className="size-4 satin-blue" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{evi.nombre}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{evi.fechaSubida}</span>
                    <span>&middot;</span>
                    <span>{(evi.tamaño / 1024).toFixed(0)} KB</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <a href={evi.url} target="_blank" rel="noopener noreferrer">
                    <Button variant="ghost" size="icon" className="size-8 hover:bg-white/10">
                      <Download className="size-3.5" />
                    </Button>
                  </a>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 hover:satin-red-bg hover:satin-red"
                    onClick={() => handleRemove(evi.id)}
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
