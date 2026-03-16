// URL sharing utilities for Issue #12

const toUrlSafeBase64 = (str: string): string => {
  return btoa(unescape(encodeURIComponent(str)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

const fromUrlSafeBase64 = (str: string): string => {
  const padded = str.replace(/-/g, '+').replace(/_/g, '/') + '=='.slice(0, (4 - str.length % 4) % 4)
  return decodeURIComponent(escape(atob(padded)))
}

/**
 * Encodes markdown content as URL-safe base64 and returns a shareable URL
 */
export const generateShareUrl = (content: string): string => {
  try {
    const encoded = toUrlSafeBase64(content)
    const origin = window.location.origin
    const path = window.location.pathname
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
    return fromUrlSafeBase64(encoded)
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
