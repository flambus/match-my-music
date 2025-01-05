import { Datex } from "datex-core-legacy/datex.ts";
import { Likes, LikesFrom, Matches } from "./relationships.ts";
import { addUser } from "backend/users.ts";

export const chats: Chat[] = await lazyEternalVar("chats") ?? $$([]);

// The message definition
export type Message = {
	content: string,
	timestamp: Datex.Time | number,
	origin: Datex.Endpoint
}

// The chat definition
export type Chat = {
	id: string,
	createdAt: Datex.Time | number,
	members: Datex.Endpoint[],
	messages: Message[]
}

// Chats interface exposed from endpoint
@endpoint
export class Chats {

	@property
	// Exposing the getChats backend function
	static async getChats(): Promise<Chat[]> {
		const me = datex.meta?.caller;
		return chats
			.filter(e => me && e.members.includes(me))
			.sort((a, b) => (
				Number(b.messages.at(-1)?.timestamp || b.createdAt) - Number(a.messages.at(-1)?.timestamp || a.createdAt)
			));
	}

	@property
	// Exposing the getChat backend function
	static async getChat(endpointId: string): Promise<Chat | undefined> {
		const other = Datex.Target.get(endpointId) as Datex.Endpoint;
		const me = datex.meta?.caller;
		if (other === me)
			throw new Error("You can't chat with yourself! Or can you?");
			
		const chat = me && chats.find((chat) => 
			chat.members.includes(me) && 
			chat.members.includes(other)
		);
		return chat || await this.startChat(endpointId);
	}

	// The startChat backend function
	private static async startChat(endpointId: string): Promise<Chat> {
		const me = datex.meta?.caller!;
		const other = Datex.Target.get(endpointId) as Datex.Endpoint;
		
		const members = [other, me];
		const chat = $({
			id: (Math.random() * 1000).toString(),
			createdAt: Datex.Time.now(),
			members,
			messages: $([])
		});
		chats.push(chat);
		const uid = String((Math.random() * 1000))
		const user = $({
			user_id: uid,                          // From your existing variable
			first_name: endpointId.slice(2, 5),    // Placeholder for first_name
			gender: "unknown",                     // Set a default or get from the source
			birthday: null,                  // Default to current date or specify
			location: {                            // Replace with actual GeoLocation data
				lat: 0,
				lon: 0,
			},
			spotify_user: null,                    // Default to null if no Spotify data
			user_profile: null,                    // Default to null if no profile data
			email: null,           // Generate or retrieve email
			password_hash: null,  // Replace with hashed password
			endpoint_id: endpointId                // From your existing variable
		});
		addUser(user);
		Likes.addLike(Number(uid));
		LikesFrom.addLikeFrom(Number(uid));
		Matches.addMatch(Number(uid));
		return chat;
	}
}