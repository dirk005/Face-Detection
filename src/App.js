import React, { Component } from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import Particles from 'react-particles-js';

// Options for particles background
const particlesOptions = {
  particles: {
        number:{
          value:100,
          density:{
            enable:true,
            value_area: 800,
          }
        },                               
        shape:{
          stroke:{
          width:1,
          color: '#333'
        }
      },
      move:{
        speed:5,
      }
    }
  }

const initialState = {
   input:'',
      imageUrl:'',
      box:{},
      route:'signin',
      isSignedIn : false,
      user:{
        id:'',
        name: '',
        email: '',
        entries: 0,
        joined: ''
      }

}
class App extends Component {

  //Setup state variables
  constructor(){
    super();
    this.state ={
      input:'',
      imageUrl:'',
      box:{},
      route:'signin',
      isSignedIn : false,
      user:{
        id:'',
        name: '',
        email: '',
        entries: 0,
        joined: ''
      }
    }
  }

  loadUser = (userInfo) =>{
    this.setState({user:{
        id:userInfo.id,
        name: userInfo.name,
        email: userInfo.email,
        entries: userInfo.entries,
        joined: userInfo.joined
      }})
  }

  //Get Location face box need to be displayed
  calculateFaceLocation = (data) => {
   const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
   const image = document.getElementById('inputImage');
   const width = Number(image.width);
   const height =Number(image.height);
   return {
      leftCol:clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)

   }
  }

  //Display face box
  displayFaceBox = (box) => {
    this.setState({box:box});
  }

  //Get input field value
  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  //When Submit button is clicked get url from input and display image and face box
  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input});
      fetch('http://localhost:3001/imageurl',{
            method : 'post',
            headers : {'Content-Type': 'application/json'},
            body : JSON.stringify({
              input: this.state.input
             })
          })
      .then(response => response.json())
      .then(response => {
        if (response){
          fetch('http://localhost:3001/image',{
            method : 'put',
            headers : {'Content-Type': 'application/json'},
            body : JSON.stringify({
              id: this.state.user.id
             })
          })
          .then(response => response.json())
          .then(count => {
            this.setState(Object.assign(this.state.user, { entries: count}))
          })
          .catch(console.log)
        }
        this.displayFaceBox(this.calculateFaceLocation(response))
      })
      .catch(err => console.log(err));
  }

  //change route 
  onRouteCahnge = (route) => {
    if(route === 'signout'){
      this.setState(initialState)  
      route = 'signin'   
    }else if (route === 'home'){
      this.setState({isSignedIn: true})
    }
    this.setState({route: route});
  }

  render() {
    const { isSignedIn,imageUrl,route,box} = this.state;
    return (
      <div className="App">
       <Particles className='particles'
              params={particlesOptions}              
            /> 
        <Navigation isSignedIn={isSignedIn} onRouteCahnge={this.onRouteCahnge}/>
        { this.state.route === 'home' ?
            <div>
              <Logo />
              <Rank  name={this.state.user.name} entries={this.state.user.entries} />
              <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
              <FaceRecognition box={box}imageUrl={imageUrl} />      
            </div>            
          :( route === 'signin' ?
                <Signin loadUser={this.loadUser} onRouteCahnge={this.onRouteCahnge}/>
                :
                <Register loadUser={this.loadUser} onRouteCahnge={this.onRouteCahnge}/>
            )           
       }
      </div>
    );
  }
}

export default App;
