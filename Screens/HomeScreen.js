import React, { useState, useEffect , useContext} from 'react';
import {
  View,
  Text,
  StatusBar,
  Dimensions,
  Image,
  ImageBackground,
  Pressable,
  Keyboard,
  RefreshControl,
  TouchableHighlight,
  StyleSheet
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

import { Tabs, MaterialTabBar } from 'react-native-collapsible-tab-view'

import Shimmer from 'react-native-shimmer';


import Latest from './Latest'
import Trending from './Trending'
import Suggest2 from './Suggest2'

const HEADER_HEIGHT = 55

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function Homescreen({navigation}) {

  const lang = useContext(UserContext);

  const [refreshing, setRefreshing] = React.useState(false);
  const [refreshing2, setRefreshing2] = React.useState(false);
  const [refreshing3, setRefreshing3] = React.useState(false);
  const [error, setError] = useState(false );
  const [isLoading, setLoading] = useState(true);
  
  const Header = () => {
    return (
    <View style={styles2.header}>

      <TouchableHighlight underlayColor="#DDDDDD" style={{flexDirection:'row',backgroundColor: 'transparent',paddingVertical:0,alignItems:'center',borderRadius:5,width:windowWidth-20,marginLeft:10,height:55}} onPress={()=>{navigation.navigate('Single', {item: lang.breaking});viewCounter(lang.breaking)}}>
          <View style={{alignItems:'center',justifyContent:'space-between',flexDirection:'row',width:windowWidth-25,borderRadius:5,marginLeft:0,padding:5}} 
       
          >
          
          <Animatable.View>
            {/* <Text>Breaking News</Text> */}
          <ImageBackground 
          source={{uri: 'https://enewstag.com/assets/news/images/'+lang.breaking.image+'.jpg'}} 
          style={{height:50,width:50,marginLeft:-5}} imageStyle={{borderRadius:60}}>
            <View style={{backgroundColor:'rgba(0,0,0,0.3)',height:50,width:50,borderRadius:50,alignItems:'center',justifyContent:'center'}}>
              <Image style={{height:15,width:40,tintColor:'#e12229' }} source={require('../assets/breaking.png')}/>
            </View>
         
         </ImageBackground>
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
          <Text style={{paddingHorizontal:5,paddingRight:15,fontSize:14,width:windowWidth-70}}>{lang.breaking.title}</Text>
          </View>
          }
          
          </View>
  
        </TouchableHighlight>
    </View>
      )
  }
  const getData = (value) => {
    lang.setData([])
    lang.setLoading(true)
    fetch(
      'https://enewstag.com/api/latestNews/'+value,
    )
      .then((response) => response.json())
      .then((json) => lang.setData(json))
      .catch((error) => {setError(true)})
      .finally(() => {lang.setLoading(false);});
    setRefreshing(false);
  };

  const getPData = (value) => {
    fetch(
      'https://enewstag.com/api/PopularNews/'+value,
    )
      .then((response) => response.json())
      .then((json) => lang.setPData(json))
      .catch((error) => {setError(true)})
      .finally(() => {lang.setLoading(false);});
    setRefreshing2(false);
    
  };

  const getSData = (value) => {
    fetch(
      'https://enewstag.com/api/suggest/'+value,
    )
      .then((response) => response.json())
      .then((json) => lang.setSData(json))
      .catch((error) => {setError(true)})
      .finally(() => {lang.setLoading(false);});
    setRefreshing3(false);
  };

  const viewCounter = (item) =>{
    const formData = new FormData()
    console.log(item.views,item.id)
    let views=item.views++
    // setView(views)
    // formData.append('views', views);
    const data = {views: views+1};
    
    fetch('https://enewstag.com/api/news/'+item.id+'', {
      method: 'PUT', // or 'PUT'
      headers: {
        'Accept': 'application/json, text/plain, */*',  // It can be used to overcome cors errors
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    // .then(response => console.log(response.json()))
    .then(response => response.text())
    .then(data => {
      console.log(data);
    })
    .catch((error) => {
      console.error('Error:', error, JSON.stringify(data));
    });
  
  
  
  } 



  const getBreaking = (value) => {
    lang.setLoading(true)
  // const value = await AsyncStorage.getItem('lang');
  fetch(
    'https://enewstag.com/api/breaking/'+value
  )
    .then((response) => response.json())
    .then((json) => lang.setBreaking(json))
    .catch((error) => {setError(true)})
    .finally(() => {lang.setLoading(false);});
  // setRefreshing(false);
  
};
  const onRefresh = () => {
    setRefreshing(true)
    getData(lang.lang);
    getBreaking(lang.lang)
  };

  const onRefresh2 = () => {
    setRefreshing2(true)
    getPData(lang.lang);
    getBreaking(lang.lang)
  };

  const onRefresh3 = () => {
    setRefreshing3(true)
    getSData(lang.lang);
    getBreaking(lang.lang)
  };

  return (
    <View style={{flex:1,backgroundColor:'white'}}>
      <StatusBar barStyle={'dark-content'}/>
    <View style={{backgroundColor:'white',zIndex:1}}>
      <TouchableHighlight underlayColor="#DDDDDD" style={[styles.searchBarView,{padding: 0,marginTop:35,marginBottom:0,backgroundColor:'#eaeaea',height:30,zIndex:1}]} onPress={()=>{navigation.navigate('Search')}} >
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
          <TouchableHighlight style={buttons.menu} underlayColor={'#DDDDDD'} onPress={()=>navigation.dispatch(DrawerActions.openDrawer())}>
            <Icon
            name="navicon"
            size={20}
            color="#000"
            // style={buttons.menu}
            onPress={() => {navigation.dispatch(DrawerActions.openDrawer());Keyboard.dismiss()}}
          />
          </TouchableHighlight>
    </View>
      

    <Tabs.Container
      renderHeader={Header}
      headerHeight={HEADER_HEIGHT}

      scrollEnabled={true}
      minHeaderHeight={-5}
      lazy={true}
      cancelLazyFadeIn={true}
      renderTabBar={props =>
        <MaterialTabBar {...props}
          activeColor={'#000'}
          inactiveColor={'#6a7075'}
          // inactiveTintColor= {'#bcbcbc'}
          scrollEnabled={true}
          style={{backgroundColor: 'white', color: 'black'}}
          labelStyle={{color: 'black',fontSize:16}}
          indicatorStyle={{backgroundColor: '#e12229',height:4}}/>}
    >
      
      <Tabs.Tab label='Latest News' name="Latest News">
        {/* <Tabs.FlatList
          data={[0, 1, 2, 3, 4]}
          renderItem={renderItem}
          keyExtractor={(v) => v + ''}
        /> */}
        <Tabs.ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}
        >
         <Latest/>
        </Tabs.ScrollView>
      </Tabs.Tab>
      <Tabs.Tab label='Popular News' name="Popular News">
        <Tabs.ScrollView
        refreshControl={<RefreshControl refreshing={refreshing2} onRefresh={onRefresh2}/>}>
          <Trending/>
        </Tabs.ScrollView>
      </Tabs.Tab>
      <Tabs.Tab label='Suggest News' name="Suggest News">
        <Tabs.ScrollView
        refreshControl={<RefreshControl refreshing={refreshing3} onRefresh={onRefresh3}/>}>
          <Suggest2/>
        </Tabs.ScrollView>
      </Tabs.Tab>
    </Tabs.Container>
    </View>
  )
}

const styles2 = StyleSheet.create({
  box: {
    height: 250,
    width: '100%',
  },
  boxA: {
    backgroundColor: 'white',
  },
  boxB: {
    backgroundColor: '#D8D8D8',
  },
  header: {
    height: HEADER_HEIGHT,
    paddingTop:5,
    width: '100%',
    backgroundColor: '#ffffff',
  },
})

