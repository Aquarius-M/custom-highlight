import {
    DocumentColorProvider,
    TextDocument,
    ProviderResult,
    Color,
    ColorPresentation,
    ColorInformation,
    Range,
    Position,
    workspace
} from "vscode";
import { EXTENSION_ENABLE } from "../constant";



class Type6ColorShow implements DocumentColorProvider {

    provideDocumentColors(document: TextDocument): ProviderResult<ColorInformation[]> {
        let colorArr: ColorInformation[] = [];
        let isEnable = workspace.getConfiguration().get(EXTENSION_ENABLE);
        if (!isEnable) {
            return colorArr;
        }
        let sourceCode = document.getText();
        const sourceCodeArr = sourceCode.split('\n');
        const regex = /rgba\(\s*(\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3}),\s*(\d?\.?\d+)\)/gi;
        for (let line = 0; line < sourceCodeArr.length; line++) {
            // let match = sourceCodeArr[line].match(regex);
            let match = regex.exec(sourceCodeArr[line]);
            while (match !== null) {
                const [matchedColor, red, green, blue, alpha] = match;
                let range = new Range(
                    new Position(line, match.index + (match[0].length - matchedColor.length)),
                    new Position(line, regex.lastIndex)
                );
                let colorCode = new ColorInformation(range, new Color(parseInt(red) / 255, parseInt(green) / 255, parseInt(blue) / 255, parseFloat(alpha)));


                //添加前置颜色
                colorArr.push(colorCode);

                match = regex.exec(sourceCodeArr[line]);
            }
        }
        return colorArr;
    }

    provideColorPresentations(color: Color): ProviderResult<ColorPresentation[]> {
        let colorObj = {
            red: 0,
            green: 0,
            blue: 0,
            alpha: 0,
        };
        colorObj.red = color.red * 255;
        colorObj.green = color.green * 255;
        colorObj.blue = color.blue * 255;
        colorObj.alpha = color.alpha;
        let colorLabel = `${colorObj.red}, ${colorObj.green}, ${colorObj.blue}, ${colorObj.alpha}`;

        return [new ColorPresentation(`RGBA(${colorLabel.toLocaleUpperCase()})`)];
    }
}
export default Type6ColorShow;
