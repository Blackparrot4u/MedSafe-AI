import { useState } from "react"
import { getMedicineInfo } from "@/services/gemini"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Pill, Search, Loader2, AlertTriangle, Info, AlertCircle } from "lucide-react"

export default function MedicineInfo() {
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async () => {
    if (!query.trim()) return
    setLoading(true)
    setError(null)
    try {
      const data = await getMedicineInfo(query)
      setResult(data)
    } catch (err: any) {
      setError(err.message || "Failed to fetch medicine info")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
          <Pill className="h-8 w-8 text-indigo-500" />
          Medicine Information
        </h1>
        <p className="mt-2 text-slate-600">
          Search for any medicine to learn about its primary uses, common side effects, and general warnings.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Search Medicine</CardTitle>
            <CardDescription>Enter the name of the medicine you want to look up.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex gap-2">
              <Input
                placeholder="e.g. Ibuprofen"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <Button onClick={handleSearch} disabled={!query.trim() || loading} className="shrink-0 bg-indigo-600 hover:bg-indigo-700">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              </Button>
            </div>

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
            <Card className="h-full border-indigo-200 shadow-sm">
              <CardHeader className="bg-indigo-50/50 rounded-t-xl border-b border-indigo-100">
                <CardTitle className="text-indigo-900 text-2xl flex items-center justify-between">
                  {result.name}
                  <Badge variant="outline" className="bg-white text-indigo-700 border-indigo-200">Medicine</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-8">
                <div>
                  <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <Info className="h-5 w-5 text-indigo-500" />
                    Primary Uses
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {result.uses?.map((use: string, i: number) => (
                      <Badge key={i} variant="secondary" className="bg-indigo-50 text-indigo-700 px-3 py-1.5 text-sm shadow-sm border border-indigo-100">
                        {use}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-amber-500" />
                    Common Side Effects
                  </h3>
                  <ul className="space-y-3">
                    {result.sideEffects?.map((effect: string, i: number) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-slate-700 bg-white p-3 rounded-lg border shadow-sm">
                        <div className="h-2 w-2 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                        <span className="leading-relaxed">{effect}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    Important Warnings
                  </h3>
                  <ul className="space-y-3">
                    {result.warnings?.map((warning: string, i: number) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-slate-700 bg-red-50/50 p-3 rounded-lg border border-red-100">
                        <div className="h-2 w-2 rounded-full bg-red-500 mt-1.5 shrink-0" />
                        <span className="leading-relaxed">{warning}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="h-full flex flex-col items-center justify-center text-center p-8 border-dashed bg-slate-50/50">
              <div className="bg-indigo-100 p-4 rounded-full mb-4">
                <Pill className="h-8 w-8 text-indigo-500" />
              </div>
              <h3 className="text-lg font-medium text-slate-900">No Results Yet</h3>
              <p className="text-slate-500 mt-2 max-w-sm">
                Search for a medicine to see its uses, side effects, and warnings here.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
