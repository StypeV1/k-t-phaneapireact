import React, { useEffect, useState } from "react";
import "./App.css";
import Books from "./Books";
import Writers from "./Writer";
import Categories from "./Categories";
import Publisher from "./Publisher";
import Members from "./Members";


function App() {
  return (

    <div>
      <div><h1>Kütüphane API</h1></div>

      <Books></Books>
      <div className="separator"> </div>
      <Writers></Writers>
      <div className="separator"> </div>
      <Categories></Categories>
      <div className="separator"> </div>
      <Publisher></Publisher>
      <div className="separator"> </div>
      <Members></Members>
      <div className="separator"> </div>


    </div>
  )
}
export default App;

