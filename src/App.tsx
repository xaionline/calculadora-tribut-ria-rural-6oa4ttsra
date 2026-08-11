/* Main App Component - Handles routing (using react-router-dom), query client and other providers - use this file to add all routes */
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import Index from './pages/Index'
import Simulacao from './pages/Simulacao'
import Resultado from './pages/Resultado'
import Cenarios from './pages/Cenarios'
import TabelaIRPF from './pages/TabelaIRPF'
import SST from './pages/SST'
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
          <Route path="/simulacao" element={<Simulacao />} />
          <Route path="/resultado" element={<Resultado />} />
          <Route path="/cenarios" element={<Cenarios />} />
          <Route path="/tabela-irpf" element={<TabelaIRPF />} />
          <Route path="/sst" element={<SST />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </TooltipProvider>
  </BrowserRouter>
)

export default App
