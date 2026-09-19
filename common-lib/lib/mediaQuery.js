import { css } from "styled-components"
import {
  PC_BREAKPOINT_WIDTH,
  PAD_BREAKPOINT_WIDTH,
  MOBILE_BREAKPOINT_WIDTH,
  MINI_MOBILE_BREAKPOINT_WIDTH,
} from "../config/breakpoint"

// constants
const sizes = {
  pc: PC_BREAKPOINT_WIDTH, // ( 640 <= resolution < 1024 )
  tablet: PAD_BREAKPOINT_WIDTH, // ( resolution < 640 )
  mobile: MOBILE_BREAKPOINT_WIDTH, // ( resolution < 640 )
  miniMobile: MINI_MOBILE_BREAKPOINT_WIDTH // ( resolution < 400 )
}

// refs: https://www.styled-components.com/docs/advanced#media-templates
// Iterate through the sizes and create a media template
const media = Object.keys(sizes).reduce((acc, label) => {
  acc[label] = (...args) => {
    if (label === "pc") {
      return css`
        @media (min-width: ${PC_BREAKPOINT_WIDTH}px) {
          ${css(...args)}
        }
      `.join("")
    } else if (label === "tablet") {
      return css`
        @media (max-width: ${PC_BREAKPOINT_WIDTH - 1}px) {
          ${css(...args)}
        }
      `.join("")
    } else if (label === "miniMobile") {
      return css`
        @media (max-width: ${MINI_MOBILE_BREAKPOINT_WIDTH}px) {
          ${css(...args)}
        }
      `.join("")
    } else if (label === "mobile") {
      return css`
        @media (max-width: ${MOBILE_BREAKPOINT_WIDTH}px) {
          ${css(...args)}
        }
      `.join("")
    }
  }
  return acc
}, {})

export default media
