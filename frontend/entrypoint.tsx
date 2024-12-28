/**
 * Frontend entrypoint:
 * This module provides a default export that defines the UI that is created on the frontend
 * when a page is visited
 */
import { Registration } from "../common/components/registration.tsx"; 
import { IntentionSelector } from "../common/components/userProfile/intentionSelector.tsx";
import { GenreSelector } from "../common/components/userProfile/genreSelector.tsx";
import { GenderPreferenceSelector } from "../common/components/userProfile/genderPreferenceSelector.tsx";
import { Routes } from "common/routes.ts";

import { Chats } from "backend/chat.ts";
import { UserRelationships } from "backend/relationships.ts";
import { ChatPage } from "common/components/ChatPage.tsx";
import { Overview } from '../common/components/Overview.tsx';
import { LikeOverview } from '../common/components/LikeOverview.tsx';

export default {

	'/frontend': import("common/page.tsx"),
	[Routes.LOGIN]: import("../common/components/login.tsx"),
    [Routes.REGISTRATION]: <Registration/>,

	// User Profile creation
	[Routes.USER_PROFILE_GENRES]:  <GenreSelector/>, 
	[Routes.USER_PROFILE_INTENTIONS]: <IntentionSelector/>,
	[Routes.USER_PROFILE_GENDER_PREFERENCES]: <GenderPreferenceSelector/>,

	'/chats': async () => <Overview chats={await Chats.getChats()}/>,
	'/likes': async () => <LikeOverview items={await UserRelationships.getUserRelationships("their-likes")}/>,
	'*': async (ctx) => {
		const id = decodeURIComponent(ctx.path).slice(1);
		console.log(id)
		try {
			const chat = await Chats.getChat(id ?? "unyt");
			if (!chat)
				throw new Error("Chat not found!");
			return chat ? <ChatPage chat={chat}/> : <></> // render the chat component //<ChatPage chat={chat}/>
		} catch (error) {
			console.error(error);
			return (
				<div class="error">
					<h1>Oups, this endpoint does not exist!</h1>
					<span>{(error as Error)?.message ?? ''}</span>
					<a href={"/"}>Go back</a>
				</div>
			)
		}
	}
}