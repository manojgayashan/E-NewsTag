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
import BackgroundTask from 'react-native-background-task';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {UserContext}  from './context/Context';
import BackgroundFetch from "react-native-background-fetch";

const windowWidth = Dimensions.get('window').width;
const App = () => {
  
  const [isLoading, setLoading] = useState(true);

  const [data, setData] = useState([]);
  const lang = useContext(UserContext);

  useEffect(() => {
    // StatusBar.setBarStyle('dark-content');
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor('rgba(0,0,0,0)');
      StatusBar.setTranslucent(true);
    }
    SplashScreen.hide();

    // BackgroundTask.schedule({
    //   period: 900, // Aim to run every 30 mins - more conservative on battery
    // })
    
    // Optional: Check if the device is blocking background tasks or not
    // checkStatus()
    // getNewsData()

    // initBackgroundFetch()

  }, []);

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

  // async function initBackgroundFetch() {
  //   // BackgroundFetch event handler.
  //   const onEvent = async () => {
  //     console.log('[BackgroundFetch] task: ');
  //     // Do your background work...
  //     fetch(
  //       'https://enewstag.com/api/news/',
  //     )
  //       .then((response) => response.json())
  //       .then((json) =>{ 
  //        filted = new Array()
  //       json.map((item,index) => {
  //         'English'==item.language && item.type =='Breaking_News' && item.status=='A'?(
  //           filted.push(item)
  //         ):(null)
  //       })

  //       console.log(filted.pop())
  //     }
  //       )


  //       // .catch((error) => {setError(true)})
  //       // .finally(() => {setLoading(false);});

  //     // setRefreshing(false);


  //     await getNewsData();
  //     await addEvent();
      


  //     // IMPORTANT:  You must signal to the OS that your task is complete.
  //     BackgroundFetch.finish();
  //   }

  //   // Timeout callback is executed when your Task has exceeded its allowed running-time.
  //   // You must stop what you're doing immediately BackgorundFetch.finish(taskId)
  //   const onTimeout = async () => {
  //     console.warn('[BackgroundFetch] TIMEOUT task: ', );
  //     BackgroundFetch.finish();
  //   }

  //   // Initialize BackgroundFetch only once when component mounts.
  //   let status = await BackgroundFetch.configure({minimumFetchInterval: 15}, onEvent, onTimeout);

  //   console.log('[BackgroundFetch] configure status: ', status);
  // }

  // function addEvent() {
  //   // Simulate a possibly long-running asynchronous task with a Promise.
  //   return new Promise((resolve, reject) => {
  //     var filted = new Array()
  //     data.map((item,index) => {
  //       lang.lang==item.language && item.type =='Breaking_News' && item.status=='A'?(
  //         filted.push(item)
  //       ):(null)
  //     })
  //     // lang.setBreaking(filted.pop());
  //     console.log(data)
  //     resolve();
  //   });
  // }


  // BackgroundTask.define(async () => {
  //   // Fetch some data over the network which we want the user to have an up-to-
  //   // date copy of, even if they have no network when using the app

  //   // const response = await fetch('http://feeds.bbci.co.uk/news/rss.xml')
  //   // const text = await response.text()

  //   var filted = new Array()
  //   data.map((item,index) => {
  //     lang.lang==item.language && item.type =='Breaking_News' && item.status=='A'?(
  //       filted.push(item)
  //     ):(null)
  //   })
  //   lang.setBreaking(filted.pop());

  //   await AsyncStorage.setItem('task', lang.breaking)
    
  //   // Remember to call finish()
  //   BackgroundTask.finish()
  // })

  // const checkStatus = async () => {
  //   const status = await BackgroundTask.statusAsync()
    
  //   if (status.available) {
  //     // Everything's fine
  //     // console.log('fine')
  //     return
  //   }
    
  //   const reason = status.unavailableReason
  //   if (reason === BackgroundTask.UNAVAILABLE_DENIED) {
  //     Alert.alert('Denied', 'Please enable background "Background App Refresh" for this app')
  //   } else if (reason === BackgroundTask.UNAVAILABLE_RESTRICTED) {
  //     Alert.alert('Restricted', 'Background tasks are restricted on your device')
  //   }
  // }


  return (
    <UserProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar />
        <Navigation />
      </SafeAreaView>
    </UserProvider>
    
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
