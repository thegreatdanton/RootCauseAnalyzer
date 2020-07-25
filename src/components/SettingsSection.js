import React from 'react';
import { View, StyleSheet, SectionList } from 'react-native';
import { Text } from 'react-native-elements';
import SettingComponent from './SettingComponent';
import { Divider } from 'react-native-elements';
import { useTheme } from '@react-navigation/native';

const SettingsSection = ({ data, navigation }) => {
  const { colors } = useTheme();
  const Item = ({ title }) => (
    <View style={styles.item}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
  const FlatListItemSeparator = () => {
    return <Divider style={styles.divider} />;
  };
  return (
    <View
      style={[styles.container, { backgroundColor: colors.primary }]}
    >
      <SectionList
        sections={data}
        keyExtractor={(item, index) => item.title + index.toString()}
        renderItem={({ item }) => (
          <SettingComponent
            name={item.name}
            iconUrl={item.icon}
            detail={item.screen}
            navigation={navigation}
          />
        )}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={[styles.header, { color: colors.text }]}>
            {title}
          </Text>
        )}
        ItemSeparatorComponent={FlatListItemSeparator}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#202020',
    borderRadius: 26,
    marginHorizontal: 5,
    marginVertical: 10,
    justifyContent: 'flex-start',
    overflow: 'hidden',
  },
  header: {
    fontSize: 20,
    color: 'white',
    alignSelf: 'center',
    marginTop: 5,
    fontFamily: 'SFUIText-Medium',
  },
  title: {
    fontSize: 24,
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
  },
  divider: {
    backgroundColor: 'grey',
    height: 2,
    marginLeft: 55,
    marginRight: 55,
  },
});

export default SettingsSection;
