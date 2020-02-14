"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ConnectCommand {
    constructor(registryManager) {
        this.registryManager = registryManager;
    }
    get CommandList() {
        return ['connect'];
    }
    get Usage() {
        return 'sync/connect <토큰 id>';
    }
    get Description() {
        return '해당 토큰을 생성한 채널의 채팅을 가져옵니다';
    }
    async onCommand(e, logger) {
        if (e.RawArgument.length < 1) {
            e.Channel.sendText(`사용법: ${this.Usage}`);
            return;
        }
        let id = e.RawArgument;
        if (!(await this.registryManager.hasToken(id))) {
            e.Channel.sendText(`토큰 ${id} 를 찾을 수 없습니다`);
            return;
        }
        let tokenInfo = (await this.registryManager.getTokenInfo(id));
        await this.registryManager.removeToken(id);
        await this.registryManager.setConnectedChannelId(tokenInfo.createdChannelId, e.Channel.IdentityId);
        e.Channel.sendText(`채널 [ ${tokenInfo.createdChannelClient} ] - ${tokenInfo.createdChannelName} ( ${tokenInfo.createdChannelId} ) 에 연결 되었습니다`);
    }
}
exports.ConnectCommand = ConnectCommand;
class DisconnectCommand {
    constructor(registryManager) {
        this.registryManager = registryManager;
    }
    get CommandList() {
        return ['disconnect'];
    }
    get Usage() {
        return 'sync/disconnect';
    }
    get Description() {
        return '채팅 연결 해제하기';
    }
    async onCommand(e, logger) {
        if (!(await this.registryManager.isConnected(e.Channel))) {
            e.Channel.sendText(`해당 채널은 아무 채널에도 연결되어있지 않습니다`);
            return;
        }
        let connectionInfo = (await this.registryManager.getConnectedChannel(e.Channel));
        await this.registryManager.removeChannelConnection(e.Channel);
        e.Channel.sendText(`채널 ${connectionInfo.targetChannelId} 의 연결을 끊었습니다`);
    }
}
exports.DisconnectCommand = DisconnectCommand;
class CreateCommand {
    constructor(registryManager) {
        this.registryManager = registryManager;
    }
    get CommandList() {
        return ['create'];
    }
    get Usage() {
        return 'sync/create';
    }
    get Description() {
        return '채널 연결을 위한 토큰 생성';
    }
    async onCommand(e, logger) {
        if (await this.registryManager.isConnected(e.Channel)) {
            e.Channel.sendText(`해당 채널은 이미 ${await this.registryManager.getConnectedChannel(e.Channel)} 에 연결되어 있습니다`);
            return;
        }
        let tokenInfo = await this.registryManager.createToken(e.Channel);
        e.Channel.sendText(`토큰 ${tokenInfo.tokenId} 가 생성되었습니다.\n - sync/connect ${tokenInfo.tokenId}\n\n이 토큰은 1분 뒤 제거됩니다`);
        setTimeout(() => {
            this.registryManager.removeToken(tokenInfo.tokenId);
        }, 60000);
    }
}
exports.CreateCommand = CreateCommand;
//# sourceMappingURL=module-command.js.map