import { template } from "uix/html/template.ts"
import { Component } from "uix/components/Component.ts"
import { BubbleSelector } from "./bubbleSelector.tsx"
import { getUserFrontend } from "backend/updateUser.ts"
import { Routes } from "common/routes.ts";

@template(function(){
	return <BubbleSelector
	title="What are your looking for ?"
	bubbleOptions= {["Love", "Friendship"]}
	onSelectionChange={this.handleIntentionSelection}
	url={Routes.USER_PROFILE_GENDER_PREFERENCES}
    backUrl={Routes.USER_PROFILE_GENRES}
   />
})
export class IntentionSelector extends Component {
	private handleIntentionSelection = async (selectedIntentions: string[]) => {
        const user = await getUserFrontend();
        
        if (user && user.user_profile) {
           user.user_profile.intentions = selectedIntentions;
        }
        else {
            console.error("user does not exist")
        }
    };
}