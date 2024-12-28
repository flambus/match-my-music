import { Context } from "uix/routing/context.ts";
import { saveUser, getUser} from "backend/users.ts";
import { User } from "common/user_types.ts";

/**
 * saveUserFrontend - saves the user object to the session without the need of a session object. 
 *              
 * 
 * @param user - the user to save
 */
export async function saveUserFrontend(user: User) {
    const session = await Context.getPrivateData(datex.meta);
    await saveUser(session, user);

}

/**
 * getUserFrontend - returns the user object from the session without the need of a session object
 * 
 * @returns user object from the session
 */
export async function getUserFrontend() {
    const session = await Context.getPrivateData(datex.meta);
    return (await getUser(session));
}


