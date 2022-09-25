import {Dimensions, StyleSheet, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import {ItemInterface} from '../App';
import Animated, {
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
  PanGestureHandlerProps,
} from 'react-native-gesture-handler';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

const LIST_ITEM_HEIGHT = 80;
const TOGGLE_DISMISS_VALUE = -SCREEN_WIDTH / 3;

interface ListItemProps
  extends Pick<PanGestureHandlerProps, 'simultaneousHandlers'> {
  data: ItemInterface;
  onSwipeComplete?: (data: ItemInterface) => void;
}

type ContextInterface = {
  translateX: number;
};

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

const ListItem: React.FC<ListItemProps> = ({
  data,
  onSwipeComplete,
  simultaneousHandlers,
}) => {
  const translateX = useSharedValue(0);
  const itemHeight = useSharedValue(LIST_ITEM_HEIGHT);
  const rootMarginVertical = useSharedValue(10);
  const containerOpacity = useSharedValue(1);

  const fullSwipeFunction = () => {
    'worklet';
    translateX.value = withTiming(-SCREEN_WIDTH);
    itemHeight.value = withTiming(0);
    rootMarginVertical.value = withTiming(0);
    containerOpacity.value = withTiming(0, undefined, isFinished => {
      if (isFinished && onSwipeComplete) {
        runOnJS(onSwipeComplete)(data);
      }
    });
  };

  const gestureEventHandler = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    ContextInterface
  >({
    onStart: (_, context) => {
      context.translateX = translateX.value;
    },
    onActive: (event, context) => {
      if (event.translationX < 0) {
        translateX.value = event.translationX + context.translateX;
      }
    },
    onEnd: () => {
      if (TOGGLE_DISMISS_VALUE < translateX.value) {
        translateX.value = withTiming(TOGGLE_DISMISS_VALUE + 50);
      } else {
        fullSwipeFunction();
      }
    },
  });

  const rContainerStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateX: translateX.value}],
    };
  });

  const rIconContainerStyle = useAnimatedStyle(() => {
    const opacity = withTiming(
      translateX.value < TOGGLE_DISMISS_VALUE + 55 ? 1 : 0,
    );
    return {
      opacity,
    };
  });

  const rRootStyle = useAnimatedStyle(() => {
    return {
      height: itemHeight.value,
      marginVertical: rootMarginVertical.value,
      opacity: containerOpacity.value,
    };
  });

  return (
    <Animated.View style={[styles.root, rRootStyle]}>
      <AnimatedTouchableOpacity
        onPress={fullSwipeFunction}
        style={[styles.iconContainer, rIconContainerStyle]}>
        <FontAwesome5 name="trash-alt" size={24} color="red" />
      </AnimatedTouchableOpacity>
      <PanGestureHandler
        simultaneousHandlers={simultaneousHandlers}
        onGestureEvent={gestureEventHandler}>
        <Animated.View style={[styles.container, rContainerStyle]}>
          <Text style={styles.content}>{data.content}</Text>
        </Animated.View>
      </PanGestureHandler>
    </Animated.View>
  );
};

export default ListItem;

const styles = StyleSheet.create({
  root: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 10,
  },
  container: {
    height: LIST_ITEM_HEIGHT,
    borderRadius: 10,
    padding: '3%',
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    shadowOpacity: 0.08,
    width: '90%',
    shadowOffset: {width: 0, height: 20},
    shadowRadius: 10,
    elevation: 4,
  },
  content: {
    fontSize: 15,
    fontWeight: '600',
  },
  iconContainer: {
    justifyContent: 'center',
    height: LIST_ITEM_HEIGHT,
    width: LIST_ITEM_HEIGHT,
    right: 20,
    borderRadius: 10,
    position: 'absolute',
    alignItems: 'center',
  },
});
