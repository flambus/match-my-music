import { template } from "uix/html/template.ts"
import { Component } from "uix/components/Component.ts"
import { BubbleSelector } from "./bubbleSelector.tsx"
import { User } from "common/user_types.ts"
import { getUserFrontend } from "backend/updateUser.ts";
import { Routes } from "common/routes.ts";


export enum Genre {
	POP = "Pop",
	HIP_HOP = "HipHop",
	ROCK = "Rock",
	JAZZ = "Jazz",
    CLASSICAL = "Classical",
    ELECTRONIC = "Electronic",
    REGGAE = "Reggae",
    BLUES = "Blues",
    COUNTRY = "Country",
    METAL = "Metal",
    RNB = "R&B",
    SOUL = "Soul",
    PUNK = "Punk",
    LATIN = "Latin",
    HOUSE = "House",
    TECHNO = "Techno",
    TRANCE = "Trance",
    DUBSTEP = "Dubstep",
    INDIE = "Indie",
    K_POP = "K-Pop",
}

@template(function(){
	return <BubbleSelector
	title="Select your favorite Genres"
	bubbleOptions= {Object.values(Genre)}
    onSelectionChange={this.handleGenreSelection}
	url={Routes.USER_PROFILE_INTENTIONS}
   />
})
export class GenreSelector extends Component{
    private handleGenreSelection = async (selectedGenres: string[]) => {
        const user: User | null = await getUserFrontend();
        console.log(user)
        
        // we expect user and user_profile to already exist at this point
        if (user && user.user_profile) {
            user.user_profile.genres = selectedGenres;
        }
        else {
            console.error("user or user_profile does not exist");
        }
    };
}