import { DatabaseEntry, Channel } from "@akaiv/core";
export declare class RegistryManager {
    private syncEntry;
    private registryEntry;
    private tokenEntry;
    constructor(syncEntry: DatabaseEntry);
    get SyncEntry(): DatabaseEntry<string, import("@akaiv/core").DatabaseValue>;
    getRegistryEntry(): Promise<DatabaseEntry<string, import("@akaiv/core").DatabaseValue>>;
    getTokenEntry(): Promise<DatabaseEntry<string, import("@akaiv/core").DatabaseValue>>;
    isConnected(chan: Channel): Promise<boolean>;
    isConnectedChannelId(chanId: string): Promise<boolean>;
    setConnectedChannel(from: Channel, to: Channel): Promise<boolean>;
    setConnectedChannelId(fromId: string, toId: string): Promise<boolean>;
    getConnectedChannel(chan: Channel): Promise<ConnectionInfo>;
    getConnectedChannelId(chanId: string): Promise<ConnectionInfo>;
    removeChannelConnection(from: Channel): Promise<boolean>;
    hasToken(tokenId: string): Promise<boolean>;
    getTokenInfo(tokenId: string): Promise<TokenInfo | null>;
    createToken(createChan: Channel): Promise<TokenInfo>;
    removeToken(tokenId: string): Promise<void>;
    protected setToken(tokenId: string, tokenInfo: TokenInfo | null): Promise<void>;
}
export interface ConnectionInfo {
    targetChannelId: string;
}
export interface TokenInfo {
    tokenId: string;
    createdChannelId: string;
    createdChannelName: string;
    createdChannelClient: string;
    createdAt: number;
}
