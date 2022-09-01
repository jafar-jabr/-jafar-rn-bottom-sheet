import * as React from 'react';
import type { FC } from 'react';
import BottomSheetView from './BottomSheetView';

type propTypes = {
  isVisible: boolean;
  onClose?: () => void;
  animationDuration?: number;
  enablePanDownToClose?: boolean;
  children: any;
};

const BottomSheet: FC<propTypes> = ({
  isVisible,
  onClose,
  children,
  enablePanDownToClose,
  animationDuration = 300,
}): JSX.Element => {
  return (
    <BottomSheetView
      isVisible={isVisible}
      onClose={onClose}
      animationDuration={animationDuration}
      enablePanDownToClose={enablePanDownToClose}
    >
      {children}
    </BottomSheetView>
  );
};

BottomSheet.defaultProps = {
  animationDuration: 300,
  onClose: () => {},
  enablePanDownToClose: true,
};

export default BottomSheet;
