import Preconditions from "../../Preconditions.js";
import CharSequences from "../../CharSequences.js";

export default function spreadsheetRangeParse(text, componentParser, rangeFactory) {
    Preconditions.requireNonEmptyText(text, "text");
    Preconditions.requireFunction(componentParser, "componentParser");
    Preconditions.requireFunction(rangeFactory, "rangeFactory");

    var range;
    const tokens = text.split(":");

    switch(tokens.length) {
        case 1:
            const component = componentParser(tokens[0]);
            range = rangeFactory(component, component);
            break;
        case 2:
            const beginText = tokens[0];
            if(!beginText){
                throw new Error("Missing begin");
            }
            const beginComponent = componentParser(beginText);
            const endText = tokens[1];
            if(!endText){
                throw new Error("Missing end");
            }

            let endComponent;
            try {
                endComponent = componentParser(endText);
            } catch(e) {
                const message = e.message;
                if(message.startsWith("Invalid character ")){
                    const at = message.indexOf(" at ");
                    const pos = parseInt(message.substring(at + 4));
                    throw new Error(message.substring(0, at + 4) + (1 + pos + text.indexOf(":")));
                }else {
                    throw e;
                }
            }

            range = rangeFactory(
                beginComponent,
                endComponent
            );
            break;
        default:
            throw new Error("Expected 1 or 2 tokens got " + CharSequences.quoteAndEscape(text));
    }

    return range;
}
