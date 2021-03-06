import React from 'react';
import './SignIn.css';

class Signin  extends React.Component{
	constructor(props){
		super(props);
		this.state ={
			signInEmail : '',
			signInPassword : '',
			showWarning: false
		}
	}
	onEmailChange = (event) =>{
		this.setState({signInEmail: event.target.value})
		console.log(this.state.signInEmail);
	}

	onPasswordChnge = (event) =>{
		this.setState({signInPassword: event.target.value})
		console.log(this.state.signInPassword);
	}

	onSubmitSignIn = () => {
		fetch(' https://powerful-crag-88676.herokuapp.com/signin',{
			method : 'post',
			headers : {'Content-Type': 'application/json'},
			body : JSON.stringify({
				email : this.state.signInEmail,
				password : this.state.signInPassword
			})
		}).then(response => response.json())
		.then(user => {
			if (user.id){
				this.props.loadUser(user);
				this.props.onRouteCahnge('home');
			}else{
				this.setState({showWarning: true})
			}
		})		
	}

	hideWarning = () => {
		this.setState({showWarning: false})			
	}


	render(){
		const { onRouteCahnge } = this.props;
		const {showWarning} = this.state;
		return (
		<article className="br3 ba  b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
			<main className="pa4 black-80">
			  <div className="measure ">
			    <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
			      <legend className="f1 fw6 ph0 mh0">Sign In</legend>
			      <div className="mt3">
			        <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
			        <input 
			        	className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
			        	type="email" name="email-address"  
			        	id="email-address"
			        	onChange={this.onEmailChange}
			        />
			      </div>
			      <div className="mv3">
			        <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
			        <input 
			        	className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
			        	type="password" 
			        	name="password"  
			        	id="password"
			        	onChange={this.onPasswordChnge}
			        />
			      </div>
			     	{ 
			     		 showWarning ?
			      			<div class="alert" id='warning' >
 								<span class="closebtn" onClick={this.hideWarning}>&times;</span> 
  								<p><strong>Incorrect Email or Password. </strong></p>
				  			</div>	
				  			: 
				  			<div>
				  			</div>
				  			    
				 	}  
			    </fieldset>
			    <div className="">
			      <input 
			      	className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" 
			      	type="submit" 
			      	value="Sign in"

			      	onClick={ this.onSubmitSignIn}
			      />
			    </div>
			    <div className="lh-copy mt3">
			      <p onClick={() => onRouteCahnge('register')} className="f6 link dim black db pointer">Register</p>			      
			    </div>
			  </div>
			</main>

		</article>
		);
	}
	
}

export default Signin;