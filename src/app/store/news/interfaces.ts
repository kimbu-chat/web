import { Page } from '../utils';
import { UserPreview } from '../user/interfaces';

export interface NewsReqData {
  page: Page;
  userId?: number;
  initiatedByScrolling: boolean;
}

export interface NewsList {
  news: Array<NewsItem>;
  hasMore: boolean;
}

export interface NewsItem {
  type: string;
  user: UserPreview;
  text: string;
  commentsCount: number;
  votesCount: number;
  isVoted: boolean;
  id: number;
  content: Content;
}

export interface Photo extends Content {
  thumbnailSmallUrl: string;
  thumbnailMediumUrl: string;
  thumbnailLargeUrl: string;
  originalUrl: string;
  description: string;
}

export interface Post extends Content {
  text: string;
  attachments: Array<Content>; //Inside array can be any inheritors of Content, e.g. Photo or Post
}

export interface Content {
  type?: string;
  originalUrl?: string;
  thumbnailLargeUrl?: string;
  thumbnailMediumUrl?: string;
  thumbnailSmallUrl?: string;
  votesCount?: string;
  commentsCount?: string;
  id?: number;
  isVoted?: boolean;
  userCreator?: UserPreview;
  creationDateTime?: Date;
}
