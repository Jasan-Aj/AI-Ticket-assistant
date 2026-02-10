import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {BrowserRouter, Route, Routes} from "react-router-dom"
import CheckAuth from './components/CheckAuth.jsx'
import Tickets from "./pages/Tickets.jsx"
import TicketDetails from "./pages/TicketDetailsPage.jsx"
import Login from "./pages/Login.jsx"
import Signup from "./pages/Signup.jsx"
import Admin from "./pages/Admin.jsx"
import UserTicketDetails from "./pages/UserTicketDetails.jsx"
import CreateTicket from './pages/CreateTicket.jsx'
import Moderator from './pages/Moderator.jsx'
import LandingPage from "./pages/LandingPage.jsx"

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>

        <Route
          path='/'
          element = {
            <CheckAuth protectedRoute={false}>
              <LandingPage/>
            </CheckAuth>
          }
        />

        <Route
        path='/dashboard'
        element = {
          <CheckAuth protectedRoute={true}>
            <Tickets/>
          </CheckAuth>
        } 
        />

        <Route
          path='/tickets/:id'
          element = {
            <CheckAuth protectedRoute={false}>
              <TicketDetails/>
            </CheckAuth>
          }
        />

        <Route
          path='/tickets/create'
          element = {
            <CheckAuth protectedRoute={true}>
              <CreateTicket/>
            </CheckAuth>
          }
        />

        <Route
          path='/usertickets/:id'
          element = {
            <CheckAuth protectedRoute={true}>
              <UserTicketDetails/>
            </CheckAuth>
          }
        />

        <Route
          path='/login'
          element = {
            <CheckAuth protectedRoute={false}>
              <Login/>
            </CheckAuth>
          }
        />

        <Route
          path='/signup'
          element = {
            <CheckAuth protectedRoute={false}>
              <Signup/>
            </CheckAuth>
          }
        />

        <Route
          path='/admin'
          element = {
            <CheckAuth protectedRoute={false}>
              <Admin/>
            </CheckAuth>
          }
        />

        <Route
          path='/moderator'
          element = {
            <CheckAuth protectedRoute={false}>
              <Moderator/>
            </CheckAuth>
          }
        />

      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
