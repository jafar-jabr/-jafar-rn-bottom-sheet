import * as React from 'react';
import { FC, memo, useCallback, useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  Modal,
  Animated,
  Easing,
  PanResponder,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import style from './styles';

type propTypes = {
  isVisible: boolean;
  onClose?: () => void;
  animationDuration?: number;
  enablePanDownToClose?: boolean;
  children: any;
};

const BottomSheetView: FC<propTypes> = ({
  isVisible,
  onClose,
  children,
  enablePanDownToClose,
  animationDuration = 300,
}): JSX.Element | null => {
  const memoChild = React.useMemo(() => {
    if (!isVisible) {
      return null;
    }
    const kinds: any[] = [];
    let index = 0;
    React.Children.forEach(children, (child: any) => {
      index += 1;
      kinds.push(
        React.createElement(child.type, { ...child.props, key: `${index}_k` })
      );
    });
    return kinds;
  }, [children, isVisible]);
  const [isOpen, setIsOpen] = useState(isVisible);
  const maxHeight = Dimensions.get('window').height * 0.9;
  const sheetAnim = useRef(new Animated.Value(maxHeight)).current;

  const showSheet = useCallback(
    (callback: () => void) => {
      if (callback) callback();
      Animated.timing(sheetAnim, {
        useNativeDriver: false,
        toValue: 0,
        duration: animationDuration,
        easing: Easing.out(Easing.ease),
      }).start();
    },
    [animationDuration, sheetAnim]
  );

  const hideSheet = useCallback(
    (callback: () => void) => {
      Animated.timing(sheetAnim, {
        toValue: maxHeight,
        duration: animationDuration,
        useNativeDriver: false,
      }).start(callback);
    },
    [animationDuration, sheetAnim]
  );

  const hide = useCallback(
    (callback: any = null) => {
      hideSheet(() => {
        setIsOpen(false);
        if (typeof callback === 'function') {
          callback();
        }
      });
    },
    [hideSheet]
  );

  const onShowHandler = useCallback(() => {
    setIsOpen(true);
    showSheet(() => {});
  }, [showSheet]);

  const onCloseHandler = useCallback(() => {
    hide(() => {
      if (onClose) {
        onClose();
      }
    });
  }, [hide, onClose]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => {
        return true;
      },
      onMoveShouldSetPanResponder: () => true,
      onPanResponderEnd: (_e, gestureState) => {
        if (gestureState.dy > 60 && enablePanDownToClose) onCloseHandler();
        return true;
      },
    })
  ).current;

  useEffect(() => {
    if (isVisible) {
      onShowHandler();
    } else {
      onCloseHandler();
    }
  }, [onCloseHandler, isVisible, onShowHandler]);

  return (
    <Modal
      visible={isOpen}
      animationType="none"
      transparent
      onRequestClose={onCloseHandler}
    >
      <View style={{ ...(style.overlay as any) }}>
        <TouchableWithoutFeedback onPress={onCloseHandler}>
          <View
            style={{
              width: '100%',
              height: '100%',
              position: 'absolute',
              left: 0,
              top: 0,
            }}
          />
        </TouchableWithoutFeedback>
        <Animated.View
          style={{
            maxHeight,
            width: Dimensions.get('window').width,
            transform: [{ translateY: sheetAnim }],
          }}
          {...panResponder.panHandlers}
        >
          {memoChild}
        </Animated.View>
      </View>
    </Modal>
  );
};

BottomSheetView.defaultProps = {
  animationDuration: 300,
  onClose: () => {},
  enablePanDownToClose: true,
};

const propsAreEqual = (prevProps: propTypes, nextProps: propTypes) => {
  return (
    prevProps.isVisible === nextProps.isVisible &&
    prevProps.children === nextProps.children
  );
};

export default memo(BottomSheetView, propsAreEqual);
