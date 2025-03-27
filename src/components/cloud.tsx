import { Environment, Float } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useState } from "react";
import Raindrop from "./raindrop";

type RaindropProps = {
  id: number;
  position: [number, number, number];
  comment: string;
};

export default function Cloud() {
  const [raindrops, setRaindrops] = useState<RaindropProps[]>([]);

  const addRaindrop = () => {
    const comment = prompt("버블에 표시할 코멘트를 입력하세요:");
    if (!comment) return;

    const newPosition: [number, number, number] = [
      (Math.random() - 0.5) * 4,
      3 + Math.random() * 2,
      0,
    ];

    setRaindrops([
      ...raindrops,
      { id: raindrops.length, position: newPosition, comment },
    ]);
  };
  return (
    <div className="w-screen h-screen">
      <button
        onClick={addRaindrop}
        style={{
          position: "fixed",
          top: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          padding: "10px 20px",
          fontSize: "20px",
          cursor: "pointer",
          border: "none",
          background: "#eeeaf3",
          color: "#222222",
          borderRadius: "5px",
          zIndex: 10,
          fontFamily: "jua",
          boxShadow: "1px 1px 2px #888888",
        }}>
        빗속말 남기기 💬
      </button>

      <Canvas camera={{ fov: 75, position: [0, 0, 5] }}>
        {raindrops.map((raindrop) => (
          <Float key={raindrop.id} floatIntensity={1.5} speed={0.5}>
            <Raindrop
              id={raindrop.id}
              position={raindrop.position}
              comment={raindrop.comment}
            />
          </Float>
        ))}

        <Environment preset="dawn" background blur={1} />
      </Canvas>
    </div>
  );
}
