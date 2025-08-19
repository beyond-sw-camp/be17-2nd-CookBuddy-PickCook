import { ref, onMounted, onBeforeUnmount } from 'vue'

export function useBreakpoints() {
  const isMobile = ref(false)
  const isTablet = ref(false)
  const isDesktop = ref(false)
  const isMobileOrTablet = ref(false) 

  const checkSize = () => {
    const width = window.innerWidth

    isMobile.value = width <= 767
    isTablet.value = width >= 768 && width <= 1023
    isDesktop.value = width >= 1024

    // 특정 로직에서만 필요한 그룹
    isMobileOrTablet.value = width < 1024
  }

  onMounted(() => {
    checkSize()
    window.addEventListener('resize', checkSize)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('resize', checkSize)
  })

  return {
    isMobile,
    isTablet,
    isDesktop,
    isMobileOrTablet, // 필요할 때만 쓰면 됨
  }
}
