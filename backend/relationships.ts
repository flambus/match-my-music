import { UserGroupEnum } from "backend/users.ts";

export const likes: UserRelationship[] = await lazyEternalVar("likes") ?? $$([]);

export const likesFrom: UserRelationship[] = await lazyEternalVar("likesFrom") ?? $$([]);

export const matches: UserRelationship[] = await lazyEternalVar("matches") ?? $$([]);

export type UserRelationship = {
	user_id: string
}

export type Like = UserRelationship & {

}

export type LikeFrom = UserRelationship & {
	
}

export type Match = UserRelationship & {
	
}

@endpoint
export class UserRelationships {
	@property
	static async getUserRelationships(view: string): Promise<UserRelationship[]> {
		return view == UserGroupEnum.THEIR_LIKES ?  await LikesFrom.getLikes() 
		: view == UserGroupEnum.MATCHES ? await Matches.getMatches() 
		: await Likes.getLikes();
	}
}

@endpoint
export class Likes {
	@property
	static async getLikes(): Promise<Like[]> {
		return likes;
	}

	static async addLike(like_user_id: number): Promise<Like> {
		const like = $({
			user_id: like_user_id
		});
		likes.push(like);
		return like;
	}
}

@endpoint
export class LikesFrom {
	@property
	static async getLikes(): Promise<LikeFrom[]> {
		return likesFrom;
	}

	static async addLikeFrom(like_user_id: number): Promise<LikeFrom> {
		const like = $({
			user_id: like_user_id
		});
		likesFrom.push(like);
		return like;
	}
}

@endpoint
export class Matches {
	@property
	static async getMatches(): Promise<Match[]> {
		return matches.concat(matches);
	}

	static async addMatch(match_user_id: number): Promise<Match> {
		const match = $({
			user_id: match_user_id
		});
		const likes_arr = Array.from(likes);
		const liked_user = likes_arr.find(e => e.user_id == match_user_id);
		matches.push(match);
		if (liked_user) {
			const like_user_index = likes.indexOf(liked_user);
			if (like_user_index > -1) {
				likes.splice(like_user_index, 1);
			}
		}
		return match;
	}
}