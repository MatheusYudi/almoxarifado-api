// Libs
import "module-alias/register";
import { addAliases } from "module-alias";

addAliases({
    "@common": `${__dirname}/common`,
    "@config": `${__dirname}/config`,
    "@decorators": `${__dirname}/decorators`,
    "@library": `${__dirname}/library`,
    "@middlewares": `${__dirname}/middlewares`,
    "@routes": `${__dirname}/routes`
});
