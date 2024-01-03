
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Pressable, Text, StyleSheet} from 'react-native';
const SettingsChooser = ({ title, icon, iconColor, onPress }) => {
  return (
    <Pressable style={styles.chooser} onPress={onPress}>
      <Icon name={icon} size={32} color= {iconColor} />
      <Text style={{ ...styles.text, color: iconColor,  }}>{title}</Text>
      <Icon name = 'arrow-forward-ios' size={18} color= 'grey' style = {{position: 'absolute', right: 24}}/>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  chooser: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 4,
    marginBottom: 4,
    padding: 8,
  },
  text: {
    fontSize: 20,
    color: 'black',
    textAlign: 'left',
    fontWeight: 'semibold',
    marginLeft: 8,
  },
});

export default SettingsChooser;