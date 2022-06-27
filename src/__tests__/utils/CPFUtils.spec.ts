// Utils
import { CPFUtils } from "../../common/utils";

describe("CPFUtils - unit tests", () => {
    describe("#isValid", () => {
        test("Valor undefined", () => {
            expect(CPFUtils.isValid(undefined as any)).toEqual(false);
        });

        test("Valor nulo", () => {
            expect(CPFUtils.isValid(null as any)).toEqual(false);
        });

        test("Valor vazio", () => {
            expect(CPFUtils.isValid("")).toEqual(false);
            expect(CPFUtils.isValid(" ")).toEqual(false);
        });

        test("Valor repetido", () => {
            Array.from(Array(10).keys()).forEach((value: number) => {
                expect(CPFUtils.isValid(value.toString().repeat(11))).toEqual(false);
            });
        });

        test("Valor inválido", () => {
            ["0", "0123456789", "012345678912", "invalid_cpf", "99999999999", "999.999.999-99"].forEach((value: string) => {
                expect(CPFUtils.isValid(value)).toEqual(false);
            });
        });

        test("Valor válido", () => {
            ["095.311.830-40", "62025984090"].forEach((value: string) => {
                expect(CPFUtils.isValid(value)).toEqual(true);
            });
        });
    });
});
