import React, { createContext, useState , useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleSignin , GoogleSigninButton , statusCodes, } from '@react-native-google-signin/google-signin';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {

  const [lang, setLanguage] = useState("English");
  const [cat, setCategory] = useState("");
  
  const [catBack, setCatBack] = useState(false);

  const [catBack2, setCatBack2] = useState(false);

  const [logdata, setLogData] = useState([]);
  
  const [sub, setSub] = useState([]);

  const [userInfo, setUserInfo] = useState([]);
  const [logged, setLogged] = useState('');
  const [state, setState] = useState("");
  const [search, setSearch] = useState("");
  const [screen, setScreen] = useState("");
  const [error, setError] = useState("");
  const [acc, setAcc] = useState("");
  const [theme, setTheme] = useState("light");
  const [breaking, setBreaking] = useState([]);
  const [filtedData, setFilltedData] = useState([]);
  
  const [loading, setLoading] = useState();
  
  const [id, setId] = useState("");

  const [logMail, setLogMail] = useState([]);
  const [logdet, setLogDet] = useState('');
  const getLanguageData = async () => {
    try {
      const value = await AsyncStorage.getItem('lang');
      if(value !== null) {
        setLanguage(value);
        // getLastBreaking(value);
        console.log(value)
      }
      if(value == null) {
        setLanguage('English');
        // getLastBreaking('English');
      }
    } catch(e) {
      // error reading value
    }
  };

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('userInfo')
      return jsonValue != null ? 
      setLogData(JSON.parse(jsonValue))
      // console.log(jsonValue) 
      : null;
    } catch(e) {
      // error reading value
    }
  }
  
 
const getAccount = async () => {
  try {
    const value = await AsyncStorage.getItem('acc')
    if(value !== null) {
      setAcc(value)
      // value previously stored
    }
  } catch(e) {
    // error reading value
  }
}
// const getNewsData = () => {
//   fetch(
//     'https://enewstag.com/api/news/',
//   )
//     .then((response) => response.json())
//     .then((json) => setUserInfo(json))
//     .catch((error) => {setError(true)})
//     .finally(() => {setLoading(false);});
//   // setRefreshing(false);
  
// };

// const getLastBreaking =(language)=>{
//   userInfo.map((news, index)=>
//   language==news.language && news.type =='Breaking_News'?
//   setBreaking(news.title)
//   :
//   null
// )
// }

  useEffect(() => {
    getLanguageData();  
    getData();  
    getAccount();
    // getNewsData();
    // getLastBreaking()
  }, []);

  return (
    <UserContext.Provider
      value={{
        cat,
        setCategory,
        lang,
        setLanguage,
        logdata,
        setLogData,
        logged,
        setLogged,
        state,
        setState,
        search,
        setSearch,
        screen,
        setScreen,
        userInfo,
        setUserInfo,
        error,
        setError,
        acc,
        setAcc,
        theme,
        setTheme,
        breaking,
        setBreaking,
        catBack,
        setCatBack,
        catBack2,
        setCatBack2,
        logMail,
        setLogMail,
        logdet,
        setLogDet,
        sub,
        setSub,
        filtedData,
        setFilltedData
      }}
    >
      {children}
    </UserContext.Provider>
  );
};