"use client";

import { useRef, useState } from "react";
import { Color, MathUtils } from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stats, OrbitControls } from "@react-three/drei";

function convertRange(value, r1, r2) {
    return ((value - r1[0]) * (r2[1] - r2[0])) / (r1[1] - r1[0]) + r2[0];
}

function mixRGB(color1, color2, weight) {
    var w1 = weight;
    var w2 = 1 - w1;
    var rgb = [
        Math.round(color1[0] * w1 + color2[0] * w2),
        Math.round(color1[1] * w1 + color2[1] * w2),
        Math.round(color1[2] * w1 + color2[2] * w2),
    ];
    return rgb;
}

function getPointCoordinates(radius, degrees) {
    // Convert degrees to radians
    var radians = (degrees * Math.PI) / 180;

    // Calculate the x and y coordinates
    var x = radius * Math.cos(radians);
    var y = radius * Math.sin(radians);

    // Round the coordinates to three decimal places
    x = Number(x.toFixed(3));
    y = Number(y.toFixed(3));

    return { x: x, y: y };
}

function Box(props) {
    // This reference will give us direct access to the mesh
    const mesh = useRef();

    // Set up state for the hovered and active state
    const [hovered, setHover] = useState(false);
    const [active, setActive] = useState(false);

    const { color, ...meshProps } = props;

    // Subscribe this component to the render-loop, rotate the mesh every frame
    useFrame((state, delta) => {
        mesh.current.rotation.x += delta * 0.25;
        mesh.current.rotation.y += delta * 0.5;
        mesh.current.rotation.z += delta * 1;
    });

    // Return view, these are regular three.js elements expressed in JSX
    return (
        <mesh
            {...meshProps}
            ref={mesh}
            scale={active ? 1.5 : 1}
            onClick={(event) => setActive(!active)}
            onPointerOver={(event) => setHover(true)}
            onPointerOut={(event) => setHover(false)}>
            <boxGeometry args={[0.005, 1, 0.5]} />
            <meshStandardMaterial color={hovered ? color : color} />
        </mesh>
    );
}

async function getData() {
    const res = await fetch(
        // "https://api.phish.net/v5/shows/artist/phish.json?order_by=showdate&apikey=EAF2237D09D475C42DC4",
        "https://api.phish.net/v5/shows/artistid/2.json?order_by=showdate&apikey=EAF2237D09D475C42DC4",
        { next: { revalidate: 60 } }
    );

    if (!res.ok) {
        throw new Error("Failed to fetch data");
    }

    return res.json();
}

export default async function Three() {
    const data = await getData();
    const shows = data.data ?? [];

    return (
        <Canvas>
            <ambientLight intensity={0.1} />
            <directionalLight color="white" position={[0, 0, 10]} />

            {shows.map((show, i) => {
                const radius = 3;
                const degrees = (360 / shows.length) * i + 90;
                const radians = MathUtils.degToRad(degrees);
                const { x, y } = getPointCoordinates(radius, degrees);
                const rgb = mixRGB([255, 0, 132], [3, 94, 252], convertRange(i, [0, shows.length], [0, 1]));
                const color = new Color(`rgb(${rgb.join(", ")})`);

                return <Box key={i} color={color} position={[x, y, 0]} rotation={[0, 0, radians + Math.PI / 2]} />;
            })}

            <OrbitControls />
            <Stats />
        </Canvas>
    );
}
