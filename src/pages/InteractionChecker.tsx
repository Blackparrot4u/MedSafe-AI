import { useState } from "react"
import { checkInteractions } from "@/services/gemini"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ShieldCheck, Plus, X, Loader2, AlertTriangle, Info } from "lucide-react"

export default function InteractionChecker() {
  const [medicines, setMedicines] = useState<string[]>([])
  const [currentMed, setCurrentMed] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleAddMedicine = () => {
    if (currentMed.trim() && !medicines.includes(currentMed.trim())) {
      setMedicines([...medicines, currentMed.trim()])
      setCurrentMed("")
      setResult(null)
    }
  }

  const handleRemoveMedicine = (med: string) => {
    setMedicines(medicines.filter((m) => m !== med))
    setResult(null)
  }

  const handleCheck = async () => {
    if (medicines.length < 2) {
      setError("Please add at least two medicines to check for interactions.")
      return
    }
    setLoading(true)
    setError(null)
    try {
      const data = await checkInteractions(medicines)
      setResult(data)
    } catch (err: any) {
      setError(err.message || "Failed to check interactions")
    } finally {
      setLoading(false)
    }
  }

  const getSeverityBadge = (severity: string) => {
    const s = severity.toLowerCase()
    if (s.includes("high")) return <Badge variant="destructive" className="bg-red-500">High Risk</Badge>
    if (s.includes("medium")) return <Badge variant="warning" className="bg-amber-500">Medium Risk</Badge>
    return <Badge variant="success" className="bg-emerald-500">Low Risk</Badge>
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
          <ShieldCheck className="h-8 w-8 text-teal-500" />
          Interaction Checker
        </h1>
        <p className="mt-2 text-slate-600">
          Add multiple medicines to check for potential side effects and dangerous interactions.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Medicines List</CardTitle>
            <CardDescription>Enter the names of the medicines you are taking.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex gap-2">
              <Input
                placeholder="e.g. Aspirin"
                value={currentMed}
                onChange={(e) => setCurrentMed(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddMedicine()}
              />
              <Button onClick={handleAddMedicine} variant="secondary" className="shrink-0 bg-teal-100 text-teal-700 hover:bg-teal-200">
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>

            <div className="flex flex-wrap gap-2 min-h-[100px] p-4 border rounded-xl bg-slate-50 border-dashed">
              {medicines.length === 0 ? (
                <p className="text-slate-400 text-sm w-full text-center my-auto">No medicines added yet.</p>
              ) : (
                medicines.map((med) => (
                  <Badge key={med} variant="secondary" className="px-3 py-1.5 text-sm bg-white border shadow-sm flex items-center gap-2">
                    {med}
                    <button onClick={() => handleRemoveMedicine(med)} className="text-slate-400 hover:text-red-500 transition-colors">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))
              )}
            </div>

            <Button 
              onClick={handleCheck} 
              disabled={medicines.length < 2 || loading} 
              className="w-full"
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Checking...
                </>
              ) : (
                "Check Interactions"
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
            <Card className="h-full border-teal-200 shadow-sm">
              <CardHeader className="bg-teal-50/50 rounded-t-xl border-b border-teal-100">
                <CardTitle className="text-teal-900">Interaction Results</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                {result.interactions && result.interactions.length > 0 ? (
                  <div className="space-y-4">
                    <h3 className="font-semibold text-slate-900 mb-4">Potential Interactions</h3>
                    {result.interactions.map((interaction: any, i: number) => (
                      <div key={i} className="p-4 rounded-lg border bg-white shadow-sm">
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div className="flex flex-wrap gap-2">
                            {interaction.medicinesInvolved?.map((med: string) => (
                              <Badge key={med} variant="outline" className="bg-slate-50 text-slate-700">
                                {med}
                              </Badge>
                            ))}
                          </div>
                          {getSeverityBadge(interaction.severity)}
                        </div>
                        <p className="text-sm text-slate-700 leading-relaxed">
                          {interaction.description}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 bg-emerald-50 text-emerald-800 rounded-xl flex flex-col items-center text-center border border-emerald-200">
                    <ShieldCheck className="h-10 w-10 text-emerald-500 mb-3" />
                    <h4 className="font-semibold text-lg">No Known Interactions</h4>
                    <p className="text-sm mt-2">No significant interactions were found between these medicines based on available data.</p>
                  </div>
                )}

                {result.summary && (
                  <div className="p-4 bg-slate-50 rounded-lg border text-sm">
                    <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                      <Info className="h-4 w-4 text-slate-500" />
                      Safety Summary
                    </h4>
                    <p className="text-slate-700 leading-relaxed">{result.summary}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card className="h-full flex flex-col items-center justify-center text-center p-8 border-dashed bg-slate-50/50">
              <div className="bg-teal-100 p-4 rounded-full mb-4">
                <ShieldCheck className="h-8 w-8 text-teal-500" />
              </div>
              <h3 className="text-lg font-medium text-slate-900">No Results Yet</h3>
              <p className="text-slate-500 mt-2 max-w-sm">
                Add at least two medicines and click check to see potential interactions here.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
