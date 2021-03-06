import { IClass, Module, module} from '../../../../../index';
import {Bootstrap} from "../../../src/bootstrap";
import {NestedProvider} from "./src/nestedProvider";
import {DbManager} from "../db/src/dbManager";
import {IModuleParams} from "../../../../../lib/modules/interfaces/IModule";

interface IOptions {
    delay: number,
    testModule: string,
    id?: string
}


@module()
export class NestedModule extends Module<IOptions> {

    public static for(options: IOptions): IModuleParams {
        return {type: NestedModule, options}
    }

    public get exports() {
        return [{id: this.moduleOptions.id || "nestedProvider", type: NestedProvider}, {
            id: "dbManagerNested",
            type: "dbMock2DbManager"
        }];

    }

    public get fileExports(): IClass[] {
        return [NestedProvider]
    }
}

