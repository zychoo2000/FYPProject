import React, {useContext} from 'react';
import {
  SafeAreaView,
  Text,
  View,
  Keyboard,
  TouchableOpacity,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {AuthContext} from '../navigation/AuthProvider';

const SuperSafeAreaView = ({mode = '', navigation = '', ...props}) => {
  const {logout} = useContext(AuthContext);
  return mode === 'mainScreen' ? (
    <SafeAreaView
      style={{
        flex: 1,
        width: '100%',
      }}>
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
        }}>
        <View style={{overflow: 'hidden', paddingBottom: 5}}>
          <View
            style={{
              margin: 0,
              // flex: 0.15,
              height: 70,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              shadowColor: '#000',

              shadowOffset: {width: 1, height: 1},
              shadowOpacity: 0.4,
              shadowRadius: 3,
              elevation: 5,
              backgroundColor: '#fff',
            }}>
            <Text
              style={{
                marginLeft: 30,
                textAlign: 'center',
                fontSize: 16,
                fontWeight: 'bold',
                color: 'black',
              }}>
              {navigation}
            </Text>
            <TouchableOpacity style={{marginRight: 5}} onPress={() => logout()}>
              <MaterialIcons name="logout" size={25} color={'black'} />
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            flex: 1,
            backgroundColor: '#FFEFD5',
            borderColor: 'white',
            borderWidth: mode === 'mainScreen' ? 2 : 0,
            ...props.style,
          }}>
          {props.children}
        </View>
      </View>
    </SafeAreaView>
  ) : (
    <SafeAreaView
      style={{
        flex: 1,
        width: '100%',
        backgroundColor: '#FFEFD5',
        ...props.style,
      }}>
      {props.children}
    </SafeAreaView>
  );
};
export default SuperSafeAreaView;
