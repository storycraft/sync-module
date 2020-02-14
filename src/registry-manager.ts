import { DatabaseEntry, Channel } from "@akaiv/core";

/*
 * Created on Fri Feb 14 2020
 *
 * Copyright (c) storycraft. Licensed under the MIT Licence.
 */

export class RegistryManager {

    private registryEntry: DatabaseEntry | null;
    private tokenEntry: DatabaseEntry | null;

    constructor(private syncEntry: DatabaseEntry) {
        this.registryEntry = null;
        this.tokenEntry = null;
    }

    get SyncEntry() {
        return this.syncEntry;
    }

    async getRegistryEntry() {
        if (this.registryEntry)
            return this.registryEntry;

        return (this.registryEntry = (await this.syncEntry.getEntry('registry')));
    }

    async getTokenEntry() {
        if (this.tokenEntry)
            return this.tokenEntry;

        return (this.tokenEntry = (await this.syncEntry.getEntry('tokens')));
    }

    async isConnected(chan: Channel): Promise<boolean> {
        return this.isConnectedChannelId(chan.IdentityId);
    }

    async isConnectedChannelId(chanId: string): Promise<boolean> {
        return await (await this.getRegistryEntry()).has(chanId);
    }

    async setConnectedChannel(from: Channel, to: Channel) {
        return (await this.getRegistryEntry()).set(from.IdentityId, { targetChannelId: to.IdentityId } as ConnectionInfo);
    }

    async setConnectedChannelId(fromId: string, toId: string) {
        return (await this.getRegistryEntry()).set(fromId, { targetChannelId: toId } as ConnectionInfo);
    }

    async getConnectedChannel(chan: Channel): Promise<ConnectionInfo> {
        return this.getConnectedChannelId(chan.IdentityId);
    }

    async getConnectedChannelId(chanId: string): Promise<ConnectionInfo> {
        return await (await this.getRegistryEntry()).get(chanId) as ConnectionInfo;
    }
    
    async removeChannelConnection(from: Channel) {
        return (await this.getRegistryEntry()).set(from.IdentityId, null);
    }

    async hasToken(tokenId: string): Promise<boolean> {
        return await (await this.getTokenEntry()).has(tokenId);
    }

    async getTokenInfo(tokenId: string): Promise<TokenInfo | null> {
        if (!this.hasToken(tokenId)) return null;

        return await (await this.getTokenEntry()).get(tokenId) as TokenInfo;
    }

    async createToken(createChan: Channel): Promise<TokenInfo> {
        let id: string;
        
        while (await this.hasToken(id = Math.random().toString(36).substr(2, 9)));

        let tokenInfo = {
            'tokenId': id,
            'createdAt': Date.now(),
            'createdChannelId': createChan.IdentityId,
            'createdChannelName': createChan.Name,
            'createdChannelClient': createChan.Client.ClientName
        } as TokenInfo;

        await this.setToken(id, tokenInfo);

        return tokenInfo;
    }

    async removeToken(tokenId: string) {
        await this.setToken(tokenId, null);
    }

    protected async setToken(tokenId: string, tokenInfo: TokenInfo | null): Promise<void> {
        await (await this.getTokenEntry()).set(tokenId, tokenInfo);
    }

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