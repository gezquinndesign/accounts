import { AsyncStorage } from 'react-native';
import { AccountsClient } from '@accounts/client';
import { AccountsClientPassword } from '@accounts/client-password';
import GraphQLClient from '@accounts/graphql-client';
import { ApolloClient, ApolloLink } from 'apollo-boost';
import { onError } from 'apollo-link-error';
import { InMemoryCache, HttpLink } from 'apollo-client-preset';
import { setContext } from 'apollo-link-context';
import { accountsLink } from '@accounts/apollo-link';

const errorLink = onError(({ graphQLErrors }) => {
  if (graphQLErrors) graphQLErrors.map(({ message }) => console.log('Error:', message));
});
const httpLink = new HttpLink({ uri: 'http://192.168.1.77:4000/graphql' });
// const authLink = setContext(async (req, { headers }) => {
//   const token = await getToken();

//   return {
//     ...headers,
//     headers: {
//       authorization: token ? `Bearer ${token}` : null,
//     },
//   };
// });

const authLink = accountsLink(() => accountsClient);

const apolloClient = new ApolloClient({
  // uri: 'http://192.168.0.14:4000/graphql',
  link: ApolloLink.from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
  // headers: function createHeaders() {
  //   // tslint:disable-next-line:no-console
  //   console.log('arguments', arguments);
  // },
});

const accountsGraphQL = new GraphQLClient({ graphQLClient: apolloClient });
const accountsClient = new AccountsClient({ tokenStorage: AsyncStorage }, accountsGraphQL);
const accountsPassword = new AccountsClientPassword(accountsClient);

export { accountsClient, accountsGraphQL, accountsPassword, apolloClient };

const AUTH_TOKEN = 'AUTH_TOKEN';

let token;

export const getToken = async () => {
  if (token) {
    return Promise.resolve(token);
  }

  // token = await AsyncStorage.getItem(AUTH_TOKEN);
  return token;
};

export const signIn = async newToken => {
  token = newToken;
  console.log(token);
  // return await AsyncStorage.setItem(AUTH_TOKEN, newToken);
};

export const signOut = () => {
  token = undefined;
  // return AsyncStorage.removeItem(AUTH_TOKEN);
};
