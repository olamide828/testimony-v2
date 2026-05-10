import { useEffect } from 'react'
import { useLocation, useNavigation } from 'react-router-dom'
import NProgress from 'nprogress'

NProgress.configure({ showSpinner: false, minimum: 0.15, speed: 300 })

export function usePageLoader() {
  const navigation = useNavigation()

  useEffect(() => {
    if (navigation.state === 'loading') {
      NProgress.start()
    } else {
      NProgress.done()
    }
  }, [navigation.state])
}

// Scroll to top on route change
export function useScrollTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])
}
