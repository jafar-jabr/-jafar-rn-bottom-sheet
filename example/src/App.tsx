import * as React from 'react';

import { StyleSheet, View, Text, TouchableOpacity, Button } from 'react-native';
import BottomSheet from '@jafar/rn-bottom-sheet';
import { useState } from 'react';

export default function App() {
  const [isOpened, setIsOpen] = useState(true);

  const toggleSheet = () => {
    setIsOpen((prevState) => !prevState);
  };
  const didClosed = () => {
    console.warn('closed');
  };

  return (
    <View style={styles.container}>
      <Button title="toggleSheet" onPress={toggleSheet} />
      <BottomSheet
        isVisible={isOpened}
        onClose={didClosed}
        animationDuration={1000}
        heightRatio={0.4}
        containerStyle={{
          backgroundColor: 'red',
          width: '90%',
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          opacity: 1,
        }}
      >
        <View style={styles.container}>
          <TouchableOpacity onPress={toggleSheet}>
            <Text>X</Text>
          </TouchableOpacity>
          <Text style={styles.title}>children components here</Text>
          <Text style={styles.title}>other components here</Text>
        </View>
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {},
  box: {
    backgroundColor: '#e87b7b',
    flex: 1,
    width: 360,
    height: 460,
    marginVertical: 20,
  },
});
