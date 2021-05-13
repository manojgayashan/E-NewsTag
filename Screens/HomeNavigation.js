import React, { useContext ,useState ,useEffect } from 'react';
import { StatusBar, View } from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {UserContext}  from '../context/Context';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Home from './Home'
import News from './News'
import Single from './SingleNews'
import Search from './Search'
import Login from './Login'
import Advertise from './Advertise'
import Category from './Category'

const Stack = createStackNavigator();

function MyStack() {
    const [logged, setLogged] = useState('');
    const lang = useContext(UserContext);

    const storeData = async (data) => {
      try {
        await AsyncStorage.setItem('log', data);
      } catch (e) {
        // saving error
      }
    };
    const getData = async () => {
        try {
        const data = await AsyncStorage.getItem('log');
        if (data !== null) {
            setLogged(data);
            console.log(data)
        }
        } catch (e) {
        // error reading value
        }
    }; 
    useEffect(() => {
      getData();
      storeData('true');
      console.log(lang.acc);
    }, []);
    
  return (

    // logged==''?

    // <Stack.Navigator initialRouteName={'Login'}>
    //   <Stack.Screen
    //     name="Login"
    //     component={Login}
    //     options={{headerShown: false}} 
    //   />
    //   <Stack.Screen
    //     name="News"
    //     component={News}
    //     options={{headerShown: false}}
    //   />
    //   <Stack.Screen
    //     name="Single"
    //     component={Single}
    //     options={{headerShown: false}}
    //   />
    //   <Stack.Screen
    //     name="Home"
    //     component={Home}
    //     options={{headerShown: false}}
    //   />
    //   <Stack.Screen
    //     name="Search"
    //     component={Search}
    //     options={{headerShown: false}}
    //   />
    // </Stack.Navigator>
    // :
    <Stack.Navigator initialRouteName={'Home'}>
       <Stack.Screen
        name="Home"
        component={Home}
        options={{headerShown: false}}
        />
      <Stack.Screen
        name="Login"
        component={Login}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="News"
        component={News}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Single"
        component={Single}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Search"
        component={SearchScreen}
        options={{headerShown: false}}
      />
       <Stack.Screen
        name="Advertise"
        component={Advertise}
        options={{headerShown: false}}
        />
         <Stack.Screen
        name="Categories"
        component={CategoryScreen}
        options={{headerShown: false}}
        />
    </Stack.Navigator>
  );
}

function SearchScreen({ route, navigation }) {
  return <Search/>
}
function CategoryScreen({ route, navigation }) {
  return (
    <View style={{flex:1}}>
      <StatusBar barStyle={'dark-content'} />
      <Category/>
    </View>
  )
  
  
}
export default function HomeNavigation({navigation}) {
  return <MyStack />;
}
