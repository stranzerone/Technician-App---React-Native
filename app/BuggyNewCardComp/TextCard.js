import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import RemarkCard from './RemarkCard'; // Assuming you have a RemarkCard component

const TextCard = ({ item, onUpdate }) => {
  const [value, setValue] = useState(item.result || '');

  const handleBlur = () => {
    onUpdate(item.id, value);
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{item.title}</Text>
      
      {/* Text input for value */}
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={setValue}
        onBlur={handleBlur}
        placeholder="Enter your text"
      />

      {/* RemarkCard placed below the text input */}
      <RemarkCard item={item} onRemarkChange={(id, newRemark) => console.log(id, newRemark)} />
    </View>
  );
};

const styles = StyleSheet.create({
  card: { padding: 10, margin: 10, backgroundColor: '#f9f9f9', borderRadius: 10 },
  title: { fontSize: 16, marginBottom: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 8, borderRadius: 5, marginBottom: 10 },
});

export default TextCard;
