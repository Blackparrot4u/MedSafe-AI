import { useState } from "react"
import { checkSymptoms } from "@/services/gemini"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Stethoscope, Loader2, AlertTriangle, Activity, CheckCircle2 } from "lucide-react"

export default function SymptomChecker() {
  const [symptoms, setSymptoms] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleCheck = async () => {
    if (!symptoms.trim()) {
      setError("Please describe your symptoms.")
      return
    }
    setLoading(true)
    setError(null)
    try {
      const data = await checkSymptoms(symptoms)
      setResult(data)
    } catch (err: any) {
      setError(err.message || "Failed to analyze symptoms")
    } finally {
      setLoading(false)
    }
  }

  const getRiskBadge = (level: string) => {
    const l = level.toLowerCase()
    if (l.includes("high")) return <Badge variant="destructive" className="bg-red-500 text-sm px-3 py-1">High Risk</Badge>
    if (l.includes("medium")) return <Badge variant="warning" className="bg-amber-500 text-sm px-3 py-1">Medium Risk</Badge>
    return <Badge variant="success" className="bg-emerald-500 text-sm px-3 py-1">Low Risk</Badge>
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
          <Stethoscope className="h-8 w-8 text-rose-500" />
          Symptom Checker
        </h1>
        <p className="mt-2 text-slate-600">
          Describe your symptoms to get potential causes and an emergency risk level assessment.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Describe Symptoms</CardTitle>
            <CardDescription>Be as detailed as possible about what you are experiencing.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Textarea
              placeholder="e.g. I have a severe headache, nausea, and sensitivity to light for the past 2 days."
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              className="min-h-[200px] resize-none"
            />

            <Button 
              onClick={handleCheck} 
              disabled={!symptoms.trim() || loading} 
              className="w-full bg-rose-600 hover:bg-rose-700"
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                "Analyze Symptoms"
              )}
            </Button>

            {error && (
              <div className="p-4 bg-red-50 text-red-700 rounded-lg flex items-start gap-3 text-sm">
                <AlertTriangle className="h-5 w-5 shrink-0" />
                <p>{error}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          {result ? (
            <Card className="h-full border-rose-200 shadow-sm">
              <CardHeader className="bg-rose-50/50 rounded-t-xl border-b border-rose-100 flex flex-row items-center justify-between">
                <CardTitle className="text-rose-900">Assessment Results</CardTitle>
                {result.riskLevel && getRiskBadge(result.riskLevel)}
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div>
                  <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <Activity className="h-5 w-5 text-rose-500" />
                    Potential Causes
                  </h3>
                  <ul className="space-y-3">
                    {result.potentialCauses?.map((cause: string, i: number) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-slate-700 bg-white p-3 rounded-lg border shadow-sm">
                        <div className="h-2 w-2 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                        <span className="leading-relaxed">{cause}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    Recommended Next Steps
                  </h3>
                  <ul className="space-y-3">
                    {result.recommendations?.map((rec: string, i: number) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-slate-700 bg-emerald-50/50 p-3 rounded-lg border border-emerald-100">
                        <div className="h-2 w-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                        <span className="leading-relaxed">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {result.disclaimer && (
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800 flex items-start gap-3 mt-6">
                    <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600" />
                    <p className="leading-relaxed font-medium">{result.disclaimer}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card className="h-full flex flex-col items-center justify-center text-center p-8 border-dashed bg-slate-50/50">
              <div className="bg-rose-100 p-4 rounded-full mb-4">
                <Stethoscope className="h-8 w-8 text-rose-500" />
              </div>
              <h3 className="text-lg font-medium text-slate-900">No Results Yet</h3>
              <p className="text-slate-500 mt-2 max-w-sm">
                Describe your symptoms and click analyze to see potential causes and recommendations here.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
