"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Calendar, Heart, MessageCircle, Share2, Eye } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface MetricoolPost {
  id?: string
  text?: string
  message?: string
  content?: string
  scheduledAt?: string
  publishedAt?: string
  createdAt?: string
  date?: string
  network?: string
  platform?: string
  metrics?: {
    likes?: number
    comments?: number
    shares?: number
    reach?: number
    impressions?: number
  }
  likes?: number
  comments?: number
  shares?: number
  reach?: number
  url?: string
  permalink?: string
  status?: string
}

interface MetricoolPostsProps {
  data: Record<string, unknown> | null
  scheduledData: Record<string, unknown> | null
  loading: boolean
}

function normalizePost(p: Record<string, unknown>): MetricoolPost {
  return {
    id: String(p.id ?? Math.random()),
    text: String(p.text ?? p.message ?? p.content ?? "Sin texto"),
    date: String(p.scheduledAt ?? p.publishedAt ?? p.createdAt ?? p.date ?? ""),
    network: String(p.network ?? p.platform ?? ""),
    likes: Number(p.likes ?? p.metrics?.likes ?? 0),
    comments: Number(p.comments ?? p.metrics?.comments ?? 0),
    shares: Number(p.shares ?? p.metrics?.shares ?? 0),
    reach: Number(p.reach ?? p.metrics?.reach ?? 0),
    url: String(p.url ?? p.permalink ?? ""),
    status: String(p.status ?? "published"),
  }
}

const networkColors: Record<string, string> = {
  instagram: "bg-pink-500/15 text-pink-400 border-pink-500/30",
  facebook: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  twitter: "bg-sky-500/15 text-sky-400 border-sky-500/30",
  x: "bg-sky-500/15 text-sky-400 border-sky-500/30",
  linkedin: "bg-indigo-500/15 text-indigo-400 border-indigo-500/30",
  tiktok: "bg-fuchsia-500/15 text-fuchsia-400 border-fuchsia-500/30",
  youtube: "bg-red-500/15 text-red-400 border-red-500/30",
}

function PostCard({ post }: { post: MetricoolPost }) {
  const dateStr = post.date
    ? format(new Date(post.date), "d MMM yyyy · HH:mm", { locale: es })
    : "—"
  const netColor = networkColors[post.network?.toLowerCase() ?? ""] ?? "bg-muted/50 text-muted-foreground border-border/40"

  return (
    <Card className="bg-card/60 backdrop-blur-sm border-border/40 p-4 space-y-3 hover:border-border/60 transition-colors">
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm leading-relaxed line-clamp-3 flex-1">{post.text}</p>
        {post.url && (
          <a href={post.url} target="_blank" rel="noopener noreferrer" className="shrink-0">
            <ExternalLink className="w-4 h-4 text-muted-foreground hover:text-foreground transition-colors" />
          </a>
        )}
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {post.network && (
          <Badge variant="outline" className={`text-xs capitalize ${netColor}`}>
            {post.network}
          </Badge>
        )}
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <Calendar className="w-3 h-3" />
          {dateStr}
        </span>
      </div>

      {(post.likes! > 0 || post.comments! > 0 || post.shares! > 0 || post.reach! > 0) && (
        <div className="flex items-center gap-4 text-xs text-muted-foreground border-t border-border/30 pt-2">
          {post.likes! > 0 && (
            <span className="flex items-center gap-1">
              <Heart className="w-3.5 h-3.5" />
              {post.likes!.toLocaleString()}
            </span>
          )}
          {post.comments! > 0 && (
            <span className="flex items-center gap-1">
              <MessageCircle className="w-3.5 h-3.5" />
              {post.comments!.toLocaleString()}
            </span>
          )}
          {post.shares! > 0 && (
            <span className="flex items-center gap-1">
              <Share2 className="w-3.5 h-3.5" />
              {post.shares!.toLocaleString()}
            </span>
          )}
          {post.reach! > 0 && (
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              {post.reach!.toLocaleString()}
            </span>
          )}
        </div>
      )}
    </Card>
  )
}

export function MetricoolPosts({ data, scheduledData, loading }: MetricoolPostsProps) {
  if (loading) {
    return (
      <div className="grid md:grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="bg-card/60 backdrop-blur-sm border-border/40 p-4 animate-pulse space-y-3">
            <div className="h-4 w-full bg-muted rounded" />
            <div className="h-4 w-3/4 bg-muted rounded" />
            <div className="h-3 w-1/3 bg-muted rounded" />
          </Card>
        ))}
      </div>
    )
  }

  const published: MetricoolPost[] = Array.isArray((data as Record<string, unknown>)?.posts)
    ? ((data as Record<string, unknown>).posts as Record<string, unknown>[]).map(normalizePost)
    : Array.isArray(data)
    ? (data as Record<string, unknown>[]).map(normalizePost)
    : []

  const scheduled: MetricoolPost[] = Array.isArray((scheduledData as Record<string, unknown>)?.posts)
    ? ((scheduledData as Record<string, unknown>).posts as Record<string, unknown>[]).map(normalizePost)
    : Array.isArray(scheduledData)
    ? (scheduledData as Record<string, unknown>[]).map(normalizePost)
    : []

  if (!published.length && !scheduled.length) {
    return (
      <Card className="bg-card/60 backdrop-blur-sm border-border/40 p-8 text-center">
        <p className="text-muted-foreground text-sm">
          No hay publicaciones disponibles para este período.
        </p>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {scheduled.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Próximas publicaciones</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {scheduled.slice(0, 6).map(p => <PostCard key={p.id} post={p} />)}
          </div>
        </div>
      )}

      {published.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Publicaciones recientes</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {published.slice(0, 12).map(p => <PostCard key={p.id} post={p} />)}
          </div>
        </div>
      )}
    </div>
  )
}
