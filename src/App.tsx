import { find, values } from 'lodash'
import { useContext, useEffect, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import path from './constants/path'
import { AppContext } from './contexts/app.context'
import useDocumentTitle from './hooks/useDocumentTitle'
import useRouteElements from './useRouteElements'
import { LocalStorageEventTarget } from './utils/auth'

function App() {
  const routeElements = useRouteElements()
  const location = useLocation()
  const { reset } = useContext(AppContext)
  const title = useMemo(() => {
    return find(values(path), { link: location.pathname })?.title
  }, [location.pathname])
  useEffect(() => {
    // B1: Tạo ra một sự kiện clearLS
    // B2: Gọi sự kiện đó
    // B3: Nếu thực hiện sự kiện đó thì sẽ reset lại data trong context
    // Vậy là không cần dùng window.location.reload()
    LocalStorageEventTarget.addEventListener('clearLS', () => {
      reset()
    })
  }, [reset])

  useDocumentTitle(title as string)

  return <div>{routeElements}</div>
}

export default App
