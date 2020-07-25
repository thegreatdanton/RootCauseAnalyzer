import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-elements';
import customStyles from '../constants/styles';
import { useTheme } from '@react-navigation/native';
import Colors from '../constants/colors';

const Category = ({ name }) => {
  const { colors } = useTheme();

  return (
    <View style={customStyles.option}>
      <Text
        style={[customStyles.optionContent, { color: Colors.black }]}
      >
        {name}
      </Text>
    </View>
  );
};

export default Category;
