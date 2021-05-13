import React, { useState , useEffect} from 'react';
import { View, Text , FlatList, ImageBackground , RefreshControl, TouchableOpacity, Image,Platform,Dimensions} from 'react-native';
import { styles ,buttons} from './Styles';
import Modal from 'react-native-modal';
import { WebView } from 'react-native-webview';
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import {Dummy} from "./Dummy";
import Shimmer from 'react-native-shimmer';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
export default function Videos () {

  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);  
  const [isModalVisible, setModalVisible] = useState(false);
  const [url, setUrl] = useState();
  const [error, setError] = useState(false );

  const getNews = () => {
    fetch(
      'https://enewstag.com/api/video',
    )
      .then((response) => response.json())
      .then((json) => setData(json.reverse()))
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
    setRefreshing(false);
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  useEffect(() => {
    getNews();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    setData([]);
    getNews();
    setError(false)
    setLoading(true)
  };

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
  

    return (
      <View style={styles.containerInner}>
        <Modal
      animationIn={'fadeIn'}
      animationOut={'fadeOut'}
      isVisible={isModalVisible}
      style={{flex:1,margin:0}}
      backdropOpacity={1}
      onBackButtonPress={()=>toggleModal()}
      >
      <Ionicons
              name="arrow-back"
              size={25}
              color="#fff"
              style={{padding: 10}}
              onPress={()=>toggleModal()}
            />
              <WebView
                style={{ justifyContent: 'center', alignItems: 'center'}}
                allowsFullscreenVideo
                allowsInlineMediaPlayback
                mediaPlaybackRequiresUserAction={false}
                source=
                // {{ html: "<iframe width="+windowWidth+" src="+url+" frameborder='0' allow='autoplay;' allowfullscreen></iframe>" }}
                
                {{ uri: url }} 
              />
      
      </Modal>
      {isLoading && data.length == 0? (
        
        <View style={{flex:1,justifyContent:'center',alignItems:'center'}}
        //  animation={'fadeIn'} duration={400}
        // onLayout={()=>{getData();setData(reverseArr(data))}}
         >
        <FlatList
            data={Dummy}
            keyExtractor={({id}, index) => id}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            renderItem={({item}) => (

              <View style={{marginBottom:20,backgroundColor:'white'}}>

                <View style={{backgroundColor: 'rgba(0,0,0,0.4)',borderRadius:50,padding: 12,justifyContent: 'center',alignItems:'center',position: 'absolute',left:(windowWidth-56)/2,top:((windowWidth/1.8)-56 )/ 2 }}>
                  <Image style={{height:28,width:28,marginLeft:4,marginVertical:2,zIndex:1}} source={require('../assets/play-1.png')} />
                </View>

              <Shimmer opacity={0.85} duration={1000}>
                <View style={[styles.thumbnail,{backgroundColor: '#cfcfcf'}]}/>
              </Shimmer>
              <View style={{padding:7}}>
              <View style={{height:45,justifyContent: 'space-evenly',}}>
                <Shimmer opacity={0.85} duration={1200}>
                  <View style={{backgroundColor:'#e3e3e3',height:15,borderRadius:8}}/>
                </Shimmer>
                <Shimmer opacity={0.85} duration={1150}>
                  <View style={{backgroundColor:'#e3e3e3',height:15,borderRadius:8}}/>
                </Shimmer> 
              </View>
              <View style={{alignSelf:'flex-start',marginVertical:10}}>
                <Shimmer opacity={0.85} duration={1000}>
                <View style={{backgroundColor:'#e3e3e3',height:11,width:80,borderRadius:6,paddingBottom:10}}  />
              </Shimmer>
              </View>
              </View>
              </View>
            )}
          />
        </View>
      ):(
        <FlatList
          data={data}
          keyExtractor={({id}, index) => id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          renderItem={({item}) => (
            <TouchableOpacity style={{marginBottom:1,backgroundColor:'white',padding:5}} onPress={()=>{setUrl(item.url+'?rel=1&autoplay=1');toggleModal()}}>
              <ImageBackground source={{uri: 'https://enewstag.com/assets/videos/'+item.thumbnail+'.jpg'}} style={styles.thumbnail}>
                <View style={{backgroundColor: 'rgba(0,0,0,0.4)',borderRadius:50,padding: 12,justifyContent: 'center',alignItems:'center'}}>
                  <Image style={{height:28,width:28,marginLeft:4,marginVertical:2}} source={require('../assets/play-1.png')} />
                </View>
              </ImageBackground>
              <Text style={[styles.headerText,{padding: 10}]}>{item.video_name}</Text>
              <Text style={[styles.innerText,{paddingLeft: 10,paddingTop:0,paddingBottom:10}]}>| {setNewsCategory(item.cat_id)}</Text>
              </TouchableOpacity>
        )}/>
      
      )}  
      </View>
    );
}
