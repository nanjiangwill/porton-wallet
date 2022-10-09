import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import ProtectedRoute from 'components/ProtectedRoute'
import { WebAuthnProvider } from 'components/WebAuthnContext'
import CounterPage from 'pages/Counter'
import LandingPage from 'pages/Landing'
import PaymasterPage from 'pages/Paymaster'
import ProfilePage from 'pages/Profile'
import RegistrationPage from 'pages/Registration'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.scss'
import reportWebVitals from './reportWebVitals'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

root.render(
  <React.StrictMode>
    <ChakraProvider
      theme={extendTheme({
        fonts: {
          heading: `'Ubuntu', sans-serif`,
          body: `'Ubuntu', sans-serif`,
        },
      })}
    >
      <WebAuthnProvider>
        <RouterProvider
          router={createBrowserRouter([
            { path: '/', element: <LandingPage /> },
            { path: '/registration', element: <RegistrationPage /> },
            {
              path: '/profile',
              element: <ProtectedRoute children={<ProfilePage />} />,
            },
            {
              path: '/paymaster',
              element: <ProtectedRoute children={<PaymasterPage />} />,
            },
            {
              path: '/counter',
              element: <ProtectedRoute children={<CounterPage />} />,
            },
          ])}
        />
      </WebAuthnProvider>
    </ChakraProvider>
  </React.StrictMode>,
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
