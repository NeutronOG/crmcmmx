"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Download, Send, Eye, MoreVertical, DollarSign } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

type Invoice = {
  id: string
  number: string
  client: string
  project: string
  amount: number
  status: "paid" | "pending" | "overdue" | "draft"
  issueDate: string
  dueDate: string
  paidDate?: string
}

const invoices: Invoice[] = [
  {
    id: "1",
    number: "INV-2025-042",
    client: "Tech Solutions SA",
    project: "Campaña Google Ads Q1",
    amount: 15000,
    status: "pending",
    issueDate: "2025-01-10",
    dueDate: "2025-01-20",
  },
  {
    id: "2",
    number: "INV-2025-041",
    client: "FinTech Pro",
    project: "Estrategia Marketing Q4",
    amount: 30000,
    status: "paid",
    issueDate: "2025-01-08",
    dueDate: "2025-01-18",
    paidDate: "2025-01-15",
  },
  {
    id: "3",
    number: "INV-2025-040",
    client: "eShop México",
    project: "Landing Page eCommerce",
    amount: 12000,
    status: "paid",
    issueDate: "2025-01-05",
    dueDate: "2025-01-15",
    paidDate: "2025-01-12",
  },
  {
    id: "4",
    number: "INV-2025-039",
    client: "RetailMart",
    project: "Social Media Management",
    amount: 5000,
    status: "pending",
    issueDate: "2025-01-08",
    dueDate: "2025-01-18",
  },
  {
    id: "5",
    number: "INV-2025-031",
    client: "StartupXYZ",
    project: "Rediseño de Marca",
    amount: 8000,
    status: "overdue",
    issueDate: "2024-12-28",
    dueDate: "2025-01-10",
  },
]

export function InvoicesList() {
  const getStatusBadge = (status: Invoice["status"]) => {
    const variants = {
      paid: { variant: "default" as const, label: "Pagada", color: "satin-green" },
      pending: { variant: "secondary" as const, label: "Pendiente", color: "satin-yellow" },
      overdue: { variant: "destructive" as const, label: "Vencida", color: "satin-red" },
      draft: { variant: "outline" as const, label: "Borrador", color: "text-white/40" },
    }
    return variants[status]
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Facturas Recientes</h2>
        <Button variant="outline" size="sm">
          Ver Todas
        </Button>
      </div>

      <div className="grid gap-4">
        {invoices.map((invoice) => {
          const statusInfo = getStatusBadge(invoice.status)

          return (
            <Card
              key={invoice.id}
              className="glass-card p-6 rounded-xl hover:scale-[1.01] transition-all duration-300 group"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="p-3 rounded-xl bg-primary/10 text-primary">
                    <FileText className="h-6 w-6" />
                  </div>

                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                        {invoice.number}
                      </h3>
                      <Badge variant={statusInfo.variant} className="rounded-full">
                        {statusInfo.label}
                      </Badge>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm font-medium text-foreground">{invoice.client}</p>
                      <p className="text-sm text-muted-foreground">{invoice.project}</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Monto</p>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4 satin-green" />
                          <p className="text-sm font-semibold satin-green">
                            ${invoice.amount.toLocaleString("es-MX")}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Emisión</p>
                        <p className="text-sm font-semibold text-foreground">
                          {new Date(invoice.issueDate).toLocaleDateString("es-ES")}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Vencimiento</p>
                        <p className="text-sm font-semibold text-foreground">
                          {new Date(invoice.dueDate).toLocaleDateString("es-ES")}
                        </p>
                      </div>
                      {invoice.paidDate && (
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">Fecha de Pago</p>
                          <p className="text-sm font-semibold satin-green">
                            {new Date(invoice.paidDate).toLocaleDateString("es-ES")}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                    <Eye className="h-4 w-4" />
                    Ver
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                    <Download className="h-4 w-4" />
                    PDF
                  </Button>
                  {invoice.status === "pending" && (
                    <Button size="sm" className="gap-2">
                      <Send className="h-4 w-4" />
                      Enviar
                    </Button>
                  )}

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Editar</DropdownMenuItem>
                      <DropdownMenuItem>Duplicar</DropdownMenuItem>
                      <DropdownMenuItem>Marcar como pagada</DropdownMenuItem>
                      <DropdownMenuItem>Enviar recordatorio</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">Cancelar</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
