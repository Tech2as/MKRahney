import './Header.css'
import React from "react"

export default props =>
    <header className="header d-none d-sm-flex justify-content-center">
        <h1 className="mt-3 d-flex"> 
            <i className={`fa fa-${props.icon}`}></i> {props.title}
        </h1>
    </header>