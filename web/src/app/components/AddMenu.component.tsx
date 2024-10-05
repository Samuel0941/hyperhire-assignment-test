"use client";
import { MenuActions } from "@/lib/features/menu/menu.slice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { Button, Form, Input, Modal } from "antd";
import { useEffect, useState } from "react";

const AddMenuComponent = () => {
  const dispatch = useAppDispatch();
  const { createMenu } = useAppSelector((state) => state.menu);

  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (!createMenu.loading && createMenu.successful) {
      form.resetFields();
      dispatch(MenuActions.getMenus({}));

      handleOk();
    }
  }, [createMenu]);

  const handleOk = () => {
    form.resetFields();
    setOpen(false);
  };

  const Submit = (value: any) => {
    dispatch(MenuActions.createMenu(value));
  };

  return (
    <>
      <Button
        className=""
        type="text"
        loading={createMenu.loading}
        onClick={() => setOpen(true)}
      >
        Add Menu
      </Button>

      <Modal
        centered
        open={open}
        onCancel={handleOk}
        footer={[
          <>
            <Button className="btn-outline" htmlType="reset" onClick={handleOk}>
              Cancel
            </Button>
            <Button
              key="submit"
              type="primary"
              htmlType="submit"
              loading={createMenu.loading}
              onClick={() => form.submit()}
            >
              Add
            </Button>
          </>,
        ]}
      >
        <Form layout="vertical" onFinish={Submit} form={form}>
          <Form.Item
            name="name"
            label="Menu Title"
            rules={[{ required: true }]}
          >
            <Input placeholder="input" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AddMenuComponent;
