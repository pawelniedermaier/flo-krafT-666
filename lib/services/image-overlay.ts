/**
 * Image Overlay Service for Corporate Culture Simulation
 * Provides functionality to overlay text on pre-loaded image templates
 */

import type { 
  ImageTemplate, 
  TextArea, 
  ImageOverlayResult, 
  TextOverlay 
} from "@/lib/types"

// Pre-defined image templates for corporate culture simulation
export const IMAGE_TEMPLATES: ImageTemplate[] = [
  {
    id: "memo-template",
    name: "Corporate Memo",
    description: "Official company memo template",
    imageUrl: "/templates/memo-template.svg",
    textAreas: [
      {
        id: "header",
        x: 10,
        y: 5,
        width: 80,
        height: 15,
        maxLength: 100,
        fontSize: 24,
        fontFamily: "Arial, sans-serif",
        color: "#1a1a1a",
        alignment: "center"
      },
      {
        id: "subject",
        x: 10,
        y: 25,
        width: 80,
        height: 10,
        maxLength: 200,
        fontSize: 18,
        fontFamily: "Arial, sans-serif",
        color: "#333333",
        alignment: "left"
      },
      {
        id: "body",
        x: 10,
        y: 40,
        width: 80,
        height: 45,
        maxLength: 1000,
        fontSize: 14,
        fontFamily: "Arial, sans-serif",
        color: "#444444",
        alignment: "left"
      },
      {
        id: "signature",
        x: 10,
        y: 90,
        width: 80,
        height: 8,
        maxLength: 100,
        fontSize: 12,
        fontFamily: "Arial, sans-serif",
        color: "#666666",
        alignment: "left"
      }
    ]
  },
  {
    id: "presentation-slide",
    name: "Presentation Slide",
    description: "Corporate presentation slide template",
    imageUrl: "/templates/presentation-slide.svg",
    textAreas: [
      {
        id: "title",
        x: 5,
        y: 10,
        width: 90,
        height: 20,
        maxLength: 150,
        fontSize: 28,
        fontFamily: "Arial, sans-serif",
        color: "#1a1a1a",
        alignment: "center"
      },
      {
        id: "subtitle",
        x: 5,
        y: 35,
        width: 90,
        height: 15,
        maxLength: 200,
        fontSize: 18,
        fontFamily: "Arial, sans-serif",
        color: "#666666",
        alignment: "center"
      },
      {
        id: "content",
        x: 10,
        y: 55,
        width: 80,
        height: 35,
        maxLength: 800,
        fontSize: 16,
        fontFamily: "Arial, sans-serif",
        color: "#333333",
        alignment: "left"
      }
    ]
  },
  {
    id: "email-template",
    name: "Corporate Email",
    description: "Professional email template",
    imageUrl: "/templates/email-template.svg",
    textAreas: [
      {
        id: "to",
        x: 10,
        y: 8,
        width: 80,
        height: 8,
        maxLength: 100,
        fontSize: 12,
        fontFamily: "Arial, sans-serif",
        color: "#333333",
        alignment: "left"
      },
      {
        id: "subject",
        x: 10,
        y: 20,
        width: 80,
        height: 8,
        maxLength: 200,
        fontSize: 14,
        fontFamily: "Arial, sans-serif",
        color: "#1a1a1a",
        alignment: "left"
      },
      {
        id: "greeting",
        x: 10,
        y: 35,
        width: 80,
        height: 8,
        maxLength: 100,
        fontSize: 14,
        fontFamily: "Arial, sans-serif",
        color: "#333333",
        alignment: "left"
      },
      {
        id: "body",
        x: 10,
        y: 50,
        width: 80,
        height: 35,
        maxLength: 1000,
        fontSize: 14,
        fontFamily: "Arial, sans-serif",
        color: "#444444",
        alignment: "left"
      },
      {
        id: "closing",
        x: 10,
        y: 90,
        width: 80,
        height: 8,
        maxLength: 100,
        fontSize: 14,
        fontFamily: "Arial, sans-serif",
        color: "#333333",
        alignment: "left"
      }
    ]
  },
  {
    id: "meeting-minutes",
    name: "Meeting Minutes",
    description: "Official meeting minutes template",
    imageUrl: "/templates/meeting-minutes.svg",
    textAreas: [
      {
        id: "meeting-title",
        x: 10,
        y: 5,
        width: 80,
        height: 12,
        maxLength: 150,
        fontSize: 20,
        fontFamily: "Arial, sans-serif",
        color: "#1a1a1a",
        alignment: "center"
      },
      {
        id: "date-time",
        x: 10,
        y: 20,
        width: 80,
        height: 8,
        maxLength: 100,
        fontSize: 14,
        fontFamily: "Arial, sans-serif",
        color: "#666666",
        alignment: "left"
      },
      {
        id: "attendees",
        x: 10,
        y: 32,
        width: 80,
        height: 15,
        maxLength: 300,
        fontSize: 12,
        fontFamily: "Arial, sans-serif",
        color: "#444444",
        alignment: "left"
      },
      {
        id: "agenda",
        x: 10,
        y: 50,
        width: 80,
        height: 20,
        maxLength: 500,
        fontSize: 14,
        fontFamily: "Arial, sans-serif",
        color: "#333333",
        alignment: "left"
      },
      {
        id: "action-items",
        x: 10,
        y: 75,
        width: 80,
        height: 20,
        maxLength: 500,
        fontSize: 14,
        fontFamily: "Arial, sans-serif",
        color: "#333333",
        alignment: "left"
      }
    ]
  },
  {
    id: "performance-review",
    name: "Performance Review",
    description: "Employee performance review template",
    imageUrl: "/templates/performance-review.svg",
    textAreas: [
      {
        id: "employee-name",
        x: 10,
        y: 8,
        width: 80,
        height: 10,
        maxLength: 100,
        fontSize: 18,
        fontFamily: "Arial, sans-serif",
        color: "#1a1a1a",
        alignment: "left"
      },
      {
        id: "review-period",
        x: 10,
        y: 22,
        width: 80,
        height: 8,
        maxLength: 100,
        fontSize: 14,
        fontFamily: "Arial, sans-serif",
        color: "#666666",
        alignment: "left"
      },
      {
        id: "strengths",
        x: 10,
        y: 35,
        width: 80,
        height: 20,
        maxLength: 500,
        fontSize: 14,
        fontFamily: "Arial, sans-serif",
        color: "#333333",
        alignment: "left"
      },
      {
        id: "areas-improvement",
        x: 10,
        y: 60,
        width: 80,
        height: 20,
        maxLength: 500,
        fontSize: 14,
        fontFamily: "Arial, sans-serif",
        color: "#333333",
        alignment: "left"
      },
      {
        id: "goals",
        x: 10,
        y: 85,
        width: 80,
        height: 12,
        maxLength: 300,
        fontSize: 14,
        fontFamily: "Arial, sans-serif",
        color: "#333333",
        alignment: "left"
      }
    ]
  }
]

/**
 * Create a canvas element for text overlay
 */
function createCanvas(width: number, height: number): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  return canvas
}

/**
 * Load image from URL
 */
function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = url
  })
}

/**
 * Draw text on canvas with specified styling
 */
function drawTextOnCanvas(
  canvas: HTMLCanvasElement,
  text: string,
  x: number,
  y: number,
  width: number,
  height: number,
  style: {
    fontSize: number
    fontFamily: string
    color: string
    alignment: "left" | "center" | "right"
  }
): void {
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // Set font properties
  ctx.font = `${style.fontSize}px ${style.fontFamily}`
  ctx.fillStyle = style.color
  ctx.textAlign = style.alignment
  ctx.textBaseline = 'top'

  // Handle text wrapping
  const words = text.split(' ')
  const lines: string[] = []
  let currentLine = ''

  words.forEach(word => {
    const testLine = currentLine + (currentLine ? ' ' : '') + word
    const metrics = ctx.measureText(testLine)
    
    if (metrics.width > width && currentLine) {
      lines.push(currentLine)
      currentLine = word
    } else {
      currentLine = testLine
    }
  })
  
  if (currentLine) {
    lines.push(currentLine)
  }

  // Draw lines
  lines.forEach((line, index) => {
    const lineY = y + (index * style.fontSize * 1.2)
    if (lineY + style.fontSize <= y + height) {
      let lineX = x
      if (style.alignment === 'center') {
        lineX = x + width / 2
      } else if (style.alignment === 'right') {
        lineX = x + width
      }
      ctx.fillText(line, lineX, lineY)
    }
  })
}

/**
 * Create image overlay with text
 */
export async function createImageOverlay(
  templateId: string,
  textOverlays: { textAreaId: string; text: string }[]
): Promise<ImageOverlayResult> {
  const template = IMAGE_TEMPLATES.find(t => t.id === templateId)
  if (!template) {
    throw new Error(`Template with id ${templateId} not found`)
  }

  try {
    // Load the template image
    const img = await loadImage(template.imageUrl)
    
    // Create canvas with image dimensions
    const canvas = createCanvas(img.width, img.height)
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      throw new Error('Failed to get canvas context')
    }

    // Draw the template image
    ctx.drawImage(img, 0, 0)

    // Process text overlays
    const processedOverlays: TextOverlay[] = []
    
    textOverlays.forEach(overlay => {
      const textArea = template.textAreas.find(area => area.id === overlay.textAreaId)
      if (!textArea) return

      const x = (textArea.x / 100) * img.width
      const y = (textArea.y / 100) * img.height
      const width = (textArea.width / 100) * img.width
      const height = (textArea.height / 100) * img.height

      // Truncate text if it exceeds max length
      const truncatedText = overlay.text.length > textArea.maxLength 
        ? overlay.text.substring(0, textArea.maxLength) + '...'
        : overlay.text

      // Draw text on canvas
      drawTextOnCanvas(canvas, truncatedText, x, y, width, height, {
        fontSize: textArea.fontSize,
        fontFamily: textArea.fontFamily,
        color: textArea.color,
        alignment: textArea.alignment
      })

      processedOverlays.push({
        textAreaId: overlay.textAreaId,
        text: truncatedText,
        position: { x, y },
        style: {
          fontSize: textArea.fontSize,
          fontFamily: textArea.fontFamily,
          color: textArea.color,
          alignment: textArea.alignment
        }
      })
    })

    // Convert canvas to data URL
    const finalImageUrl = canvas.toDataURL('image/png')

    return {
      templateId,
      textOverlays: processedOverlays,
      finalImageUrl
    }
  } catch (error) {
    console.error('Error creating image overlay:', error)
    throw new Error('Failed to create image overlay')
  }
}

/**
 * Get template by ID
 */
export function getTemplateById(templateId: string): ImageTemplate | undefined {
  return IMAGE_TEMPLATES.find(template => template.id === templateId)
}

/**
 * Get all available templates
 */
export function getAllTemplates(): ImageTemplate[] {
  return IMAGE_TEMPLATES
}

/**
 * Validate text overlay data
 */
export function validateTextOverlay(
  templateId: string,
  textOverlays: { textAreaId: string; text: string }[]
): { isValid: boolean; errors: string[] } {
  const template = getTemplateById(templateId)
  if (!template) {
    return { isValid: false, errors: [`Template with id ${templateId} not found`] }
  }

  const errors: string[] = []

  textOverlays.forEach(overlay => {
    const textArea = template.textAreas.find(area => area.id === overlay.textAreaId)
    if (!textArea) {
      errors.push(`Text area with id ${overlay.textAreaId} not found in template`)
      return
    }

    if (overlay.text.length > textArea.maxLength) {
      errors.push(`Text for area ${overlay.textAreaId} exceeds maximum length of ${textArea.maxLength}`)
    }
  })

  return { isValid: errors.length === 0, errors }
}

/**
 * Generate sample text for template
 */
export function generateSampleText(templateId: string): { textAreaId: string; text: string }[] {
  const template = getTemplateById(templateId)
  if (!template) return []

  const sampleTexts: { [key: string]: { [key: string]: string } } = {
    "memo-template": {
      "header": "INTERNAL MEMORANDUM",
      "subject": "Subject: Quarterly Performance Review",
      "body": "This memo serves to inform all team members about the upcoming quarterly performance review process. Please ensure all deliverables are completed by the specified deadline.",
      "signature": "Best regards, Management Team"
    },
    "presentation-slide": {
      "title": "Q4 Performance Metrics",
      "subtitle": "A Comprehensive Analysis",
      "content": "Key highlights from this quarter include improved efficiency metrics, enhanced team collaboration, and successful project deliveries within budget constraints."
    },
    "email-template": {
      "to": "team@company.com",
      "subject": "Weekly Team Update",
      "greeting": "Dear Team,",
      "body": "I hope this email finds you well. I wanted to provide a brief update on our current projects and upcoming milestones.",
      "closing": "Best regards,"
    },
    "meeting-minutes": {
      "meeting-title": "Weekly Team Standup",
      "date-time": "Date: December 15, 2024 | Time: 10:00 AM",
      "attendees": "John Smith, Jane Doe, Mike Johnson, Sarah Wilson",
      "agenda": "1. Project updates\n2. Blockers discussion\n3. Next week planning",
      "action-items": "1. Complete user testing by Friday\n2. Update documentation\n3. Schedule client meeting"
    },
    "performance-review": {
      "employee-name": "John Smith",
      "review-period": "Q4 2024 Performance Review",
      "strengths": "Demonstrates strong technical skills and excellent problem-solving abilities. Shows initiative in taking on challenging projects.",
      "areas-improvement": "Could improve communication with cross-functional teams and time management for complex tasks.",
      "goals": "1. Complete advanced certification\n2. Lead a major project\n3. Improve team collaboration"
    }
  }

  const samples = sampleTexts[templateId]
  if (!samples) return []

  return template.textAreas.map(area => ({
    textAreaId: area.id,
    text: samples[area.id] || ""
  }))
}
