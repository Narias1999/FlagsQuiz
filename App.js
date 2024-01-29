import { StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import Autocomplete from 'react-native-autocomplete-input';
import { SvgUri } from 'react-native-svg';

import countries from './countries.json';
import { useMemo, useState } from 'react';

const countryNames = countries.map(country => country.country);

const shuffleArry = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * i);
    const temp = shuffled[i];
    shuffled[i] = shuffled[j];
    shuffled[j] = temp;
  }
  return shuffled;
}

const Item = ({ children, onPress }) => (
  <TouchableOpacity onPress={onPress}>
    <Text style={{ fontSize: 16, paddingVertical: 5, paddingHorizontal: 8 }}>{children}</Text>
  </TouchableOpacity>
);

const getFirst10Items = (items) => items.slice(0, 10);

const Button = ({ children, onPress, type }) => (
  <TouchableOpacity onPress={onPress}>
    <View style={[styles.button, { backgroundColor: type === 'success' ? '#2ecc71' : '#e74c3c' }]}>
      <Text style={{ color: '#fff', fontSize: 15 }}>{children}</Text>
    </View>
  </TouchableOpacity>
);

export default function App() {
  const [query, setQuery] = useState('');
  const [current, setCurrent] = useState(0); // countries[0
  const [selectedCountry, setSelectedCountry] = useState('');
  const [correct, setCorrect] = useState([]);
  const filteredCountries = useMemo(() => {
    const filtered = countryNames.filter(country => {
      const isInList = country.toLowerCase().includes(query.toLowerCase());
      const isCorrect = correct.includes(country);
      return isInList && !isCorrect;
    });

    return getFirst10Items(filtered);
  }, [query]);
  const shuffledCountries = useMemo(() => shuffleArry(countries), []);

  const selectItem = (item) => {
    setQuery('');
    setSelectedCountry(item);
  }

  const onCancel = () => {
    setSelectedCountry('');
  }

  const onNext = () => {
    const correctCountry = countries.find(country => country.flag === shuffledCountries[current].flag);
    if (correctCountry.country === selectedCountry) {
      setCorrect([...correct, selectedCountry]);
    }
    setSelectedCountry('');
    setCurrent(current + 1);

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
  },
  button: {
    padding: 10,
    width: 100,
    alignItems: 'center',
    backgroundColor: '#ccc',
    borderRadius: 5
  }
});
