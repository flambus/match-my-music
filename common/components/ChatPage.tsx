import { type Chat } from "backend/chat.ts";
import { map } from "datex-core-legacy/functions.ts";
import { type Message } from 'backend/chat.ts';
import { Datex } from "datex-core-legacy/datex.ts";
import { Component } from 'uix/components/Component.ts';
import { template } from "uix/html/template.ts";
import type { Ref } from "datex-core-legacy/datex_all.ts";
import { Layout } from "common/components/Layout.tsx";

@template(function(this: ChatPage) {
	const members = this.properties.chat.$.members;
	const other = members.val?.find(e => e !== Datex.Runtime.endpoint)!;
	return <Layout>
		<a href="/" class="header">
			<img src={`https://api.dicebear.com/7.x/identicon/svg?seed=${other.toString()}`}/>
			<h1>{other.toString()}</h1>
			<span>{other.alias ?? "No Alias"}</span>
		</a>
		<div class="chat" id="chat">
			{
				map(this.properties.chat.messages, (message) => 
				message && 
					<div 
						class="message"
						data-sender={message.origin === Datex.Runtime.endpoint}>
						{message.content}
					</div>
				)
			}
		</div>
		<div class="input">
			<i class="fas fa-camera"/>
			<i class="far fa-laugh-beam"/>
			<input id="message" placeholder="Text message" type="text"/>
			<i onclick={()=>this.sendMessage()} id="send" class="fa fa-arrow-up"/>
		</div>
	</Layout>
})
export class ChatPage extends Component<{chat: Ref<Chat>}> {
	/* references to the DOM elements */
	@id send!: HTMLElement;
	@id message!: HTMLInputElement;
	@id chat!: HTMLDivElement;

	sendMessage() {
		if (!this.canSend)
			return;
		const message: Message = {
			content: this.message.value.trim(),
			timestamp: Datex.Time.now(),
			origin: Datex.Runtime.endpoint
		};

		this.properties.chat.messages.push(message);
		this.message.value = '';
		this.message.dispatchEvent(new Event("input"));
	}

	get canSend() {
		return this.message.value.trim().length > 0;
	}

	// Life-cycle method that is called when the component is displayed
	protected override onDisplay(): void | Promise<void> {
		console.info("The chat pointer", this.properties.chat);
		this.message.addEventListener("input", () => {
			this.send.classList.toggle("active", this.canSend);
		});
		this.message.addEventListener("keydown", (e) => {
			e.key === "Enter" && this.sendMessage()
		});

		this.properties.chat.$.messages.observe(()=>this.scrollDown());
		setTimeout(()=>this.scrollDown(), 400);
	}
	
	private scrollDown() {
		this.chat.scroll({ top: this.chat.scrollHeight, behavior: 'smooth' });
	}
}