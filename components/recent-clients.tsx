"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { useEffect, useState } from "react"
import { getClientes } from "@/lib/store"
import Link from "next/link"

export function RecentClients() {
  const [clients, setClients] = useState<{ name: string; contact: string; status: string; initials: string; color: string }[]>([])

  useEffect(() => {
    getClientes().then((data) => {
      setClients(data.slice(0, 5).map((c, i) => ({
        name: c.empresa || c.nombre,
        contact: c.nombre,
        status: c.estado,
        initials: (c.empresa || c.nombre).substring(0, 2).toUpperCase(),
        color: i % 2 === 0 ? "liquid-gradient" : "liquid-gradient-alt",
      })))
    })
  }, [])

  return (
    <Card className="glass-intense border-white/10 hover:shadow-2xl hover:shadow-black/30 transition-all duration-500">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle className="text-2xl font-bold">Clientes Recientes</CardTitle>
          <CardDescription className="text-muted-foreground/80">Últimos clientes agregados al sistema</CardDescription>
        </div>
        <Button variant="ghost" size="sm" className="hover:bg-white/10 gap-2 group">
          Ver todos
          <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform duration-300" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {clients.map((client, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 rounded-2xl glass-subtle hover:glass-intense transition-all duration-300 cursor-pointer group border border-white/5 hover:border-white/20"
            >
              <div className="flex items-center gap-4">
                <Avatar
                  className={`${client.color} size-12 ring-2 ring-white/20 group-hover:ring-white/40 group-hover:scale-110 transition-all duration-300 shadow-lg`}
                >
                  <AvatarFallback className="text-white dark:text-white font-bold text-sm bg-transparent">
                    {client.initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold leading-none text-foreground group-hover:text-foreground/80 transition-colors duration-300">
                    {client.name}
                  </p>
                  <p className="text-sm text-muted-foreground/80 mt-1.5">{client.contact}</p>
                </div>
              </div>
              <Badge
                variant={client.status === "Activo" ? "default" : "secondary"}
                className={`font-medium px-3 py-1 ${
                  client.status === "Activo"
                    ? "satin-green-bg satin-green border satin-green-border"
                    : client.status === "Prospecto"
                    ? "satin-yellow-bg satin-yellow border satin-yellow-border"
                    : "bg-muted border border-border text-muted-foreground"
                }`}
              >
                {client.status}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
