import { SafeUrl } from '@angular/platform-browser';

export enum MessageType {
  Text = 'text',
  Image = 'image',
  Audio = 'audio',
  Video = 'video',
  File = 'file',
  Location = 'location',
  Action = 'action',
  SuggestedActions = 'suggestedActions',
  Copilot = 'copilot',
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
  url: any;
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
  copilot_convo_id: string;
  timestamp: string;
  mobileNumber:string;
}

interface TextMessage extends BaseMessage {
  message_type: MessageType.Text;
  text: string;
  actions?: ActionData[];
  suggestedActions?: SuggestedActionsData;
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
// interface SuggestedActionsMessage extends BaseMessage {
//   message_type: MessageType.SuggestedActions;
//   suggestedActions: SuggestedActionsData;
// }

export interface SuggestedAction {
  text: string;
  title: string;
  type: string;
  value: string;
}
export interface SuggestedActionsData {
  actions: SuggestedAction[];
}

export interface CopilotAttachmentContentImage {
  url: string;
}
export interface CopilotAttachmentMedia {
  url: string;
}

export interface CopilotAttachmentButtons {
  type: string;
  title: string;
  value: string;
}

export interface CopilotAttachmentContent {
  title?: string;
  subtitle?: string;
  text?: string;
  images: CopilotAttachmentContentImage[];
  buttons: CopilotAttachmentButtons[];
  media: CopilotAttachmentMedia[];
}
export interface CopilotAttachments {
  contentType: string;
  content: CopilotAttachmentContent;
  html?: string;
}

interface CopilotMessage extends BaseMessage {
  message_type: MessageType.Copilot;
  text?: string;
  timestamp: string;
  suggestedActions?: SuggestedActionsData;
  attachmentLayout?: string;
  attachments?: CopilotAttachments[];
}

export type Message =
  | TextMessage
  | ImageMessage
  | AudioMessage
  | VideoMessage
  | FileMessage
  | LocationMessage
  | CopilotMessage;

// export interface MessageContextType {
//   messages: Message[];
//   sendMessage: (message: Message) => void;
// }
