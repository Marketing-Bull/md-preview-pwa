import { useEffect, useState } from 'react'

interface PWAInfo {
  isInstalled: boolean
  canInstall: boolean
  installPrompt: any
}

export const usePWA = (): PWAInfo => {
  const [pwaInfo, setPwaInfo] = useState<PWAInfo>({
    isInstalled: false,
    canInstall: false,
    installPrompt: null,
  })

  useEffect(() => {
    // Check if already installed
    const isInstalled =
      (navigator as any).standalone === true ||
      window.matchMedia('(display-mode: standalone)').matches

    setPwaInfo((prev) => ({
      ...prev,
      isInstalled,
    }))

    // Handle install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setPwaInfo((prev) => ({
        ...prev,
        canInstall: true,
        installPrompt: e,
      }))
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  return pwaInfo
}
