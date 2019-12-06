import React from 'react';
import { Container, Button, Content, Form, Item, Input, Label } from 'native-base';
import { Text } from 'react-native';

import FormError from './components/FormError';
import { accountsPassword } from './utils/accounts';
import { NavigationContainerProps } from 'react-navigation';

import { styles } from './styles/styles';

interface IProps {
  any;
  screenProps: {
    changeLoginState: (boolean) => void;
  };
}

interface IState {
  email: string;
  password: string;
  code: string;
  error: string | null;
}

class Login extends React.Component<NavigationContainerProps & IProps, IState> {
  constructor(props) {
    super(props);

    this.state = {
      code: '',
      email: '',
      error: null,
      password: '',
    };
  }

  onInputChange = (name: string, val: any) => this.setState({ ...this.state, [name]: val });

  onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { email, password, code } = this.state;
    this.setState({ error: null });
    try {
      await accountsPassword
        .login({
          code,
          password,
          user: {
            email,
          },
        })
        .then(() => {
          this.props.screenProps.changeLoginState(true);
        });
    } catch (err) {
      this.setState({ error: err.message });
    }
  };

  render() {
    const { navigation } = this.props;
    const { error } = this.state;

    return (
      <Container>
        <Content>
          <Form>
            <Item floatingLabel style={styles.input}>
              <Label>Email</Label>
              <Input
                returnKeyType="next"
                autoFocus={true}
                onChangeText={value => this.onInputChange('email', value)}
                // keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                onSubmitEditing={() => this.password._root.focus()}
              />
            </Item>
            <Item floatingLabel style={styles.input}>
              <Label>Password</Label>
              <Input
                getRef={c => (this.password = c)}
                onChangeText={value => this.onInputChange('password', value)}
                autoCapitalize="none"
                autoCorrect={false}
                secureTextEntry
                onSubmitEditing={this.onSubmit}
              />
            </Item>
          </Form>
          {error && <FormError error={error} />}
          <Button style={styles.mainButton} full onPress={this.onSubmit}>
            <Text style={styles.mainButtonText}>Log in</Text>
          </Button>
          <Container style={styles.row}>
            <Button
              style={styles.button}
              full
              transparent
              onPress={() => navigation.navigate('Signup')}
            >
              <Text>Sign up</Text>
            </Button>
            <Button
              style={styles.button}
              full
              transparent
              onPress={() => navigation.navigate('ResetPassword')}
            >
              <Text>Forgot password</Text>
            </Button>
          </Container>
        </Content>
      </Container>
    );
  }
}

export default Login;
