import React, {useEffect , useContext, useState} from 'react';
import {
  Dimensions,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import Navigation from './Screens/Navigation';
import { UserProvider } from './context/Context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {UserContext}  from './context/Context';
import BackgroundFetch from "react-native-background-fetch";
import PushNotification from "react-native-push-notification";
import PushNotificationIOS from "@react-native-community/push-notification-ios";
// import {useNavigation} from '@react-navigation/native';
import * as eva from '@eva-design/eva';

const windowWidth = Dimensions.get('window').width;

import {HomeScreen} from './Screens/HomeScreen'
import { ApplicationProvider, Layout, Button } from '@ui-kitten/components';

const App = () => {
  
  
  // const navigation = useNavigation();

  const [isLoading, setLoading] = useState(true);
  
  const [error, setError] = useState(false);

  const [data, setData] = useState([]);

  
  const [token, setToken] = useState('');
  const [Breaking, setBreaking] = useState([]);

  // const storeAccount = async (value) => {

  // }

  const storeTok = async (value) => {
    try {
      await AsyncStorage.setItem('tok', value.token)
      
      const language = await AsyncStorage.getItem('lang');

      console.log(value)
      if(language !== null){
        postToken(language,value.token)
      }
      else{
        postToken('English',value.token)
      }
      
      lang.setToken(value.token)
    } catch (e) {
      // saving error
    }
  }

  const postToken=(lang,token)=>{
    const formData = new FormData()
            
    formData.append('token', token);
    formData.append('language', lang);

    fetch('https://enewstag.com/api/breaking/', {
      method: 'POST', 
      body: formData
    })
    // .then(response => console.log(response.json()))
    .then(response => response.json())
    .then(data => {
      setData(JSON.stringify(data));
      // console.log(data);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  }
  const lang = useContext(UserContext);

  useEffect(() => {
    // StatusBar.setBarStyle('dark-content');
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor('rgba(0,0,0,0)');
      StatusBar.setTranslucent(true);
    }
    SplashScreen.hide();

    PushNotification.createChannel(
      {
        channelId: '123', // (required)
        channelName: "enewstag", // (required)
        channelDescription: "enewstag application", // (optional) default: undefined.
        vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
      },
      (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
    );
    // initBackgroundFetch()
    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: function (token) {
        console.log("TOKEN:", token);
        storeTok(token)
        setToken(token.token)
      },
    
      // (required) Called when a remote is received or opened, or local notification is opened
      onNotification: function (notification) {
        console.log("NOTIFICATION:", notification);
        // navigation.navigate('About')
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
  }, []);

  async function initBackgroundFetch() {
    // BackgroundFetch event handler.
    const onEvent = async (taskId) => {
      
      
        try {
          const value = await AsyncStorage.getItem('lang');
          const breaking = await AsyncStorage.getItem('breaking');

          if(value !== null) {
            
            console.log(value)

              fetch(
                'https://enewstag.com/api/notification/'+value,
              )
                .then((response) => response.json())
                .then((json) => {
                // lang.setBreaking(json)
              // setRefreshing(false);
              
            

                
           

            // console.log(breaking)
            console.log(json)

            PushNotification.localNotification({
              
              // subText: 'Breaking News',
              channelId: '123', // (optional) Valid unique 32 bit integer specified as string. default: Autogenerated Unique ID
              largeIcon: '@mipmap/ic_breaking_foreground',
              smallIcon:"@mipmap/ic_notification_foreground",
              title: "Breaking News", // (optional)
              message: json.title, // (required)
              playSound: false, // (optional) default: true
              // ignoreInForeground: true,
              vibration: 500,
            });

            // JSON.parse(breaking).id==json.id?null:

            json=="yes"?
            console.log('yes')
            // null
            :
            console.log('no')
              PushNotification.localNotification({
                channelId: '123', // (optional) Valid unique 32 bit integer specified as string. default: Autogenerated Unique ID
                largeIcon: '@mipmap/ic_breaking_foreground',
                smallIcon:"@mipmap/ic_notification_foreground",
                title: "Breaking News", // (optional)
                message: json.title, // (required)
                playSound: false, // (optional) default: true
                ignoreInForeground: true,
                vibration: 500,
              });
                 
              // AsyncStorage.setItem('breaking', JSON.stringify(json))

            })
              .catch((error) => {setError(true)})
              .finally(() => {setLoading(false);});

            
          }
          if (breaking==null){
            fetch(
              'https://enewstag.com/api/notification/'+value,
            )
              .then((response) => response.json())
              .then((json) => 
              // setData(json)
              {
              AsyncStorage.setItem('breaking', JSON.stringify(json))
            })

              .catch((error) => {setError(true)})
              .finally(() => {setLoading(false);});
          }

        } catch(e) {
          // error reading value
        }

      // console.log('[BackgroundFetch] task: ', value);

      // Do your background work...
      // await addEvent(taskId);
      // IMPORTANT:  You must signal to the OS that your task is complete.
      BackgroundFetch.finish(taskId);
    }

    // Timeout callback is executed when your Task has exceeded its allowed running-time.
    // You must stop what you're doing immediately BackgorundFetch.finish(taskId)
    const onTimeout = async (taskId) => {
      console.warn('[BackgroundFetch] TIMEOUT task: ', taskId);
      BackgroundFetch.finish(taskId);
    }

    // Initialize BackgroundFetch only once when component mounts.
    let status = await BackgroundFetch.configure({minimumFetchInterval: 15}, onEvent, onTimeout);

    console.log('[BackgroundFetch] configure status: ', status);
  }

  // Add a BackgroundFetch event to <FlatList>
  function addEvent(taskId) {
    // Simulate a possibly long-running asynchronous task with a Promise.
    return new Promise((resolve, reject) => {
      fetch(
        'https://enewstag.com/api/news/',
      )
        .then((response) => response.json())
        .then((json) => 
        // setData(json)
        {
          var filted = new Array()
        json.map((item,index) => {
          'English'==item.language && item.type =='Breaking_News' && item.status=='A'?(
            [filted.push(item),filted2.push(item),filted3.push(item)]
          ):(null)
        })
        setBreaking(filted.pop())
      })
        .catch((error) => {setError(true)})
        .finally(() => {setLoading(false);});
        
      resolve();
    });
  }
  


  return (
    <ApplicationProvider {...eva} theme={{ ...eva.light}}>
    <UserProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar />
          {/* <HomeScreen /> */}
        <Navigation />
      </SafeAreaView>
    </UserProvider>
    </ApplicationProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: '#ECF0F1',
  },
  container1: {
    width: windowWidth,
    height: 400,
  },
});

export default App;
