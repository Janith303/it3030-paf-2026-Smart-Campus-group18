import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Dash from "./components/Admin/dash";
import Incidents from "./components/Admin/incidents";
// import CreateIncident from "./components/Admin/createIncident";
// import TicketDetails from "./components/Admin/ticketDetails";
import Resources from "./components/Admin/resouces";
import BookResource from "./components/Lecture/booking";
import MyBookings from "./components/Lecture/mybooking";
import UserDashboard from "./components/Lecture/userdashboard";
import AdminBookings from "./components/Admin/AdminBookings";
import CheckInScreen from "./components/Admin/CheckInScreen";
import Home from "./components/Home/home";



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route>
          <Route path="/" element={<Home />} />
          <Route path="/incidents" element={<Incidents />}/>
          {/*  
          <Route path="incidents/create" element={<CreateIncident />} />
          <Route path="incidents/:id" element={<TicketDetails />} /> */}
          <Route path="/resources" element={<Resources />} />
          <Route path="/user/book" element={<BookResource />} />
          <Route path="/user/bookings" element={<MyBookings />} />
          <Route path="/user" element={<UserDashboard />} />
          <Route path="/admin/bookings" element={<AdminBookings />} />
          <Route path="/admin/check-in" element={<CheckInScreen />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;