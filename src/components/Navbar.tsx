import React from "react";
import { Link } from "react-router-dom";
import { User } from "../model/Model";

export class Navbar extends React.Component<{ user?: User }> {


    render() {
        let authLink: any;
        if (this.props.user) {
            authLink = <Link to="logout" style={{float: 'right'}}>{this.props.user.userName}</Link>
        } else {
            authLink = <Link to="login"  style={{float: 'right'}}>Sign in</Link>
        }
        return(
            <div className="navbar">
                <Link to='/'>Home</Link>
                <Link to='/profile'>Profile</Link>
                <Link to='/spaces'>Spaces</Link>

                {authLink}
            </div>
        )
    }
}