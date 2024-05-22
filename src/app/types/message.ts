import { SafeUrl } from "@angular/platform-browser";

export enum MessageType {
    Text = 'text',
    Image = 'image',
    Audio = 'audio',
    Video = 'video',
    File = 'file',
    Location = 'location',
    Action = 'action',
}
 
export enum UserType {
    Customer = 'CUSTOMER',
    Agent = 'AGENT',
    System = 'SYSTEM',
}
 
export enum ActionType {
    LocationRequest = 'locationRequest',
}
 
export interface FileData {
    data: string;
    name: string;
    size: number;
    contentType: string;
    url: string;
}
 
export interface LocationData {
  lat: number;
  long: number;
  url:any
}
 
export interface ActionData {
    type: ActionType;
    text: string;
    payload: unknown;
    uri: unknown;
    iconUrl: unknown;
}
 
interface BaseMessage {
  sender: string;
  userType: UserType;
  message_type: MessageType;
}
 
interface TextMessage extends BaseMessage {
    message_type: MessageType.Text;
    text: string;
    actions?: ActionData[];
}
 
interface ImageMessage extends BaseMessage {
  message_type: MessageType.Image;
  image: FileData;
}
 
interface AudioMessage extends BaseMessage {
  message_type: MessageType.Audio;
  audio: FileData;
}
 
interface VideoMessage extends BaseMessage {
  message_type: MessageType.Video;
  video: FileData;
}
 
interface FileMessage extends BaseMessage {
  message_type: MessageType.File;
  file: FileData;
}
 
interface LocationMessage extends BaseMessage {
  message_type: MessageType.Location;
  location: LocationData;
}
 
// interface ActionMessage extends BaseMessage {
//  message_type: MessageType.Action;
//  text?: string;
// }
 
export type Message =
  | TextMessage
  | ImageMessage
  | AudioMessage
  | VideoMessage
  | FileMessage
  | LocationMessage;

// export interface MessageContextType {
//   messages: Message[];
//   sendMessage: (message: Message) => void;
// }
