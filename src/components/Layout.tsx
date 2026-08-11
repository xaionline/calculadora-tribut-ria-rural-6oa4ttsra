import { Outlet, Link, useLocation } from 'react-router-dom'
import { Sprout, Calculator, BarChart3, Layers, Table2, Shield } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { to: '/', label: 'Dashboard', icon: Sprout },
  { to: '/simulacao', label: 'Simulação', icon: Calculator },
  { to: '/resultado', label: 'Resultado', icon: BarChart3 },
  { to: '/cenarios', label: 'Cenários', icon: Layers },
  { to: '/tabela-irpf', label: 'Tabela IRPF', icon: Table2 },
  { to: '/sst', label: 'SST', icon: Shield },
]

export default function Layout() {
  const location = useLocation()

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-background sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <Link to="/" className="flex items-center gap-2 font-bold text-lg">
              <Sprout className="h-5 w-5 text-green-600" />
              <span className="hidden sm:inline">Calculadora Tributária Rural</span>
            </Link>
            <nav className="flex items-center gap-1 overflow-x-auto">
              {navItems.map((item) => {
                const isActive = location.pathname === item.to
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap',
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-muted',
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    <span className="hidden md:inline">{item.label}</span>
                  </Link>
                )
              })}
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}
