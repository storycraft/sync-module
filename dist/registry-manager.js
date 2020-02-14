"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RegistryManager {
    constructor(syncEntry) {
        this.syncEntry = syncEntry;
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
    async isConnected(chan) {
        return this.isConnectedChannelId(chan.IdentityId);
    }
    async isConnectedChannelId(chanId) {
        return await (await this.getRegistryEntry()).has(chanId);
    }
    async setConnectedChannel(from, to) {
        return (await this.getRegistryEntry()).set(from.IdentityId, { targetChannelId: to.IdentityId });
    }
    async setConnectedChannelId(fromId, toId) {
        return (await this.getRegistryEntry()).set(fromId, { targetChannelId: toId });
    }
    async getConnectedChannel(chan) {
        return this.getConnectedChannelId(chan.IdentityId);
    }
    async getConnectedChannelId(chanId) {
        return await (await this.getRegistryEntry()).get(chanId);
    }
    async removeChannelConnection(from) {
        return (await this.getRegistryEntry()).set(from.IdentityId, null);
    }
    async hasToken(tokenId) {
        return await (await this.getTokenEntry()).has(tokenId);
    }
    async getTokenInfo(tokenId) {
        if (!this.hasToken(tokenId))
            return null;
        return await (await this.getTokenEntry()).get(tokenId);
    }
    async createToken(createChan) {
        let id;
        while (await this.hasToken(id = Math.random().toString(36).substr(2, 9)))
            ;
        let tokenInfo = {
            'tokenId': id,
            'createdAt': Date.now(),
            'createdChannelId': createChan.IdentityId,
            'createdChannelName': createChan.Name,
            'createdChannelClient': createChan.Client.ClientName
        };
        await this.setToken(id, tokenInfo);
        return tokenInfo;
    }
    async removeToken(tokenId) {
        await this.setToken(tokenId, null);
    }
    async setToken(tokenId, tokenInfo) {
        await (await this.getTokenEntry()).set(tokenId, tokenInfo);
    }
}
exports.RegistryManager = RegistryManager;
//# sourceMappingURL=registry-manager.js.map