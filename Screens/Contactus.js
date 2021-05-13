import React, {useState} from 'react';
import {View, Dimensions , Text , ActivityIndicator, StatusBar, TextInput, TouchableHighlight, ScrollView} from 'react-native';
import { styles , buttons } from './Styles';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
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
  const showModal = () => {
    setIsModalVisible(true);
    setTimeout(() => {
      setIsModalVisible(false);
    }, 1500);
  };

  const hideSpinner=()=> {
    setVisible(false)
  }

  const showSpinner=()=> {
    setVisible(true)
  }
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
      setResponse2(data)
      console.log(data)
      setResponse(JSON.parse(data))
      
    })
    .catch((error) => {
      Reset()
      // console.error('Error:', error);
    })
    // getuserData();
  }

  const Reset=()=>{
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
          
          <TextInput
            style={[styles.loginInput,{marginHorizontal: 20,marginVertical:5,marginTop:20}]}
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
            style={[styles.loginInput,{marginHorizontal: 20,marginVertical:5}]}
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
            style={[styles.loginInput,{marginHorizontal: 20,marginVertical:5}]}
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
            style={[styles.loginInput,{height:100,marginHorizontal: 20,marginVertical:5}]}
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
          <TouchableHighlight onPress={()=>{setResponse('');contactSubmit(name,sub,email,msg);Reset();showModal()}} style={{backgroundColor:'red',alignSelf:'flex-end',marginRight:20,marginTop:10,paddingHorizontal:10,paddingVertical:5,elevation:2,borderRadius:5}}>
            <Text style={{color:'white'}}>Submit</Text>
          </TouchableHighlight>

          <Modal2
          isVisible={isModalVisible}
          style={{zIndex: 3,elevation:1,}}
          hasBackdrop={false}
          animationIn={'fadeIn'}
          animationOut={'fadeOut'}
          onBackdropPress={()=>showModal()}
          >
            <View style={{bottom:80,position:'absolute',alignSelf:'center',elevation:2}}>
                    {response2.trim()=='sent'?
                    <View style={{backgroundColor:'green',padding:10,elevation:2,alignSelf:'center',position:'absolute'}} >
                      <Text style={[styles.innerText,{color:'white'}]}>Message Sent</Text>
                    </View>
                    :
                    <Text></Text>
                    }

            </View>

          </Modal2>

          {/* <WebView
            style={{ marginTop: -220, marginBottom:-1800 }}  
            source={{ uri: 'https://enewstag.com/web/contactus' }} 
            onLoadStart={() => showSpinner()}
            onLoadEnd={() => hideSpinner()}
            /> */}



        </ScrollView>

        {/* {visible && (
          <View style={{flex:1,justifyContent: 'center',marginTop:windowHeight}}>
            <View style={{marginTop:-windowHeight/1.7}}>
            <ActivityIndicator size={45} color="#e12229"/>
            </View>
          </View>
        )}  */}

      </View>

      
    );
}
