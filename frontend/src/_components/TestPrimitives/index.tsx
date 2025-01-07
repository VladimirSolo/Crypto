import { useState, useEffect } from "react";
import { Button, Form, Input, Typography } from "antd";
import { contract, contractWithSigner } from "../../abi/_utils";

const { Title } = Typography;

export function TestPrimitives() {
  const [smallUint, setSmallUint] = useState("");

  const handleSubmit = async () => {
    try {
      await contractWithSigner.setSmallUint(smallUint);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchSmallUint = async () => {
      try {
        const externalSmallUint = await contract.smallUint();
        setSmallUint(externalSmallUint);
      } catch (error) {
        console.log(error);
      }
    };

    fetchSmallUint();
  }, []);

  return (
    <div>
      <Form
        name="smallUint"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        initialValues={{ remember: true }}
        onFinish={handleSubmit}
        autoComplete="off"
      >
        <Form.Item name="smallUint">
          <Title level={3}>Small Uint: {smallUint.toString()}</Title>
          <Input
            min={0}
            max={256}
            onChange={(event) => setSmallUint(event.target.value)}
            value={smallUint}
          />
        </Form.Item>

        <Button type="primary" htmlType="submit">
          Отправить новое значение
        </Button>
      </Form>
    </div>
  );
}
