### rn-firebase-image-uploader-hook

- Easily Upload Photos to fire-base with react native firebase library & Expo
- Hooks to return state of Progress, downloadUrl, success, error, uploading

### installation

to install using npm:
`npm i rn-firebase-image-uploader-hook`

to install using yarn
`yarn add rn-firebase-image-uploader-hook`

### Usage

import the package
`import useImageUpload from "rn-firebase-image-uploader-hook"`

### Example

```javascript
const Profile = () => {
  const [
    pickImage,
    selectedImage,
    uploadProgress,
    downloadUrl,
    uploading,
    success,
    error,
    reset,
  ] = useImageUpload();

  return (
    <View>
      <Pressable onPress={pickImage}>
        {user.image || downloadUrl ? (
          <Image
            source={{ uri: user.image || downloadUrl }}
            style={{ width: 100, height: 100 }}
          />
        ) : (
        )}
      </Pressable>

      {uploading && <Text>Uploading... {uploadProgress}/100</Text>}
      {success && <Text>Uploaded successfully</Text>}
      {error && <Text>Upload failed</Text>}
    </View>
  );
};
```

### Common Use

When destructing consts from useImageUpload() hook you get

| return         | Type            | Description                                                               |
| -------------- | --------------- | ------------------------------------------------------------------------- |
| pickImage      | function        | asks for permission to view photos from device, and views Image Picker    |
| selectedImage  | uri             | uri to the selected image                                                 |
| uploadProgress | number (1..100) | Indicates precentage of upload progress                                   |
| downloadUrl    | string          | url of uploaded photo to firebase storage                                 |
| uploading      | Boolean         | if uploading process is in progress                                       |
| success        | Boolean         | if uploading has finished successfully                                    |
| error          | Boolean         | if error has occoured                                                     |
| reset          | method          | resets the state of downloadUrl, selectedImage, uploading, success, error |

###End
