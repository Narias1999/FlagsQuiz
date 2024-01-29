import { StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View, AppState } from 'react-native';
import Autocomplete from 'react-native-autocomplete-input';
import { SvgUri } from 'react-native-svg';

import Button from './components/Button';

import countries from './countries.json';
import { useEffect, useMemo, useState } from 'react';
import { shuffleArry, getFirst10Items } from './utils';
import { useCheatCount } from './hooks/useCheatCount';
import { useSaveScores } from './hooks/useSaveScores';

const countryNames = countries.map(country => country.country);

const Item = ({ children, onPress }) => (
  <TouchableOpacity onPress={onPress}>
    <Text style={{ fontSize: 16, paddingVertical: 5, paddingHorizontal: 8 }}>{children}</Text>
  </TouchableOpacity>
);

export default function App() {
  const [query, setQuery] = useState('');
  const [current, setCurrent] = useState(0);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [correct, setCorrect] = useState([]);
  useSaveScores({ countries, current, correct, outTimes });
  const filteredCountries = useMemo(() => {
    const filtered = countryNames.filter(country => {
      const isInList = country.toLowerCase().includes(query.toLowerCase());
      const isCorrect = correct.includes(country);
      return isInList && !isCorrect;
    });

    return getFirst10Items(filtered);
  }, [query]);

  const outTimes = useCheatCount();

  useEffect(() => resetApp(), [outTimes]);

  const shuffledCountries = useMemo(() => shuffleArry(countries), [outTimes]);

  const resetApp = () => {
    setQuery('');
    setCurrent(0);
    setSelectedCountry('');
    setCorrect([]);
  }

  const selectItem = (item) => {
    setQuery('');
    setSelectedCountry(item);
  }

  const onCancel = () => {
    setSelectedCountry('');
  }

  const onNext = () => {
    const correctCountry = shuffledCountries[current]

    if (correctCountry.country === selectedCountry) {
      setCorrect([...correct, selectedCountry]);
    }
    setSelectedCountry('');
    setCurrent(current + 1);
  }

  if (current >= countries.length) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 15 }}>
        <Text style={styles.title}>Game Over</Text>

        <Text>Score: {correct.length}</Text>
      </View>
    )
  }

  return (
    <TouchableWithoutFeedback onPress={() => setQuery('')}>
      <View style={styles.container}>
        <View style={{ alignItems: 'center' }}>
          <Text style={styles.title}>Countries Quiz</Text>
          <Text>{current + 1} / {countries.length}</Text>
          <Text>Score {correct.length}</Text>
        </View>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <SvgUri
            uri={shuffledCountries[current].flag}
            style={styles.flag}
          />
          <View style={{ position: 'relative' }}>
            {
              !!selectedCountry ? (
                <View style={styles.actions}>
                  <Text style={{ fontSize: 20 }}>{selectedCountry}</Text>
                  <View style={styles.buttons}>
                    <Button onPress={onCancel}>Cancel</Button>
                    <Button onPress={onNext} type='success'>Next</Button>
                  </View>
                </View>
              ) : (
                <Autocomplete
                  data={filteredCountries}
                  value={query}
                  onChangeText={setQuery}
                  hideResults={query < 2}
                  inputContainerStyle={{ width: 300, borderWidth: 2 }}
                  flatListProps={{
                    keyExtractor: (_, idx) => idx,
                    renderItem: ({ item }) => <Item onPress={() => selectItem(item)}>{item}</Item>,
                  }}
                />
              )
            }
          </View>
        </View>
        {
          outTimes > 0 && (
            <View style={{ paddingBottom: 40 }}>
              <Text>Out times: {outTimes}</Text>
            </View>
          )
        }
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 90
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10
  },
  flag: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginBottom: 50
  },
  actions: {
    gap: 20,
    alignItems: 'center',
  },
  buttons: {
    flexDirection: 'row',
    gap: 20,
    justifyContent: 'center'
  }
});
