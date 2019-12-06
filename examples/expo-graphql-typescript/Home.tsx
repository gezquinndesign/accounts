import React from 'react';
import { View } from 'react-native';
import { Container, Button, Content } from 'native-base';
import { Text } from 'react-native';
import { accountsClient, accountsGraphQL } from './utils/accounts';
import { NavigationContainerProps } from 'react-navigation';

import { styles } from './styles/styles';

interface IProps {
  screenProps: {
    changeLoginState: (loggedIn: boolean) => void;
    user: any;
  };
}
interface IState {
  user: any;
}

class Home extends React.Component<NavigationContainerProps & IProps, IState> {
  constructor(props) {
    super(props);
  }

  public onResendEmail = async () => {
    const { user } = this.state;
    await accountsGraphQL.sendVerificationEmail(user.emails[0].address);
  };

  public onLogout = async () => {
    await accountsClient.logout();
    this.props.screenProps.changeLoginState(false);
  };

  render() {
    const { user } = this.props.screenProps;
    if (!user) {
      return null;
    }

    return (
      <Container>
        <Content>
          {user && (
            <View style={styles.home}>
              <Text>You are logged in</Text>
              <Text>Email: {user.emails[0].address}</Text>
              <Text>Your email is {user.emails[0].verified ? 'verified' : 'unverified'}</Text>
            </View>
          )}
          {!user.emails[0].verified && (
            <Button style={styles.button} transparent onPress={this.onResendEmail}>
              <Text>Resend verification email</Text>
            </Button>
          )}
          <Button style={styles.mainButton} full onPress={this.onLogout}>
            <Text>Log Out</Text>
          </Button>
        </Content>
      </Container>
    );
  }
}

export default Home;
