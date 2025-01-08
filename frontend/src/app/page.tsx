import { Eip1193Provider } from "ethers";
import { TestPrimitives } from "@/_components/TestPrimitives";

declare global {
  interface Window {
    ethereum: Eip1193Provider;
  }
}

export default function Home() {
  return (
    <div className="flex items-center justify-center">
      <TestPrimitives />
    </div>
  );
}
