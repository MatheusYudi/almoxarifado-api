// Utils
import { StringUtils } from "../../src/common/utils";

describe("StringUtils - unit tests", () => {
    describe("Method #firstUpperCase", () => {
        it("should transform first letter to upper case", () => {
            expect(StringUtils.firstUpperCase("teste")).toEqual("Teste");
            expect(StringUtils.firstUpperCase("tEsTe")).toEqual("Teste");
            expect(StringUtils.firstUpperCase("TESTE")).toEqual("Teste");
            expect(StringUtils.firstUpperCase("teste")).not.toEqual("teste");
            expect(StringUtils.firstUpperCase("TEsTe")).not.toEqual("TEsTe");

            expect(StringUtils.firstUpperCase("TESTE composto")).toEqual("Teste Composto");
        });
    });

    describe("Method #firstLowerCase", () => {
        it("should transform first letter to lower case", () => {
            expect(StringUtils.firstLowerCase("teste")).toEqual("teste");
            expect(StringUtils.firstLowerCase("TEsTe")).toEqual("tEsTe");
            expect(StringUtils.firstLowerCase("TESTE")).toEqual("tESTE");

            expect(StringUtils.firstLowerCase("TESTE Composto")).toEqual("tESTE composto");
        });
    });
});
