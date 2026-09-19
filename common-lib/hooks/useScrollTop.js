import { useState, useEffect } from "react"

function useScrollTop(ref) {
  const [scrollTop, setScrollTop] = useState(0)
  const container = ref.current

  useEffect(() => {
    if (!!container) {
      const handleScrollTop = () => {
        setScrollTop(container.scrollTop)
      }
      container.addEventListener("scroll", handleScrollTop)
      handleScrollTop()

      return () => container.removeEventListener("scroll", handleScrollTop)
    }
  }, [container])
  return scrollTop
}

export default useScrollTop
