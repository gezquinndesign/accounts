import React from 'react';
import { Container, Button, Content, Form, Item, Input, Label } from 'native-base';
import { Text } from 'react-native';

import FormError from './components/FormError';
import { accountsPassword } from './utils/accounts';
import { NavigationSwitchScreenProps } from 'react-navigation';

import { styles } from './styles/styles';

interface IState {
  email: string;
  error: string | null;
}

class ResetPassword extends React.Component<NavigationSwitchScreenProps, IState> {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      error: null,
    };
  }

  onInputChange = (name: string, val: any) => this.setState({ ...this.state, [name]: val });

  onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { email } = this.state;
    this.setState({ error: null });
    try {
      await accountsPassword.requestPasswordReset(email);
      return this.props.navigation.navigate('Login');
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
            <Item floatingLabel style={styles.input} style={styles.input}>
              <Label>Email</Label>
              <Input
                returnKeyType="next"
                autoFocus={true}
                onChangeText={value => this.onInputChange('email', value)}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                onSubmitEditing={this.onSubmit}
              />
            </Item>
          </Form>
          {error && <FormError error={error} />}
          <Button style={styles.mainButton} full onPress={this.onSubmit}>
            <Text style={styles.mainButtonText}>Reset password</Text>
          </Button>
          <Container style={styles.row}>
            <Button
              style={styles.button}
              full
              transparent
              onPress={() => navigation.navigate('Login')}
            >
              <Text>Log in</Text>
            </Button>
            <Button
              style={styles.button}
              full
              transparent
              onPress={() => navigation.navigate('Signup')}
            >
              <Text>Sign up</Text>
            </Button>
          </Container>
        </Content>
      </Container>
    );
  }
}

export default ResetPassword;
