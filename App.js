import {
  StyleSheet,
  Platform,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  View,
} from 'react-native';
import Autocomplete from 'react-native-autocomplete-input';
import { SvgUri } from 'react-native-svg';

import Button from './components/Button';

import countries from './countries.json';
import { useMemo, useState } from 'react';
import { shuffleArry } from './utils';
import { useSaveScores } from './hooks/useSaveScores';

const countryNames = countries.map((country) => country.country);

const Item = ({ children, onPress }) => (
  <TouchableOpacity onPress={onPress} style={{ zIndex: 100 }}>
    <Text style={{ fontSize: 16, paddingVertical: 5, paddingHorizontal: 8 }}>
      {children}
    </Text>
  </TouchableOpacity>
);

export default function App() {
  const [query, setQuery] = useState('');
  const [current, setCurrent] = useState(0);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [correct, setCorrect] = useState([]);
  const [shuffledCountries, setShuffledCountries] = useState(
    shuffleArry(countries)
  );
  const [isFocused, setIsFocused] = useState(false);
  useSaveScores({ countries, current, correct });
  const filteredCountries = useMemo(() => {
    const filtered = countryNames.filter((country) => {
      const isInList = country.toLowerCase().includes(query.toLowerCase());
      const isCorrect = correct.includes(country);
      return isInList && !isCorrect;
    });

    return filtered;
  }, [query]);

  const selectItem = (item) => {
    setQuery('');
    setSelectedCountry(item);
  };

  const onCancel = () => {
    setTimeout(() => {
      setIsFocused(false);
    }, 30);
    setSelectedCountry('');
  };

  const onNext = () => {
    const correctCountry = shuffledCountries[current];

    if (correctCountry.country === selectedCountry) {
      setCorrect([...correct, selectedCountry]);
    }
    setSelectedCountry('');
    setTimeout(() => {
      setIsFocused(false);
    }, 30);
    setCurrent(current + 1);
  };

  const handleSkip = () => {
    setShuffledCountries((countries) => {
      const newCountries = [...countries];
      const currentCountry = newCountries[current];
      newCountries.splice(current, 1);
      newCountries.push(currentCountry);
      return newCountries;
    });
  };

  if (current >= countries.length) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <Text style={styles.title}>Game Over</Text>

        <Text>Score: {correct.length}</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.avoidingView}
    >
      <TouchableWithoutFeedback  onPress={() => {
        Keyboard.dismiss()
        setIsFocused(false);
      }}>
        <View style={styles.container}>
          <View style={{ justifyContent: 'flex-start', alignItems: 'center' }}>
            <Text style={styles.title}>Countries Quiz</Text>
            <Text>
              {current + 1} / {countries.length}
            </Text>
          </View>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <View style={{ position: 'relative', zIndex: 100 }}>
              {!!selectedCountry ? (
                <View style={styles.actions}>
                  <Text style={{ fontSize: 20 }}>{selectedCountry}</Text>
                  <View style={styles.buttons}>
                    <Button onPress={onCancel}>Cancel</Button>
                    <Button onPress={onNext} type="success">
                      Next
                    </Button>
                  </View>
                </View>
              ) : (
                <Autocomplete
                  data={filteredCountries}
                  value={query}
                  onChangeText={setQuery}
                  onFocus={() => setIsFocused(true)}
                  hideResults={!isFocused}
                  inputContainerStyle={{ width: 300, borderWidth: 2 }}
                  flatListProps={{
                    style: { maxHeight: 200 },
                    keyExtractor: (_, idx) => idx,
                    renderItem: ({ item }) => (
                      <Item onPress={() => selectItem(item)}>{item}</Item>
                    ),
                  }}
                />
              )}
            </View>
            <SvgUri uri={shuffledCountries[current].flag} style={styles.flag} />
            <View style={{ paddingTop: 30 }}>
              <Button type="info" onPress={handleSkip}>
                Skip
              </Button>
              <Text style={{ textAlign: 'center', paddingTop: 20 }}>Score {correct.length}</Text>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
  
}

const styles = StyleSheet.create({
  avoidingView: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 90,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  flag: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginBottom: 50,
  },
  actions: {
    gap: 20,
    alignItems: 'center',
  },
  buttons: {
    flexDirection: 'row',
    gap: 20,
    justifyContent: 'center',
  },
});
