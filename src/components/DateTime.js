import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import moment from 'moment';
import customStyles from '../constants/styles';
import { dateFormat } from '../helpers/DateFormatter';
import { useTheme } from '@react-navigation/native';
import Colors from '../constants/colors';

const DateTime = ({ eventDate }) => {
  const { colors } = useTheme();

  var date = dateFormat(eventDate);

  return (
    <View style={customStyles.option}>
      <Text
        style={[customStyles.optionContent, { color: Colors.black }]}
      >
        {date}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({});

export default DateTime;
