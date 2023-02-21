import * as FileSystem from 'expo-file-system';
import mapService from './mapService';


class GpxService {

  createGpxFile = async (positions, fileName) => {
    try {
      const gpx = `<?xml version="1.0" encoding="UTF-8"?>
          <gpx version="1.1" creator="My App">
            <trk>
              <trkseg>
                ${positions.map((p) => `
                  <trkpt lat="${p.latitude}" lon="${p.longitude}"></trkpt>
                `).join('')}
              </trkseg>
            </trk>
          </gpx>`;

      const fileUri = FileSystem.documentDirectory + fileName;

      await FileSystem.createFileAsync(fileUri, { overwrite: true });
      await FileSystem.writeAsStringAsync(fileUri, gpx);
      console.log(`File created at ${fileUri}`);
    } catch (error) {
      console.error(error);
    }
    console.log("GPX", gpx)

  }


  // Il est ensuite possible d'utiliser ce service dans d'autres parties 
  // de votre application en appelant gpxService.createGpxFile(positions, fileName) 
  // pour créer un fichier GPX.


  createGpx = async (positions, timestamp) => {
    let gpxData = '<?xml version="1.0" encoding="UTF-8"?>\n';
    gpxData += '<gpx version="1.1" creator="Expo" xmlns="http://www.topografix.com/GPX/1/1">\n';
    gpxData += '  <trk>\n';
    gpxData += '    <trkseg>\n';
    for (let i = 0; i < positions.length; i++) {
      gpxData += `      <trkpt lat="${positions[i].latitude}" lon="${positions[i].longitude}">\n`;
      gpxData += `        <time>${timestamp[i]}</time>\n`;
      gpxData += '      </trkpt>\n';
    }
    gpxData += '    </trkseg>\n';
    gpxData += '  </trk>\n';
    gpxData += '</gpx>';

    const fileUri = `${FileSystem.documentDirectory}track.gpx`;
    await writeAsStringAsync(fileUri, gpxData);
    console.log("GPX DATA", gpxData)
  }






  // fonction pour convertir les coordonnées en format GPX
  toGPX = (coords) => {
    return coords.map(coord => `<trkpt lat="${coord.latitude}" lon="${coord.longitude}"></trkpt>`).join('');
  }

  // fonction pour créer le contenu du fichier GPX
  createGPXContent = (coords) => {
    const gpxData = `<gpx><trk><trkseg>${toGPX(coords)}</trkseg></trk></gpx>`;
    return gpxData;
  }

  // fonction pour sauvegarder le fichier GPX localement
   saveGPXFile = async (coords) => {
    const fileUri = FileSystem.documentDirectory + 'route.gpx';
    const gpxContent = createGPXContent(coords);

    try {
      await FileSystem.writeAsStringAsync(fileUri, gpxContent, {
        encoding: FileSystem.EncodingType.UTF8,
      });
      console.log('Fichier GPX enregistré avec succès !');
    } catch (error) {
      console.log('Erreur lors de l\'enregistrement du fichier GPX : ', error);
    }
  }

  // exemple de données de route
  routeCoords = [
    { latitude: 48.8566, longitude: 2.3522 },
    { latitude: 51.5072, longitude: -0.1276 },
    { latitude: 41.3851, longitude: 2.1734 },
    { latitude: 40.4168, longitude: -3.7038 },
  ];

  // appel de la fonction pour enregistrer le fichier GPX
  // saveGPXFile(routeCoords)





}


const gpxService = new GpxService();
export default gpxService

