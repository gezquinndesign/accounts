import { Text, StyleSheet } from 'react-native';
import * as React from 'react';

interface IProps {
  error: string;
}

const FormError = ({ error }: IProps) => {
  return <Text style={styles.red}>{error}</Text>;
};

const styles = StyleSheet.create({
  red: {
    color: 'red',
    margin: 15,
  },
});

export default FormError;
