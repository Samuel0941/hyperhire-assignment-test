"use client";

import Image from "next/image";

import { ItemActions } from "@/lib/features/item/item.slice";
import { IItem } from "@/lib/features/item/item.util";
import { MenuActions } from "@/lib/features/menu/menu.slice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { buildHierarchicalStructure } from "@/lib/util";
import { DeleteOutlined, DownOutlined } from "@ant-design/icons";
import { Button, Form, Input, Popconfirm, Select, Spin, Tree } from "antd";
import { useForm } from "antd/es/form/Form";
import { useEffect, useState } from "react";
import AddMenuComponent from "./AddMenu.component";

const { TreeNode } = Tree;

const MenuComponent = () => {
  const [form] = useForm();

  const dispatch = useAppDispatch();
  const { menus, menu } = useAppSelector((state) => state.menu);
  const { createItem, editItem, items, cachedTreeItems } = useAppSelector(
    (state) => state.item
  );

  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [selectedItem, setSelectedItem] = useState<null | IItem>(null);

  const [expandAll, setExpandAll] = useState(false);

  useEffect(() => {
    dispatch(MenuActions.getMenus({}));
  }, [dispatch]);

  useEffect(() => {
    if (!menu.loading && menu.successful && menu.payload) {
      dispatch(ItemActions.updateCachedTreeItems(menu.payload.items));
    }
  }, [menu, dispatch]);

  useEffect(() => {
    if (!items.loading && items.successful && items.payload) {
      dispatch(ItemActions.updateCachedTreeItems(items.payload));

      if (expandAll) {
        setExpandedKeys(cachedTreeItems.map((e) => e.id));
        setExpandAll(false);
      }
    }
  }, [items, dispatch]);

  const fetchNextLevelItems = (parentId: string) => {
    let item: any = null;
    const childrenIds: string[] = [];
    const excludeIds: string[] = [];

    cachedTreeItems.forEach((e) => {
      if (e.parentId === parentId) childrenIds.push(e.id);

      if (e.id === parentId) item = e;

      excludeIds.push(e.id);
    });

    dispatch(
      ItemActions.getItems({
        parentIds: childrenIds,
        depth: item?.depth ?? 0,
        excludeIds,
        menuId: menu?.payload?.id,
      })
    );
  };

  const onMenuSelect = (menuId: string) => {
    setSelectedKeys([]);
    setSelectedItem(null);
    dispatch(ItemActions.resetCachedTreeItems());

    dispatch(MenuActions.getMenu(menuId));
  };

  const onTreeSelect = (keys: any, info: any) => {
    console.log(info);
    setSelectedKeys(keys);

    if (keys.length == 0) {
      setSelectedItem(null);
    } else {
      const item = cachedTreeItems.find((e) => e.id === info.node.key);

      if (item) {
        fetchNextLevelItems(info.node.key);

        setSelectedItem(item);

        form.setFieldsValue({
          ...item,
        });
      }
    }
  };

  const onTreeExpand = (keys: any, info: any) => {
    if (info.expanded) {
      fetchNextLevelItems(info.node.key);
    }

    setExpandedKeys(keys);
  };

  const onAddItem = (itemId: string) => {
    const item = cachedTreeItems.find((e) => e.id === itemId);

    if (item) {
      const newItem: any = {
        id: null,
        name: null,
        parentId: item.id,
        menuId: item.menuId,
        depth: item.depth + 1,
        parent: item.name,
      };
      setSelectedItem(newItem);
      form.setFieldsValue({ ...newItem });
    }
  };

  const renderTreeNodes = (
    data: {
      key: string;
      title: string;
      children: any;
    }[]
  ) => {
    return data.map((item) => {
      const isSelected = selectedKeys.includes(item.key);

      return (
        <TreeNode
          key={item.key}
          title={
            <div className="flex">
              {item.title}
              {isSelected && (
                <Image
                  className="ml-4"
                  src="/add_item_icon.svg"
                  alt="My SVG Image"
                  width={24}
                  height={24}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    onAddItem(item.key);
                  }}
                />
              )}
            </div>
          }
        >
          {item.children && renderTreeNodes(item.children)}
        </TreeNode>
      );
    });
  };

  const onSubmit = (values: any) => {
    if (selectedItem) {
      if (selectedItem.id) {
        dispatch(
          ItemActions.editItem({
            payload: {
              name: values.name,
            },
            id: selectedItem.id,
          })
        );
      } else {
        dispatch(
          ItemActions.createItem({
            name: values.name,
            depth: selectedItem.depth,
            menuId: selectedItem.menuId,
            parentId: selectedItem.parentId,
          })
        );
      }
    }
  };

  const onExpandAll = () => {
    setExpandAll(true);
    dispatch(
      ItemActions.getItems({
        menuId: menu.payload?.id,
        excludeIds: cachedTreeItems.map((e) => e.id),
      })
    );
  };

  const onDelete = () => {
    dispatch(ItemActions.deleteItem(selectedItem?.id));
  };

  return (
    <div className="flex-grow h-screen flex flex-col p-[24px]">
      <div className="h-[74px] flex items-center space-x-2">
        <Image
          src="/folder_icon.svg"
          alt="My SVG Image"
          width={24}
          height={24}
        />

        <span>/</span>

        <span className="text-black">Menus</span>
      </div>

      <div className="h-[84px] flex items-center space-x-2">
        <Image src="/menu_icon.svg" alt="My SVG Image" width={52} height={52} />

        <h3 className="text-black font-bold text-xl">Menus</h3>

        <AddMenuComponent />
      </div>

      <Select
        className="w-[349px] mb-3"
        placeholder="select menu"
        loading={menus.loading || menu.loading}
        options={menus.payload.map((e) => ({ label: e.name, value: e.id }))}
        onSelect={onMenuSelect}
      />

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col space-y-5">
          <div className="flex flex-row space-x-2">
            <button
              className="bg-[#101828] text-white text-xs h-[30px] w-[110px] rounded-[35px]"
              onClick={onExpandAll}
            >
              Expand All
            </button>
            <button
              className="text-[#101828] text-xs h-[30px] w-[110px] rounded-[35px] border border-gray-200 "
              onClick={() => setExpandedKeys([])}
            >
              Collapse All
            </button>
          </div>

          <div className="">
            {menu.loading ? (
              <Spin />
            ) : (
              <Tree
                showLine
                switcherIcon={<DownOutlined />}
                expandedKeys={expandedKeys}
                selectedKeys={selectedKeys}
                onSelect={onTreeSelect}
                onExpand={onTreeExpand}
              >
                {renderTreeNodes(buildHierarchicalStructure(cachedTreeItems))}
              </Tree>
            )}
          </div>
        </div>

        {/* FORM */}
        {selectedItem && (
          <div className="item w-[432px]">
            {selectedItem.id ? (
              <div className="flex justify-between">
                <h1 className="text-gray-500 font-bold text-md">Edit Item</h1>

                <Popconfirm
                  placement="leftTop"
                  title="Are you sure you want to remove this Item?"
                  onConfirm={onDelete}
                  okText="Yes"
                  cancelText="No"
                >
                  <DeleteOutlined className="text-red-400" />
                </Popconfirm>
              </div>
            ) : (
              <h1 className="text-gray-500 font-bold text-md">Add Item</h1>
            )}

            <Form form={form} layout="vertical" onFinish={onSubmit}>
              <Form.Item name="id" label="Menu ID">
                <Input readOnly />
              </Form.Item>

              <Form.Item name="depth" label="Depth">
                <Input readOnly />
              </Form.Item>

              <Form.Item name="parent" label="Parent Data">
                <Input />
              </Form.Item>

              <Form.Item name="name" label="Name" rules={[{ required: true }]}>
                <Input />
              </Form.Item>

              <Button
                className="w-[200px] h-[42px] rounded-[40px]"
                onClick={() => form.submit()}
                type="primary"
                loading={createItem.loading || editItem.loading}
              >
                Save
              </Button>
            </Form>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuComponent;
