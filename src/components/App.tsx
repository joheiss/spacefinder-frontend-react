import React from 'react';
import { User } from '../model/Model';
import { AuthService } from '../services/AuthService';
import { Login } from './Login';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Home } from './Home';
import { Profile } from './Profile';
import { DataService } from '../services/DataService';
import { Spaces } from './spaces/Spaces';
import { CreateSpace } from './spaces/CreateSpace';

interface AppState {
  user?: User; 
}

const initialState = {
  user: undefined,
};

export class App extends React.Component<{}, AppState> {

  private authService: AuthService = new AuthService();
  private dataService: DataService = new DataService();

  constructor(props: any) {
    super(props);
    this.state = initialState;
    this.setUser = this.setUser.bind(this);
  }

  render() {
    return (
      <div className="wrapper">
        <BrowserRouter>
          <div>
            <Navbar user={this.state?.user} />
            <Routes>
              <Route path="/" element={<Home />}/>
              <Route path="/login" element={
                <Login authService={this.authService} setUser={this.setUser}/>
              }>
              </Route>
              <Route path="/profile" element={
                <Profile authService={this.authService} user={this.state.user}/>
              }>
              </Route>
              <Route path="/spaces" element={
                <Spaces dataService={this.dataService} />
              }>
              </Route>
              <Route path="/create-space" element={
                <CreateSpace dataService={this.dataService} />
              }>
              </Route>

            </Routes>
          </div>
        </BrowserRouter>
      </div>
    );
  }

  private async setUser(user: User): Promise<void> {
    this.setState({ user: user });
    await this.authService.getTemporaryCredentials(user.cognitoUser);
  }
}
