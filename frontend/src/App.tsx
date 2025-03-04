import NavBar from "./components/NavBar";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ProductPage from "./pages/ProductPage";

function App() {
  return (
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" Component={HomePage} />
          <Route path="/product/:title" Component={ProductPage} />
        </Routes>
      </BrowserRouter>
  );
}

export default App;
