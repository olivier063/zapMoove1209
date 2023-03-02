import { Alert, Share } from "react-native";
import { captureScreen } from "react-native-view-shot";


class ShareService {


  // paratage des coordonnees gpx..................................
  onShare = async () => {
    try {
      const result = await Share.share({
        message:
          'React Native | A framework for building native apps using React',
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      Alert.alert(error.message);
    }
  };
  //...................................paratage des coordonnees gpx


  //partage de l'ecran à des amis..................................
  onShareScreen = async () => {
    await captureScreen({
      format: "jpg",
      quality: 0.8,
    }).then(
      (uri2) => console.log("Image saved to", uri2),
      (error) => console.error("Oops, snapshot failed", error)
    );
    // try {
    //   const result = await Share.share({
    //     message:
    //       'React Native | A framework for building native apps using React',
    //   });

    //   if (result.action === Share.sharedAction) {
    //     if (result.activityType) {
    //       // shared with activity type of result.activityType
    //     } else {
    //       // shared
    //     }
    //   } else if (result.action === Share.dismissedAction) {
    //     // dismissed
    //   }
    // } catch (error) {
    //   Alert.alert(error.message);
    // }
  };
  //..................................partage de l'ecran à des amis


  

}

const shareService = new ShareService();
export default shareService;