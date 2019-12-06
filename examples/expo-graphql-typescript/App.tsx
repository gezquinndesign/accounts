import React, { Component, Props, PropsWithChildren } from 'react';
import { ApolloProvider } from 'react-apollo';

import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import Signup from './Signup';
import Login from './Login';
import Home from './Home';
import ResetPassword from './ResetPassword';

import { apolloClient, accountsClient, accountsGraphQL } from './utils/accounts';

const AuthStack = createStackNavigator({
  Login: { screen: Login, navigationOptions: { headerTitle: 'Log in' } },
  Signup: { screen: Signup, navigationOptions: { headerTitle: 'Sign up' } },
  ResetPassword: { screen: ResetPassword, navigationOptions: { headerTitle: 'Reset password' } },
});

const LoggedInStack = createStackNavigator({
  Home: { screen: Home, navigationOptions: { headerTitle: 'Home' } },
});

const AppAuthContainer = createAppContainer(AuthStack);
const AppLoggedInContainer = createAppContainer(LoggedInStack);

interface IState {
  loggedIn: boolean;
  user: any;
}

class App extends Component<{}, IState> {
  constructor(props) {
    super(props);

    this.state = {
      loggedIn: false,
      user: null,
    };
  }

  public async componentDidMount() {
    accountsClient.refreshSession();
    accountsGraphQL.getUser().then(user => this.setState({ loggedIn: true, user }));
  }

  onChangeLoginState = (loggedIn = false) => {
    this.setState({ loggedIn });
  };

  render() {
    return (
      <ApolloProvider client={apolloClient}>
        {this.state.loggedIn ? (
          <AppLoggedInContainer
            screenProps={{ changeLoginState: this.onChangeLoginState, user: this.state.user }}
          />
        ) : (
          <AppAuthContainer screenProps={{ changeLoginState: this.onChangeLoginState }} />
        )}
      </ApolloProvider>
    );
  }
}

export default App;
