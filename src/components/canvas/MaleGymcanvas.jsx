import React, { Suspense } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const Model = () => {
    const gltf = useLoader(GLTFLoader, '/models/MaleGym.glb');
    return <primitive object={gltf.scene} scale={[1.5, 1.5, 1.5]} position={[0, -0.5, 0]} />;
};

const MaleGymModel = () => {
    return (
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
            <Canvas
                camera={{ position: [3, 2, 5], fov: 40 }}
                style={{ background: 'transparent' }}
            >
                <ambientLight intensity={2} />
                <directionalLight intensity={1.2} position={[5, 10, 5]} />
                <OrbitControls target={[0, 0.9, 0]} enablePan={false} enableZoom={false} />
                <Suspense fallback={null}>
                    <Model />
                </Suspense>
            </Canvas>
        </div>
    );
};

export default MaleGymModel;