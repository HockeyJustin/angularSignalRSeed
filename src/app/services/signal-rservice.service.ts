import { Injectable, EventEmitter } from '@angular/core';
import { ChatMessage } from '../models/ChatMessage';
import { send } from 'q';
import { getLocaleDateFormat } from '@angular/common';

declare var $: any;

export enum ConnectionState {
  Disconnected = 0,
  Connecting = 1,
  Connected = 2,
  Reconnecting = 3,
  Reconnected = 4,
  SlowConnection = 5
}

export class SignalRConnectionState {

  public OldState: ConnectionState;
  public NewState: ConnectionState;
  public signalRStateChanged: EventEmitter<SignalRConnectionState>;

  constructor() {
    this.signalRStateChanged = new EventEmitter<SignalRConnectionState>();
  }

  public IsCompletelyNew(): boolean {
    return this.OldState == ConnectionState.Disconnected && this.NewState == ConnectionState.Disconnected;
  }


  public UpdateConnectionState(newState: ConnectionState) {

    var prevState = this.NewState;

    this.NewState = newState;
    this.OldState = prevState;

    if (this.OldState != this.NewState) {
      this.signalRStateChanged.emit(this);
    }
  }
}


@Injectable({
  providedIn: 'root'
})
export class SignalRServiceService {

  public signalRState: SignalRConnectionState;
  public connectionExists: Boolean;

  private proxy: any;
  private proxyName: string = 'chatHub';
  private connection: any;
  public connectionId: string;

  // Events Out
  public messageReceived: EventEmitter<ChatMessage>;

  constructor() {

    this.signalRState = new SignalRConnectionState();
    this.messageReceived = new EventEmitter<ChatMessage>();

    this.connection = $.hubConnection('http://localhost:59001/signalr');
    //this.connection = $.hubConnection('../signalr');
    this.proxy = this.connection.createHubProxy(this.proxyName);

    this.registerOnServerEvents();

    this.startConnection();

  }

  // --------------------------------------------- UI -> Server

  public sendChatMessage(message: ChatMessage) {
    // Send being the method name in the Hub
    var msg = this.connectionId + message.Message
    this.proxy.invoke('SendFromAngular', this.connectionId, message);
  }

  // --------------------------------------------- Server -> UI

  private registerOnServerEvents(): void {

    this.proxy.on('serverMessageBackToClientOnly', (data: ChatMessage) => {
      console.log('received in SignalRService: ' + JSON.stringify(data));
      this.messageReceived.emit(data);
    });
  }


  // ------------------------------------------- SignalR Connection

  public tryRestartConnection(): void {
    var me = this;

    window.setTimeout(function () {
      me.startConnection();
    }, 10000);
  }

  public startConnection(): void {

    var me = this;

    this.connection.start()
      .done((data: any) => {
        console.log('Now connected' + data.transport.name + ', connection ID= ' + data.id);
        this.connectionId = data.id;
        this.connectionExists = true;
        this.signalRState.UpdateConnectionState(ConnectionState.Connected);
      
        this.sendChatMessage(new ChatMessage("Yatta!", new Date().toString()));
      }).fail((error: any) => {
        console.log('Could not connect ' + error);
        me.signalRState.UpdateConnectionState(ConnectionState.Disconnected);
        me.tryRestartConnection();
      });

    this.connection.connectionSlow(function () {
      //console.log('connectionSlow');
      me.signalRState.UpdateConnectionState(ConnectionState.SlowConnection);
    });

    this.connection.reconnecting(() => {
      //console.log('reconnecting');
      me.signalRState.UpdateConnectionState(ConnectionState.Reconnecting);
    });

    this.connection.reconnected(() => {
      //console.log('reconnected');
      me.signalRState.UpdateConnectionState(ConnectionState.Reconnected);
    });

    this.connection.disconnected(function () {
      me.signalRState.UpdateConnectionState(ConnectionState.Disconnected);
      me.tryRestartConnection();
    });

  }
}
