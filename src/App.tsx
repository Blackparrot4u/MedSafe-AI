/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Layout from "./components/Layout"
import Dashboard from "./pages/Dashboard"
import PrescriptionAnalyzer from "./pages/PrescriptionAnalyzer"
import InteractionChecker from "./pages/InteractionChecker"
import SymptomChecker from "./pages/SymptomChecker"
import MedicineInfo from "./pages/MedicineInfo"

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="prescription" element={<PrescriptionAnalyzer />} />
          <Route path="interactions" element={<InteractionChecker />} />
          <Route path="symptoms" element={<SymptomChecker />} />
          <Route path="medicine" element={<MedicineInfo />} />
        </Route>
      </Routes>
    </Router>
  )
}
