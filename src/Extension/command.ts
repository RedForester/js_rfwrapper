import { Wrapper } from "..";
import { IExtCommandCtx } from "./interface";
import { ICommandReply } from "./reply";

export interface ICommandOptions {
    id: string;
    name: string;
    description: string;
    showRules: ICommandShowRule[];
}

export interface ICommandShowRule {
    allNodes?: boolean;
    root?: boolean;
    selfType?: string;
    descendantOfType?: string;
}

export abstract class Command {
    /**
     * ID команды по которому можно ее вызвать
     * @type {String}
     * @public
     */
    public id!: string;

    /**
     * Название команды которое будет отображаться в РФ
     * @type {String}
     * @public
     */
    public name!: string;

    /**
     * Описание для команды
     * @type {String}
     * @public
     */
    public description?: string;

    /**
     * Условия при которых отображается команда
     * @type {any[]}
     * @public
     */
    public showRules!: ICommandShowRule[];

    constructor(options?: ICommandOptions) {
        if (!options) { return; }

        if (options.id) { this.id = options.id; }
        if (options.name) { this.name = options.name; }
        if (options.description) { this.description = options.description; }
        if (options.showRules) { this.showRules = options.showRules; }
    }

    /**
     * Выполняет команду
     * @param values {*[]}
     * @abstract
     * @public
     */
    public abstract async run(self: Wrapper, ctx: IExtCommandCtx): Promise<ICommandReply|null>;

    /**
     * Преобразует в JSON
     */
    public toJSON() {
        return {
            name: this.name,
            description: this.description,
            showRules: this.showRules,
            type: {
              action: this.id,
            },
        };
    }
}