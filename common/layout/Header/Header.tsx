import { Datex } from "datex-core-legacy/datex.ts";
import { template } from "uix/html/template.ts";
import { Component } from "uix/components/Component.ts";

@template(function(this: Header) {
    const handleClick = this.properties.onClickFunc;
    const title = this.properties.title;
	const icon = this.properties.iconLeft;
	return (
        <div class="header">
			<i onclick={()=>handleClick()} class={icon}/>
			<h1 onclick={()=>
				navigator.clipboard.writeText(Datex.Runtime.endpoint.toString())
			}>{title}</h1>
			<img src={"../../icons/user_image_default.png"}/>
		</div>
    )
})
export class Header extends Component<{onClickFunc: () => void, title: string, iconLeft: string}> {}