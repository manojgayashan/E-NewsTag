import React, {useState} from 'react';
import {View, Dimensions , Text , ActivityIndicator} from 'react-native';
import { styles , buttons } from './Styles';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import { WebView } from 'react-native-webview';
import {useNavigation} from '@react-navigation/native';
import {DrawerActions} from '@react-navigation/native';
import Shimmer from 'react-native-shimmer';

import Ionicons from 'react-native-vector-icons/dist/Ionicons';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function Contactus () {
  const navigation = useNavigation();
  
  const [visible, setVisible] = useState();

  const hideSpinner=()=> {
    setVisible(false)
  }

  const showSpinner=()=> {
    setVisible(true)
  }


    return (
      <View style={styles.container}>
        <View style={{backgroundColor: 'white',height:80,elevation:3,justifyContent:'center'}}>
          <Text style={[styles.mainHeader2,{marginTop:20,marginLeft:60}]}>About Us</Text>
          </View>
            <Ionicons
            name="arrow-back"
            size={25}
            color="#000"
            style={buttons.menu2}
            onPress={() => navigation.goBack()}
        />
        <View style={styles.containerInner}>
          <WebView
            style={{ marginTop: -220, marginBottom:0 }}  
            source={{ uri: 'https://enewstag.com/web/aboutus' }} 
            onLoadStart={() => showSpinner()}
            onLoadEnd={() => hideSpinner()}
            />
        </View>

        {visible && (
          <View style={{flex:1,justifyContent: 'center',marginTop:windowHeight}}>
            <View style={{marginTop:-windowHeight/1.7}}>
            <ActivityIndicator size={45} color="#e12229"/>
            </View>
          </View>
        )} 

      </View>

      
    );
}
