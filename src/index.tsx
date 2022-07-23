import * as React from 'react';
import {
  FC,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { Dimensions, Modal, Animated, Easing, View } from 'react-native';
import style from './styles';

type propTypes = {
  isVisible: boolean;
  onClose: () => void;
  animationDuration?: number;
  heightRatio?: number;
  children: any;
  containerStyle?: any;
};

const ActionSheet: FC<propTypes> = ({
  isVisible,
  onClose,
  children,
  animationDuration = 300,
  heightRatio = 0.3,
  containerStyle = {},
}): JSX.Element => {
  const [visible, setVisible] = useState(false);

  const translateY = useMemo(
    () => Dimensions.get('window').height * heightRatio,
    [heightRatio]
  );
  const sheetAnim = useRef(new Animated.Value(translateY)).current;

  const showSheet = useCallback(() => {
    Animated.timing(sheetAnim, {
      useNativeDriver: false,
      toValue: 0,
      duration: animationDuration,
      easing: Easing.out(Easing.ease),
    }).start();
  }, [animationDuration, sheetAnim]);

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
        setVisible(false);
        if (typeof callback === 'function') {
          callback();
        }
      });
      onClose();
    },
    [hideSheet, onClose]
  );

  const show = useCallback(() => {
    setVisible(true);
    showSheet();
  }, [showSheet]);

  useEffect(() => {
    if (isVisible) {
      show();
    } else {
      hide();
    }
  }, [hide, isVisible, show]);

  const cancel = () => {
    setVisible(false);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="none"
      transparent
      onRequestClose={cancel}
    >
      <View style={style.overlay}>
        <Animated.View
          style={[
            containerStyle,
            { height: translateY, transform: [{ translateY: sheetAnim }] },
          ]}
        >
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
};

ActionSheet.defaultProps = {
  animationDuration: 300,
  heightRatio: 0.3,
  containerStyle: {},
};

export default memo(ActionSheet);
