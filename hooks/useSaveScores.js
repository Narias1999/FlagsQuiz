import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { cheatKey } from './useCheatCount';

const scoresKey = 'Scores';

export const useSaveScores = ({ countries, current, correct, outTimes }) => {
  useEffect(() => {
    if (current >= countries.length) {
      AsyncStorage.getItem(scoresKey).then((value) => {
        const scores = value ? JSON.parse(value) : {};
        scores[new Date().toISOString()] = {
          correctCountries: correct,
          outTimes,
        };
        AsyncStorage.setItem(scoresKey, JSON.stringify(scores));
        AsyncStorage.removeItem(cheatKey);
      });
    };
  }, [current, correct, outTimes]);
}
