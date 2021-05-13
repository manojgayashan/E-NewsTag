import React, { useState, useEffect , useContext} from 'react';
import {
  View,
  Text,
  StatusBar,
  Dimensions,
  Image,
  TextInput,
  Pressable,
  Keyboard,
  TouchableOpacity,
  TouchableHighlight,
  Button
} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {styles, buttons} from './Styles';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import {DrawerActions} from '@react-navigation/native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import ImageViewer from 'react-native-image-zoom-viewer';
import Modal from 'react-native-modal';
import {UserContext}  from '../context/Context';
import PushNotification from "react-native-push-notification";
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import BackgroundFetch from "react-native-background-fetch";

import News from './News';
import Videos from './Videos';
import Trending from "./Trending";
import Suggest from "./Suggest";


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const Tab = createMaterialTopTabNavigator();

export default function HomeScreen({navigation}) {
  const [breaking, setBreaking] = useState('');
  const [language, setLanguage] = useState();
  const [logged, setLogged] = useState();
  const [isLoading, setLoading] = useState(true);

  
  const [filtedData, setFilltedData] = useState([]);
  const [data, setData] = useState([]);

  const lang = useContext(UserContext);



  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('lang');
      if (value !== null) {
        setLanguage(value);
      }
    } catch (e) {}
  };

  const getLogData = async () => {
    try {
      const data = await AsyncStorage.getItem('log');
      if (data !== null) {
        setLogged(data);
      }
    } catch (e) {}
  };

  const getNewsData = () => {
    fetch(
      'https://enewstag.com/api/news/',
    )
      .then((response) => response.json())
      .then((json) => setData(json))
      .catch((error) => {setError(true)})
      .finally(() => {setLoading(false);});
    // setRefreshing(false);
    
  };

  function filtedDataArray() {
    // getData()
    var filted = new Array()
    data.map((item,index) => {
      lang.lang==item.language && item.type =='Breaking_News' && item.status=='A'?(
        filted.push(item)
      ):(null)
    })
    lang.setBreaking(filted.pop());
    // console.log(filted.pop())
  }
  


  useEffect(() => {
    getData();
    getLogData();
    // console.log(lang.acc);
    getNewsData()
    // filtedDataArray()
    // initBackgroundFetch()

    PushNotification.createChannel(
      {
        channelId: '123', // (required)
        channelName: "enewstag", // (required)
        channelDescription: "enewstag application", // (optional) default: undefined.
        vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
      },
      (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
    );
    // getLastBreaking();
  }, []);

  PushNotification.configure({
    // (optional) Called when Token is generated (iOS and Android)
    onRegister: function (token) {
      console.log("TOKEN:", token);
    },
  
    // (required) Called when a remote is received or opened, or local notification is opened
    onNotification: function (notification) {
      console.log("NOTIFICATION:", notification);
  
      // process the notification
  
      // (required) Called when a remote is received or opened, or local notification is opened
      notification.finish(PushNotificationIOS.FetchResult.NoData);
    },
  
    // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
    onAction: function (notification) {
      console.log("ACTION:", notification.action);
      console.log("NOTIFICATION:", notification);
  
      // process the action
    },
  
    // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
    onRegistrationError: function(err) {
      console.error(err.message, err);
    },
  
    // IOS ONLY (optional): default: all - Permissions to register.
    permissions: {
      alert: true,
      badge: true,
      sound: true,
    },
  
    popInitialNotification: true,

    requestPermissions: true,
  });


  function sendMessage(){

    PushNotification.localNotification({
      channelId: '123', // (optional) Valid unique 32 bit integer specified as string. default: Autogenerated Unique ID
      largeIcon: '@mipmap/ic_breaking_foreground',
      smallIcon:"@mipmap/ic_notification_foreground",
      title: "Breaking News", // (optional)
      message: lang.breaking.title, // (required)
      playSound: false, // (optional) default: true
    });
  }

// run in background

async function initBackgroundFetch() {
  // BackgroundFetch event handler.
  const onEvent = async () => {
    console.log('[BackgroundFetch] task: ');
    // Do your background work...
    fetch(
      'https://enewstag.com/api/news/',
    )
      .then((response) => response.json())
      .then((json) =>{ 
       filted = new Array()
       json.map((item,index) => {
        lang.lang==item.language && item.type =='Breaking_News' && item.status=='A'?(
          filted.push(item)
        ):(null)
      })
      lang.setBreaking(filted.pop());
      console.log(lang.lang)
    }
      )
      PushNotification.localNotification({
        channelId: '123', // (optional) Valid unique 32 bit integer specified as string. default: Autogenerated Unique ID
        largeIcon: '@mipmap/ic_breaking_foreground',
        smallIcon:"@mipmap/ic_notification_foreground",
        title: "Breaking News", // (optional)
        message: lang.breaking.title, // (required)
        playSound: false, // (optional) default: true
      });

      // await sendMessage()

      // .catch((error) => {setError(true)})
      // .finally(() => {setLoading(false);});

    // setRefreshing(false);


    // await getNewsData();
    // await addEvent();
    


    // IMPORTANT:  You must signal to the OS that your task is complete.
    BackgroundFetch.finish();
  }

  // Timeout callback is executed when your Task has exceeded its allowed running-time.
  // You must stop what you're doing immediately BackgorundFetch.finish(taskId)
  const onTimeout = async () => {
    console.warn('[BackgroundFetch] TIMEOUT task: ', );
    BackgroundFetch.finish();
  }

  // Initialize BackgroundFetch only once when component mounts.
  let status = await BackgroundFetch.configure({minimumFetchInterval: 15}, onEvent, onTimeout);

  console.log('[BackgroundFetch] configure status: ', status);
}

function addEvent() {
  // Simulate a possibly long-running asynchronous task with a Promise.
  return new Promise((resolve, reject) => {
    var filted = new Array()
    data.map((item,index) => {
      lang.lang==item.language && item.type =='Breaking_News' && item.status=='A'?(
        filted.push(item)
      ):(null)
    })
    lang.setBreaking(filted.pop());
    // console.log(data)
    resolve();
  });
}



// end of background run


  return (
    <View style={styles.container} 
    onLayout={()=>filtedDataArray()}
    >
      <StatusBar barStyle={'dark-content'}/>
      
      <TouchableHighlight underlayColor="#DDDDDD" style={[styles.searchBarView,{padding: 0,marginTop:30,backgroundColor:'#eaeaea',height:30}]} onPress={()=>{navigation.navigate('Search')}} >
        <View style={{justifyContent: 'space-between',flexDirection:'row',alignItems:'center'}}>
          <View style={[styles.searchBarInput]}>
          <Text style={{color: 'gray',fontSize:14}}>Looking for..</Text>
          </View>
        <Icon
          name="search"
          size={18}
          color={'black'}
        />
        </View>
      </TouchableHighlight>

      <TouchableHighlight underlayColor="#DDDDDD" style={{flexDirection:'row',backgroundColor: 'white',paddingVertical:0,alignItems:'center',elevation:2,borderRadius:5,width:windowWidth-20,marginLeft:10}} onPress={()=>{navigation.navigate('Single', {item: lang.breaking});sendMessage()}}>
       {/* <View  style={{flexDirection:'row',paddingHorizontal:10,paddingBottom:5,alignItems:'center',width:windowWidth}} onLayout={()=>filtedDataArray()}> */}
         

        {/* <View style={{backgroundColor: '#e12229',height:1.5,marginVertical:2}}  /> */}
        <View style={{alignItems:'center',flexDirection:'row',width:windowWidth-20,backgroundColor:'#fff',borderRadius:5,marginLeft:0,padding:5}} 
        // onLayout={()=>filtedDataArray()}
        >
        
        <Animatable.View   
        animation="pulse" easing="ease-out" iterationCount="infinite">
               <View style={{backgroundColor: '#e12229',height:1.7,marginVertical:2}}  /> 
       <Image style={{height:15,width:40,tintColor:'#e12229' }} source={require('../assets/breaking.png')}/>
       <View style={{backgroundColor: '#e12229',height:1.5,marginVertical:2}}  />
        </Animatable.View>

        <Text style={{paddingHorizontal:10,fontSize:13,width:windowWidth-70}}>{lang.breaking==null?filtedDataArray():lang.breaking.title} </Text>
        {/* <Text style={{paddingHorizontal:10,fontSize:13,width:windowWidth-70}}>{lang.breaking==null?null:lang.breaking.title} </Text> */}
        </View>
        {/* <View style={{backgroundColor: '#e12229',height:1.5,marginVertical:2}}  /> */}
       {/* </View> */}

      </TouchableHighlight>
      {/* <Button title={'click'} onPress={()=>sendMessage()} /> */}

      {/* <Button
          title="Read results from AsyncStorage"
          onPress={async () => {
            const result = await AsyncStorage.getItem('task')
            console.log(result) 
          }}
        /> */}

      <View/>
      <Icon
        name="navicon"
        size={20}
        color="#000"
        style={buttons.menu}
        onPress={() => {navigation.dispatch(DrawerActions.openDrawer());Keyboard.dismiss()}}
      />
     
      <Tab.Navigator
      lazy={true}
        tabBarOptions={{
          activeTintColor: '#000000',
          inactiveTintColor: '#bcbcbc',
          scrollEnabled: true,
          // tabStyle: { width: 'auto'},
          style: {backgroundColor: 'white', elevation: 5,marginTop:-5},
          labelStyle: {
            fontSize: 16,
            textTransform: 'capitalize',
            fontFamily: 'sans-serif-medium',
          },
          indicatorStyle :{
            backgroundColor:'#e12229',
            height:4,
            // margin:5,
            // borderRadius:10
          }
          // renderIndicator: (props) => {
          //   return <View />;
          // },
        }}>
        <Tab.Screen name="Latest news" component={NewsScreen} />
        <Tab.Screen name="Popular news" component={TrendingScreen} />
        <Tab.Screen name="Suggest news" component={SuggestScreen} />
        {/* <Tab.Screen name="Videos" component={VideosScreen} /> */}
      </Tab.Navigator>
    </View>
  );
}

function NewsScreen({navigation}) {
  return <News />;
}

function VideosScreen({navigation}) {
  return <Videos />;
}
function TrendingScreen({navigation}) {
  return <Trending />;
}

function SuggestScreen({navigation}) {
  return <Suggest />;
}