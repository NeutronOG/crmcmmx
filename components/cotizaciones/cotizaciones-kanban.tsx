"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DollarSign, Calendar } from "lucide-react"

const columnas = [
  { id: "borrador", titulo: "Borrador", color: "bg-gray-500", items: [] as { id: number; cliente: string; valor: string; fecha: string; tipo: string }[] },
  { id: "enviada", titulo: "Enviada", color: "satin-blue-solid", items: [] as { id: number; cliente: string; valor: string; fecha: string; tipo: string }[] },
  { id: "negociacion", titulo: "En Negociación", color: "satin-purple-solid", items: [] as { id: number; cliente: string; valor: string; fecha: string; tipo: string }[] },
  { id: "aprobada", titulo: "Aprobada", color: "satin-green-bg", items: [] as { id: number; cliente: string; valor: string; fecha: string; tipo: string }[] },
]

export function CotizacionesKanban() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {columnas.map((columna) => (
        <Card key={columna.id} className="glass border-white/10">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <div className={`w-3 h-3 rounded-full ${columna.color}`} />
              {columna.titulo}
              <Badge variant="secondary" className="ml-auto">
                {columna.items.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {columna.items.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300 cursor-pointer group"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-gradient-to-br from-primary/20 to-secondary/20 text-xs">
                      {item.cliente.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium text-sm group-hover:text-primary transition-colors">
                    {item.cliente}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-3 w-3 satin-green" />
                    {item.valor}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {item.fecha}
                  </div>
                </div>
                <Badge variant="outline" className="mt-2 text-xs">
                  {item.tipo}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
