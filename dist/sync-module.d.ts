import { BotModule, DatabaseEntry, BotMessageEvent } from "@akaiv/core";
import { RegistryManager } from "./registry-manager";
export declare class ExampleModule extends BotModule {
    private registryManager;
    private channelMap;
    constructor({ syncEntry }: {
        syncEntry: DatabaseEntry;
    });
    get RegistryManager(): RegistryManager;
    get Name(): string;
    get Description(): string;
    get Namespace(): string;
    protected loadModule(): Promise<void>;
    protected unloadModule(): Promise<void>;
    protected onChat(e: BotMessageEvent): Promise<void>;
}
