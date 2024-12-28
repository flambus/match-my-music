import { type Chat } from "backend/chat.ts";
import { map } from "datex-core-legacy/functions.ts";
import { Datex } from "datex-core-legacy/datex.ts";
import { template } from "uix/html/template.ts";
import { Component } from "uix/components/Component.ts";
import { Layout } from "./Layout.tsx";
import { Header } from "common/layout/Header/Header.tsx";
import { Footer } from "common/layout/Footer.tsx";

@template(function(this: Overview) {
	const chats = this.properties.chats;
	return <Layout>
		<Header onClickFunc={this.write} title={Datex.Runtime.endpoint.toString()} iconLeft={"write fa-solid fa-pen-to-square"} />
			<div class="main">
			{
				map(chats, (chat) => {
					const other = chat.members?.find(e => e !== Datex.Runtime.endpoint)!;
					const latestMessage = chat.messages.at(-1);
					return <a class="chat" href={`/${other.toString()}`}>
						<img src={`https://api.dicebear.com/7.x/identicon/svg?seed=${other.toString()}`}/>
						<div>
							<h1>{other.toString()}</h1>
							<span data-empty={!latestMessage}>
								{latestMessage ?
									<>{latestMessage.origin !== other ? <span>Du:</span> : undefined} {latestMessage!.content}</> : 
									'Keine Nachrichten...'
								}
							</span>
						</div>
					</a>
				})
			}
			
			{
				chats.length === 0 ? <h1 class="empty">Pretty empty in here...</h1> : undefined
			}
			</div>
		<Footer />
	</Layout>
})
export class Overview extends Component<{chats: Chat[]}> {
	private write() {
		const endpointId = prompt("Write a message to", "");
		if (endpointId)
			globalThis.location.href = `/${endpointId}`;
	}

	// Life-cycle method that is called when the component is displayed
	protected override onDisplay() {
		console.info("The chats pointer", this.options.chats);
	}
}