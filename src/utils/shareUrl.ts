// URL sharing utilities for Issue #12

/**
 * Encodes markdown content as base64 and returns a shareable URL
 */
export const generateShareUrl = (content: string): string => {
  try {
    // Encode content to base64
    const encoded = btoa(unescape(encodeURIComponent(content)))
    // Get current origin
    const origin = window.location.origin
    const path = window.location.pathname
    // Create share URL with encoded content
    return `${origin}${path}?md=${encoded}`
  } catch (error) {
    console.error('Error generating share URL:', error)
    return ''
  }
}

/**
 * Decodes markdown content from URL parameter
 */
export const decodeContentFromUrl = (): string | null => {
  try {
    const params = new URLSearchParams(window.location.search)
    const encoded = params.get('md')
    if (!encoded) return null
    // Decode from base64
    const decoded = decodeURIComponent(escape(atob(encoded)))
    return decoded
  } catch (error) {
    console.error('Error decoding URL content:', error)
    return null
  }
}

/**
 * Shares content using Web Share API or copies to clipboard
 */
export const shareContent = async (content: string, title: string = 'MD Preview'): Promise<boolean> => {
  const url = generateShareUrl(content)

  if (!url) {
    console.error('Failed to generate share URL')
    return false
  }

  // Try Web Share API first (mobile/iPad)
  if (navigator.share) {
    try {
      await navigator.share({
        title,
        text: 'Check out my markdown:',
        url,
      })
      return true
    } catch (error) {
      // User cancelled or error occurred, fall back to clipboard
      if ((error as Error).name !== 'AbortError') {
        console.error('Web Share API error:', error)
      }
    }
  }

  // Fallback: copy to clipboard
  try {
    await navigator.clipboard.writeText(url)
    return true
  } catch (error) {
    console.error('Failed to copy to clipboard:', error)
    // Final fallback: use old method
    const textArea = document.createElement('textarea')
    textArea.value = url
    document.body.appendChild(textArea)
    textArea.select()
    try {
      document.execCommand('copy')
      document.body.removeChild(textArea)
      return true
    } catch {
      document.body.removeChild(textArea)
      return false
    }
  }
}

/**
 * Checks if content was shared via URL
 */
export const hasSharedContent = (): boolean => {
  const params = new URLSearchParams(window.location.search)
  return params.has('md')
}
