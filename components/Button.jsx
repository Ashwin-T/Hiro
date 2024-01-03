import { Pressable, Text, StyleSheet} from 'react-native';

const Button = (props) => { 

  return (
     <Pressable style={{...styles.buttonNeutral, ...props.moreStyles}} onPress={props.onPress}>
      <Text style = {styles.buttonText}>{props.title}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  buttonNeutral : {
    backgroundColor: "#2a9df1",
    borderRadius: 8,
    padding: 16,
    margin: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 150,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },

})

export default Button;