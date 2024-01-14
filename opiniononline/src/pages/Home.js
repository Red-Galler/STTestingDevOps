import { Routes, Route } from "react-router-dom";
import Nav from "../components/Nav"
import Projecten from "./Projecten"
import Account from "./Account"



function Home() {
  return (
      <div className="">

        <div className="flex ">
          <div className="hidden sm:block w-2/12 h-[calc(100vh-97px)] border border-t-0 ">
            <Nav className="" />
          </div>

          <main className="flex-1">
           

          </main>
        </div>
      </div>
  );
}

export default Home;
