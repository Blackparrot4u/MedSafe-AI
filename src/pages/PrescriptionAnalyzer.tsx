import { useState } from "react"
import { analyzePrescription } from "@/services/gemini"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Upload, Loader2, AlertCircle } from "lucide-react"

export default function PrescriptionAnalyzer() {
  const [image, setImage] = useState<string | null>(null)
  const [mimeType, setMimeType] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setMimeType(file.type)
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result as string
        setImage(base64String)
        setResult(null)
        setError(null)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAnalyze = async () => {
    if (!image) return
    setLoading(true)
    setError(null)
    try {
      // Extract base64 part
      const base64Data = image.split(",")[1]
      const data = await analyzePrescription(base64Data, mimeType)
      setResult(data)
    } catch (err: any) {
      setError(err.message || "Failed to analyze prescription")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
          <FileText className="h-8 w-8 text-blue-500" />
          Prescription Analyzer
        </h1>
        <p className="mt-2 text-slate-600">
          Upload an image of your prescription to extract medicine names, dosages, and instructions.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Upload Prescription</CardTitle>
            <CardDescription>Supported formats: JPG, PNG</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-center w-full">
              <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-slate-300 border-dashed rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-10 h-10 mb-3 text-slate-400" />
                  <p className="mb-2 text-sm text-slate-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                </div>
                <input id="dropzone-file" type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
              </label>
            </div>

            {image && (
              <div className="relative rounded-xl overflow-hidden border">
                <img src={image} alt="Prescription preview" className="w-full h-auto max-h-64 object-contain bg-slate-100" />
              </div>
            )}

            <Button 
              onClick={handleAnalyze} 
              disabled={!image || loading} 
              className="w-full"
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                "Analyze Prescription"
              )}
            </Button>

            {error && (
              <div className="p-4 bg-red-50 text-red-700 rounded-lg flex items-start gap-3 text-sm">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <p>{error}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          {result ? (
            <Card className="h-full border-blue-200 shadow-sm">
              <CardHeader className="bg-blue-50/50 rounded-t-xl border-b border-blue-100">
                <CardTitle className="text-blue-900">Analysis Results</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div>
                  <h3 className="font-semibold text-slate-900 mb-4">Extracted Medicines</h3>
                  <div className="space-y-4">
                    {result.medicines?.map((med: any, i: number) => (
                      <div key={i} className="p-4 rounded-lg border bg-white shadow-sm">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h4 className="font-bold text-slate-900 text-lg">{med.name}</h4>
                            <p className="text-sm text-slate-500 mt-1">{med.dosage}</p>
                          </div>
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                            Medicine
                          </Badge>
                        </div>
                        <div className="mt-3 pt-3 border-t text-sm text-slate-700">
                          <span className="font-medium">Instructions:</span> {med.instructions}
                        </div>
                      </div>
                    ))}
                    {(!result.medicines || result.medicines.length === 0) && (
                      <p className="text-slate-500 italic">No medicines found.</p>
                    )}
                  </div>
                </div>

                {result.notes && (
                  <div className="p-4 bg-slate-50 rounded-lg border text-sm">
                    <h4 className="font-semibold text-slate-900 mb-2">General Notes</h4>
                    <p className="text-slate-700">{result.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card className="h-full flex flex-col items-center justify-center text-center p-8 border-dashed bg-slate-50/50">
              <div className="bg-blue-100 p-4 rounded-full mb-4">
                <FileText className="h-8 w-8 text-blue-500" />
              </div>
              <h3 className="text-lg font-medium text-slate-900">No Results Yet</h3>
              <p className="text-slate-500 mt-2 max-w-sm">
                Upload a prescription image and click analyze to see the extracted information here.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
