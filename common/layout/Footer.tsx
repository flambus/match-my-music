import { Datex } from "datex-core-legacy/datex.ts";
import { template } from "uix/html/template.ts";
import { Component } from "uix/components/Component.ts";

@template(function(this: Footer) {
	return (
        <div class="footer">
            <a class="fa-solid fa-music" href={"/"} style="text-decoration:none;color:white"/>
            <a class="fa-regular fa-heart" href={"/likes"} style="text-decoration:none;color:white"/>
            <a class="fa-brands fa-rocketchat" href={"/chats"} style="text-decoration:none;color:white"/>
        </div>
    )
})
export class Footer extends Component {}