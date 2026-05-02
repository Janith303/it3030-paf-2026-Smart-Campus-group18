import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
import RoleRequestPage from "./components/pages/RoleRequestPage";
import AdminRoleRequests from "./components/Admin/AdminRoleRequests";
import ProtectedRoute from "./components/ProtectedRoute";

import { UserSidebar, UserTopbar } from "./components/Lecture/navbar";
import { Sidebar, Topbar } from "./components/Admin/navbar";
import { TechnicianSidebar, TechnicianTopbar } from "./components/Technician/navbar";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/oauth2/callback" element={<OAuthCallback />} />

          {/* User Routes */}
          <Route path="/user" element={<ProtectedRoute roles={['USER']}><UserDashboard /></ProtectedRoute>} />
          <Route path="/user/book" element={<ProtectedRoute roles={['USER']}><BookResource /></ProtectedRoute>} />
          <Route path="/user/bookings" element={<ProtectedRoute roles={['USER']}><MyBookings /></ProtectedRoute>} />
          <Route path="/user/resources" element={<ProtectedRoute roles={['USER']}><UserResources /></ProtectedRoute>} />
          <Route path="/user/incidents" element={<ProtectedRoute roles={['USER']}><MyIncidents /></ProtectedRoute>} />
          <Route path="/user/incidents/create" element={<ProtectedRoute roles={['USER']}><UserCreateIncident /></ProtectedRoute>} />
          <Route path="/user/incidents/:id" element={<ProtectedRoute roles={['USER']}><UserTicketDetails /></ProtectedRoute>} />
          <Route path="/user/notifications" element={<ProtectedRoute roles={['USER']}><NotificationsPage SidebarComponent={UserSidebar} TopbarComponent={UserTopbar} /></ProtectedRoute>} />
          <Route path="/user/role-request" element={<ProtectedRoute roles={['USER']}><RoleRequestPage /></ProtectedRoute>} />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<ProtectedRoute roles={['ADMIN']}><Admindashboard /></ProtectedRoute>} />
          <Route path="/admin/tickets" element={<ProtectedRoute roles={['ADMIN']}><AdminTickets /></ProtectedRoute>} />
          <Route path="/admin/tickets/:id" element={<ProtectedRoute roles={['ADMIN']}><AdminTicketDetails /></ProtectedRoute>} />
          <Route path="/admin/bookings" element={<ProtectedRoute roles={['ADMIN']}><AdminBookings /></ProtectedRoute>} />
          <Route path="/admin/check-in" element={<ProtectedRoute roles={['ADMIN']}><CheckInScreen /></ProtectedRoute>} />
          <Route path="/admin/role-management" element={<ProtectedRoute roles={['ADMIN']}><RoleManagement /></ProtectedRoute>} />
          <Route path="/admin/notifications" element={<ProtectedRoute roles={['ADMIN']}><NotificationsPage SidebarComponent={Sidebar} TopbarComponent={Topbar} /></ProtectedRoute>} />
          <Route path="/admin/role-requests" element={<ProtectedRoute roles={['ADMIN']}><AdminRoleRequests /></ProtectedRoute>} />
          <Route path="/resources" element={<ProtectedRoute roles={['ADMIN']}><AdminResources /></ProtectedRoute>} />
          <Route path="/incidents" element={<ProtectedRoute roles={['ADMIN']}><AdminTickets /></ProtectedRoute>} />

          {/* Technician Routes */}
          <Route path="/technician/tickets" element={<ProtectedRoute roles={['TECHNICIAN']}><AssignedTickets /></ProtectedRoute>} />
          <Route path="/technician/tickets/:id" element={<ProtectedRoute roles={['TECHNICIAN']}><TechnicianTicketDetails /></ProtectedRoute>} />
          <Route path="/technician/notifications" element={<ProtectedRoute roles={['TECHNICIAN']}><NotificationsPage SidebarComponent={TechnicianSidebar} TopbarComponent={TechnicianTopbar} /></ProtectedRoute>} />

          {/* Catch all unknown routes → redirect to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;