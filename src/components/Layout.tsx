import { Link, Outlet, useLocation } from "react-router-dom"
import { Activity, FileText, Pill, ShieldCheck, Stethoscope, Menu, X } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Dashboard", href: "/", icon: Activity },
  { name: "Prescription Analyzer", href: "/prescription", icon: FileText },
  { name: "Interaction Checker", href: "/interactions", icon: ShieldCheck },
  { name: "Symptom Checker", href: "/symptoms", icon: Stethoscope },
  { name: "Medicine Info", href: "/medicine", icon: Pill },
]

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Mobile sidebar */}
      <div className={cn("fixed inset-0 z-50 lg:hidden", sidebarOpen ? "block" : "hidden")}>
        <div className="fixed inset-0 bg-slate-900/80" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl flex flex-col">
          <div className="flex items-center justify-between h-16 px-4 border-b">
            <div className="flex items-center gap-2 text-teal-600 font-bold text-xl">
              <ShieldCheck className="h-6 w-6" />
              MedSafe AI
            </div>
            <button onClick={() => setSidebarOpen(false)} className="text-slate-500">
              <X className="h-6 w-6" />
            </button>
          </div>
          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive
                      ? "bg-teal-50 text-teal-700"
                      : "text-slate-700 hover:bg-slate-100"
                  )}
                >
                  <item.icon className={cn("h-5 w-5", isActive ? "text-teal-600" : "text-slate-400")} />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 bg-white border-r">
        <div className="flex items-center gap-2 h-16 px-6 border-b text-teal-600 font-bold text-xl">
          <ShieldCheck className="h-6 w-6" />
          MedSafe AI
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-teal-50 text-teal-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <item.icon className={cn("h-5 w-5", isActive ? "text-teal-600" : "text-slate-400")} />
                {item.name}
              </Link>
            )
          })}
        </nav>
        <div className="p-4 border-t text-xs text-slate-500">
          <p>For educational purposes only. Not medical advice.</p>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:pl-64">
        <header className="h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 bg-white border-b lg:hidden">
          <div className="flex items-center gap-2 text-teal-600 font-bold text-lg">
            <ShieldCheck className="h-5 w-5" />
            MedSafe AI
          </div>
          <button onClick={() => setSidebarOpen(true)} className="text-slate-500">
            <Menu className="h-6 w-6" />
          </button>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
