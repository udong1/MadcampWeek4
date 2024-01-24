// BunBottom.ts
import { useEffect, useState } from 'react';
import * as Three from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export const CreateBunBottom = (
  shouldCreate: boolean,
  scene: Three.Scene,
  group: Three.Group
) => {
  const [createBunBottom, setCreateBunBottom] = useState(false);

  useEffect(() => {
    if (!shouldCreate) {
      return;
    }
    setCreateBunBottom(true);
    const loader = new GLTFLoader();
    loader.load(`./stylized_burger/bun_bottom.glb`, (gltf) => {
      const temp = gltf.scene;
      console.log("BunBottom 함수 동작");
      temp.traverse(function (node) {
        if (node instanceof Three.Mesh) {
          node.castShadow = true;
          node.receiveShadow = true;
        }
      });
      group.add(temp);
      scene.add(group);
    });
  }, [shouldCreate, scene, group]);

  return CreateBunBottom;
};
