"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@akaiv/core");
const module_command_1 = require("./module-command");
const registry_manager_1 = require("./registry-manager");
class SyncModule extends core_1.BotModule {
    constructor({ syncEntry }) {
        super();
        this.registryManager = new registry_manager_1.RegistryManager(syncEntry);
        this.CommandManager.addCommand(new module_command_1.ConnectCommand(this.registryManager));
        this.CommandManager.addCommand(new module_command_1.DisconnectCommand(this.registryManager));
        this.CommandManager.addCommand(new module_command_1.CreateCommand(this.registryManager));
        this.on('message', this.onChat.bind(this));
        this.channelMap = new Map();
    }
    get RegistryManager() {
        return this.registryManager;
    }
    get Name() {
        return 'Sync';
    }
    get Description() {
        return '채널간 채팅 동기화';
    }
    get Namespace() {
        return 'sync';
    }
    async loadModule() {
    }
    async unloadModule() {
    }
    async onChat(e) {
        if (!this.channelMap.has(e.Message.Channel.IdentityId)) {
            this.channelMap.set(e.Message.Channel.IdentityId, e.Message.Channel);
        }
        if (e.Message.Sender.IsClientUser) {
            return;
        }
        if (!(await this.registryManager.isConnected(e.Message.Channel))) {
            return;
        }
        let connectionInfo = (await this.registryManager.getConnectedChannel(e.Message.Channel));
        if (!this.channelMap.has(connectionInfo.targetChannelId)) {
            return;
        }
        let chan = this.channelMap.get(connectionInfo.targetChannelId);
        let msg = e.Message;
        let text = e.Message.Text;
        if (msg.AttachmentList.length > 0) {
            text += '\n';
        }
        else if (msg.Text.length < 1)
            return;
        for (let attachment of msg.AttachmentList) {
            text += ` - (${core_1.AttachmentType[attachment.Type]}): ${attachment.URL}\n`;
        }
        await chan.sendText(`[${e.Message.Channel.Client.ClientName}] ${e.Message.Sender.Name}: ${text}`);
    }
}
exports.SyncModule = SyncModule;
//# sourceMappingURL=sync-module.js.map