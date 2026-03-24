"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RefreshCw, DollarSign, TrendingUp, TrendingDown, Calculator, ArrowUpCircle, ArrowDownCircle, Plus, Trash2, X } from "lucide-react"
import { getIngresos, addIngreso, deleteIngreso, getGastos, addGasto, deleteGasto } from "@/lib/store"
import type { Ingreso, Gasto } from "@/lib/store"
import { toast } from "sonner"

type Vista = 'resumen' | 'ingresos' | 'gastos'

const CATEGORIAS_INGRESO = ['Proyecto', 'Consultoría', 'Suscripción', 'Comisión', 'Otro']
const CATEGORIAS_GASTO = ['Nómina', 'Software', 'Marketing', 'Oficina', 'Proveedor', 'Impuestos', 'Otro']

export function FinanzasResumen() {
  const [ingresos, setIngresos] = useState<Ingreso[]>([])
  const [gastos, setGastos] = useState<Gasto[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [vista, setVista] = useState<Vista>('resumen')
  const [showFormIngreso, setShowFormIngreso] = useState(false)
  const [showFormGasto, setShowFormGasto] = useState(false)
  const [saving, setSaving] = useState(false)

  const [formIngreso, setFormIngreso] = useState({ concepto: '', monto: '', fecha: new Date().toISOString().split('T')[0], categoria: 'Proyecto', cliente: '', notas: '' })
  const [formGasto, setFormGasto] = useState({ concepto: '', monto: '', fecha: new Date().toISOString().split('T')[0], categoria: 'Nómina', proveedor: '', notas: '' })

  const loadAll = async () => {
    setIsLoading(true)
    const [i, g] = await Promise.all([getIngresos(), getGastos()])
    setIngresos(i)
    setGastos(g)
    setIsLoading(false)
  }

  useEffect(() => { loadAll() }, [])

  const totalIngresos = ingresos.reduce((s, i) => s + i.monto, 0)
  const totalGastos = gastos.reduce((s, g) => s + g.monto, 0)
  const utilidad = totalIngresos - totalGastos
  const margen = totalIngresos > 0 ? ((utilidad / totalIngresos) * 100).toFixed(1) : '0.0'

  const mesActual = new Date().getMonth() + 1
  const añoActual = new Date().getFullYear()
  const ingresosMes = ingresos.filter(i => { const d = new Date(i.fecha); return d.getMonth() + 1 === mesActual && d.getFullYear() === añoActual })
  const gastosMes = gastos.filter(g => { const d = new Date(g.fecha); return d.getMonth() + 1 === mesActual && d.getFullYear() === añoActual })
  const utilidadMes = ingresosMes.reduce((s, i) => s + i.monto, 0) - gastosMes.reduce((s, g) => s + g.monto, 0)

  const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

  const handleAddIngreso = async () => {
    if (!formIngreso.concepto || !formIngreso.monto) { toast.error('Concepto y monto son requeridos'); return }
    setSaving(true)
    try {
      await addIngreso({ concepto: formIngreso.concepto, monto: Number(formIngreso.monto), fecha: formIngreso.fecha, categoria: formIngreso.categoria, cliente: formIngreso.cliente, notas: formIngreso.notas })
      setFormIngreso({ concepto: '', monto: '', fecha: new Date().toISOString().split('T')[0], categoria: 'Proyecto', cliente: '', notas: '' })
      setShowFormIngreso(false)
      toast.success('Ingreso registrado')
      loadAll()
    } catch { toast.error('Error al guardar') } finally { setSaving(false) }
  }

  const handleAddGasto = async () => {
    if (!formGasto.concepto || !formGasto.monto) { toast.error('Concepto y monto son requeridos'); return }
    setSaving(true)
    try {
      await addGasto({ concepto: formGasto.concepto, monto: Number(formGasto.monto), fecha: formGasto.fecha, categoria: formGasto.categoria, proveedor: formGasto.proveedor, notas: formGasto.notas })
      setFormGasto({ concepto: '', monto: '', fecha: new Date().toISOString().split('T')[0], categoria: 'Nómina', proveedor: '', notas: '' })
      setShowFormGasto(false)
      toast.success('Gasto registrado')
      loadAll()
    } catch { toast.error('Error al guardar') } finally { setSaving(false) }
  }

  const handleDeleteIngreso = async (id: string) => {
    try { await deleteIngreso(id); setIngresos(prev => prev.filter(i => i.id !== id)); toast.success('Eliminado') }
    catch { toast.error('Error al eliminar') }
  }
  const handleDeleteGasto = async (id: string) => {
    try { await deleteGasto(id); setGastos(prev => prev.filter(g => g.id !== id)); toast.success('Eliminado') }
    catch { toast.error('Error al eliminar') }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-2xl font-bold">Finanzas</h2>
        <div className="flex items-center gap-2">
          <div className="flex bg-white/5 rounded-lg p-1">
            {(['resumen', 'ingresos', 'gastos'] as Vista[]).map(v => (
              <Button key={v} variant={vista === v ? 'default' : 'ghost'} size="sm" onClick={() => setVista(v)} className="rounded-md capitalize">{v}</Button>
            ))}
          </div>
          <Button variant="ghost" size="sm" onClick={loadAll} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: 'Total Ingresos', value: `$${totalIngresos.toLocaleString('es-MX')}`, icon: TrendingUp, color: 'satin-green', bg: 'satin-green-bg' },
          { label: 'Total Gastos', value: `$${totalGastos.toLocaleString('es-MX')}`, icon: TrendingDown, color: 'satin-red', bg: 'satin-red-bg' },
          { label: utilidad >= 0 ? 'Utilidad' : 'Pérdida', value: `$${Math.abs(utilidad).toLocaleString('es-MX')}`, icon: DollarSign, color: utilidad >= 0 ? 'satin-green' : 'satin-red', bg: utilidad >= 0 ? 'satin-green-bg' : 'satin-red-bg' },
          { label: 'Margen', value: `${margen}%`, icon: Calculator, color: 'satin-blue', bg: 'bg-white/10' },
          { label: `${utilidadMes >= 0 ? 'Utilidad' : 'Pérdida'} ${meses[mesActual - 1]}`, value: `$${Math.abs(utilidadMes).toLocaleString('es-MX')}`, icon: DollarSign, color: utilidadMes >= 0 ? 'satin-blue' : 'satin-yellow', bg: utilidadMes >= 0 ? 'satin-blue-bg' : 'satin-yellow-bg' },
          { label: 'Movimientos', value: `${ingresos.length + gastos.length}`, icon: Calculator, color: 'satin-blue', bg: 'bg-white/10' },
        ].map((s, i) => (
          <Card key={i} className="glass-card p-4 rounded-xl">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-lg ${s.bg}`}><s.icon className={`h-4 w-4 ${s.color}`} /></div>
              <div><p className={`text-lg font-bold ${s.color}`}>{s.value}</p><p className="text-xs text-muted-foreground">{s.label}</p></div>
            </div>
          </Card>
        ))}
      </div>

      {/* RESUMEN */}
      {vista === 'resumen' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="glass-card p-4 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center gap-2"><ArrowUpCircle className="h-4 w-4 satin-green" />Últimos Ingresos</h3>
              <Badge variant="secondary">{ingresos.length}</Badge>
            </div>
            {ingresos.length === 0 ? <p className="text-sm text-muted-foreground text-center py-6">Sin ingresos registrados</p> : (
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {ingresos.slice(0, 10).map(i => (
                  <div key={i.id} className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                    <div><p className="font-medium text-sm">{i.concepto}</p><p className="text-xs text-muted-foreground">{i.fecha} · {i.categoria}</p></div>
                    <p className="font-bold satin-green">${i.monto.toLocaleString('es-MX')}</p>
                  </div>
                ))}
              </div>
            )}
            <Button variant="ghost" size="sm" className="w-full mt-2" onClick={() => setVista('ingresos')}>Ver todos →</Button>
          </Card>

          <Card className="glass-card p-4 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center gap-2"><ArrowDownCircle className="h-4 w-4 satin-red" />Últimos Gastos</h3>
              <Badge variant="secondary">{gastos.length}</Badge>
            </div>
            {gastos.length === 0 ? <p className="text-sm text-muted-foreground text-center py-6">Sin gastos registrados</p> : (
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {gastos.slice(0, 10).map(g => (
                  <div key={g.id} className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                    <div><p className="font-medium text-sm">{g.concepto}</p><p className="text-xs text-muted-foreground">{g.fecha} · {g.categoria}</p></div>
                    <p className="font-bold satin-red">-${g.monto.toLocaleString('es-MX')}</p>
                  </div>
                ))}
              </div>
            )}
            <Button variant="ghost" size="sm" className="w-full mt-2" onClick={() => setVista('gastos')}>Ver todos →</Button>
          </Card>
        </div>
      )}

      {/* INGRESOS */}
      {vista === 'ingresos' && (
        <Card className="glass-card p-4 rounded-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold flex items-center gap-2"><ArrowUpCircle className="h-5 w-5 satin-green" />Ingresos</h3>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="satin-green-bg satin-green">{ingresos.length} registros · ${totalIngresos.toLocaleString('es-MX')}</Badge>
              <Button size="sm" className="gap-1" onClick={() => setShowFormIngreso(v => !v)}><Plus className="h-4 w-4" />Nuevo</Button>
            </div>
          </div>

          {showFormIngreso && (
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1"><Label className="text-xs">Concepto *</Label><Input value={formIngreso.concepto} onChange={e => setFormIngreso(f => ({...f, concepto: e.target.value}))} placeholder="Ej. Proyecto Branding" /></div>
                <div className="space-y-1"><Label className="text-xs">Monto (MXN) *</Label><Input type="number" value={formIngreso.monto} onChange={e => setFormIngreso(f => ({...f, monto: e.target.value}))} placeholder="0.00" /></div>
                <div className="space-y-1"><Label className="text-xs">Fecha</Label><Input type="date" value={formIngreso.fecha} onChange={e => setFormIngreso(f => ({...f, fecha: e.target.value}))} /></div>
                <div className="space-y-1"><Label className="text-xs">Categoría</Label>
                  <Select value={formIngreso.categoria} onValueChange={v => setFormIngreso(f => ({...f, categoria: v}))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{CATEGORIAS_INGRESO.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-1"><Label className="text-xs">Cliente</Label><Input value={formIngreso.cliente} onChange={e => setFormIngreso(f => ({...f, cliente: e.target.value}))} placeholder="Opcional" /></div>
                <div className="space-y-1"><Label className="text-xs">Notas</Label><Input value={formIngreso.notas} onChange={e => setFormIngreso(f => ({...f, notas: e.target.value}))} placeholder="Opcional" /></div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={handleAddIngreso} disabled={saving}>{saving ? 'Guardando...' : 'Guardar'}</Button>
                <Button size="sm" variant="ghost" onClick={() => setShowFormIngreso(false)}><X className="h-4 w-4" /></Button>
              </div>
            </div>
          )}

          {ingresos.length === 0 ? <p className="text-sm text-muted-foreground text-center py-8">Sin ingresos registrados. Agrega el primero.</p> : (
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {ingresos.map(i => (
                <div key={i.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors group">
                  <div className="flex-1">
                    <p className="font-medium">{i.concepto}</p>
                    <p className="text-xs text-muted-foreground">{i.fecha} · {i.categoria}{i.cliente ? ` · ${i.cliente}` : ''}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold satin-green text-lg">${i.monto.toLocaleString('es-MX')}</p>
                    <button onClick={() => handleDeleteIngreso(i.id)} className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-all"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* GASTOS */}
      {vista === 'gastos' && (
        <Card className="glass-card p-4 rounded-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold flex items-center gap-2"><ArrowDownCircle className="h-5 w-5 satin-red" />Gastos</h3>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="satin-red-bg satin-red">{gastos.length} registros · ${totalGastos.toLocaleString('es-MX')}</Badge>
              <Button size="sm" className="gap-1" onClick={() => setShowFormGasto(v => !v)}><Plus className="h-4 w-4" />Nuevo</Button>
            </div>
          </div>

          {showFormGasto && (
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1"><Label className="text-xs">Concepto *</Label><Input value={formGasto.concepto} onChange={e => setFormGasto(f => ({...f, concepto: e.target.value}))} placeholder="Ej. Servidor AWS" /></div>
                <div className="space-y-1"><Label className="text-xs">Monto (MXN) *</Label><Input type="number" value={formGasto.monto} onChange={e => setFormGasto(f => ({...f, monto: e.target.value}))} placeholder="0.00" /></div>
                <div className="space-y-1"><Label className="text-xs">Fecha</Label><Input type="date" value={formGasto.fecha} onChange={e => setFormGasto(f => ({...f, fecha: e.target.value}))} /></div>
                <div className="space-y-1"><Label className="text-xs">Categoría</Label>
                  <Select value={formGasto.categoria} onValueChange={v => setFormGasto(f => ({...f, categoria: v}))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{CATEGORIAS_GASTO.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-1"><Label className="text-xs">Proveedor</Label><Input value={formGasto.proveedor} onChange={e => setFormGasto(f => ({...f, proveedor: e.target.value}))} placeholder="Opcional" /></div>
                <div className="space-y-1"><Label className="text-xs">Notas</Label><Input value={formGasto.notas} onChange={e => setFormGasto(f => ({...f, notas: e.target.value}))} placeholder="Opcional" /></div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={handleAddGasto} disabled={saving}>{saving ? 'Guardando...' : 'Guardar'}</Button>
                <Button size="sm" variant="ghost" onClick={() => setShowFormGasto(false)}><X className="h-4 w-4" /></Button>
              </div>
            </div>
          )}

          {gastos.length === 0 ? <p className="text-sm text-muted-foreground text-center py-8">Sin gastos registrados. Agrega el primero.</p> : (
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {gastos.map(g => (
                <div key={g.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors group">
                  <div className="flex-1">
                    <p className="font-medium">{g.concepto}</p>
                    <p className="text-xs text-muted-foreground">{g.fecha} · {g.categoria}{g.proveedor ? ` · ${g.proveedor}` : ''}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold satin-red text-lg">-${g.monto.toLocaleString('es-MX')}</p>
                    <button onClick={() => handleDeleteGasto(g.id)} className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-all"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}
    </div>
  )
}
