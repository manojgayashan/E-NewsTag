import React, {useState} from 'react';
import {View, Dimensions , Text , ActivityIndicator, ScrollView,Image} from 'react-native';
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
        <ScrollView style={[styles.container,{padding:15,paddingBottom:50}]}>
          {/* <WebView
            style={{ marginTop: -220, marginBottom:0 }}  
            source={{ uri: 'https://enewstag.com/web/aboutus' }} 
            onLoadStart={() => showSpinner()}
            onLoadEnd={() => hideSpinner()}
            /> */}
            <Image style={{alignSelf:'center',margin:15,height:45,width:160}} source={require('../assets/logo.png')}/>
            <Text style={{lineHeight:25}}>
            EnewsTag now available in English, Sinhala, Tamil and Burmese. In the highly competitive news broadcasting space, EnewsTag has built probably the most unbiased and comprehensive news property on offer " EnewsTag " – with deliver the most accurate and timely information. EnewsTag To be the quantity one News brand among Sri Lankans in terms of loyalty by reaching them through every possible opportunity.
            {'\n'}{'\n'}
            EnewsTag now for the latest business news updates, live news updates, political updates, health updates, sports updates, breaking news, and many more.
            {'\n'}{'\n'}
            EnewsTag is a Trilingual News site with Audio Video Photo and Text news within one site in all 3 languages Sinhala, Tamil, English and Burmese.
            {'\n'}{'\n'}
            Features:{'\n'}
            - Read, listen or watch news in your own language; Sinhala, Tamil, English or Burmese{'\n'}
            - Read Text news in categories:{'\n'}
            • Politics{'\n'}
            • Business{'\n'}
            • Health{'\n'}
            • Entertainment{'\n'}
            • Style{'\n'}
            • Travel{'\n'}
            • Sports{'\n'}
            • Weather{'\n'}
            • COVID-19{'\n'}
            • Local{'\n'}
            - Trilingual News web with Audio Video Photo and Text News.{'\n'}
            - Receive breaking news as Push Notifications in your language{'\n'}
            - Allows to share news with anyone through Facebook, twitter and etc...{'\n'}
            - Enable/Disable breaking news notifications{'\n'}
            - Enable/Disable loading news images (to save your data){'\n'}
            - Displays a breaking News ticker while surfing the site to keep you updated with the latest events on the go.{'\n'}
            - User can place advertisements after logging in.{'\n'}
            - News can be subscribed{'\n'}{'\n'}
            </Text>
        </ScrollView>

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
