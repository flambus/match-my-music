export type User = {
	user_id: string;
	first_name: string;
	gender: string;
	birthday: Date;
	location: GeoLocation;
	spotify_user: SpotifyUser | null;
	user_profile: UserProfile | null;
	email: string;
	password_hash: passwordHash;
	endpoint_id: string;
};

export type SpotifyUser = {
	spotify_key: string;
};

export type passwordHash = {
	hash: string;
	salt: string;
};

export type UserProfile = {
	favorite_songs: Array<string>;
	genres: Array<string>;
	gender_preferences: Array<string>; 
	intentions: Array<string>;
	question: Array<QuestionAnswer>;
};

export type QuestionAnswer = {
	question: string;
	answer: string;
};

export type GeoLocation = {
	lat: number;
	lon: number;
}