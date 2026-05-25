"use client"

import { useEffect, useCallback } from "react"
import { checkTagsOverflow, addButtonHoverEffects } from "../utils/base-utils"

export const useTagsOverflow = () => {
  const checkOverflow = useCallback(() => {
    checkTagsOverflow()
  }, [])

  useEffect(() => {
    // Check overflow on mount
    checkOverflow()

    // Check overflow on window resize
    const handleResize = () => checkOverflow()
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [checkOverflow])

  return { checkOverflow }
}

export const useButtonHoverEffects = () => {
  useEffect(() => {
    addButtonHoverEffects()
  }, [])
}

export const useCheckout = () => {
  const handleCheckout = useCallback(() => {
    console.log("Tiến hành thanh toán")
    // Navigate to checkout page or open modal
    // This would integrate with your routing solution
  }, [])

  return { handleCheckout }
}
