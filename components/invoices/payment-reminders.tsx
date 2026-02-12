"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, Send, Clock, DollarSign, AlertTriangle } from "lucide-react"

const reminders = [
  {
    id: 1,
    client: "Tech Solutions SA",
    invoice: "INV-2025-042",
    amount: 15000,
    dueDate: "2025-01-20",
    daysOverdue: 0,
    status: "due-soon",
    lastReminder: null,
    autoReminders: true,
  },
  {
    id: 2,
    client: "RetailMart",
    invoice: "INV-2025-038",
    amount: 5000,
    dueDate: "2025-01-18",
    daysOverdue: 0,
    status: "due-soon",
    lastReminder: "2025-01-15",
    autoReminders: true,
  },
  {
    id: 3,
    client: "StartupXYZ",
    invoice: "INV-2025-031",
    amount: 8000,
    dueDate: "2025-01-10",
    daysOverdue: 2,
    status: "overdue",
    lastReminder: "2025-01-11",
    autoReminders: true,
  },
]

export function PaymentReminders() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Bell className="h-6 w-6 satin-yellow" />
          <h2 className="text-2xl font-bold">Recordatorios de Pago</h2>
          <Badge variant="secondary" className="rounded-full">
            {reminders.length}
          </Badge>
        </div>
        <Button variant="outline" size="sm">
          Configurar Automatización
        </Button>
      </div>

      <div className="grid gap-4">
        {reminders.map((reminder) => (
          <Card key={reminder.id} className="glass-card p-5 rounded-xl hover:scale-[1.01] transition-all duration-300">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4 flex-1">
                <div
                  className={`p-3 rounded-xl ${
                    reminder.status === "overdue" ? "satin-red-bg satin-red" : "satin-yellow-bg satin-yellow"
                  }`}
                >
                  {reminder.status === "overdue" ? (
                    <AlertTriangle className="h-6 w-6" />
                  ) : (
                    <Clock className="h-6 w-6" />
                  )}
                </div>

                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-lg">{reminder.client}</h3>
                    <Badge
                      variant={reminder.status === "overdue" ? "destructive" : "secondary"}
                      className="rounded-full"
                    >
                      {reminder.status === "overdue" ? `Vencida ${reminder.daysOverdue}d` : "Próximo vencimiento"}
                    </Badge>
                    {reminder.autoReminders && (
                      <Badge variant="outline" className="rounded-full gap-1">
                        <Bell className="h-3 w-3" />
                        Auto
                      </Badge>
                    )}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Factura</p>
                      <p className="text-sm font-semibold text-foreground">{reminder.invoice}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Monto</p>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4 satin-green" />
                        <p className="text-sm font-semibold text-foreground">
                          ${reminder.amount.toLocaleString("es-MX")}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Vencimiento</p>
                      <p className="text-sm font-semibold text-foreground">
                        {new Date(reminder.dueDate).toLocaleDateString("es-ES")}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Último Recordatorio</p>
                      <p className="text-sm font-semibold text-muted-foreground">
                        {reminder.lastReminder
                          ? new Date(reminder.lastReminder).toLocaleDateString("es-ES")
                          : "No enviado"}
                      </p>
                    </div>
                  </div>

                  {reminder.status === "overdue" && (
                    <div className="flex items-center gap-2 text-sm satin-red">
                      <AlertTriangle className="h-4 w-4" />
                      <span>Recordatorio automático programado para hoy</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Button size="sm" className="gap-2">
                  <Send className="h-4 w-4" />
                  Enviar Ahora
                </Button>
                <Button variant="outline" size="sm">
                  Ver Factura
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
