import React, {useState} from 'react';
import {View, Dimensions , Text , Linking, StatusBar, TextInput, TouchableHighlight, ScrollView , Image} from 'react-native';
import { styles , buttons } from './Styles';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import { WebView } from 'react-native-webview';
import {useNavigation} from '@react-navigation/native';
import {DrawerActions} from '@react-navigation/native';
import Shimmer from 'react-native-shimmer';
import Modal2 from 'react-native-modal';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function Contactus () {
  const navigation = useNavigation();
  
  const [visible, setVisible] = useState();

  const [name, setName] = useState('');
  const [msg, setMsg] = useState('');
  const [email, setEmail] = useState('');
  const [sub, setSub] = useState('');
  
  const [response, setResponse] = useState('');
  const [response2, setResponse2] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  
  const [isModalVisible, setIsModalVisible] = useState(false);


  const contactSubmit = (nm,sb,em,mg) =>{

    const formData = new FormData()

    formData.append('your_name', nm);
    formData.append('your_subject', sb);
    formData.append('your_email', em);
    formData.append('your_message', mg);
   
    fetch('https://enewstag.com/api/contactUs/', {
      method: 'POST', // or 'PUT'
      body: formData
    })
    .then(response => response.text())
    .then(data => {
      // getuserData(); 
      // setResponse(JSON.parse(data))
      
      data.trim() =='sent'?
        setResponse2('sent')
        :
        setResponse2('error')
      
      console.log(data)
      setResponse(JSON.parse(data))
      
    })
    .catch((error) => {
      reset()
      // console.error('Error:', error);
    })
    // getuserData();
  }

  const reset=()=>{
    setName('');
    setSub('')
    setEmail('')
    setMsg('')
  }

    return (
      <View style={styles.container}>
        <StatusBar barStyle={'dark-content'}/>
      <View style={{backgroundColor: 'white',height:80,elevation:3,justifyContent:'center'}}>
          <Text style={[styles.mainHeader2,{marginTop:20,marginLeft:20}]}>Contact Us</Text>
          </View>
        <Icon
          name="navicon"
          size={20}
          color="#000"
          style={buttons.menu}
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        />
     
        <ScrollView style={styles.container}>

        {/* <Image style={{alignSelf:'center',marginTop:5,height:45,width:160}} source={require('../assets/contact.jpg')}/> */}
        <Text style={{color:'#6b6b6b',padding:7.5,fontSize:17,textAlign:'center'}}>
          {/* Contact us with your suggestions */}
          
          </Text>
          <View style={{marginHorizontal:30,flexDirection:'row',justifyContent:'space-between',margin:10}}>
          {/* <Text style={{color:'#6b6b6b'}} >Share your ideas with us</Text> */}
          <View style={{flexDirection:'row'}}>
            <Ionicons
              name="mail-outline"
              size={20}
              color="#e12229"
            />
            <View style={{marginLeft:5}}>
            <Text style={{color:'#6b6b6b',fontWeight:'bold'}}>Email</Text>
            <Text style={{color:'#6b6b6b'}} onPress={()=>Linking.openURL('mailto:info@enewstag.com')}>info@enewstag.com</Text>   
            </View>         
          </View>

          <View style={{flexDirection:'row'}}>
            <Ionicons
              name="phone-portrait-outline"
              size={20}
              color="#e12229"
            />
            <View style={{marginLeft:5}}>
            <Text style={{color:'#6b6b6b',fontWeight:'bold'}}>Phone</Text>
            <Text style={{color:'#6b6b6b'}} onPress={()=>Linking.openURL('tel:+9470 585 8000')}>+9470 585 8000</Text>
            </View>         
          </View>
            
          </View>

          <View style={{
            backgroundColor:'white',
            margin:10,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 1,
            },
            shadowOpacity: 0.22,
            shadowRadius: 2.22,

            elevation: 3,
            }}>
          <TextInput
            style={[styles.loginInput,{marginHorizontal: 10,marginVertical:5,marginTop:10}]}
            placeholder="Your Name"
            onChangeText={(text) => setName(text)}
            value={name}
            keyboardType={'email-address'}
            textContentType={'emailAddress'}
          />
          {
            response.your_name=='The Name field is required.'?<Text style={styles.ValidationText}>*{response.your_name}</Text>:null
          }
          
          <TextInput
            style={[styles.loginInput,{marginHorizontal: 10,marginVertical:5}]}
            placeholder="Your Email"
            onChangeText={(text) => setEmail(text)}
            value={email}
            keyboardType={'email-address'}
            textContentType={'emailAddress'}
          />
          {
            response.your_email=='The Email field is required.'?<Text style={styles.ValidationText}>*{response.your_email}</Text>:null
          }
          <TextInput
            style={[styles.loginInput,{marginHorizontal: 10,marginVertical:5}]}
            placeholder="Subject"
            onChangeText={(text) => setSub(text)}
            value={sub}
            keyboardType={'email-address'}
            textContentType={'emailAddress'}
          />
          {
            response.your_subject=='The Subject field is required.'?<Text style={styles.ValidationText}>*{response.your_subject}</Text>:null
          }
          <TextInput
            style={[styles.loginInput,{height:100,marginHorizontal: 10,marginVertical:5}]}
            placeholder="Your Message"
            textAlignVertical={'top'}
            onChangeText={(text) => setMsg(text)}
            value={msg}
            numberOfLines={5}
            multiline={true}
            keyboardType={'email-address'}
            textContentType={'emailAddress'}
          />
          {
            response.your_message=='The Message field is required.'?<Text style={styles.ValidationText}>*{response.your_message}</Text>:null
          }
          <TouchableHighlight onPress={()=>{setResponse('');contactSubmit(name,sub,email,msg);}} style={{backgroundColor:'#e12229',alignSelf:'flex-end',margin:10,height:50,width:50,alignItems:'center',justifyContent:'center',elevation:2,borderRadius:50}}>
          <Ionicons
              name="send"
              size={25}
              color="#fff"
            />
          </TouchableHighlight>
          </View>
          

          {
              response2=="sent"?
              <View style={{backgroundColor:'green',padding:10,alignSelf:'center',top:40,position:'absolute',elevation:5}} 
                onLayout={()=>
                  setTimeout(() => {
                    setResponse2("")
                    reset() 
                  }, 800)
                }
                >
                  <Text style={[styles.innerText,{color:'white'}]}>Message Sent</Text>
                </View>
              :
              response2 == "error"?
              <View style={{backgroundColor:'red',padding:10,alignSelf:'center',top:40,position:'absolute',elevation:5}} 
                onLayout={()=>
                  setTimeout(() => {
                    setResponse2("") 
                    reset()
                  }, 800)
                }
                >
                  <Text style={[styles.innerText,{color:'white'}]}>Fill All Fields</Text>
                </View>
                :
                null
            }


        </ScrollView>

      </View>

      
    );
}
