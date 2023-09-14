import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import axios from 'axios';
import ReactDOM from 'react-dom';
import ReactJkMusicPlayer from 'react-jinke-music-player'
import 'react-jinke-music-player/assets/index.css'
import Cookies from 'js-cookie'

function Dashboard() {

    const [user, setUser] = useState({});
    const history = useHistory();
    const token = localStorage.getItem("token");
    const fetchData = async () => {

        //set axios header dengan type Authorization + Bearer token
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        //fetch user from Rest API
        await axios.get('http://localhost:8000/api/user')
        .then((response) => {

            //set response user to state
            setUser(response.data);
        })
    }
    const [songs, setsongs] = useState([]);
    const [playlistState, setplaylistState] = useState(0);

    const posit={
        right:'50px',
        bottom:'20px'
    }

    //hook useEffect
    useEffect(() => {

        //check token empty
        if(!token) {

            //redirect login page
            history.push('/');
        }
        
        //call function "fetchData"
        fetchData();
    }, []);

    //function logout
    const logoutHanlder = async () => {

        //set axios header dengan type Authorization + Bearer token
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        //fetch Rest API
        await axios.post('http://localhost:8000/api/logout')
        .then(() => {

            //remove token from localStorage
            localStorage.removeItem("token");

            //redirect halaman login
            history.push('/');
        });
    };

    let getData  = () => {
        axios.get('/api/song-list')
        .then((response) => {
          setsongs(response.data.allData);
            console.log('A removed deleted!')
        }).catch((error) => {
            console.log(error)
       })
      }
      useEffect(() => {
          getData();
          setUserToken();
      }, []);
  
      let setUserToken =()=> {
        var characters = "ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";  
        var lenString = 100;  
        var randomstring = '';  
        for (var i=0; i<lenString; i++) {  
          var rnum = Math.floor(Math.random() * characters.length);  
          randomstring += characters.substring(rnum, rnum+1);  
        }
        if(Cookies.get('music_usersession')) {  }
        else { Cookies.set('music_usersession', randomstring) ; }
        playListSongCount();
      }
      const [playlistcount, setPlayListCount] = useState([]);
      let playListSongCount = ()=>{
        const userpersonaltoken = Cookies.get('music_usersession');
        fetch('/api/get-playlist/'+userpersonaltoken, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        })
       .then(response => response.json())
       .then(data => setPlayListCount(data.allData));
      }
  
      let addToPlayList = (e) =>{
        const data = new FormData() 
        data.append('song_id', e)
        data.append('user_token', Cookies.get('music_usersession'))
        data.append('song_type', 0)
        axios.post("/api/addto-playlist", data)
        .then((response) => {
          if (response.data.status === 1) {
            setplaylistState( playlistState + 1 );
            playListSongCount();
            alert(response.data.message)
        }
        else
            {
              alert(response.data.message)
            }
        })
        .catch((error) => {
            console.error(error);
        });
      }

      return (
        <>
<div>
<ReactJkMusicPlayer 
  showMediaSession
  defaultPosition={posit}
  quietUpdate
  clearPriorAudioLists
  audioLists={playlistcount}
/>
</div>


<div>

  <section className="miscellaneous-area section-padding-100-0">
    <div className="container">
      <div className="row">
        <div className="card-body">
            SELAMAT DATANG <strong className="text-uppercase">{user.name}</strong><hr />
            <button onClick={logoutHanlder} className="btn btn-md btn-danger">LOGOUT</button>
        </div>
        <div className="col-12 col-lg-12">
          <div className="new-hits-area mb-100">
            <div className="section-heading text-left mb-50 wow fadeInUp" data-wow-delay="50ms">
              <p>qbaliqbal music player</p>
              <h2>Daftar Lagu</h2>
            </div>
            
            { songs.map((singledata) => (
            <div className="single-new-item d-flex align-items-center justify-content-between wow fadeInUp" data-wow-delay="100ms">
              <div className="first-part d-flex align-items-center">
                <div className="thumbnail">
                  <img src={singledata.cover} alt />
                </div>
                <div className="content-">
                  <h6>{singledata.name}</h6>
                  <p>{singledata.singer}</p>
                </div>
              </div>
              <button onClick={()=>addToPlayList(singledata.id)} class="btn oneMusic-btn mt-30" type="submit">Tambah ke playlist <i class="fa fa-angle-double-right"></i></button>
            </div>
            ))}

            
          </div>
        </div>        
      </div>
    </div>
  </section>

  <footer className="footer-area">
    <div className="container">
      <div className="row d-flex flex-wrap align-items-center">
        <div className="col-12 col-md-6">
          <p>2023</p>
        </div>
        <div className="col-12 col-md-6">
          <div className="footer-nav">
            
          </div>
        </div>
      </div>
    </div>
  </footer>
</div>


        </>
    );

}

export default Dashboard;