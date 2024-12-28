import { template } from "uix/html/template.ts";
import { Component } from "uix/components/Component.ts";
import { frontendRouter } from "uix/routing/frontend-routing.ts";

@template(function({ title, backUrl }) {
    return (
        <div class="container">
            <div class="selector-container">
                <h4>{title}</h4>
                <div class="option-container">
                    {this.allOptions.map(option =>
                        <div 
                            class={`option ${option.isSelected ? 'selected' : ''}`} 
                            onclick={() => this.selectOption(option)}>
                            {option.option}
                        </div>
                    )}
                </div>
                <div class="button-container">
                    {backUrl && <button class="BackButton" type="button" onclick={()=>{frontendRouter.navigateTo(backUrl)}}>Back</button>}
                    <button class="NextButton" onclick={() => this.onNext()}>Next</button>
                </div>
            </div>
        </div>
    );
})
export class BubbleSelector extends Component<{
    title: string;
    bubbleOptions: Array<string>;
    url: string;
    onSelectionChange?: (selectedOptions: string[]) => void;
    backUrl?: string;
}> {
    @property allOptions: Array<{ option: string; isSelected: boolean }> = this.properties.bubbleOptions.map(option => ({
        option,
        isSelected: false
    }));

    private selectOption(option: { option: string; isSelected: boolean }) {
        option.isSelected = !option.isSelected;
    }

    private onNext() {
        const selectedOptions = this.allOptions
            .filter(option => option.isSelected)  
            .map(option => option.option); 
        
        if (this.properties.onSelectionChange) {
            this.properties.onSelectionChange(selectedOptions);
        }

        frontendRouter.navigateTo(this.properties.url);
    }
}

