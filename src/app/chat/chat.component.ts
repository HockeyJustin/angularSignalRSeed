import { Component, OnInit, NgZone } from '@angular/core';
import { SignalRServiceService, SignalRConnectionState, ConnectionState } from '../services/signal-rservice.service';
import { ChatMessage } from '../models/ChatMessage';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  public currentMessage: ChatMessage;
	public allMessages: ChatMessage[];
	public canSendMessage: Boolean;

	constructor(private _signalRService: SignalRServiceService, private _ngZone: NgZone) {
		this.subscribeToEvents();
		this.canSendMessage = _signalRService.connectionExists;
		this.currentMessage = new ChatMessage('', null);
		this.allMessages = new Array<ChatMessage>();
	}

	public sendMessage() {
		if (this.canSendMessage) {
			this.currentMessage.Sent = new Date();
			this._signalRService.sendChatMessage(this.currentMessage);
		}
	}

	private subscribeToEvents(): void {
		this._signalRService.signalRState.signalRStateChanged.subscribe((state: SignalRConnectionState) => {
			this._ngZone.run(() => {
				this.canSendMessage = state.NewState == ConnectionState.Connected;
			});			
		});

		this._signalRService.messageReceived.subscribe((message: ChatMessage) => {
			this._ngZone.run(() => {
				this.currentMessage = new ChatMessage('', null);
				this.allMessages.push(new ChatMessage(message.Message, message.Sent.toString()));
			});
		});
	}

  ngOnInit() {
  }

}
