import ShowExpenses from "./components/ShowExpenses";
import Layout from "./components/Layout";

import { Route, Routes } from "react-router-dom";

import "./App.css";

function App() {
  return (
    <div className="App">
      <header className="container">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<ShowExpenses />} />
          </Route>
        </Routes>
      </header>
    </div>
  );
}

export default App;
