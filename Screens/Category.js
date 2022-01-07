import React, {useState, useEffect , useContext, useRef} from 'react';
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
  Button,
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
import RBSheet from "react-native-raw-bottom-sheet";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

function Category () {
    const navigation = useNavigation();

    const [fail, setFail] = useState('');
    const refRBSheet = useRef();
    const [subscribed, setsubscribed] = useState('');

    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [sub, setSub] = useState([]);
    const [refreshing, setRefreshing] = React.useState(false);

    const [more, setMore] = useState(20);
    
    const [language, setLanguage] = useState('');

    const route = useRoute();
    
    // const {id} = route.params;
    const lang = useContext(UserContext);

    const [didMount, setDidMount] = useState(false); 
    const [state, setState] = useState({});

    const [isModalVisible, setModalVisible] = useState(false);

    const toggleModal = () => {
      setModalVisible(!isModalVisible);
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

    const getNews = () => {
      lang.setLoading(true)
        fetch(
          'https://enewstag.com/api/CategoryNews/'+lang.cat+'/'+lang.lang,
        )
          .then((response) => response.json())
          .then((json) => {
           setData(json) 
           console.log(lang.lang)
          }
          
          
          )
          .catch((error) => console.error(error))
          .finally(() => lang.setLoading(false));
        setRefreshing(false);
        console.log(lang.cat)
        setLanguage(lang.lang)
      };

      const getSubs = (cat) => {
        fetch(
          'https://enewstag.com/api/subscribe2/'+cat+'/'+lang.logdata.email,
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
      getSubs(lang.cat)
      
      // getSubs()
    }, []);



    const onRefresh = () => {
        setRefreshing(true);
        setData([]);
        getNews();
        getSubs(lang.cat)
        console.log(lang.lang)
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
      else if (input=='12'){
        return 'Weather';
      }
      else if (input=='13'){
        return 'COVID-19';
      }
      else if (input=='14'){
        return 'Local';
      }
      
    }

    function setLang(input) {
      
      if (input=='Sinhala'){
        return '1';
      }
      else if (input=='Tamil'){
        return '2';
      }   
      else if (input=='English'){
        return '3';
      } 
      else{
        return '4';
      }   
    }


    const onSubscribe = (em,ct,un) =>{

      const formData = new FormData()
  
      formData.append('email', em);
      formData.append('category', ct);
     
      fetch('https://enewstag.com/api/subscribe2/'+un, {
        method: 'POST', // or 'PUT'
        body: formData
      })
      .then(response => response.text())
      .then(data => {
        // getuserData(); 
        
        setFail(data)
        if (un=="sub"){
          refRBSheet.current.open()
        }
        
        console.log(data)
        getSubs(lang.cat)
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
   
          <Text style={[styles.mainHeader2]} onLayout={()=>{onRefresh();getSubs(lang.cat);setLanguage(lang.lang);getNews();}}>{setNewsCategory(lang.cat)} News </Text>
        
        {/* <View onLayout={onRefresh} > */}
          <Text onLayout={onRefresh} style={{fontSize:2,color:'white'}}>{lang.lang}</Text>
        {/* </View> */}

        {lang.logdata.length==0?null:

        sub.length==0?
        <TouchableHighlight onPress={()=>onSubscribe(lang.logdata.email,lang.cat,"sub")} underlayColor={'#9d151a'} style={{marginRight:40,backgroundColor: 'red',paddingHorizontal: 10,paddingVertical:3,elevation:2,zIndex:1,borderRadius: 5,}}>
          <Text style={{color:'white',fontSize:16}}>Subscribe</Text>
        </TouchableHighlight>
        :
        <TouchableHighlight onPress={()=>onSubscribe(lang.logdata.email,lang.cat,"un")}  underlayColor={'#9d151a'} style={{marginRight:40,backgroundColor: 'red',paddingHorizontal: 10,paddingVertical:3,elevation:2,zIndex:1,borderRadius: 5,}}>
          <Text style={{color:'white',fontSize:16}}>Unsubscribe</Text>
        </TouchableHighlight>
        }

      
        {/* <Text>{fail}</Text> */}
         

      </View>
      
        </View>
          {/* <StatusBar barStyle={'dark-content'}/> */}
         
        <View style={styles.containerInner}>


      <RBSheet
        ref={refRBSheet}
        keyboardAvoidingViewEnabled={true}
        height={windowHeight/1.67}
        dragFromTopOnly={true}
        closeOnDragDown={true}
        closeOnPressMask={true}
        customStyles={{
          wrapper: {
            backgroundColor: "rgba(0,0,0,0.1)"
          },
          draggableIcon: {
            backgroundColor: "gray"
          },
          container: {
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            elevation:25
          }
        }}
      >
        <ScrollView style={{padding:10}}>
        <Image style={{alignSelf:'center',marginVertical:15,height:40,width:140}} source={require('../assets/logo.png')}/>
          <Text style={{color:'#6a7075',fontSize:16,lineHeight:25}}>Dear User, 
          {'\n'}{'\n'}{'\t'}Thank you for subscribing to our newsletter! We will keep you update with latest news via email.
          {/* {'\n'}Check your {lang.logdata.email} inbox. */}
          {'\n'}
          {'\n'}Thank you, 
          {'\n'}Team Enewstag.
           </Text>
           <TouchableHighlight onPress={()=>refRBSheet.current.close()} style={{backgroundColor:'#9d151a',padding:5,alignSelf:'flex-end',paddingHorizontal:20,borderRadius:5}}>
             <Text style={{color:'white'}} >Ok</Text>
           </TouchableHighlight>

        </ScrollView>
      </RBSheet>


                {isLoading || data.length == 0 || refreshing==true?  (
                <Animatable.View style={{flex:1,justifyContent:'center',alignItems:'center'}}
                 >
                <FlatList
                    data={Dummy}
                    keyExtractor={({id}, index) => id}
                    renderItem={({item}) => (
                        <View style={styles.newsContainer} >
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
                    renderItem={({item,index}) => (

                      index<=more?
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
                              <Text style={styles.innerText}>{item.datetime==null?'':Moment(item.datetime).format('D MMM yyyy HH:m') }</Text>
                              </View>
                            
                        </View>
                        </View>
                    </TouchableHighlight>
                    :
                    index>more && index<=more+1?
                    <TouchableHighlight style={{alignItems:'center',backgroundColor:'white',padding:5}} underlayColor={'#DDDDDD'} onPress={()=>setMore(more+10)}>
                      <Text>Show more..</Text>
                    </TouchableHighlight>:
                    null
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
