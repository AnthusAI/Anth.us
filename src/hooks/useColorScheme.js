import { useState, useEffect } from 'react'

export function useColorScheme() {
  const [colorScheme, setColorScheme] = useState('light')
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    setColorScheme(mediaQuery.matches ? 'dark' : 'light')
    setIsInitialized(true)

    const handler = () => setColorScheme(mediaQuery.matches ? 'dark' : 'light')
    mediaQuery.addListener(handler)
    return () => mediaQuery.removeListener(handler)
  }, [])

  return { colorScheme, isInitialized }
}