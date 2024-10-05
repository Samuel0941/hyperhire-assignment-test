import { ApiState } from "@/lib/redux.type";
import { IItem } from "../item/item.util";

export interface IMenu {
  id: string;
  name: string;
  items: IItem[];
}

export type MenuStateTypes = {
  createMenu: ApiState<IMenu | null>;
  editMenu: ApiState<IMenu | null>;
  deleteMenu: ApiState<IMenu | null>;
  menus: ApiState<IMenu[]>;
  menu: ApiState<IMenu | undefined>;
};
