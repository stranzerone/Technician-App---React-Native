import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Alert } from 'react-native';

const handleDownload = async () => {
  try {
    // Your AWS S3 PDF link
    const pdfUrl = 'https://ismdoc.s3.amazonaws.com/public/application/pdf/2/6710fbb717e3f_xJwb82AaFhOfYLhdS5NN2024101717_random';
    
    // Define the local path where you want to save the file
    const fileUri = FileSystem.documentDirectory + 'downloadedFile.pdf';

    // Download the file from AWS S3
    const downloadResumable = FileSystem.createDownloadResumable(
      pdfUrl,
      fileUri
    );

    // Execute the download
    const { uri, headers } = await downloadResumable.downloadAsync();

    // Check if the file was downloaded successfully
    const fileExists = await FileSystem.getInfoAsync(uri);
    if (fileExists.exists) {
      // Ensure the downloaded file is recognized as a PDF
      const contentType = headers['content-type'];
      if (contentType === 'application/pdf') {
        // Use the Sharing API to share the downloaded PDF file
        await Sharing.shareAsync(uri);
        Alert.alert('Download complete', 'PDF has been downloaded and shared.');
      } else {
        Alert.alert('Error', 'The downloaded file is not a PDF.');
      }
    } else {
      Alert.alert('Error', 'The downloaded file does not exist.');
    }
  } catch (error) {
    console.error(error);
    Alert.alert('Download failed', 'Unable to download the PDF. Please try again later.');
  }
};

export default handleDownload;
