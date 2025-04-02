import ShowExpenses from "./components/ShowExpenses";
import Layout from "./components/Layout";

import { Route, Routes, BrowserRouter } from "react-router-dom";

import "./App.css";

function App() {
  return (
    <div className="App">
      <header className="container">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<ShowExpenses />} />
          </Route>
        </Routes>
        </BrowserRouter>
      </header>
    </div>
  );
}

export default App;
