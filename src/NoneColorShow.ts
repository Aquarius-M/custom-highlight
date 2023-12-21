import {
    DocumentColorProvider,
    ProviderResult,
    ColorPresentation,
    ColorInformation,
} from "vscode";

class NoneColorShow implements DocumentColorProvider {
    provideDocumentColors(): ProviderResult<ColorInformation[]> {
        let colorArr: ColorInformation[] = [];
        return colorArr;
    }

    provideColorPresentations(): ProviderResult<ColorPresentation[]> {
        return [];
    }
}
export default NoneColorShow;