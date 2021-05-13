import React, { useContext } from 'react';
import { View, Text, TouchableHighlight } from 'react-native';
import {UserContext}  from '../context/Context';
import { styles , buttons } from './Styles';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import About from "./About";
import {DrawerActions} from '@react-navigation/native';

import { useNavigation , useRoute } from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

function SettingScreen () {

  const navigation = useNavigation();
  const lang = useContext(UserContext);

    return (
      <View style={[styles.container]}>
        <View style={{backgroundColor: 'white',height:80,elevation:3,justifyContent:'center'}}>
          <Text style={[styles.mainHeader2,{marginTop:20,marginLeft:20}]}>Settings</Text>
          </View>
        <Icon
          name="navicon"
          size={20}
          color="#000"
          style={buttons.menu}
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        />
        <Text style={{padding:10,fontSize:13}}>About</Text>
        
        <View style={{flexDirection:'row',paddingHorizontal:20,justifyContent: 'space-between',}}>

        
        {/* <Text style={styles.headerText}> Switch Theme </Text> */}
{/* {lang.theme=='light'?
<TouchableHighlight onPress={()=>lang.setTheme('dark')} underlayColor={"#DDDDDD"}>
<View>
  <Text style={styles.headerText}>Dark Theme</Text>
</View>
</TouchableHighlight>

:

<TouchableHighlight onPress={()=>lang.setTheme('light')} underlayColor={"#DDDDDD"}>
<View>
  <Text style={styles.headerText}>Light Theme</Text>
</View>
</TouchableHighlight>
} */}

<TouchableHighlight style={{padding:5}} onPress={()=>navigation.navigate('About')} underlayColor={"#DDDDDD"}>
<Text style={styles.headerText}>About Us</Text>
</TouchableHighlight>
</View>
<View style={{height:0.8,backgroundColor: 'black',margin:10,}} />
      </View>
    );
}
function AboutScreen({route, navigation}) {
  return <About/>
}

const Stack = createStackNavigator();

export default function Settings() {


return (
    <Stack.Navigator initialRouteName={'Settings'}>
    <Stack.Screen
        name="Settings"
        component={SettingScreen}
        options={{headerShown: false}}
    />
    <Stack.Screen
        name="About"
        component={AboutScreen}
        options={{headerShown: false}}
    />
    </Stack.Navigator>
);
}

