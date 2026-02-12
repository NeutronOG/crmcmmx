"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ArrowLeft, Send, Paperclip, Users, FileText, Image as ImageIcon, Download, Loader2, X } from "lucide-react"
import { getIdeaRoomMensajes, sendIdeaRoomMensaje, uploadIdeaRoomFile, crearNotificacion } from "@/lib/store"
import type { IdeaRoom, IdeaRoomMensaje } from "@/lib/store"
import { useAuth } from "@/components/auth-provider"
import { toast } from "sonner"

interface IdeaRoomChatProps {
  room: IdeaRoom
  onBack: () => void
}

const isImageFile = (name: string) => /\.(jpg|jpeg|png|gif|webp|svg|bmp)$/i.test(name)

const URL_PATTERN = /(https?:\/\/[^\s<]+[^\s<.,;:!?"'()\[\]{}])/g

function Linkify({ children }: { children: string }) {
  const parts: { text: string; isUrl: boolean }[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null
  const regex = new RegExp(URL_PATTERN.source, 'g')
  while ((match = regex.exec(children)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ text: children.slice(lastIndex, match.index), isUrl: false })
    }
    parts.push({ text: match[0], isUrl: true })
    lastIndex = regex.lastIndex
  }
  if (lastIndex < children.length) {
    parts.push({ text: children.slice(lastIndex), isUrl: false })
  }
  if (parts.length === 0) return <>{children}</>
  return (
    <>
      {parts.map((part, i) =>
        part.isUrl ? (
          <a
            key={i}
            href={part.text}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 text-blue-400 hover:text-blue-300 break-all"
            onClick={(e) => e.stopPropagation()}
          >
            {part.text.length > 60 ? part.text.slice(0, 60) + '…' : part.text}
          </a>
        ) : (
          <span key={i}>{part.text}</span>
        )
      )}
    </>
  )
}

export function IdeaRoomChat({ room, onBack }: IdeaRoomChatProps) {
  const { usuario } = useAuth()
  const [mensajes, setMensajes] = useState<IdeaRoomMensaje[]>([])
  const [texto, setTexto] = useState("")
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [pendingFiles, setPendingFiles] = useState<File[]>([])
  const scrollRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const load = useCallback(async () => {
    const data = await getIdeaRoomMensajes(room.id)
    setMensajes(data)
    setLoading(false)
  }, [room.id])

  useEffect(() => {
    load()
    const interval = setInterval(load, 5000)
    return () => clearInterval(interval)
  }, [load])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [mensajes])

  const notifyParticipants = async (preview: string) => {
    if (!usuario) return
    for (const p of room.participantes) {
      if (p !== usuario.nombre) {
        await crearNotificacion({
          usuarioDestino: p,
          tipo: "idea_room",
          titulo: `Nuevo mensaje en ${room.nombre}`,
          mensaje: `${usuario.nombre}: ${preview.substring(0, 80)}`,
        })
      }
    }
  }

  const handleSend = async () => {
    if (!usuario || (!texto.trim() && pendingFiles.length === 0)) return
    setSending(true)
    try {
      // Upload pending files first
      if (pendingFiles.length > 0) {
        setUploading(true)
        for (const file of pendingFiles) {
          const { url, nombre } = await uploadIdeaRoomFile(room.id, file)
          const isImg = isImageFile(nombre)
          await sendIdeaRoomMensaje({
            ideaRoomId: room.id,
            autor: usuario.nombre,
            contenido: texto.trim() || nombre,
            tipo: isImg ? "imagen" : "archivo",
            archivoUrl: url,
            archivoNombre: nombre,
          })
          await notifyParticipants(isImg ? `📷 ${nombre}` : `📎 ${nombre}`)
        }
        // If there was also text and multiple files, send text separately
        if (texto.trim() && pendingFiles.length > 0) {
          // Text was already included in the first file message, skip
        }
        setPendingFiles([])
        setUploading(false)
      } else {
        // Text-only message
        await sendIdeaRoomMensaje({
          ideaRoomId: room.id,
          autor: usuario.nombre,
          contenido: texto.trim(),
        })
        await notifyParticipants(texto.trim())
      }

      setTexto("")
      await load()
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error al enviar mensaje"
      toast.error(msg)
      console.error("Idea Room send error:", err)
      setUploading(false)
    } finally {
      setSending(false)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    setPendingFiles(prev => [...prev, ...Array.from(files)])
    e.target.value = ""
  }

  const removePendingFile = (idx: number) => {
    setPendingFiles(prev => prev.filter((_, i) => i !== idx))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const getInitials = (name: string) =>
    name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()

  const getColor = (name: string) => {
    const colors = [
      "satin-blue-solid", "satin-purple-solid", "satin-green-bg", "satin-purple-solid",
      "satin-cyan-solid", "satin-pink-solid", "satin-red-solid", "satin-cyan-solid",
    ]
    let hash = 0
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
    return colors[Math.abs(hash) % colors.length]
  }

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr)
    const now = new Date()
    const isToday = d.toDateString() === now.toDateString()
    if (isToday) return d.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })
    return d.toLocaleDateString("es-MX", { day: "numeric", month: "short" }) + " " + d.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })
  }

  const renderMessageContent = (msg: IdeaRoomMensaje, isOwn: boolean) => {
    if (msg.tipo === "imagen" && msg.archivoUrl) {
      return (
        <div className="space-y-1.5">
          <a href={msg.archivoUrl} target="_blank" rel="noopener noreferrer" className="block">
            <img
              src={msg.archivoUrl}
              alt={msg.archivoNombre || "imagen"}
              className="max-w-[240px] max-h-[200px] rounded-lg object-cover hover:opacity-90 transition-opacity cursor-pointer"
            />
          </a>
          {msg.contenido && msg.contenido !== msg.archivoNombre && (
            <p><Linkify>{msg.contenido}</Linkify></p>
          )}
        </div>
      )
    }

    if (msg.tipo === "archivo" && msg.archivoUrl) {
      return (
        <div className="space-y-1.5">
          <a
            href={msg.archivoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
              isOwn ? "bg-white/10 hover:satin-slate-bg" : "bg-white/5 hover:bg-white/10"
            }`}
          >
            <FileText className="size-4 shrink-0" />
            <span className="text-xs font-medium truncate">{msg.archivoNombre || "Archivo"}</span>
            <Download className="size-3.5 shrink-0 ml-auto" />
          </a>
          {msg.contenido && msg.contenido !== msg.archivoNombre && (
            <p><Linkify>{msg.contenido}</Linkify></p>
          )}
        </div>
      )
    }

    return <Linkify>{msg.contenido}</Linkify>
  }

  return (
    <div className="flex flex-col h-[600px]">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-white/10">
        <Button variant="ghost" size="icon" className="size-8 hover:bg-white/10" onClick={onBack}>
          <ArrowLeft className="size-4" />
        </Button>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold truncate">{room.nombre}</h3>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Users className="size-3" />
            <span>{room.participantes.join(", ")}</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto py-4 space-y-4">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-pulse text-muted-foreground">Cargando mensajes...</div>
          </div>
        ) : mensajes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-sm">Sin mensajes aún. ¡Inicia la conversación!</p>
          </div>
        ) : (
          mensajes.map((msg, idx) => {
            const isOwn = msg.autor === usuario?.nombre
            const showAvatar = idx === 0 || mensajes[idx - 1].autor !== msg.autor

            return (
              <div key={msg.id} className={`flex gap-2 ${isOwn ? "flex-row-reverse" : ""}`}>
                {showAvatar ? (
                  <Avatar className={`size-7 shrink-0 ${getColor(msg.autor)}`}>
                    <AvatarFallback className="text-white text-[10px] font-bold bg-transparent">
                      {getInitials(msg.autor)}
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <div className="size-7 shrink-0" />
                )}
                <div className={`max-w-[75%] ${isOwn ? "items-end" : "items-start"}`}>
                  {showAvatar && !isOwn && (
                    <p className="text-[10px] font-medium text-muted-foreground mb-0.5 px-1">{msg.autor}</p>
                  )}
                  <div className={`px-3 py-2 rounded-2xl text-sm ${
                    isOwn
                      ? "bg-primary text-primary-foreground rounded-br-md"
                      : "glass-card rounded-bl-md"
                  }`}>
                    {renderMessageContent(msg, isOwn)}
                  </div>
                  <p className={`text-[10px] text-muted-foreground/50 mt-0.5 px-1 ${isOwn ? "text-right" : ""}`}>
                    {formatTime(msg.createdAt)}
                  </p>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Pending files preview */}
      {pendingFiles.length > 0 && (
        <div className="px-1 pt-2 flex gap-2 flex-wrap">
          {pendingFiles.map((file, idx) => (
            <div key={idx} className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-xs">
              {isImageFile(file.name) ? (
                <ImageIcon className="size-3 satin-blue" />
              ) : (
                <FileText className="size-3 satin-blue" />
              )}
              <span className="truncate max-w-[120px]">{file.name}</span>
              <button onClick={() => removePendingFile(idx)} className="hover:satin-red transition-colors">
                <X className="size-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="pt-3 border-t border-white/10">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleFileSelect}
          accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.rar,.ai,.psd,.fig,.sketch,.mp4,.mov"
        />
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 hover:bg-white/10"
            onClick={() => fileInputRef.current?.click()}
            disabled={sending}
          >
            <Paperclip className="size-4" />
          </Button>
          <Input
            placeholder="Escribe un mensaje..."
            value={texto}
            onChange={e => setTexto(e.target.value)}
            onKeyDown={handleKeyDown}
            className="bg-transparent border-white/10 flex-1"
            disabled={sending}
          />
          <Button
            size="icon"
            className="liquid-gradient border border-white/20 shrink-0"
            onClick={handleSend}
            disabled={(!texto.trim() && pendingFiles.length === 0) || sending}
          >
            {uploading ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
          </Button>
        </div>
      </div>
    </div>
  )
}
