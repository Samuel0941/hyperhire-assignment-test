import { IItem } from "./features/item/item.util";
import { IMenu } from "./features/menu/menu.util";

type tree = { key: string; title: string; children: any[] };

export const buildHierarchicalStructure = (items: IItem[]): tree[] => {
  const itemMap = new Map<string, tree>();
  const rootItems: tree[] = [];

  // Create a map of items for efficient lookup
  items.forEach((item) => {
    itemMap.set(item.id, { key: item.id, title: item.name, children: [] });
  });

  // Assign children to their parents
  items.forEach((item) => {
    if (item.parentId) {
      const parent = itemMap.get(item.parentId);
      if (parent) {
        parent.children.push(itemMap.get(item.id)!);
      }
    } else {
      rootItems.push(itemMap.get(item.id)!);
    }
  });

  return rootItems;
};

export const mergeArrays = (arr1: IItem[], arr2: IItem[]): IItem[] => {
  // Create a Map to store items from arr1 with their IDs
  const arr1Map = new Map(arr1.map((item) => [item.id, item]));

  // Merge items from arr2 into arr1Map, overwriting existing items
  arr2.forEach((item) => {
    arr1Map.set(item.id, item);
  });

  // Convert the Map back to an array
  return Array.from(arr1Map.values());
};

export const generateQueryString = (payload: any) => {
  if (
    payload &&
    typeof payload === "object" &&
    Object.keys(payload).length > 0
  ) {
    return (
      "?" +
      Object.keys(payload)
        .map((key) => `${key}=${payload[key]}`)
        .join("&")
    );
  } else {
    return "";
  }
};
