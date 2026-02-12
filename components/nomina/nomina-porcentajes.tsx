"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Percent, TrendingUp, DollarSign } from "lucide-react"

const porcentajes = [
  {
    rol: "Director Creativo",
    porcentaje: 15,
    base: "$3,500",
    comision: "$2,250",
    total: "$5,750",
    proyectos: 8,
  },
  {
    rol: "Diseñador Senior",
    porcentaje: 10,
    base: "$2,800",
    comision: "$1,500",
    total: "$4,300",
    proyectos: 12,
  },
  {
    rol: "Community Manager",
    porcentaje: 8,
    base: "$2,200",
    comision: "$880",
    total: "$3,080",
    proyectos: 15,
  },
  {
    rol: "Ejecutivo de Cuentas",
    porcentaje: 12,
    base: "$2,500",
    comision: "$1,800",
    total: "$4,300",
    proyectos: 6,
  },
  {
    rol: "Creador de Contenido",
    porcentaje: 5,
    base: "$1,800",
    comision: "$450",
    total: "$2,250",
    proyectos: 20,
  },
]

const distribucion = [
  { nombre: "Salarios Base", valor: 60, monto: "$27,480" },
  { nombre: "Comisiones", valor: 25, monto: "$11,450" },
  { nombre: "Bonos", valor: 10, monto: "$4,580" },
  { nombre: "Otros", valor: 5, monto: "$2,290" },
]

export function NominaPorcentajes() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="glass border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Percent className="h-5 w-5 text-primary" />
            Estructura de Comisiones por Rol
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {porcentajes.map((item) => (
            <div
              key={item.rol}
              className="p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">{item.rol}</span>
                <Badge className="bg-primary/20 text-primary">
                  {item.porcentaje}% comisión
                </Badge>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Base</p>
                  <p className="font-medium">{item.base}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Comisión</p>
                  <p className="font-medium satin-green">{item.comision}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Total</p>
                  <p className="font-bold">{item.total}</p>
                </div>
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                {item.proyectos} proyectos este mes
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="glass border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 satin-green" />
            Distribución de Nómina
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {distribucion.map((item) => (
            <div key={item.nombre} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{item.nombre}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{item.monto}</span>
                  <Badge variant="outline" className="text-xs">
                    {item.valor}%
                  </Badge>
                </div>
              </div>
              <Progress value={item.valor} className="h-3" />
            </div>
          ))}

          <div className="pt-4 border-t border-white/10">
            <div className="flex items-center justify-between">
              <span className="font-medium">Total Nómina</span>
              <span className="text-2xl font-bold satin-green">$45,800</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <TrendingUp className="h-3 w-3 satin-green" />
              +12% vs mes anterior
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
