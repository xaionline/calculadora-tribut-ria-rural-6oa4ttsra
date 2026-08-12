import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AuthProvider } from '@/hooks/use-auth'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import Index from './pages/Index'
import NovaSimulacao from './pages/NovaSimulacao'
import ResultadoSimulacao from './pages/ResultadoSimulacao'
import SimulacoesSalvas from './pages/SimulacoesSalvas'
import TabelaIRPF from './pages/TabelaIRPF'
import ConfigIBSCBS from './pages/ConfigIBSCBS'
import Relatorios from './pages/Relatorios'
import SimulacaoCenarios from './pages/SimulacaoCenarios'
import Login from './pages/Login'
import NotFound from './pages/NotFound'
import Layout from './components/Layout'

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<Index />} />
            <Route path="/nova-simulacao" element={<NovaSimulacao />} />
            <Route path="/resultado-simulacao" element={<ResultadoSimulacao />} />
            <Route path="/simulacoes-salvas" element={<SimulacoesSalvas />} />
            <Route path="/tabela-irpf" element={<TabelaIRPF />} />
            <Route path="/config-ibscbs" element={<ConfigIBSCBS />} />
            <Route path="/simulacao-cenarios" element={<SimulacaoCenarios />} />
            <Route path="/relatorios" element={<Relatorios />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </TooltipProvider>
    </AuthProvider>
  </BrowserRouter>
)

export default App
