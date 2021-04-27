import React, { useRef, useState, useEffect } from "react";
import {
  Vector3,
  HemisphericLight,
  MeshBuilder,
  ArcRotateCamera,
  StandardMaterial,
  Texture,
  Vector4,
  SpotLight,
} from "@babylonjs/core";
import SceneComponent from "./scene";
import ReactMapGL, { StaticMap } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const TOKEN = process.env.REACT_APP_MAPBOX_API_KEY;
console.log(process.env);

const MapContainer = (props) => {
  const ref = useRef(null);

  const [showCube, setshowCube] = useState(false);
  const [viewport, setViewPort] = useState({
    width: "50vw",
    height: "50vh",
    latitude: 37.7577,
    longitude: -122.4376,
    zoom: 8,
  });

  const [image, setimage] = useState(null);

  const [mat, setmat] = useState(null);

  let box;

  const onSceneReady = (scene) => {
    const canvas = scene.getEngine().getRenderingCanvas();
    const camera = new ArcRotateCamera(
      "Camera",
      -Math.PI / 2,
      Math.PI / 3,
      4,
      Vector3.Zero()
    );
    camera.attachControl(canvas, true);

    const light = new HemisphericLight("light", new Vector3(1, 1, 0));
    const mat = new StandardMaterial("mat");
    let texture = new Texture("");
    if (image) {
      texture = new Texture(image);
    }

    console.log(texture);
    setmat(mat);
    mat.diffuseTexture = texture;
    var columns = 6;
    var rows = 1;
    const faceUV = new Array(6);
    for (let i = 0; i < 6; i++) {
      faceUV[i] = new Vector4(i / columns, 0, (i + 1) / columns, 1 / rows);
    }

    const options = {
      faceUV: faceUV,
      wrap: true,
    };

    const box = MeshBuilder.CreateBox("box", options);
    box.material = mat;
  };

  const setView = (props) => {
    setViewPort(props);
    setimage(ref.current.getMap()._canvas.toDataURL());
  };

  const mapImage = () => {
    mat.diffuseTexture = new Texture(image);
    setshowCube(true);
  };

  const mapLoaded = () => {
    setimage(ref.current.getMap()._canvas.toDataURL());
  };

  const sceneLoaded = () => {
    setshowCube(true);
  };

  return (
    <div style={{ display: "block", position: "relative" }}>
      <h4 style={{ display: "flex", justifyContent: "center" }}>Map Box</h4>
      <div className="map">
        <ReactMapGL
          mapboxApiAccessToken={TOKEN}
          {...viewport}
          onViewportChange={(v) => setView(v)}
          ref={ref}
          onLoad={mapLoaded}
        />
      </div>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <button className="capture" onClick={mapImage}>
          Capture Map
        </button>
      </div>

      <div>
        {image && (
          <SceneComponent
            style={{
              margin: "5% 10%",
              height: "50vh",
              width: "80%",
              position: "",
            }}
            antialias
            onSceneReady={onSceneReady}
            id="my-canvas"
            onLoad={sceneLoaded}
          />
        )}
      </div>
    </div>
  );
};

export default MapContainer;
