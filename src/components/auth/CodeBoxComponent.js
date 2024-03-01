import React, {useState, useEffect} from 'react';
import { SafeAreaView, Text, Dimensions, StyleSheet, TouchableOpacity, Clipboard } from 'react-native';
import { CodeField, Cursor, useBlurOnFulfill, useClearByFocusCell } from 'react-native-confirmation-code-field';
import * as Color from '../../../global/colors'

// The code input box for the phone verification code after inputing phone number
const CodeBoxComponent = ({setValue, value}) => {
    const CELL_COUNT = 5;
    const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({value, setValue});

    // Gets the clipboard text from the users phone TODO FOR ELSE
    const fetchCopiedText = async () => {
        const code = await Clipboard.getString()
        if (!isNaN(code) && code.length === 5) {
            setValue(code)
        } else {
            console.log("Code did not work")
        }
    }

  return (
    <SafeAreaView style={styles.root}>
      <CodeField
        autoFocus
        ref={ref}
        {...props}
        value={value}
        onChangeText={setValue}
        cellCount={CELL_COUNT}
        rootStyle={styles.codeFieldRoot}
        keyboardType="number-pad"
        returnKeyType="done"
        blurOnSubmit={true}
        textContentType="oneTimeCode"
        renderCell={({index, symbol, isFocused}) => (
          <Text
            key={index}
            style={[styles.cell, isFocused && styles.focusCell]}
            onLayout={getCellOnLayoutHandler(index)}>
            {symbol || (isFocused ? <Cursor /> : null)}
          </Text>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    root: {
        marginTop: Dimensions.get('window').height * .02,
        marginBottom: Dimensions.get('window').height * .012,
        
    },
    codeFieldRoot: {
        width: Dimensions.get('window').width * .8,
        marginHorizontal: Dimensions.get('window').width * .03,
    },
    cell: {
        width: Dimensions.get('window').width * .14,
        height: Dimensions.get('window').height * .07,
        fontSize: Dimensions.get('window').height * .03,
        paddingTop: Dimensions.get('window').height * .015,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: 'rgba(0,0,0,.1)',
        textAlign: 'center',
        fontFamily: 'QuicksandBold',
        color: Color.MAIN,
        borderRadius: 5,
        overflow: 'hidden'
    },
    focusCell: {
        borderColor: Color.MAIN,
        borderWidth: 2
    },
});

export default CodeBoxComponent;