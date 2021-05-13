import React, {useState, useEffect , useContext} from 'react';
import {
  View,
  Text,
  StatusBar,
  Dimensions,
  TextInput,
  FlatList,
  RefreshControl,
  TouchableHighlight,
  Image,
  Pressable,
  ImageBackground,
  ScrollView,
} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {styles, buttons} from './Styles';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import {DrawerActions} from '@react-navigation/native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import ImageViewer from 'react-native-image-zoom-viewer';
import Modal from 'react-native-modal';
import {useNavigation,useRoute} from '@react-navigation/native';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import Single from './SingleNews'
import { Dummy } from "./Dummy";
import Shimmer from 'react-native-shimmer';
import Moment from 'moment';
import {UserContext}  from '../context/Context';
import Ionicons from 'react-native-vector-icons/dist/Ionicons';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

function LatestScreen () {
    const navigation = useNavigation();

    const [value, setValue] = useState('');
    const [language, setLanguage] = useState();
    const [logged, setLogged] = useState();
    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [refreshing, setRefreshing] = React.useState(false);
    const [activeSlide, setActiveSlide] = useState();
    const [cat, setCategory] = useState('');
    const [didMount, setDidMount] = useState(false); 
    // const route = useRoute();
    
    // const {search} = route.params;
    const lang = useContext(UserContext);
    const getData = async () => {
      try {
        // eslint-disable-next-line no-shadow
        const value = await AsyncStorage.getItem('lang');
        if (value !== null) {
          setLanguage(value);
        }
      } catch (e) {}
    };

    const getLogData = async () => {
      try {
        // eslint-disable-next-line no-shadow
        const data = await AsyncStorage.getItem('log');
        if (data !== null) {
          setLogged(data);
        }
      } catch (e) {}
    };

    const getNews = () => {
        fetch(
          'https://enewstag.com/api/news',
        )
          .then((response) => response.json())
          .then((json) => setData(json))
          .catch((error) => console.error(error))
          .finally(() => setLoading(false));
        setRefreshing(false);
      };

    useEffect(() => {
      getData();
      getLogData();
      getNews();
      setCategory('1')
      setValue(lang.search)
    //   getData();

    setDidMount(true);
    return () => {setDidMount(false);getData();};

    }, []);

    if(!didMount) {
        return null;
        }

    const onRefresh = () => {
        setRefreshing(true);
        setData([]);
        getNews();
      };

      function reverseArr(input) {
        var ret = new Array;
        for(var i = input.length-1; i >= 0; i--) {
            ret.push(input[i]);
        }
        return ret;
    }
    function searchCondition(input) {
      var lowerTitle = input.title.toLowerCase();
      var lowerContent = input.content.toLowerCase();
      var lowerVal = value.toLowerCase();

      if (lowerTitle.includes(lowerVal) || lowerContent.includes(lowerVal) ) {
        return true;
      }
      else{
        return false;
      }
      
  }

    return (
      <View style={styles.container}>
          <StatusBar barStyle={'dark-content'}/>
          <View style={{backgroundColor:'white',elevation:3,height:90}}>
        <Ionicons
        name="arrow-back"
        size={25}
        color="#000"
        style={buttons.menu2}
        onPress={() => {navigation.goBack(),lang.setSearch('')}}
      />
      {/* <Text>{lang.search}</Text> */}
      <View style={[styles.searchScreenView]}>
        <TextInput
          style={[styles.searchBarInput,{width:windowWidth-80,backgroundColor:'#eaeaea',}]}
          placeholder="Looking for.."
          onChangeText={(text) => setValue(text)}
          value={value}
          autoFocus={true}
        />
        <Icon
          name="search"
          size={20}
          color="black"
          style={[buttons.close,{right:10}]}
          onPress={()=>onRefresh()}
        />
      </View>
        </View>
        <View style={styles.containerInner}>

                {value==='' ? (
                  <View style={{flex:1,alignItems:'center',justifyContent: 'center',}}>
                    <Ionicons
                      name="md-search-outline"
                      size={100}
                      color="gray"
                    />
                    <Text style={[styles.headerText,{color:'gray'}]}>Search anything...</Text>
                    </View>
            ) : (
              data.length == 0 ?
                  <View>
                  </View>
                  :
                <View
                style={{
                    flex: 1,
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                }}>
                  
                  <FlatList
                    refreshing={true}
                    data={data.reverse()}
                    keyExtractor={({id}, index) => id}
                    refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                    renderItem={({item}) => (
                      searchCondition(item) && lang.lang==item.language ?
                    <TouchableHighlight
                        style={{padding: 0}}
                        underlayColor="#DDDDDD"
                        onPress={() => navigation.navigate('Single', {item: item})}>
                        <View style={styles.newsContainer}>
                        {item.image ?
                        <Image source={{uri: 'https://enewstag.com/assets/news/images/'+item.image+'.jpg'}} style={styles.image} /> :
                        <Image source={require('../assets/no.jpg')} style={styles.image} />
                        }
                        <View style={[styles.newsInnerContainer]}>
                            <Text style={[styles.headerText]} numberOfLines={4}>{item.title}</Text>
                            <View style={{alignSelf:'flex-end'}}>
                            <Text style={styles.innerText}>
                                {item.datetime==null?'':Moment(item.datetime).format('D MMM yyyy')}
                            </Text>
                            </View>
                        </View>
                        </View>
                    </TouchableHighlight>
                    :null
                    // :<Text>{lang.search}</Text>
                    )}
                />
                  
                
                </View>
            )} 
        </View>
      </View>
    );
  }

function SingleNews({route, navigation}) {
  return <Single/>
}



const Stack = createStackNavigator();

function MyStack() {
// eslint-disable-next-line no-unused-vars
const [logged, setLogged] = useState();
const getLogData = async () => {
    try {
    const data = await AsyncStorage.getItem('log');
    if (data !== null) {
        setLogged(data);
    }
    } catch (e) {}
};

useEffect(() => {
    getLogData();
}, []);

return (
    <Stack.Navigator initialRouteName={'Home'}>
    <Stack.Screen
        name="Latest"
        component={LatestScreen}
        options={{headerShown: false}}
    />
    <Stack.Screen
        name="Single"
        component={SingleNews}
        options={{headerShown: false}}
    />
    </Stack.Navigator>
);
}

export default function Category({navigation}) {
   
return <MyStack />;
}
