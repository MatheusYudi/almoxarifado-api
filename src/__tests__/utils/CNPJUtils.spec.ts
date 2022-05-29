// Utils
import { CNPJUtils } from "../../common/utils";

describe("CNPJUtils - unit tests", () => {
    describe("#isValid", () => {
        test("Valor undefined", () => {
            expect(CNPJUtils.isValid(undefined as any)).toEqual(false);
        });

        test("Valor nulo", () => {
            expect(CNPJUtils.isValid(null as any)).toEqual(false);
        });

        test("Valor vazio", () => {
            expect(CNPJUtils.isValid("")).toEqual(false);
            expect(CNPJUtils.isValid(" ")).toEqual(false);
        });

        test("Valor repetido", () => {
            Array.from(Array(10).keys()).forEach((value: number) => {
                expect(CNPJUtils.isValid(value.toString().repeat(14))).toEqual(false);
            });
        });

        test("Valor inválido", () => {
            ["0", "0123456789", "012345678912", "invalid_cnpj", "83390854000151"].forEach((value: string) => {
                expect(CNPJUtils.isValid(value)).toEqual(false);
            });
        });

        test("Valor válido", () => {
            ["14.454.373/0001-47", "83390854000159"].forEach((value: string) => {
                expect(CNPJUtils.isValid(value)).toEqual(true);
            });
        });
    });
});
