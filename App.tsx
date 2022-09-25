import {SafeAreaView, StyleSheet, Text} from 'react-native';
import React from 'react';
import ListItem from './components/ListItem';
import {ScrollView} from 'react-native-gesture-handler';

export interface ItemInterface {
  id: number;
  content: string;
}

const listItems: ItemInterface[] = [
  {
    id: 1,
    content: 'List item 1',
  },
  {
    id: 2,
    content: 'List item 2',
  },
  {
    id: 3,
    content: 'List item 3',
  },
  {
    id: 4,
    content: 'List item 4',
  },
  {
    id: 5,
    content: 'List item 5',
  },
];

const App = () => {
  const scrollRef = React.useRef(null);
  const [items, setItems] = React.useState(listItems);
  const onSwipeComplete = React.useCallback((data: ItemInterface) => {
    setItems(prev => prev.filter(item => item.id !== data.id));
  }, []);

  React.useEffect(() => {
    console.log('onSwipeComplete success, result=', items);
  }, [items]);

  return (
    <SafeAreaView style={styles.root}>
      <Text style={styles.heading}>Swipe to delete</Text>
      <ScrollView ref={scrollRef}>
        {items.map(item => (
          <ListItem
            simultaneousHandlers={scrollRef}
            onSwipeComplete={onSwipeComplete}
            data={item}
            key={item.id}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default App;

const styles = StyleSheet.create({
  root: {backgroundColor: '#f2f2f2', flex: 1},
  heading: {fontSize: 30, marginVertical: 20, paddingLeft: 20},
});
