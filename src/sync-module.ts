import { BotModule, DatabaseEntry, BotMessageEvent, ClientUser, Channel, AttachmentType } from "@akaiv/core";
import { ConnectCommand, DisconnectCommand, CreateCommand } from "./module-command";
import { RegistryManager } from "./registry-manager";

/*
 * Created on Sat Oct 26 2019
 *
 * Copyright (c) storycraft. Licensed under the MIT Licence.
 */

export class ExampleModule extends BotModule {

    private registryManager: RegistryManager;

    // UGLY
    private channelMap: Map<string, Channel>;

    constructor({ syncEntry }: {
        syncEntry: DatabaseEntry
    }) {
        super();

        this.registryManager = new RegistryManager(syncEntry);

        this.CommandManager.addCommand(new ConnectCommand(this.registryManager));
        this.CommandManager.addCommand(new DisconnectCommand(this.registryManager));
        this.CommandManager.addCommand(new CreateCommand(this.registryManager));

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

    protected async loadModule(): Promise<void> {

    }

    protected async unloadModule(): Promise<void> {

    }

    protected async onChat(e: BotMessageEvent) {
        if (!this.channelMap.has(e.Message.Channel.IdentityId)) {
            this.channelMap.set(e.Message.Channel.IdentityId, e.Message.Channel);
        }
        
        if (e.Message.Sender instanceof ClientUser) {
            return;
        }

        if (!(await this.registryManager.isConnected(e.Message.Channel))) {
            return;
        }

        let connectionInfo = (await this.registryManager.getConnectedChannel(e.Message.Channel))!;

        if (!this.channelMap.has(connectionInfo.targetChannelId)) {
            return;
        }

        let chan = this.channelMap.get(connectionInfo.targetChannelId)!;
        let msg = e.Message;

        let text = e.Message.Text;

        if (msg.AttachmentList.length > 0) {
            if (msg.Text.length < 1) return;
            text += '\n';
        }

        for (let attachment of msg.AttachmentList) {
            text += ` - (${AttachmentType[attachment.Type]}): ${attachment.URL}\n`;
        }

        await chan.sendText(`[${e.Message.Channel.Client.ClientName}] ${e.Message.Sender.Name}: ${text}`);
    }

}