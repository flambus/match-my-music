import { UserGroupEnum } from "backend/users.ts";
import { UserRelationships } from "backend/relationships.ts";
import { type Chat } from "backend/chat.ts";
import { type UserRelationship } from "backend/relationships.ts";
import { Datex } from "datex-core-legacy/datex.ts";
import { template } from "uix/html/template.ts";
import { Component } from "uix/components/Component.ts";
import { Footer } from "common/layout/Footer.tsx";
import { Layout } from "common/components/Layout.tsx";
import { Header } from "common/layout/Header/Header.tsx";
import { LikesList } from "common/components/LikesList.tsx";
import { Button } from "common/layout/Button.tsx";

@template(function(this: LikeOverview) {
	const { userGroup } = this;
	const view = $(UserGroupEnum.THEIR_LIKES.toString());
	const handleViewChange = (newView: string) => {
		view.val = newView;
		this.loadData(newView);
	}

	return <Layout>
		<Header onClickFunc={this.back} title={"Deine Likes und Matches"} iconLeft={"fa fa-arrow-left"}/>
		<div class="btn-group" style="width:100%">
			<Button handleClick={() => handleViewChange(UserGroupEnum.THEIR_LIKES.toString())} label="Geliked von" />
			<Button handleClick={() => handleViewChange(UserGroupEnum.OWN_LIKES.toString())} label="Deine Likes"  />
			<Button handleClick={() => handleViewChange(UserGroupEnum.MATCHES.toString())} label="Matches" />
		</div>

		<div class="main">
			<div id="likesList"><LikesList items={userGroup} /></div>
		</div>
		<Footer />
		
	</Layout>
}) 

export class LikeOverview extends Component<{items: UserRelationship[]}> {
	private userGroup: UserRelationship[] = this.properties.items;
	@id likesList!: HTMLDivElement;

	private back() {
		
	}

	async loadData(view: string) {
		this.userGroup = await UserRelationships.getUserRelationships(view);
		this.likesList.innerHTML = "";
		this.likesList.append(<LikesList items={this.userGroup} />)
	}

	// Life-cycle method that is called when the component is displayed
	protected override onDisplay() {
		console.info("The chats pointer", this.options.items);
	}
}