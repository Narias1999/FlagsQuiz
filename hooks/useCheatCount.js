import { useState, useEffect } from 'react';
import { AppState } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const cheatKey = 'CheatCounter';

export const useCheatCount = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    AsyncStorage.getItem(cheatKey).then((value) => {
      if (value) {
        setCount(parseInt(value));
      }
    });
  
    const subscription = AppState.addEventListener('change', nextAppState => {
      console.log(nextAppState, 'nextAppState');
      if (nextAppState === 'background') {
        const newCount = count + 1;
        setCount(newCount);
        AsyncStorage.setItem(cheatKey, newCount.toString());
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return count;
}