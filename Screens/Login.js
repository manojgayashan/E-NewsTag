import React, { useState , useEffect , useContext} from 'react';
import { View, Text ,TextInput, TouchableOpacity ,Image, Modal, Platform, StatusBar , Keyboard , Dimensions , Button, TouchableHighlight} from 'react-native';
import { styles , buttons } from './Styles';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Animatable from 'react-native-animatable';
import { UserContext }  from '../context/Context';
import hash from "object-hash";
import hexSha1 from 'hex-sha1';
import Modal2 from 'react-native-modal';
import { LoginButton , AccessToken , GraphRequest , GraphRequestManager } from 'react-native-fbsdk';
import { GoogleSignin , GoogleSigninButton , statusCodes, } from '@react-native-google-signin/google-signin';
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import { format } from 'date-fns'

import Feather from 'react-native-vector-icons/dist/Feather';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

import { AppleButton ,appleAuth } from '@invertase/react-native-apple-authentication';




export default function Login () {
  
  const lang = useContext(UserContext);

  
  const [isLogged2, setIsLogged2] = useState(true);
  const [isLogged3, setIsLogged3] = useState(true);

  const [fail, setFail] = useState(null);
  const [checkedmail, setCheckedmail] = useState('');
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [smail, setSmail] = useState('');
  const [spassword, setSpassword] = useState('');

  const [srepassword, setRepassword] = useState('');

  const [modalVisible, setModalVisible] = useState(false);

  const [logged, setLogged] = useState('');
  const [data, setData] = useState([]);
  

  const [data2, setData2] = useState([]);
  
  const [userData, setUserData] = useState([]);

  const [username, setName] = useState( "");
  const [password, setPw] = useState("");
  const [msg, setMsg] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setLoading] = useState(true);
  
  const [userInfo, setUserInfo] = useState();
  const [error, setError] = useState(null);

  const [islogged, setIsLogged] = useState('');
  const [log, setLog] = useState('');


  const [isModalVisible, setIsModalVisible] = useState(false);

  const navigation = useNavigation();

  
  // const [al, setVal] = useState('');
  // const [spassword, setSpassword] = useState('');

  const [check, setCheck] = useState(true);
  const [check2, setCheck2] = useState(false);

  
  const [scheck, setSCheck] = useState(true);
  const [scheck2, setSCheck2] = useState(false);

  
  const [spcheck, setSPCheck] = useState(true);
  const [spcheck2, setSPCheck2] = useState(false);

  const [fail1, setFail1] = useState(null);
  const [fail2, setFail2] = useState(null);
  const [fail3, setFail3] = useState(null);
  const [fail4, setFail4] = useState(null);
  const [fail5, setFail5] = useState(null);

  const onRefresh = () => {
    setRefreshing(true);
    setData([]);
    getData();
    
  };

  async function onAppleButtonPress() {
    // performs login request
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    });
  
    // get current authentication state for user
    // /!\ This method must be tested on a real device. On the iOS simulator it always throws an error.
    const credentialState = await appleAuth.getCredentialStateForUser(appleAuthRequestResponse.user);
  
    // use credentialState response to ensure the user is authenticated
    if (credentialState === appleAuth.State.AUTHORIZED) {
      // user is authenticated
    }
  }
  const storeAccount = async (value) => {
    try {
      await AsyncStorage.setItem('acc', value)
    } catch (e) {
      // saving error
    }
  }

  const getuserData = () => {
    fetch(
      'https://enewstag.com/api/socialUser/',
    )
      .then((response) => response.json())
      .then((json) => setData(json))
      .catch((error) => console.error(error))
      .finally(() => {setLoading(false);});
    setRefreshing(false);
    
  };


  const storeData = async (value) => {
    try {
      const jsonValue = JSON.stringify(value)
      await AsyncStorage.setItem('userInfo', jsonValue)
    } catch (e) {
      // saving error
    }
  }

  const toggleModal = () => {
    setModalVisible(!modalVisible);
    setFail1(null)
    setFail2(null)
    setFail3(null)
    setFail4(null)
    setFail5(null)
    Reset()
  };

  const showModal = () => {
    setIsModalVisible(true);
    setTimeout(() => {
      setIsModalVisible(false);
    }, 1500);
  };

  // normal login
  const onLogin=()=>{ 
    getData();
    var index = -1;
    if (username!=''){for (var i=0; i < data.length; i++) {
        if (data[i].email === username && data[i].pwd === hexSha1(password)){
            index = i;
            // signOut()
            lang.setLogData(data[i]);
            storeData(data[i])
            storeAccount('normal')
            lang.setAcc('normal')
            setLogged('true')
            setIsLogged('true')
            setTimeout(() => {
              navigation.navigate('Home')
            }, 1200);  
        }
    }}
    
    if (index!== -1){
      setLogged('true')
     setIsLogged('true')
    }
    else{
      setLogged('false')
      setIsLogged('false')
      showModal()
    }
  }
// end of normal login

const onSignIn = (em,pw) =>{

  const formData = new FormData()

  // em=='' && pw=='' ? 
  // setIsLogged('two')
  // :
  // em=='' ? 
  // setIsLogged('email')
  // :
  // pw==''?
  // setIsLogged('pw')
  // :

  formData.append('email', em);
  formData.append('password', pw);


  fetch('https://enewstag.com/api/Login', {
    method: 'POST', // or 'PUT'
    body: formData
  })
  .then(response => response.json())
  .then(data => {
//     data=='error'?
//     setIsLogged(data)
// :
setIsLogged(data)
// null
    lang.setLogData(data)
    storeData(data)


    console.log(data);
  })
  .catch((error) => {
    // console.error('Error:', error);
  });



}

// normal sign up
  const onSignUp = (fn,ln,em,img,pw,r) =>{


    const formData = new FormData()

    formData.append('fname', fn);
    formData.append('lname', ln);
    formData.append('email', em);
    formData.append('profile_pic', img);
    formData.append('con_pwd', r);
    // formData.append('pwd', hexSha1(pw));
    formData.append('pwd', pw);

  if (fn == '' || ln == '' || em == '' || pw == '' || srepassword == '' || srepassword!==pw){
    setFail(true); 
    setFail1(true)
    setFail2(true)
    setFail3(true)
    setFail4(true)
    setFail5(true)
  }

  else if (fn !== '' && ln !== '' && em !== '' && pw !== '' && srepassword !== '' && srepassword==pw){
    fetch('https://enewstag.com/api/SignUp/'+em, {
      method: 'POST', // or 'PUT'
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      // getuserData(); 
      setMsg(data)
      
      console.log(data);
    })
    .catch((error) => {
      // console.error('Error:', error);
    });

    
    setFail(false);
    // setFail5(true);
    Reset()
  }
if (fn!==''){
  setFail1(false)
}
if (ln!==''){
  setFail2(false)
}
if (em!==''){
  setFail3(false)
}
if (pw!==''){
  setFail4(false)
}
if (srepassword==pw){
  setFail5(false)
}


  }



  const onSocialSignUp = (fn,ln,em,img,id) =>{

    const formData = new FormData()

    formData.append('fname', fn);
    formData.append('lname', ln);
    formData.append('email', em);
    formData.append('login_id', id); 
    formData.append('profile_pic', img);     
    formData.append('created_time', format(new Date(), "yyyy-MM-dd HH:mm:ss"));
   
    fetch('https://enewstag.com/api/SocialSignUp/'+em, {
      method: 'POST', // or 'PUT'
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      // getuserData(); 
        lang.setLogData(data)
        storeData(data)
        navigation.navigate('Home')
        lang.setState('Home')

      console.log(data);
    })
    .catch((error) => {
      console.log('error:', error);
    })
    getuserData();
  }



  const Reset=()=>{
    setFname('');
    setLname('')
    setSmail('')
    setSpassword('')
    setRepassword('')
    setSPCheck2(false)
    setSCheck2(false)
  }

  const getData = async () => {
    try {
      const data = await AsyncStorage.getItem('log');
      if (data !== null) {
        setLog(data);
      }
    } catch (e) {
    }
  };
// end of normal sign up


  // fb login
  const getInfoFromToken = token => {
    const PROFILE_REQUEST_PARAMS = {
      fields: {
        string: ' name,  first_name, last_name, picture, email',
      },
    };
    const profileRequest = new GraphRequest(
      '/me',
      {token, parameters: PROFILE_REQUEST_PARAMS},
      (error, result) => {
        if (error) {
          console.log('login info has error: ' + error);
        } else {
          // signOut()
          console.log(result)
          setUserData(result)
          onSocialSignUp(result.first_name,result.last_name,result.email,result.picture.data.url,result.id)
          lang.setPic(result.picture.data.url)
          storePic(result.picture.data.url)
         
        }
      },
    );
    new GraphRequestManager().addRequest(profileRequest).start();
  };

// end of fb
const storePic = async (value) => {
  try {
    await AsyncStorage.setItem('pic', value)
  } catch (e) {
    // saving error
  }
}
// google sign in
  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();

      const userInfo = await GoogleSignin.signIn();
     
      setUserInfo(userInfo.user)
      console.log(userInfo.user)
      lang.setPic(userInfo.user.photo)
      storePic(userInfo.user.photo)
    


    onSocialSignUp(userInfo.user.givenName,userInfo.user.familyName,userInfo.user.email,userInfo.user.photo,null)

      // lang.setLogData(lang.logMail)
      // console.log(data2.pop())

    } catch (error) {
      switch (error.code) {
        case statusCodes.SIGN_IN_CANCELLED:
          // sign in was cancelled
          // alert('cancelled');
          break;
        case statusCodes.IN_PROGRESS:
          // operation (eg. sign in) already in progress
          // alert('in progress');
          break;
        case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
          // android only
          // alert('play services not available or outdated');
          break;
        default:
          setError( error );
          // navigation.navigate('Home')
      }
      // lang.setLogData(lang.logMail)

    }
  };


  const configureGoogleSignIn=() =>{
    GoogleSignin.configure({
      webClientId:'220111162881-ihj4isa8fr2vnsjertoek2gb0fervt1f.apps.googleusercontent.com',
      offlineAccess: false,
      iosClientId:'220111162881-68vmh4asiejpnndlphm5hg11hf9boi9d.apps.googleusercontent.com'
    });
  }

  const  getCurrentUser = async ()=> {
    try {
      const userInfo = await GoogleSignin.signInSilently();
      setUserInfo( userInfo);
      setError(null)
    } catch (error) {
      const errorMessage =
        error.code === statusCodes.SIGN_IN_REQUIRED ? 'Please sign in :)' : error.message;
        setError( new Error(errorMessage));
    }
  }
  const renderUserInfo=(userInfo)=> {
    return (
      <View>
        <TouchableHighlight style={{width:windowWidth-40,backgroundColor: 'white',elevation:2,height:40,borderRadius:5}} onPress={signOut} underlayColor={'#DDDDDD'}>
          <View style={{flexDirection:'row',justifyContent: 'center',alignItems:'center',flex:1,}}>
           <Text style={[buttons.text,{color:'gray',fontSize:14}]}>Sign Out from Google</Text> 
          </View>
        </TouchableHighlight>
      </View>
    );
  }

  const signOut = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();

      setUserInfo(null);
      lang.setLogData([])
      setError(null);

    } catch (error) {
      setError(error);
    }
  }


  const renderSignInButton=() =>{
    return (
      <View >
        <GoogleSigninButton
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Auto}
          onPress={()=>{signIn()}}
          style={{width:windowWidth-35}}
        />
      </View>
    );
  }

// end of google

  
  const body = userInfo ? renderUserInfo(userInfo) : renderSignInButton();

  useEffect(() => {
    getData();
    getuserData();
    configureGoogleSignIn();
    console.log(userInfo)
    getCurrentUser();
    if (!userInfo) {
      getCurrentUser();
  }

    onRefresh();
    setLogged('') 

    if (Platform.OS=='ios'){
      return appleAuth.onCredentialRevoked(async () => {
      console.warn('If this function executes, User Credentials have been Revoked');
    });
    }
    

  }, []);

    return (
      <View style={styles.container}>
        <StatusBar backgroundColor={'transparent'} barStyle={'dark-content'}/>
        <Modal2
          isVisible={isModalVisible}
          style={{zIndex: 3,elevation:1,}}
          hasBackdrop={false}
          animationIn={'fadeIn'}
          animationOut={'fadeOut'}
          onBackdropPress={()=>toggleModal()}
        >
<View style={{top:40,position:'absolute',alignSelf:'center',elevation:2}}>
        {islogged=='true'?
        <View style={{backgroundColor:'green',padding:10,elevation:2,alignSelf:'center',position:'absolute'}} >
          <Text style={[styles.innerText,{color:'white'}]}>Logged Successfully</Text>
        </View>
        :
        islogged=='false'?
        <View style={{backgroundColor:'red',padding:10,alignSelf:'center',position:'absolute',zIndex:2}} >
          <Text style={[styles.innerText,{color:'white'}]}>Email or Password Incorrect</Text>
        </View>
        :
        null
        }

</View>

       </Modal2>

       {islogged=="error"?
        <View style={{backgroundColor:'red',padding:10,elevation:5,alignSelf:'center',top:40,position:'absolute'}} 
        
        onLayout={()=>
        setTimeout(() => {
          setIsLogged("")
          setPw('')
          setName('') 
          setFail(null)
        }, 1500)
          
        }>
          <Text style={[styles.innerText,{color:'white'}]}>Email or Password Incorrect</Text>
        </View>
        :
        islogged=="email"?
        <View style={{backgroundColor:'red',padding:10,elevation:5,alignSelf:'center',top:40,position:'absolute'}} 
        
        onLayout={()=>
        setTimeout(() => {
          setIsLogged("")
          setFail(null)
        }, 1500)
          
        }>
          <Text style={[styles.innerText,{color:'white'}]}>Email is Required</Text>
        </View>
        :
        islogged=="pw"?
        <View style={{backgroundColor:'red',padding:10,elevation:5,alignSelf:'center',top:40,position:'absolute'}} 
        
        onLayout={()=>
        setTimeout(() => {
          setIsLogged("")
          setFail(null)
        }, 1500)
          
        }>
          <Text style={[styles.innerText,{color:'white'}]}>Password is Required</Text>
        </View>
        :
        islogged=="two"?
        <View style={{backgroundColor:'red',padding:10,elevation:5,alignSelf:'center',top:40,position:'absolute'}} 
        
        onLayout={()=>
        setTimeout(() => {
          setIsLogged("")
          setFail(null)
        }, 1500)
          
        }>
          <Text style={[styles.innerText,{color:'white'}]}>Email and Password are Required</Text>
        </View>
        :
        islogged==""?
        null
        :
        <View style={{backgroundColor:'green',padding:10,alignSelf:'center',top:40,position:'absolute',elevation:5}} 
        onLayout={()=>
          setTimeout(() => {
            setIsLogged("") 
            setPw('')
            setName('')   
            navigation.navigate('Home')
            lang.setState('Home')
            Keyboard.dismiss()
          }, 800)
        }
        >
          <Text style={[styles.innerText,{color:'white'}]}>Logged Successfully</Text>
        </View>
        }



        <Animatable.View style={styles.skipContainer} animation={'fadeInDown'} duration={1200}>
          <TouchableHighlight underlayColor={'#DDDDDD'} style={{justifyContent: 'center',flexDirection:'row',alignItems:'center',width:windowWidth-35,marginBottom:-2,borderRadius:5}} onPress={()=>{navigation.navigate('Home');lang.setState('Home')}}>
            <View style={{flexDirection:'row',alignItems:'center'}} >
              <Text style={[styles.headerText,{padding:10,fontWeight:'bold'}]}>
                Skip for Now
              </Text>
              <Icon
                name="angle-right"
                size={18}
                color="black"
              />
            </View>
          </TouchableHighlight>
          </Animatable.View>


        <View style={{position:'absolute',top:80}}>
            
        <Image style={{alignSelf:'center',marginTop:40,height:45,width:160}} source={require('../assets/logo.png')}/>

        <View style={styles.loginContainer}>
        <View style={[styles.loginInput,{flexDirection:'row',alignItems:'center',paddingLeft:0,justifyContent:'space-between'}]} >
        
        <Ionicons
              name="mail-outline"
              size={22}
              color="black"
              style={{paddingLeft:10}}
              // onPress={() => {setCheck(false)}}
            />
          <TextInput
            style={[styles.loginInput,{paddingLeft:10,width:windowWidth-72}]}
            placeholder="Email"
            onChangeText={(text) => setName(text)}
            value={username}
            keyboardType={'email-address'}
            textContentType={'emailAddress'}
          />
          </View>
          <View style={[styles.loginInput,{flexDirection:'row',alignItems:'center',paddingLeft:0}]} >

          <Ionicons
              name="lock-closed-outline"
              size={22}
              color="black"
              style={{paddingLeft:10}}
              // onPress={() => {setCheck(false)}}
            />

          <TextInput
            style={styles.loginInput2}
            placeholder="Password"
            onChangeText={(text) => setPw(text)}
            value={password}
            textContentType={'password'}
            secureTextEntry={check}
            onFocus={() => {setCheck2(true)}}
            onBlur={() => {setCheck2(false)}}
          />
          {
            check2==true?

            check==true?
            <Feather
              name="eye-off"
              size={20}
              color="gray"
              // style={{}}
              onPress={() => {setCheck(false)}}
            />
            :
            <Feather
                name="eye"
                size={20}
                color="gray"
                // style={{}}
              onPress={() => {setCheck(true)}}
            />
            :

            null
            }
          
          </View>

          <TouchableOpacity style={buttons.login} onPress={() => {onSignIn(username,password)}}>
            <Text style={buttons.text}>Login</Text>
          </TouchableOpacity>
          <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-around'}}>
            <View style={{height:0.8,width:windowWidth/2.5,backgroundColor:'gray'}} />
            <Text style={{paddingHorizontal:10}}>OR</Text>
            <View style={{height:0.8,width:windowWidth/2.5,backgroundColor:'gray'}} />
          </View>
          {Platform.OS=='ios'?
           <AppleButton
            buttonStyle={AppleButton.Style.BLACK}
            buttonType={AppleButton.Type.SIGN_IN}
            style={{
              width: windowWidth-40, // You must specify a width
              height: 40,
              justifyContent:'flex-start', // You must specify a height
            }}
            onPress={() => onAppleButtonPress()}
          />
          :
          null 
          }
          
          <LoginButton
          permissions={["email"]}
            onLoginFinished={(error, result) => {
              if (error) {
                console.log('login has error: ' + result.error);
              } else if (result.isCancelled) {
                console.log('login is cancelled.');
              } else {
                AccessToken.getCurrentAccessToken().then(data => {
                  const accessToken = data.accessToken.toString();
                  getInfoFromToken(accessToken);
                });
              }
            }}
            
            onLogoutFinished={() => 
              // setUserData([])
              console.log('logout')
            
            }
            style={{width:windowWidth-40,height:40,alignItems: 'flex-start',elevation:2,justifyContent: 'flex-start'}}
          />

          {/* <GoogleSigninButton
            style={{ width: windowWidth-40, height: 45 , justifyContent: 'space-around',flexDirection:'row'}}
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Light}
            onPress={signIn}
            // disabled={this.state.isSigninInProgress} 
          /> */}
          {body}
          
          <View>
          <Text style={[styles.headerText,{paddingTop:10}]}>Don't have an Account?</Text>
          </View>
          <TouchableOpacity style={[buttons.otherButtons,{backgroundColor:'#ea7900'}]} onPress={() => setModalVisible(true)}>
            <Text style={buttons.text}>Register</Text>
          </TouchableOpacity>

        </View>
        </View>
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
            setFail1(null)
            setFail2(null)
            setFail3(null)
            setFail4(null)
            setFail5(null)
          }}
          
        >
         <View style={[styles.container2]}>
         <Ionicons
              name="arrow-back"
              size={25}
              color="#000"
              style={[buttons.menu2,{top:Platform.OS=='ios'?50:20}]}
              onPress={() => {toggleModal()}}
            />

         {msg=="Error" || fail == true?
        <View style={{backgroundColor:'red',padding:10,elevation:5,alignSelf:'center',top:40,position:'absolute'}} 
        
        onLayout={()=>
        setTimeout(() => {
          setMsg("")
          setFail(null)
        }, 1500)
          
        }>
          <Text style={[styles.innerText,{color:'white'}]}>Something Wrong</Text>
        </View>
        :
        msg=="already"?
        <View style={{backgroundColor:'red',padding:10,elevation:5,alignSelf:'center',top:40,position:'absolute'}} 
        
        onLayout={()=>
        setTimeout(() => {
          setMsg("")
          setFail(null)
        }, 1500)
          
        }>
          <Text style={[styles.innerText,{color:'white'}]}>Email Already Registered </Text>
        </View>
        :
        msg=="Success"?
        <View style={{backgroundColor:'green',padding:10,alignSelf:'center',top:40,position:'absolute',zIndex:2}} 
        onLayout={()=>
          setTimeout(() => {
            setMsg("")
            setFail(null)
            setModalVisible(false)
          }, 800)
        }
        >
          <Text style={[styles.innerText,{color:'white'}]}>Sign Up Successfully</Text>
        </View>
        :
        null
        }
            <View style={styles.signupContainer}>
            
              <Text style={styles.mainHeader}>Sign Up</Text>
              <View style={[styles.loginInput,{flexDirection:'row',alignItems:'center',paddingLeft:0,justifyContent:'space-between'}]} >
              <Ionicons
                name="person-outline"
                size={22}
                color="black"
                style={{paddingLeft:10}}
                // onPress={() => {setCheck(false)}}
              />
              
              <TextInput
                  style={[styles.loginInput,{paddingLeft:10,width:windowWidth-72}]}
                  placeholder="First Name"
                  onChangeText={(text) => setFname(text)}
                  value={fname}
                  keyboardType={'default'}
                  textContentType={'username'}
                />                
              </View>

                
                {fail1==true?(
                  <Text style={styles.ValidationText}>*First Name is required</Text>
                ):(null)}

            <View style={[styles.loginInput,{flexDirection:'row',alignItems:'center',paddingLeft:0,justifyContent:'space-between'}]} >
              <Ionicons
                name="person-outline"
                size={22}
                color="black"
                style={{paddingLeft:10}}
                // onPress={() => {setCheck(false)}}
              />
              
              <TextInput
                style={[styles.loginInput,{paddingLeft:10,width:windowWidth-72}]}
                placeholder="Last Name"
                onChangeText={(text) => setLname(text)}
                value={lname}
                keyboardType={'default'}
                textContentType={'username'}
              />
              </View>

              {fail2==true?(
                  <Text style={styles.ValidationText}>*Last Name is required</Text>
                ):(null)}

              <View style={[styles.loginInput,{flexDirection:'row',alignItems:'center',paddingLeft:0,justifyContent:'space-between'}]} >
              <Ionicons
                name="mail-outline"
                size={22}
                color="black"
                style={{paddingLeft:10}}
                // onPress={() => {setCheck(false)}}
              />
                
                <TextInput
                  style={[styles.loginInput,{paddingLeft:10,width:windowWidth-72}]}
                  placeholder="Email"
                  onChangeText={(text) => setSmail(text)}
                  value={smail}
                  keyboardType={'email-address'}
                  textContentType={'emailAddress'}
                />
              </View>
              
              {fail3==true?(
                  <Text style={styles.ValidationText}>*Email is required</Text>
                ):(null)}

            <View style={[styles.loginInput,{flexDirection:'row',alignItems:'center',paddingLeft:0}]} >
              
            <Ionicons
              name="lock-closed-outline"
              size={22}
              color="black"
              style={{paddingLeft:10}}
              // onPress={() => {setCheck(false)}}
            />
            <TextInput
                style={styles.loginInput2}
                placeholder="password"
                onChangeText={(text) => setSpassword(text)}
                value={spassword}
                textContentType={'password'}
                secureTextEntry={scheck}
                onFocus={() => {setSCheck2(true)}}
                onBlur={() => {setSCheck2(false)}}
              />
              {
            scheck2==true?

            scheck==true?
            <Feather
              name="eye-off"
              size={20}
              color="gray"
              // style={{}}
              onPress={() => {setSCheck(false)}}
            />
            :
            <Feather
                name="eye"
                size={20}
                color="gray"
                // style={{}}
              onPress={() => {setSCheck(true)}}
            />
            :

            null
            }
              </View>

              {fail4==true?(
                  <Text style={styles.ValidationText}>*Password is required</Text>
                ):(null)}
            <View style={[styles.loginInput,{flexDirection:'row',alignItems:'center',paddingLeft:0}]} >
            <Ionicons
              name="lock-closed-outline"
              size={22}
              color="black"
              style={{paddingLeft:10}}
              // onPress={() => {setCheck(false)}}
            />
            <TextInput
                style={styles.loginInput2}
                placeholder="Confirm Password"
                onChangeText={(text) => setRepassword(text)}
                value={srepassword}
                textContentType={'password'}
                secureTextEntry={spcheck}
                onFocus={() => {setSPCheck2(true)}}
                onBlur={() => {setSPCheck2(false)}}
              />
            {
            spcheck2==true?

            spcheck==true?
            <Feather
              name="eye-off"
              size={20}
              color="gray"
              // style={{}}
              onPress={() => {setSPCheck(false)}}
            />
            :
            <Feather
                name="eye"
                size={20}
                color="gray"
                // style={{}}
              onPress={() => {setSPCheck(true)}}
            />
            :

            null
            }
            </View>
              {fail5==true?(
                  <Text style={styles.ValidationText}>*Passwords not Matching</Text>
                ):(null)}

              <TouchableOpacity style={buttons.login} onPress={() =>{
              //  setModalVisible(!modalVisible);
              onSignUp(fname,lname,smail,null,spassword,srepassword)
              }
              }>
                <Text style={buttons.text}>Sign Up</Text>
              </TouchableOpacity>
            </View>
         </View>
       </Modal>

      </View>
    );
  }

