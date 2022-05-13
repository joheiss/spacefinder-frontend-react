import React from "react";
import { Link } from "react-router-dom";
import { User, UserAttribute } from "../model/Model";
import { AuthService } from "../services/AuthService";

interface ProfileProps {
    user?: User;
    authService: AuthService;
}

interface ProfileState {
    userAttributes: UserAttribute[];
}

export class Profile extends React.Component<ProfileProps, ProfileState> {

    state: ProfileState = {
        userAttributes: [],
    };

    render() {
        let content;
        if (this.props.user) {
            content = <div>
                <h3>Hi {this.props.user.userName}</h3>
                <h4>Your attributes:</h4>
                {this.renderUserAttributes()}
            </div>
            
        } else {
            content = <div><Link to="/login">Login</Link></div>;
        }
        return(
            <div>
                Welcome to the profile page!
                {content}
            </div>
        )
    }

    async componentDidMount(): Promise<void> {
        if (this.props.user) {
            const attrs = await this.props.authService.getUserAttributes(this.props.user);
            this.setState({ userAttributes: attrs });
        }
    }

    private renderUserAttributes(): any {
        const rows = [];
        for (const attr of this.state.userAttributes) {
            rows.push(
                <tr key={attr.Name}>
                    <td>{attr.Name}</td>
                    <td>{attr.Value}</td>
                </tr>
            );
        }
        return <table>
            <tbody>
                {rows}
            </tbody>
        </table>;
    }
}