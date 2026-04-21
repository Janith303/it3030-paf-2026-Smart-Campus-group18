import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Dash from "./components/Admin/dash";
import Incidents from "./components/Admin/incidents";
// import CreateIncident from "./components/Admin/createIncident";
// import TicketDetails from "./components/Admin/ticketDetails";
import Resources from "./components/Admin/resouces";
import BookResource from "./components/Lecture/booking";
import MyBookings from "./components/Lecture/mybooking";
import UserDashboard from "./components/Lecture/userdashboard";



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route>
          <Route path="/" element={<Dash />} />
          <Route path="/incidents" element={<Incidents />}/>
          {/*  
          <Route path="incidents/create" element={<CreateIncident />} />
          <Route path="incidents/:id" element={<TicketDetails />} /> */}
          <Route path="/resources" element={<Resources />} />
          <Route path="/user/book" element={<BookResource />} />
          <Route path="/user/bookings" element={<MyBookings />} />
          <Route path="/user" element={<UserDashboard />} />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;