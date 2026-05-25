// Modal management utilities
export const hideBubbleModal = () => {
  const modal = document.getElementById("bubbleModal")
  const overlay = document.getElementById("bubbleOverlay")

  if (modal && overlay) {
    modal.classList.remove("show")
    overlay.classList.remove("show")
  }
}

// Authentication utilities
export const logout = () => {
  sessionStorage.removeItem("currentUser")
  localStorage.removeItem("currentUser")
  // updateUIAfterLogout(); // This would need to be implemented in React context
  window.location.href = "/" // Updated for Next.js routing
}

// Tag overflow checking utility
export const checkTagsOverflow = () => {
  const scrollContainers = document.querySelectorAll(".tags-scroll-wrapper")

  scrollContainers.forEach((container) => {
    const isOverflowing = container.scrollWidth > container.clientWidth
    const parentContainer = container.closest(".tags-scroll-container")

    if (parentContainer) {
      if (isOverflowing) {
        parentContainer.classList.add("has-overflow")
      } else {
        parentContainer.classList.remove("has-overflow")
      }
    }
  })
}

// Tab activation utility
export const activateTab = (tabElement: HTMLElement, containerElement: HTMLElement) => {
  // Remove active state from all tabs
  document.querySelectorAll("[data-tab]").forEach((tab) => {
    tab.classList.remove("border-b-2", "border-orange-500", "text-orange-500")
    tab.classList.add("text-gray-500", "hover:text-gray-700")
  })

  // Hide all containers
  document.querySelectorAll("[data-container]").forEach((container) => {
    container.classList.add("hidden")
  })

  // Activate selected tab
  tabElement.classList.remove("text-gray-500", "hover:text-gray-700")
  tabElement.classList.add("border-b-2", "border-orange-500", "text-orange-500")

  // Show selected container
  containerElement.classList.remove("hidden")
}

// Button hover effects utility
export const addButtonHoverEffects = () => {
  document.querySelectorAll("button").forEach((button) => {
    button.addEventListener("mouseenter", () => {
      button.classList.add("transform", "scale-105", "transition-transform")
    })
    button.addEventListener("mouseleave", () => {
      button.classList.remove("transform", "scale-105", "transition-transform")
    })
  })
}

// Notification badge animation utility
export const hideNotificationBadge = (badgeElement: HTMLElement, bellElement?: HTMLElement) => {
  if (!badgeElement.classList.contains("hidden")) {
    badgeElement.classList.add("animate-out")
    if (bellElement) {
      bellElement.classList.remove("bell-shake")
    }

    setTimeout(() => {
      badgeElement.classList.add("hidden")
      badgeElement.classList.remove("animate-out")
    }, 300)
  }
}

// React hook for tag overflow checking
export const useTagsOverflow = () => {
  const checkOverflow = () => {
    checkTagsOverflow()
  }

  // This would be used in a useEffect in React components
  return { checkOverflow }
}

// React hook for checkout functionality
export const useCheckout = () => {
  const handleCheckout = () => {
    console.log("Tiến hành thanh toán")
    // In a real React app, this would navigate to checkout page
    // or open checkout modal using React Router or state management
  }

  return { handleCheckout }
}
