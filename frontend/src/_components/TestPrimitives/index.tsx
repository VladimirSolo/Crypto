"use client";
import { useState, useEffect } from "react";
import { Button, Form, Input, Typography } from "antd";
import { mainContract } from "@/abi/mainContract";
import { getPrimitivesWithSigner } from "@/abi/getPrimitivesWithSigner";

const { Title } = Typography;

export function TestPrimitives() {
  const [smallUint, setSmallUint] = useState("");
  const [smallUintFromContract, setSmallUintFromContract] = useState("");

  const handleSubmit = async () => {
    try {
      const contractWithSigner = await getPrimitivesWithSigner();
      if (contractWithSigner) {
        await contractWithSigner.setSmallUint(smallUint);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchSmallUint = async () => {
      try {
        const externalSmallUint = await mainContract.smallUint();
        setSmallUintFromContract(externalSmallUint);
      } catch (error) {
        console.log(error);
      }
    };

    fetchSmallUint();
  }, []);

  return (
    <Form
      name="smallUint"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      style={{ maxWidth: 600 }}
      initialValues={{ remember: true }}
      onFinish={handleSubmit}
      autoComplete="off"
    >
      <Title level={3}>Small Uint: {smallUintFromContract.toString()}</Title>
      <Form.Item name="smallUint">
        <Input
          min={0}
          max={2}
          onChange={(event) => setSmallUint(event.target.value)}
        />
      </Form.Item>

      <Button type="primary" htmlType="submit">
        Send
      </Button>
    </Form>
  );
}
