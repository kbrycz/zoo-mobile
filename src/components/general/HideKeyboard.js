import React from 'react'
import {TouchableWithoutFeedback, Keyboard} from 'react-native'

// Makes it so the keyboard disappears if the user clicks outside of it
const HideKeyboard = ({ children }) => (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      {children}
    </TouchableWithoutFeedback>
);

export default HideKeyboard