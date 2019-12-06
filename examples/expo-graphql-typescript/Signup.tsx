import React from 'react';
import { Container, Button, Content, Form, Item, Input, Grid, Row, Col, Label } from 'native-base';
import { Text } from 'react-native';

import FormError from './components/FormError';
import { accountsPassword, accountsGraphQL } from './utils/accounts';
import { NavigationSwitchScreenProps } from 'react-navigation';

import { styles } from './styles/styles.js';

interface IState {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  error: string | null;
}

class Signup extends React.Component<NavigationSwitchScreenProps<{}>, IState> {
  constructor(props) {
    super(props);

    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      error: null,
      password: '',
    };
  }

  onInputChange = (name: string, val: any) => this.setState({ ...this.state, [name]: val });

  onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { firstName, lastName, email, password } = this.state;
    this.setState({ error: null });
    try {
      await accountsPassword
        .createUser({
          profile: {
            firstName,
            lastName,
          },
          email,
          password,
        })
        .then(data => {
          accountsGraphQL.sendVerificationEmail(email);
          return this.props.navigation.navigate('Login');
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
            <Grid>
              <Row>
                <Col>
                  <Item floatingLabel style={styles.input} style={styles.input}>
                    <Label>First Name</Label>
                    <Input
                      returnKeyType="next"
                      autoFocus={true}
                      onChangeText={value => this.onInputChange('firstName', value)}
                      keyboardType="default"
                      autoCapitalize="none"
                      autoCorrect={false}
                      onSubmitEditing={() => this.lastname._root.focus()}
                    />
                  </Item>
                </Col>
                <Col>
                  <Item floatingLabel style={styles.input} style={styles.input}>
                    <Label>Last Name</Label>
                    <Input
                      returnKeyType="next"
                      getRef={c => (this.lastname = c)}
                      onChangeText={value => this.onInputChange('lastName', value)}
                      keyboardType="default"
                      autoCapitalize="none"
                      autoCorrect={false}
                      onSubmitEditing={() => this.email._root.focus()}
                    />
                  </Item>
                </Col>
              </Row>
            </Grid>
            <Item floatingLabel style={styles.input} style={styles.input}>
              <Label>Email</Label>
              <Input
                returnKeyType="next"
                getRef={c => (this.email = c)}
                onChangeText={value => this.onInputChange('email', value)}
                keyboardType="email-address"
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
            <Text style={styles.mainButtonText}>Sign up</Text>
          </Button>
          <Button
            style={styles.button}
            full
            transparent
            onPress={() => navigation.navigate('Login')}
          >
            <Text>Log in</Text>
          </Button>
        </Content>
      </Container>
    );
  }
}

export default Signup;
