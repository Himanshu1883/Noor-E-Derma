import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import App from "@/App.tsx"
import { CartProvider } from "@/context/CartContext"
import { getInitialTheme, ThemeProvider } from "@/context/ThemeContext"
import { UIProvider } from "@/context/UIContext"
import "@/index.css"

document.documentElement.dataset.theme = getInitialTheme()

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <UIProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </UIProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)
