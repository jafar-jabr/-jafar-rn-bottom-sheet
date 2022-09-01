import * as React from 'react';
import Animated, {
  FadeOutDown,
  FadeInUp,
  Layout,
} from 'react-native-reanimated';
import { FC, memo, useCallback, useEffect, useState } from 'react';
import { Modal, TouchableWithoutFeedback, View } from 'react-native';
import style from './styles';

type propTypes = {
  isVisible: boolean;
  onClose?: () => void;
  animationDuration?: number;
  children: any;
};

const BottomSheetView: FC<propTypes> = ({
  isVisible,
  onClose,
  children,
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

  const showSheet = useCallback((callback: () => void) => {
    if (callback) callback();
    // Animated.timing(sheetAnim, {
    //   useNativeDriver: false,
    //   toValue: 0,
    //   duration: animationDuration,
    //   easing: Easing.out(Easing.ease),
    // }).start();
  }, []);

  const hideSheet = useCallback((callback: () => void) => {
    // Animated.timing(sheetAnim, {
    //   toValue: maxHeight,
    //   duration: animationDuration,
    //   useNativeDriver: false,
    // }).start(callback);
    callback();
  }, []);

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
          style={{}}
          layout={Layout.duration(200).delay(200)}
          entering={FadeInUp}
          exiting={FadeOutDown}
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
};

const propsAreEqual = (prevProps: propTypes, nextProps: propTypes) => {
  return (
    prevProps.isVisible === nextProps.isVisible &&
    prevProps.children === nextProps.children
  );
};

export default memo(BottomSheetView, propsAreEqual);
