import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dash from "./components/Admin/dash";
import AdminTickets from "./components/Admin/tickets";
import Resources from "./components/Admin/resouces";
import BookResource from "./components/Lecture/booking";
import MyBookings from "./components/Lecture/mybooking";
import UserDashboard from "./components/Lecture/userdashboard";
import MyIncidents from "./components/User/myIncidents";
import UserCreateIncident from "./components/User/createIncident";
import UserTicketDetails from "./components/User/ticketDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route>
          <Route path="/" element={<Dash />} />
          <Route path="/admin/tickets" element={<AdminTickets />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/user/book" element={<BookResource />} />
          <Route path="/user/bookings" element={<MyBookings />} />
          <Route path="/user" element={<UserDashboard />} />
          <Route path="/user/incidents" element={<MyIncidents />} />
          <Route path="/user/incidents/create" element={<UserCreateIncident />} />
          <Route path="/user/incidents/:id" element={<UserTicketDetails />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;