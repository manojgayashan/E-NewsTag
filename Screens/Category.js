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
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
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

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

function Category () {
    const navigation = useNavigation();

    const [fail, setFail] = useState('');

    const [subscribed, setsubscribed] = useState('');

    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [sub, setSub] = useState([]);
    const [refreshing, setRefreshing] = React.useState(false);

    // const route = useRoute();
    
    // const {loveOne} = route.params;
    const lang = useContext(UserContext);

    const [didMount, setDidMount] = useState(false); 
    const [state, setState] = useState({});

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

    const getNews = () => {
        fetch(
          'https://enewstag.com/api/news',
        )
          .then((response) => response.json())
          .then((json) => setData(json.reverse()))
          .catch((error) => console.error(error))
          .finally(() => setLoading(false));
        setRefreshing(false);
      };

      const getSub = () => {
        fetch(
          'https://enewstag.com/api/subscribe',
        )
          .then((response) => response.json())
          .then((json) => 
          
          setSub(json)
          // console.log(json)
          
          )
          .catch((error) => console.error(error))
          .finally(() => setLoading(false));
        setRefreshing(false);
      };

    useEffect(() => {
      getNews();
      getSub()
    }, []);



    const onRefresh = () => {
        setRefreshing(true);
        setData([]);
        getNews();
        

      }
      
      ;

    function setNewsCategory(input) {
      if (input=='1'){
        return 'World';
      }
      else if (input=='2'){
        return 'Politics';
      }
      else if (input=='3'){
        return 'Business';
      }
      else if (input=='4'){
        return 'Health';
      }
      else if (input=='5'){
        return 'Entertainment';
      }
      else if (input=='6'){
        return 'Style';
      }
      else if (input=='7'){
        return 'Travel';
      }
      else if (input=='8'){
        return 'Sports';
      }
    }


    const onSubscribe = (em,ct) =>{

      const formData = new FormData()
  
      formData.append('email', em);
      formData.append('category', ct);
     
      fetch('https://enewstag.com/api/subscribe/', {
        method: 'POST', // or 'PUT'
        body: formData
      })
      .then(response => response.text())
      .then(data => {
        // getuserData(); 
        
        setFail(data.trim())
        console.log(fail)
      })
      .catch((error) => {
        console.error('Error:', error);
      })
      setFail(false)
    }
  
    


    return (
      <View style={styles.container}>
        
        
        <StatusBar barStyle={'dark-content'} />
        <View style={{backgroundColor:'white',elevation:3,paddingBottom:10}}>
        <Icon
        name="navicon"
        size={20}
        color="#000"
        style={buttons.menu}
        onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
      />
      {lang.catBack==true?
      <Ionicons
      name="arrow-back"
      size={20}
      color="#000"
      style={buttons.menu2}
      onPress={() => {navigation.goBack();lang.setCatBack(false)}}
    />
    :
    null
      }
      <View style={{flexDirection:'row',paddingTop:38,paddingStart:lang.catBack==true?50:25,alignItems:'center',justifyContent:'space-between'}}>
   
          <Text style={[styles.mainHeader2]}>{setNewsCategory(lang.cat)} News</Text>
        
        {lang.logdata.length==0?null:

        
        <TouchableHighlight onPress={()=>onSubscribe(lang.logdata.email,lang.cat)} underlayColor={'#9d151a'} style={{marginRight:60,backgroundColor: 'red',paddingHorizontal: 10,paddingVertical:2,elevation:2,zIndex:1,borderRadius: 5,}}>
          <Text style={{color:'white',}}>Subscribe</Text>
        </TouchableHighlight>
        }

      
        {/* <Text>{fail}</Text> */}
         

      </View>
      
        </View>
          {/* <StatusBar barStyle={'dark-content'}/> */}
         
        <View style={styles.containerInner}>

        {fail=='error'?
        <View style={{backgroundColor:'red',padding:5,elevation:5,alignSelf:'center',bottom:20,position:'absolute'}} 
        
        onLayout={()=>
        setTimeout(() => {
          setFail('')
        }, 800)
          
        }>
          <Text style={[styles.innerText,{color:'white'}]}>Already Registered</Text>
        </View>
        :
        fail=='successEmail sent.'?
        <View style={{backgroundColor:'green',padding:5,alignSelf:'center',bottom:20,position:'absolute',}} 
        onLayout={()=>
          setTimeout(() => {
            setFail('')
          }, 800)
        }
        >
          <Text style={[styles.innerText,{color:'white'}]}>Subscribed</Text>
        </View>
        :
        null
        }
        
                {isLoading || data.length == 0 || refreshing==true?  (
                <Animatable.View style={{flex:1,justifyContent:'center',alignItems:'center'}}
                 >
                <FlatList
                    data={Dummy}
                    keyExtractor={({id}, index) => id}
                    renderItem={({item}) => (
                        <View style={styles.newsContainer}>
                          <Shimmer opacity={0.9} duration={1000}>
                            <View style={[styles.image,{backgroundColor:'#cfcfcf'}]}/>
                          </Shimmer>
                          <View style={[styles.newsInnerContainer]}>
                            <View style={{height:70,justifyContent: 'space-evenly',}}>
                              <Shimmer opacity={0.85} duration={1200}>
                                <View style={{backgroundColor:'#cfcfcf',height:12,borderRadius:6}}/>
                              </Shimmer>
                              <Shimmer opacity={0.85} duration={1150}>
                                <View style={{backgroundColor:'#cfcfcf',height:12,borderRadius:6}}/>
                              </Shimmer>
                              <Shimmer opacity={0.85} duration={1100}>
                                <View style={{backgroundColor:'#cfcfcf',height:12,borderRadius:6}}/>
                              </Shimmer>
                              <Shimmer opacity={0.85} duration={1050}>
                                <View style={{backgroundColor:'#cfcfcf',height:12,borderRadius:6}}/>
                              </Shimmer>
                            </View>
                            
                            <View style={{alignSelf:'flex-end'}}>
                            <Shimmer opacity={0.85} duration={1000}>
                              <View style={{backgroundColor:'#bfbfbf',height:8,width:60,borderRadius:6,paddingBottom:10}}/>
                            </Shimmer>
                              
                            </View>
                          </View>
                          
                        </View>
                    )}
                  />
                </Animatable.View>
            ) : (
                <View
                style={{
                    flex: 1,
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                }}>
                  
                  <FlatList
                    refreshing={true}
                    data={data}
                    keyExtractor={({id}, index) => id}
                    refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                    renderItem={({item}) => (

                      
                       lang.lang==item.language && lang.cat==item.category_id && item.status == 'A'?
                    <TouchableHighlight
                        style={{padding: 0}}
                        underlayColor="#DDDDDD"
                        onPress={() => {navigation.navigate('Single', {item: item});viewCounter(item)}}>
                        <View style={styles.newsContainer}>
                        {item.image ?
                        <Image source={{uri: 'https://enewstag.com/assets/news/images/'+item.image+'.jpg'}} style={styles.image} /> :
                        <Image source={require('../assets/no.jpg')} style={styles.image} />
                        }
                        <View style={[styles.newsInnerContainer]}>
                            <Text style={[styles.headerText]} numberOfLines={4}>{item.title}</Text>
                              <View style={{flexDirection:'row',alignItems:'center',justifyContent: 'space-between',}}>
                              <View style={{flexDirection:'row',alignItems:'center'}}>
                                <Ionicons
                                  name="eye"
                                  size={18}
                                  color="gray"
                                />
                                <Text style={[styles.innerText,{color:'gray'}]}> {item.views}</Text>
                              </View>
                              <Text style={styles.innerText}>{item.datetime==null?'':Moment(item.datetime).format('D MMM yyyy')}</Text>
                              </View>
                            
                        </View>
                        </View>
                    </TouchableHighlight>
                    :
                   <View style={{height:0.05}} onLayout={()=>lang.setCategory(lang.cat)}>
                     <Text style={{color:'#eaeaea'}}>{lang.cat}</Text>
                   </View>
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

export default function MyStack() {
  
const [logged, setLogged] = useState();

return (
    <Stack.Navigator initialRouteName={'Home'}>
    <Stack.Screen
        name="Categories"
        component={Category}
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

// export default function Category({navigation}) {
// return <MyStack />;
// }
