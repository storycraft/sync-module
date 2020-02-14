import { CommandInfo, BotCommandEvent, ModuleLogger } from "@akaiv/core";
import { RegistryManager } from "./registry-manager";
export declare class ConnectCommand implements CommandInfo {
    private registryManager;
    constructor(registryManager: RegistryManager);
    get CommandList(): string[];
    get Usage(): string;
    get Description(): string;
    onCommand(e: BotCommandEvent, logger: ModuleLogger): Promise<void>;
}
export declare class DisconnectCommand implements CommandInfo {
    private registryManager;
    constructor(registryManager: RegistryManager);
    get CommandList(): string[];
    get Usage(): string;
    get Description(): string;
    onCommand(e: BotCommandEvent, logger: ModuleLogger): Promise<void>;
}
export declare class CreateCommand implements CommandInfo {
    private registryManager;
    constructor(registryManager: RegistryManager);
    get CommandList(): string[];
    get Usage(): string;
    get Description(): string;
    onCommand(e: BotCommandEvent, logger: ModuleLogger): Promise<void>;
}
