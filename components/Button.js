import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';

const Button = ({ children, onPress, type }) => (
  <TouchableOpacity onPress={onPress}>
    <View style={[styles.button, { backgroundColor: type === 'success' ? '#2ecc71' : '#e74c3c' }]}>
      <Text style={{ color: '#fff', fontSize: 15 }}>{children}</Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    padding: 10,
    width: 100,
    alignItems: 'center',
    backgroundColor: '#ccc',
    borderRadius: 5
  }
});

export default Button;

