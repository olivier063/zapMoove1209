import Storage from "react-native-storage";
import AsyncStorage from "@react-native-async-storage/async-storage";

const StorageService = new Storage ({
    storageBackend: AsyncStorage,
    enableCache: true,

})


export default StorageService;