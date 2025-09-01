"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Copy, Download, Mail } from "lucide-react"
import { toast } from "sonner"

interface SignatureGeneratorProps {
  cardId: string
}

export function SignatureGenerator({ cardId }: SignatureGeneratorProps) {
  const [options, setOptions] = useState({
    includePhoto: true,
    includeSocial: true,
    includeQR: false,
    layout: "horizontal",
    colorScheme: "light",
    fontSize: "medium",
  })
  const [htmlSignature, setHtmlSignature] = useState("")
  const [textSignature, setTextSignature] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)

  const generateSignature = async () => {
    setIsGenerating(true)
    
    try {
      // Generate HTML signature
      const htmlResponse = await fetch("/api/email/signature", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cardId,
          format: "html",
          options,
        }),
      })

      if (!htmlResponse.ok) throw new Error("Failed to generate HTML signature")
      const htmlData = await htmlResponse.json()
      setHtmlSignature(htmlData.signature)

      // Generate text signature
      const textResponse = await fetch("/api/email/signature", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cardId,
          format: "text",
        }),
      })

      if (!textResponse.ok) throw new Error("Failed to generate text signature")
      const textData = await textResponse.json()
      setTextSignature(textData.signature)

      toast.success("Email signatures generated successfully!")
    } catch (error) {
      console.error("Error generating signatures:", error)
      toast.error("Failed to generate signatures")
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = async (content: string, format: string) => {
    try {
      if (format === "html") {
        // For HTML, we need to copy both HTML and plain text versions
        const clipboardItem = new ClipboardItem({
          "text/html": new Blob([content], { type: "text/html" }),
          "text/plain": new Blob([content], { type: "text/plain" }),
        })
        await navigator.clipboard.write([clipboardItem])
      } else {
        await navigator.clipboard.writeText(content)
      }
      toast.success(`${format.toUpperCase()} signature copied to clipboard!`)
    } catch (error) {
      console.error("Failed to copy:", error)
      toast.error("Failed to copy to clipboard")
    }
  }

  const downloadAsFile = (content: string, format: string) => {
    const blob = new Blob([content], { 
      type: format === "html" ? "text/html" : "text/plain" 
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `email-signature.${format}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success(`Signature downloaded as ${format.toUpperCase()} file`)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Signature Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="includePhoto">Include Photo</Label>
                <Switch
                  id="includePhoto"
                  checked={options.includePhoto}
                  onCheckedChange={(checked) =>
                    setOptions({ ...options, includePhoto: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="includeSocial">Include Social Links</Label>
                <Switch
                  id="includeSocial"
                  checked={options.includeSocial}
                  onCheckedChange={(checked) =>
                    setOptions({ ...options, includeSocial: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="includeQR">Include QR Code</Label>
                <Switch
                  id="includeQR"
                  checked={options.includeQR}
                  onCheckedChange={(checked) =>
                    setOptions({ ...options, includeQR: checked })
                  }
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="layout">Layout</Label>
                <Select
                  value={options.layout}
                  onValueChange={(value) => setOptions({ ...options, layout: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="horizontal">Horizontal</SelectItem>
                    <SelectItem value="vertical">Vertical</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="colorScheme">Color Scheme</Label>
                <Select
                  value={options.colorScheme}
                  onValueChange={(value) => setOptions({ ...options, colorScheme: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="brand">Brand Colors</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="fontSize">Font Size</Label>
                <Select
                  value={options.fontSize}
                  onValueChange={(value) => setOptions({ ...options, fontSize: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Button 
            onClick={generateSignature} 
            disabled={isGenerating}
            className="w-full"
          >
            {isGenerating ? "Generating..." : "Generate Email Signatures"}
          </Button>
        </CardContent>
      </Card>

      {(htmlSignature || textSignature) && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Signatures</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="html" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="html">HTML Signature</TabsTrigger>
                <TabsTrigger value="text">Text Signature</TabsTrigger>
              </TabsList>

              <TabsContent value="html" className="space-y-4">
                <div className="border rounded-lg p-4 bg-gray-50 max-h-96 overflow-auto">
                  <div dangerouslySetInnerHTML={{ __html: htmlSignature }} />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(htmlSignature, "html")}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy HTML
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => downloadAsFile(htmlSignature, "html")}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download HTML
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="text" className="space-y-4">
                <div className="border rounded-lg p-4 bg-gray-50 max-h-96 overflow-auto">
                  <pre className="whitespace-pre-wrap text-sm">{textSignature}</pre>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(textSignature, "text")}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Text
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => downloadAsFile(textSignature, "txt")}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Text
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  )
}