import React from 'react';
import { StyleSheet } from 'react-native';
import ColorPalette from 'react-native-color-palette';
import { Icon } from 'react-native-elements';

const ColorPicker = ({ setTitleBackground }) => {
  return (
    <ColorPalette
      onChange={(color) => setTitleBackground(color)}
      //   defaultColor={'#C0392B'}
      colors={[
        '#E74C3C',
        '#9B59B6',
        '#8E44AD',
        '#2980B9',
        '#DF5D86',
        '#EC9F05',
        '#B91372',
        '#B0B6BB',
        '#2a4041',
        '#34414e',
        '#5E5E5E',
        '#d7b963',
        '#cb9273',
      ]}
      title={'Attach color of your choice'}
      titleStyles={styles.titleStyle}
      paletteStyles={styles.palletteStyle}
      scaleToWindow={true}
      defaultColor={'#E74C3C'}
      icon={
        <Icon
          name="check"
          type="Font-Awesome"
          size={18}
          color={'black'}
        />
      }
    />
  );
};

const styles = StyleSheet.create({
  titleStyle: {
    color: 'orange',
    fontSize: 18,
    fontFamily: 'OpenSans-Regular',
  },
  palletteStyle: {
    flexDirection: 'row',
  },
});

export default ColorPicker;
