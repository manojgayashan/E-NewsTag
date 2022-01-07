import React, {useEffect, useState, useContext} from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  RefreshControl,
  TouchableHighlight,
  Dimensions,
  TouchableOpacity,
  ScrollView
} from 'react-native';

import {styles} from './Styles';
import {useNavigation} from '@react-navigation/native';
import {Dummy} from "./Dummy";
import Shimmer from 'react-native-shimmer';
import Moment from 'moment';
import {UserContext}  from '../context/Context';
import Ionicons from 'react-native-vector-icons/dist/Ionicons';

import AsyncStorage from '@react-native-async-storage/async-storage';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function Latest() {

    const navigation = useNavigation();
    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [refreshing, setRefreshing] = React.useState(false);
    const [language, setLanguage] = useState();
    const [id, setId] = useState();
    const [error, setError] = useState(false );

    const lang = useContext(UserContext);


    const getLanguageData = async () => {
        try {
          const value = await AsyncStorage.getItem('lang');
          if(value !== null) {
            getData(value)
            getBreaking(value)
            getSData(value)
            getPData(value)
          }
          if(value == null) {
            getData('English')
            getBreaking('English')
            getSData('English')
            getPData('English')
          }
          console.log("ddddddddddddddddddddddddddf"+value)
        } catch(e) {
          // error reading value
        }
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

      const getSData = (value) => {
        fetch(
          'https://enewstag.com/api/suggest/'+value,
        )
          .then((response) => response.json())
          .then((json) => lang.setSData(json))
          .catch((error) => {setError(true)})
          .finally(() => {lang.setLoading(false);});
        setRefreshing(false);
      };

      const getFirst = () => {
        
        lang.setLoading(true)
        lang.setId([])
        fetch(
          'https://enewstag.com/api/first/'+lang.lang,
          )
            .then((response) => response.json())
            .then((json) => 
            lang.setId(json)
            )
            .catch((error) => {console.log(error)})
            .finally(() => {lang.setLoading(false);});
      };


      const onRefresh = () => {
        setRefreshing(true);
        setData([]);
        getData(lang.lang);
        setError(false)
        setLoading(true)
        getFirst()
        getBreaking(lang.lang)
      };

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

      const getPic = async () => {
        try {
          const value = await AsyncStorage.getItem('pic')
          if(value !== null) {
            lang.setPic(value)
            // value previously stored
          }
        } catch(e) {
          // error reading value
        }
      }

      useEffect(() => {
        getLanguageData()
        getPic()      
      }, []);

    return (
        error == true?
        <ScrollView contentContainerStyle={{justifyContent: 'center',alignItems:'center'}} 
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={'#e12229'} />}
        nestedScrollEnabled={true}
        >
          <Image source={require('../assets/error.png')} style={{width:80,height:80,tintColor:'rgba(178,178,178,0.7)'}}/>
        <Text style={styles.drawerText}>Network Error</Text>
        <TouchableOpacity onPress={()=>onRefresh()} style={{backgroundColor:'red',padding:5,paddingHorizontal:7,borderRadius:8}}>
          <Text style={{color:'white'}}>Refresh</Text>
        </TouchableOpacity>
        </ScrollView>
        :
        lang.isLoading || lang.data.length==0 ? (
        
            <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
            <FlatList
                data={Dummy}
                keyExtractor={({id}, index) => id}
                refreshControl={
                  <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                renderItem={({item}) => (
                  item.id==1?
                  <TouchableHighlight
                    style={{padding: 0}}
                    underlayColor="#DDDDDD"
                    onPress={() => navigation.navigate('Single', {item: item})}>
                      <View style={{backgroundColor:'white',marginBottom:1,padding:5}} >
                      <Shimmer opacity={0.85} duration={1200}>
                        <View style={[styles.thumbnail,{backgroundColor:'#cfcfcf'}]}/>
                      </Shimmer>
                        
                        <View style={{padding:5}}>
                        <View style={{flexDirection:'row',justifyContent:'space-between',marginVertical:3}}>
                        <Shimmer opacity={0.85} duration={1000}>
                            <View style={{backgroundColor:'#e3e3e3',height:11,width:40,borderRadius:6,paddingBottom:10}}  />
                            </Shimmer>
    
    
                          <Shimmer opacity={0.85} duration={1000}>
                            <View style={{backgroundColor:'#e3e3e3',height:11,width:60,borderRadius:6,paddingBottom:10}}  />
                            </Shimmer>
                        </View>
                          
                          <View style={{height:40,justifyContent: 'space-evenly',}}>
                            <Shimmer opacity={0.85} duration={1200}>
                              <View style={{backgroundColor:'#e3e3e3',height:15,borderRadius:8}}/>
                            </Shimmer>
                            <Shimmer opacity={0.85} duration={1150}>
                              <View style={{backgroundColor:'#e3e3e3',height:15,borderRadius:8}}/>
                            </Shimmer>
                          </View>
                          <View style={{alignSelf:'flex-start',paddingTop:5}}>
                            <Shimmer opacity={0.85} duration={1000}>
                                <View style={{backgroundColor:'rgba(225,34,41,0.3)',height:11,width:80,borderRadius:6,paddingBottom:10}}  />
                            </Shimmer>
                          </View>
                          
                        </View>
                      </View>
                  </TouchableHighlight>
                  :
                    <View style={styles.newsContainer}>
                      <Shimmer opacity={0.9} duration={1000}>
                        <View style={[styles.image,{backgroundColor:'#cfcfcf'}]}/>
                      </Shimmer>
                      <View style={[styles.newsInnerContainer]}>
                        <View style={{height:70,justifyContent: 'space-evenly',}}>
                          <Shimmer opacity={0.85} duration={1200}>
                            <View style={{backgroundColor:'#e3e3e3',height:15,borderRadius:8}}/>
                          </Shimmer>
                          <Shimmer opacity={0.85} duration={1150}>
                            <View style={{backgroundColor:'#e3e3e3',height:15,borderRadius:8}}/>
                          </Shimmer>
                          <Shimmer opacity={0.85} duration={1100}>
                            <View style={{backgroundColor:'#e3e3e3',height:15,borderRadius:8}}/>
                          </Shimmer>
                        </View>
                        
                        <View style={{height:30,marginBottom:4,justifyContent: 'space-between',}}>
                          <View style={{flexDirection:'row',alignItems:'center'}}>
                            <Shimmer opacity={0.85} duration={1000}>
                            <View style={{backgroundColor:'#e3e3e3',height:11,width:40,borderRadius:6,paddingBottom:10}}  />
                            </Shimmer>
                          </View>
                          <View style={{alignSelf:'flex-end',width:windowWidth - 135,flexDirection:'row',justifyContent: 'space-between'}}>
                            <Shimmer opacity={0.85} duration={1000}>
                              <View style={{backgroundColor:'rgba(225,34,41,0.3)',height:11,width:80,borderRadius:6,paddingBottom:10}}  />
                            </Shimmer>
                            <Shimmer opacity={0.85} duration={1000}>
                              <View style={{backgroundColor:'#e3e3e3',height:11,width:80,borderRadius:6,paddingBottom:10}}  />
                            </Shimmer>
                          </View>
                        </View>
                      </View>
                      
                    </View>
                )}
              />
            </View>
          ) : (
            <View style={{flex: 1,flexDirection: 'column',justifyContent: 'space-between',paddingHorizontal: 0}}
            // onLayout={getData,getBreaking}
            >
              <FlatList
                refreshing={true}
                data={lang.data}
                keyExtractor={({id}, index) => id}
                initialNumToRender={5}
                nestedScrollEnabled={true}
                refreshControl={
                  <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
                }
                
                renderItem={({item , index}) => (
                  
                  // item.language==lang.lang && (Moment(item.datetime).format('D MMM yyyy')==Moment(new Date()).subtract(1, 'days').format('D MMM yyyy') || Moment(item.datetime).format('D MMM yyyy') ==Moment(new Date()).format('D MMM yyyy') )?
                //   item.language==lang.lang?
                //   lang.id.id==item.id  ?

                    index==0?
                  <TouchableHighlight
                    style={{padding: 0}} 
                    underlayColor="#DDDDDD"
                    onPress={() => {navigation.navigate('Single', {item: item});viewCounter(item)}}>
                      <View style={{backgroundColor:'white',marginBottom:1.5,padding:5}} >
                        <Image style={styles.thumbnail} source={{uri: 'https://enewstag.com/assets/news/images/'+item.image+'.jpg'}}/>
                        <View style={{padding:5}}>
                        <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                          <View style={{flexDirection:'row',alignItems:'center'}}>
                            <Ionicons
                              name="eye"
                              size={18}
                              color="gray"
                            />
                            <Text style={[styles.innerText,{color:'gray'}]}> {item.views}</Text>
                          </View>
                          <Text style={styles.innerText}>{item.datetime==null?'':
                          // Moment(item.datetime).format('D MMM yyyy')==Moment(new Date()).format('D MMM yyyy')?Moment(item.datetime).fromNow():
                          Moment(item.datetime).format('D MMM yyyy HH:m') 
                          
                          }</Text>
                          {/* <Text>
                            {
                            // Moment.duration(Moment(new Date()).format('HH:mm').diff(Moment(item.datetime).format('HH:mm')))
                            Moment(item.datetime).fromNow()
                            // Moment(new Date()).format('HH:mm')
                            }
                          </Text> */}
                        </View>
                          <Text style={[styles.headerText]} numberOfLines={3}>{item.title}</Text>
                          <Text style={[styles.innerText,{color:'#e12229'}]}>{setNewsCategory(item.category_id)}</Text>
                        </View>
                      </View>
    
                      
                  </TouchableHighlight>
                  :
                  <TouchableHighlight
                    style={{padding: 0}}
                    underlayColor="#DDDDDD"
                    onPress={() => {navigation.navigate('Single', {item: item});viewCounter(item)}}>
                    <View style={styles.newsContainer} >
                      {item.image ?
                      <Image source={{uri: 'https://enewstag.com/assets/news/images/'+item.image+'.jpg'}} style={styles.image} /> :
                      <Image source={require('../assets/no.jpg')} style={styles.image} />
                    }
                      <View style={[styles.newsInnerContainer]}>
                        <Text style={[styles.headerText]} numberOfLines={3}>{item.title}</Text>
                        <View>
                          <View style={{flexDirection:'row',alignItems:'center'}}>
                            <Ionicons
                              name="eye"
                              size={18}
                              color="gray"
                            />
                            <Text style={[styles.innerText,{color:'gray'}]}> {item.views}</Text>
                            {/* <Text>{id}</Text> */}
                          </View>
                          <View style={{alignSelf:'flex-end',width:windowWidth - 135,flexDirection:'row',justifyContent: 'space-between'}}>
                            <Text style={[styles.innerText,{color:'#e12229'}]}>{setNewsCategory(item.category_id)}</Text>
                            <Text style={styles.innerText}>{item.datetime==null?'':
                          // Moment(item.datetime).format('D MMM yyyy')==Moment(new Date()).format('D MMM yyyy')?Moment(item.datetime).fromNow():
                          Moment(item.datetime).format('D MMM yyyy HH:m')
                          
                          
                          }</Text>
                          {/* <Text>{new Date().toUTCString()}</Text> */}
                          </View>
                        </View>
                        
                      </View>
                    </View>
                  </TouchableHighlight>
                //   :null
                //   <View onLayout={onRefresh}></View>
                  // <Text>{lang.lang } {item.language}</Text>
                )}
              />
            </View>
          )
          
          
    )
}
