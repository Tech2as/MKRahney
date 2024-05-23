import React from "react"
import Header from "./Header"
import './Main.css'

export default props =>
    <React.Fragment>
    <Header {...props} />
    <main>
       <div className="p-3">
            {props.children}
       </div>
    </main>
    </React.Fragment>