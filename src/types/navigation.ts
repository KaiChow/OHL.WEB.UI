export interface AppMenuItem {
  key: string;
  title: string;
  routeName?: string;
  path?: string;
  children?: AppMenuItem[];
}

export interface AppTabItem {
  key: string;
  title: string;
  routeName: string;
  closable?: boolean;
}
