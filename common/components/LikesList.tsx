import { Likes, LikesFrom, Matches, type UserRelationship } from "backend/relationships.ts";
import { type Chat } from "backend/chat.ts";
import { type User } from "../user_types.ts";
import { users } from "backend/users.ts";
import { likes } from "backend/relationships.ts";
import { type Like } from "backend/relationships.ts";
import { map } from "datex-core-legacy/functions.ts";
import { Datex } from "datex-core-legacy/datex.ts";
import { template } from "uix/html/template.ts";
import { Component } from "uix/components/Component.ts";

@template(function(this: LikesList) {
	return <>
		<>
			{map(this.properties.items, (item) => {
				const like_user_id = item.user_id;
				const users_arr = Array.from(users);
				const user = users_arr.find(e => e.user_id == like_user_id);
				let like_name;
				if (user) {
					like_name = user.first_name;
				} else {
					like_name = '';
				}
				return <a class="like">
					<img src="../icons/user_image_default.png"/>
					<div>
						<h1>{like_name}</h1>
					</div>
				</a>
			})
		}
		</>
		{
			likes.length === 0 ? <h1 class="empty">Pretty empty in here...</h1> : undefined
		}
		</>
}) 

export class LikesList extends Component<{items: UserRelationship[]}> {
	
}