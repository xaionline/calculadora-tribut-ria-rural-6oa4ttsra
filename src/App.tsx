import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import Index from './pages/Index'
import NovaSimulacao from './pages/NovaSimulacao'
import SimulacoesSalvas from './pages/SimulacoesSalvas'
import TabelaIRPF from './pages/TabelaIRPF'
import ConfigIBSCBS from './pages/ConfigIBSCBS'
import Relatorios from './pages/Relatorios'
import NotFound from './pages/NotFound'
import Layout from './components/Layout'

const App = () => (
  <BrowserRouter>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Index />} />
          <Route path="/nova-simulacao" element={<NovaSimulacao />} />
          <Route path="/simulacoes-salvas" element={<SimulacoesSalvas />} />
          <Route path="/tabela-irpf" element={<TabelaIRPF />} />
          <Route path="/config-ibscbs" element={<ConfigIBSCBS />} />
          <Route path="/relatorios" element={<Relatorios />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </TooltipProvider>
  </BrowserRouter>
)

export default App
