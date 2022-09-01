import * as React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Button,
  ScrollView,
  Pressable,
} from 'react-native';
import BottomSheet from '@jafar/rn-bottom-sheet';
import { useState } from 'react';
import AnimateBox from '../../src/AnimateBox';

export default function App() {
  const [isOpened, setIsOpen] = useState(true);

  const toggleSheet = () => {
    setIsOpen((prevState) => !prevState);
  };
  let i = 0;
  const clickCheck = () => {
    i += 1;
    console.warn('click check', i);
  };
  const didClosed = () => {
    setIsOpen(false);
    // console.warn('closed');
  };

  return (
    <View style={styles.container}>
      <AnimateBox />
      <Button title="toggleSheet" onPress={toggleSheet} />
      <BottomSheet
        isVisible={isOpened}
        onClose={didClosed}
        enablePanDownToClose={false}
        animationDuration={1000}
      >
        <View style={styles.parent}>
          <ScrollView
            style={[
              styles.container,
              {
                backgroundColor: 'red',
                borderTopLeftRadius: 24,
                borderTopRightRadius: 24,
                opacity: 1,
              },
            ]}
            contentContainerStyle={{ flexGrow: 1 }}
          >
            <TouchableOpacity onPress={toggleSheet}>
              <Text>X</Text>
            </TouchableOpacity>
            {/*<Pressable>*/}
            <Text style={styles.title}>children components here</Text>
            {/*{[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((r) => (*/}
            {/*  <Text key={r} style={styles.title}>*/}
            {/*    other components here of {r}*/}
            {/*  </Text>*/}
            {/*))}*/}
            <Pressable onPress={clickCheck}>
              <Text style={{ paddingBottom: 40 }}>Click me to see</Text>
            </Pressable>
            {/*</Pressable>*/}
          </ScrollView>
        </View>
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  parent: {
    maxHeight: '60%',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 0,
    marginTop: 20,
    width: '100%',
  },
  title: {
    height: 100,
  },
});
