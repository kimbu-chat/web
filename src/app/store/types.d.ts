import { RootAction } from './root-action';

declare module 'typesafe-actions' {
	interface Types {
		RootAction: RootAction;
	}
}
