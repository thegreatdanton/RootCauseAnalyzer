import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';

const TestScreen = () => {
  const [] = React.useState(false);
  const [] = useState(false);
  const [listViewData] = useState(
    Array(20)
      .fill('')
      .map((_, i) => ({ key: `${i}`, text: `item #${i}` })),
  );

  return (
    // <Swipeable
    //   renderLeftActions={renderLeftActions}
    //   style={styles.container}
    // >
    //   <Text style={{ color: '#fff' }}>Test Screen</Text>
    // </Swipeable>
    <View style={styles.container}>
      <SwipeListView
        data={listViewData}
        renderItem={(data) => (
          <View style={styles.rowFront}>
            <Text>I am {data.item.text} in a SwipeListView</Text>
          </View>
        )}
        renderHiddenItem={() => (
          <View style={styles.rowBack}>
            <Text>Left</Text>
            <Text>Right</Text>
          </View>
        )}
        leftOpenValue={50}
        rightOpenValue={-75}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  backdrop: {
    backgroundColor: '#fff',
  },
  actionText: {
    color: '#fff',
    backgroundColor: '#202020',
  },
  rowBack: {
    backgroundColor: '#404040',
  },
  rowFront: {
    backgroundColor: '#fff',
  },
});

export default TestScreen;
