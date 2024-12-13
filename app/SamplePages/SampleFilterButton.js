import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function FilterSection({ onFilterPress }) {
  return (
    <View className="w-[90vw] mr-[10vw] border  h-14 flex flex-row mt-1 items-center justify-start bg-[#4289bc] rounded-lg ">  

      {/* Filter Button */}
      <TouchableOpacity
        onPress={onFilterPress}
        className="w-1/2 h-full bg-white border-1 border-gray-600 shadow-lg shadow-gray-700 rounded-r-full flex-row items-center justify-center">
        
        {/* Filter Icon */}
        <Text>
        <Icon name="filter" size={20} color="#000" /> {/* Change icon color to black */}

        </Text>

        {/* Filter Label */}
        <Text className="text-black font-bold ml-2">Filter Options</Text>
      </TouchableOpacity>

      {/* Current Status Display */}
      <View className="flex-1 h-full  flex items-center justify-center">
        <Text className="text-white font-bold text-lg">OPEN</Text>
      </View>

    </View>
  );
}
