export type User = {
	user_id: string;
	first_name: string;
	gender?: string;
	birthday: Date | null;
	location: GeoLocation | null;
	spotify_user: SpotifyUser | null;
	user_profile: UserProfile | null;
	email: string | null;
	password_hash: passwordHash | null;
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