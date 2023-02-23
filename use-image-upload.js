import React, { useState, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";

import storage from "@react-native-firebase/storage";

const useImageUpload = (config) => {
  const settings = {
    refFolder: config?.refFolder || "",
    resize: {
      width: config?.resize.width,
      height: config?.resize.height,
      quality: config?.resize.quality,
      format: config?.resize.format || SaveFormat.JPEG,
      compress: config?.resize.compress,
    },
  };

  const [selectedImage, setSelectedImage] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const reset = () => {
    setSelectedImage(null);
    setDownloadUrl(null);
    setUploadProgress(0);
    setUploading(false);
  };
  useEffect(() => {
    if (selectedImage) {
      const fileName = selectedImage?.uri?.split("/").pop();

      resizeImage(selectedImage?.uri, settings).then((resizedImage) => {
        const uploadTask = storage()
          .ref(`${settings?.refFolder}${fileName}`)
          .putFile(resizedImage?.uri?.toString());
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            setUploading(true);

            setUploadProgress(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
            );
          },
          (error) => {
            setError(error);
            reset();
            console.log("Error uploading image to firebase storage", error);
          },

          () => {
            setSuccess(true);
            reset();
          },
        );

        uploadTask
          .then(async () => {
            setDownloadUrl(await uploadTask.snapshot.ref.getDownloadURL());
            setUploading(false);
            setSelectedImage(null);
            setUploadProgress(0);
            setError(null);
          })
          .catch((error) => {
            setError(error);
            setUploading(false);
          });
      });
    }
  }, [selectedImage]);

  const pickImage = async (resize = false) => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status === "granted") {
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
        });

        if (!result.canceled) {
          setSelectedImage({ uri: result.assets[0].uri, resize });
        }
      } else {
        throw new Error("Permission to access camera roll is required!");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const resizeImage = async (uri) => {
    const uriObject = { uri };
    if (!settings.resize) {
      console.log("no resize", uriObject);
      return uriObject;
    }
    const { width, height, compress, format } = settings.resize;
    const manipResult = await manipulateAsync(
      uri,
      [{ resize: { width, height } }],
      { compress, format },
    );

    console.log("manipResult", manipResult);
    return manipResult;
  };

  return [
    pickImage,
    selectedImage,
    uploadProgress,
    downloadUrl,
    uploading,
    success,
    error,
    reset,
  ];
};

export default useImageUpload;
