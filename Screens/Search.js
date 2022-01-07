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
    const [result, setResult] = useState([]);
    const [refreshing, setRefreshing] = React.useState(false);
    const [activeSlide, setActiveSlide] = useState();
    const [cat, setCategory] = useState('');
    const [didMount, setDidMount] = useState(false); 
    // const route = useRoute();
    
    // const {search} = route.params;
    const lang = useContext(UserContext);






    const getSearch = () => {
            fetch(
              'https://enewstag.com/api/search/'+lang.lang,
            )
              .then((response) => response.json())
              .then((json) => setResult(json))
              .catch((error) => console.error(error))
              .finally(() => setLoading(false));
            setRefreshing(false);
          };
      
    useEffect(() => {
      setCategory('1')
      getSearch()
    //   getData();

    setDidMount(true);
    return () => {setDidMount(false);getSearch()};

    }, []);

    if(!didMount) {
        return null;
        }

    const onRefresh = () => {
        setRefreshing(true);
        setData([]);
      };

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
          onChangeText={(text) => {setValue(text)}}
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
              result.length == 0 ?
                  <View>
                  </View>
                  :
                <View
                style={{
                    flex: 1,
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                }}>
                  
                  <ScrollView
                    refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                >
                  <View>
                    <View style={{padding:10}}>
                    <Text style={{color:'gray',fontWeight:'bold',fontSize:16}}>Results for "{value}"</Text>
                    </View>
                  {result.map((item,index) => (
                    searchCondition(item) ?
                    <View key={index}>
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
                                {item.datetime==null?'':Moment(item.datetime).format('D MMM yyyy HH:m') }
                            </Text>
                            </View>
                        </View>
                        </View>
                    </TouchableHighlight>
                    </View>
                    :null
                    ))}
                    </View>
                </ScrollView>  
                
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
