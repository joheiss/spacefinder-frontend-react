import React, { SyntheticEvent } from "react";
import { Navigate } from "react-router-dom";
import { User } from "../model/Model";
import { AuthService } from "../services/AuthService";
import { withNavigate } from '../utils/withNavigateHOC';


interface LoginProps {
    authService: AuthService;
    setUser:(user: User) => void;
}

interface LoginState {
    userName: string;
    password: string;
    loginAttempted: boolean;
    loginSuccess: boolean;
}

const initialState: LoginState = {
    userName: '',
    password: '',
    loginAttempted: false,
    loginSuccess: false,
}

interface CustomEvent {
    target: HTMLInputElement;
}

export class Login extends React.Component <LoginProps, LoginState> {


    state = initialState;

    render() {

        let loginMessage: any;
        if (this.state.loginAttempted) {
            if (this.state.loginSuccess) {
                loginMessage = <label>Login sucessful</label>
            } else {
                loginMessage = <label>Login failed</label>
            }
        }
        if (this.state.loginSuccess) {
            return <Navigate to="/profile" replace={false} />;
        }
        return(
            <div>
                <h2>Please login</h2>
                <form onSubmit={e => this.handleSubmit(e)}>
                    <label>Username: </label>
                    <input value={this.state.userName} 
                           onChange={e => this.setUsername(e)}/>
                    <br/><br/>
                    <label>Password: </label>
                    <input value={this.state.password} 
                        onChange={e => this.setPassword(e)} type='password' /><br/><br/>
                    <button type='submit'>Sign In</button> 
                </form>
                {loginMessage}
            </div>
        );
    }

    private setUsername(event: CustomEvent): void {
        this.setState({ userName: event.target.value })
    }

    private setPassword(event: CustomEvent): void {
        this.setState({ password: event.target.value })
    }

    private async handleSubmit(event: SyntheticEvent): Promise<void> {
        event.preventDefault();
        this.setState({loginAttempted: true});
        const result = await this.props.authService.login(this.state.userName, this.state.password);
        if (result) {
            this.setState({loginSuccess: true});
            this.props.setUser(result);
            // this.props.navigate('/profile');
            console.log(result)
        } else {
            this.setState({loginSuccess: false});
        }
    }

}

export default withNavigate(Login);