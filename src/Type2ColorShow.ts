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
import { EXTENSION_ENABLE } from "./constant";

class Type2ColorShow implements DocumentColorProvider {
    rgbToHex(rgb: number) {
        var hex = Number(rgb).toString(16);
        if (hex.length < 2) {
            hex = "0" + hex;
        }
        return hex;
    }

    hexToRgbNew(hex: string) {
        var arrBuff = new ArrayBuffer(4);
        var vw = new DataView(arrBuff);
        vw.setUint32(0, parseInt(hex, 16), false);
        var arrByte = new Uint8Array(arrBuff);

        return { r: arrByte[1], g: arrByte[2], b: arrByte[3], o: arrByte[0] };
    }

    provideDocumentColors(document: TextDocument): ProviderResult<ColorInformation[]> {
        let colorArr: ColorInformation[] = [];
        let isEnable = workspace.getConfiguration().get(EXTENSION_ENABLE);
        if (!isEnable) {
            return colorArr;
        }
        let sourceCode = document.getText();
        const sourceCodeArr = sourceCode.split('\n');
        let regex = /(0x[a-f0-9A-F]{8})/;
        for (let line = 0; line < sourceCodeArr.length; line++) {
            let match = sourceCodeArr[line].match(regex);
            while (match !== null && match.index !== undefined) {
                let range = new Range(
                    new Position(line, match.index),
                    new Position(line, match.index + match[1].length)
                );
                var rgbColor = this.hexToRgbNew(match[1]);
                sourceCodeArr[line] = sourceCodeArr[line].replace(match[1], (new Array(match[1].length)).fill('*').join(''));
                let colorCode = new ColorInformation(range, new Color(rgbColor.r / 255, rgbColor.g / 255, rgbColor.b / 255, rgbColor.o / 255));

                colorArr.push(colorCode);
                match = sourceCodeArr[line].match(regex);
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
        colorObj.alpha = Math.round(color.alpha * 255);
        let colorLabel = String(this.rgbToHex(colorObj.alpha)) + String(this.rgbToHex(colorObj.red)) + String(this.rgbToHex(colorObj.green)) + String(this.rgbToHex(colorObj.blue));

        return [new ColorPresentation('0x' + colorLabel.toLocaleUpperCase())];
    }
}
export default Type2ColorShow;
