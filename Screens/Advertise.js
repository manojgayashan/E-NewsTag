import React, {useState,useContext,useRef} from 'react';
import {View, Dimensions , ActivityIndicator,Text, ScrollView, Image,TextInput, TouchableHighlight} from 'react-native';
import { styles , buttons } from './Styles';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import { WebView } from 'react-native-webview';
import {useNavigation} from '@react-navigation/native';
import {DrawerActions} from '@react-navigation/native';
import Shimmer from 'react-native-shimmer';
import {UserContext}  from '../context/Context';
// import {  } from 'react-native-gesture-handler';
import DatePicker from 'react-native-date-picker'
import Modal from 'react-native-modal';
import RBSheet from "react-native-raw-bottom-sheet";
import Moment from 'moment';
import { RadioButton } from 'react-native-paper';
import MultiSelect from 'react-native-multiple-select';
import Ionicons from 'react-native-vector-icons/dist/Ionicons';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
export default function Advertise () {

  const [isModalVisible, setModalVisible] = useState(false);
  const lang = useContext(UserContext);
  const [date, setDate] = useState(new Date())
  const navigation = useNavigation();
  const [visible, setVisible] = useState();

  const [selectedItems , setSelectedItems] = useState([]);


  const hideSpinner=()=> {
    setVisible(false)
  }

  const showSpinner=()=> {
    setVisible(true)
  }
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const refRBSheet = useRef();
  const [checked, setChecked] = React.useState('first');
  const items = [{
      id: '1',
      name: 'World'
    }, {
      id: '2',
      name: 'Politics'
    }, {
      id: '3',
      name: 'Business'
    }, {
      id: '4',
      name: 'Health'
    }, {
      id: '5',
      name: 'Entertainment'
    }, {
      id: '6',
      name: 'Style'
    }, {
      id: '7',
      name: 'Travel'
    }, {
      id: '8',
      name: 'Sports'
    }
  ];

  const [duration, setDuration] = useState('');
  const [price, setPrice] = useState('');
  
  const [title, setTitle] = useState('');
  // const [price, setPrice] = useState('');

  const handleMessage=(message)=> {
    let str =(message.nativeEvent.data);
    // var res = str.substr(64);
    // var string = 'yes'
    console.log(message)
    setTitle(str)
  }
  const WEBVIEW_REF = useRef();

  const handleBackButton = ()=>{
    WEBVIEW_REF.current.goBack();
    return true;
}


  const INJECTED_JAVASCRIPT =
  `const meta = document.createElement('meta'); 
  meta.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0'); 
  meta.setAttribute('name', 'viewport'); 
  document.getElementsByTagName('head')[0].appendChild(meta); 
  (function() {
      window.ReactNativeWebView.postMessage(document.title);
  })();`
; 

    return (
      <View style={styles.container}>
        <View style={{backgroundColor: 'white',height:80,elevation:3,justifyContent:'center'}}>
          <Text style={[styles.mainHeader2,{marginTop:20,marginLeft:title=='ENEWSTAG' ||title== ''?20:50}]}>{title=='ENEWSTAG' ||title== ''?'Advertise' :title}</Text>
        </View>
        <Icon
          name="navicon"
          size={20}
          color="#000"
          style={buttons.menu}
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        />
      {title=='ENEWSTAG' ||title== ''?
      null:
      <Ionicons
      name="arrow-back"
      size={25}
      color="#000"
      style={buttons.menu2}
      onPress={handleBackButton}
    />
    //   <Icon
    //   name="navicon"
    //   size={20}
    //   color="#000"
    //   style={buttons.menu2}
    // />
    
    }



        {/* <ScrollView style={styles.containerInner}> */}
          {lang.logdata.length==0 ?
          <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
          <Text>Log In to Advertise</Text>
          <TouchableHighlight  onPress={()=>navigation.navigate('Login')} style={{backgroundColor: '#e12229',margin:10,padding:5,paddingHorizontal:10,borderRadius: 10,}} underlayColor={'#9d151a'}>
            <Text style={{color:'white'}}>Log In</Text>
          </TouchableHighlight>
          </View>
        :

          /*<ScrollView style={{backgroundColor:'white',margin:10,padding:10,borderRadius:2,elevation:1,marginBottom:10}}>
          <Text>Ad Banner Sizes</Text>

          <View style={{alignItems:'center',flexDirection:'row'}}>
          <RadioButton
            value="first"
            status={ checked === 'first' ? 'checked' : 'unchecked' }
            onPress={() => setChecked('first')}
            color={'#e12229'}
          />
          <Text>970 x 90 - Header</Text>
          </View>
          <Image source={require('../assets/1.jpg')} style={{width:windowWidth-40,height:30}}/>


          <View style={{alignItems:'center',flexDirection:'row'}}>
          <RadioButton
            value="second"
            status={ checked === 'second' ? 'checked' : 'unchecked' }
            onPress={() => setChecked('second')}
            color={'#e12229'}
          />
          <Text>300 x 500 - Newspage Sidebar</Text>
          </View>
          <Image source={require('../assets/2.jpg')} style={{width:windowWidth/2,height:windowWidth/2.3}}/>

          <View style={{alignItems:'center',flexDirection:'row'}}>
          <RadioButton
            value="third"
            status={ checked === 'third' ? 'checked' : 'unchecked' }
            onPress={() => setChecked('third')}
            color={'#e12229'}
          />
          <Text>970 x 90 - Newspage Footer</Text>
          </View>
          <Image source={require('../assets/1.jpg')} style={{width:windowWidth-40,height:30}}/>

          <View style={{alignItems:'center',flexDirection:'row'}}>
          <RadioButton
            value="forth"
            status={ checked === 'forth' ? 'checked' : 'unchecked' }
            onPress={() => setChecked('forth')}
            color={'#e12229'}
          />
          <Text>300 x 500 - Homepage Sidebar</Text>
          </View>
          <Image source={require('../assets/2.jpg')} style={{width:windowWidth/2,height:windowWidth/2.3}}/>


          <View style={{flexDirection:'row',alignItems:'center'}}>
            <Text style={{width:70}}>Start Date</Text>
            <TouchableHighlight style={{marginVertical:5,borderRadius:5}} underlayColor={"#DDDDDD"} onPress={()=>refRBSheet.current.open()}>
            <View style={{height:35,margin: 0,borderWidth:1,width:windowWidth-110,borderRadius:5,borderColor:'gray',justifyContent:'center',paddingLeft:20}}>
              <Text>{Moment(date).format('D MMM yyyy')}</Text>
            </View>
            </TouchableHighlight>
          </View>

          <View style={{flexDirection:'row',alignItems:'center'}}>
            <Text style={{width:70}}>End Date</Text>
            <TouchableHighlight style={{marginVertical:5,borderRadius:5}} underlayColor={"#DDDDDD"} onPress={()=>refRBSheet.current.open()}>
            <View style={{height:35,margin: 0,borderWidth:1,width:windowWidth-110,borderRadius:5,borderColor:'gray',justifyContent:'center',paddingLeft:20}}>
              <Text>{Moment(date).format('D MMM yyyy')}</Text>
            </View>
            </TouchableHighlight>
          </View>
          <RBSheet
            ref={refRBSheet}
            closeOnDragDown={true}
            closeOnPressMask={false}
            customStyles={{
              wrapper: {
                backgroundColor: "transparent",
              },
              draggableIcon: {
                backgroundColor: "#000"
              }
            }}
          >
            <DatePicker
              date={date}
              onDateChange={setDate}
            />
        <Icon
          name="check"
          size={20}
          color="#000"
          style={{alignSelf:'flex-end',marginRight:20}}
          onPress={()=>refRBSheet.current.close()}
        />
          </RBSheet>
          <View style={{flexDirection:'row'}}>
            <Text style={{width:70}}>Banner{'\n'}Category</Text>
            <View style={{width:windowWidth-110,zIndex:1}}>
          <MultiSelect
            hideTags
            items={items}
            uniqueKey="id"
            // ref={(component) => { this.multiSelect = component }}
            onSelectedItemsChange={(item)=>setSelectedItems(item)}
            selectedItems={selectedItems}
            selectText="Select a category"
            searchInputPlaceholderText="Search category..."
            onChangeInput={ (text)=> console.log(text)}
            // altFontFamily="ProximaNova-Light"
            styleInputGroup={{width:windowWidth-120}}
            styleDropdownMenuSubsection={{width:windowWidth-110,borderWidth:1,height:35,zIndex:2,borderRadius:5,padding:5,borderColor:'gray',paddingLeft:10,paddingRight:0}}
            tagRemoveIconColor="#CCC"
            tagBorderColor="#CCC"
            tagTextColor="#CCC"
            selectedItemTextColor="#CCC"
            selectedItemIconColor="#CCC"
            itemTextColor="#000"
            displayKey="name"
            searchInputStyle={{ color: '#CCC' }}
            submitButtonColor="#CCC"
            submitButtonText="Submit"
            // filterMethod={'partial'}
          />
          </View>
          </View>

          <View style={{flexDirection:'row',alignItems:"center"}}>
          <Text style={{width:70}}>Duration</Text>
          <TextInput
            style={{height:35,width:windowWidth-160,borderWidth:1,borderRadius:5,borderColor:'gray'}}
            placeholder="Duration"
            onChangeText={(text) => setDuration(text)}
            value={duration}
            // textContentType={'password'}
            // secureTextEntry={true}
          />
          <Text style={{paddingLeft:10}}>days</Text>
          </View>

          <View style={{flexDirection:'row',alignItems:"center",marginTop:10}}>
          <Text style={{width:70}}>Price</Text>
          <TextInput
            style={{height:35,width:windowWidth-110,borderWidth:1,borderRadius:5,borderColor:'gray'}}
            placeholder="Price"
            onChangeText={(text) => setPrice(text)}
            value={price}
            // textContentType={'password'}
            // secureTextEntry={true}
          />
          </View>
          <View style={{flexDirection:'row',alignItems:"center",marginTop:10}}>
            <Text>Upload Your Ad Banner</Text>
            <TouchableHighlight style={{height:30,backgroundColor: '#efefef',borderWidth:1,borderColor:'gray',justifyContent: 'center',paddingHorizontal:10,marginLeft:10,borderRadius:5}}>
              <Text style={{color:'black'}}>
                Upload
              </Text>
              
            </TouchableHighlight>
          </View>
          <View style={{height:0.5,backgroundColor: 'gray',marginVertical:10}}/>
          <TouchableHighlight style={{height:35,backgroundColor: '#007bff',justifyContent: 'center',paddingHorizontal:10,borderRadius:5,marginTop:0,alignItems:'center'}}>
              <Text style={{color:'white'}}>
                Submit and Pay
              </Text>
              
            </TouchableHighlight>
          </ScrollView> */
            <View style={{flex:1}}>
          <WebView
              style={{ marginTop:title=='ENEWSTAG' || ''? -220:0, marginBottom:0}}  
              source={{
                uri: 'https://enewstag.com/web/banner',
                headers: {
                  Cookie: 'id5id.1st_364_nb='+lang.logdata.id,
                },
              }}
              ref={WEBVIEW_REF}
              onMessage={handleMessage}
              sharedCookiesEnabled={true}
              onLoadStart={() => showSpinner()}
              onLoadEnd={() => hideSpinner()}
              injectedJavaScript={INJECTED_JAVASCRIPT}
               />
               </View>
        
            }

        {/* </ScrollView> */}

        {visible && (
          <View style={{flex:1,justifyContent: 'center',marginTop:windowHeight}}>
            <View style={{marginTop:-windowHeight/1.7}}>
            <ActivityIndicator size={45} color="#e12229"/>
            </View>
          </View>
        )} 

      </View>
    );
}

