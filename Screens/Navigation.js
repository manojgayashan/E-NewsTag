import React, { useState ,useEffect, useContext } from 'react';
import { View, Text, Image , Pressable , Dimensions, TouchableHighlight} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator , DrawerContentScrollView , DrawerItemList } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/dist/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from './Styles';
import {Picker} from '@react-native-picker/picker';
import { Collapse , CollapseHeader , CollapseBody } from 'accordion-collapse-react-native';
import {UserContext}  from '../context/Context';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { TabActions } from '@react-navigation/native';

import Home from './HomeNavigation';
import Contactus from './Contactus';
import Login from './Login';
import Advertise from './Advertise';
import Category from './Category';
import TabNavigation from './TabNavigation';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

function CustomDrawerContent(props) {
  
    const [selectedLanguage, setSelectedLanguage] = useState();
    const [language, setLanguage] = useState();
    const [data, setData] = useState([]);
    const [colls, setColls] = useState(false);
    const [state, setState] = useState('Home');
    const [isLoading, setLoading] = useState(true);

    const lang = useContext(UserContext);
    const jumpToAction = TabActions.jumpTo('Home2');
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
    const getLastBreaking =(language)=>{
      data.map((news, index)=>
      language==news.language && news.type =='Breaking_News'?
      lang.setBreaking(news)
      :
      null
    )
    }

    const storeData = async (value) => {
      try {
        await AsyncStorage.setItem('lang', value);
      } catch (e) {
        // saving error
      }
    };

    // const storeLogData = async (data) => {
    //   try {
    //     await AsyncStorage.setItem('log', data);
    //   } catch (e) {
    //     // saving error
    //   }
    // };

    const storeLogData = async (value) => {
      try {
        const jsonValue = JSON.stringify(value)
        await AsyncStorage.setItem('userInfo', jsonValue)
      } catch (e) {
        // saving error
      }
    }

    // const storeAccount = async (value) => {
    //   try {
    //     await AsyncStorage.setItem('userInfo', value)
    //   } catch (e) {
    //     // saving error
    //   }
    // }
    const storeAccount = async (value) => {
      try {
        const jsonValue = JSON.stringify(value)
        await AsyncStorage.setItem('userInfo', jsonValue)
      } catch (e) {
        // saving error
      }
    }
  
    
    const getData = async () => {
      try {
        const value = await AsyncStorage.getItem('lang');
        if(value !== null) {
          setLanguage(value);
          setSelectedLanguage(value);
        }
      } catch(e) {
        // error reading value
      }
    };

    useEffect(() => {
      getData();
      getNewsData();
    }, []);

    return (
      <DrawerContentScrollView {...props}>
          <View style={{padding:10,height:200,justifyContent:'space-between'}} >
            
            {lang.logdata.length==0 ?     
                <Image style={{height:100,width:100,alignSelf:'center'}} source={require('../assets/user.png')}/>
                :
                <View style={{elevation:10,height:100,width:100,alignSelf:'center',borderRadius:50}}>
                  <Image style={{height:100,width:100,alignSelf:'center',borderRadius:50}} source={{uri: lang.logdata.profile_pic}}/>
                </View>
            }



          {lang.logdata.length==0?
          <Text style={[styles.headerText,{alignSelf:'center'}]}></Text>
          :
          <Text style={[styles.headerText,{alignSelf:'center'}]}>{lang.logdata.email}</Text>
        }
          
          {/* <Image style={{height:20,width:75,alignSelf:'center',marginVertical:10}} source={require('../assets/logo.png')}/> */}
          {
            lang.logMail.map((user)=>
            user.email==lang.logdet?
            <View onLayout={()=>{lang.setLogData(user);storeAccount(user)}}>
            </View>
            :null
            )
          }

          
          {/* <Text style={[styles.headerText,{alignSelf:'center'}]}>{lang.logdet}</Text> */}


        {/* {
          lang.logMail.length==0?
          <Text></Text>
          :
          lang.setLogData(lang.logMail)
          // lang.logMail.map((user)=>
          // console.log(user.email)
          // )
          
          
          
        } */}

            <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-evenly',width:180}}>
              <Icon name="language" size={25} color={'black'}/>
              
              <View style={{backgroundColor:'#eaeaea',borderRadius:15,paddingHorizontal:5}}>
                <Picker
                mode={'dropdown'}
                style={{ height: 35, width: 120 }}
                selectedValue={selectedLanguage}
                onValueChange={(itemValue, itemIndex) =>
                  {setSelectedLanguage(itemValue); storeData(itemValue); getData();
                    lang.setLanguage(itemValue);getLastBreaking(itemValue)
                  }
                }>
                  <Picker.Item value="English" label="English" />
                  <Picker.Item value="Sinhala" label="සිංහල" />
                  <Picker.Item value="Tamil" label="தமிழ்" />
                </Picker>
              </View>
              
            </View>
            
          </View>

          {/* <DrawerItem
            label="Help"
            onPress={() => props.navigation.navigate('Categories', {  loveOne: "son" })}
          /> */}

        {/* <DrawerItemList {...props} /> */}
        
        <View>
            <TouchableHighlight underlayColor={lang.state=='Home'?'#9d151a':"#DDDDDD"} style={{flexDirection:'row',alignItems: 'center',justifyContent: 'space-between',backgroundColor:lang.state=='Home'|| state == 'Home'?'#e12229': 'white'}} 
            onPress={()=>{props.navigation.navigate('Home');lang.setState('Home');props.navigation.dispatch(jumpToAction)}}>
              <Text style={[styles.drawerText,,{color:lang.state =='Home' || state == 'Home'?'white':'black'}]}>Home</Text>
            </TouchableHighlight>
          <Collapse isExpanded={true} onToggle={(isExpanded)=>setColls(isExpanded)}	>
            <CollapseHeader>
              <View style={{flexDirection:'row',alignItems: 'center',justifyContent: 'space-between',backgroundColor: 'white',paddingRight:10}}>
                <Text style={[styles.drawerText,]}>Categories</Text>
                {colls?<FontAwesome name="angle-down" size={22} color={'black'} />:<FontAwesome name="angle-up" size={22} color={'black'}/>}  
              </View>
            </CollapseHeader>
            <CollapseBody>
            <TouchableHighlight underlayColor={lang.state=='world'?'#9d151a':"#DDDDDD"} style={[styles.drawerItem,{backgroundColor:lang.state=='world'?'#e12229':'white'}]} onPress={()=>{props.navigation.navigate('Categories');lang.setState('world');lang.setCategory('1');setState('1');lang.setCatBack(false)}}>
              <Text style={[styles.drawerText,{color:lang.state=='world'?'white':'black'}]}>World</Text>
            </TouchableHighlight>
            <TouchableHighlight underlayColor={lang.state=='pol'?'#9d151a':"#DDDDDD"} style={[styles.drawerItem,{backgroundColor:lang.state=='pol'?'#e12229':'white'}]} onPress={()=>{props.navigation.navigate('Categories');lang.setState('pol');lang.setCategory('2');setState('2');lang.setCatBack(false)}}>
              <Text style={[styles.drawerText,{color:lang.state=='pol'?'white':'black'}]}>Politics</Text>
            </TouchableHighlight>
            <TouchableHighlight underlayColor={lang.state=='bus'?'#9d151a':"#DDDDDD"} style={[styles.drawerItem,{backgroundColor:lang.state=='bus'?'#e12229':'white'}]} onPress={()=>{props.navigation.navigate('Categories');lang.setState('bus');lang.setCategory('3');setState('3');lang.setCatBack(false)}}>
              <Text style={[styles.drawerText,{color:lang.state=='bus'?'white':'black'}]}>Business</Text>
            </TouchableHighlight>
            <TouchableHighlight underlayColor={lang.state=='health'?'#9d151a':"#DDDDDD"} style={[styles.drawerItem,{backgroundColor:lang.state=='health'?'#e12229':'white'}]} onPress={()=>{props.navigation.navigate('Categories');lang.setState('health');lang.setCategory('4');setState('4');lang.setCatBack(false)}}>
              <Text style={[styles.drawerText,{color:lang.state=='health'?'white':'black'}]}>Health</Text>
            </TouchableHighlight>
            <TouchableHighlight underlayColor={lang.state=='ent'?'#9d151a':"#DDDDDD"} style={[styles.drawerItem,{backgroundColor:lang.state=='ent'?'#e12229':'white'}]} onPress={()=>{props.navigation.navigate('Categories');lang.setState('ent');lang.setCategory('5');setState('5');lang.setCatBack(false)}}>
              <Text style={[styles.drawerText,{color:lang.state=='ent'?'white':'black'}]}>Entertainment</Text>
            </TouchableHighlight>
            <TouchableHighlight underlayColor={lang.state=='sty'?'#9d151a':"#DDDDDD"} style={[styles.drawerItem,{backgroundColor:lang.state=='sty'?'#e12229':'white'}]} onPress={()=>{props.navigation.navigate('Categories');lang.setState('sty');lang.setCategory('6');setState('6');lang.setCatBack(false)}}>
              <Text style={[styles.drawerText,{color:lang.state=='sty'?'white':'black'}]}>Style</Text>
            </TouchableHighlight>
            <TouchableHighlight underlayColor={lang.state=='trv'?'#9d151a':"#DDDDDD"} style={[styles.drawerItem,{backgroundColor:lang.state=='trv'?'#e12229':'white'}]} onPress={()=>{props.navigation.navigate('Categories');lang.setState('trv');lang.setCategory('7');setState('7');lang.setCatBack(false)}}>
              <Text style={[styles.drawerText,{color:lang.state=='trv'?'white':'black'}]}>Travel</Text>
            </TouchableHighlight>
            <TouchableHighlight underlayColor={lang.state=='spo'?'#9d151a':"#DDDDDD"} style={[styles.drawerItem,{backgroundColor:lang.state=='spo'?'#e12229':'white'}]} onPress={()=>{props.navigation.navigate('Categories');lang.setState('spo');lang.setCategory('8');setState('8');lang.setCatBack(false)}}>
              <Text style={[styles.drawerText,{color:lang.state=='spo'?'white':'black'}]}>Sports</Text>
            </TouchableHighlight>
            </CollapseBody>
          </Collapse> 
        </View>


        {/* <View style={{backgroundColor:'#303030',height:0.5,marginTop:5,marginBottom:5}} /> */}
        {/* <Pressable style={{flexDirection:'row',alignItems: 'center',justifyContent: 'space-between',backgroundColor:lang.state=='con'?'#e12229':'white'}} 
        onPress={()=>{props.navigation.navigate('Contact');lang.setState('con')}}>
          <Text style={[styles.drawerText,{color:lang.state=='con'?'white':'black'}]}>Contact Us</Text>
        </Pressable> */}


        <View style={{backgroundColor:'#303030',height:0.5,marginTop:5,marginBottom:5}} />
        <TouchableHighlight underlayColor={lang.state=='log'?'#9d151a':"#DDDDDD"} style={{flexDirection:'row',alignItems: 'center',justifyContent: 'space-between',backgroundColor:lang.state=='log'?'#e12229':'white'}} 
        onPress={()=>{props.navigation.navigate('Logout');lang.setState('log');lang.setLogData([]);storeLogData([])}}>
          <Text style={[styles.drawerText,{color:lang.state=='log'?'white':'black'}]}>{lang.logdata.length==0 ?'Login':'Logout'}</Text>
        </TouchableHighlight>
      </DrawerContentScrollView>
    );
  }


const Drawer = createDrawerNavigator();

function MyDrawer() {
  const storeLogData = async (data) => {
    try {
      await AsyncStorage.setItem('log', data);
    } catch (e) {
      // saving error
    }
  };
  return (
    <Drawer.Navigator 
    // detachInactiveScreens={true}
    unmountInactiveRoutes={false}
    drawerContent={props => <CustomDrawerContent {...props} />} 
    drawerType={'slide'}
    drawerPosition={'right'}
    overlayColor={'rgba(0,0,0,0.2)'}
    // drawerStyle={{
    //   // backgroundColor: '#303030',
    //   width: windowWidth/2,
    // }}
    initialRouteName={'Home'} 
    drawerContentOptions={{
      activeTintColor:'black',
      labelStyle:styles.drawerText,
      inactiveTintColor:'gray'
      }}>
        <Drawer.Screen name="Home" component={TabNavigation}
        options={({ route }) => {
          const routeName = getFocusedRouteNameFromRoute(route);
          return {
            swipeEnabled: routeName == 'Home',
          };
       }}
        />
        <Drawer.Screen name="Categories" component={Category}
        options={({ route }) => {
          const routeName = getFocusedRouteNameFromRoute(route);
          return {
            swipeEnabled: routeName == 'Latest',
          };
       }}
        />
        <Drawer.Screen name="Advertise" component={Advertise} />
        <Drawer.Screen name="Contact" component={Contactus}/>
        <Drawer.Screen name="Logout" component={Login} 
        options={{ swipeEnabled: false }}
        />
    </Drawer.Navigator>
  );
}
export default function Navigation() {
    return (
      <NavigationContainer>
        <MyDrawer />
      </NavigationContainer>
    );
  }