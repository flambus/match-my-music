import { Component } from "uix/components/Component.ts";
import { template } from "uix/html/template.ts";
import { User, UserProfile } from "common/user_types.ts";
import { hashPassword, emailExists, calculateUniqueId, addUser} from "backend/users.ts";
import { frontendRouter } from "uix/routing/frontend-routing.ts";
import {saveUserFrontend} from "backend/updateUser.ts";
import { Routes } from "common/routes.ts";

@template(function(){
    return <div class="lo">

        <div class="note-container">
            <img src={"/@uix/src/common/icons/logo.png"} alt="logo" onclick={this.showNotes}/>
        </div>

        <form onsubmit={this.submitUserData}>

            {this.show_register_two.val ? <div class={"form-group"}>

                <input type="email" id="email" class={this.email_shake ? "shake" : ""} name="email" value={prop(this.user, 'email')} required  autocomplete="email" placeholder="Email" />

                <input type="password" class={this.password_shake ? "shake" : ""} id="password" name="password" value={this.password} required oninput={this.validatePassword} autocomplete="new-password" placeholder="Password"/>

                <input type="password" class={this.password_confirmation_shake ? "shake" : ""} id="password-confirmation" name="password-confirmation" value={this.password_confirmation} required autocomplete="new-password" placeholder="Password confirmation"/>
                
                <ul>
                    {this.password_rules.map(rule => (
                        <li style={{ color: rule.valid ? "green" : "red" }}>
                         {rule.text}
                        </li>
                    ))}
                </ul>
                
                <div class="button-container">
                    <button class="BackButton" type="button" onclick={() => this.toggleRegisterTwo()}>Back</button>
                    <button class="NextButton" type="submit">Register</button>
                </div>

                <div style = "color: red; white-space: pre;">{this.validation_error.val}</div>
                
                </div> : 
                <div class="form-group">

                    
                    <input type="text" class={this.name_shake ? "shake" : ""} id="first-name" name="first-name" value={prop(this.user, 'first_name')} required placeholder="First Name"/>
                    
                    
                    <input type="text" class={this.date_shake ? "shake" : ""}  id="dob" name="dob" value={prop(this.user, 'birthday')} required placeholder="Birthday" onfocus="(this.type = 'date')" onblur="(this.type = 'text')"/>

                    
                    <select id="gender" name="gender" value={prop(this.user, 'gender')} required>
                        <option value="" disabled selected hidden>Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>

                    
                    <input type="text" id="city" name="city" value={prop(this.user, 'location')} required placeholder="City/Location"/>


                    <button class="NextButton" type="submit" >Next </button>

                    <div style = "color: red; white-space: pre;">{this.validation_error.val}</div>

                </div>
            }
        </form>
        <div class="register-link">
            <p>Already have an account? <a href="/login">Log in here</a>.</p>
        </div>
    </div>
})

export class Registration extends Component {
    user: User = $({
        user_id: '',
        first_name: '',
        gender: '',
        birthday: '',
        location: '',
        email: '',
        password_hash: '',
        spotify_user: null,
        endpoint_id: datex.meta?.caller!,
        user_profile: { 
            favorite_songs: [],
            genres: [],
            gender_preferences: [],
            question: [],
            intentions: []
        }  as UserProfile
    });

    password_confirmation = $("");
    password = $("");

    validation_error = $("");

    show_register_two = $(false); //Always start at register window one  

    @property name_shake = false;
    @property date_shake = false;
    @property password_shake = false;
    @property password_confirmation_shake = false;
    @property email_shake = false;

    password_rules = $([ //dynamic password rules
        { text: "At least 8 characters", valid: false },
        { text: "No spaces", valid: true },
        { text: "At least one uppercase letter", valid: false },
        { text: "At least one lowercase letter", valid: false },
        { text: "At least one number", valid: false },
        { text: "At least one special character", valid: false },
    ]);    

    private containsSpecialCharacters(input: string): boolean {
        const special_char_regex = /[^a-zA-Z0-9]/; 
        return special_char_regex.test(input);
    }

    /**
     * validation: validates the password after every input and changes the color of the rules dynamicly
     * 
     */
    private validatePassword = () => {
        const p = this.password.val; 
    
        this.password_rules.forEach((rule, index) => {
            switch (index) {
                case 0: // At least 8 characters
                    rule.valid = p.length >= 8;
                    break;
                case 1: // No spaces
                    rule.valid = !/\s/.test(p);
                    break;
                case 2: // At least one uppercase letter
                    rule.valid = /[A-Z]/.test(p);
                    break;
                case 3: // At least one lowercase letter
                    rule.valid = /[a-z]/.test(p);
                    break;
                case 4: // At least one number
                    rule.valid = /\d/.test(p);
                    break;
                case 5: // At least one special character
                    rule.valid = this.containsSpecialCharacters(p);
                    break;
            }
        });
        //set focus on password input after every input, if not the focus is lost after every dynamic change
        const password_input = document.getElementById('password') as HTMLInputElement;
        if (password_input) {
            password_input.focus(); 
        }
    };
    
    /**
     * validation: validates inputs.
     * 
     * @returns true if user is older than 18 and name does not contain any numbers, else false.
     */
    private validation = async () => {
        const errors: string[] = []; 

        if (this.show_register_two.val) { //validation for the second register window

            if( await emailExists(this.user.email)) {
                errors.push("Email is already in use.");
                this.$.email_shake = true; //shake email
            }

            const all_password_rules_valid = this.password_rules.every(rule => rule.valid);

            if (!all_password_rules_valid) {
                errors.push("Password does not meet all requirements."); 
                this.$.password_shake = true; //shake password input
            }

            if (this.password.val !== this.password_confirmation.val) {
                errors.push("Passwords do not match."); 
                this.password_confirmation.val = ""; 
                this.$.password_confirmation_shake = true; //shake password confirmation input
            
            }

            this.validation_error.val = errors.join("\n"); //save errors
            return errors.length === 0;
        }
        
        //validation for the first register window
        const today = new Date();
        const birth_date = new Date(this.user.birthday);

        const age = today.getFullYear() - birth_date.getFullYear();
        const has_had_birthday_this_year = today.getMonth() > birth_date.getMonth() || (today.getMonth() === birth_date.getMonth() && today.getDate() >= birth_date.getDate()); //true if user has had their birthday this year else false

        if (age < 18 || age === 18 && !has_had_birthday_this_year) {
            errors.push("You must be at least 18 years old.");
            this.$.date_shake = true;   
        }
        if (!/^\D+$/.test(this.user.first_name)) {
            errors.push("The name must not contain numbers. ");
            this.$.name_shake = true;
        }
        if (!/^\D+$/.test(this.user.last_name)) {
            errors.push("The name must not contain numbers. ");
            //this.name_shake.val = true;
            this.$.name_shake = true;
        }
        
        this.validation_error.val = errors.join("\n"); //save errors
        
        return errors.length === 0; // true, if no errors
    };

    /**
     * submitUserData: call validation on form input, will be called after register button or next button is clicked
     * calls addUser() function to send user data to backend.
     * 
     * @param event (SubmitEvent) send form 
     */
    private submitUserData = async (event: SubmitEvent) => {
        event.preventDefault(); // Prevent the form from submitting and reloading the page

        this.validation_error.val = " "; //reset errors
        
        if (await this.validation()) {
           
        
            //send user data only if second register window is shown.
            if(this.show_register_two.val == true){
                this.user.password_hash = hashPassword(this.password.val); //hash password and save it in user object;
                console.log('submitted input data: ', this.user);
                this.user.user_id =  await calculateUniqueId(); //generate unique id
                await addUser(this.user); //send user data to backend
                await saveUserFrontend(this.user); //save user in private data
                frontendRouter.navigateTo(Routes.USER_PROFILE_GENRES);
            }
            this.toggleRegisterTwo(); //change register window
            

        }
        //reset shake effect
        this.$.name_shake = false;
        this.$.date_shake = false;  
        this.$.password_shake = false;
        this.$.password_confirmation_shake = false;
        this.$.email_shake = false;
    };

    toggleRegisterTwo() {
        this.show_register_two.val = !this.show_register_two.val; //changes to the second register window
    }




    //easter egg
    showNotes = () => {
        const notes = ['♪', '♫', '♬', '♩', '♭'];
        const note = notes[Math.floor(Math.random() * notes.length)];
        const container = document.querySelector('.note-container');
        if (container) {
            const span = document.createElement('span');
            span.className = 'note';
            span.style.left = `${Math.random() * 100}%`; // Werte anpassen
            span.style.top = `${Math.random() * 50}px`;  // Werte anpassen
            span.style.animationDelay = `${0.1}s`;
            span.textContent = note;
            container.appendChild(span);
            setTimeout(() => {
               container.removeChild(span);
            }, 1000);
        }
    };

}
