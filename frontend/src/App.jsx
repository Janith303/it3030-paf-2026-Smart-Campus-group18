import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dash from "./components/Admin/dash";
import AdminTickets from "./components/Admin/tickets";
import AssignedTickets from "./components/Technician/AssignedTickets";
import AdminResources from "./components/Admin/resouces";
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



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route>
          <Route path="/admin/tickets" element={<AdminTickets />} />
          <Route path="/technician/tickets" element={<AssignedTickets />} />
          <Route path="/" element={<Home />} />
          <Route path="/admin/dashboard" element={<Admindashboard />} />
          <Route path="/resources" element={<AdminResources />} />
          <Route path="/user/book" element={<BookResource />} />
          <Route path="/user/bookings" element={<MyBookings />} />
          <Route path="/user" element={<UserDashboard />} />
          <Route path="/user/resources" element={<UserResources />} />
          <Route path="/user/incidents" element={<MyIncidents />} />
          <Route path="/user/incidents/create" element={<UserCreateIncident />} />
          <Route path="/user/incidents/:id" element={<UserTicketDetails />} />
          <Route path="/admin/bookings" element={<AdminBookings />} />
          <Route path="/admin/check-in" element={<CheckInScreen />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;