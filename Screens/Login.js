import React, { useState , useEffect , useContext} from 'react';
import { View, Text ,TextInput, TouchableOpacity ,Image, Modal, Pressable, StatusBar , Keyboard , Dimensions , Button, TouchableHighlight} from 'react-native';
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

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

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
  const [repassword, setRePw] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setLoading] = useState(true);
  
  const [userInfo, setUserInfo] = useState();
  const [error, setError] = useState(null);

  const [islogged, setIsLogged] = useState('');
  const [log, setLog] = useState('');


  const [isModalVisible, setIsModalVisible] = useState(false);

  const navigation = useNavigation();

  
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

// normal sign up
  const onSignUp = (fn,ln,em,img,pw) =>{


    const formData = new FormData()

    formData.append('fname', fn);
    formData.append('lname', ln);
    formData.append('email', em);
    formData.append('profile_pic', img);
    // formData.append('created_time', new Date());
    formData.append('pwd', hexSha1(pw));

  if (fn == '' || ln == '' || em == '' || pw == '' || srepassword == '' || srepassword!==pw){
    setFail(true); 
    setFail1(true)
    setFail2(true)
    setFail3(true)
    setFail4(true)
    setFail5(true)
  }

  else if (fn !== '' && ln !== '' && em !== '' && pw !== '' && srepassword !== '' && srepassword==pw){
    fetch('https://enewstag.com/api/socialUser/', {
      method: 'POST', // or 'PUT'
      body: formData
    })
    .then(response => response.text())
    .then(data => {
      getuserData(); 
      // console.log('Success:', data);
    })
    .catch((error) => {
      // console.error('Error:', error);
    });

    setModalVisible(false);
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



  const onSocialSignUp = (fn,ln,em,img) =>{

    const formData = new FormData()

    formData.append('fname', fn);
    formData.append('lname', ln);
    formData.append('email', em);
    formData.append('profile_pic', img);
   
    fetch('https://enewstag.com/api/socialUser/', {
      method: 'POST', // or 'PUT'
      body: formData
    })
    .then(response => response.text())
    .then(data => {
      getuserData(); 
      // console.log('Success:', data);
    })
    .catch((error) => {
      // console.error('Error:', error);
    })
    getuserData();
  }

  const Reset=()=>{
    setFname('');
    setLname('')
    setSmail('')
    setSpassword('')
    setRepassword('')
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
          // console.log('login info has error: ' + error);
        } else {
          // signOut()

          setUserData(result)
          


          // console.log(result)
          data.map((user)=>
          {if (user.email!==result.email){
            onSocialSignUp(result.name,'',result.email,result.picture.data.url,'')
            getuserData()
            console.log(result)
            // console.log(result)
            data.map((user)=>
          {if (user.email==result.email){
            lang.setLogData(user)
            storeData(user)

            lang.setLogData(user)
            setUserInfo(user)
            console.log(user)
            
          }})
          }
          
          else if (user.email==result.email){
            console.log(user)
            getuserData()
            lang.setLogData(user)
            setUserData(user)
            setIsLogged2(true)
            storeData(user)
          }}
          )

          lang.setLogDet(result.email)
          setRefreshing(true)
          setLoading(true)

          fetch(
            'https://enewstag.com/api/socialUser/',
          )
            .then((response) => response.json())
            .then((json) => 
            lang.setLogMail(json)
            )
            .catch((error) => console.error(error))
            .finally(() => {setLoading(false);});
          setRefreshing(false);

          if (isLogged2==false){
            onSignUp(result.name,'',result.email,result.picture.data.url,'')
            data.map((user)=>
            {if (user.email==result.email){
              lang.setLogData(user)
              setUserInfo(user)
              console.log(user)
            }})
          }

          // console.log(lang.logdata)
          navigation.navigate('Home'),
          lang.setState('Home')
         
        }
      },
    );
    new GraphRequestManager().addRequest(profileRequest).start();
  };

// end of fb

// google sign in
  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();

      const userInfo = await GoogleSignin.signIn();
     
      setUserData(userInfo.user)
      
      data.map((user)=> 
      {if (user.email === userInfo.user.email) { 
        lang.setLogData(user)
        setUserInfo(user)
        storeData(lang.logdata)
        setError( null );
        lang.setState('Home')
        navigation.navigate('Home')
      }
    else {

      onSocialSignUp(userInfo.user.givenName,userInfo.user.familyName,userInfo.user.email,userInfo.user.photo,'')
      
      lang.setLogDet(userInfo.user.email)
        lang.setState('Home')
        navigation.navigate('Home')
        
    }}
  
      )


      // setData([])
      setRefreshing(true)
      setLoading(true)

      fetch(
        'https://enewstag.com/api/socialUser/',
      )
        .then((response) => response.json())
        .then((json) => 
        lang.setLogMail(json)
        )
        .catch((error) => console.error(error))
        .finally(() => {setLoading(false);});
      setRefreshing(false);

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
    
    getCurrentUser();
    if (!userInfo) {
      getCurrentUser();
  }

    onRefresh();
    setLogged('') 
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
          <TextInput
            style={styles.loginInput}
            placeholder="Email"
            onChangeText={(text) => setName(text)}
            value={username}
            keyboardType={'email-address'}
            textContentType={'emailAddress'}
          />
          <TextInput
            style={styles.loginInput}
            placeholder="Password"
            onChangeText={(text) => setPw(text)}
            value={password}
            textContentType={'password'}
            secureTextEntry={true}
          />
          <TouchableOpacity style={buttons.login} onPress={() => {onLogin();Keyboard.dismiss();lang.setState('Home');}}>
            <Text style={buttons.text}>Login</Text>
          </TouchableOpacity>
          <View>
          <Text style={[styles.headerText,{paddingTop:10}]}>Don't have an Account?</Text>
          </View>
          <TouchableOpacity style={[buttons.otherButtons,{backgroundColor:'#ea7900'}]} onPress={() => setModalVisible(true)}>
            <Text style={buttons.text}>Register</Text>
          </TouchableOpacity>
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
            onLogoutFinished={() => lang.setLogData([])}
            style={{width:windowWidth-40,height:40,alignItems: 'center',elevation:2,justifyContent: 'center'}}
          />

          {/* <GoogleSigninButton
            style={{ width: windowWidth-40, height: 45 , justifyContent: 'space-around',flexDirection:'row'}}
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Light}
            onPress={signIn}
            // disabled={this.state.isSigninInProgress} 
          /> */}
          {body}
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
              size={20}
              color="#000"
              style={buttons.menu2}
              onPress={() => {toggleModal()}}
            />

         {fail==true?
        <View style={{backgroundColor:'red',padding:10,elevation:5,alignSelf:'center',top:40,position:'absolute'}} 
        
        onLayout={()=>
        setTimeout(() => {
          setFail(null)
        }, 800)
          
        }>
          <Text style={[styles.innerText,{color:'white'}]}>Something Wrong</Text>
        </View>
        :
        fail==false?
        <View style={{backgroundColor:'green',padding:10,alignSelf:'center',top:40,position:'absolute',zIndex:2}} 
        onLayout={()=>
          setTimeout(() => {
            setFail(null)
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
              <TextInput
                  style={styles.loginInput}
                  placeholder="First Name"
                  onChangeText={(text) => setFname(text)}
                  value={fname}
                  keyboardType={'default'}
                  textContentType={'username'}
                />
                
                {fail1==true?(
                  <Text style={styles.ValidationText}>*First Name is required</Text>
                ):(null)}
              <TextInput
                style={styles.loginInput}
                placeholder="Last Name"
                onChangeText={(text) => setLname(text)}
                value={lname}
                keyboardType={'default'}
                textContentType={'username'}
              />
              {fail2==true?(
                  <Text style={styles.ValidationText}>*Last Name is required</Text>
                ):(null)}

              <TextInput
                style={styles.loginInput}
                placeholder="Email"
                onChangeText={(text) => setSmail(text)}
                value={smail}
                keyboardType={'email-address'}
                textContentType={'emailAddress'}
              />
              {fail3==true?(
                  <Text style={styles.ValidationText}>*Email is required</Text>
                ):(null)}

              <TextInput
                style={styles.loginInput}
                placeholder="password"
                onChangeText={(text) => setSpassword(text)}
                value={spassword}
                textContentType={'password'}
                secureTextEntry={true}
              />
              {fail4==true?(
                  <Text style={styles.ValidationText}>*Password is required</Text>
                ):(null)}

              <TextInput
                style={styles.loginInput}
                placeholder="Confirm Password"
                onChangeText={(text) => setRepassword(text)}
                value={srepassword}
                textContentType={'password'}
                secureTextEntry={true}
              />
              {fail5==true?(
                  <Text style={styles.ValidationText}>*Passwords not Matching</Text>
                ):(null)}

              <TouchableOpacity style={buttons.login} onPress={() =>{
              //  setModalVisible(!modalVisible);
              onSignUp(fname,lname,smail,null,spassword)
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

