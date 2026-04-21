import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Dash from "./components/Admin/dash";
import Incidents from "./components/Admin/incidents";
// import CreateIncident from "./components/Admin/createIncident";
// import TicketDetails from "./components/Admin/ticketDetails";
import Resources from "./components/Admin/resouces";



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
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;