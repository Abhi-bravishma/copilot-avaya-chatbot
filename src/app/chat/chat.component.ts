import {
  Component,
  ElementRef,
  HostListener,
  Input,
  SecurityContext,
  ViewChild,
} from '@angular/core';
import { trigger, style, transition, animate } from '@angular/animations';

import { Subject } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { AdaptiveCard, HostConfig } from 'adaptivecards';
import { Socket } from 'ngx-socket-io';

import {
  Message,
  MessageType,
  FileData,
  LocationData,
  UserType,
  ActionType,
} from '../types/message';

// type User = 'user' | 'bot';

// interface IMessage {
//   role: User;
//   msgText: any;
//   image: any;
//   type: 'text' | 'image' | any;
// }

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  preserveWhitespaces: true,
  animations: [
    trigger('popupAnimation', [
      transition(':enter', [
        style({ transform: 'scale(0.5)', opacity: 0 }),
        animate(
          '0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55)',
          style({ transform: 'scale(1)', opacity: 1 })
        ),
      ]),
      transition(':leave', [
        animate(
          '0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55)',
          style({ transform: 'scale(0.5)', opacity: 0 })
        ),
      ]),
    ]),
  ],
})
export class ChatComponent {
  @HostListener('document:mousemove')
  resetInactivityTimer() {
    clearTimeout(this.inactivityTimer);

    this.startInactivityTimer();
  }

  @HostListener('document:click')
  resetInactivityTimerr() {
    clearTimeout(this.inactivityTimer);
    this.isUserInactive = false;
    this.startInactivityTimer();
  }
  @HostListener('document:keydown', ['$event'])
  onKeydown(event: any) {
    this.resetInactivitytTimer();
  }

  resetInactivitytTimer() {
    clearTimeout(this.inactivityTimer);
    this.isUserInactive = false;
    this.startInactivityTimer();
  }

  [x: string]: any;
  private newMessage = new Subject<void>();

  @ViewChild('messageInput') messageInputText!: ElementRef<HTMLInputElement>;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  @ViewChild('carouselContainer') carouselContainer!: ElementRef;

  @ViewChild('botprofile')
  botprofile!: ElementRef<any>;
  @ViewChild('renderedCard')
  templateData!: ElementRef<any>;

  @ViewChild('messageContainer') messageContainer!: ElementRef;
  @ViewChild('suggestedActionsContainer') actionsContainer!: ElementRef;

  userImages = ['./assets/user.png', './assets/chatbot.png'];
  getUserImage() {
    return this.userImages;
  }

  inputSize: number = 30;
  showChatbot: boolean = false;
  isTyping: boolean = false;
  popUpOpenClose: boolean = false;
  popUpOpenopen: boolean = true;

  popUp = false;
  image: File | null = null;
  fileName: string | undefined;
  connectToAgentUrl: any;
  userImage: any;
  chatList: any = [];
  chatListT0Agent: any = [];
  title = 'copilot';
  ws!: WebSocket;
  agentWebSocket!: WebSocket;
  message: string = '';
  socketUrl: any;
  conversionDetails: any;
  inactivityTimer: any;
  isUserInactive = false;
  rating: any;
  count: number = 0;
  hasSubmittedRating = false;
  chatMessages: Message[] = [];
  sender: string = 'kamlesh';
  typeUser = UserType.Customer;
  typeAgent = UserType.Agent;
  typeSystem = UserType.System;
  messsFile = MessageType.File;
  messageType: typeof MessageType = MessageType;
  actionType: typeof ActionType = ActionType;

  messageTypeText: MessageType.Text | undefined;
  messageTypeImage: MessageType.Image | undefined;
  messageTypeAudio: MessageType.Audio | undefined;
  messageTypeVideo: MessageType.Video | undefined;
  messageTypeFile: MessageType.File | undefined;
  messageTypeLocation: MessageType.Location | undefined;

  lastMessage: { role: string; msg: string } | null = null;

  constructor(private sanitzer: DomSanitizer, private socket: Socket) {}
  receivedImage: any;

  getSafeHtml(html: string) {
    return this.sanitzer.bypassSecurityTrustHtml(html);
  }

  async ngOnInit() {
    this.conversionDetails = await this.getSocketUrl();
    this.socketUrl = this.conversionDetails.streamUrl;
    this.constructWebSocketURL();
    this.startInactivityTimer();

    //socket of connecter

    this.socket.on('connect', () => {
      console.log('connected to server');
    });

    this.socket.on('message', (data: Message) => {
      data.sender = 'agent user';
      data.userType = UserType.Agent;
      console.log('avayaREsp--------> ', data);
      setTimeout(() => {
        this.messageContainer.nativeElement.scrollTop =
          this.messageContainer.nativeElement.scrollHeight -
          this.messageContainer.nativeElement.clientHeight;
      }, 1);
      this.chatMessages.push(data);
      console.log('-=-=-=', this.chatMessages);
    });
  }
  uploadImage() {}

  lll() {
    this.botprofile.nativeElement.style.display = 'initial';
  }

  closepopup() {
    this.popUp = !this.popUp;
    this.botprofile.nativeElement.class = 'none';
  }

  scrollRight() {
    this.actionsContainer.nativeElement.scrollLeft += 100;
  }
  scrollLeft() {
    this.actionsContainer.nativeElement.scrollLeft -= 100;
  }

  onEventOccurred(event: any) {
    console.log('adaptive card btn clicked');
  }

  scrollPrev() {
    this.carouselContainer.nativeElement.scrollLeft -= 320;
  }

  scrollNext() {
    this.carouselContainer.nativeElement.scrollLeft += 320;
  }

  startInactivityTimer() {
    this.inactivityTimer = setTimeout(() => {
      this.isUserInactive = true;
    }, 30000); // 3m timeout
  }

  uint8ArrayToBinaryString(uint8Array: Uint8Array): string {
    let binaryString = '';
    for (let i = 0; i < uint8Array.length; i++) {
      binaryString += String.fromCharCode(uint8Array[i]);
    }
    return binaryString;
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
  }

  handleDrop(e: DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer?.files[0];
    this.handleFile(file);
  }

  handleFileSelect(e: any) {
    const file = e.target.files?.[0];
    this.handleFile(file);
  }

  handleFile(file: File | undefined) {
    console.log('procesing file, ', file);
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      let messagePayload: Message;
      const fileData: FileData = {
        name: file.name,
        data: reader.result as string,
        size: file.size,
        contentType: file.type,
        url: '',
      };
      switch (file.type.split('/')[0]) {
        case 'image':
          messagePayload = {
            sender: this.sender,
            userType: UserType.Customer,
            message_type: MessageType.Image,
            [MessageType.Image]: fileData,
          };
          break;
        case 'audio':
          messagePayload = {
            sender: this.sender,
            userType: UserType.Customer,
            message_type: MessageType.Audio,
            [MessageType.Audio]: fileData,
          };
          break;
        case 'video':
          messagePayload = {
            sender: this.sender,
            userType: UserType.Customer,
            message_type: MessageType.Video,
            [MessageType.Video]: fileData,
          };
          break;

        default:
          messagePayload = {
            sender: this.sender,
            userType: UserType.Customer,
            message_type: MessageType.File,
            [MessageType.File]: fileData,
          };
      }
      // console.log('messagePayload===> ', messagePayload);
      this.sendMessageToAgent(messagePayload);
    };
    reader.readAsDataURL(file);
  }

  sendText() {
    if (!this.messageInputText.nativeElement.value) return;
    console.log('send text called');
    let messagePayload: Message = {
      sender: this.sender,
      userType: UserType.Customer,
      message_type: MessageType.Text,
      text: this.messageInputText.nativeElement.value,
    };
    this.messageInputText.nativeElement.value = '';

    this.sendMessageToAgent(messagePayload);
  }

  sendMessageToAgent(messagePayload: Message) {
    console.log('message Payload--> ', messagePayload);
    if (!messagePayload) return;

    try {
      this.socket.emit('message', messagePayload);
      this.chatMessages.push(messagePayload);
    } catch (error) {
      console.log('error  ----------?', error);
    }
  }

  handleSendLocation() {
    if (!navigator.geolocation) {
      return alert('Geolocation is not supported by your browser');
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        // https://www.latlong.net/c/?lat=18.5855998&long=73.7830746
        // `https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`
        // const fu:any =this.sanitzer.sanitize(SecurityContext.URL,);

        const mapUrl = this.sanitzer.bypassSecurityTrustResourceUrl(
          `https://maps.google.com/maps?q=${latitude}/${longitude}`
        );

        const loc: LocationData = {
          lat: latitude,
          long: longitude,
          url: mapUrl,
        };
        const messagePayload: Message = {
          sender: this.sender,
          userType: UserType.Customer,
          message_type: MessageType.Location,
          [MessageType.Location]: loc,
        };
        this.sendMessageToAgent(messagePayload);
      },
      (err) => {
        alert('Unable to fetch your location  ');
        console.log('Unable to fetch your location  --> ', err);
      },
      { enableHighAccuracy: true }
    );
  }

  toggleChatbot(): void {
    this.showChatbot = !this.showChatbot;
    this.popUpOpenClose = !this.popUpOpenClose;
    this.popUpOpenopen = !this.popUpOpenopen;
  }
  closechat() {
    this.showChatbot = false;
  }

  updateInputSize(event: any) {
    const textarea = event.target;
    textarea.style.height = 'auto'; // Reset the height to auto to correctly calculate the scroll height
    textarea.style.height = textarea.scrollHeight + 'px';
  }
  onInput(e: any) {
    this.isTyping = e.target.value.trim().length > 0;
  }

  handleEnterPress(event: KeyboardEvent) {
    if (event.key === 'Enter' && event.shiftKey === false) {
      event.preventDefault();
      this.sendMessage();
      this.messageInputText.nativeElement.value = '';
      this.messageInputText.nativeElement.style.height = 'auto';
    }
  }

  constructWebSocketURL(): void {
    const url = this.socketUrl;
    // console.log('fu', url);
    // Establish WebSocket connectionng
    this.ws = new WebSocket(url);

    // WebSocket event listeners
    this.ws.onopen = (s) => {
      console.log('s==> ', s);

      console.log('WebSocket connection established');
      this.sendInitialMessege(this.conversionDetails);
    };

    // const eventData = JSON.parse(event.data);
    this.ws.onmessage = (event) => {
      // console.log('Received message:', event);
      console.log(
        'Received message:'
        // JSON.stringify(JSON.parse(event.data)['activities'][0].text)
      );

      // this.chatList.push(JSON.parse(event.data)['activities'][0]);
      let eventData = event.data ? JSON.parse(event.data) : null;
      // console.log('eventData', eventData);

      if (eventData && eventData?.activities[0]?.attachments?.length > 0) {
        let acData = eventData?.activities[0]?.attachments[0];
        console.log('acData', acData);

        const adaptiveCard = new AdaptiveCard();
        adaptiveCard.hostConfig = new HostConfig({
          fontFamily: 'Segoe UI, Helvetica Neue, sans-serif',
          // other host config options
        });

        // adaptiveCard.onExecuteAction = this.onEventOccurred.bind(this);
        adaptiveCard.onExecuteAction = function (action: any) {
          console.log('kem cho bhai');
        };
        adaptiveCard.parse(acData?.content);

        // Render card to HTML
        const renderedCard = adaptiveCard.render();
        console.log(
          'renderedCard====> ',
          JSON.stringify(renderedCard?.innerHTML)
        );
        acData.html = renderedCard?.innerHTML;
      }

      eventData && this.chatList.push(eventData?.activities[0]);

      if (
        eventData?.activities[0].type === 'event' &&
        eventData?.activities[0].value === 'connectToAgent'
      ) {
        //   this.chatListT0Agent.push(eventData?.activities[0].from);
        //   console.log('connectToAgentUrl', this.chatListT0Agent)
        //  ;
        this.chatList
          .filter((ele: any) => ele.type === 'message')
          .map((ele: any) => {
            // if(ele.from.role === 'user') {
            //   this.chatListT0Agent.push({
            //     role: ele.from.role,
            //     name: ele.from.name,
            //     msg: ele.text,
            //   });
            // }

            this.chatListT0Agent.push({
              role: ele.from.role,
              name: ele.from.name,
              msg: ele.text,
            });

            // this.chatListT0Agent.push({
            //   role: ele.from.role,
            //   name: ele.from.name,
            //   msg: ele.text,
            // });
          });
        console.log('chatListT0Agent', this.chatListT0Agent);

        this.socket.emit('message', this.chatListT0Agent);
        this.ws.close();
      }

      setTimeout(() => {
        this.messageContainer.nativeElement.scrollTop =
          this.messageContainer.nativeElement.scrollHeight -
          this.messageContainer.nativeElement.clientHeight;
      }, 1);

      // 909572fe-96ba-43a4-87d3-e05abe0a8545
      // 909572fe-96ba-43a4-87d3-e05abe0a8545

      console.log('fu-=> ', this.chatList);

      eventData?.activities[0]?.suggestedActions?.actions?.map((ele: any) => {
        console.log('🧐', ele.value);
        this.connectToAgentUrl = this.sanitzer.bypassSecurityTrustResourceUrl(
          ele.value
        );
      });
      eventData?.activities[0]?.suggestedActions?.actions?.map((ele: any) =>
        console.log('🧐', ele.type)
      );

      const message = eventData?.activities[0]?.attachments[0]?.content;
      if (message?.images && message?.images.length > 0) {
        this.userImage = this.sanitzer.bypassSecurityTrustResourceUrl(
          message.images[0]?.url
        );
        console.log('image', this.userImage);
      }

      // extract rating
      // this.rating =
      //   eventData?.activities[0]?.attachments[0]?.content.body[1].columns.map(
      //     (ele: any) => ele.items[0].selectAction.data.rate
      //   );
      // console.log('msg', this.rating);

      //   eventData?.activities[0]?.suggestedActions?.attachments?.map((ele: any) =>
      //   console.log('jjjjj', ele.content)
      // );

      // const attachments = eventData?.activities[0]?.attachments[0]?.content;
      // console.log('abhi', attachments);

      // const adaptiveCard = new AdaptiveCard();
      // adaptiveCard.hostConfig = new HostConfig({
      //   fontFamily: 'Segoe UI, Helvetica Neue, sans-serif',
      //   // other host config options
      // });

      // adaptiveCard.parse(attachments);

      // // Render card to HTML
      // const renderedCard = adaptiveCard.render();
      // console.log('renderedCard====> ', renderedCard);

      // Now you can display renderedCard in your template

      // let fu = document.getElementsByClassName('anchor')[0];

      // fu.scrollIntoView({
      //   behavior: 'smooth',
      //   block: 'end',
      //   inline: 'nearest',
      // });

      // this.chatList=jsonstring;
      // console.log('Received message:', event);
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    this.ws.onclose = () => {
      console.log('WebSocket connection closed');
    };
  }

  sendMessage(value: any = null) {
    console.log('mess============> ', value);

    if (value !== null) {
      const message = value;
      console.log('mess============> here ', message);
      if (message !== '') {
        if (this.ws.readyState === WebSocket.OPEN) {
          this.ws.send(message);

          this.sendMessageAgain(this.conversionDetails, message);
        } else {
          console.warn('WebSocket connection not open. Cannot send message.');
          this.sendText();
        }
        // message = '';
        this.messageInputText.nativeElement.value &&
          (this.messageInputText.nativeElement.value = '');
        this.actionsContainer && ( this.actionsContainer.nativeElement.style.display = 'none');
        this.actionsContainer &&  this.actionsContainer.nativeElement.remove(  );
      }
    } else {
      const message = this.messageInputText.nativeElement.value;
      console.log('mess============> there ', message);
      if (message !== '') {
        if (this.ws.readyState === WebSocket.OPEN) {
          this.ws.send(message);

          this.sendMessageAgain(this.conversionDetails, message);
        } else {
          console.warn('WebSocket connection not open. Cannot send message.');
          this.sendText();
        }
        // message = '';
        this.messageInputText.nativeElement.value &&
          (this.messageInputText.nativeElement.value = '');
        // suggestedActions && (suggestedActions.style.display = 'none');
        // suggestedActions && suggestedActions.remove(  );
      }
    }
  }

  async getSocketUrl() {
    let headersList = {
      Accept: '*/*',
      Authorization:
        // 'Bearer nRkW9WSAFoY.qsrTi92ZljrPGQalhmW0ARz0fM7UKrdmiXefdnJw56s', // University Copilot (classic),
        'Bearer 6mJ1ECPC0dk.hunFtodVEt72En-mSOwQiSLcBabsgjK_zwLVeAYq6U8', //University AI Copilot,
      // 'Bearer NzJvp6uOnjk.5h8_Dmesn3A4geCI_7vBiCSIka6dKNT1EUcwQdTIarg',//campus bot
    };

    let response = await fetch(
      'https://directline.botframework.com/v3/directline/conversations',
      {
        method: 'POST',
        headers: headersList,
      }
    );

    let data: any = await response.text();
    return JSON.parse(data);
  }

  async sendMessageAgain(conversionDetails: any, message: string) {
    const { conversationId, streamUrl, token } = conversionDetails;
    // console.log(conversionDetails)
    let headersList = {
      authority: 'directline.botframework.com',
      accept: '*/*',
      'accept-language': 'en-US,en;q=0.9',
      authorization: `Bearer ${token}`,
      'content-type': 'application/json',
      type: 'message',
      text: 'test',
    };

    let bodyContent = JSON.stringify({
      locale: 'en-EN',
      type: 'message',
      value: this.rating,

      from: {
        id: 'user1',
        role: 'user',
      },
      text: message,
    });

    let response = await fetch(
      `https://directline.botframework.com/v3/directline/conversations/${conversationId}/activities`,
      {
        method: 'POST',
        body: bodyContent,
        headers: headersList,
      }
    );

    let data = await response.text();
    console.log(data);
  }

  //it is for the initial message which comes on opening
  async sendInitialMessege(conversionDetails: any) {
    try {
      const { conversationId, token } = conversionDetails;

      let headersList = {
        authorization: `Bearer ${token}`,
        'content-type': 'application/json',
      };
      let bodyContent = JSON.stringify({
        name: 'startConversation',
        type: 'event',
        from: {
          id: '5839aa31-0a18-4ae6-bf9a-074b29de79b3',
          // name: 'C2 User',
          role: 'user',
        },
      });
      let response = await fetch(
        `https://directline.botframework.com/v3/directline/conversations/${conversationId}/activities`,
        {
          method: 'POST',
          body: bodyContent,
          headers: headersList,
        }
      );

      let data = await response.text();
      console.log('inital msg send ', data);
    } catch (error) {
      console.log('error in send initial message', error);
    }
  }
}
