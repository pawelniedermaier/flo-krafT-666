"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Image as ImageIcon, 
  Download, 
  Copy,
  RotateCcw,
  Info,
  FileText,
  Mail,
  Presentation,
  Users,
  Award
} from "lucide-react"
import { 
  createImageOverlay, 
  getAllTemplates, 
  getTemplateById, 
  generateSampleText,
  validateTextOverlay 
} from "@/lib/services/image-overlay"
import type { ImageTemplate, ImageOverlayResult } from "@/lib/types"

/**
 * Image Overlay View Component
 * Provides functionality to overlay text on pre-loaded image templates
 */
export function ImageOverlayView() {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("")
  const [selectedTemplate, setSelectedTemplate] = useState<ImageTemplate | null>(null)
  const [textOverlays, setTextOverlays] = useState<{ textAreaId: string; text: string }[]>([])
  const [overlayResult, setOverlayResult] = useState<ImageOverlayResult | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const templates = getAllTemplates()

  useEffect(() => {
    if (selectedTemplateId) {
      const template = getTemplateById(selectedTemplateId)
      setSelectedTemplate(template || null)
      if (template) {
        // Initialize text overlays with empty values
        const initialOverlays = template.textAreas.map(area => ({
          textAreaId: area.id,
          text: ""
        }))
        setTextOverlays(initialOverlays)
        setOverlayResult(null)
        setError(null)
      }
    }
  }, [selectedTemplateId])

  const handleTextChange = (textAreaId: string, text: string) => {
    setTextOverlays(prev => 
      prev.map(overlay => 
        overlay.textAreaId === textAreaId 
          ? { ...overlay, text }
          : overlay
      )
    )
  }

  const handleGenerateOverlay = async () => {
    if (!selectedTemplateId || !textOverlays.length) return

    setIsGenerating(true)
    setError(null)

    try {
      // Validate input
      const validation = validateTextOverlay(selectedTemplateId, textOverlays)
      if (!validation.isValid) {
        setError(validation.errors.join(", "))
        return
      }

      const result = await createImageOverlay(selectedTemplateId, textOverlays)
      setOverlayResult(result)
    } catch (error) {
      console.error("Failed to generate overlay:", error)
      setError("Failed to generate image overlay. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleLoadSample = () => {
    if (!selectedTemplateId) return
    
    const sampleTexts = generateSampleText(selectedTemplateId)
    setTextOverlays(sampleTexts)
  }

  const handleReset = () => {
    setSelectedTemplateId("")
    setSelectedTemplate(null)
    setTextOverlays([])
    setOverlayResult(null)
    setError(null)
  }

  const handleDownload = () => {
    if (!overlayResult) return

    const link = document.createElement('a')
    link.href = overlayResult.finalImageUrl
    link.download = `overlay-${selectedTemplateId}-${Date.now()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleCopyImage = async () => {
    if (!overlayResult) return

    try {
      const response = await fetch(overlayResult.finalImageUrl)
      const blob = await response.blob()
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ])
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Failed to copy image:", error)
    }
  }

  const getTemplateIcon = (templateId: string) => {
    switch (templateId) {
      case "memo-template": return <FileText className="h-5 w-5" />
      case "email-template": return <Mail className="h-5 w-5" />
      case "presentation-slide": return <Presentation className="h-5 w-5" />
      case "meeting-minutes": return <Users className="h-5 w-5" />
      case "performance-review": return <Award className="h-5 w-5" />
      default: return <ImageIcon className="h-5 w-5" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2 flex items-center justify-center gap-2">
          <ImageIcon className="h-8 w-8 text-blue-600" />
          Image Overlay Generator
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Overlay custom text on pre-loaded corporate document templates. 
          Perfect for creating satirical corporate communications.
        </p>
      </div>

      {/* Template Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Template</CardTitle>
          <CardDescription>
            Choose a corporate document template to customize
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select value={selectedTemplateId} onValueChange={setSelectedTemplateId}>
            <SelectTrigger>
              <SelectValue placeholder="Select a template..." />
            </SelectTrigger>
            <SelectContent>
              {templates.map((template) => (
                <SelectItem key={template.id} value={template.id}>
                  <div className="flex items-center gap-2">
                    {getTemplateIcon(template.id)}
                    <div>
                      <div className="font-medium">{template.name}</div>
                      <div className="text-sm text-muted-foreground">{template.description}</div>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedTemplate && (
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleLoadSample}>
                Load Sample Text
              </Button>
              <Button variant="outline" onClick={handleReset}>
                Reset
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Text Input Areas */}
      {selectedTemplate && (
        <Card>
          <CardHeader>
            <CardTitle>Customize Text</CardTitle>
            <CardDescription>
              Enter text for each area of the template
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedTemplate.textAreas.map((textArea) => {
              const overlay = textOverlays.find(o => o.textAreaId === textArea.id)
              const currentText = overlay?.text || ""

              return (
                <div key={textArea.id} className="space-y-2">
                  <Label htmlFor={textArea.id} className="flex items-center justify-between">
                    <span className="capitalize font-medium">
                      {textArea.id.replace('-', ' ')}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {currentText.length}/{textArea.maxLength}
                    </Badge>
                  </Label>
                  
                  {textArea.height > 15 ? (
                    <Textarea
                      id={textArea.id}
                      placeholder={`Enter ${textArea.id.replace('-', ' ')}...`}
                      value={currentText}
                      onChange={(e) => handleTextChange(textArea.id, e.target.value)}
                      maxLength={textArea.maxLength}
                      className="min-h-[100px]"
                    />
                  ) : (
                    <Input
                      id={textArea.id}
                      placeholder={`Enter ${textArea.id.replace('-', ' ')}...`}
                      value={currentText}
                      onChange={(e) => handleTextChange(textArea.id, e.target.value)}
                      maxLength={textArea.maxLength}
                    />
                  )}
                  
                  <div className="text-xs text-muted-foreground">
                    Font: {textArea.fontFamily} | Size: {textArea.fontSize}px | 
                    Color: {textArea.color} | Align: {textArea.alignment}
                  </div>
                </div>
              )
            })}

            <Separator />

            <div className="flex gap-2">
              <Button 
                onClick={handleGenerateOverlay} 
                disabled={isGenerating || textOverlays.every(o => !o.text.trim())}
                className="flex-1"
              >
                {isGenerating ? (
                  <>
                    <RotateCcw className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <ImageIcon className="h-4 w-4 mr-2" />
                    Generate Overlay
                  </>
                )}
              </Button>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      {/* Preview and Results */}
      {overlayResult && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Image</CardTitle>
            <CardDescription>
              Your customized corporate document
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-center">
              <img
                src={overlayResult.finalImageUrl}
                alt="Generated overlay"
                className="max-w-full h-auto border rounded-lg shadow-lg"
                style={{ maxHeight: "600px" }}
              />
            </div>

            <div className="flex gap-2 justify-center">
              <Button onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button variant="outline" onClick={handleCopyImage}>
                {copied ? (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Image
                  </>
                )}
              </Button>
            </div>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                This tool is designed for educational purposes to demonstrate how corporate 
                documents can be customized. Use responsibly and in accordance with your 
                organization's policies.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}

      {/* Template Preview */}
      {selectedTemplate && !overlayResult && (
        <Card>
          <CardHeader>
            <CardTitle>Template Preview</CardTitle>
            <CardDescription>
              Preview of the selected template
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              <div className="relative">
                <img
                  src={selectedTemplate.imageUrl}
                  alt={selectedTemplate.name}
                  className="max-w-full h-auto border rounded-lg shadow-lg"
                  style={{ maxHeight: "400px" }}
                  onError={(e) => {
                    // Fallback for missing template images
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                    target.parentElement!.innerHTML = `
                      <div class="w-full h-64 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                        <div class="text-center text-gray-500">
                          <ImageIcon class="h-12 w-12 mx-auto mb-2" />
                          <p>Template Preview</p>
                          <p class="text-sm">${selectedTemplate.name}</p>
                        </div>
                      </div>
                    `
                  }}
                />
                {/* Overlay text areas for preview */}
                {selectedTemplate.textAreas.map((textArea) => {
                  const overlay = textOverlays.find(o => o.textAreaId === textArea.id)
                  const text = overlay?.text || ""
                  
                  if (!text) return null

                  return (
                    <div
                      key={textArea.id}
                      className="absolute border-2 border-blue-500 border-dashed bg-blue-50 bg-opacity-50"
                      style={{
                        left: `${textArea.x}%`,
                        top: `${textArea.y}%`,
                        width: `${textArea.width}%`,
                        height: `${textArea.height}%`,
                        fontSize: `${textArea.fontSize * 0.8}px`,
                        fontFamily: textArea.fontFamily,
                        color: textArea.color,
                        textAlign: textArea.alignment,
                        padding: '4px',
                        overflow: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: textArea.alignment === 'center' ? 'center' : 
                                       textArea.alignment === 'right' ? 'flex-end' : 'flex-start'
                      }}
                    >
                      <span className="truncate">{text}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
