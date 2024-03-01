import * as React from 'react';
import { View, Dimensions, StyleSheet} from 'react-native';
import DoneScreenComponent from '../../components/auth/DoneScreenComponent';

// Screen that says your done
class DoneScreen extends React.Component {

  // Initialize the Signup Screen state
  constructor() {
    super()
    this.state = {
    }
  } 

  // Sends them to home screen
  getStarted = async () => {
    this.props.navigation.reset({
        index: 0,
        routes: [{name: 'Tab'}],
    });
  }

  // Renders the jsx for the UI
  render() {
    return (
        <View style={{height: Dimensions.get('window').height}}>
            <DoneScreenComponent getStarted={this.getStarted} />
        </View>
      )
  }
}

const styles = StyleSheet.create({
    
})

export default DoneScreen