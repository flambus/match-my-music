import { template } from "uix/html/template.ts"
import { Component } from "uix/components/Component.ts"
import { login } from "backend/login.ts";
import { Routes } from "common/routes.ts";

@template(function(){
	return <div class="form-container">
		<div class="note-container">
            <img src={"/@uix/src/common/icons/logo.png"} alt="logo"/>
			<h2>Login</h2>
        </div>
		<div class="input-container">
				<input type="email" class={this.email_shake ? "shake" : ""} value={this.email} placeholder="Email" required/> <br/>
				<input type="password" class={this.password_shake ? "shake" : ""} value={this.password} placeholder="Password" required/> <br/>
				<button class="NextButton" onclick={()=> this.loginFrontend()}>Login</button>
				<div style = "color: red; white-space: pre;">{this.error_msg}</div>
		</div>
		<div class="register-link">
			<p>Don't have an account? <a href="/registration">Sign up here</a> for free.</p>
        </div>
	</div>

})
export class Login extends Component{
	@property email = "";
	@property password = "";
	@property error_msg = "";

	@property email_shake = false;
	@property password_shake = false;

	async loginFrontend(){
		this.error_msg = "";
		const valid = await login(this.email, this.password); //calls the backend function login (login.ts)

		if(valid == true){
			redirect(Routes.MATCH_MY_MUSIC);
			return;

		}else if(valid == "email"){
			this.error_msg = "E-Mail does not exist";
			this.email_shake = true;
			setTimeout(() => this.email_shake = false, 500);

		} else if (valid == "password"){
		this.error_msg = "Wrong Password";
        this.password_shake = true;
        setTimeout(() => this.password_shake = false, 500)
		}

	}

}

export default
<Login/>
