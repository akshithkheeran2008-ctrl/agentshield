import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Landing from './pages/Landing.jsx'
import SignIn from './pages/SignIn.jsx'
import Home from './pages/user/Home.jsx'
import MyRequests from './pages/user/MyRequests.jsx'
import RequestDetail from './pages/user/RequestDetail.jsx'
import HowItWorks from './pages/user/HowItWorks.jsx'
import PromptLab from './pages/user/PromptLab.jsx'
import AdminDashboard from './pages/admin/Dashboard.jsx'
import ProductOverview from './pages/admin/ProductOverview.jsx'
import Simulator from './pages/admin/Simulator.jsx'
import Agents from './pages/admin/Agents.jsx'
import Architecture from './pages/admin/Architecture.jsx'
import About from './pages/admin/About.jsx'
import Queue from './pages/admin/Queue.jsx'
import AllRequests from './pages/admin/AllRequests.jsx'
import UserPanel from './pages/admin/UserPanel.jsx'
import Events from './pages/admin/Events.jsx'
import Policies from './pages/admin/Policies.jsx'
import { useStore } from './store.jsx'

export default function App() {
  const { session } = useStore()

  if (!session) {
    return (
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    )
  }

  if (session.role === 'admin') {
    return (
      <Routes>
        <Route element={<Layout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/overview" element={<ProductOverview />} />
          <Route path="/admin/simulator" element={<Simulator />} />
          <Route path="/admin/agents" element={<Agents />} />
          <Route path="/admin/architecture" element={<Architecture />} />
          <Route path="/admin/about" element={<About />} />
          <Route path="/admin/queue" element={<Queue />} />
          <Route path="/admin/requests" element={<AllRequests />} />
          <Route path="/admin/requests/:id" element={<RequestDetail />} />
          <Route path="/admin/users/:email" element={<UserPanel />} />
          <Route path="/admin/events" element={<Events />} />
          <Route path="/admin/policies" element={<Policies />} />
        </Route>
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    )
  }

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/requests" element={<MyRequests />} />
        <Route path="/requests/:id" element={<RequestDetail />} />
        <Route path="/lab" element={<PromptLab />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
