export interface INavLink {
  label: string;
  type: string;
  icon: string;
  routerLink?: string[];
  children?: INavLink[];
  visible?: boolean;
}
