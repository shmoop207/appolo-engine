import {IPipelineContext} from "../interfaces/IPipeline";
import {Injector, IDefinition} from "@appolo/inject";
import    http = require('http');

export class PipelineContext<T = any> {

    private readonly _isArgument: boolean

    constructor(private _context: IPipelineContext, private _index: number, private _metaData: any, private _options: any) {
        this._isArgument = !isNaN(_index)
    }

    public get metaData(): T {
        return this._metaData;
    }

    public set metaData(value: T) {
        this._metaData = value;
    }

    public get options(): any {
        return this._options;
    }

    public get index(): number {
        return this._index || 0;
    }

    public get arguments(): IArguments {
        return this._context.args;
    }

    public get instance(): any {
        return this._context.instance;
    }

    public originFn(): Function {
        return this._context.instance[this._context.action]["__PIPELINE__"]
    }

    public get type(): any {
        return this._context.type;
    }

    public get action(): string {
        return this._context.action;
    }

    public get argumentsTypes(): any[] {
        return this._context.argsTypes || [];
    }

    public get isArgument(): boolean {
        return this._isArgument;
    }

    public setArgumentAt<T>(index: number, value: T) {
        this.arguments[index] = value;
    }

    public getArgumentAt<T>(index: number): T {
        return this.arguments[index]
    }

    public getArgumentByType<T>(ctor: { new(...args: any[]): T }): T {
        return Array.from(this.arguments).find(item => item instanceof ctor)
    }

    public getRequest<T extends http.IncomingMessage>(): T {
        let result = this.getArgumentByType(http.IncomingMessage);
        return result as T
    }

    public getResponse<T extends http.ServerResponse>(): T {
        let result = this.getArgumentByType(http.ServerResponse);
        return result as T

    }

    public get value(): any {
        if (this.isArgument) {
            return this.arguments[this._index];
        }

        return this.arguments[0];
    }

    public get values(): { index: number, value: any, type: any }[] {
        if (this.isArgument) {
            return [{
                index: this._index,
                value: this.getArgumentAt(this._index),
                type: this.argumentsTypes[this._index]
            }]
        }

        return Array.from(this.arguments).map((value, index) => ({index, value, type: this.argumentsTypes[index]}))
    }

    public get injector(): Injector {
        return this._context.injector;
    }

    public get definition(): IDefinition {
        return this._context.definition;
    }
}
