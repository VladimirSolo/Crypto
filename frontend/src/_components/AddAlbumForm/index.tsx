"use client";
import { AlbumStore } from "@/typechain";
import { Button, Form, FormProps, Input } from "antd";

export type FieldType = Pick<
  AlbumStore.AlbumStructOutput,
  "title" | "price" | "quantity"
>;

type Props = {
  handleSubmit: (values: FieldType) => void;
};

export const AddAlbumForm = () => {
  const handleSubmit = (values: FieldType) => {
    console.log("Success:", values);
  };

  return (
    <Form onFinish={handleSubmit}>
      <Form.Item<FieldType> label="Title" name="title">
        <Input />
      </Form.Item>
      <Form.Item<FieldType> label="Price" name="price">
        <Input />
      </Form.Item>
      <Form.Item<FieldType> label="Quantity" name="quantity">
        <Input />
      </Form.Item>

      <Button htmlType="submit" type="primary">
        Create album
      </Button>
    </Form>
  );
};
