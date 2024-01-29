import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';

const Button = ({ children, onPress, type }) => {
  let color = '#e74c3c';

  switch (type) {
    case 'success':
      color = '#2ecc71';
      break;
    case 'info':
      color = '#3498db';
      break;
  }
  
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={[styles.button, { backgroundColor: color }]}>
        <Text style={{ color: '#fff', fontSize: 15 }}>{children}</Text>
      </View>
    </TouchableOpacity>
  )
};

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

