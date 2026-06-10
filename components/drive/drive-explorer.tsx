"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Folder,
  FileText,
  Image,
  Video,
  Music,
  Archive,
  ExternalLink,
  ChevronRight,
  Home,
  Search,
  RefreshCw,
  Loader2,
  Upload,
  FolderPlus,
  MoreVertical,
  Trash2,
  Edit2,
  X,
} from "lucide-react"
import { toast } from "sonner"

interface DriveFile {
  id: string
  name: string
  mimeType: string
  size?: string
  modifiedTime: string
  webViewLink?: string
  thumbnailLink?: string
  shared?: boolean
}

interface BreadcrumbItem {
  id: string
  name: string
}

function getFileIcon(mimeType: string) {
  if (mimeType === "application/vnd.google-apps.folder") return <Folder className="w-5 h-5 text-amber-400" />
  if (mimeType.startsWith("image/") || mimeType === "application/vnd.google-apps.photo") return <Image className="w-5 h-5 text-blue-400" />
  if (mimeType.startsWith("video/") || mimeType === "application/vnd.google-apps.video") return <Video className="w-5 h-5 text-purple-400" />
  if (mimeType.startsWith("audio/")) return <Music className="w-5 h-5 text-pink-400" />
  if (mimeType === "application/zip" || mimeType === "application/x-rar-compressed") return <Archive className="w-5 h-5 text-orange-400" />
  return <FileText className="w-5 h-5 text-muted-foreground" />
}

function formatSize(size?: string): string {
  if (!size) return "—"
  const bytes = parseInt(size)
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

export function DriveExplorer() {
  const [files, setFiles] = useState<DriveFile[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [breadcrumb, setBreadcrumb] = useState<BreadcrumbItem[]>([{ id: "root", name: "Mi unidad" }])
  const [search, setSearch] = useState("")
  const [searchInput, setSearchInput] = useState("")
  const [nextPageToken, setNextPageToken] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isCreatingFolder, setIsCreatingFolder] = useState(false)
  const [newFolderName, setNewFolderName] = useState("")
  const [renamingFile, setRenamingFile] = useState<DriveFile | null>(null)
  const [newFileName, setNewFileName] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const currentFolder = breadcrumb[breadcrumb.length - 1]

  const loadFiles = useCallback(async (folderId: string, query?: string, pageToken?: string) => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      if (query) {
        params.set("q", `name contains '${query.replace(/'/g, "\\'")}' and trashed=false`)
      } else {
        params.set("folderId", folderId)
      }
      if (pageToken) params.set("pageToken", pageToken)

      const res = await fetch(`/api/drive/files?${params}`)
      if (res.status === 401) {
        setError("unauthenticated")
        return
      }
      if (!res.ok) {
        const data = await res.json()
        setError(data.error ?? "Error cargando archivos")
        return
      }
      const data = await res.json()
      setFiles(pageToken ? prev => [...prev, ...(data.files ?? [])] : (data.files ?? []))
      setNextPageToken(data.nextPageToken ?? null)
    } catch {
      setError("Error de conexión")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadFiles(currentFolder.id, search || undefined)
  }, [currentFolder.id, search, loadFiles])

  const handleFolderClick = (file: DriveFile) => {
    if (file.mimeType !== "application/vnd.google-apps.folder") return
    setBreadcrumb(prev => [...prev, { id: file.id, name: file.name }])
    setSearch("")
    setSearchInput("")
  }

  const handleBreadcrumb = (index: number) => {
    setBreadcrumb(prev => prev.slice(0, index + 1))
    setSearch("")
    setSearchInput("")
  }

  const handleSearch = () => {
    setSearch(searchInput.trim())
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("folderId", currentFolder.id)

      const res = await fetch("/api/drive/upload", {
        method: "POST",
        body: formData,
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Upload failed")
      }

      toast.success(`"${file.name}" subido correctamente`)
      loadFiles(currentFolder.id, search || undefined)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al subir archivo")
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return

    setIsCreatingFolder(true)
    try {
      const res = await fetch("/api/drive/folders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newFolderName.trim(),
          parentId: currentFolder.id,
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Create folder failed")
      }

      toast.success(`Carpeta "${newFolderName}" creada`)
      setNewFolderName("")
      setIsCreatingFolder(false)
      loadFiles(currentFolder.id, search || undefined)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al crear carpeta")
    }
  }

  const handleDelete = async (file: DriveFile) => {
    if (!confirm(`¿Eliminar "${file.name}"?`)) return

    try {
      const res = await fetch(`/api/drive/files/${file.id}`, {
        method: "DELETE",
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Delete failed")
      }

      toast.success(`"${file.name}" eliminado`)
      setFiles(prev => prev.filter(f => f.id !== file.id))
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al eliminar")
    }
  }

  const handleRename = async () => {
    if (!renamingFile || !newFileName.trim()) return

    try {
      const res = await fetch(`/api/drive/files/${renamingFile.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newFileName.trim() }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Rename failed")
      }

      toast.success(`Renombrado a "${newFileName}"`)
      setRenamingFile(null)
      setNewFileName("")
      loadFiles(currentFolder.id, search || undefined)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al renombrar")
    }
  }

  const startRename = (file: DriveFile) => {
    setRenamingFile(file)
    setNewFileName(file.name)
  }

  if (error === "unauthenticated") return null

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-1 flex-1 relative min-w-[200px]">
          <Search className="absolute left-3 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar archivos..."
            className="pl-9 bg-background/60"
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSearch()}
          />
        </div>
        <Button variant="outline" size="sm" onClick={handleSearch} className="bg-transparent">
          Buscar
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => loadFiles(currentFolder.id, search || undefined)}
          className="gap-1"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </Button>
        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="gap-1 bg-transparent"
          >
            {isUploading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Upload className="w-4 h-4" />
            )}
            Subir
          </Button>
          <Dialog open={isCreatingFolder} onOpenChange={setIsCreatingFolder}>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsCreatingFolder(true)}
              className="gap-1 bg-transparent"
            >
              <FolderPlus className="w-4 h-4" />
              Nueva carpeta
            </Button>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Crear nueva carpeta</DialogTitle>
              </DialogHeader>
              <Input
                placeholder="Nombre de la carpeta"
                value={newFolderName}
                onChange={e => setNewFolderName(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleCreateFolder()}
              />
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreatingFolder(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCreateFolder} disabled={!newFolderName.trim()}>
                  Crear
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Breadcrumb */}
      {!search && (
        <div className="flex items-center gap-1 text-sm">
          {breadcrumb.map((item, i) => (
            <span key={item.id} className="flex items-center gap-1">
              {i === 0 ? (
                <button
                  onClick={() => handleBreadcrumb(0)}
                  className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Home className="w-3.5 h-3.5" />
                  {item.name}
                </button>
              ) : (
                <>
                  <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50" />
                  <button
                    onClick={() => handleBreadcrumb(i)}
                    className={
                      i === breadcrumb.length - 1
                        ? "font-medium text-foreground"
                        : "text-muted-foreground hover:text-foreground transition-colors"
                    }
                  >
                    {item.name}
                  </button>
                </>
              )}
            </span>
          ))}
        </div>
      )}

      {/* Files grid */}
      <Card className="bg-card/60 backdrop-blur-sm border-border/40 overflow-hidden">
        {loading && files.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <div className="text-center py-20 text-destructive text-sm">{error}</div>
        ) : files.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground text-sm">
            {search ? "No se encontraron archivos." : "Esta carpeta está vacía."}
          </div>
        ) : (
          <div className="divide-y divide-border/30">
            {files.map(file => (
              <div
                key={file.id}
                className={`flex items-center gap-3 px-4 py-3 hover:bg-muted/30 transition-colors group ${
                  file.mimeType === "application/vnd.google-apps.folder" ? "cursor-pointer" : ""
                }`}
                onClick={() => handleFolderClick(file)}
              >
                <div className="shrink-0">{getFileIcon(file.mimeType)}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Modificado {formatDate(file.modifiedTime)}
                    {file.size && ` · ${formatSize(file.size)}`}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {file.shared && (
                    <Badge variant="secondary" className="text-xs">Compartido</Badge>
                  )}
                  {file.webViewLink && (
                    <a
                      href={file.webViewLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={e => e.stopPropagation()}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ExternalLink className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                    </a>
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={e => e.stopPropagation()}
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation()
                        startRename(file)
                      }}>
                        <Edit2 className="w-4 h-4 mr-2" />
                        Renombrar
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDelete(file)
                        }}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Load more */}
      {nextPageToken && !loading && (
        <div className="flex justify-center">
          <Button
            variant="outline"
            size="sm"
            className="bg-transparent"
            onClick={() => loadFiles(currentFolder.id, search || undefined, nextPageToken)}
          >
            Cargar más archivos
          </Button>
        </div>
      )}

      {/* Rename Dialog */}
      <Dialog open={!!renamingFile} onOpenChange={() => setRenamingFile(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Renombrar archivo</DialogTitle>
          </DialogHeader>
          <Input
            value={newFileName}
            onChange={e => setNewFileName(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleRename()}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setRenamingFile(null)}>
              Cancelar
            </Button>
            <Button onClick={handleRename} disabled={!newFileName.trim()}>
              Renombrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
