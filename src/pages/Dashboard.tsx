import { Link } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, ShieldCheck, Stethoscope, Pill, ArrowRight } from "lucide-react"

export default function Dashboard() {
  const tools = [
    {
      title: "Prescription Analyzer",
      description: "Upload a prescription image to extract medicines, dosages, and instructions.",
      icon: FileText,
      href: "/prescription",
      color: "text-blue-500",
      bg: "bg-blue-50",
    },
    {
      title: "Interaction Checker",
      description: "Check for potential side effects and interactions between multiple medicines.",
      icon: ShieldCheck,
      href: "/interactions",
      color: "text-teal-500",
      bg: "bg-teal-50",
    },
    {
      title: "Symptom Checker",
      description: "Describe your symptoms to get potential causes and risk level assessment.",
      icon: Stethoscope,
      href: "/symptoms",
      color: "text-rose-500",
      bg: "bg-rose-50",
    },
    {
      title: "Medicine Info",
      description: "Search for a medicine to learn about its uses, side effects, and warnings.",
      icon: Pill,
      href: "/medicine",
      color: "text-indigo-500",
      bg: "bg-indigo-50",
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Welcome to MedSafe AI</h1>
        <p className="mt-2 text-slate-600 max-w-2xl">
          Your intelligent healthcare safety and preventive awareness platform. Select a tool below to get started.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {tools.map((tool) => (
          <Link key={tool.title} to={tool.href} className="group block">
            <Card className="h-full transition-all hover:shadow-md hover:border-teal-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-xl ${tool.bg} ${tool.color}`}>
                    <tool.icon className="h-6 w-6" />
                  </div>
                  <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-teal-500 transition-colors" />
                </div>
                <CardTitle className="mt-4 text-xl">{tool.title}</CardTitle>
                <CardDescription className="text-sm mt-2">
                  {tool.description}
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-amber-800">
        <h3 className="font-semibold flex items-center gap-2">
          <ShieldCheck className="h-5 w-5" />
          Important Disclaimer
        </h3>
        <p className="mt-2 text-sm leading-relaxed">
          MedSafe AI is designed for educational and informational purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
        </p>
      </div>
    </div>
  )
}
