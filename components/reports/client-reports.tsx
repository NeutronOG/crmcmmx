"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, Send, Calendar, TrendingUp, BarChart3 } from "lucide-react"

const clientReports = [
  {
    id: 1,
    client: "Tech Solutions SA",
    period: "Enero 2025",
    status: "generated",
    metrics: {
      impressions: "2.4M",
      clicks: "85K",
      conversions: "1,240",
      roi: "325%",
    },
    lastGenerated: "2025-01-12",
    nextScheduled: "2025-02-01",
  },
  {
    id: 2,
    client: "RetailMart",
    period: "Enero 2025",
    status: "scheduled",
    metrics: {
      impressions: "1.8M",
      clicks: "62K",
      conversions: "890",
      roi: "280%",
    },
    lastGenerated: "2024-12-28",
    nextScheduled: "2025-01-31",
  },
  {
    id: 3,
    client: "StartupXYZ",
    period: "Enero 2025",
    status: "sent",
    metrics: {
      impressions: "950K",
      clicks: "38K",
      conversions: "520",
      roi: "245%",
    },
    lastGenerated: "2025-01-10",
    nextScheduled: "2025-02-10",
  },
]

export function ClientReports() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Reportes de Clientes</h2>
        <Button variant="outline" size="sm">
          Generar Todos
        </Button>
      </div>

      <div className="grid gap-4">
        {clientReports.map((report) => (
          <Card key={report.id} className="glass-card p-6 rounded-xl hover:scale-[1.01] transition-all duration-300">
            <div className="flex items-start justify-between">
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-primary/10 text-primary">
                    <BarChart3 className="h-6 w-6" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-semibold">{report.client}</h3>
                      <Badge
                        variant={
                          report.status === "sent" ? "default" : report.status === "generated" ? "secondary" : "outline"
                        }
                        className="rounded-full"
                      >
                        {report.status === "sent"
                          ? "Enviado"
                          : report.status === "generated"
                            ? "Generado"
                            : "Programado"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{report.period}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Impresiones</p>
                    <p className="text-lg font-bold text-white/70">{report.metrics.impressions}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Clicks</p>
                    <p className="text-lg font-bold satin-blue">{report.metrics.clicks}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Conversiones</p>
                    <p className="text-lg font-bold satin-green">{report.metrics.conversions}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">ROI</p>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-4 w-4 satin-green" />
                      <p className="text-lg font-bold satin-green">{report.metrics.roi}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Último: {new Date(report.lastGenerated).toLocaleDateString("es-ES")}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Próximo: {new Date(report.nextScheduled).toLocaleDateString("es-ES")}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                  <Download className="h-4 w-4" />
                  PDF
                </Button>
                <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                  <Send className="h-4 w-4" />
                  Enviar
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
