import { template } from "uix/html/template.ts"
import { Component } from "uix/components/Component.ts"
import { BubbleSelector } from "./bubbleSelector.tsx";
import { getUserFrontend } from "backend/updateUser.ts";
import { Routes } from "common/routes.ts";

@template(function(){
	return <BubbleSelector
	title="What gender do you prefer ?"
	bubbleOptions= {["Men", "Women", "Divers"]}
	onSelectionChange={this.handleGenderPreferenceSelection}
	url="/frontend"
    backUrl={Routes.USER_PROFILE_INTENTIONS}
   />
})
export class GenderPreferenceSelector extends Component {
	private handleGenderPreferenceSelection = async (selectedPreferences: string[]) => {
        const user = await getUserFrontend();
        // we expect the user and user profile to already exist at this point
		if (user && user.user_profile) { 
            user.user_profile.gender_preferences = selectedPreferences;
        }
        else {
            console.error("user or profile does not exist")
        }
    };
}