import * as React from 'react';
import { Text, View } from 'react-native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import {DrawerActions} from '@react-navigation/native';
import {styles, buttons} from './Styles';
import {useNavigation} from '@react-navigation/native';

import Home from "./HomeNavigation";
import Advertice from "./Advertise";
import Videos from "./Videos";
import Settings from "./Settings";
import Contact from "./Contactus";

const Tab = createMaterialBottomTabNavigator();

export default function MyTabs() {
  return (
    <Tab.Navigator
        initialRouteName="Home2"
        activeColor="#e12229"
        inactiveColor="gray"
        barStyle={{ backgroundColor: '#fff',elevation:25 }}
        shifting={false}
        >
      <Tab.Screen name="Home2" component={Home} 
      options={{
        tabBarLabel: 'Home',
        
        tabBarIcon: ({ color }) => (
          <Ionicons name="home-outline" color={color} size={20} />
        ),
      }}
      />
      


      <Tab.Screen name="Videos" component={VideosScreen} 
      options={{
        tabBarLabel: 'Videos',
        tabBarIcon: ({ color }) => (
          <Ionicons name="videocam-outline" color={color} size={20} />
        ),
      }}
      />
      <Tab.Screen name="Advertise" component={Advertice} 
      options={{
        tabBarLabel: 'Advertise',
        tabBarIcon: ({ color }) => (
          <Ionicons name="megaphone-outline" color={color} size={20} />
        ),
      }}
      />

      <Tab.Screen name="Contact" component={Contact}
      options={{
        tabBarLabel: 'Contact',
        tabBarIcon: ({ color }) => (
          <Ionicons name="md-mail-outline" color={color} size={20} />
        ),
      }}
      />


      <Tab.Screen name="Settings" component={SettingScreen}
      options={{
        tabBarLabel: 'Settings',
        tabBarIcon: ({ color }) => (
          <Ionicons name="settings-outline" color={color} size={20} />
        ),
      }}
      />
    </Tab.Navigator>
  );
}


function VideosScreen() {
    
    const navigation = useNavigation();

    return (
      <View style={styles.container}>
            <Icon
                name="navicon"
                size={20}
                color="#000"
                style={buttons.menu}
                onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
            />
          <View style={{backgroundColor: 'white',height:80,elevation:3,justifyContent:'center'}}>
          <Text style={[styles.mainHeader2,{marginTop:20,marginLeft:20}]}>Videos</Text>
          </View>
        <Videos/>
      </View>
    );
  }

  function SettingScreen() {
    
    const navigation = useNavigation();

    return (
      <View style={styles.container}>
        <Settings/>
      </View>
    );
  }
