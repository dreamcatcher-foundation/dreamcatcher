import React, {useState, type ReactNode} from "react";
import {Slide} from "./Slide.tsx";
import {animated} from "react-spring";
import {BrowserRouter as Router, Route, Routes, Link, useParams} from "react-router-dom"



function Yooo() {
  const {param} = useParams();
  console.log(param);
  return <div>{param}</div>
}

export function Map(): React.ReactElement {
  return <div>
    <Router>
      <Routes>

        <Route
        path="/code/frontend/hono/dist/landing_page/"
        element={
          <Yooo></Yooo>}
        >
        </Route>


      </Routes>
    </Router>
  </div>
}
 