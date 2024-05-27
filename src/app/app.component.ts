import { Component, OnInit } from '@angular/core';

import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { ChatComponent } from './chat/chat.component';
import { ConfigService } from './config.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent  {
  dialog: any;

  // chatList: any = [];
  // title = 'copilot';
  // ws!: WebSocket;
  // message: string = '';
  // socketUrl: any;
  // conversionDetails: any;

  // constructor(private tokenService: ConfigService) {}
  // async ngOnInit() {
  //   this.conversionDetails = await this.getSocketUrl();
  //   this.socketUrl = this.conversionDetails.streamUrl;
  //   this.constructWebSocketURL();
  // }

  // constructWebSocketURL(): void {
  //   const url = this.socketUrl;
  //   // console.log('fu', url);
  //   // Establish WebSocket connectionng
  //   this.ws = new WebSocket(url);

  //   // WebSocket event listeners
  //   this.ws.onopen = (s) => {
  //     console.log('s==> ', s);

  //     // this?.ws?.send(
  //     //   'CONNECT eyJhbGciOiJSUzI1NiIsImtpZCI6ImxZd3JkMzFhdmtEckhnQ2Z5bmdCZVM4T196byIsIng1dCI6ImxZd3JkMzFhdmtEckhnQ2Z5bmdCZVM4T196byIsInR5cCI6IkpXVCJ9.eyJib3QiOiI5MDk1NzJmZS05NmJhLTQzYTQtODdkMy1lMDVhYmUwYTg1NDUiLCJzaXRlIjoiblJrVzlXU0FGb1kiLCJjb252IjoiSGZ6cldzQ2dxUVk2VUlsamlLbnZJRC1pbiIsIm5iZiI6MTcwOTE4ODM0NywiZXhwIjoxNzA5MTg4NDA3LCJpc3MiOiJodHRwczovL2RpcmVjdGxpbmUuYm90ZnJhbWV3b3JrLmNvbS8iLCJhdWQiOiJodHRwczovL2RpcmVjdGxpbmUuYm90ZnJhbWV3b3JrLmNvbS8ifQ.VXRqfgsUsF9AA58q4zfXh-x1oI0or8pmNZTB2EKYWVyuMJsfxyFUEmHBeTYFZju4joknwsUIqsg8Cx_CpwCrSAQi4yJDYy6wZ7YREHAfhD8qCFYJIf3GSi7Ie6hqOf8ZgPm_rrY1NKRb15s5Qe9wJq4EYMgpfqg8WYEOG6FtDd_mC8-rztYGrWTbaKK7f_bqwy1AvPymvz2DHI-460iIOr1TeRvx2QUsRBL9ALBR55eZSCAI-R7fWaS84-578eHEujJJTI71kOzoXtfTo3ZbxY6T6Xef3Qn0zIfaEY44KRqSnRbLEjxqksZkAj0vpd8qSX66Av3xLHAKqZpTAtMatQ'
  //     // );

  //     this.ws.send('hi');

  //     console.log('WebSocket connection established');
  //   };

  //   // const eventData = JSON.parse(event.data);
  //   this.ws.onmessage = (event) => {
  //     // console.log('Received message:', event.data);
  //     console.log(
  //       'Received message:',
  //       JSON.parse(event.data)['activities'][0].text
  //     );
  //     this.chatList.push(JSON.parse(event.data)['activities'][0].text);
  //     // 909572fe-96ba-43a4-87d3-e05abe0a8545
  //     // 909572fe-96ba-43a4-87d3-e05abe0a8545

  //     console.log('fu-=> ', this.chatList);

  //     // this.chatList=jsonstring;
  //     // console.log('Received message:', event);
  //   };
  //   this.ws.onerror = (error) => {
  //     console.error('WebSocket error:', error);
  //   };

  //   this.ws.onclose = () => {
  //     console.log('WebSocket connection closed');
  //   };
  // }

  // sendMessage() {
  //   console.log('mess============> ', this.message);

  //   if (this.ws.readyState === WebSocket.OPEN) {
  //     this.ws.send(this.message);

  //     this.sendMessageAgain(this.conversionDetails, this.message);
  //   } else {
  //     console.warn('WebSocket connection not open. Cannot send message.');
  //   }
  //   this.message = '';
  // }

  // async getSocketUrl() {
  //   let headersList = {
  //     Accept: '*/*',
  //     'User-Agent': 'Thunder Client (https://www.thunderclient.com)',
  //     Authorization:
  //       'Bearer nRkW9WSAFoY.qsrTi92ZljrPGQalhmW0ARz0fM7UKrdmiXefdnJw56s',
  //   };

  //   let response = await fetch(
  //     'https://directline.botframework.com/v3/directline/conversations',
  //     {
  //       method: 'POST',
  //       headers: headersList,
  //     }
  //   );

  //   let data: any = await response.text();
  //   return JSON.parse(data);
  // }

  // async sendMessageAgain(conversionDetails: any, message: string) {
  //   const { conversationId, streamUrl, token } = conversionDetails;
  //   // console.log(conversionDetails)
  //   let headersList = {
  //     authority: 'directline.botframework.com',
  //     accept: '*/*',
  //     'accept-language': 'en-US,en;q=0.9',
  //     authorization: `Bearer ${token}`,
  //     'content-type': 'application/json',
  //   };

  //   // let bodyContent = JSON.stringify({
  //   //   channelData: {
  //   //     cci_trace_id: 'O1Vb2',
  //   //     traceHistory: {
  //   //       dialogId:
  //   //         'new_topic_5a6b6b57a2baee1190786045bd1d19c0_ba7b967c97ba4c39bca58a8bb6a72d59_conversationstart',
  //   //       nodeId: '4c32d4d5-9bdc-47f0-afaf-614883acef7b',
  //   //       incomingRouteExpression: '##DEFAULT',
  //   //     },
  //   //     enableDiagnostics: true,
  //   //     clientActivityID: 'ec1p77xlya8',
  //   //   },
  //   //   text: 'chipi chipi chapa chapa',
  //   //   textFormat: 'plain',
  //   //   type: 'message',
  //   //   cci_tenant_id: 'ca00080e-e3fe-4c5b-9c02-a8288c3bf817',
  //   //   cci_content_version: '*',
  //   //   cci_user_token:
  //   //     'eyJhbGciOiJSUzI1NiIsImtpZCI6IjZDNzhEMEEwMEM4ODIzQkZFMjZGQTEyOEYxMEJGMzAzMDkyNDQ0QzciLCJ4NXQiOiJiSGpRb0F5SUk3X2liNkVvOFF2ekF3a2tSTWMiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiS2FtbGVzaCBKYWluIiwib2lkIjoiZTZkMzQwYzAtNTViYS00M2M3LWI1YTItMDJjNTJjZTAyMTYwIiwiYmlkIjoiOTA5NTcyZmUtOTZiYS00M2E0LTg3ZDMtZTA1YWJlMGE4NTQ1IiwiY2lkIjoiQ2Y2ZUs5Wjh6cUc5QzJXM0RFMDBYZS1hcyIsImtpZCI6IjRmZDk4YThjN2YzMzQ3ODA5OTkyNjI2MjIyMjM1M2U2IiwibmJmIjoxNzA5MjAzMjk1LCJleHAiOjE3MDkyMDUwOTUsImlhdCI6MTcwOTIwMjk5NSwiaXNzIjoiaHR0cHM6Ly9wb3dlcnZhLm1pY3Jvc29mdC5jb20vIiwiYXVkIjoiOTZmZjQzOTQtOTE5Ny00M2FhLWIzOTMtNmE0MTY1MmUyMWY4In0.QiQkRbHaz3UGrvYGnFYm5JMXni3E21pk8neCn2x1l-p34lwpHvr0QPNdVPZlI_U9V1mZzoz1lmMavU8vjFmJ7lrO-lyt9eWc-7UBxDrRRPbl0JfPMYNgDS4zZ63nb6mrWD83NrtBoMmqnv2rqR7KUnsrgp7nrN-of6-7ggc1_rdjLv1xhuT1nY9Dgkuh7lmcOZQv9h2FzF21C_iaH29yEhGyPKb3al3OfGHglq3t8MrXyyCHYH8he72AekwMvpi7c3SeLq_SYNpHbciVj8SNVLFsSFiE0yttsBmCsE-7bXpC4rvjGlfXkQSQCORPLD6AZTh5vsUOnn09olPd2KCHGw',
  //   //   cci_environment_id: 'Default-ca00080e-e3fe-4c5b-9c02-a8288c3bf817',
  //   //   enableUacProvisioning: false,
  //   //   channelId: 'webchat',
  //   //   from: {
  //   //     id: '195eea81-39ce-49ad-b549-f1f107db6b51',
  //   //     name: 'C2 User',
  //   //     role: 'user',
  //   //   },
  //   //   locale: 'en-US',
  //   //   localTimestamp: '2024-02-29T16:15:13.552+05:30',
  //   //   localTimezone: 'Asia/Calcutta',
  //   //   attachments: [],
  //   // });

  //   let bodyContent = JSON.stringify({
  //     locale: 'en-EN',
  //     type: 'message',
  //     from: {
  //       id: 'user1',
  //       role:'user'
  //     },
  //     text: message,
  //   });

  //   let response = await fetch(
  //     `https://directline.botframework.com/v3/directline/conversations/${conversationId}/activities`,
  //     {
  //       method: 'POST',
  //       body: bodyContent,
  //       headers: headersList,
  //     }
  //   );

  //   let data = await response.text();
  //   console.log(data);
  // }

 


}
