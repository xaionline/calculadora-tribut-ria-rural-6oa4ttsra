import { useState } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Calculator,
  FolderOpen,
  Table2,
  Settings,
  FileText,
  Menu,
  Plus,
  Sprout,
} from 'lucide-react'

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/nova-simulacao', label: 'Nova Simulação', icon: Calculator },
  { to: '/simulacoes-salvas', label: 'Simulações Salvas', icon: FolderOpen },
  { to: '/tabela-irpf', label: 'Tabela IRPF', icon: Table2 },
  { to: '/config-ibscbs', label: 'Configurações IBS/CBS', icon: Settings },
  { to: '/relatorios', label: 'Relatórios', icon: FileText },
]

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const location = useLocation()
  return (
    <nav className="flex flex-col gap-1 p-4">
      {navItems.map((item) => {
        const isActive = location.pathname === item.to
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
              isActive
                ? 'bg-white/15 text-white'
                : 'text-white/70 hover:bg-white/10 hover:text-white',
            )}
          >
            <item.icon className="h-5 w-5 shrink-0" />
            <span>{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}

function SidebarHeader() {
  return (
    <div className="h-16 flex items-center px-6 border-b border-white/10 shrink-0">
      <Sprout className="h-6 w-6 shrink-0" />
      <span className="ml-2 font-bold text-sm leading-tight">Calculadora Tributária Rural</span>
    </div>
  )
}

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <aside className="hidden md:flex w-64 flex-col bg-primary text-primary-foreground shrink-0">
        <SidebarHeader />
        <div className="flex-1 overflow-y-auto">
          <SidebarNav />
        </div>
      </aside>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent
          side="left"
          className="w-64 p-0 bg-primary text-primary-foreground [&>button]:text-white/70 [&>button:hover]:text-white"
        >
          <SheetTitle className="sr-only">Menu de Navegação</SheetTitle>
          <SidebarHeader />
          <SidebarNav onNavigate={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b bg-card flex items-center justify-between px-4 md:px-6 shrink-0 gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden shrink-0"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <span className="font-bold text-sm md:text-base truncate">
              Calculadora Tributária Rural
            </span>
          </div>
          <Button asChild size="sm" className="shrink-0">
            <Link to="/nova-simulacao">
              <Plus className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Nova Simulação</span>
              <span className="sm:hidden">Nova</span>
            </Link>
          </Button>
        </header>

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
