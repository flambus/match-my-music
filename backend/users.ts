import { passwordHash, User } from "../common/user_types.ts";
import { Context } from "uix/routing/context.ts";
const hash = await import('https://deno.land/x/scrypt@v4.4.4/mod.ts');


declare global {
	interface PrivateData {
		user?: User
	}
}

export const UserGroupEnum = Object.freeze({
	THEIR_LIKES: "their-likes",
	OWN_LIKES: "own-likes",
	MATCHES: "matches"
})

// storage for all users
export const users = await lazyEternalVar('users') ?? $(new Set<User>());

//storage of user ids
export const user_ids = await lazyEternalVar('userIds') ?? $(new Set<string>());

export function addUser(user: User) {
    users.add(user);
    console.log(users);
}

/**
 * hashPassword - Hashes a password using Scrypt and a random salt.
 * 
 * @param password - the unhashed password
 * @returns password hash object containing the hash and salt
 */
export function hashPassword(password: string): passwordHash {
    const salt = hash.genSalt(8, 'string');

    return { hash: hash.hash(password, {salt: salt}), salt: salt?.toString() };
}

/**
 * checkPasswordIsEqual - hashes the given password and checks for equality with the existing hash.
 * 
 * @param password 
 * @param user_password_hash 
 * @returns 
 */
export function checkPasswordIsEqual(password: string, user_password_hash: passwordHash){
    return hash.hash(password, {salt: user_password_hash.salt}) == user_password_hash.hash;
}

/**
 * emailExists - checks if the given email is already used by another user.
 * 
 * @param email - the email to check
 * @returns true if the email is already used, false otherwise
 */
export function emailExists(email: string): boolean {
    return Array.from(users).some(user => user.email === email);
}

/**
 * calculateUniqueId: generates a unique id and checks if it already exists.
 * 
 * @returns unique id
 */
export function calculateUniqueId(): string {
    const generateRandomId = (): string => {
        const array = new Uint8Array(8);
        crypto.getRandomValues(array);
        return Array.from(array)
            .map((byte) => byte.toString(16).padStart(2, "0"))
            .join("");
    };

    const ensureUniqueId = (): string => {
        const random_part = generateRandomId();
        const id = `${Date.now()}-${random_part}`;

        return user_ids.has(id) ? ensureUniqueId() : id; 
    };

    return ensureUniqueId();
}

/**
 * getUser - returns the user object from the session
 * 
 * @param session - the session to get the user from
 * @returns the user object if it exists, null otherwise
 */
export function getUser(session: PrivateData) {
	return session.user ? (session.user) : null;
}

/**
 * saveUser - saves the user object to the session
 * 
 * @param session - the session to save the user to
 * @param user - the user to save
 */
export function saveUser(session: PrivateData, user: User) {
	console.log(`saving user in privatedata ${user.first_name}`);
	session.user = user;
}

/**
 * logout - removes the user object from the session
 */
export async function logout() {
    const session = await Context.getPrivateData(datex.meta);
    session.user = undefined;
}