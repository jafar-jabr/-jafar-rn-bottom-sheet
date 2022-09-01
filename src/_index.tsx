import * as React from 'react';
import {
  Children,
  FC,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Dimensions,
  Modal,
  Animated,
  Easing,
  Pressable,
  PanResponder,
} from 'react-native';
import style from './styles';

type propTypes = {
  isVisible: boolean;
  onClose?: () => void;
  animationDuration?: number;
  heightRatio?: number;
  children: any;
  containerStyle?: any;
};

const BottomSheet: FC<propTypes> = ({
  isVisible,
  onClose,
  children,
  animationDuration = 300,
  containerStyle = {},
}): JSX.Element => {
  const calculateHeight = useMemo(() => {
    const getHeight = (theChildren: any, initialHeight = 0) => {
      let h = initialHeight;
      Children.forEach(theChildren, (child) => {
        const {
          height = 0,
          marginTop = 0,
          marginBottom = 0,
          paddingTop = 0,
          paddingBottom = 0,
          margin = 0,
          padding = 0,
        } = child.props?.style ?? {};
        h +=
          height +
          marginTop +
          marginBottom +
          paddingTop +
          paddingBottom +
          margin +
          padding;
        if (child.props?.children && Children.count(child.props.children)) {
          h += getHeight(child.props.children, h);
        }
      });
      return h;
    };
    return getHeight(children);
  }, [children]);

  const translateY = useMemo(
    () => Math.min(calculateHeight, Dimensions.get('window').height * 0.9),
    [calculateHeight]
  );
  const sheetAnim = useRef(new Animated.Value(translateY)).current;
  let [isOpen, setIsOpen] = useState(isVisible);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => {
        return true;
      },
      onMoveShouldSetPanResponder: () => true,
      onPanResponderEnd: (_e, gestureState) => {
        // const y = calculateHeight;
        if (gestureState.dy > 60) onCloseHandler();
        return true;
      },
    })
  ).current;

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
        toValue: translateY,
        duration: animationDuration,
        useNativeDriver: false,
      }).start(callback);
    },
    [animationDuration, sheetAnim, translateY]
  );

  const hide = useCallback(
    (callback: any = null) => {
      hideSheet(() => {
        if (typeof callback === 'function') {
          callback();
        }
      });
    },
    [hideSheet]
  );

  const onShowHandler = useCallback(() => {
    showSheet(() => setIsOpen(true));
  }, [showSheet]);

  const onCloseHandler = useCallback(() => {
    hide(() => {
      setIsOpen(false);
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
      <Pressable
        style={style.overlay as any}
        onPress={(event) =>
          event.target === event.currentTarget ? onCloseHandler() : () => {}
        }
      >
        <Animated.View
          style={[
            containerStyle,
            { height: translateY, transform: [{ translateY: sheetAnim }] },
          ]}
          {...panResponder.panHandlers}
        >
          {children}
        </Animated.View>
      </Pressable>
    </Modal>
  );
};

BottomSheet.defaultProps = {
  animationDuration: 300,
  containerStyle: {},
  onClose: () => {},
};

const propsAreEqual = (prevProps: propTypes, nextProps: propTypes) => {
  return (
    prevProps.isVisible === nextProps.isVisible &&
    prevProps.children === nextProps.children
  );
  // return prevProps.isVisible === nextProps.isVisible;
};

export default memo(BottomSheet, propsAreEqual);
