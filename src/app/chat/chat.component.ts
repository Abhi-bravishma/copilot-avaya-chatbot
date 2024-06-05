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
  SuggestedAction,
  CopilotAttachments,
  CopilotAttachmentContent,
  CopilotAttachmentButtons,
  CopilotAttachmentContentImage,
  CopilotAttachmentMedia,
} from '../types/message';
import { ConfigService } from '../config.service';

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

  // modalImageUrl!: any;
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
  sender: string = 'USER';
  typeUser = UserType.Customer;
  typeAgent = UserType.Agent;
  typeSystem = UserType.System;
  messsFile = MessageType.File;
  messageType: typeof MessageType = MessageType;
  actionType: typeof ActionType = ActionType;
  isAvaya: boolean = false;
  copilotConversationId: string = '';
  messageTypeText: MessageType.Text | undefined;
  messageTypeImage: MessageType.Image | undefined;
  messageTypeAudio: MessageType.Audio | undefined;
  messageTypeVideo: MessageType.Video | undefined;
  messageTypeFile: MessageType.File | undefined;
  messageTypeLocation: MessageType.Location | undefined;
  messageTypeSuggestedAction: MessageType.SuggestedActions | undefined;
  messageTypeCopilot: MessageType.Copilot | undefined;
  copilotToken: any;
  lastMessage: { role: string; msg: string } | null = null;
  mobileNumber: string | null = null;
  userName: string = '';

  constructor(
    private sanitzer: DomSanitizer,
    private socket: Socket,
    private tokenService: ConfigService
  ) {}
  receivedImage: any;

  getSafeHtml(html: string) {
    return this.sanitzer.bypassSecurityTrustHtml(html);
  }

  async ngOnInit() {
    // this.tokenService.getToken().subscribe(
    //   (data: any) => {
    //     // Assuming the response has a 'token' field
    //     console.log('Token:', data.copilotToken);
    //     this.copilotToken = data.copilotToken;
    //   },
    //   (error: any) => {
    //     console.error('Error fetching token:', error);
    //   }
    // );

    let data = await this.tokenService.getToken().toPromise();
    // console.log('tokenservice--------------------> ', data);

    this.conversionDetails = await this.getSocketUrl(data.copilotToken);
    this.socketUrl = this.conversionDetails.streamUrl;
    this.constructWebSocketURL();
    this.startInactivityTimer();

    //socket of connecter

    this.socket.on('connect', () => {
      console.log(
        'avaya connector socket connection established successfully',
        this.socket.ioSocket.id
      );
    });

    this.socket.on('disconnect', () => {
      console.log(
        'avaya connector socket connection un-established successfully'
      );
    });

    this.socket.on('message', (data: Message) => {
      data.sender = 'agent user';
      data.userType = UserType.Agent;
      console.log('avayaREsp--------> ', data);
      setTimeout(() => {
        if (this.messageContainer)
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
            sender: this.userName,
            userType: UserType.Customer,
            message_type: MessageType.Image,
            [MessageType.Image]: fileData,
            copilot_convo_id: this.copilotConversationId,
            timestamp: new Date().toISOString(),
            mobileNumber: this.mobileNumber,
          };
          break;
        case 'audio':
          messagePayload = {
            sender: this.userName,
            userType: UserType.Customer,
            message_type: MessageType.Audio,
            [MessageType.Audio]: fileData,
            copilot_convo_id: this.copilotConversationId,
            timestamp: new Date().toISOString(),
            mobileNumber: this.mobileNumber,
          };
          break;
        case 'video':
          messagePayload = {
            sender: this.userName,
            userType: UserType.Customer,
            message_type: MessageType.Video,
            [MessageType.Video]: fileData,
            copilot_convo_id: this.copilotConversationId,
            timestamp: new Date().toISOString(),
            mobileNumber: this.mobileNumber,
          };
          break;

        default:
          messagePayload = {
            sender: this.userName,
            userType: UserType.Customer,
            message_type: MessageType.File,
            [MessageType.File]: fileData,
            copilot_convo_id: this.copilotConversationId,
            timestamp: new Date().toISOString(),
            mobileNumber: this.mobileNumber,
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
      sender: this.userName,
      userType: UserType.Customer,
      message_type: MessageType.Text,
      text: this.messageInputText.nativeElement.value,
      copilot_convo_id: this.copilotConversationId,
      timestamp: new Date().toISOString(),
      mobileNumber: this.mobileNumber,
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
          sender: this.userName,
          userType: UserType.Customer,
          message_type: MessageType.Location,
          [MessageType.Location]: loc,
          copilot_convo_id: this.copilotConversationId,
          timestamp: new Date().toISOString(),
          mobileNumber: this.mobileNumber,
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
      // this.isTyping = false;

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
      // console.log(
      //   'Received message:'
      //   // JSON.stringify(JSON.parse(event.data)['activities'][0].text)
      // );

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

      // eventData && this.chatList.push(eventData?.activities[0]);
      if (eventData && eventData?.activities[0]?.type === 'message') {
        let dataa = eventData.activities[0];
        console.log('what the fmsg--> ', dataa);
        let serializeData: Message = this.serializeCopilotData(dataa);
        console.log('serializeData--> ', serializeData);
        this.chatMessages.push(serializeData);
      }

      if (eventData?.activities[0].type === 'event') {
        console.log('wtf======== > ', eventData?.activities[0]);
        console.log('wtf======== > ', eventData?.activities[0].name);
      }

      if (
        eventData?.activities[0].type === 'event' &&
        // eventData?.activities[0].value === 'connectToAgent'
        eventData?.activities[0].name === 'connectToAgent'
      ) {
        console.log('--------------------------------------------------------');

        console.log(
          'wtf--> name',
          eventData?.activities[0].name,
          'type=> ',
          eventData?.activities[0].type,
          ' val=> ',
          eventData?.activities[0].value
        );
        let uName = eventData?.activities[0]?.value[0];
        let uMob = eventData?.activities[0]?.value[1];
        this.userName = uName;
        this.mobileNumber = uMob;

        console.log('==========================');
        console.log(this.userName, this.mobileNumber);
        console.log('==========================');
        // this.sendText();
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

        // this.socket.emit('message', this.chatListT0Agent);
        console.log('connecting to agent closing copiloty socket');

        this.ws.close();
        this.isAvaya = true;

        this.sendInitialMessageAvaya();
      }

      setTimeout(() => {
        if (this.messageContainer)
          this.messageContainer.nativeElement.scrollTop =
            this.messageContainer?.nativeElement.scrollHeight -
            this.messageContainer?.nativeElement.clientHeight;
      }, 1);

      // 909572fe-96ba-43a4-87d3-e05abe0a8545
      // 909572fe-96ba-43a4-87d3-e05abe0a8545

      // console.log('fu-=> ', this.chatList);

      eventData?.activities[0]?.suggestedActions?.actions?.map((ele: any) => {
        console.log('🧐', ele.value);

        this.connectToAgentUrl = this.sanitzer.bypassSecurityTrustResourceUrl(
          ele.value
        );
      });
      // eventData?.activities[0]?.suggestedActions?.actions?.map((ele: any) =>
      //   console.log('🧐', ele.type)
      // );

      const message = eventData?.activities?.[0]?.attachments?.[0]?.content;
      if (message?.images && message?.images.length > 0) {
        this.userImage = this.sanitzer.bypassSecurityTrustResourceUrl(
          message?.images[0]?.url
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
      console.log('WebSocket connection closed of Copilot');
    };
  }

  sendMessage(value: any = null) {
    console.log('mess============> ', value);

    if (value !== null) {
      const message = value;
      console.log('mess============> here ', message);
      if (message !== '') {
        // if (this.ws.readyState === WebSocket.OPEN) {
        // this.ws.send(message);
        if (!this.isAvaya) {
          this.sendMessageAgain(this.conversionDetails, message);
        } else {
          this.sendText();
        }
        // } else {
        //   console.warn('WebSocket connection not open. Cannot send message.');
        //   this.sendText();
        // }
        // message = '';
        this.messageInputText.nativeElement.value &&
          (this.messageInputText.nativeElement.value = '');
        // this.actionsContainer
        // &&
        //   (this.actionsContainer.nativeElement.style.display = 'none');
        this.actionsContainer && this.actionsContainer.nativeElement.remove();
      }
    } else {
      const message = this.messageInputText.nativeElement.value;
      console.log('mess============> there ', message);
      if (message !== '') {
        // if (this.ws.readyState === WebSocket.OPEN) {
        // this.ws.send(message);
        if (!this.isAvaya) {
          this.sendMessageAgain(this.conversionDetails, message);
        } else {
          this.sendText();
        }

        // } else {
        //   console.warn('WebSocket connection not open. Cannot send message.');
        //   this.sendText();
        // }
        // message = '';
        this.messageInputText.nativeElement.value &&
          (this.messageInputText.nativeElement.value = '');
        // suggestedActions && (suggestedActions.style.display = 'none');
        // suggestedActions && suggestedActions.remove(  );
      }
    }
  }

  async getSocketUrl(copilotToken: string) {
    console.log('copilotToken ==> ', copilotToken);
    let headersList = {
      Accept: '*/*',
      Authorization:
        // 'Bearer nRkW9WSAFoY.qsrTi92ZljrPGQalhmW0ARz0fM7UKrdmiXefdnJw56s', // University Copilot (classic),
        // 'Bearer mcKUYtZZ-5A.SNSxaE9Tb2FcLEtXhLAq-ISgM4LAwiH-dzaAvCAuTZA', //University AI Copilot,
        // 'Bearer J4F_EVyzGL0.RJf4LF_6Oiue88wdXeYqSn9iWJg2f64LGVPsiG2QPxw', //beyond bank,

        // 'Bearer 6mJ1ECPC0dk.hunFtodVEt72En-mSOwQiSLcBabsgjK_zwLVeAYq6U8', //University AI Copilot,

        `Bearer ${copilotToken}`, //copy bot
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
    console.log('conversionDetails');
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
    console.log('wtf', data);
  }

  //it is for the initial message which comes on opening
  async sendInitialMessege(conversionDetails: any) {
    try {
      const { conversationId, token } = conversionDetails;
      if (conversationId) {
        this.copilotConversationId = conversationId;
      }
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
      // console.log('inital msg send ', data);
    } catch (error) {
      console.log('error in send initial message', error);
    }
  }

  serializeCopilotData(data: any) {
    let userType =
      data.from.role === 'user' ? UserType.Customer : UserType.System;

    // let suggestedActions: SuggestedAction={
    //   text: da
    // }

    let attachments = data.attachments?.map(
      (attachment: CopilotAttachments): CopilotAttachments => {
        let buttons: CopilotAttachmentButtons[] =
          attachment.content.buttons?.map(
            (button: CopilotAttachmentButtons): CopilotAttachmentButtons => {
              return {
                type: button.type,
                title: button.title,
                value: button.value,
              };
            }
          );

        let images: CopilotAttachmentContentImage[] =
          attachment.content.images?.map(
            (
              image: CopilotAttachmentContentImage
            ): CopilotAttachmentContentImage => {
              return {
                url: image.url,
              };
            }
          );
        let video: CopilotAttachmentMedia[] = attachment.content.media?.map(
          (video: CopilotAttachmentMedia): CopilotAttachmentMedia => {
            return {
              url: video.url,
            };
          }
        );

        let content: CopilotAttachmentContent = {
          title: attachment.content.title,
          subtitle: attachment.content.subtitle,
          text: attachment.content.text,
          buttons: buttons,
          images: images,
          media: video,
        };

        return {
          contentType: attachment.contentType,
          content: content,
          html: attachment.html,
        };
      }
    );

    let fu: Message = {
      sender: userType,
      userType: userType,
      message_type: MessageType.Copilot,
      copilot_convo_id: data.conversation.id,
      text: data.text ? this.convertNewlinesToBreaks(data.text) : '',
      timestamp: data.timestamp,
      suggestedActions: data.suggestedActions,
      attachments: attachments,
      attachmentLayout: data.attachment,
      mobileNumber: this.mobileNumber,
    };

    return fu;
  }

  sendInitialMessageAvaya() {
    let messagePayload: Message = {
      copilot_convo_id: this.copilotConversationId,
      sender: this.userName,
      userType: UserType.Customer,
      message_type: MessageType.Text,
      text: 'hi',
      timestamp: new Date().toISOString(),
      mobileNumber: this.mobileNumber,
    };
    // this.sendMessageToAgent(messagePayload);
    this.socket.emit('message', messagePayload);
  }

  convertNewlinesToBreaks(text: string): string {
    // console.log('text', text);
    return (text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'));
  }

  // openModal(imageUrl: string) {
  //   this.modalImageUrl = imageUrl;
  // }

  // closeModal() {
  //   this.modalImageUrl = null;
  // }
}
