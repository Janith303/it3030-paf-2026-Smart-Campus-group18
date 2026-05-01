import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dash from "./components/Admin/dash";
import AdminTickets from "./components/Admin/tickets";
import AssignedTickets from "./components/Technician/AssignedTickets";
import TechnicianTicketDetails from "./components/Technician/TechnicianTicketDetails";
import AdminResources from "./components/Admin/resouces";
import AdminTicketDetails from "./components/Admin/AdminTicketDetails";
import BookResource from "./components/Lecture/booking";
import MyBookings from "./components/Lecture/mybooking";
import UserDashboard from "./components/Lecture/userdashboard";
import MyIncidents from "./components/User/myIncidents";
import UserCreateIncident from "./components/User/createIncident";
import UserTicketDetails from "./components/User/ticketDetails";
import AdminBookings from "./components/Admin/AdminBookings";
import CheckInScreen from "./components/Admin/CheckInScreen";
import Home from "./components/Home/home";
import Admindashboard from "./components/Admin/dash";
import UserResources from "./components/Lecture/Resources";

// Member 4 imports
import Login from "./components/pages/Login";
import OAuthCallback from "./components/pages/OAuthCallback";
import RoleManagement from "./components/pages/RoleManagement";
import NotificationsPage from "./components/pages/Notifications";

import { UserSidebar, UserTopbar } from "./components/Lecture/navbar";
import { Sidebar, Topbar } from "./components/Admin/navbar";
import { TechnicianSidebar, TechnicianTopbar } from "./components/Technician/navbar";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route>
          {/* Home */}
          <Route path="/" element={<Home />} />

          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/oauth2/callback" element={<OAuthCallback />} />

          {/* User Routes */}
          <Route path="/user" element={<UserDashboard />} />
          <Route path="/user/book" element={<BookResource />} />
          <Route path="/user/bookings" element={<MyBookings />} />
          <Route path="/user/resources" element={<UserResources />} />
          <Route path="/user/incidents" element={<MyIncidents />} />
          <Route path="/user/incidents/create" element={<UserCreateIncident />} />
          <Route path="/user/incidents/:id" element={<UserTicketDetails />} />
          <Route path="/user/notifications" element={<NotificationsPage SidebarComponent={UserSidebar} TopbarComponent={UserTopbar} />} />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<Admindashboard />} />
          <Route path="/admin/tickets" element={<AdminTickets />} />
          <Route path="/admin/tickets/:id" element={<AdminTicketDetails />} />
          <Route path="/admin/bookings" element={<AdminBookings />} />
          <Route path="/admin/check-in" element={<CheckInScreen />} />
          <Route path="/admin/role-management" element={<RoleManagement />} />
          <Route path="/admin/notifications" element={<NotificationsPage SidebarComponent={Sidebar} TopbarComponent={Topbar} />} />
          <Route path="/resources" element={<AdminResources />} />
          <Route path="/incidents" element={<AdminTickets />} />

          {/* Technician Routes */}
          <Route path="/technician/tickets" element={<AssignedTickets />} />
          <Route path="/technician/tickets/:id" element={<TechnicianTicketDetails />} />
          <Route path="/technician/notifications" element={<NotificationsPage SidebarComponent={TechnicianSidebar} TopbarComponent={TechnicianTopbar} />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;