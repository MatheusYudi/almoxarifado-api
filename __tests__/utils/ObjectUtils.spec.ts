// Utils
import { ObjectUtils } from "../../src/common/utils";

describe("ObjectUtils - unit tests", () => {
    describe("Method #isObject", () => {
        it("should  if provided value is an object", () => {
            expect(ObjectUtils.isObject({})).toEqual(true);
            expect(ObjectUtils.isObject([])).toEqual(false);
            expect(ObjectUtils.isObject(true)).toEqual(false);
            expect(ObjectUtils.isObject("teste")).toEqual(false);
            expect(ObjectUtils.isObject(undefined)).toEqual(false);
            expect(ObjectUtils.isObject(null)).toEqual(false);
            expect(ObjectUtils.isObject(new Date())).toEqual(false);
        });
    });

    describe("Method #clearData", () => {
        it("should clear data correctly", () => {
            const data = {
                chave1: "teste",
                chave2: "teste",
                chave3: "teste",
                chave4: 0,
                chave5: "",
                chave6: {
                    teste1: "teste",
                    teste2: "teste",
                    teste3: ""
                },
                chave7: "teste"
            };

            const response = ObjectUtils.clearData(data);
            expect(response).toEqual(
                expect.objectContaining({
                    chave7: "teste",
                    chave3: "teste",
                    chave2: "teste",
                    chave1: "teste",
                    chave4: 0
                })
            );
        });
    });
});
