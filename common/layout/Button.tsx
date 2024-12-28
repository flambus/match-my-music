import { Datex } from "datex-core-legacy/datex.ts";
import { template } from "uix/html/template.ts";
import { Component } from "uix/components/Component.ts";

@template(function(this: Button) {
	return (
        <>
            <button onclick={()=> this.properties.handleClick()}>{this.properties.label}</button>
        </>
    )
})
    export class Button extends Component<{handleClick: () => void, label: string }> {
}