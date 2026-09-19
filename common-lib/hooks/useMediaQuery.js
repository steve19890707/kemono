// 取裝置
import { useState, useEffect, useMemo } from 'react'
import {
  PC_BREAKPOINT_WIDTH,
  PAD_BREAKPOINT_WIDTH,
} from '../config/breakpoint'
// refs: https://github.com/matthewhudson/current-device
// mobile ( resolution < 640 )
export default function useMediaQuery() {
  const [mediaType, setMediaType] = useState()
  const isPc = useMemo(() => {
    return mediaType === 'pc'
  }, [mediaType])
  const isMobilePad = useMemo(() => {
    return mediaType !== 'pc'
  }, [mediaType])
  const isMobile= useMemo(() => {
    return mediaType === 'mobile'
  }, [mediaType])
  const handleResize = () => {
    if (typeof document === undefined) return
    const w = Math.max(
      document.documentElement.clientWidth,
      window.innerWidth || 0
    )
    switch (true) {
      case w >= PC_BREAKPOINT_WIDTH:
        setMediaType('pc')
        break
      case w >= PAD_BREAKPOINT_WIDTH:
        setMediaType('tablet')
        break
      default:
        setMediaType('mobile')
        break
    }
  }
  useEffect(() => {
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return { mediaType, isPc, isMobilePad, isMobile }
}
