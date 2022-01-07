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

import Shimmer from 'react-native-shimmer';

import News from './News';
import Videos from './Videos';
import Trending from "./Trending";
import Suggest from "./Suggest";
import Suggest2 from "./Suggest2";
import Latest from "./Latest";

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

  const getBreaking = () => {
    fetch(
      'https://enewstag.com/api/breaking/'+lang.lang,
    )
      .then((response) => response.json())
      .then((json) => lang.setBreaking(json))
      .catch((error) => {setError(true)})
      .finally(() => {setLoading(false);});
    // setRefreshing(false);
    
  };


  useEffect(() => {
    getData();
    getLogData();
    // getBreaking()
    // console.log(lang.acc);
    getNewsData()
    // filtedDataArray()
    // initBackgroundFetch()


    // getLastBreaking();
  }, []);

  
// run in background




// end of background run


  return (
    <View style={styles.container} 
    onLayout={()=>getBreaking()}
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

      <TouchableHighlight underlayColor="#DDDDDD" style={{flexDirection:'row',backgroundColor: 'white',paddingVertical:0,alignItems:'center',elevation:2,borderRadius:5,width:windowWidth-20,marginLeft:10}} onPress={()=>{navigation.navigate('Single', {item: lang.breaking})}}>
        <View style={{alignItems:'center',flexDirection:'row',width:windowWidth-20,backgroundColor:'#fff',borderRadius:5,marginLeft:0,padding:5}} 
        // onLayout={()=>filtedDataArray()}
        >
        
        <Animatable.View   
        // animation="pulse" easing="ease-out" iterationCount="infinite"
        >
               {/* <View style={{backgroundColor: '#e12229',height:1.7,marginVertical:2}}  />  */}
       <Image style={{height:17,width:45,tintColor:'#e12229' }} source={require('../assets/breaking.png')}/>
       {/* <View style={{backgroundColor: '#e12229',height:1.5,marginVertical:2}}  /> */}
        </Animatable.View>
        {
          lang.isLoading?
          <View style={{height:30,justifyContent: 'space-evenly',marginLeft:10}}>
          <Shimmer opacity={0.85} duration={1200}>
            <View style={{backgroundColor:'#e3e3e3',height:10,borderRadius:8,width:windowWidth/1.3}}/>
          </Shimmer>
          <Shimmer opacity={0.85} duration={1200}>
            <View style={{backgroundColor:'#e3e3e3',height:10,borderRadius:8}}/>
          </Shimmer>
        </View>
        :
        <View style={{flexDirection:'row',alignItems:'center'}}>
          <View style={{backgroundColor:'#e12229',width:3,height:25,marginLeft:10}}/>
        <Text style={{paddingHorizontal:5,fontSize:14,width:windowWidth-70}}>{lang.breaking.title}</Text>
        </View>
        }
        
        </View>

      </TouchableHighlight>
     

      <View/>
      <TouchableHighlight style={buttons.menu} underlayColor={'#DDDDDD'} onPress={()=>navigation.dispatch(DrawerActions.openDrawer())}>
        <Icon
        name="navicon"
        size={20}
        color="#000"
        // style={buttons.menu}
        onPress={() => {navigation.dispatch(DrawerActions.openDrawer());Keyboard.dismiss()}}
      />
      </TouchableHighlight>
      
     
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
        <Tab.Screen name="Latest news" component={Latest} />
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
  return <Suggest2 />;
}