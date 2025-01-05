import { Context } from "uix/routing/context.ts";
import { checkPasswordIsEqual, saveUser, users } from "backend/users.ts";
import { User } from "common/user_types.ts";

/**
 * login - checks if the given email and password match a user in the database
 * 
 * @param email 
 * @param password 
 * @returns true if the login was successful, "email" if the email does not exist, "password" if the password is incorrect
 */
export async function login(email: string, password: string) {
    const session = await Context.getPrivateData(datex.meta);
    const all_users = Array.from(users);
    const user = all_users.find(user => user.email === email) as User
    
    if(user && user.password_hash){
        if (await checkPasswordIsEqual(password, user.password_hash) == true){
            await saveUser(session, user); //save the user in private data
            return true;
        }
        return "password";
    }
    return "email";
}
